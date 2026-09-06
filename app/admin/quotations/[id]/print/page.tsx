import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { formatINR, formatIndianDate } from '@/lib/utils';
import { Printer, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PrintPageProps {
  params: Promise<{ id: string }>;
}

export default async function QuotationPrintPage({ params }: PrintPageProps) {
  const session = await getCurrentUser();
  if (!session || !['ADMIN', 'STAFF'].includes(session.role)) {
    redirect('/login');
  }

  const { id } = await params;

  const quote = await prisma.quotation.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });

  if (!quote) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-100 p-4 sm:p-8 print:p-0 print:bg-white flex flex-col items-center">
      
      {/* Top Action Bar (Hidden in Print) */}
      <div className="no-print w-full max-w-4xl mb-6 flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-stone-sm">
        <Link
          href="/admin/quotations"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-charcoal-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Quotations</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500 hidden sm:inline">
            Official Commercial Estimate • Kelwa Stockyard
          </span>
          <button
            type="button"
            onClick={undefined}
            // Client script or browser print trigger
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-bold uppercase tracking-wider rounded shadow-stone-sm transition-colors cursor-pointer"
            id="print-trigger-btn"
          >
            <Printer className="w-4 h-4" />
            <span>Print Quotation / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Formal Commercial Quotation Sheet */}
      <div className="quotation-sheet w-full max-w-4xl bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 shadow-stone-md print:shadow-none print:border-none print:p-0 print:max-w-full space-y-6 text-charcoal-900">
        
        {/* Letterhead Header */}
        <div className="flex items-start justify-between border-b-2 border-stone-900 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-charcoal-900 text-white font-serif font-bold text-xl flex items-center justify-center rounded">
                MMG
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold text-charcoal-950">
                  Mahadev Marble and Granite Pvt. Ltd.
                </h1>
                <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold block">
                  Raghunathpura Yard • Kelwa, Rajasthan
                </span>
              </div>
            </div>

            <div className="text-xs text-stone-600 leading-relaxed max-w-md">
              Mahadev Marble and Granite, Raghunathpura, Kelwa, Rajasthan, India<br />
              <strong>Phone:</strong> +91 98290 12345 • <strong>Email:</strong> sales@mahadevmarble.com
            </div>
          </div>

          <div className="text-right">
            <div className="inline-block px-3 py-1 bg-stone-100 rounded text-xs font-bold font-mono text-charcoal-900 mb-2 border border-stone-200">
              COMMERCIAL ESTIMATE / QUOTATION
            </div>
            <div className="font-mono text-base font-bold text-charcoal-950">
              {quote.quotationNumber}
            </div>
            <div className="text-xs text-stone-600 mt-1">
              <strong>Date:</strong> {formatIndianDate(quote.createdAt)}
            </div>
            {quote.validUntil && (
              <div className="text-xs text-stone-500">
                <strong>Valid Until:</strong> {formatIndianDate(quote.validUntil)}
              </div>
            )}
          </div>
        </div>

        {/* Consignee / Dispatch Details */}
        <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 grid grid-cols-2 gap-6 text-xs print:bg-white print:border print:border-stone-300">
          <div>
            <span className="text-stone-400 block text-[11px] font-bold uppercase tracking-wider">
              Client / Consignee:
            </span>
            <strong className="text-charcoal-950 text-sm font-bold block mt-1">
              {quote.customerName}
            </strong>
            <div className="text-stone-700 mt-0.5">Mobile: {quote.customerPhone}</div>
            {quote.customerEmail && (
              <div className="text-stone-700">Email: {quote.customerEmail}</div>
            )}
            {quote.customerAddress && (
              <div className="text-stone-600 mt-1">
                <strong>Site / Delivery:</strong> {quote.customerAddress}
              </div>
            )}
          </div>

          <div>
            <span className="text-stone-400 block text-[11px] font-bold uppercase tracking-wider">
              Dispatch & Loading Terms:
            </span>
            <div className="text-stone-700 mt-1">
              <strong>Dispatch Yard:</strong> Raghunathpura Stockyard, Kelwa, Rajasthan
            </div>
            <div className="text-stone-700">
              <strong>Packaging:</strong> Heavy-duty export wooden crating with EVA foam spacers
            </div>
            <div className="text-stone-700">
              <strong>Commodity:</strong> Worked Monumental & Building Natural Stone
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
              {quote.items.map((item, idx) => (
                <tr key={item.id}>
                  <td className="py-3 font-mono text-stone-400">{idx + 1}</td>
                  <td className="py-3 font-semibold text-charcoal-950">
                    {item.description}
                  </td>
                  <td className="py-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                      {item.format}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono">
                    {item.quantitySqft.toLocaleString('en-IN')} sq.ft.
                  </td>
                  <td className="py-3 text-right font-mono">
                    ₹{item.ratePerSqft.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-charcoal-950">
                    {formatINR(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Calculation Summary */}
        <div className="border-t-2 border-stone-200 pt-4 flex flex-col items-end space-y-2 text-xs">
          <div className="w-72 space-y-2">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-charcoal-900">{formatINR(quote.subtotal)}</span>
            </div>

            {quote.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Showroom Discount:</span>
                <span>- {formatINR(quote.discount)}</span>
              </div>
            )}

            {quote.additionalCharges > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>Freight & Wooden Crating:</span>
                <span>+ {formatINR(quote.additionalCharges)}</span>
              </div>
            )}

            <div className="flex justify-between text-stone-600">
              <span>GST ({quote.gstRate}%):</span>
              <span className="font-semibold text-charcoal-900">{formatINR(quote.gstAmount)}</span>
            </div>

            <div className="flex justify-between text-base font-bold text-charcoal-950 pt-2 border-t-2 border-stone-900">
              <span>Estimated Total:</span>
              <span>{formatINR(quote.total)}</span>
            </div>
          </div>
        </div>

        {/* Terms of Estimate */}
        <div className="border-t border-stone-200 pt-6 grid grid-cols-2 gap-6 text-[11px] text-stone-500">
          <div>
            <strong className="text-charcoal-900 block mb-1">Commercial Terms & Conditions:</strong>
            <p className="whitespace-pre-line leading-relaxed">
              {quote.termsAndConditions || '1. 50% advance with formal work order, balance prior to vehicle loading at yard.\n2. Natural stone variation in vein structure, crystal clusters, and tonal depth is inherent to quarried marble and granite.\n3. Material inspection welcome at Raghunathpura, Kelwa stockyard prior to crate packing.'}
            </p>
          </div>

          <div className="text-right flex flex-col justify-end space-y-4">
            <div className="text-stone-400">For Mahadev Marble and Granite Pvt. Ltd.</div>
            <div className="h-10" />
            <div className="border-t border-stone-300 pt-1 font-semibold text-charcoal-900">
              Showroom Representative • Kelwa Facility
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Print Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('print-trigger-btn')?.addEventListener('click', function() {
              window.print();
            });
            if (new URLSearchParams(window.location.search).get('auto') === 'true') {
              window.print();
            }
          `,
        }}
      />
    </div>
  );
}
