'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  FileQuestion,
  FileCheck,
  LogOut,
  ArrowRight,
  Printer,
  Calculator,
  FolderPlus,
  Plus,
  Info,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { formatINR, formatIndianDate } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface EnquiryItem {
  id: string;
  enquiryNumber: string;
  quantity?: string | null;
  approxAreaSqft?: number | null;
  message: string;
  status: string;
  createdAt: string;
  product?: {
    name: string;
    productCode: string;
    format: string;
  } | null;
}

interface QuotationItem {
  id: string;
  quotationNumber: string;
  subtotal: number;
  discount: number;
  additionalCharges: number;
  taxLabel?: string;
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

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

interface AccountClientProps {
  user: UserProfile;
  enquiries: EnquiryItem[];
  quotations: QuotationItem[];
}

const VALID_TABS = ['quotations', 'enquiries', 'requirements', 'calculator', 'profile'] as const;
type TabType = typeof VALID_TABS[number];

export default function AccountClient({ user, enquiries, quotations }: AccountClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();

  const tabFromUrl = searchParams.get('tab') as TabType;
  const [activeTab, setActiveTab] = useState<TabType>(
    VALID_TABS.includes(tabFromUrl) ? tabFromUrl : 'quotations'
  );
  const [selectedQuote, setSelectedQuote] = useState<QuotationItem | null>(quotations[0] || null);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType;
    if (tabParam && VALID_TABS.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const switchTab = (tab: TabType) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState(null, '', url.toString());
    }
  };

