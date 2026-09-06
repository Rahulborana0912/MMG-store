import React, { Suspense } from 'react';
import prisma from '@/lib/prisma';
import CatalogueClient from '@/components/CatalogueClient';

export const dynamic = 'force-dynamic';

export default async function StoneTilesPage() {
  const products = await prisma.product.findMany({
    where: {
      published: true,
      OR: [
        { format: 'TILE' },
        { material: 'Natural Stone' },
      ],
    },
    orderBy: { createdAt: 'desc' },
    include: {
      images: {
        orderBy: { imageOrder: 'asc' },
      },
    },
  });

  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500">Loading Stone Tiles & Pieces...</div>}>
      <CatalogueClient
        initialProducts={products as any}
        pageTitle="Natural Stone Tiles & Cut Pieces"
        pageDescription="100% natural quarried stone pieces, pavers, and calibrated tiles including Kota limestone, Jaisalmer sandstone, and pre-cut granite tiles. Strictly no ceramic or vitrified tiles."
      />
    </Suspense>
  );
}
