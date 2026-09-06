import React, { Suspense } from 'react';
import prisma from '@/lib/prisma';
import CatalogueClient from '@/components/CatalogueClient';

export const dynamic = 'force-dynamic';

export default async function GranitePage() {
  const products = await prisma.product.findMany({
    where: {
      published: true,
      material: 'Granite',
    },
    orderBy: { createdAt: 'desc' },
    include: {
      images: {
        orderBy: { imageOrder: 'asc' },
      },
    },
  });

  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500">Loading Granite Collection...</div>}>
      <CatalogueClient
        initialProducts={products as any}
        initialMaterial="Granite"
        pageTitle="Natural Granite Slabs & Tiles"
        pageDescription="Extremely dense, heat-resistant, and scratch-proof Indian granites including Ongole Black Galaxy, Karimnagar Tan Brown, and Steel Grey. Available in standard 20mm slabs and pre-cut tiles."
      />
    </Suspense>
  );
}
