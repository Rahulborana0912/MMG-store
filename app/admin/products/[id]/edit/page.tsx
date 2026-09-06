import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductForm from '@/components/ProductForm';

export const dynamic = 'force-dynamic';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { imageOrder: 'asc' } },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block mb-1">
          Edit Stone Specifications
        </span>
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">
          Edit {product.name} ({product.productCode})
        </h1>
      </div>

      <ProductForm initialData={product} isEditing={true} />
    </div>
  );
}
