import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { formatImageUrl } from '@/lib/utils';
import { handleApiError } from '@/lib/api-errors';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['ADMIN', 'STAFF']);
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { imageOrder: 'asc' } },
        category: true,
      },
    });

    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['ADMIN', 'STAFF']);
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.$transaction(async (tx) => {
      // If images array is supplied, replace existing images
      if (Array.isArray(body.images)) {
        await tx.productImage.deleteMany({
          where: { productId: id },
        });

        if (body.images.length > 0) {
          const hasExplicitMain = body.images.some((i: any) => i.isMain);
          await tx.productImage.createMany({
            data: body.images.map((img: any, idx: number) => ({
              productId: id,
              imageUrl: formatImageUrl(img.imageUrl),
              imageType: img.imageType || (idx === 0 ? 'MAIN' : 'SLAB'),
              imageOrder: idx,
              isMain: Boolean(img.isMain) || (!hasExplicitMain && idx === 0),
              altText: body.name,
            })),
          });
        }
      }

      return tx.product.update({
        where: { id },
        data: {
          name: body.name,
          productCode: body.productCode,
          material: body.material,
          format: body.format,
          colour: body.colour,
          pattern: body.pattern,
          finish: body.finish,
          description: body.description,
          shortDescription: body.shortDescription,
          pricePerSqft: parseFloat(body.pricePerSqft),
          pricePerPiece: body.pricePerPiece ? parseFloat(body.pricePerPiece) : null,
          slabPrice: body.slabPrice ? parseFloat(body.slabPrice) : null,
          thicknessMm: parseFloat(body.thicknessMm),
          lengthInches: parseFloat(body.lengthInches),
          widthInches: parseFloat(body.widthInches),
          areaSqft: parseFloat(body.areaSqft),
          quantity: parseInt(body.quantity),
          availability: body.availability,
          featured: !!body.featured,
          isNewArrival: !!body.isNewArrival,
          published: body.published !== false,
          recommendedApplications: body.recommendedApplications,
          origin: body.origin,
        },
        include: {
          images: { orderBy: { imageOrder: 'asc' } },
        },
      });
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['ADMIN']);
    const { id } = await params;

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return handleApiError(error);
  }
}
