'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X } from 'lucide-react';
import { getWhatsAppEnquiryUrl } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export default function WhatsAppFloat() {
  const pathname = usePathname();
  const [closed, setClosed] = useState(false);
  const { language } = useLanguage();

  if (closed || pathname?.startsWith('/admin')) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 print:hidden">
      {/* Tooltip prompt */}
      <div className="hidden sm:flex items-center gap-2 bg-white text-stone-800 text-xs px-3.5 py-2 rounded-full shadow-stone-lg border border-stone-200">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-medium">
          {language === 'hi' ? 'सीधे शो-रूम से व्हाट्सएप पर बात करें' : 'Direct Showroom Assistance'}
        </span>
        <button
          onClick={() => setClosed(true)}
          className="text-stone-400 hover:text-stone-600 ml-1"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Action Button */}
      <a
        href={getWhatsAppEnquiryUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full flex items-center justify-center shadow-stone-xl transition-transform hover:scale-105"
        aria-label="Contact MMG on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
}
