'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Edit2, Trash2, Copy, Eye, Check, AlertCircle } from 'lucide-react';
import { formatINR } from '@/lib/utils';

interface AdminProductsClientProps {
  initialProducts: any[];
}

export default function AdminProductsClient({ initialProducts }: AdminProductsClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('ALL');
  const [selectedMaterial, setSelectedMaterial] = useState('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete product. Staff accounts may not have delete permission.');
      }
    } catch {
      alert('An error occurred.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicate = async (product: any) => {
    try {
      const duplicateData = {
        ...product,
        name: `${product.name} (Copy)`,
        productCode: `${product.productCode}-CPY`,
      };
      delete duplicateData.id;
      delete duplicateData.createdAt;
      delete duplicateData.updatedAt;

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicateData),
      });

      if (res.ok) {
        router.refresh();
        alert('Product duplicated successfully.');
      }
    } catch {
      alert('Failed to duplicate.');
    }
  };

  const filteredProducts = products.filter((p) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.productCode.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (selectedFormat !== 'ALL' && p.format !== selectedFormat) return false;
    if (selectedMaterial !== 'ALL' && p.material !== selectedMaterial) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block mb-1">
            Catalogue & Yard Stock
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Natural Stone Products ({products.length})
          </h1>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-wider rounded shadow-stone-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Control Strip */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-stone-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or code (MMG-...)"
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto text-xs">
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded font-medium text-stone-700"
          >
            <option value="ALL">All Formats (Slab & Tile)</option>
            <option value="SLAB">Slabs Only</option>
            <option value="TILE">Tiles / Pieces Only</option>
          </select>

          <select
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded font-medium text-stone-700"
          >
            <option value="ALL">All Materials</option>
            <option value="Marble">Marble</option>
            <option value="Granite">Granite</option>
            <option value="Natural Stone">Natural Stone</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-stone-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase">
              <tr>
                <th className="p-4">Stone / Image</th>
                <th className="p-4">Code</th>
                <th className="p-4">Format</th>
                <th className="p-4">Dimensions</th>
                <th className="p-4">Price / sq.ft.</th>
                <th className="p-4">Availability</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-charcoal-900">
              {filteredProducts.map((p) => {
                const imgUrl = p.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80';
                return (
                  <tr key={p.id} className="hover:bg-stone-50/60">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                          <Image
                            src={imgUrl}
                            alt={p.name}
                            fill
                            unoptimized={imgUrl.includes('googleusercontent') || imgUrl.includes('drive.google')}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-semibold text-charcoal-900 block line-clamp-1">
                            {p.name}
                          </span>
                          <span className="text-stone-400 text-[11px]">
                            {p.material} • {p.colour} • {p.finish}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-[11px] font-medium text-stone-600">
                      {p.productCode}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.format === 'SLAB'
                            ? 'bg-charcoal-900 text-white'
                            : 'bg-stone-200 text-stone-800'
                        }`}
                      >
                        {p.format === 'SLAB' ? 'SLAB' : 'TILE'}
                      </span>
                    </td>

                    <td className="p-4 text-stone-600">
                      <div>{p.lengthInches}&quot; × {p.widthInches}&quot; ({p.thicknessMm}mm)</div>
                      <div className="text-[11px] text-stone-400">{p.areaSqft} sq.ft.</div>
                    </td>

                    <td className="p-4 font-bold font-sans text-charcoal-900">
                      {formatINR(p.pricePerSqft, { showUnit: true })}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          p.availability === 'AVAILABLE'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : p.availability === 'LOW_STOCK'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {p.availability} ({p.quantity})
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded"
                          title="View on public website"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(p)}
                          className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded"
                          title="Duplicate product"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 text-bronze-600 hover:text-bronze-800 hover:bg-stone-100 rounded"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deletingId === p.id}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
