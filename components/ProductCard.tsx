'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Scale, Check } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import EnquiryModal from './EnquiryModal';
import { useLanguage } from '@/context/LanguageContext';

export interface ProductCardProps {
  product: {
    id: string;
    productCode: string;
    name: string;
    slug: string;
    material: string;
    format: 'SLAB' | 'TILE';
    colour: string;
    pattern: string;
    finish: string;
    pricePerSqft: number;
    pricePerPiece?: number | null;
    thicknessMm: number;
    areaSqft: number;
    availability: 'AVAILABLE' | 'LOW_STOCK' | 'SOLD_OUT' | 'ON_REQUEST';
    images: { imageUrl: string; altText?: string | null; isMain?: boolean }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t, language } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [isCompared, setIsCompared] = useState(false);

  // Check compare state
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('mmg_compare_ids');
      if (stored) {
        const list = JSON.parse(stored);
        setIsCompared(Array.isArray(list) && list.includes(product.id));
      }
    } catch {
      // ignore
    }
  }, [product.id]);

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem('mmg_compare_ids');
      let list: string[] = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(list)) list = [];

      if (list.includes(product.id)) {
        list = list.filter((id) => id !== product.id);
        setIsCompared(false);
      } else {
        if (list.length >= 4) {
          alert(language === 'hi' ? 'आप एक बार में अधिकतम 4 पत्थरों की तुलना कर सकते हैं।' : 'You can compare up to 4 products at a time.');
          return;
        }
        list.push(product.id);
        setIsCompared(true);
      }
      localStorage.setItem('mmg_compare_ids', JSON.stringify(list));
      window.dispatchEvent(new Event('mmg_state_change'));
    } catch {
      // ignore
    }
  };

  const mainImage = product.images.find((img) => img.isMain) || product.images[0] || {
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    altText: product.name,
  };

  const getAvailabilityBadge = () => {
    switch (product.availability) {
      case 'AVAILABLE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            {t('available')}
          </span>
        );
      case 'LOW_STOCK':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
            {t('lowStock')}
          </span>
        );
      case 'SOLD_OUT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
            {t('soldOut')}
          </span>
        );
      case 'ON_REQUEST':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-stone-100 text-stone-800 border border-stone-300">
            {t('onRequest')}
          </span>
        );
      default:
        return null;
    }
  };

  const formatBadgeText = product.format === 'SLAB' ? t('slab') : t('tile');

  return (
    <>
      <div className="group bg-white rounded-lg border border-stone-200/90 overflow-hidden shadow-stone-sm hover:shadow-stone-md transition-all duration-300 flex flex-col">
        {/* Product Image Container */}
        <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] overflow-hidden bg-stone-100 block">
          <Image
            src={mainImage.imageUrl}
            alt={mainImage.altText || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={mainImage.imageUrl.includes('googleusercontent') || mainImage.imageUrl.includes('drive.google')}
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <span
              className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded shadow-sm ${
                product.format === 'SLAB'
                  ? 'bg-charcoal-900 text-white'
                  : 'bg-stone-800 text-stone-100'
              }`}
            >
              {formatBadgeText}
            </span>
          </div>

          <div className="absolute top-3 right-3 z-10">
            {getAvailabilityBadge()}
          </div>

          {/* Compare Quick Toggle */}
          <button
            onClick={toggleCompare}
            title={isCompared ? t('inCompare') : t('addToCompare')}
            className={`absolute bottom-3 right-3 p-2 rounded-full shadow-md backdrop-blur-sm transition-all ${
              isCompared
                ? 'bg-bronze-600 text-white'
                : 'bg-white/90 text-stone-700 hover:bg-white hover:text-charcoal-900'
            }`}
          >
            {isCompared ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Scale className="w-4 h-4" />}
          </button>
        </Link>

        {/* Product Meta Body */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Category & Product Code */}
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
              <span className="uppercase font-semibold tracking-wider text-[11px] text-bronze-600">
                {product.material === 'Marble' ? t('marble') : product.material === 'Granite' ? t('granite') : t('stoneTiles')} • {formatBadgeText}
              </span>
              <span className="font-mono text-[11px] text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                {product.productCode}
              </span>
            </div>

            {/* Product Name */}
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-serif text-base sm:text-lg font-bold text-charcoal-900 group-hover:text-bronze-600 transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>

            {/* Specs Line */}
            <p className="text-xs text-stone-500 mt-1">
              {product.colour} • {product.pattern} • {product.finish} • {product.thicknessMm}mm
            </p>
          </div>

          {/* Price & Action Buttons */}
          <div className="mt-4 pt-3 border-t border-stone-100">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-xs text-stone-500 block leading-tight">{t('price')}</span>
                <span className="font-sans font-bold text-base sm:text-lg text-charcoal-900">
                  {formatINR(product.pricePerSqft, { showUnit: true, unit: language === 'hi' ? 'वर्ग फुट' : 'sq.ft.' })}
                </span>
              </div>

              {product.pricePerPiece && (
                <div className="text-right">
                  <span className="text-[11px] text-stone-400 block leading-tight">{t('perPiece')}</span>
                  <span className="font-sans text-xs font-semibold text-stone-700">
                    {formatINR(product.pricePerPiece, { showUnit: true, unit: language === 'hi' ? 'नग' : 'pc' })}
                  </span>
                </div>
              )}
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/products/${product.slug}`}
                className="inline-flex items-center justify-center gap-1 py-2 px-3 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors"
              >
                <span>{t('viewDetails')}</span>
              </Link>
              
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center justify-center gap-1 py-2 px-3 text-xs font-semibold text-white bg-charcoal-900 hover:bg-charcoal-800 rounded transition-colors"
              >
                <span>{t('getQuoteNow')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Enquiry Modal */}
      {modalOpen && (
        <EnquiryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          product={{
            id: product.id,
            name: product.name,
            code: product.productCode,
          }}
        />
      )}
    </>
  );
}
