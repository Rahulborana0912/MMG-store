'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Printer, FileText, Search, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import { formatINR, formatIndianDate } from '@/lib/utils';

interface AdminQuotationItem {
  id: string;
  quotationNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  customerAddress?: string | null;
  subtotal: number;
  discount: number;
  additionalCharges: number;
  gstRate: number;
  gstAmount: number;
  total: number;
  status: string;
  validUntil?: string | null;
  notes?: string | null;
  termsAndConditions?: string | null;
  createdAt: string;
  items: {
    id: string;
    description: string;
    format: string;
    quantitySqft: number;
    ratePerSqft: number;
    amount: number;
  }[];
}

interface AdminQuotationsClientProps {
  initialQuotations: AdminQuotationItem[];
}

export default function AdminQuotationsClient({ initialQuotations }: AdminQuotationsClientProps) {
  const [quotations] = useState(initialQuotations);
  const [selectedQuote, setSelectedQuote] = useState<AdminQuotationItem | null>(initialQuotations[0] || null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuotes = quotations.filter((q) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      q.quotationNumber.toLowerCase().includes(term) ||
      q.customerName.toLowerCase().includes(term) ||
      q.customerPhone.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block mb-1">
            Formal Commercial Estimates
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Quotation Management & Generator
          </h1>
        </div>

        <Link
          href="/admin/quotations/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-wider rounded shadow-stone-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Prepare New Quotation</span>
        </Link>
      </div>

      {/* Control Strip */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-stone-sm flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by quote no. (MMG-QT-...), customer, or phone..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
          />
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Total Quotes: {filteredQuotes.length}
        </div>
      </div>

      {/* 2-Column Interface: List (4 cols) + Printable Quotation Preview (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Quotation Cards */}
        <div className="lg:col-span-4 space-y-3">
          {filteredQuotes.map((q) => (
            <button
              key={q.id}
              onClick={() => setSelectedQuote(q)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedQuote?.id === q.id
                  ? 'bg-white border-charcoal-900 shadow-stone-md ring-1 ring-charcoal-900'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-charcoal-900">
                  {q.quotationNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  {q.status}
                </span>
              </div>

              <div className="font-semibold text-charcoal-900 text-sm">
                {q.customerName}
              </div>

              <div className="text-xs text-stone-500 mt-0.5">
                {q.customerPhone}
              </div>

              <div className="mt-3 pt-2 border-t border-stone-100 flex justify-between items-baseline">
                <span className="text-[11px] text-stone-400">Total (Inc. 18% GST)</span>
                <span className="font-sans text-sm font-bold text-charcoal-900">
                  {formatINR(q.total)}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Right: Printable Indian Formal Quotation Layout */}
        {selectedQuote && (
          <div className="lg:col-span-8 bg-white p-8 sm:p-10 rounded-2xl border border-stone-200 shadow-stone-md quotation-sheet space-y-6">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between no-print border-b border-stone-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Official Estimate Preview
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={`/admin/quotations/${selectedQuote.id}/print`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-charcoal-900 text-xs font-semibold uppercase tracking-wider rounded border border-stone-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Isolated Print Tab</span>
                </a>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-wider rounded shadow-sm transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Quotation</span>
                </button>
              </div>
            </div>

            {/* Letterhead */}
            <div className="flex items-start justify-between border-b-2 border-stone-900 pb-6">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-10 h-10 bg-charcoal-900 text-white font-serif font-bold text-lg flex items-center justify-center rounded">
                    MMG
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-charcoal-950">
                      Mahadev Marble and Granite Pvt. Ltd.
                    </h2>
                    <span className="text-[11px] uppercase tracking-widest text-stone-500 font-medium block">
                      Quarry Processors • Exporters • Indian Natural Stone
                    </span>
                  </div>
                </div>

                <div className="text-xs text-stone-600 leading-relaxed max-w-sm">
                  Mahadev Marble and Granite, Raghunathpura, Kelwa<br />
                  <strong>Phone:</strong> +91 98290 12345 • <strong>Email:</strong> sales@mahadevmarble.com
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block px-3 py-1 bg-stone-100 rounded text-xs font-bold font-mono text-charcoal-900 mb-2">
                  ESTIMATE / QUOTATION
                </div>
                <div className="font-mono text-base font-bold text-charcoal-950">
                  {selectedQuote.quotationNumber}
                </div>
                <div className="text-xs text-stone-600 mt-1">
                  <strong>Date:</strong> {formatIndianDate(selectedQuote.createdAt)}
                </div>
                {selectedQuote.validUntil && (
                  <div className="text-xs text-stone-500">
                    <strong>Valid Until:</strong> {formatIndianDate(selectedQuote.validUntil)}
                  </div>
                )}
              </div>
            </div>

            {/* Customer Billed To */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block text-[11px] font-bold uppercase">
                  Consignee / Customer:
                </span>
                <strong className="text-charcoal-900 text-sm font-semibold block mt-0.5">
                  {selectedQuote.customerName}
                </strong>
                <div className="text-stone-700">Mobile: {selectedQuote.customerPhone}</div>
                {selectedQuote.customerEmail && (
                  <div className="text-stone-700">Email: {selectedQuote.customerEmail}</div>
                )}
                {selectedQuote.customerAddress && (
                  <div className="text-stone-600 mt-1">
                    <strong>Site:</strong> {selectedQuote.customerAddress}
                  </div>
                )}
              </div>

              <div>
                <span className="text-stone-400 block text-[11px] font-bold uppercase">
                  Dispatch & Loading Terms:
                </span>
                <div className="text-stone-700 mt-0.5">
                  <strong>Dispatch Point:</strong> Raghunathpura Yard, Kelwa, Rajasthan
                </div>
                <div className="text-stone-700">
                  <strong>Packaging:</strong> Heavy-duty export wooden crating with EVA spacers
                </div>
                <div className="text-stone-700">
                  <strong>HSN Code:</strong> 6802 (Worked monumental or building stone)
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-stone-300 text-stone-600 uppercase text-[11px]">
                    <th className="py-2.5 text-left w-10">#</th>
                    <th className="py-2.5 text-left">Description of Natural Stone</th>
                    <th className="py-2.5 text-center w-20">Format</th>
                    <th className="py-2.5 text-right w-28">Quantity</th>
                    <th className="py-2.5 text-right w-28">Rate / sq.ft.</th>
                    <th className="py-2.5 text-right w-32">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-charcoal-900">
                  {selectedQuote.items.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="py-3 text-stone-400">{idx + 1}</td>
                      <td className="py-3 font-semibold">{item.description}</td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 bg-stone-100 rounded text-[10px] font-bold">
                          {item.format}
                        </span>
                      </td>
                      <td className="py-3 text-right">{item.quantitySqft} sq.ft.</td>
                      <td className="py-3 text-right">{formatINR(item.ratePerSqft)}</td>
                      <td className="py-3 text-right font-bold">{formatINR(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Summary */}
            <div className="border-t border-stone-200 pt-4 max-w-sm ml-auto text-xs space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-charcoal-900">{formatINR(selectedQuote.subtotal)}</span>
              </div>
              {selectedQuote.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Special Discount:</span>
                  <span>- {formatINR(selectedQuote.discount)}</span>
                </div>
              )}
              {selectedQuote.additionalCharges > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Freight & Wooden Crating:</span>
                  <span>+ {formatINR(selectedQuote.additionalCharges)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>CGST (9%) + SGST (9%) [18%]:</span>
                <span className="font-semibold text-charcoal-900">{formatINR(selectedQuote.gstAmount)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-charcoal-950 pt-2 border-t-2 border-stone-900">
                <span>Total Amount (INR):</span>
                <span>{formatINR(selectedQuote.total)}</span>
              </div>
            </div>

            {/* Terms and Sign-off */}
            <div className="border-t border-stone-200 pt-6 grid grid-cols-2 gap-6 text-[11px] text-stone-500">
              <div>
                <strong className="text-charcoal-900 block mb-1">Terms & Conditions of Sale:</strong>
                <p className="whitespace-pre-line leading-relaxed">
                  {selectedQuote.termsAndConditions || '1. 50% advance with order, balance prior to loading.\n2. Natural stone variation in shade and veins is inherent.'}
                </p>
              </div>

              <div className="text-right flex flex-col justify-end space-y-4">
                <div className="text-stone-400">For Mahadev Marble and Granite Pvt. Ltd.</div>
                <div className="h-12" />
                <div className="border-t border-stone-300 pt-1 font-semibold text-charcoal-900">
                  Authorized Signatory (Kelwa Facility)
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
