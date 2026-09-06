import React from 'react';
import prisma from '@/lib/prisma';
import AdminSlabsClient from '@/components/AdminSlabsClient';

export const dynamic = 'force-dynamic';

export default async function AdminSlabsPage() {
  const slabs = await prisma.slabInventory.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        select: {
          name: true,
          productCode: true,
          material: true,
        },
      },
    },
  });

  const products = await prisma.product.findMany({
    where: { format: 'SLAB' },
    select: {
      id: true,
      name: true,
      productCode: true,
    },
    orderBy: { name: 'asc' },
  });

  return <AdminSlabsClient initialSlabs={slabs as any} products={products} />;
}