  // Requirements State
  const [requirements, setRequirements] = useState<any[]>([]);
  const [loadingRequirements, setLoadingRequirements] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    projectName: '',
    application: 'Flooring',
    approxAreaSqft: '1000',
    budget: '',
    material: 'Marble',
    message: '',
  });

  // Cost Calculator State
  const [calcArea, setCalcArea] = useState<number>(1000);
  const [calcWastage, setCalcWastage] = useState<number>(10);
  const [calcRate, setCalcRate] = useState<number>(220);
  const [calcCrating, setCalcCrating] = useState<boolean>(true);
  const [calcFreightRate, setCalcFreightRate] = useState<number>(15); // ₹15/sq.ft. estimated freight

  const fetchRequirements = async () => {
    setLoadingRequirements(true);
    try {
      const res = await fetch('/api/requirements');
      if (res.ok) {
        const data = await res.json();
        setRequirements(data.requirements || []);
      }
    } catch {
      // ignore
    } finally {
      setLoadingRequirements(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'requirements') {
      fetchRequirements();
    }
  }, [activeTab]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectData.projectName.trim()) return;

    try {
      const res = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: newProjectData.projectName,
          application: newProjectData.application,
          approxAreaSqft: parseFloat(newProjectData.approxAreaSqft) || 1000,
          budget: newProjectData.budget ? parseFloat(newProjectData.budget) : null,
          material: newProjectData.material,
          message: newProjectData.message,
        }),
      });

      if (res.ok) {
        setShowNewProjectModal(false);
        setNewProjectData({
          projectName: '',
          application: 'Flooring',
          approxAreaSqft: '1000',
          budget: '',
          material: 'Marble',
          message: '',
        });
        fetchRequirements();
      }
    } catch {
      // ignore
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('mmg_user');
    window.dispatchEvent(new Event('mmg_state_change'));
    window.location.replace('/');
  };

  // Calculator calculations
  const totalWithWastage = Math.round(calcArea * (1 + calcWastage / 100));
  const materialCost = totalWithWastage * calcRate;
  const estimatedCrating = calcCrating ? totalWithWastage * 8 : 0; // approx ₹8/sq.ft. crating
  const estimatedFreight = totalWithWastage * calcFreightRate;
  const totalEstimatedCost = materialCost + estimatedCrating + estimatedFreight;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">New Submission</span>;
      case 'CONTACTED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">Sales Contacted</span>;
      case 'QUOTED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-100 text-purple-800">Quotation Prepared</span>;
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">Order Completed</span>;
      case 'SENT':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">Formal Quotation Issued</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-stone-200 text-stone-800">{status}</span>;
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back Option */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 shadow-stone-sm transition-all hover:-translate-x-0.5 active:translate-x-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-stone-600" />
            <span>{language === 'hi' ? 'मुख्य शो-रूम पर वापस जाएं' : 'Back to Showroom'}</span>
          </Link>
        </div>

        {/* Welcome Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-stone-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-charcoal-900 text-stone-100 font-serif text-2xl font-bold rounded-full flex items-center justify-center border border-stone-700">
              {user.name.charAt(0)}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block">
                {t('customerPortal')}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
                {user.name}
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                {user.email} • {user.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/catalogue"
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded transition-colors"
            >
              Browse Catalogue
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded border border-rose-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('signOut')}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3 text-xs font-semibold">
          <button
            onClick={() => switchTab('quotations')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'quotations'
                ? 'bg-charcoal-900 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>My Quotations ({quotations.length})</span>
          </button>

          <button
            onClick={() => switchTab('requirements')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'requirements'
                ? 'bg-charcoal-900 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>My Projects & Requirements</span>
          </button>

          <button
            onClick={() => switchTab('calculator')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'calculator'
                ? 'bg-charcoal-900 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Cost Estimator (Calculator)</span>
          </button>

          <button
            onClick={() => switchTab('enquiries')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'enquiries'
                ? 'bg-charcoal-900 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <FileQuestion className="w-4 h-4" />
            <span>My Enquiries ({enquiries.length})</span>
          </button>

          <button
            onClick={() => switchTab('profile')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-charcoal-900 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </div>

        {/* TAB 1: FORMAL QUOTATIONS */}
        {activeTab === 'quotations' && (
          <div className="space-y-6">
            {quotations.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-stone-200 space-y-3">
                <FileCheck className="w-10 h-10 text-stone-400 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-charcoal-900">
                  No Formal Quotations Issued Yet
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  When MMG sales specialists prepare an official stone estimate with crating, freight, and taxes, it will be itemized here.
                </p>
                <Link
                  href="/send-requirement"
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-bronze-600 hover:underline"
                >
                  <span>Request a Quotation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Quotation List (Left 4 cols) */}
                <div className="lg:col-span-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Received Quotations & Estimates
                  </h3>
                  {quotations.map((q) => (
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
                        {getStatusBadge(q.status)}
                      </div>
                      <div className="text-xs text-stone-500">
                        Date: {formatIndianDate(q.createdAt)}
                      </div>
                      <div className="mt-2 pt-2 border-t border-stone-100 flex justify-between items-baseline">
                        <span className="text-[11px] text-stone-400">Total Estimate</span>
                        <span className="font-sans text-sm font-bold text-charcoal-900">
                          {formatINR(q.total)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Quotation Sheet (Right 8 cols) */}
                {selectedQuote && (
                  <div className="lg:col-span-8 bg-white p-8 sm:p-10 rounded-2xl border border-stone-200 shadow-stone-md quotation-sheet">
                    <div className="flex items-start justify-between border-b border-stone-200 pb-6 mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-8 h-8 bg-charcoal-900 text-white font-serif font-bold text-sm flex items-center justify-center rounded">
                            MMG
                          </span>
                          <span className="font-serif text-lg font-bold text-charcoal-900">
                            Mahadev Marble & Granite Pvt. Ltd.
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          Mahadev Marble and Granite, Raghunathpura, Kelwa<br />
                          Phone: +91 98873 90222 • Email: rahulborana1306@gmail.com
                        </p>
                      </div>

                      <div className="text-right">
                        <button
                          onClick={() => window.print()}
                          className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded mb-2 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print / Save PDF</span>
                        </button>
                        <div className="font-mono text-sm font-bold text-charcoal-900">
                          {selectedQuote.quotationNumber}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          Issued: {formatIndianDate(selectedQuote.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 text-xs mb-6 grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-stone-400 block text-[11px]">Quotation Prepared For:</span>
                        <strong className="text-charcoal-900 font-semibold">{user.name}</strong>
                        <div className="text-stone-600">{user.phone}</div>
                        <div className="text-stone-600">{user.email}</div>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[11px]">Validity & Terms:</span>
                        <div className="text-stone-600">
                          {selectedQuote.validUntil
                            ? `Valid until ${formatIndianDate(selectedQuote.validUntil)}`
                            : 'Valid for 14 days from issue date'}
                        </div>
                        <div className="text-emerald-700 font-medium mt-1">
                          Delivery: Crated Dispatch from Raghunathpura, Kelwa Yard
                        </div>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto mb-6">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="border-b-2 border-stone-200 text-stone-500 uppercase tracking-wider">
                            <th className="py-2.5 text-left">Item Description</th>
                            <th className="py-2.5 text-center">Format</th>
                            <th className="py-2.5 text-right">Quantity (sq.ft.)</th>
                            <th className="py-2.5 text-right">Rate / sq.ft.</th>
                            <th className="py-2.5 text-right">Amount (₹)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-charcoal-900">
                          {selectedQuote.items.map((item) => (
                            <tr key={item.id}>
                              <td className="py-3 font-medium">{item.description}</td>
                              <td className="py-3 text-center">
                                <span className="px-2 py-0.5 bg-stone-100 rounded text-[10px] font-bold">
                                  {item.format}
                                </span>
                              </td>
                              <td className="py-3 text-right">{item.quantitySqft} sq.ft.</td>
                              <td className="py-3 text-right">{formatINR(item.ratePerSqft)}</td>
                              <td className="py-3 text-right font-semibold">{formatINR(item.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Summary */}
                    <div className="border-t border-stone-200 pt-4 max-w-xs ml-auto text-xs space-y-2">
                      <div className="flex justify-between text-stone-600">
                        <span>Subtotal:</span>
                        <span className="font-semibold">{formatINR(selectedQuote.subtotal)}</span>
                      </div>
                      {selectedQuote.discount > 0 && (
                        <div className="flex justify-between text-emerald-700">
                          <span>Discount:</span>
                          <span>- {formatINR(selectedQuote.discount)}</span>
                        </div>
                      )}
                      {selectedQuote.additionalCharges > 0 && (
                        <div className="flex justify-between text-stone-600">
                          <span>Freight & Crating:</span>
                          <span>+ {formatINR(selectedQuote.additionalCharges)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-stone-600">
                        <span>{selectedQuote.taxLabel || 'GST'} ({selectedQuote.gstRate}%):</span>
                        <span>+ {formatINR(selectedQuote.gstAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-charcoal-950 pt-2 border-t border-stone-300">
                        <span>Grand Total (INR):</span>
                        <span>{formatINR(selectedQuote.total)}</span>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-stone-200 text-xs text-stone-500">
                      <strong className="text-charcoal-900 block mb-1">Official Quotation Disclaimer:</strong>
                      <p className="leading-relaxed">
                        This document constitutes a commercial estimate and quotation. It is not a tax invoice. Final billing will be generated upon final weighing and dispatch inspection at Raghunathpura, Kelwa yard.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY PROJECTS & REQUIREMENTS */}
        {activeTab === 'requirements' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div>
                <h2 className="font-serif text-xl font-bold text-charcoal-900">
                  Saved Projects & Material Requirements
                </h2>
                <p className="text-xs text-stone-500">
                  Organize your home or villa projects, save shortlisted stones, and request formal estimates.
                </p>
              </div>

              <button
                onClick={() => setShowNewProjectModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-charcoal-900 text-white text-xs font-semibold rounded hover:bg-charcoal-800 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Project</span>
              </button>
            </div>

            {loadingRequirements ? (
              <div className="p-12 text-center text-xs text-stone-500">Loading your project list...</div>
            ) : requirements.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-stone-200 space-y-3">
                <FolderPlus className="w-10 h-10 text-stone-400 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-charcoal-900">
                  No Saved Projects Yet
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Create a project like &quot;Living Room Flooring&quot; or &quot;Master Kitchen&quot; to calculate material square footage and receive customized MMG quotes.
                </p>
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-charcoal-900 text-white text-xs font-semibold uppercase tracking-wider rounded"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Start a Project</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {requirements.map((req) => (
                  <div key={req.id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-stone-sm space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-bronze-600">
                          {req.application || 'General Project'}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-charcoal-900 mt-0.5">
                          {req.projectName}
                        </h3>
                      </div>
                      <span className="px-2.5 py-0.5 bg-stone-100 rounded text-[10px] font-bold text-charcoal-800">
                        {req.status}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 space-y-1 pt-1 border-t border-stone-100">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Required Area:</span>
                        <strong className="text-charcoal-900">{req.approxAreaSqft || '—'} sq.ft.</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Material Choice:</span>
                        <span>{req.material || 'Natural Stone'}</span>
                      </div>
                      {req.budget && (
                        <div className="flex justify-between">
                          <span className="text-stone-400">Budget Target:</span>
                          <span>₹{req.budget}</span>
                        </div>
                      )}
                    </div>

                    {req.message && (
                      <p className="text-xs text-stone-500 italic bg-stone-50 p-2.5 rounded border border-stone-100">
                        &quot;{req.message}&quot;
                      </p>
                    )}

                    <div className="pt-2 flex gap-2">
                      <Link
                        href={`/send-requirement?project=${encodeURIComponent(req.projectName)}`}
                        className="w-full py-2 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold rounded text-center block transition-colors"
                      >
                        Request MMG Quotation for this Project
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Create Project Modal */}
            {showNewProjectModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 border border-stone-200 shadow-stone-xl">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h3 className="font-serif text-lg font-bold text-charcoal-900">
                      Create Project / Requirement
                    </h3>
                    <button
                      onClick={() => setShowNewProjectModal(false)}
                      className="text-stone-400 hover:text-stone-600"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Project Name *</label>
                      <input
                        type="text"
                        required
                        value={newProjectData.projectName}
                        onChange={(e) => setNewProjectData({ ...newProjectData, projectName: e.target.value })}
                        placeholder="e.g. Master Bedroom & Lobby Flooring"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-charcoal-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Application</label>
                        <select
                          value={newProjectData.application}
                          onChange={(e) => setNewProjectData({ ...newProjectData, application: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-charcoal-900"
                        >
                          <option value="Flooring">Living & Bedroom Flooring</option>
                          <option value="Kitchen Platform">Kitchen Platform / Countertop</option>
                          <option value="Wall Cladding">Feature Wall Cladding</option>
                          <option value="Staircase">Staircase Steps & Risers</option>
                          <option value="Bathroom">Bathroom Vanity & Walls</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Approx Area (sq.ft.)</label>
                        <input
                          type="number"
                          value={newProjectData.approxAreaSqft}
                          onChange={(e) => setNewProjectData({ ...newProjectData, approxAreaSqft: e.target.value })}
                          placeholder="1000"
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-charcoal-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Project Notes / Details</label>
                      <textarea
                        rows={3}
                        value={newProjectData.message}
                        onChange={(e) => setNewProjectData({ ...newProjectData, message: e.target.value })}
                        placeholder="e.g. Need 18mm thickness, bookmatch pattern, dispatch required within 3 weeks."
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-charcoal-900"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowNewProjectModal(false)}
                        className="px-4 py-2 bg-stone-100 text-stone-700 font-semibold rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-charcoal-900 text-white font-semibold rounded shadow-sm hover:bg-charcoal-800"
                      >
                        Save Project
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: APPROXIMATE COST CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-200 shadow-stone-md space-y-8">
            <div className="border-b border-stone-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block mb-1">
                Planning Tool • नाप व खर्च का अनुमान
              </span>
              <h2 className="font-serif text-2xl font-bold text-charcoal-900">
                Approximate Stone Requirement & Cost Calculator
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-1">
                Calculate necessary square footage including gangsaw cutting wastage margins and indicative transport estimates.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Inputs (7 cols) */}
              <div className="lg:col-span-7 space-y-5 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-stone-700">1. Required Net Area (sq.ft.)</label>
                    <span className="font-bold text-sm text-charcoal-900">{calcArea} sq.ft.</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="50"
                    value={calcArea}
                    onChange={(e) => setCalcArea(Number(e.target.value))}
                    className="w-full accent-charcoal-900 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                    <span>100 sq.ft. (Small room)</span>
                    <span>2500 sq.ft. (Floor)</span>
                    <span>5000 sq.ft. (Full villa)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-stone-700">2. Recommended Cutting & Skirting Wastage Margin</label>
                    <span className="font-bold text-sm text-charcoal-900">{calcWastage}%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {[5, 10, 15].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setCalcWastage(pct)}
                        className={`p-2.5 rounded-lg border text-center transition-colors ${
                          calcWastage === pct
                            ? 'bg-charcoal-900 text-white border-charcoal-900 font-bold'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {pct}% Wastage
                        <span className="block text-[10px] opacity-80">
                          {pct === 5 ? 'Straight cut' : pct === 10 ? 'Recommended' : 'Angle/Diagonal'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-stone-700">3. Indicative Stone Rate (₹ / sq.ft.)</label>
                    <span className="font-bold text-sm text-charcoal-900">₹{calcRate} / sq.ft.</span>
                  </div>
                  <div className="flex gap-2 mb-2">
                    {[65, 145, 220, 450, 950].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setCalcRate(rate)}
                        className={`px-3 py-1 rounded text-[11px] font-semibold border transition-colors ${
                          calcRate === rate
                            ? 'bg-charcoal-900 text-white border-charcoal-900'
                            : 'bg-stone-50 text-stone-700 border-stone-200'
                        }`}
                      >
                        ₹{rate}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={calcRate}
                    onChange={(e) => setCalcRate(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900"
                    placeholder="Enter custom rate"
                  />
                </div>

                <div className="pt-2 border-t border-stone-100 space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={calcCrating}
                      onChange={(e) => setCalcCrating(e.target.checked)}
                      className="rounded border-stone-300 text-bronze-600 focus:ring-bronze-500 w-4 h-4"
                    />
                    <span className="text-xs text-stone-700">Include Heavy Wooden Frame Crating (~₹8 / sq.ft.)</span>
                  </label>
                </div>
              </div>

              {/* Estimate Summary (5 cols) */}
              <div className="lg:col-span-5 bg-stone-50 p-6 sm:p-7 rounded-xl border border-stone-200 space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  Material Calculation Summary
                </span>

                <div className="space-y-2.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Net Required Area:</span>
                    <span className="font-semibold text-charcoal-900">{calcArea} sq.ft.</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wastage Allowance ({calcWastage}%):</span>
                    <span>+ {totalWithWastage - calcArea} sq.ft.</span>
                  </div>
                  <div className="flex justify-between text-charcoal-900 font-bold pt-1 border-t border-stone-200">
                    <span>Approximate Quantity to Order:</span>
                    <span>{totalWithWastage} sq.ft.</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 space-y-2 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Material Cost (@ ₹{calcRate}/sq.ft.):</span>
                    <span className="font-semibold text-charcoal-900">{formatINR(materialCost)}</span>
                  </div>
                  {calcCrating && (
                    <div className="flex justify-between">
                      <span>Wooden Crating Allowance:</span>
                      <span>+ {formatINR(estimatedCrating)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Estimated Transit Allowance (~₹{calcFreightRate}/sq.ft.):</span>
                    <span>+ {formatINR(estimatedFreight)}</span>
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-stone-300">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
                      Estimated Cost:
                    </span>
                    <span className="font-sans text-2xl font-bold text-charcoal-950">
                      {formatINR(totalEstimatedCost)}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    * Applicable GST to be added as per final invoicing.
                  </span>
                </div>

                {/* Important Notice Callout */}
                <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-lg text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Important Estimation Notice:</strong> This is an approximate planning estimate and NOT a final bill. The final quotation will be confirmed by MMG based on actual physical slab lot selection, transport distance, wastage, negotiation, and applicable taxes.
                  </div>
                </div>

                <div className="pt-1">
                  <Link
                    href={`/send-requirement?area=${totalWithWastage}&budget=${formatINR(totalEstimatedCost)}`}
                    className="w-full py-3 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-widest rounded text-center block transition-colors"
                  >
                    Request Confirmed MMG Quotation
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: ENQUIRIES HISTORY */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            {enquiries.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-stone-200 space-y-3">
                <FileQuestion className="w-10 h-10 text-stone-400 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-charcoal-900">
                  No Enquiries Logged Yet
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  When you submit an enquiry on any stone or through Help Me Choose, it will appear here with live sales status.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-stone-sm">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase">
                    <tr>
                      <th className="p-4">Enquiry No.</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Stone Product</th>
                      <th className="p-4">Quantity / Area</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {enquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-stone-50/50">
                        <td className="p-4 font-mono font-bold text-charcoal-900">
                          {enq.enquiryNumber}
                        </td>
                        <td className="p-4 text-stone-500">
                          {formatIndianDate(enq.createdAt)}
                        </td>
                        <td className="p-4 font-medium text-charcoal-900">
                          {enq.product ? `${enq.product.name} (${enq.product.productCode})` : 'General Inquiry'}
                        </td>
                        <td className="p-4 text-stone-600">
                          {enq.quantity || (enq.approxAreaSqft ? `${enq.approxAreaSqft} sq.ft.` : '—')}
                        </td>
                        <td className="p-4">
                          {getStatusBadge(enq.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white p-8 rounded-2xl border border-stone-200 max-w-xl shadow-stone-sm space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 pb-2 border-b border-stone-100">
              Customer Profile Details
            </h3>
            <div>
              <span className="text-stone-400 block text-[11px]">Full Name</span>
              <span className="font-semibold text-charcoal-900 text-sm">{user.name}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">Email Address</span>
              <span className="font-semibold text-charcoal-900">{user.email}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">Mobile Number</span>
              <span className="font-semibold text-charcoal-900">{user.phone}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">Account Type</span>
              <span className="font-semibold text-charcoal-900">{user.role}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">Member Since</span>
              <span className="text-stone-600">{formatIndianDate(user.createdAt)}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
