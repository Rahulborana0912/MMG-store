'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileQuestion,
  Search,
  MessageCircle,
  Phone,
  FileText,
  Save,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { formatIndianDate } from '@/lib/utils';

interface AdminEnquiry {
  id: string;
  enquiryNumber: string;
  customerId?: string | null;
  productId?: string | null;
  name: string;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  quantity?: string | null;
  approxAreaSqft?: number | null;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'QUOTED' | 'FOLLOW_UP' | 'COMPLETED' | 'CLOSED';
  assignedStaff?: string | null;
  staffNotes?: string | null;
  createdAt: string;
  product?: {
    name: string;
    productCode: string;
    material: string;
    format: string;
    pricePerSqft: number;
  } | null;
}

interface AdminEnquiriesClientProps {
  initialEnquiries: AdminEnquiry[];
}

export default function AdminEnquiriesClient({ initialEnquiries }: AdminEnquiriesClientProps) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdminEnquiry | null>(initialEnquiries[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [savingNote, setSavingNote] = useState(false);
  const [currentNotes, setCurrentNotes] = useState(initialEnquiries[0]?.staffNotes || '');

  // Select enquiry
  const handleSelect = (enq: AdminEnquiry) => {
    setSelectedEnquiry(enq);
    setCurrentNotes(enq.staffNotes || '');
  };

  // Update Status
  const handleStatusChange = async (newStatus: string) => {
    if (!selectedEnquiry) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = { ...selectedEnquiry, status: newStatus as any };
        setSelectedEnquiry(updated);
        setEnquiries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      }
    } catch {
      alert('Failed to update status.');
    }
  };

  // Save Staff Notes
  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffNotes: currentNotes }),
      });

      if (res.ok) {
        const updated = { ...selectedEnquiry, staffNotes: currentNotes };
        setSelectedEnquiry(updated);
        setEnquiries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
        alert('Notes saved.');
      }
    } catch {
      alert('Failed to save notes.');
    } finally {
      setSavingNote(false);
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    if (statusFilter !== 'ALL' && e.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.phone.toLowerCase().includes(q) ||
        e.enquiryNumber.toLowerCase().includes(q) ||
        (e.product?.name && e.product.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusColor = (st: string) => {
    switch (st) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONTACTED':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'QUOTED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'FOLLOW_UP':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CLOSED':
        return 'bg-stone-200 text-stone-700 border-stone-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block mb-1">
          Customer Inquiries & Sales Pipeline
        </span>
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">
          Enquiry CRM Management
        </h1>
      </div>

      {/* Control Filter Strip */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-stone-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, phone, enquiry number..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs pb-1 md:pb-0">
          {['ALL', 'NEW', 'CONTACTED', 'QUOTED', 'FOLLOW_UP', 'COMPLETED', 'CLOSED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                statusFilter === st
                  ? 'bg-charcoal-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {st === 'ALL' ? 'All' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column CRM Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Enquiry List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs text-stone-500 font-medium px-1">
            Showing {filteredEnquiries.length} customer records
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredEnquiries.map((enq) => (
              <button
                key={enq.id}
                onClick={() => handleSelect(enq)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedEnquiry?.id === enq.id
                    ? 'bg-white border-charcoal-900 shadow-stone-md ring-1 ring-charcoal-900'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-charcoal-900">
                    {enq.enquiryNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(enq.status)}`}>
                    {enq.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="font-semibold text-charcoal-900 text-sm">
                  {enq.name}
                </div>

                <div className="text-xs text-stone-500 mt-0.5">
                  {enq.phone} {enq.email && `• ${enq.email}`}
                </div>

                {enq.product && (
                  <div className="mt-2 text-xs font-medium text-bronze-700 bg-stone-50 px-2 py-1 rounded border border-stone-100 inline-block">
                    {enq.product.name} ({enq.product.productCode})
                  </div>
                )}

                <div className="text-[11px] text-stone-400 mt-2 flex justify-between">
                  <span>Req: {enq.quantity || (enq.approxAreaSqft ? `${enq.approxAreaSqft} sq.ft.` : 'General')}</span>
                  <span>{formatIndianDate(enq.createdAt)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Detail Card & Actions (7 Cols) */}
        {selectedEnquiry && (
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-stone-md space-y-6">
            
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-stone-500">
                    {selectedEnquiry.enquiryNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(selectedEnquiry.status)}`}>
                    {selectedEnquiry.status.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-charcoal-900">
                  {selectedEnquiry.name}
                </h2>
                <div className="text-xs text-stone-500">
                  Received: {formatIndianDate(selectedEnquiry.createdAt)}
                </div>
              </div>

              {/* Convert to formal quote button */}
              <Link
                href={`/admin/quotations/new?enquiryId=${selectedEnquiry.id}&name=${encodeURIComponent(selectedEnquiry.name)}&phone=${encodeURIComponent(selectedEnquiry.phone)}&email=${encodeURIComponent(selectedEnquiry.email || '')}&area=${selectedEnquiry.approxAreaSqft || ''}&productId=${selectedEnquiry.productId || ''}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-bronze-600 hover:bg-bronze-700 text-white text-xs font-semibold uppercase tracking-wider rounded shadow-stone-sm transition-colors self-start sm:self-auto"
              >
                <FileText className="w-4 h-4" />
                <span>Prepare Quotation</span>
              </Link>
            </div>

            {/* Customer Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div>
                <span className="text-stone-400 block text-[11px]">Contact Mobile:</span>
                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="font-bold text-charcoal-900 hover:underline inline-flex items-center gap-1.5 mt-0.5"
                >
                  <Phone className="w-3.5 h-3.5 text-bronze-600" />
                  <span>{selectedEnquiry.phone}</span>
                </a>
              </div>

              <div>
                <span className="text-stone-400 block text-[11px]">WhatsApp Quick Link:</span>
                <a
                  href={`https://wa.me/${(selectedEnquiry.whatsapp || selectedEnquiry.phone).replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-700 hover:underline inline-flex items-center gap-1.5 mt-0.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chat with Customer</span>
                </a>
              </div>

              {selectedEnquiry.email && (
                <div>
                  <span className="text-stone-400 block text-[11px]">Email Address:</span>
                  <span className="text-stone-700">{selectedEnquiry.email}</span>
                </div>
              )}

              <div>
                <span className="text-stone-400 block text-[11px]">Estimated Requirement:</span>
                <span className="font-semibold text-charcoal-900">
                  {selectedEnquiry.quantity || '—'} {selectedEnquiry.approxAreaSqft ? `(${selectedEnquiry.approxAreaSqft} sq.ft.)` : ''}
                </span>
              </div>
            </div>

            {/* Attached Stone Product if any */}
            {selectedEnquiry.product && (
              <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                  Product Inquired
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-base text-charcoal-900">
                      {selectedEnquiry.product.name}
                    </h4>
                    <span className="font-mono text-xs text-stone-500">
                      {selectedEnquiry.product.productCode} • {selectedEnquiry.product.format} • {selectedEnquiry.product.material}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-500 block">Ex-Factory Rate</span>
                    <strong className="font-sans text-sm font-bold text-charcoal-900">
                      ₹{selectedEnquiry.product.pricePerSqft} / sq.ft.
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Message */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                Customer Requirement Message
              </span>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-800 leading-relaxed italic whitespace-pre-line">
                &quot;{selectedEnquiry.message}&quot;
              </div>
            </div>

            {/* CRM Status Workflow Selector (Section 30) */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Update CRM Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['NEW', 'CONTACTED', 'QUOTED', 'FOLLOW_UP', 'COMPLETED', 'CLOSED'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(st)}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all text-left flex items-center justify-between ${
                      selectedEnquiry.status === st
                        ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>{st.replace('_', ' ')}</span>
                    {selectedEnquiry.status === st && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Internal Staff Notes */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Internal Staff Notes & Action Log
                </label>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNote}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-800 hover:bg-stone-900 text-white text-[11px] font-semibold uppercase tracking-wider rounded"
                >
                  <Save className="w-3 h-3" />
                  <span>{savingNote ? 'Saving...' : 'Save Note'}</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={currentNotes}
                onChange={(e) => setCurrentNotes(e.target.value)}
                placeholder="Log discussion notes, dispatch dates, customer preferences, or quote follow-ups..."
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
              />
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
