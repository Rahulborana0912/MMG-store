import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductDetailClient from '@/components/ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) return { title: 'Stone Product Not Found | MMG' };

  return {
    title: `${product.name} (${product.productCode}) | MMG Mahadev Marble and Granite`,
    description: `${product.name} natural ${product.material.toLowerCase()} slab/tile. ${product.finish} finish, ${product.thicknessMm}mm thickness. Available at Mahadev Marble and Granite, Raghunathpura, Kelwa.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { imageOrder: 'asc' },
      },
      slabs: {
        where: {
          isSample: false,
          status: 'AVAILABLE',
        },
        select: {
          id: true,
          slabCode: true,
          lengthInches: true,
          widthInches: true,
          thicknessMm: true,
          areaSqft: true,
          pricePerSqft: true,
          slabPrice: true,
          location: true,
          status: true,
        },
        orderBy: { slabCode: 'asc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product as any} />;
}
