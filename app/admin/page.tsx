import React from 'react';
import Link from 'next/link';
import {
  Package,
  Layers,
  FileQuestion,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Compass,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatIndianDate, formatINR } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Aggregate Metrics
  const totalProducts = await prisma.product.count();
  const marbleSlabs = await prisma.product.count({
    where: { material: 'Marble', format: 'SLAB' },
  });
  const graniteSlabs = await prisma.product.count({
    where: { material: 'Granite', format: 'SLAB' },
  });
  
  // Physical Slabs in yard
  const totalPhysicalSlabs = await prisma.slabInventory.count();
  const availablePhysicalSlabs = await prisma.slabInventory.count({
    where: { status: 'AVAILABLE' },
  });
  const reservedPhysicalSlabs = await prisma.slabInventory.count({
    where: { status: 'RESERVED' },
  });

  // Leads and Quotations
  const newEnquiries = await prisma.enquiry.count({
    where: { status: 'NEW' },
  });
  const pendingQuotations = await prisma.quotation.count({
    where: { status: 'SENT' },
  });
  const totalRequirements = await prisma.requirement.count();

  // Enquiries grouped by source
  const enquiriesBySource = await prisma.enquiry.groupBy({
    by: ['source'],
    _count: { id: true },
  });

  // Recent 5 enquiries
  const recentEnquiries = await prisma.enquiry.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        select: { name: true, productCode: true },
      },
    },
  });

  // Recent 5 quotations
  const recentQuotations = await prisma.quotation.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block mb-1">
            Udaipur Facility Management • सुखेर यार्ड
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Showroom & Operations Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/slabs"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-50 text-charcoal-900 text-xs font-semibold uppercase tracking-wider rounded shadow-stone-sm transition-colors"
          >
            <Layers className="w-4 h-4 text-bronze-600" />
            <span>Manage Yard Slabs</span>
          </Link>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-wider rounded shadow-stone-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Stone</span>
          </Link>

          <Link
            href="/admin/quotations/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-bronze-600 hover:bg-bronze-700 text-white text-xs font-semibold uppercase tracking-wider rounded shadow-stone-sm transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Create Quotation</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        
        {/* Total Catalogue Varieties */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-stone-sm">
          <span className="text-stone-400 block text-[10px] font-bold uppercase">Stone Varieties</span>
          <span className="font-serif text-2xl font-bold text-charcoal-900 mt-1 block">
            {totalProducts}
          </span>
        </div>

        {/* Physical Slabs Total */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-stone-sm bg-stone-50/50">
          <span className="text-stone-500 block text-[10px] font-bold uppercase">Total Yard Slabs</span>
          <span className="font-serif text-2xl font-bold text-charcoal-950 mt-1 block">
            {totalPhysicalSlabs}
          </span>
        </div>

        {/* Available Slabs */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-stone-sm">
          <span className="text-emerald-700 block text-[10px] font-bold uppercase">Available Slabs</span>
          <span className="font-serif text-2xl font-bold text-emerald-700 mt-1 block">
            {availablePhysicalSlabs}
          </span>
        </div>

        {/* Reserved Slabs */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-stone-sm">
          <span className="text-amber-700 block text-[10px] font-bold uppercase">Held / Reserved</span>
          <span className="font-serif text-2xl font-bold text-amber-700 mt-1 block">
            {reservedPhysicalSlabs}
          </span>
        </div>

        {/* Marble Varieties */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-stone-sm">
          <span className="text-stone-400 block text-[10px] font-bold uppercase">Marble Lines</span>
          <span className="font-serif text-2xl font-bold text-charcoal-900 mt-1 block">
            {marbleSlabs}
          </span>
        </div>

        {/* Granite Varieties */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-stone-sm">
          <span className="text-stone-400 block text-[10px] font-bold uppercase">Granite Lines</span>
          <span className="font-serif text-2xl font-bold text-charcoal-900 mt-1 block">
            {graniteSlabs}
          </span>
        </div>

        {/* New Enquiries */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-stone-sm bg-amber-50/30">
          <span className="text-amber-800 block text-[10px] font-bold uppercase">New Enquiries</span>
          <span className="font-serif text-2xl font-bold text-amber-700 mt-1 block">
            {newEnquiries}
          </span>
        </div>

        {/* Issued Quotations */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-stone-sm">
          <span className="text-stone-400 block text-[10px] font-bold uppercase">Sent Quotes</span>
          <span className="font-serif text-2xl font-bold text-charcoal-900 mt-1 block">
            {pendingQuotations}
          </span>
        </div>

      </div>

      {/* Lead Generation Sources Strip */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-stone-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-bronze-600" />
            <h3 className="font-serif font-bold text-charcoal-900 text-sm">
              Lead Generation & Customer Acquisition Channels
            </h3>
          </div>
          <span className="text-[11px] text-stone-400">Total Customer Projects Logged: {totalRequirements}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-1">
          {enquiriesBySource.map((src) => (
            <div key={src.source || 'Direct'} className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-center">
              <span className="text-[10px] uppercase font-bold text-stone-500 block truncate">
                {src.source || 'Website Direct'}
              </span>
              <span className="font-serif text-xl font-bold text-charcoal-900 mt-0.5 block">
                {src._count.id}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column: Recent Enquiries + Recent Quotations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Enquiries */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-stone-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal-900">
                Incoming Customer Enquiries
              </h3>
              <p className="text-xs text-stone-500">
                Awaiting sales follow-up and slab photography sharing
              </p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-bronze-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentEnquiries.map((enq) => (
              <div
                key={enq.id}
                className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-charcoal-900">{enq.enquiryNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-stone-200">
                      {enq.status}
                    </span>
                    {enq.source && (
                      <span className="px-1.5 py-0.2 bg-stone-200 rounded text-[9px] font-bold text-stone-600 uppercase">
                        {enq.source}
                      </span>
                    )}
                  </div>
                  <strong className="text-charcoal-900 block">{enq.name}</strong>
                  <div className="text-stone-500">{enq.phone}</div>
                  <div className="text-stone-600 mt-1 line-clamp-1 italic">
                    &quot;{enq.message}&quot;
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-stone-400 block">
                    {formatIndianDate(enq.createdAt)}
                  </span>
                  <Link
                    href={`/admin/enquiries`}
                    className="inline-block mt-2 text-[11px] font-semibold text-bronze-700 hover:underline"
                  >
                    Open CRM →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quotations */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-stone-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal-900">
                Recent Issued Quotations
              </h3>
              <p className="text-xs text-stone-500">
                Commercial estimates with freight and applicable GST
              </p>
            </div>
            <Link
              href="/admin/quotations"
              className="text-xs font-semibold text-bronze-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentQuotations.map((q) => (
              <div
                key={q.id}
                className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-charcoal-900">{q.quotationNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      {q.status}
                    </span>
                  </div>
                  <strong className="text-charcoal-900 block">{q.customerName}</strong>
                  <div className="text-stone-500">{q.customerPhone}</div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-sans text-sm font-bold text-charcoal-900 block">
                    {formatINR(q.total)}
                  </span>
                  <span className="text-[11px] text-stone-400 block mt-0.5">
                    {formatIndianDate(q.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
