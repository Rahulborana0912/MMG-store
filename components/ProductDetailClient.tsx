'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Scale,
  MessageCircle,
  Info,
  Check,
  MapPin,
  FileText,
  Layers,
  Clock,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { formatINR, getWhatsAppEnquiryUrl } from '@/lib/utils';
import EnquiryModal from './EnquiryModal';
import BackButton from './BackButton';
import MobileStickyCTA from './MobileStickyCTA';
import { useLanguage } from '@/context/LanguageContext';

export interface PhysicalSlab {
  id: string;
  slabCode: string;
  lengthInches: number;
  widthInches: number;
  thicknessMm: number;
  areaSqft: number;
  pricePerSqft?: number | null;
  slabPrice?: number | null;
  location?: string | null;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD' | string;
}

interface ProductDetailClientProps {
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
    description: string;
    shortDescription?: string | null;
    pricePerSqft: number;
    pricePerPiece?: number | null;
    slabPrice?: number | null;
    thicknessMm: number;
    lengthInches: number;
    widthInches: number;
    areaSqft: number;
    quantity: number;
    availability: 'AVAILABLE' | 'LOW_STOCK' | 'SOLD_OUT' | 'ON_REQUEST';
    recommendedApplications?: string | null;
    origin?: string | null;
    images: {
      id: string;
      imageUrl: string;
      imageType: string;
      isMain: boolean;
      altText?: string | null;
    }[];
    slabs?: PhysicalSlab[];
  };
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { t, language } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlabCode, setSelectedSlabCode] = useState<string | null>(null);
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

  const toggleCompare = () => {
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

  const images = product.images.length > 0
    ? product.images
    : [
        {
          id: 'default',
          imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
          imageType: 'MAIN',
          isMain: true,
          altText: product.name,
        },
      ];

  const activeImage = images[selectedImageIndex] || images[0];

  const slabs = product.slabs || [];

  return (
    <div className="bg-stone-50 min-h-screen py-8 sm:py-14 pb-20 lg:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back Option & Breadcrumbs Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <BackButton fallbackHref="/catalogue" />

          <nav className="text-xs text-stone-500 flex flex-wrap items-center gap-2">
            <Link href="/" className="hover:text-charcoal-900 transition-colors">{t('home')}</Link>
            <span>/</span>
            <Link href="/catalogue" className="hover:text-charcoal-900 transition-colors">Catalogue</Link>
            <span>/</span>
            <Link
              href={product.material === 'Marble' ? '/marble' : product.material === 'Granite' ? '/granite' : '/stone-tiles'}
              className="hover:text-charcoal-900 transition-colors"
            >
              {product.material}
            </Link>
            <span>/</span>
            <span className="text-charcoal-900 font-medium truncate max-w-[180px] sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </div>

        {/* Main Grid: Left Gallery (7 Cols) + Right Product Info (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-200 border border-stone-200 shadow-stone-md">
              <Image
                src={activeImage.imageUrl}
                alt={activeImage.altText || product.name}
                fill
                priority
                unoptimized={activeImage.imageUrl.includes('googleusercontent') || activeImage.imageUrl.includes('drive.google')}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-charcoal-950/90 text-white text-xs font-bold tracking-wider uppercase rounded shadow">
                  {product.format === 'SLAB' ? t('slab') : t('tile')}
                </span>
              </div>

              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-charcoal-900 text-[11px] font-semibold uppercase tracking-wider rounded shadow-sm">
                  {activeImage.imageType || 'SLAB VIEW'}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-charcoal-900 ring-2 ring-bronze-500/50'
                        : 'border-stone-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img.imageUrl}
                      alt={img.altText || `${product.name} photo ${idx + 1}`}
                      fill
                      unoptimized={img.imageUrl.includes('googleusercontent') || img.imageUrl.includes('drive.google')}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Natural Variation Disclaimer Alert */}
            <div className="p-4 rounded-xl bg-stone-100/80 border border-stone-200 text-stone-600 text-xs flex items-start gap-3">
              <Info className="w-5 h-5 text-bronze-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-charcoal-900 block font-semibold mb-0.5">
                  {t('naturalVariationNotice')}
                </strong>
                {t('variationDetail')}
              </div>
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO & SPECS */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-2 border-b border-stone-200 pb-5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-stone-500 bg-stone-100 px-2.5 py-1 rounded">
                  {product.productCode}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5" />
                  {product.availability}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-900 leading-tight">
                {product.name}
              </h1>

              {product.origin && (
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-bronze-600" />
                  <span>Quarried in: {product.origin}</span>
                </div>
              )}
            </div>

            {/* Indicative Rate Box */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-stone-sm space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-stone-500 block">Indicative Rate / Reference Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-sans text-3xl font-bold text-charcoal-950">
                      {formatINR(product.pricePerSqft, { showUnit: true, unit: language === 'hi' ? 'वर्ग फुट' : 'sq.ft.' })}
                    </span>
                  </div>
                </div>

                {product.slabPrice && (
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">Approx. Full Slab Cost</span>
                    <span className="font-sans text-sm font-bold text-charcoal-900">
                      {formatINR(product.slabPrice)}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-stone-400 leading-tight pt-1">
                * Indicative price. Final quotation will be confirmed by MMG based on actual physical slab selection, transport, wastage, and applicable taxes.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 px-6 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-widest rounded shadow-stone-md transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Request MMG Quotation</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={getWhatsAppEnquiryUrl(product.name, product.productCode)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp MMG</span>
                </a>

                <button
                  onClick={toggleCompare}
                  className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider rounded border transition-colors flex items-center justify-center gap-2 ${
                    isCompared
                      ? 'bg-bronze-600 text-white border-bronze-600'
                      : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {isCompared ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
                  <span>{isCompared ? t('inCompare') : t('addToCompare')}</span>
                </button>
              </div>
            </div>

            {/* Specifications Table */}
            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-stone-sm space-y-3">
              <h3 className="font-serif font-bold text-charcoal-900 text-sm">
                Stone Technical Specifications
              </h3>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs border-t border-stone-100 pt-3">
                <div>
                  <span className="text-stone-400 block text-[11px]">Material Type</span>
                  <span className="font-semibold text-charcoal-900">{product.material}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Format</span>
                  <span className="font-semibold text-charcoal-900">{product.format}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Colour Tone</span>
                  <span className="font-semibold text-charcoal-900">{product.colour}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Vein / Pattern</span>
                  <span className="font-semibold text-charcoal-900">{product.pattern}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Surface Finish</span>
                  <span className="font-semibold text-charcoal-900">{product.finish}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Calibrated Thickness</span>
                  <span className="font-semibold text-charcoal-900">{product.thicknessMm} mm</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Dimensions</span>
                  <span className="font-semibold text-charcoal-900">{product.lengthInches} × {product.widthInches} in</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Approx Area</span>
                  <span className="font-semibold text-charcoal-900">{product.areaSqft} sq.ft.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* SECTION 2: PHYSICAL SLAB INVENTORY (LIVE YARD STOCK) */}
        {slabs.length > 0 ? (
          <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-stone-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block mb-1">
                  Physical Yard Inventory • वास्तविक स्लैब स्टॉक
                </span>
                <h2 className="font-serif text-2xl font-bold text-charcoal-900">
                  Individual Slabs Available at Kelwa Yard
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Each physical slab below has been individually inspected, measured, and stored in our A-frame bays.
                </p>
              </div>

              <span className="text-xs text-stone-500">
                Total Live Slabs: <strong className="text-charcoal-900">{slabs.length}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {slabs.map((slab) => {
                const isAvailable = slab.status === 'AVAILABLE';
                return (
                  <div
                    key={slab.id}
                    className={`p-5 rounded-xl border transition-all ${
                      isAvailable
                        ? 'bg-stone-50/70 border-stone-200 hover:border-charcoal-900 hover:bg-white'
                        : 'bg-stone-100/50 border-stone-200 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-charcoal-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                        {slab.slabCode}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          isAvailable
                            ? 'bg-emerald-100 text-emerald-800'
                            : slab.status === 'RESERVED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {slab.status}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 space-y-1 my-3">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Dimensions:</span>
                        <span className="font-semibold text-charcoal-900">{slab.lengthInches} × {slab.widthInches} in</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Surface Area:</span>
                        <span className="font-semibold text-charcoal-900">{slab.areaSqft} sq.ft.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Thickness:</span>
                        <span>{slab.thicknessMm} mm</span>
                      </div>
                      {slab.location && (
                        <div className="flex justify-between">
                          <span className="text-stone-400">Yard Location:</span>
                          <span className="text-stone-700 truncate max-w-[150px]">{slab.location}</span>
                        </div>
                      )}
                      {slab.slabPrice && (
                        <div className="flex justify-between pt-1 border-t border-stone-200">
                          <span className="text-stone-500">Indicative Cost:</span>
                          <strong className="text-charcoal-950 font-bold">{formatINR(slab.slabPrice)}</strong>
                        </div>
                      )}
                    </div>

                    {isAvailable ? (
                      <div className="pt-2 flex gap-2">
                        <a
                          href={getWhatsAppEnquiryUrl(
                            product.name,
                            slab.slabCode,
                            `Hello MMG, I am interested in physical slab ${slab.slabCode} of ${product.name} (${slab.areaSqft} sq.ft.). Please share live photo and availability.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold rounded text-center block transition-colors"
                        >
                          Enquire About Slab
                        </a>
                      </div>
                    ) : (
                      <div className="pt-2 text-center text-[11px] text-amber-800 font-medium">
                        {slab.status === 'RESERVED' ? 'Held for customer inspection' : 'Currently not available'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-stone-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block">
                  Physical Yard Inventory • यार्ड स्टॉक स्थिति
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
                  New stock is being updated. Contact MMG for current availability.
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 max-w-2xl leading-relaxed">
                  Individual gangsaw lots for {product.name} are currently undergoing dimensional measurement and photographic cataloguing at our Raghunathpura, Kelwa yard. Contact our sales desk for unlisted lots or incoming cuts.
                </p>
              </div>
              <a
                href={getWhatsAppEnquiryUrl(
                  product.name,
                  undefined,
                  `Hello MMG, I am checking availability for ${product.name}. Please share current yard lot specifications.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors shrink-0 text-center"
              >
                Inquire Yard Stock
              </a>
            </div>
          </section>
        )}

      </div>

      {/* Quick Enquiry Modal */}
      {isModalOpen && (
        <EnquiryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={{
            id: product.id,
            name: product.name,
            code: product.productCode,
          }}
        />
      )}

      {/* Mobile Sticky CTA Bar */}
      <MobileStickyCTA
        productName={product.name}
        productCode={product.productCode}
        onEnquireClick={() => setIsModalOpen(true)}
      />
    </div>
  );
}
