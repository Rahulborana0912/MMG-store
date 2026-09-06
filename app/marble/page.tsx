import React, { Suspense } from 'react';
import prisma from '@/lib/prisma';
import CatalogueClient from '@/components/CatalogueClient';

export const dynamic = 'force-dynamic';

export default async function MarblePage() {
  const products = await prisma.product.findMany({
    where: {
      published: true,
      material: 'Marble',
    },
    orderBy: { createdAt: 'desc' },
    include: {
      images: {
        orderBy: { imageOrder: 'asc' },
      },
    },
  });

  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500">Loading Marble Slabs & Tiles...</div>}>
      <CatalogueClient
        initialProducts={products as any}
        initialMaterial="Marble"
        pageTitle="Natural Marble Slabs & Tiles"
        pageDescription="Quarried from the legendary belts of Makrana and Morwad in Rajasthan, plus hand-inspected imported Italian marble blocks. Both full gangsaw slabs and cut tiles available."
      />
    </Suspense>
  );
}
