import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';
import { getSiteSettings, ContactNumber, ContactEmail } from '@/lib/site-settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAuth(['ADMIN', 'STAFF']);
    const settings = await getSiteSettings();
    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth(['ADMIN']);
    const body = await request.json();

    const {
      contactNumbers,
      contactEmails,
      address,
      mapsUrl,
      companyName,
      brandName,
    } = body;

    // Validation
    if (!Array.isArray(contactNumbers) || contactNumbers.length === 0) {
      return NextResponse.json(
        { error: 'At least one contact number is required.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(contactEmails) || contactEmails.length === 0) {
      return NextResponse.json(
        { error: 'At least one email address is required.' },
        { status: 400 }
      );
    }

    // Clean and validate contact numbers
    const validatedNumbers: ContactNumber[] = contactNumbers.map((c: any, index: number) => ({
      id: c.id || `phone-${Date.now()}-${index}`,
      phone: String(c.phone || '').trim(),
      label: String(c.label || 'Contact').trim(),
      isPrimary: Boolean(c.isPrimary),
      isWhatsApp: Boolean(c.isWhatsApp),
    })).filter((c: ContactNumber) => c.phone.length > 0);

    if (validatedNumbers.length === 0) {
      return NextResponse.json(
        { error: 'Please provide valid non-empty contact numbers.' },
        { status: 400 }
      );
    }

    // Ensure at least one primary and one whatsapp
    if (!validatedNumbers.some((c) => c.isPrimary)) {
      validatedNumbers[0].isPrimary = true;
    }
    if (!validatedNumbers.some((c) => c.isWhatsApp)) {
      validatedNumbers[0].isWhatsApp = true;
    }

    // Clean and validate contact emails
    const validatedEmails: ContactEmail[] = contactEmails.map((e: any, index: number) => ({
      id: e.id || `email-${Date.now()}-${index}`,
      email: String(e.email || '').trim(),
      label: String(e.label || 'Enquiries').trim(),
      isPrimary: Boolean(e.isPrimary),
    })).filter((e: ContactEmail) => e.email.includes('@'));

    if (validatedEmails.length === 0) {
      return NextResponse.json(
        { error: 'Please provide valid non-empty email addresses.' },
        { status: 400 }
      );
    }

    if (!validatedEmails.some((e) => e.isPrimary)) {
      validatedEmails[0].isPrimary = true;
    }

    const updates = [
      {
        key: 'CONTACT_NUMBERS',
        value: JSON.stringify(validatedNumbers),
        description: 'Dynamic showroom & staff contact numbers',
      },
      {
        key: 'CONTACT_EMAILS',
        value: JSON.stringify(validatedEmails),
        description: 'Dynamic showroom & staff email addresses',
      },
    ];

    if (address && typeof address === 'string') {
      updates.push({
        key: 'SHOWROOM_ADDRESS',
        value: address.trim(),
        description: 'Official showroom and stockyard address',
      });
    }

    if (mapsUrl && typeof mapsUrl === 'string') {
      updates.push({
        key: 'MAPS_URL',
        value: mapsUrl.trim(),
        description: 'Google Maps directions link',
      });
    }

    if (companyName && typeof companyName === 'string') {
      updates.push({
        key: 'COMPANY_NAME',
        value: companyName.trim(),
        description: 'Full legal company name',
      });
    }

    if (brandName && typeof brandName === 'string') {
      updates.push({
        key: 'BRAND_NAME',
        value: brandName.trim(),
        description: 'Short brand name',
      });
    }

    // Upsert into SiteSetting
    for (const item of updates) {
      await prisma.siteSetting.upsert({
        where: { key: item.key },
        update: {
          value: item.value,
          description: item.description,
        },
        create: {
          key: item.key,
          value: item.value,
          description: item.description,
        },
      });
    }

    // Record in AuditLog
    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        userRole: user.role,
        action: 'SITE_SETTINGS_UPDATE',
        entityType: 'SITE_SETTING',
        details: JSON.stringify({
          updatedBy: user.email,
          contactNumbersCount: validatedNumbers.length,
          contactEmailsCount: validatedEmails.length,
          updatedAt: new Date().toISOString(),
        }),
      },
    });

    const updatedSettings = await getSiteSettings();

    return NextResponse.json({
      success: true,
      message: 'Site settings and contact numbers updated successfully.',
      settings: updatedSettings,
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
