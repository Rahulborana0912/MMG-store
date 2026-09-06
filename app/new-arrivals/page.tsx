import React from 'react';
import prisma from '@/lib/prisma';
import CatalogueClient from '@/components/CatalogueClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'New Stone Arrivals | Latest Gangsaw Lots at MMG Kelwa',
  description: 'Explore newly sliced gangsaw marble blocks and fresh quarry granite lots just arrived at our Raghunathpura, Kelwa facility. Makrana white, Carrara Statuario, and South Indian granites.',
};

export default async function NewArrivalsPage() {
  const products = await prisma.product.findMany({
    where: {
      published: true,
      isNewArrival: true,
    },
    orderBy: [
      { createdAt: 'desc' },
    ],
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
      },
    },
  });

  return (
    <CatalogueClient
      initialProducts={products as any}
      pageTitle="New Quarry Arrivals & Fresh Lots"
      pageDescription="Freshly gangsaw-cut monolithic stone blocks and recently calibrated lots from Rajasthan and South Indian quarries. Be the first to inspect fresh natural vein flow."
    />
  );
}
