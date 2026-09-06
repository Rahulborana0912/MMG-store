import React, { Suspense } from 'react';
import prisma from '@/lib/prisma';
import QuotationBuilderForm from '@/components/QuotationBuilderForm';

export const dynamic = 'force-dynamic';

export default async function NewQuotationPage() {
  const availableProducts = await prisma.product.findMany({
    where: { published: true },
    select: {
      id: true,
      name: true,
      productCode: true,
      format: true,
      pricePerSqft: true,
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block mb-1">
          Quotation Generator
        </span>
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">
          Prepare Commercial Quotation
        </h1>
        <p className="text-xs text-stone-500">
          Calculate multi-line stone totals, crated freight charges, and Indian 18% GST.
        </p>
      </div>

      <Suspense fallback={<div className="p-8 text-xs text-stone-500">Loading Quotation Generator...</div>}>
        <QuotationBuilderForm availableProducts={availableProducts as any} />
      </Suspense>
    </div>
  );
}
