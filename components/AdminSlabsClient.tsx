'use client';

import React, { useState } from 'react';
import { Search, Filter, Layers, CheckCircle2, Clock, AlertCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { formatINR } from '@/lib/utils';

interface AdminSlabItem {
  id: string;
  slabCode: string;
  batchId?: string | null;
  lengthInches: number;
  widthInches: number;
  thicknessMm: number;
  areaSqft: number;
  slabPrice?: number | null;
  location?: string | null;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'HOLD' | 'HIDDEN';
  isSample?: boolean;
  notes?: string | null;
  reservedAt?: string | null;
  reservedBy?: string | null;
  reservationNotes?: string | null;
  product: {
    name: string;
    productCode: string;
    material: string;
  };
}

interface AdminSlabsClientProps {
  initialSlabs: AdminSlabItem[];
  products: { id: string; name: string; productCode: string }[];
}

export default function AdminSlabsClient({ initialSlabs, products }: AdminSlabsClientProps) {
  const [slabs, setSlabs] = useState<AdminSlabItem[]>(initialSlabs);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isPurging, setIsPurging] = useState(false);
  const [purgeMessage, setPurgeMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sampleCount = slabs.filter((s) => s.isSample).length;

  const handleStatusChange = async (slabId: string, newStatus: string) => {
    setUpdatingId(slabId);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/slabs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slabId, status: newStatus }),
      });

      const data = await res.json();

      if (res.ok && data.slab) {
        setSlabs((prev) =>
          prev.map((s) => (s.id === slabId ? { ...s, ...data.slab } : s))
        );
      } else {
        setErrorMessage(data.error || 'Failed to update slab status.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Network error updating slab.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePurgeSampleSlabs = async () => {
    if (!confirm('Are you sure you want to purge all synthetic/sample slabs? Verified inventory and products will remain untouched.')) {
      return;
    }

    setIsPurging(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/slabs/sample', {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok) {
        setSlabs((prev) => prev.filter((s) => !s.isSample));
        setPurgeMessage(data.message || 'Sample slabs successfully purged.');
        setTimeout(() => setPurgeMessage(null), 6000);
      } else {
        setErrorMessage(data.error || 'Failed to purge sample slabs.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Error purging sample slabs.');
    } finally {
      setIsPurging(false);
    }
  };

  const filteredSlabs = slabs.filter((slab) => {
    if (statusFilter !== 'ALL' && slab.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      const matchCode = slab.slabCode.toLowerCase().includes(query);
      const matchProd = slab.product.name.toLowerCase().includes(query);
      const matchBatch = slab.batchId?.toLowerCase().includes(query);
      return matchCode || matchProd || matchBatch;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-bronze-600">
            Kelwa Stockyard Physical Inventory
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            Physical Slab Inventory Management
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track individual gangsaw slabs, yard bay locations, and concurrency-safe live reservations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-charcoal-900 shadow-sm">
            Total Slabs: {slabs.length}
          </span>
          {sampleCount > 0 && (
            <span className="px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-lg text-xs font-semibold text-amber-900">
              Sample/Demo: {sampleCount}
            </span>
          )}
        </div>
      </div>

      {/* Warning Banner for Sample Data */}
      {sampleCount > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Demo / Sample Slab Records Detected ({sampleCount} records)
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                These records are demonstration slabs and are strictly <strong>hidden from the public website</strong>. Before final production launch, purge them and import verified MMG Kelwa yard lots.
              </p>
            </div>
          </div>
          <button
            onClick={handlePurgeSampleSlabs}
            disabled={isPurging}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm whitespace-nowrap transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isPurging ? 'Purging...' : 'Purge Sample Slabs'}</span>
          </button>
        </div>
      )}

      {/* Success Notification */}
      {purgeMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{purgeMessage}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Control Bar: Search & Status Filter */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by slab code (MMG-SLB-...), stone name, or lot..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs w-full md:w-auto">
          <span className="text-stone-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded text-xs font-semibold text-charcoal-900"
          >
            <option value="ALL">All Statuses ({slabs.length})</option>
            <option value="AVAILABLE">AVAILABLE ({slabs.filter((s) => s.status === 'AVAILABLE').length})</option>
            <option value="RESERVED">RESERVED ({slabs.filter((s) => s.status === 'RESERVED').length})</option>
            <option value="SOLD">SOLD ({slabs.filter((s) => s.status === 'SOLD').length})</option>
            <option value="HOLD">HOLD ({slabs.filter((s) => s.status === 'HOLD').length})</option>
          </select>
        </div>
      </div>

      {/* Slabs Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider">
              <tr>
                <th className="p-4">Slab Code & Batch</th>
                <th className="p-4">Stone Variety</th>
                <th className="p-4">Dimensions</th>
                <th className="p-4">Area (sq.ft.)</th>
                <th className="p-4">Yard Location</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-charcoal-900">
              {filteredSlabs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-400">
                    No physical slabs found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredSlabs.map((slab) => {
                  const isUpdating = updatingId === slab.id;
                  return (
                    <tr key={slab.id} className="hover:bg-stone-50/50">
                      <td className="p-4 font-mono font-bold">
                        <div className="text-charcoal-950">{slab.slabCode}</div>
                        {slab.batchId && (
                          <div className="text-[10px] text-stone-400 font-normal">{slab.batchId}</div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold">{slab.product.name}</div>
                        <div className="text-[11px] text-stone-500">{slab.product.material}</div>
                      </td>
                      <td className="p-4 text-stone-600">
                        {slab.lengthInches} × {slab.widthInches} in ({slab.thicknessMm}mm)
                      </td>
                      <td className="p-4 font-semibold">
                        {slab.areaSqft} sq.ft.
                      </td>
                      <td className="p-4 text-stone-600">
                        {slab.location || 'Kelwa Main Yard'}
                      </td>
                      <td className="p-4">
                        {slab.isSample ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            DEMO SAMPLE
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            VERIFIED YARD
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold ${
                            slab.status === 'AVAILABLE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : slab.status === 'RESERVED'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {slab.status}
                        </span>
                        {slab.reservedBy && (
                          <div className="text-[10px] text-stone-500 mt-0.5">By: {slab.reservedBy}</div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <select
                          disabled={isUpdating}
                          value={slab.status}
                          onChange={(e) => handleStatusChange(slab.id, e.target.value)}
                          className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs font-semibold text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500"
                        >
                          <option value="AVAILABLE">AVAILABLE</option>
                          <option value="RESERVED">RESERVED</option>
                          <option value="SOLD">SOLD</option>
                          <option value="HOLD">HOLD</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
