import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { formatImageUrl } from '@/lib/utils';
import { handleApiError } from '@/lib/api-errors';

export async function GET() {
  try {
    await requireAuth(['ADMIN', 'STAFF']);

    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: { orderBy: { imageOrder: 'asc' } },
      },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(['ADMIN', 'STAFF']);

    const body = await request.json();
    const {
      name,
      productCode,
      material,
      format,
      colour,
      pattern,
      finish,
      description,
      shortDescription,
      pricePerSqft,
      pricePerPiece,
      slabPrice,
      thicknessMm,
      lengthInches,
      widthInches,
      areaSqft,
      quantity,
      availability,
      featured,
      isNewArrival,
      published,
      recommendedApplications,
      origin,
      images,
    } = body;

    // Find or create category
    let category = await prisma.category.findFirst({
      where: {
        name: {
          contains: material,
        },
      },
    });

    if (!category) {
      category = await prisma.category.findFirst() || await prisma.category.create({
        data: {
          name: material,
          slug: material.toLowerCase().replace(/\s+/g, '-'),
        }
      });
    }

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        productCode,
        material,
        categoryId: category.id,
        format: format || 'SLAB',
        colour,
        pattern,
        finish,
        description,
        shortDescription: shortDescription || null,
        pricePerSqft: parseFloat(pricePerSqft) || 0,
        pricePerPiece: pricePerPiece ? parseFloat(pricePerPiece) : null,
        slabPrice: slabPrice ? parseFloat(slabPrice) : null,
        thicknessMm: parseFloat(thicknessMm) || 18,
        lengthInches: parseFloat(lengthInches) || 0,
        widthInches: parseFloat(widthInches) || 0,
        areaSqft: parseFloat(areaSqft) || 0,
        quantity: parseInt(quantity) || 1,
        availability: availability || 'AVAILABLE',
        featured: !!featured,
        isNewArrival: !!isNewArrival,
        published: published !== false,
        recommendedApplications: recommendedApplications || null,
        origin: origin || 'Rajasthan, India',
        images: {
          create: Array.isArray(images)
            ? images.map((img: any, idx: number) => {
                const hasExplicitMain = images.some((i: any) => i.isMain);
                return {
                  imageUrl: formatImageUrl(img.imageUrl),
                  imageType: img.imageType || (idx === 0 ? 'MAIN' : 'SLAB'),
                  imageOrder: idx,
                  isMain: Boolean(img.isMain) || (!hasExplicitMain && idx === 0),
                  altText: name,
                };
              })
            : [],
        },
      },
      include: { images: true },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    return handleApiError(error);
  }
}
