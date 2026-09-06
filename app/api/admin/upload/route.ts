import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { uploadToSupabaseStorage, validateImageFile } from '@/lib/supabase-storage';
import { handleApiError } from '@/lib/api-errors';
import path from 'path';

export async function POST(request: Request) {
  try {
    await requireAuth(['ADMIN', 'STAFF']);

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const validation = validateImageFile({ size: file.size, type: file.type });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Path traversal defense & strict extension whitelist
    const rawExt = path.extname(file.name).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
    if (!allowedExts.includes(rawExt)) {
      return NextResponse.json({ error: 'Invalid file extension. Only JPG, PNG, WebP, and AVIF are permitted.' }, { status: 400 });
    }

    const cleanBase = path.basename(file.name, rawExt).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `mmg-${Date.now()}-${cleanBase}${rawExt}`;

    // Verify persistent cloud storage is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes('placeholder');

    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: 'Persistent cloud storage (Supabase Storage) is not configured. Production uploads cannot be saved to ephemeral local disk.' },
        { status: 503 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { publicUrl, error: storageError } = await uploadToSupabaseStorage(
      'STONES',
      `products/${filename}`,
      buffer,
      file.type
    );

    if (storageError || !publicUrl) {
      return NextResponse.json(
        { error: storageError || 'Failed to upload image to cloud storage.' },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error: any) {
    return handleApiError(error);
  }
}
