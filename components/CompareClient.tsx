'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Scale, X, ArrowRight } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import EnquiryModal from './EnquiryModal';
import BackButton from './BackButton';
import { useLanguage } from '@/context/LanguageContext';

interface CompareProduct {
  id: string;
  productCode: string;
  name: string;
  slug: string;
  material: string;
  format: 'SLAB' | 'TILE';
  colour: string;
  pattern: string;
  finish: string;
  thicknessMm: number;
  lengthInches: number;
  widthInches: number;
  areaSqft: number;
  pricePerSqft: number;
  pricePerPiece?: number | null;
  availability: 'AVAILABLE' | 'LOW_STOCK' | 'SOLD_OUT' | 'ON_REQUEST';
  origin?: string | null;
  images: { imageUrl: string; altText?: string | null }[];
}

export default function CompareClient() {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<CompareProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductForQuote, setSelectedProductForQuote] = useState<{ id: string; name: string; code: string } | null>(null);

  const fetchComparedProducts = async () => {
    try {
      const stored = localStorage.getItem('mmg_compare_ids');
      if (!stored) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const ids = JSON.parse(stored);
      if (!Array.isArray(ids) || ids.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/products?ids=${ids.join(',')}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparedProducts();
    window.addEventListener('storage', fetchComparedProducts);
    window.addEventListener('mmg_state_change', fetchComparedProducts);

    return () => {
      window.removeEventListener('storage', fetchComparedProducts);
      window.removeEventListener('mmg_state_change', fetchComparedProducts);
    };
  }, []);

  const removeFromCompare = (id: string) => {
    try {
      const stored = localStorage.getItem('mmg_compare_ids');
      let list: string[] = stored ? JSON.parse(stored) : [];
      list = list.filter((item) => item !== id);
      localStorage.setItem('mmg_compare_ids', JSON.stringify(list));
      window.dispatchEvent(new Event('mmg_state_change'));
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // ignore
    }
  };

  const clearAll = () => {
    localStorage.removeItem('mmg_compare_ids');
    window.dispatchEvent(new Event('mmg_state_change'));
    setProducts([]);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-stone-50">
        <div className="text-center space-y-2">
          <Scale className="w-8 h-8 text-bronze-600 animate-pulse mx-auto" />
          <p className="text-xs text-stone-500">
            {language === 'hi' ? 'पत्थरों की जानकारी लोड हो रही है...' : 'Loading compared stone specifications...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <div className="mb-6">
          <BackButton fallbackHref="/catalogue" />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b border-stone-200 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block mb-1">
              {language === 'hi' ? 'तुलना तालिका' : 'Stone Comparison Matrix'}
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-charcoal-900">
              {t('compareMatrixTitle')} ({products.length}/4)
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm mt-1">
              {t('compareSubtitle')}
            </p>
          </div>

          {products.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs font-semibold text-rose-700 hover:underline self-start sm:self-auto"
            >
              {t('clearComparison')}
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-stone-sm">
            <div className="w-14 h-14 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
              <Scale className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-xl font-bold text-charcoal-900">
              {t('noStonesCompared')}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t('noStonesComparedDesc')}
            </p>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-widest rounded"
            >
              <span>{t('exploreCollection')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl border border-stone-200 shadow-stone-md">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-100/60">
                  <th className="p-4 sm:p-5 w-48 text-xs font-bold uppercase tracking-wider text-stone-500">
                    {t('feature')}
                  </th>
                  {products.map((p) => (
                    <th key={p.id} className="p-4 sm:p-5 text-left align-top min-w-[220px]">
                      <div className="relative group">
                        <button
                          onClick={() => removeFromCompare(p.id)}
                          className="absolute -top-2 -right-2 p-1.5 bg-white text-stone-400 hover:text-rose-600 rounded-full shadow border border-stone-200 z-10"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 mb-3 border border-stone-200">
                          <Image
                            src={p.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-charcoal-900 text-white text-[10px] font-bold uppercase rounded">
                            {p.format === 'SLAB' ? t('slab') : t('tile')}
                          </span>
                        </div>

                        <span className="text-[11px] font-mono text-stone-500 block">
                          {p.productCode}
                        </span>
                        <Link
                          href={`/products/${p.slug}`}
                          className="font-serif font-bold text-sm text-charcoal-900 hover:text-bronze-600 block line-clamp-1 mt-0.5"
                        >
                          {p.name}
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-200 text-xs">
                {/* Price */}
                <tr className="bg-stone-50/50">
                  <td className="p-4 sm:p-5 font-bold text-stone-700">{t('ratePerSqft')}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 sm:p-5">
                      <span className="font-sans text-base font-bold text-charcoal-950">
                        {formatINR(p.pricePerSqft, { showUnit: true, unit: language === 'hi' ? 'वर्ग फुट' : 'sq.ft.' })}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Material */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-stone-700">{t('material')}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 sm:p-5 text-charcoal-900 font-medium">
                      {p.material === 'Marble' ? t('marble') : p.material === 'Granite' ? t('granite') : t('stoneTiles')}
                    </td>
                  ))}
                </tr>

                {/* Format */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-stone-700">{t('format')}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 sm:p-5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                          p.format === 'SLAB'
                            ? 'bg-stone-200 text-charcoal-900'
                            : 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {p.format === 'SLAB' ? t('slab') : t('tile')}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Colour */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-stone-700">{t('colour')}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 sm:p-5 text-stone-700">
                      {p.colour}
                    </td>
                  ))}
                </tr>

                {/* Surface Finish */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-stone-700">{t('surfaceFinish')}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 sm:p-5 text-stone-700">
                      {p.finish}
                    </td>
                  ))}
                </tr>

                {/* Thickness */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-stone-700">{t('calibratedThickness')}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 sm:p-5 font-semibold text-charcoal-900">
                      {p.thicknessMm} mm
                    </td>
                  ))}
                </tr>

                {/* Dimensions */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-stone-700">{t('dimensions')}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 sm:p-5 text-stone-700">
                      {p.lengthInches} × {p.widthInches} inches
                    </td>
                  ))}
                </tr>

                {/* Approx Area */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-stone-700">{t('approxArea')}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 sm:p-5 text-stone-700">
                      {p.areaSqft} sq.ft.
                    </td>
                  ))}
                </tr>

                {/* Availability */}
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-stone-700">{t('stockQuantity')}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 sm:p-5">
                      <span className="text-emerald-700 font-medium">
                        {p.availability === 'AVAILABLE' ? t('available') : p.availability}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Action */}
                <tr className="bg-stone-50/70">
                  <td className="p-4 sm:p-5 font-bold text-stone-700">{t('action')}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-4 sm:p-5">
                      <button
                        onClick={() =>
                          setSelectedProductForQuote({
                            id: p.id,
                            name: p.name,
                            code: p.productCode,
                          })
                        }
                        className="w-full py-2.5 px-3 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                      >
                        {t('requestQuoteForStone')}
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Enquiry Modal */}
      {selectedProductForQuote && (
        <EnquiryModal
          isOpen={!!selectedProductForQuote}
          onClose={() => setSelectedProductForQuote(null)}
          product={selectedProductForQuote}
        />
      )}
    </div>
  );
}
