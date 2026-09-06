import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import {
  LayoutDashboard,
  Package,
  Layers,
  FileQuestion,
  FileText,
  Settings,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import AdminLogoutButton from '@/components/AdminLogoutButton';
import AdminSessionGuard from '@/components/AdminSessionGuard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentUser();

  if (!session) {
    redirect('/login');
  }

  // Verify staff or admin role
  if (!['ADMIN', 'STAFF'].includes(session.role)) {
    redirect('/account');
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      <AdminSessionGuard />
      
      {/* Admin Sidebar Navigation */}
      <aside className="no-print w-full md:w-64 bg-charcoal-950 text-stone-300 p-5 shrink-0 flex flex-col justify-between border-r border-stone-800">
        <div>
          {/* Brand Header */}
          <div className="pb-6 border-b border-stone-800 mb-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-stone-900 border border-stone-700 text-white font-serif font-bold text-sm flex items-center justify-center rounded">
                MMG
              </div>
              <div>
                <span className="font-serif text-base font-bold text-white block leading-tight">
                  MMG Portal
                </span>
                <span className="text-[10px] text-stone-400 font-sans tracking-widest uppercase">
                  Staff & Admin CRM
                </span>
              </div>
            </Link>

            {/* Current Staff Badge */}
            <div className="mt-4 p-2.5 bg-stone-900/90 rounded-lg border border-stone-800 text-xs">
              <div className="font-semibold text-white truncate">{session.name}</div>
              <div className="flex items-center gap-1.5 text-[10px] text-bronze-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{session.role === 'ADMIN' ? 'Administrator' : 'Showroom Staff'}</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-bronze-400" />
              <span>Dashboard Overview</span>
            </Link>

            {/* Stone Catalogue */}
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
            >
              <Package className="w-4 h-4 text-bronze-400" />
              <span>Catalogue Products</span>
            </Link>

            {/* Physical Slabs Management */}
            <Link
              href="/admin/slabs"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
            >
              <Layers className="w-4 h-4 text-bronze-400" />
              <span>Physical Yard Slabs</span>
            </Link>

            {/* Enquiry CRM */}
            <Link
              href="/admin/enquiries"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
            >
              <FileQuestion className="w-4 h-4 text-bronze-400" />
              <span>Enquiry CRM</span>
            </Link>

            {/* Quotations Builder */}
            <Link
              href="/admin/quotations"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
            >
              <FileText className="w-4 h-4 text-bronze-400" />
              <span>Quotations Builder</span>
            </Link>

            {/* Settings (Admin only) */}
            {session.role === 'ADMIN' && (
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
              >
                <Settings className="w-4 h-4 text-bronze-400" />
                <span>Showroom Settings</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-stone-800 space-y-2 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-stone-400 hover:text-white rounded transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/account"
            className="flex items-center gap-2 px-3 py-2 text-stone-400 hover:text-white rounded transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
            <span>Customer Portal</span>
          </Link>

          <div className="pt-2">
            <AdminLogoutButton variant="sidebar" />
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="no-print bg-white border-b border-stone-200 px-6 sm:px-10 py-3 flex items-center justify-between shrink-0">
          <div className="text-xs text-stone-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-charcoal-900">MMG Admin Console</span>
            <span className="text-stone-300 hidden sm:inline">|</span>
            <span className="text-stone-500 hidden sm:inline">Mahadev Marble & Granite Pvt. Ltd.</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-600 hidden md:inline">
              Signed in as <strong className="text-charcoal-900">{session.name}</strong> ({session.role === 'ADMIN' ? 'Admin' : 'Staff'})
            </span>
            <AdminLogoutButton variant="compact" />
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
