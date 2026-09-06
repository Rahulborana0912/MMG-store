'use client';

import React from 'react';
import { Phone, MessageCircle, FileText } from 'lucide-react';
import { getWhatsAppEnquiryUrl } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface MobileStickyCTAProps {
  productName?: string;
  productCode?: string;
  slabCode?: string;
  onEnquireClick?: () => void;
}

export default function MobileStickyCTA({
  productName,
  productCode,
  slabCode,
  onEnquireClick,
}: MobileStickyCTAProps) {
  const { language } = useLanguage();

  const whatsappMessage = slabCode
    ? `Hello MMG, I am interested in physical slab ${slabCode} of ${productName || 'Natural Stone'}. Please share availability and current rate.`
    : undefined;

  const whatsappUrl = getWhatsAppEnquiryUrl(productName, productCode, whatsappMessage);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-stone-xl px-4 py-2.5 flex items-center justify-between gap-2 safe-area-bottom print:hidden">
      {/* Call Button */}
      <a
        href="tel:+919829012345"
        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-2 bg-stone-100 active:bg-stone-200 text-charcoal-900 text-xs font-semibold rounded border border-stone-300"
      >
        <Phone className="w-3.5 h-3.5 text-bronze-600" />
        <span>{language === 'hi' ? 'कॉल करें' : 'CALL'}</span>
      </a>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#25D366] active:bg-[#20bd5a] text-white text-xs font-semibold rounded shadow-sm"
      >
        <MessageCircle className="w-3.5 h-3.5 fill-white" />
        <span>WHATSAPP</span>
      </a>

      {/* Enquire Button */}
      <button
        type="button"
        onClick={onEnquireClick || (() => {
          const el = document.getElementById('quote') || document.querySelector('[data-enquiry-modal]');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          else window.location.href = '/send-requirement';
        })}
        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-2 bg-charcoal-900 active:bg-charcoal-800 text-white text-xs font-semibold rounded shadow-sm"
      >
        <FileText className="w-3.5 h-3.5" />
        <span>{language === 'hi' ? 'पूछताछ करें' : 'ENQUIRE'}</span>
      </button>
    </div>
  );
}
