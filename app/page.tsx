import React from 'react';
import prisma from '@/lib/prisma';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Mahadev Marble and Granite | Digital Showroom & Stockyard Kelwa',
  description: 'Explore live available stock of authentic natural marble, calibrated granite, and architectural stone slabs at Mahadev Marble and Granite, Raghunathpura, Kelwa.',
};

export default async function HomePage() {
  const [featuredProducts, availableStockProducts, newArrivals, verifiedSlabsCount] = await Promise.all([
    // Featured natural stones
    prisma.product.findMany({
      where: { published: true, featured: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { imageOrder: 'asc' } },
        slabs: {
          where: { isSample: false, status: 'AVAILABLE' },
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
    }),

    // Available stock (strictly live verified inventory)
    prisma.product.findMany({
      where: {
        published: true,
        availability: { in: ['AVAILABLE', 'LOW_STOCK'] },
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { imageOrder: 'asc' } },
        slabs: {
          where: { isSample: false, status: 'AVAILABLE' },
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
    }),

    // New arrivals from quarries
    prisma.product.findMany({
      where: {
        published: true,
        isNewArrival: true,
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { imageOrder: 'asc' } },
        slabs: {
          where: { isSample: false, status: 'AVAILABLE' },
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
    }),

    // Verified active physical slabs count
    prisma.slabInventory.count({
      where: { isSample: false, status: 'AVAILABLE' },
    }),
  ]);

  return (
    <HomeClient
      featuredProducts={featuredProducts as any}
      availableStockProducts={availableStockProducts as any}
      newArrivals={newArrivals as any}
      verifiedSlabsCount={verifiedSlabsCount}
    />
  );
}
