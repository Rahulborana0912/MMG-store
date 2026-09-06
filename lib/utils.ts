import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format Indian currency: ₹250 / sq.ft. or ₹1,50,000
 */
export function formatINR(amount: number, options?: { showUnit?: boolean; unit?: string; startingFrom?: boolean }) {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);

  const prefix = options?.startingFrom ? 'Starting from ₹' : '₹';
  const unit = options?.showUnit ? ` / ${options.unit || 'sq.ft.'}` : '';

  return `${prefix}${formatted}${unit}`;
}

/**
 * Build pre-filled WhatsApp link with professional Indian stone enquiry message
 */
export function getWhatsAppEnquiryUrl(productName?: string, productCode?: string, customMessage?: string) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || '919829012345';
  
  if (customMessage) {
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(customMessage)}`;
  }

  let message = 'Hello MMG (Mahadev Marble and Granite), I would like to enquire about natural stone options for my project.';

  if (productName && productCode) {
    message = `Hello MMG, I am interested in ${productName} (${productCode}). Please share the latest price and slab availability.`;
  } else if (productName) {
    message = `Hello MMG, I am interested in ${productName}. Please share the current price and availability.`;
  }

  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
}

/**
 * Indian Date Formatter (DD/MM/YYYY or DD MMM YYYY)
 */
export function formatIndianDate(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

/**
 * Normalizes stone image URLs.
 * Automatically converts Google Drive share links into direct, high-speed CDN image URLs.
 * e.g. https://drive.google.com/file/d/FILE_ID/view?usp=sharing -> https://lh3.googleusercontent.com/d/FILE_ID
 */
export function formatImageUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // If already a direct Google usercontent URL
  if (trimmed.includes('googleusercontent.com/d/')) {
    return trimmed;
  }

  // Google Drive: /file/d/{FILE_ID}
  const fileIdMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
  }

  // Google Drive: ?id={FILE_ID} or &id={FILE_ID}
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  return trimmed;
}

