import React, { Suspense } from 'react';
import prisma from '@/lib/prisma';
import CatalogueClient from '@/components/CatalogueClient';

export const dynamic = 'force-dynamic';

export default async function CataloguePage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: {
      images: {
        orderBy: { imageOrder: 'asc' },
      },
    },
  });

  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500">Loading Stone Catalogue...</div>}>
      <CatalogueClient
        initialProducts={products as any}
        pageTitle="Complete Natural Stone Catalogue"
        pageDescription="Explore our live inventory of Makrana & imported marble slabs, premium Indian granites, and precision natural stone tiles."
      />
    </Suspense>
  );
}
