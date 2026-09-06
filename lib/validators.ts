import { z } from 'zod';

/**
 * MMG Robust Server-Side Input Validators (Zod Schema)
 * 
 * Strict boundary checks:
 * - name: 2–80 characters, trimmed
 * - phone: Normalized Indian or international phone format (10–15 digits)
 * - whatsapp: optional phone format
 * - email: optional RFC-compliant email
 * - approxAreaSqft: >= 0, <= 1,000,000 sq.ft.
 * - budget: >= 0
 * - message: max 2000 chars, supports Hindi, Unicode, emojis
 * 
 * Primary defense against malformed data, buffer abuse, and malicious scripts.
 */

// Phone number regex: accepts standard Indian 10-digit mobile (+91 / 0) and international E.164 formats
const PHONE_REGEX = /^(?:\+?\d{1,4}[\s-]?)?(?:0?[6-9]\d{9}|[0-9]{10,15})$/;

export const EnquiryInputSchema = z.object({
  productId: z.string().trim().optional().nullable(),
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters.')
    .max(80, 'Name cannot exceed 80 characters.'),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required.')
    .refine((val) => {
      // Strip formatting spaces and hyphens before length check
      const digits = val.replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 15 && PHONE_REGEX.test(val);
    }, {
      message: 'Please provide a valid 10 to 15 digit mobile number.',
    }),
  whatsapp: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine((val) => {
      if (!val || val === '') return true;
      const digits = val.replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 15 && PHONE_REGEX.test(val);
    }, {
      message: 'Please provide a valid WhatsApp number (10 to 15 digits).',
    }),
  email: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine((val) => {
      if (!val || val === '') return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }, {
      message: 'Please enter a valid email address.',
    }),
  city: z
    .string()
    .trim()
    .max(100, 'City name cannot exceed 100 characters.')
    .optional()
    .nullable(),
  application: z
    .string()
    .trim()
    .max(100, 'Application cannot exceed 100 characters.')
    .optional()
    .nullable(),
  preferredColour: z
    .string()
    .trim()
    .max(50, 'Colour cannot exceed 50 characters.')
    .optional()
    .nullable(),
  quantity: z
    .string()
    .trim()
    .max(100, 'Quantity cannot exceed 100 characters.')
    .optional()
    .nullable(),
  approxAreaSqft: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return null;
      const num = typeof val === 'number' ? val : parseFloat(val);
      return isNaN(num) ? null : num;
    })
    .refine((val) => val === null || (val >= 0 && val <= 1000000), {
      message: 'Approximate area must be between 0 and 1,000,000 sq.ft.',
    }),
  budget: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return null;
      const num = typeof val === 'number' ? val : parseFloat(val);
      return isNaN(num) ? null : num;
    })
    .refine((val) => val === null || (val >= 0 && val <= 1000000000), {
      message: 'Budget must be a non-negative value.',
    }),
  message: z
    .string()
    .trim()
    .max(2000, 'Message cannot exceed 2000 characters.')
    .default('General enquiry from website.'),
  source: z
    .string()
    .trim()
    .max(50)
    .optional()
    .default('WEBSITE'),
});

export const RequirementInputSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(2, 'Project name must be at least 2 characters.')
    .max(100, 'Project name cannot exceed 100 characters.'),
  application: z
    .string()
    .trim()
    .max(100)
    .optional()
    .nullable(),
  material: z
    .string()
    .trim()
    .max(100)
    .optional()
    .nullable(),
  colour: z
    .string()
    .trim()
    .max(50)
    .optional()
    .nullable(),
  approxAreaSqft: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return null;
      const num = typeof val === 'number' ? val : parseFloat(val);
      return isNaN(num) ? null : num;
    })
    .refine((val) => val === null || (val >= 0 && val <= 1000000), {
      message: 'Area must be between 0 and 1,000,000 sq.ft.',
    }),
  budget: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return null;
      const num = typeof val === 'number' ? val : parseFloat(val);
      return isNaN(num) ? null : num;
    })
    .refine((val) => val === null || (val >= 0 && val <= 1000000000), {
      message: 'Budget must be a non-negative value.',
    }),
  message: z
    .string()
    .trim()
    .max(2000, 'Message cannot exceed 2000 characters.')
    .optional()
    .nullable(),
  items: z.array(z.any()).optional().default([]),
});
