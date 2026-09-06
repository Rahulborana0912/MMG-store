import { createServerSupabaseClient } from '@/lib/supabase-server';

export const STORAGE_BUCKETS = {
  STONES: 'mmg-stones',
  SLABS: 'mmg-slabs',
  REQUIREMENTS: 'mmg-requirements',
  PROJECTS: 'mmg-projects',
} as const;

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
];

/**
 * Validates file type and size before upload to Supabase Storage
 */
export function validateImageFile(file: { size: number; type: string }): { valid: boolean; error?: string } {
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return { valid: false, error: 'Image size exceeds maximum limit of 10MB.' };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid format. Only JPG, PNG, WebP, and AVIF images are permitted.' };
  }
  return { valid: true };
}

/**
 * Uploads an image buffer or file to Supabase Storage bucket
 */
export async function uploadToSupabaseStorage(
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string,
  fileBody: Buffer | Blob | Uint8Array,
  contentType: string
): Promise<{ publicUrl: string | null; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient();
    const bucketName = STORAGE_BUCKETS[bucket];

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, fileBody, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error(`Supabase Storage upload error (${bucketName}/${path}):`, error);
      return { publicUrl: null, error: error.message };
    }

    if (bucket === 'REQUIREMENTS') {
      // Private signed URL for confidential customer requirement drawings (valid for 1 hour)
      const { data: signedData, error: signError } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(data.path, 3600);
      return { publicUrl: signedData?.signedUrl || data.path, error: signError ? signError.message : null };
    }

    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
    return { publicUrl: urlData.publicUrl, error: null };
  } catch (err: any) {
    return { publicUrl: null, error: err.message };
  }
}
