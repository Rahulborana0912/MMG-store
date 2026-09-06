'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { getWhatsAppEnquiryUrl } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const pathname = usePathname();
  const { t, language } = useLanguage();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-charcoal-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand Col (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-900 border border-stone-700 text-stone-100 flex items-center justify-center font-serif text-lg font-bold rounded">
                MMG
              </div>
              <div>
                <div className="font-serif text-xl font-bold tracking-tight text-white">
                  Mahadev Marble
                </div>
                <div className="text-xs text-stone-400 font-sans tracking-widest uppercase">
                  & Granite Pvt. Ltd.
                </div>
              </div>
            </Link>

            <p className="text-stone-400 text-sm leading-relaxed max-w-md pt-2">
              {t('footerDesc')}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-900 text-stone-300 text-xs font-medium rounded border border-stone-800">
                <ShieldCheck className="w-3.5 h-3.5 text-bronze-400" />
                {t('naturalStoneOnly')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-900 text-stone-300 text-xs font-medium rounded border border-stone-800">
                {t('gangsawCalibrated')}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-white text-base tracking-wide font-semibold">
              {t('stoneCatalogue')}
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link href="/marble" className="hover:text-white transition-colors">
                  {t('marble')}
                </Link>
              </li>
              <li>
                <Link href="/granite" className="hover:text-white transition-colors">
                  {t('granite')}
                </Link>
              </li>
              <li>
                <Link href="/stone-tiles" className="hover:text-white transition-colors">
                  {t('stoneTiles')}
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-white transition-colors">
                  {t('collections')}
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  {t('compare')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-4">
            <h3 className="font-serif text-white text-base tracking-wide font-semibold">
              {t('companyAndHelp')}
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t('showroomYard')}
                </Link>
              </li>
              <li>
                <Link href="/contact#quote" className="hover:text-white transition-colors">
                  {t('getQuote')}
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  {t('customerPortal')}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  {t('login')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom & Contact Info */}
          <div className="space-y-4">
            <h3 className="font-serif text-white text-base tracking-wide font-semibold">
              {t('showroomYard')}
            </h3>
            <div className="space-y-3 text-sm text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-bronze-400 shrink-0 mt-0.5" />
                <a
                  href="https://maps.app.goo.gl/Z4vojjCLAfeXNVvTA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors leading-snug"
                >
                  {t('showroomAddress')}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-bronze-400 shrink-0" />
                <a href="tel:+919829012345" className="hover:text-white transition-colors">
                  +91 98290 12345
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={getWhatsAppEnquiryUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  WhatsApp: +91 98290 12345
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-bronze-400 shrink-0" />
                <a href="mailto:sales@mahadevmarble.com" className="hover:text-white transition-colors">
                  sales@mahadevmarble.com
                </a>
              </div>

              <div className="pt-2 text-xs text-stone-500">
                {t('hoursDetail')}<br />
                {t('sundayDetail')}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Copyright & Location */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            <a
              href="https://maps.app.goo.gl/Z4vojjCLAfeXNVvTA"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-300 transition-colors"
            >
              Mahadev Marble and Granite, Raghunathpura, Kelwa
            </a>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-stone-300">
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" className="hover:text-stone-300">
              Terms of Supply & Inspection
            </Link>
            <span>
              {t('allRightsReserved')}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
