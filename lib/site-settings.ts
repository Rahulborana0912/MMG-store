import prisma from '@/lib/prisma';

export interface ContactNumber {
  id: string;
  phone: string;
  label: string;
  isPrimary: boolean;
  isWhatsApp: boolean;
}

export interface ContactEmail {
  id: string;
  email: string;
  label: string;
  isPrimary: boolean;
}

export interface SiteSettingsData {
  companyName: string;
  brandName: string;
  address: string;
  mapsUrl: string;
  contactNumbers: ContactNumber[];
  contactEmails: ContactEmail[];
}

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  companyName: 'Mahadev Marble and Granite Pvt. Ltd.',
  brandName: 'MMG',
  address: 'Mahadev Marble and Granite, Raghunathpura, Kelwa',
  mapsUrl: 'https://maps.app.goo.gl/Z4vojjCLAfeXNVvTA',
  contactNumbers: [
    {
      id: 'default-phone-1',
      phone: '+91 98873 90222',
      label: 'Rahul Borana (Direct / Owner)',
      isPrimary: true,
      isWhatsApp: true,
    },
  ],
  contactEmails: [
    {
      id: 'default-email-1',
      email: 'rahulborana1306@gmail.com',
      label: 'Official Enquiries & Sales',
      isPrimary: true,
    },
  ],
};

/**
 * Fetch all site settings from PostgreSQL SiteSetting table
 * with fallback to DEFAULT_SITE_SETTINGS.
 */
export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: [
            'COMPANY_NAME',
            'BRAND_NAME',
            'SHOWROOM_ADDRESS',
            'MAPS_URL',
            'CONTACT_NUMBERS',
            'CONTACT_EMAILS',
          ],
        },
      },
    });

    const settingsMap = new Map<string, string>();
    for (const s of settings) {
      settingsMap.set(s.key, s.value);
    }

    let contactNumbers: ContactNumber[] = DEFAULT_SITE_SETTINGS.contactNumbers;
    if (settingsMap.has('CONTACT_NUMBERS')) {
      try {
        const parsed = JSON.parse(settingsMap.get('CONTACT_NUMBERS')!);
        if (Array.isArray(parsed) && parsed.length > 0) {
          contactNumbers = parsed;
        }
      } catch {
        // use default
      }
    }

    let contactEmails: ContactEmail[] = DEFAULT_SITE_SETTINGS.contactEmails;
    if (settingsMap.has('CONTACT_EMAILS')) {
      try {
        const parsed = JSON.parse(settingsMap.get('CONTACT_EMAILS')!);
        if (Array.isArray(parsed) && parsed.length > 0) {
          contactEmails = parsed;
        }
      } catch {
        // use default
      }
    }

    return {
      companyName: settingsMap.get('COMPANY_NAME') || DEFAULT_SITE_SETTINGS.companyName,
      brandName: settingsMap.get('BRAND_NAME') || DEFAULT_SITE_SETTINGS.brandName,
      address: settingsMap.get('SHOWROOM_ADDRESS') || DEFAULT_SITE_SETTINGS.address,
      mapsUrl: settingsMap.get('MAPS_URL') || DEFAULT_SITE_SETTINGS.mapsUrl,
      contactNumbers,
      contactEmails,
    };
  } catch (err) {
    console.error('Error fetching site settings from DB, using defaults:', err);
    return DEFAULT_SITE_SETTINGS;
  }
}
