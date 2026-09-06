import React from 'react';
import ProductForm from '@/components/ProductForm';

export const dynamic = 'force-dynamic';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block mb-1">
          Inventory Entry
        </span>
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">
          Add New Stone Product / Lot
        </h1>
        <p className="text-xs text-stone-500">
          Enter complete physical stone dimensions, quarry details, and calibrated thickness.
        </p>
      </div>

      <ProductForm isEditing={false} />
    </div>
  );
}
