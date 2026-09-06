'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Scale,
  User as UserIcon,
  Menu,
  X,
  Phone,
  MessageCircle,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Package,
  Layers,
  FileQuestion,
  FileText,
  Settings,
  ShieldCheck,
  Calculator,
  FolderPlus
} from 'lucide-react';
import { getWhatsAppEnquiryUrl } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [compareCount, setCompareCount] = useState(0);
  const [userSession, setUserSession] = useState<{
    id?: string;
    name: string;
    email?: string;
    role: string;
  } | null>(null);

  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const phoneDropdownRef = useRef<HTMLDivElement>(null);

  const [siteSettings, setSiteSettings] = useState<{
    contactNumbers: Array<{ id: string; phone: string; label: string; isPrimary: boolean; isWhatsApp: boolean }>;
    contactEmails: Array<{ id: string; email: string; label: string; isPrimary: boolean }>;
    address: string;
    mapsUrl: string;
  }>({
    contactNumbers: [
      { id: 'default', phone: '+91 98873 90222', label: 'Rahul Borana (Direct / Owner)', isPrimary: true, isWhatsApp: true },
    ],
    contactEmails: [
      { id: 'default', email: 'rahulborana1306@gmail.com', label: 'Official Enquiries', isPrimary: true },
    ],
    address: 'Mahadev Marble and Granite, Raghunathpura, Kelwa',
    mapsUrl: 'https://maps.app.goo.gl/Z4vojjCLAfeXNVvTA',
  });
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);

  // Fetch dynamic site settings from DB
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data?.settings) {
          setSiteSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (phoneDropdownRef.current && !phoneDropdownRef.current.contains(event.target as Node)) {
        setPhoneDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Synchronize authentication state on mount, pathname change, and custom storage events
  useEffect(() => {
    let isCancelled = false;

    const syncSession = async () => {
      // 1. Instant local read for zero-lag paint
      try {
        const storedCompare = localStorage.getItem('mmg_compare_ids');
        if (storedCompare) {
          const list = JSON.parse(storedCompare);
          setCompareCount(Array.isArray(list) ? list.length : 0);
        } else {
          setCompareCount(0);
        }

        const userStored = localStorage.getItem('mmg_user');
        if (userStored) {
          setUserSession(JSON.parse(userStored));
        }
      } catch {
        // ignore
      }

      // 2. Authoritative server-side verification
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (isCancelled) return;
          if (data?.user) {
            setUserSession(data.user);
            localStorage.setItem('mmg_user', JSON.stringify(data.user));
          } else {
            setUserSession(null);
            localStorage.removeItem('mmg_user');
          }
        }
      } catch {
        // network issue: preserve cached state
      }
    };

    syncSession();

    window.addEventListener('storage', syncSession);
    window.addEventListener('mmg_state_change', syncSession);

    return () => {
      isCancelled = true;
      window.removeEventListener('storage', syncSession);
      window.removeEventListener('mmg_state_change', syncSession);
    };
  }, [pathname]);

  // Close overlays on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Universal Logout Handler
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    localStorage.removeItem('mmg_user');
    window.dispatchEvent(new Event('mmg_state_change'));
    setUserSession(null);
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    window.location.replace('/');
  };

  // If currently browsing inside the Admin portal, hide public Navbar to avoid layout clashes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const isAdmin = userSession?.role === 'ADMIN';
  const isStaff = userSession?.role === 'STAFF';
  const isAdminOrStaff = isAdmin || isStaff;
  const isCustomer = userSession?.role === 'CUSTOMER';

  const navLinks = [
    { label: t('home'), href: '/' },
    { label: t('marble'), href: '/marble' },
    { label: t('granite'), href: '/granite' },
    { label: language === 'hi' ? 'प्राकृतिक पत्थर' : 'Natural Stone', href: '/stone-tiles' },
    { label: language === 'hi' ? 'उपलब्ध स्टॉक' : 'Available Stock', href: '/available-stock', isPill: true },
    { label: language === 'hi' ? 'नए आगमन' : 'New Arrivals', href: '/new-arrivals' },
    { label: t('collections'), href: '/collections' },
    { label: language === 'hi' ? 'अनुप्रयोग' : 'Applications', href: '/applications' },
    { label: language === 'hi' ? 'प्रोजेक्ट्स' : 'Projects / Gallery', href: '/projects' },
    { label: language === 'hi' ? 'पत्थर चुनें' : 'Help Me Choose', href: '/help-me-choose' },
    { label: t('aboutUs'), href: '/about' },
    { label: language === 'hi' ? 'यार्ड विजिट' : 'Contact / Visit Yard', href: '/contact' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalogue?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT & STATUS BAR */}
      <div className={`text-stone-300 text-xs py-2 px-4 border-b tracking-wide transition-colors ${
        isAdminOrStaff
          ? 'bg-amber-950 border-amber-900 text-amber-200'
          : isCustomer
          ? 'bg-stone-950 border-stone-800 text-stone-200'
          : 'bg-charcoal-950 border-stone-800'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          {/* Status Message Left */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className={`inline-block w-2 h-2 rounded-full animate-pulse shrink-0 ${
              isAdminOrStaff ? 'bg-amber-400' : 'bg-emerald-500'
            }`} />
            
            {isAdminOrStaff ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-amber-200">
                  {isAdmin ? '👑 Administrator Active:' : '👷 Showroom Staff Active:'} {userSession?.name}
                </span>
                <span className="text-amber-600 hidden sm:inline">•</span>
                <Link
                  href="/admin"
                  className="text-amber-300 hover:text-white underline font-semibold transition-colors"
                >
                  Open Admin Console →
                </Link>
              </div>
            ) : isCustomer ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-stone-200">
                  👤 {language === 'hi' ? `नमस्ते, ${userSession?.name}` : `Welcome, ${userSession?.name}`}
                </span>
                <span className="text-stone-600 hidden sm:inline">•</span>
                <Link
                  href="/account?tab=quotations"
                  className="text-amber-300 hover:text-white underline font-medium transition-colors text-[11px] sm:text-xs"
                >
                  {language === 'hi' ? 'मेरे कोटेशन' : 'My Quotations'}
                </Link>
                <span className="text-stone-600 hidden sm:inline">•</span>
                <Link
                  href="/account?tab=enquiries"
                  className="text-stone-300 hover:text-white underline font-medium transition-colors text-[11px] sm:text-xs"
                >
                  {language === 'hi' ? 'मेरी पूछताछ' : 'My Enquiries'}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="https://maps.app.goo.gl/Z4vojjCLAfeXNVvTA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-stone-200 hover:text-amber-300 transition-colors"
                >
                  {language === 'hi'
                    ? 'महादेव मार्बल एंड ग्रेनाइट • रघुनाथपुरा, केलवा'
                    : 'Mahadev Marble and Granite • Raghunathpura, Kelwa'}
                </a>
                <span className="hidden md:inline text-stone-600">|</span>
                <span className="hidden md:inline text-stone-400">
                  {language === 'hi'
                    ? '100% प्राकृतिक पत्थर • वास्तविक स्टॉकयार्ड इन्वेंटरी'
                    : '100% Genuine Natural Earth Stone • Direct Yard Inspection'}
                </span>
              </div>
            )}
          </div>

          {/* Actions Right */}
          <div className="flex items-center gap-3 sm:gap-5 ml-auto text-[11px] sm:text-xs">
            {/* Direct Logout shortcut in top bar if logged in */}
            {userSession && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                title="Sign out of current account"
              >
                <LogOut className="w-3 h-3" />
                <span>{language === 'hi' ? 'लॉगआउट' : 'Sign Out'}</span>
              </button>
            )}

            {/* Language Switcher */}
            <div className="inline-flex items-center bg-stone-900 rounded-full p-0.5 border border-stone-700">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold transition-colors ${
                  language === 'en'
                    ? 'bg-bronze-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold transition-colors ${
                  language === 'hi'
                    ? 'bg-bronze-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Dynamic Phone Numbers */}
            {(() => {
              const primaryPhone = siteSettings.contactNumbers.find((n) => n.isPrimary) || siteSettings.contactNumbers[0];
              const whatsAppNumber = siteSettings.contactNumbers.find((n) => n.isWhatsApp) || primaryPhone;
              const hasMultiple = siteSettings.contactNumbers.length > 1;

              return (
                <>
                  <div ref={phoneDropdownRef} className="relative hidden lg:block">
                    {hasMultiple ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setPhoneDropdownOpen(!phoneDropdownOpen)}
                          className="flex items-center gap-1.5 hover:text-white transition-colors py-1"
                        >
                          <Phone className="w-3.5 h-3.5 text-bronze-400" />
                          <span>{primaryPhone?.phone}</span>
                          <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform ${phoneDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {phoneDropdownOpen && (
                          <div className="absolute top-full right-0 mt-2 w-64 bg-charcoal-900 border border-stone-700 rounded-xl shadow-2xl p-2 z-50 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-bronze-400 px-2 py-1 block border-b border-stone-800">
                              Direct Showroom Lines
                            </span>
                            {siteSettings.contactNumbers.map((c) => (
                              <a
                                key={c.id}
                                href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`}
                                onClick={() => setPhoneDropdownOpen(false)}
                                className="flex flex-col px-2.5 py-1.5 rounded-lg hover:bg-stone-800 text-left transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-xs font-bold text-amber-200">{c.phone}</span>
                                  {c.isWhatsApp && (
                                    <span className="text-[9px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 px-1 rounded">WA</span>
                                  )}
                                </div>
                                <span className="text-[11px] text-stone-400">{c.label}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <a
                        href={`tel:${primaryPhone?.phone?.replace(/[^0-9+]/g, '')}`}
                        className="flex items-center gap-1.5 hover:text-white transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-bronze-400" />
                        <span>{primaryPhone?.phone}</span>
                      </a>
                    )}
                  </div>

                  <a
                    href={getWhatsAppEnquiryUrl(undefined, undefined, undefined, whatsAppNumber?.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-emerald-400 text-charcoal-950" />
                    <span className="hidden sm:inline">WhatsApp MMG</span>
                    <span className="sm:hidden">WhatsApp</span>
                  </a>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-stone-50/98 backdrop-blur-md border-b border-stone-200/90 shadow-stone-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Brand Crest & Wordmark */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-11 h-11 bg-charcoal-900 text-amber-100 flex items-center justify-center font-serif text-lg font-bold tracking-wider rounded border border-amber-900/40 shadow-stone-sm group-hover:border-bronze-500 transition-colors">
                MMG
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-charcoal-950 leading-tight">
                  Mahadev Marble
                </span>
                <span className="text-[10px] sm:text-[11px] font-sans tracking-widest text-stone-500 uppercase font-semibold">
                  & Granite Pvt. Ltd.
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Wide Screens) */}
            <nav className="hidden 2xl:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-2.5 py-1.5 text-[13px] font-medium tracking-wide transition-all rounded ${
                      isActive
                        ? 'text-charcoal-950 font-bold bg-stone-200/70'
                        : link.isPill
                        ? 'text-emerald-900 bg-emerald-50 hover:bg-emerald-100 font-semibold'
                        : 'text-stone-700 hover:text-charcoal-950 hover:bg-stone-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Secondary compact nav for < 2xl screens */}
            <nav className="hidden lg:flex 2xl:hidden items-center gap-1">
              <Link
                href="/marble"
                className={`px-2.5 py-1 text-[13px] font-medium ${
                  pathname === '/marble' ? 'text-charcoal-950 font-bold' : 'text-stone-700 hover:text-charcoal-950'
                }`}
              >
                {t('marble')}
              </Link>
              <Link
                href="/granite"
                className={`px-2.5 py-1 text-[13px] font-medium ${
                  pathname === '/granite' ? 'text-charcoal-950 font-bold' : 'text-stone-700 hover:text-charcoal-950'
                }`}
              >
                {t('granite')}
              </Link>
              <Link
                href="/stone-tiles"
                className={`px-2.5 py-1 text-[13px] font-medium ${
                  pathname === '/stone-tiles' ? 'text-charcoal-950 font-bold' : 'text-stone-700 hover:text-charcoal-950'
                }`}
              >
                Natural Stone
              </Link>
              <Link
                href="/available-stock"
                className="px-2.5 py-1 text-[13px] font-bold text-emerald-900 bg-emerald-50 rounded"
              >
                Available Stock
              </Link>
              <Link
                href="/new-arrivals"
                className="px-2.5 py-1 text-[13px] font-medium text-stone-700 hover:text-charcoal-950"
              >
                New Arrivals
              </Link>
              <Link
                href="/help-me-choose"
                className="px-2.5 py-1 text-[13px] font-medium text-bronze-700 hover:text-bronze-800 font-semibold"
              >
                Help Me Choose
              </Link>
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label={t('search')}
                className="p-2.5 text-stone-700 hover:text-charcoal-900 hover:bg-stone-100 rounded-full transition-colors"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Compare Quick Access */}
              {compareCount > 0 && (
                <Link
                  href="/compare"
                  aria-label={t('compare')}
                  className="relative p-2.5 text-stone-700 hover:text-charcoal-900 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <Scale className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-bronze-600 rounded-full">
                    {compareCount}
                  </span>
                </Link>
              )}

              {/* Account Dropdown or Sign In */}
              <div className="relative" ref={dropdownRef}>
                {userSession ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                        isAdminOrStaff
                          ? 'bg-amber-100/80 border-amber-300 text-amber-950 hover:bg-amber-100 shadow-sm'
                          : 'bg-stone-200/80 border-stone-300 text-charcoal-900 hover:bg-stone-200 shadow-sm'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                        isAdmin ? 'bg-amber-600' : isStaff ? 'bg-blue-600' : 'bg-charcoal-900'
                      }`}>
                        {userSession.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="max-w-[100px] truncate">{userSession.name}</span>
                      <span className={`hidden sm:inline px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                        isAdmin
                          ? 'bg-amber-200 text-amber-900'
                          : isStaff
                          ? 'bg-blue-200 text-blue-900'
                          : 'bg-stone-300 text-stone-800'
                      }`}>
                        {userSession.role}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-stone-600" />
                    </button>

                    {/* Interactive Dropdown Menu */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-stone-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        {/* Profile Header */}
                        <div className="px-4 py-3 border-b border-stone-100">
                          <div className="font-bold text-sm text-charcoal-950 truncate">
                            {userSession.name}
                          </div>
                          <div className="text-xs text-stone-500 truncate">
                            {userSession.email || 'Authenticated User'}
                          </div>
                          <div className="mt-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                              isAdmin
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : isStaff
                                ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {isAdmin ? '👑 Administrator' : isStaff ? '👷 Showroom Staff' : '👤 Customer'}
                            </span>
                          </div>
                        </div>

                        {/* Role-Specific Navigation Links */}
                        <div className="py-1.5 text-xs font-medium text-stone-700">
                          {isAdminOrStaff ? (
                            <>
                              <Link
                                href="/admin"
                                onClick={() => setProfileDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-100 text-charcoal-900 font-semibold"
                              >
                                <LayoutDashboard className="w-4 h-4 text-bronze-600" />
                                <span>Admin Dashboard</span>
                              </Link>
                              <Link
                                href="/admin/products"
                                onClick={() => setProfileDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-100"
                              >
                                <Package className="w-4 h-4 text-stone-500" />
                                <span>Stone Catalogue Management</span>
                              </Link>
                              <Link
                                href="/admin/slabs"
                                onClick={() => setProfileDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-100"
                              >
                                <Layers className="w-4 h-4 text-stone-500" />
                                <span>Yard Slabs Inventory</span>
                              </Link>
                              <Link
                                href="/admin/enquiries"
                                onClick={() => setProfileDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-100"
                              >
                                <FileQuestion className="w-4 h-4 text-stone-500" />
                                <span>Enquiry CRM</span>
                              </Link>
                              <Link
                                href="/admin/quotations"
                                onClick={() => setProfileDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-100"
                              >
                                <FileText className="w-4 h-4 text-stone-500" />
                                <span>Quotations Builder</span>
                              </Link>
                              {isAdmin && (
                                <Link
                                  href="/admin/settings"
                                  onClick={() => setProfileDropdownOpen(false)}
                                  className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-100"
                                >
                                  <Settings className="w-4 h-4 text-stone-500" />
                                  <span>Showroom Settings</span>
                                </Link>
                              )}
                              <div className="my-1 border-t border-stone-100" />
                              <Link
                                href="/account"
                                onClick={() => setProfileDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-100 text-stone-500"
                              >
                                <ShieldCheck className="w-4 h-4 text-stone-400" />
                                <span>View Customer Portal</span>
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link
                                href="/account?tab=quotations"
                                onClick={() => setProfileDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-100 text-charcoal-900 font-semibold"
                              >
                                <FileText className="w-4 h-4 text-bronze-600" />
                                <span>My Quotations & Estimates</span>
                              </Link>
                              <Link
                                href="/account?tab=enquiries"
                                onClick={() => setProfileDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-100"
                              >
                                <FileQuestion className="w-4 h-4 text-stone-500" />
                                <span>My Submitted Enquiries</span>
                              </Link>
                              <Link
                                href="/account?tab=requirements"
                                onClick={() => setProfileDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-100"
                              >
                                <FolderPlus className="w-4 h-4 text-stone-500" />
                                <span>Saved Projects & Requirements</span>
                              </Link>
                              <Link
                                href="/account?tab=calculator"
                                onClick={() => setProfileDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2 hover:bg-stone-100"
                              >
                                <Calculator className="w-4 h-4 text-stone-500" />
                                <span>Stone Cost Estimator</span>
                              </Link>
                            </>
                          )}
                        </div>

                        {/* Sign Out Action */}
                        <div className="pt-1 border-t border-stone-100">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4 text-rose-500" />
                            <span>{language === 'hi' ? 'लॉगआउट करें (Sign Out)' : 'Sign Out / Logout'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-charcoal-950 hover:bg-stone-100 rounded-lg transition-colors border border-transparent hover:border-stone-200"
                    title="Client / Staff Sign In"
                  >
                    <UserIcon className="w-4 h-4 text-stone-500" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                )}
              </div>

              {/* Primary Call to Action Button */}
              {isAdminOrStaff ? (
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold tracking-wider uppercase text-amber-950 bg-amber-400 hover:bg-amber-300 rounded shadow-stone-sm transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'एडमिन कंसोल' : 'Admin Console'}</span>
                </Link>
              ) : (
                <Link
                  href="/send-requirement"
                  className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold tracking-wider uppercase text-white bg-charcoal-950 hover:bg-charcoal-900 rounded shadow-stone-sm transition-all"
                >
                  {language === 'hi' ? 'मांग भेजें' : 'Enquire'}
                </Link>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-stone-800 hover:bg-stone-100 rounded transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="bg-white border-t border-stone-200 px-4 py-3 shadow-inner animate-in fade-in duration-200">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'hi' ? 'मार्बल, ग्रेनाइट, स्लैब कोड या शहर खोजें...' : 'Search Makrana White, Black Galaxy, granite slabs...'}
                className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs sm:text-sm text-charcoal-950 focus:outline-none focus:ring-1 focus:ring-charcoal-900"
                autoFocus
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-charcoal-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-charcoal-800 transition-colors"
              >
                {t('search')}
              </button>
            </form>
          </div>
        )}
      </header>

      {/* 3. MOBILE SLIDE-OUT DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-charcoal-950/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-sm bg-stone-50 h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-5">
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-charcoal-900 text-amber-100 flex items-center justify-center font-serif text-base font-bold rounded">
                    MMG
                  </div>
                  <div>
                    <span className="font-serif text-sm font-bold text-charcoal-900 block leading-tight">
                      Mahadev Marble
                    </span>
                    <a
                      href="https://maps.app.goo.gl/Z4vojjCLAfeXNVvTA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-stone-500 uppercase tracking-widest block font-medium hover:text-bronze-600"
                    >
                      Raghunathpura, Kelwa
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-stone-600 hover:text-charcoal-950 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile User Profile Card */}
              {userSession ? (
                <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-stone-xs space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                      isAdmin ? 'bg-amber-600' : isStaff ? 'bg-blue-600' : 'bg-charcoal-900'
                    }`}>
                      {userSession.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-charcoal-900 truncate">{userSession.name}</div>
                      <div className="text-[10px] text-stone-500 truncate">{userSession.email || 'Signed In'}</div>
                      <span className={`inline-block mt-0.5 px-2 py-0.2 text-[9px] font-bold uppercase rounded ${
                        isAdmin
                          ? 'bg-amber-100 text-amber-900'
                          : isStaff
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {isAdmin ? '👑 Administrator' : isStaff ? '👷 Showroom Staff' : '👤 Customer'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1 border-t border-stone-100">
                    <Link
                      href={isAdminOrStaff ? '/admin' : '/account'}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex-1 py-2 text-[11px] font-semibold text-center rounded transition-colors ${
                        isAdminOrStaff
                          ? 'bg-amber-500 hover:bg-amber-600 text-charcoal-950'
                          : 'bg-charcoal-900 hover:bg-charcoal-800 text-white'
                      }`}
                    >
                      {isAdminOrStaff ? 'Admin Console' : 'My Account'}
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-semibold rounded border border-rose-200 flex items-center justify-center gap-1"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-charcoal-900 block">Existing Client or Staff?</span>
                    <span className="text-[10px] text-stone-500 block">Sign in to manage stones & quotes</span>
                  </div>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-1.5 bg-charcoal-900 text-white text-xs font-semibold rounded shadow-sm hover:bg-charcoal-800"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              {/* Navigation Links in Mobile Drawer */}
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-3 py-2 text-sm font-medium rounded transition-colors flex items-center justify-between ${
                        isActive
                          ? 'bg-stone-200 text-charcoal-950 font-bold'
                          : link.isPill
                          ? 'bg-emerald-50 text-emerald-900 font-semibold'
                          : 'text-stone-700 hover:bg-stone-100 hover:text-charcoal-950'
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.isPill && (
                        <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                          Live Stock
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Quick Contact & WhatsApp in Drawer */}
              <div className="pt-3 border-t border-stone-200 space-y-2">
                {(() => {
                  const primaryPhone = siteSettings.contactNumbers.find((n) => n.isPrimary) || siteSettings.contactNumbers[0];
                  const whatsAppNumber = siteSettings.contactNumbers.find((n) => n.isWhatsApp) || primaryPhone;

                  return (
                    <>
                      <a
                        href={getWhatsAppEnquiryUrl(undefined, undefined, undefined, whatsAppNumber?.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>WhatsApp MMG</span>
                      </a>
                      {siteSettings.contactNumbers.map((c) => (
                        <a
                          key={c.id}
                          href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`}
                          className="w-full py-2 px-3 bg-charcoal-900 text-white rounded flex items-center justify-between transition-colors hover:bg-charcoal-800"
                        >
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-bronze-400" />
                            <span className="font-mono text-xs font-bold">{c.phone}</span>
                          </div>
                          <span className="text-[10px] text-stone-400">{c.label}</span>
                        </a>
                      ))}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 text-center text-[11px] text-stone-400 border-t border-stone-200 mt-4">
              © {new Date().getFullYear()} Mahadev Marble and Granite Pvt. Ltd.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
