'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  X,
  RotateCcw
} from 'lucide-react';
import ProductCard from './ProductCard';
import BackButton from './BackButton';
import { useLanguage } from '@/context/LanguageContext';

export interface ProductData {
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
  slabPrice?: number | null;
  thicknessMm: number;
  lengthInches: number;
  widthInches: number;
  areaSqft: number;
  quantity: number;
  availability: 'AVAILABLE' | 'LOW_STOCK' | 'SOLD_OUT' | 'ON_REQUEST';
  featured: boolean;
  isNewArrival: boolean;
  createdAt: string | Date;
  images: { imageUrl: string; altText?: string | null; isMain?: boolean }[];
}

interface CatalogueClientProps {
  initialProducts: ProductData[];
  initialMaterial?: string;
  pageTitle?: string;
  pageDescription?: string;
  isStockUpdating?: boolean;
}

export default function CatalogueClient({
  initialProducts,
  initialMaterial,
  pageTitle,
  pageDescription,
  isStockUpdating,
}: CatalogueClientProps) {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get('search') || '';

  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(
    initialMaterial ? [initialMaterial] : []
  );
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedColours, setSelectedColours] = useState<string[]>([]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [selectedThicknesses, setSelectedThicknesses] = useState<number[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Filter Options
  const materials = [
    { label: t('marble'), value: 'Marble' },
    { label: t('granite'), value: 'Granite' },
    { label: t('stoneTiles'), value: 'Natural Stone' },
  ];

  const formats = [
    { label: t('slab'), value: 'SLAB' },
    { label: t('tile'), value: 'TILE' },
  ];

  const colours = [
    { en: 'White', hi: 'सफेद (White)' },
    { en: 'Black', hi: 'काला (Black)' },
    { en: 'Grey', hi: 'ग्रे (Grey)' },
    { en: 'Beige', hi: 'क्रीम / बेज (Beige)' },
    { en: 'Brown', hi: 'भूरा (Brown)' },
    { en: 'Green', hi: 'हरा (Green)' },
    { en: 'Red', hi: 'लाल (Red)' },
  ];

  const finishes = ['Polished', 'Honed', 'Leathered', 'Flamed', 'Antique'];
  const thicknesses = [16, 18, 20, 22, 30];

  const availabilityOptions = [
    { label: t('available'), value: 'AVAILABLE' },
    { label: t('lowStock'), value: 'LOW_STOCK' },
    { label: t('onRequest'), value: 'ON_REQUEST' },
  ];

  const toggleMaterial = (m: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]
    );
  };

  const toggleFormat = (f: string) => {
    setSelectedFormats((prev) =>
      prev.includes(f) ? prev.filter((item) => item !== f) : [...prev, f]
    );
  };

  const toggleColour = (c: string) => {
    setSelectedColours((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  const toggleFinish = (fin: string) => {
    setSelectedFinishes((prev) =>
      prev.includes(fin) ? prev.filter((item) => item !== fin) : [...prev, fin]
    );
  };

  const toggleThickness = (tNum: number) => {
    setSelectedThicknesses((prev) =>
      prev.includes(tNum) ? prev.filter((item) => item !== tNum) : [...prev, tNum]
    );
  };

  const toggleAvailability = (av: string) => {
    setSelectedAvailability((prev) =>
      prev.includes(av) ? prev.filter((item) => item !== av) : [...prev, av]
    );
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedMaterials(initialMaterial ? [initialMaterial] : []);
    setSelectedFormats([]);
    setSelectedColours([]);
    setSelectedFinishes([]);
    setSelectedThicknesses([]);
    setSelectedAvailability([]);
    setMaxPrice(1000);
    setSortBy('featured');
  };

  // Compute Filtered Products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesQuery =
          product.name.toLowerCase().includes(query) ||
          product.productCode.toLowerCase().includes(query) ||
          product.colour.toLowerCase().includes(query) ||
          product.finish.toLowerCase().includes(query) ||
          product.pattern.toLowerCase().includes(query) ||
          product.material.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      if (selectedMaterials.length > 0 && !selectedMaterials.includes(product.material)) {
        return false;
      }

      if (selectedFormats.length > 0 && !selectedFormats.includes(product.format)) {
        return false;
      }

      if (selectedColours.length > 0 && !selectedColours.includes(product.colour)) {
        return false;
      }

      if (selectedFinishes.length > 0 && !selectedFinishes.includes(product.finish)) {
        return false;
      }

      if (selectedThicknesses.length > 0 && !selectedThicknesses.includes(product.thicknessMm)) {
        return false;
      }

      if (selectedAvailability.length > 0 && !selectedAvailability.includes(product.availability)) {
        return false;
      }

      if (product.pricePerSqft > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerSqft - b.pricePerSqft;
      if (sortBy === 'price-desc') return b.pricePerSqft - a.pricePerSqft;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'new-arrivals') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [
    initialProducts,
    searchTerm,
    selectedMaterials,
    selectedFormats,
    selectedColours,
    selectedFinishes,
    selectedThicknesses,
    selectedAvailability,
    maxPrice,
    sortBy,
  ]);

  const activeFilterCount =
    (searchTerm ? 1 : 0) +
    selectedMaterials.length +
    selectedFormats.length +
    selectedColours.length +
    selectedFinishes.length +
    selectedThicknesses.length +
    selectedAvailability.length +
    (maxPrice < 1000 ? 1 : 0);

  const displayTitle = pageTitle || (language === 'hi' ? 'प्राकृतिक मार्बल व ग्रेनाइट कैटलॉग' : 'Complete Natural Stone Catalogue');
  const displayDesc = pageDescription || (language === 'hi' ? 'हमारे यार्ड में उपलब्ध मार्बल स्लैब, ग्रेनाइट और पत्थर टाइलों का सीधा स्टॉक व दाम देखें।' : 'Browse our live inventory of quarried marble slabs, architectural granites, and natural stone tiles.');

  return (
    <div className="bg-stone-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Option + Header */}
        <div className="mb-6 space-y-4">
          <div>
            <BackButton fallbackHref="/" />
          </div>

          <div className="border-b border-stone-200 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block mb-1">
              Mahadev Marble and Granite • Raghunathpura, Kelwa
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-charcoal-900 mb-2">
              {displayTitle}
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {displayDesc}
            </p>
          </div>

          {/* Transparent Stock Cataloguing Alert */}
          {isStockUpdating && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-950 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1" />
                <div className="space-y-0.5">
                  <strong className="font-semibold block text-amber-950 text-sm">
                    New stock is being updated. Contact MMG for current availability.
                  </strong>
                  <p className="text-amber-800 text-xs leading-relaxed">
                    Physical gangsaw lots are currently undergoing dimensional calibration and photographic verification at our Raghunathpura, Kelwa yard. The stones listed below represent our active portfolio with reference specifications.
                  </p>
                </div>
              </div>
              <a
                href="https://wa.me/919829012345?text=Hello%20MMG%2C%20I%20would%20like%20to%20check%20current%20yard%20stock%20and%20incoming%20lots."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-wider rounded whitespace-nowrap transition-colors text-center shrink-0"
              >
                Inquire Yard Stock
              </a>
            </div>
          )}
        </div>

        {/* Top Control Bar: Search Input, Mobile Filter Button, Sort Dropdown */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-stone-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-8 py-2 bg-stone-50 border border-stone-200 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-stone-100 text-charcoal-900 text-xs font-semibold rounded border border-stone-200"
            >
              <Filter className="w-4 h-4" />
              <span>{t('filters')} ({activeFilterCount})</span>
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 hidden sm:inline">{t('sortBy')}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-stone-50 border border-stone-200 rounded text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-bronze-500"
              >
                <option value="featured">{t('featuredSlabs')}</option>
                <option value="new-arrivals">{t('newArrivals')}</option>
                <option value="price-asc">{t('priceLowHigh')}</option>
                <option value="price-desc">{t('priceHighLow')}</option>
                <option value="newest">{t('recentlyAdded')}</option>
              </select>
            </div>
          </div>

        </div>

        {/* Active Filter Pills Strip */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
            <span className="text-stone-500 font-medium mr-1">Active:</span>
            {selectedMaterials.map((m) => (
              <button
                key={m}
                onClick={() => toggleMaterial(m)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-stone-300 rounded-full text-stone-700 hover:border-stone-400"
              >
                <span>{m === 'Marble' ? t('marble') : m === 'Granite' ? t('granite') : t('stoneTiles')}</span>
                <X className="w-3 h-3" />
              </button>
            ))}
            {selectedFormats.map((f) => (
              <button
                key={f}
                onClick={() => toggleFormat(f)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-stone-300 rounded-full text-stone-700 hover:border-stone-400"
              >
                <span>{f === 'SLAB' ? t('slab') : t('tile')}</span>
                <X className="w-3 h-3" />
              </button>
            ))}
            {selectedColours.map((c) => (
              <button
                key={c}
                onClick={() => toggleColour(c)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-stone-300 rounded-full text-stone-700 hover:border-stone-400"
              >
                <span>{c}</span>
                <X className="w-3 h-3" />
              </button>
            ))}
            {selectedFinishes.map((fin) => (
              <button
                key={fin}
                onClick={() => toggleFinish(fin)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-stone-300 rounded-full text-stone-700 hover:border-stone-400"
              >
                <span>{fin}</span>
                <X className="w-3 h-3" />
              </button>
            ))}
            {selectedThicknesses.map((tNum) => (
              <button
                key={tNum}
                onClick={() => toggleThickness(tNum)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-stone-300 rounded-full text-stone-700 hover:border-stone-400"
              >
                <span>{tNum} mm</span>
                <X className="w-3 h-3" />
              </button>
            ))}
            {maxPrice < 1000 && (
              <button
                onClick={() => setMaxPrice(1000)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-stone-300 rounded-full text-stone-700 hover:border-stone-400"
              >
                <span>Up to ₹{maxPrice}/sq.ft.</span>
                <X className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-bronze-700 font-semibold hover:underline ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              {t('clearAll')}
            </button>
          </div>
        )}

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block bg-white rounded-xl border border-stone-200 p-6 shadow-stone-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <span className="font-serif font-bold text-charcoal-900 text-base">{t('filters')}</span>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetAllFilters}
                  className="text-[11px] font-semibold text-bronze-600 hover:underline"
                >
                  {t('clearAll')}
                </button>
              )}
            </div>

            {/* 1. Material Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2.5">
                {t('material')}
              </h4>
              <div className="space-y-1.5">
                {materials.map((m) => (
                  <label key={m.value} className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(m.value)}
                      onChange={() => toggleMaterial(m.value)}
                      className="rounded border-stone-300 text-bronze-600 focus:ring-bronze-500 w-3.5 h-3.5"
                    />
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Format: Slab vs Tile */}
            <div className="pt-4 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2.5">
                {t('format')}
              </h4>
              <div className="space-y-1.5">
                {formats.map((f) => (
                  <label key={f.value} className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFormats.includes(f.value)}
                      onChange={() => toggleFormat(f.value)}
                      className="rounded border-stone-300 text-bronze-600 focus:ring-bronze-500 w-3.5 h-3.5"
                    />
                    <span>{f.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Colour Filter */}
            <div className="pt-4 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2.5">
                {t('colour')}
              </h4>
              <div className="grid grid-cols-1 gap-1.5">
                {colours.map((c) => (
                  <label key={c.en} className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedColours.includes(c.en)}
                      onChange={() => toggleColour(c.en)}
                      className="rounded border-stone-300 text-bronze-600 focus:ring-bronze-500 w-3.5 h-3.5"
                    />
                    <span>{language === 'hi' ? c.hi : c.en}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. Finish Filter */}
            <div className="pt-4 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2.5">
                {t('surfaceFinish')}
              </h4>
              <div className="space-y-1.5">
                {finishes.map((fin) => (
                  <label key={fin} className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFinishes.includes(fin)}
                      onChange={() => toggleFinish(fin)}
                      className="rounded border-stone-300 text-bronze-600 focus:ring-bronze-500 w-3.5 h-3.5"
                    />
                    <span>{fin}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 5. Thickness */}
            <div className="pt-4 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2.5">
                {t('thicknessMm')}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {thicknesses.map((tNum) => (
                  <button
                    key={tNum}
                    type="button"
                    onClick={() => toggleThickness(tNum)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      selectedThicknesses.includes(tNum)
                        ? 'bg-charcoal-900 text-white border-charcoal-900 font-semibold'
                        : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {tNum}mm
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Price Range */}
            <div className="pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  {t('maxPrice')}
                </h4>
                <span className="text-xs font-semibold text-charcoal-900">
                  ₹{maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="1000"
                step="20"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-charcoal-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>₹40</span>
                <span>₹1000+</span>
              </div>
            </div>

            {/* 7. Availability */}
            <div className="pt-4 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2.5">
                Stock
              </h4>
              <div className="space-y-1.5">
                {availabilityOptions.map((av) => (
                  <label key={av.value} className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAvailability.includes(av.value)}
                      onChange={() => toggleAvailability(av.value)}
                      className="rounded border-stone-300 text-bronze-600 focus:ring-bronze-500 w-3.5 h-3.5"
                    />
                    <span>{av.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </aside>

          {/* Products Grid Area */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-charcoal-900">
                  {t('noMatchingStones')}
                </h3>
                <button
                  onClick={resetAllFilters}
                  className="px-4 py-2 bg-charcoal-900 text-white text-xs font-semibold uppercase tracking-wider rounded"
                >
                  {t('resetAllFilters')}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-4 px-1">
                  <span>
                    {t('showing')} <strong className="text-charcoal-900">{filteredProducts.length}</strong> {t('options')}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    * Rates in ₹ / sq.ft.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        productCode: product.productCode,
                        name: product.name,
                        slug: product.slug,
                        material: product.material,
                        format: product.format,
                        colour: product.colour,
                        pattern: product.pattern,
                        finish: product.finish,
                        pricePerSqft: product.pricePerSqft,
                        pricePerPiece: product.pricePerPiece,
                        thicknessMm: product.thicknessMm,
                        areaSqft: product.areaSqft,
                        availability: product.availability,
                        images: product.images,
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filters Slide-over Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-charcoal-950/60 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-xs bg-white h-full ml-auto p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <span className="font-serif font-bold text-charcoal-900 text-lg">{t('filters')}</span>
                <button onClick={() => setMobileFilterOpen(false)} className="text-stone-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Material */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">{t('material')}</h4>
                <div className="space-y-1.5">
                  {materials.map((m) => (
                    <label key={m.value} className="flex items-center gap-2 text-xs text-stone-700">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(m.value)}
                        onChange={() => toggleMaterial(m.value)}
                        className="rounded border-stone-300 text-bronze-600"
                      />
                      <span>{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">{t('format')}</h4>
                <div className="space-y-1.5">
                  {formats.map((f) => (
                    <label key={f.value} className="flex items-center gap-2 text-xs text-stone-700">
                      <input
                        type="checkbox"
                        checked={selectedFormats.includes(f.value)}
                        onChange={() => toggleFormat(f.value)}
                        className="rounded border-stone-300 text-bronze-600"
                      />
                      <span>{f.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Max Price */}
              <div>
                <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                  <span>{t('maxPrice')}</span>
                  <span>₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="1000"
                  step="20"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 flex gap-2">
              <button
                onClick={resetAllFilters}
                className="w-1/2 py-2.5 bg-stone-100 text-stone-800 text-xs font-semibold rounded"
              >
                {t('clearAll')}
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-2.5 bg-charcoal-900 text-white text-xs font-semibold rounded"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
