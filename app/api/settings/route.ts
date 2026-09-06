import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/site-settings';
import { handleApiError } from '@/lib/api-errors';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
