import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');
    const availableOnly = searchParams.get('available') === 'true';
    const newArrivalsOnly = searchParams.get('newArrivals') === 'true';
    const material = searchParams.get('material');
    const format = searchParams.get('format');
    const application = searchParams.get('application');

    const whereClause: any = { published: true };

    if (ids) {
      const idList = ids.split(',').filter(Boolean);
      whereClause.id = { in: idList };
    }

    if (availableOnly) {
      whereClause.availability = { in: ['AVAILABLE', 'LOW_STOCK'] };
    }

    if (newArrivalsOnly) {
      whereClause.isNewArrival = true;
    }

    if (material) {
      whereClause.material = material;
    }

    if (format) {
      whereClause.format = format;
    }

    if (application) {
      whereClause.recommendedApplications = {
        contains: application,
      };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        images: {
          orderBy: { imageOrder: 'asc' },
        },
        slabs: {
          where: {
            status: 'AVAILABLE',
            isSample: false,
          },
          select: {
            id: true,
            slabCode: true,
            status: true,
            lengthInches: true,
            widthInches: true,
            thicknessMm: true,
            areaSqft: true,
            pricePerSqft: true,
            slabPrice: true,
            location: true,
          },
        },
      },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve products.' }, { status: 500 });
  }
}
