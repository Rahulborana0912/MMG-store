import React from 'react';
import prisma from '@/lib/prisma';
import CatalogueClient from '@/components/CatalogueClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Available Stone Stock | Mahadev Marble and Granite Kelwa Yard',
  description: 'View real-time natural stone inventory available for immediate inspection and loading at our Raghunathpura, Kelwa stockyard. Makrana marble, South Indian granites, natural tiles.',
};

export default async function AvailableStockPage() {
  const verifiedSlabsCount = await prisma.slabInventory.count({
    where: {
      status: 'AVAILABLE',
      isSample: false,
    },
  });

  const products = await prisma.product.findMany({
    where: {
      published: true,
      availability: {
        in: ['AVAILABLE', 'LOW_STOCK'],
      },
    },
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

  const isUpdating = verifiedSlabsCount === 0;

  return (
    <CatalogueClient
      initialProducts={products as any}
      pageTitle={isUpdating ? "Stone Availability & Catalogue • पत्थर उपलब्धता" : "Available Stone Inventory • उपलब्ध स्टॉक"}
      pageDescription={
        isUpdating
          ? "New stock is being updated. Contact MMG for current availability. Individual physical slab lots are currently undergoing gangsaw processing and dimensional measurement at our Raghunathpura, Kelwa yard. Below is our active natural stone portfolio."
          : "Every verified lot in this section represents actual processed stones ready for dry-lay inspection and dispatch at our Raghunathpura, Kelwa stockyard."
      }
      isStockUpdating={isUpdating}
    />
  );
}
