'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface BackButtonProps {
  fallbackHref?: string;
  label?: string;
  className?: string;
}

export default function BackButton({ fallbackHref = '/', label, className = '' }: BackButtonProps) {
  const router = useRouter();
  const { t, language } = useLanguage();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  const buttonText = label || t('back');

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 shadow-stone-sm transition-all hover:-translate-x-0.5 active:translate-x-0 ${className}`}
      title={language === 'hi' ? 'पिछले पेज पर वापस जाएं' : 'Go back to previous page'}
    >
      <ArrowLeft className="w-3.5 h-3.5 text-stone-600" />
      <span>{buttonText}</span>
    </button>
  );
}
