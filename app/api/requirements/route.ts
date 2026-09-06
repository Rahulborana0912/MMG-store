import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { RequirementInputSchema } from '@/lib/validators';
import { checkDistributedRateLimit } from '@/lib/rate-limit';
import { handleApiError, ApiError } from '@/lib/api-errors';

export async function GET() {
  try {
    const user = await requireAuth();

    // IDOR Protection: Customers strictly see only their own requirements
    const whereClause: any = {};
    if (user.role === 'CUSTOMER') {
      whereClause.customerId = user.userId;
    }

    const requirements = await prisma.requirement.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                productCode: true,
                material: true,
                pricePerSqft: true,
                images: {
                  take: 1,
                  select: { imageUrl: true },
                },
              },
            },
            slab: {
              select: {
                id: true,
                slabCode: true,
                status: true,
                areaSqft: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ requirements });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();

    // Rate limiting per user: max 10 requirement creations per minute
    const rateLimit = await checkDistributedRateLimit(`req:${user.userId}`, 10, 60);
    if (!rateLimit.success) {
      return handleApiError(new ApiError(429, 'RATE_LIMITED'));
    }

    const body = await request.json();
    const validated = RequirementInputSchema.parse(body);

    // Atomic transaction for Requirement + RequirementItems
    const result = await prisma.$transaction(async (tx) => {
      const requirement = await tx.requirement.create({
        data: {
          customerId: user.userId,
          projectName: validated.projectName,
          application: validated.application || null,
          approxAreaSqft: validated.approxAreaSqft || null,
          budget: validated.budget || null,
          material: validated.material || null,
          colour: validated.colour || null,
          message: validated.message || null,
          status: 'DRAFT',
          items: {
            create: Array.isArray(validated.items)
              ? validated.items.map((it: any) => ({
                  productId: it.productId,
                  slabId: it.slabId || null,
                  quantitySqft: it.quantitySqft ? Number(it.quantitySqft) : null,
                  notes: it.notes?.trim() || null,
                }))
              : [],
          },
        },
        include: {
          items: true,
        },
      });

      return requirement;
    });

    return NextResponse.json({ success: true, requirement: result });
  } catch (error: any) {
    return handleApiError(error);
  }
}
