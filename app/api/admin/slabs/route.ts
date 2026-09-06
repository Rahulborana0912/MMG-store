import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function GET(request: Request) {
  try {
    await requireAuth(['ADMIN', 'STAFF']);
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const status = searchParams.get('status');

    const whereClause: any = {};
    if (productId) whereClause.productId = productId;
    if (status) whereClause.status = status;

    const slabs = await prisma.slabInventory.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            name: true,
            productCode: true,
            material: true,
          },
        },
      },
    });

    return NextResponse.json({ slabs });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth(['ADMIN', 'STAFF']);
    const body = await request.json();
    const { slabId, status, location, notes, reservedBy, reservationNotes } = body;

    if (!slabId || !status) {
      return NextResponse.json({ error: 'slabId and status are required' }, { status: 400 });
    }

    // Atomic transaction for updating status and logging audit trail with database-level concurrency protection
    const updatedSlab = await prisma.$transaction(async (tx) => {
      const current = await tx.slabInventory.findUnique({
        where: { id: slabId },
      });

      if (!current) {
        throw new Error('NOT_FOUND');
      }

      // State Machine Transition Validation
      if (current.status === 'SOLD') {
        if (status === 'RESERVED') {
          throw new Error('INVALID_STATE_TRANSITION: Sold slabs cannot be reserved.');
        }
        if (status === 'AVAILABLE') {
          if (user.role !== 'ADMIN') {
            throw new Error('UNAUTHORIZED_STATE_TRANSITION: Only an ADMIN can reinstate a sold slab back to AVAILABLE.');
          }
        }
      }

      if (status === 'RESERVED') {
        if (current.status !== 'AVAILABLE') {
          throw new Error('CONCURRENCY_CONFLICT');
        }

        // Concurrency Guard: If reserving, the slab MUST still be AVAILABLE in the database
        const updateResult = await tx.slabInventory.updateMany({
          where: {
            id: slabId,
            status: 'AVAILABLE',
            isSample: false,
          },
          data: {
            status: 'RESERVED',
            location: location !== undefined ? location : current.location,
            notes: notes !== undefined ? notes : current.notes,
            reservedAt: new Date(),
            reservedBy: reservedBy || user.name,
            reservationNotes: reservationNotes || null,
          },
        });

        if (updateResult.count === 0) {
          throw new Error('CONCURRENCY_CONFLICT');
        }
      } else if (status === 'SOLD') {
        if (current.status !== 'RESERVED' && current.status !== 'AVAILABLE') {
          throw new Error(`INVALID_STATE_TRANSITION: Slab in status ${current.status} cannot be marked SOLD.`);
        }
        if (current.status === 'AVAILABLE' && user.role !== 'ADMIN') {
          throw new Error('UNAUTHORIZED_STATE_TRANSITION: Showroom staff must reserve a slab before marking it SOLD, or request Admin authorization.');
        }

        await tx.slabInventory.update({
          where: { id: slabId },
          data: {
            status: 'SOLD',
            location: location !== undefined ? location : current.location,
            notes: notes !== undefined ? notes : current.notes,
          },
        });
      } else if (status === 'AVAILABLE') {
        // Releasing reservation or super-admin reinstating a sold slab
        await tx.slabInventory.update({
          where: { id: slabId },
          data: {
            status: 'AVAILABLE',
            location: location !== undefined ? location : current.location,
            notes: notes !== undefined ? notes : current.notes,
            reservedAt: null,
            reservedBy: null,
            reservationNotes: null,
          },
        });
      } else {
        throw new Error(`INVALID_STATUS: Unknown status ${status}`);
      }

      // Fetch the updated slab record
      const refreshed = await tx.slabInventory.findUnique({
        where: { id: slabId },
      });

      // Audit log entry in the same transaction
      await tx.auditLog.create({
        data: {
          userId: user.userId,
          userRole: user.role,
          action: 'SLAB_STATUS_CHANGE',
          entityType: 'SLAB',
          entityId: slabId,
          details: JSON.stringify({
            slabCode: current.slabCode,
            fromStatus: current.status,
            toStatus: status,
            reservedBy: status === 'RESERVED' ? (reservedBy || user.name) : undefined,
          }),
        },
      });

      return refreshed;
    });

    return NextResponse.json({ success: true, slab: updatedSlab });
  } catch (error: any) {
    return handleApiError(error);
  }
}
