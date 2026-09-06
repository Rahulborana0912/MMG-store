import React from 'react';
import prisma from '@/lib/prisma';
import AdminProductsClient from '@/components/AdminProductsClient';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      images: { orderBy: { imageOrder: 'asc' } },
    },
  });

  return <AdminProductsClient initialProducts={products} />;
}
