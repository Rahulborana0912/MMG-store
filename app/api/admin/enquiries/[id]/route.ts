import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(['ADMIN', 'STAFF']);
    const { id } = await params;
    const { status, staffNotes, assignedStaff } = await request.json();

    const updated = await prisma.enquiry.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(staffNotes !== undefined && { staffNotes }),
        ...(assignedStaff !== undefined && { assignedStaff }),
      },
    });

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error: any) {
    return handleApiError(error);
  }
}
