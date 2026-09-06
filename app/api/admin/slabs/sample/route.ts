import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function DELETE() {
  try {
    const user = await requireAuth(['ADMIN']);

    const count = await prisma.slabInventory.count({
      where: { isSample: true },
    });

    if (count === 0) {
      return NextResponse.json({
        success: true,
        message: 'No sample slabs found in inventory.',
        deletedCount: 0,
      });
    }

    const result = await prisma.slabInventory.deleteMany({
      where: { isSample: true },
    });

    // Log the audit event
    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        userRole: user.role,
        action: 'SAMPLE_SLABS_PURGED',
        entityType: 'SLAB',
        details: JSON.stringify({ count: result.count, timestamp: new Date() }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully purged ${result.count} sample demonstration slabs.`,
      deletedCount: result.count,
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
