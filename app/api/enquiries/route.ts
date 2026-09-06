import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { EnquiryInputSchema } from '@/lib/validators';
import { checkDistributedRateLimit } from '@/lib/rate-limit';
import { generateNextEnquiryNumber } from '@/lib/sequences';
import { handleApiError, ApiError } from '@/lib/api-errors';

export async function POST(request: Request) {
  try {
    // 1. Production Distributed Rate Limiting (5 enquiries / minute / IP)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'local';
    const rateLimit = await checkDistributedRateLimit(`enquiry:${ip}`, 5, 60);

    if (!rateLimit.success) {
      return handleApiError(new ApiError(429, 'RATE_LIMITED'));
    }

    const body = await request.json();

    // 2. Strict Server-Side Zod Schema Validation
    const validated = EnquiryInputSchema.parse(body);

    const trimmedPhone = validated.phone;
    const trimmedMessage = validated.message;

    // 3. Duplicate submission prevention (identical phone & message within 30 seconds)
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    const existingRecent = await prisma.enquiry.findFirst({
      where: {
        phone: trimmedPhone,
        message: trimmedMessage,
        createdAt: { gte: thirtySecondsAgo },
      },
    });

    if (existingRecent) {
      return NextResponse.json({
        success: true,
        enquiry: existingRecent,
        message: 'Existing enquiry retrieved.',
      });
    }

    const currentUser = await getCurrentUser();

    // 4. Multi-step atomic database transaction with collision-safe sequence numbering
    const newEnquiry = await prisma.$transaction(async (tx) => {
      const enquiryNumber = await generateNextEnquiryNumber(tx);

      const created = await tx.enquiry.create({
        data: {
          enquiryNumber,
          customerId: currentUser?.userId || null,
          productId: validated.productId || null,
          name: validated.name,
          phone: trimmedPhone,
          whatsapp: validated.whatsapp || trimmedPhone,
          email: validated.email || null,
          city: validated.city || null,
          application: validated.application || null,
          preferredColour: validated.preferredColour || null,
          quantity: validated.quantity || null,
          approxAreaSqft: validated.approxAreaSqft || null,
          budget: validated.budget || null,
          message: trimmedMessage,
          source: validated.source || 'WEBSITE',
          status: 'NEW',
        },
        include: {
          product: {
            select: {
              name: true,
              productCode: true,
            },
          },
        },
      });

      // Log initial EnquiryActivity
      await tx.enquiryActivity.create({
        data: {
          enquiryId: created.id,
          action: 'LEAD_CAPTURED',
          note: `Enquiry generated via source: ${validated.source || 'WEBSITE'}.`,
        },
      });

      return created;
    });

    return NextResponse.json({ success: true, enquiry: newEnquiry });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return handleApiError(new ApiError(401, 'UNAUTHORIZED'));
    }

    // IDOR Protection: Customers strictly see only their own enquiries
    const whereClause: any = {};
    if (user.role === 'CUSTOMER') {
      whereClause.customerId = user.userId;
    }

    const enquiries = await prisma.enquiry.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            name: true,
            productCode: true,
            material: true,
            format: true,
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json({ enquiries });
  } catch (error: any) {
    return handleApiError(error);
  }
}
