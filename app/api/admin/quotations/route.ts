import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';
import { generateNextQuotationNumber } from '@/lib/sequences';

export async function GET() {
  try {
    await requireAuth(['ADMIN', 'STAFF']);

    const quotations = await prisma.quotation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        enquiry: {
          select: {
            enquiryNumber: true,
          },
        },
      },
    });

    return NextResponse.json({ quotations });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth(['ADMIN', 'STAFF']);
    const body = await request.json();

    const {
      enquiryId,
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      items,
      discount = 0,
      additionalCharges = 0,
      taxLabel = 'GST',
      gstRate,
      notes,
      termsAndConditions,
    } = body;

    if (!customerName || !customerPhone || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Customer name, phone, and at least one line item are required.' },
        { status: 400 }
      );
    }

    // Retrieve default tax rate from SiteSetting if not specified
    let defaultTaxRate = 18.0;
    try {
      const setting = await prisma.siteSetting.findUnique({
        where: { key: 'DEFAULT_GST_RATE' },
      });
      if (setting && !isNaN(Number(setting.value))) {
        defaultTaxRate = Number(setting.value);
      }
    } catch {
      // Default to 18.0 if setting query fails
    }

    // Configurable GST rate: support 0%, 5%, 12%, 18%, 28%
    const parsedGstRate = (gstRate !== undefined && gstRate !== null && !isNaN(Number(gstRate)))
      ? Math.max(0, Number(gstRate))
      : defaultTaxRate;

    // Recalculate line items strictly server-side (preventing client manipulation)
    const processedItems = items.map((it: any) => {
      const qty = Math.max(0, parseFloat(it.quantitySqft) || 0);
      const rate = Math.max(0, parseFloat(it.ratePerSqft) || 0);
      const amount = Math.round(qty * rate * 100) / 100;
      return {
        productId: it.productId || null,
        slabId: it.slabId || null,
        description: (it.description || 'Natural Stone Slabs').trim(),
        format: (it.format === 'TILE' ? 'TILE' : 'SLAB') as any,
        quantitySqft: Math.round(qty * 100) / 100,
        ratePerSqft: Math.round(rate * 100) / 100,
        amount,
      };
    });

    // Precision mathematical calculation
    const subtotal = Math.round(processedItems.reduce((sum: number, it: any) => sum + it.amount, 0) * 100) / 100;
    const disc = Math.max(0, Math.round((parseFloat(discount) || 0) * 100) / 100);
    const addl = Math.max(0, Math.round((parseFloat(additionalCharges) || 0) * 100) / 100);
    
    // Taxable base clamped so excessive discounts never result in negative base
    const taxable = Math.max(0, Math.round((subtotal - disc + addl) * 100) / 100);
    const gstAmount = Math.round(((taxable * parsedGstRate) / 100) * 100) / 100;
    const grandTotal = Math.round((taxable + gstAmount) * 100) / 100;

    // Execute in an atomic database transaction
    const result = await prisma.$transaction(async (tx) => {
      const quotationNumber = await generateNextQuotationNumber(tx);

      const quotation = await tx.quotation.create({
        data: {
          quotationNumber,
          enquiryId: enquiryId || null,
          customerId: customerId || null,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail?.trim() || null,
          customerAddress: customerAddress?.trim() || null,
          subtotal,
          discount: disc,
          additionalCharges: addl,
          taxLabel: (taxLabel || 'GST').trim(),
          gstRate: parsedGstRate,
          gstAmount,
          total: grandTotal,
          status: 'SENT',
          validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days validity
          notes: notes || 'Commercial Quotation from Mahadev Marble and Granite Pvt. Ltd. Rate includes wooden crated packing and loading at Raghunathpura, Kelwa stockyard.',
          termsAndConditions: termsAndConditions || '1. 50% advance along with confirmed order, balance prior to dispatch.\n2. Natural stone variation in shade and veining is inherent to natural earth quarry products.\n3. Inspection welcome at Raghunathpura, Kelwa yard prior to transit.\n4. Subject to Rajsamand/Udaipur jurisdiction.',
          items: {
            create: processedItems,
          },
        },
        include: { items: true },
      });

      // Update linked enquiry status & activity log
      if (enquiryId) {
        await tx.enquiry.update({
          where: { id: enquiryId },
          data: { status: 'QUOTED' },
        });

        await tx.enquiryActivity.create({
          data: {
            enquiryId,
            staffId: user.userId,
            staffName: user.name,
            action: 'QUOTATION_CREATED',
            note: `Commercial Quotation ${quotationNumber} issued for ${customerName} (Total: ₹${grandTotal}).`,
          },
        });
      }

      // Log action in AuditLog
      await tx.auditLog.create({
        data: {
          userId: user.userId,
          userRole: user.role,
          action: 'QUOTATION_ISSUED',
          entityType: 'QUOTATION',
          entityId: quotation.id,
          details: JSON.stringify({
            quotationNumber,
            total: grandTotal,
            subtotal,
            taxable,
            gstAmount,
            gstRate: parsedGstRate,
            itemCount: processedItems.length,
          }),
        },
      });

      return quotation;
    });

    return NextResponse.json({ success: true, quotation: result });
  } catch (error: any) {
    return handleApiError(error);
  }
}
