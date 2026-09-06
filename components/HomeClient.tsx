'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  Phone,
  MessageCircle,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  Compass,
  FileText,
  Layers,
  ChevronRight,
  Building2,
  Home as HomeIcon,
  Flame,
  Check
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { getWhatsAppEnquiryUrl, formatINR } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface HomeClientProps {
  featuredProducts: any[];
  availableStockProducts?: any[];
  newArrivals?: any[];
  verifiedSlabsCount?: number;
}

export default function HomeClient({
  featuredProducts = [],
  availableStockProducts = [],
  newArrivals = [],
  verifiedSlabsCount = 0,
}: HomeClientProps) {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 text-charcoal-900 selection:bg-bronze-200 selection:text-charcoal-950">
      
      {/* =========================================================================
          1. HERO SECTION — LUXURY EDITORIAL SHOWROOM
      ========================================================================= */}
      <section className="relative min-h-[88vh] flex items-center justify-center bg-charcoal-950 text-white overflow-hidden">
        {/* Real Stone Backdrop with Subtle Illumination */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=90"
            alt="Mahadev Marble and Granite showroom slabs"
            fill
            priority
            className="object-cover object-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/70 to-charcoal-950/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          
          {/* Subtle Location & Brand Badge */}
          <a
            href="https://maps.app.goo.gl/Z4vojjCLAfeXNVvTA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-stone-800 text-stone-300 text-xs font-semibold tracking-widest uppercase mb-6 shadow-sm hover:border-amber-400 hover:text-amber-200 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Mahadev Marble and Granite • Raghunathpura, Kelwa
          </a>

          {/* Hero Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-stone-100 leading-[1.12] mb-6">
            Authentic Natural Stone. <br className="hidden sm:inline" />
            <span className="italic font-normal text-amber-200/90 font-serif">
              Craftsmanship &amp; Expertise.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-stone-300 font-light leading-relaxed mb-10">
            {language === 'hi'
              ? 'मकराना मार्बल, साउथ इंडियन ग्रेनाइट और प्राकृतिक पत्थरों का डिजिटल शोरूम। रघुनाथपुरा, केलवा में स्थित।'
              : 'Authentic Indian marble, calibrated granite, and architectural natural stone collections from Mahadev Marble and Granite, Raghunathpura, Kelwa.'}
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/available-stock"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-stone-100 hover:bg-white text-charcoal-950 text-xs font-bold uppercase tracking-widest rounded shadow-stone-md transition-all hover:translate-y-[-1px]"
            >
              <span>Explore Available Stock</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={getWhatsAppEnquiryUrl(
                'Showroom Enquiry',
                'HERO_CTA',
                'Hello MMG, I am planning a project and would like to explore your live stock of marble and granite.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-widest rounded shadow-stone-sm transition-all hover:translate-y-[-1px]"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp MMG</span>
            </a>

            <Link
              href="/send-requirement"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-stone-900/80 hover:bg-stone-800 text-stone-200 text-xs font-semibold uppercase tracking-widest rounded border border-stone-700 backdrop-blur-sm transition-all"
            >
              <span>Send Requirement</span>
            </Link>
          </div>

          {/* 4 Professional Trust Indicators */}
          <div className="mt-14 pt-8 border-t border-stone-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-stone-400 text-xs">
            <div className="flex flex-col items-center">
              <span className="font-semibold text-stone-200 text-xs sm:text-sm">100% Natural Stone</span>
              <span className="text-[11px] text-stone-400">Zero synthetic composites</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-stone-200 text-xs sm:text-sm">Gangsaw Calibrated</span>
              <span className="text-[11px] text-stone-400">Uniform 16mm, 18mm & 20mm</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-stone-200 text-xs sm:text-sm">Dry-Lay Yard Inspection</span>
              <span className="text-[11px] text-stone-400">Bookmatch preview before dispatch</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-stone-200 text-xs sm:text-sm">Pan-India Crated Loading</span>
              <span className="text-[11px] text-stone-400">Safe crated transport</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. CORE MATERIAL CATEGORIES (MARBLE, GRANITE, NATURAL STONE)
      ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-bronze-600">
            Quarry Sourced Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mt-1">
            Browse by Natural Material
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Every slab in our Raghunathpura, Kelwa yard is quarried directly from earth deposits, calibrated on modern multi-blade gangsaw frames, and inspected individually.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* MARBLE CARD */}
          <Link
            href="/marble"
            className="group relative h-96 rounded-2xl overflow-hidden shadow-stone-md border border-stone-200/80 bg-charcoal-900 flex flex-col justify-end p-8 transition-transform hover:-translate-y-1"
          >
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=85"
              alt="Natural Indian and Imported Marble Slabs"
              fill
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent" />
            
            <div className="relative z-10 space-y-2">
              <span className="text-amber-300 text-[11px] font-bold uppercase tracking-widest block">
                Makrana, Dungri & Imported
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Natural Marble
              </h3>
              <p className="text-xs text-stone-300 line-clamp-2">
                Pure calcium crystalline marble offering timeless luminosity, bookmatched veining, and heirloom longevity for premium flooring and master baths.
              </p>
              <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-amber-200 group-hover:text-white transition-colors">
                <span>Explore Marble Collection</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* GRANITE CARD */}
          <Link
            href="/granite"
            className="group relative h-96 rounded-2xl overflow-hidden shadow-stone-md border border-stone-200/80 bg-charcoal-900 flex flex-col justify-end p-8 transition-transform hover:-translate-y-1"
          >
            <Image
              src="https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=800&q=85"
              alt="Heavy Duty Granite Slabs"
              fill
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent" />
            
            <div className="relative z-10 space-y-2">
              <span className="text-amber-300 text-[11px] font-bold uppercase tracking-widest block">
                South Indian & Rajasthan Granite
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Natural Granite
              </h3>
              <p className="text-xs text-stone-300 line-clamp-2">
                High-density igneous quartz stones engineered by nature for extreme abrasion resistance, kitchen countertops, staircases, and heavy traffic commercial entries.
              </p>
              <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-amber-200 group-hover:text-white transition-colors">
                <span>Explore Granite Collection</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* NATURAL STONE CARD */}
          <Link
            href="/stone-tiles"
            className="group relative h-96 rounded-2xl overflow-hidden shadow-stone-md border border-stone-200/80 bg-charcoal-900 flex flex-col justify-end p-8 transition-transform hover:-translate-y-1"
          >
            <Image
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=85"
              alt="Kota Stone, Sandstone, Slate Tiles"
              fill
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent" />
            
            <div className="relative z-10 space-y-2">
              <span className="text-amber-300 text-[11px] font-bold uppercase tracking-widest block">
                Kota, Sandstone, Slate & Quartzite
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Natural Stone & Tiles
              </h3>
              <p className="text-xs text-stone-300 line-clamp-2">
                Authentic Indian architectural stones calibrated for exterior wall cladding, courtyard pathways, temple sanctums, pool decks, and heritage finishes.
              </p>
              <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-amber-200 group-hover:text-white transition-colors">
                <span>Explore Natural Stone</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* =========================================================================
          3. LIVE AVAILABLE STOCK (CORE SHOWROOM FEATURE)
      ========================================================================= */}
      <section className="py-16 sm:py-20 bg-stone-100/70 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${verifiedSlabsCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="text-xs font-bold uppercase tracking-widest text-stone-700">
                  {verifiedSlabsCount > 0 ? 'Kelwa Yard Stock' : 'Stone Portfolio & Availability'}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-charcoal-900">
                {verifiedSlabsCount > 0 ? 'Live Available Stone Inventory' : 'Featured Natural Stone Collection'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                {verifiedSlabsCount > 0
                  ? 'Verified stones available for immediate inspection and loading at our Raghunathpura, Kelwa yard.'
                  : 'New stock is being updated. Contact MMG for current availability.'}
              </p>
            </div>

            <Link
              href="/available-stock"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-charcoal-900 hover:text-bronze-600 transition-colors shrink-0"
            >
              <span>View All Available Stock</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(availableStockProducts.length > 0 ? availableStockProducts : featuredProducts).slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Indicative Pricing Transparency Notice */}
          <div className="p-4 rounded-xl bg-white border border-stone-200 text-stone-600 text-xs flex items-center justify-between gap-4">
            <p className="leading-relaxed">
              * Rates shown are reference showroom rates per sq.ft. Final commercial quotations are calculated server-side based on actual slab dimensions, crated packing, transport, and applicable taxes.
            </p>
            <Link
              href="/send-requirement"
              className="px-4 py-2 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold rounded whitespace-nowrap transition-colors"
            >
              Request Quote
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. NEW ARRIVALS (FRESH QUARRY LOTS)
      ========================================================================= */}
      {newArrivals.length > 0 && (
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-bronze-600">
                Fresh Quarry Shipments
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-charcoal-900 mt-1">
                New Arrivals at Kelwa Yard
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Freshly unloaded natural gangsaw blocks and lots ready for architectural dry-lay preview.
              </p>
            </div>

            <Link
              href="/new-arrivals"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-charcoal-900 hover:text-bronze-600 transition-colors shrink-0"
            >
              <span>Explore New Arrivals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          5. BROWSE BY ARCHITECTURAL APPLICATION
      ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-bronze-600">
              Architectural Material Guidance
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mt-1">
              Select Stone by Application
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              Every stone behaves differently under wear, moisture, and sunlight. Explore tested stones recommended for each specific area of your villa or commercial project.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
            {[
              { name: 'Kitchen Counter', slug: 'kitchen', desc: 'Granite & Quartzite' },
              { name: 'Living Flooring', slug: 'flooring', desc: 'Makrana & Dungri' },
              { name: 'Grand Staircase', slug: 'staircase', desc: 'Flamed & Polished' },
              { name: 'Wall Cladding', slug: 'wall-cladding', desc: 'Dry-hang Stone' },
              { name: 'Master Bath', slug: 'bathroom', desc: 'Honed Marble' },
              { name: 'Mandir / Temple', slug: 'temple', desc: 'White Makrana' },
              { name: 'Commercial', slug: 'commercial', desc: 'High-traffic Granite' },
            ].map((app) => (
              <Link
                key={app.slug}
                href={`/applications/${app.slug}`}
                className="group p-5 bg-stone-50 rounded-xl border border-stone-200/90 hover:border-charcoal-900 hover:bg-white transition-all text-center flex flex-col items-center justify-center space-y-2 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-stone-200 group-hover:bg-charcoal-900 group-hover:text-white flex items-center justify-center transition-colors">
                  <Compass className="w-5 h-5 text-charcoal-800 group-hover:text-amber-200" />
                </div>
                <h4 className="font-serif text-xs sm:text-sm font-bold text-charcoal-900 group-hover:text-charcoal-950">
                  {app.name}
                </h4>
                <span className="text-[10px] text-stone-400 font-medium">
                  {app.desc}
                </span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. HELP ME CHOOSE — CONVERSION MODULE
      ========================================================================= */}
      <section className="py-16 sm:py-20 bg-charcoal-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bronze-900/40 border border-bronze-700/60 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Stone Matching</span>
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                Not sure which stone suits your space?
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                Answer 5 simple questions about your project type, room usage, colour palette, and approximate area. Our system instantly recommends suitable marble, granite, and natural stone options available in our yard.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-stone-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>5-Step Guided Selection</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>No Account Required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Direct Yard Recommendations</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3 w-full sm:w-auto">
              <Link
                href="/help-me-choose"
                className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-charcoal-950 text-xs font-bold uppercase tracking-widest rounded shadow-md text-center transition-all"
              >
                Launch Help Me Choose
              </Link>
              <Link
                href="/send-requirement"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-widest rounded border border-white/20 text-center transition-all"
              >
                Send Custom Requirement
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. WHY MMG — VERIFIED NATURAL STONE EXPERTISE
      ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-bronze-600">
            The Kelwa Stockyard Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mt-1">
            Why Architects & Builders Trust MMG
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            We focus on genuine earth quarry extraction, calibrated thickness consistency, and complete transparency on physical lots.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-2xl border border-stone-200/90 shadow-stone-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              Zero Synthetic Composites
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Every slab displayed in our showroom is 100% natural stone extracted from earth quarries. We never sell artificial resin-based quartz or compressed chemical tiles disguised as natural stone.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-stone-200/90 shadow-stone-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              Multi-Blade Gangsaw Calibration
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Uniform 16mm, 18mm, and 20mm thickness across every gangsaw lot prevents tile dipping and uneven lippage during installation, drastically reducing site wastage.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-stone-200/90 shadow-stone-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              On-Site Dry-Lay Inspection
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Visit our Raghunathpura yard to dry-lay multiple slabs side by side on ground rails. Inspect vein flow and natural shade variation under natural sunlight before crated loading.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. REAL PROJECTS & RESIDENTIAL SHOWCASE
      ========================================================================= */}
      <section className="py-16 sm:py-24 bg-stone-100/80 border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-bronze-600">
                Architectural Inspiration
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-charcoal-900 mt-1">
                Natural Stone Applications & Concepts
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Representative design concepts and architectural spaces utilizing Indian marble, granite, and sandstone.
              </p>
            </div>

            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-charcoal-900 hover:text-bronze-600 transition-colors shrink-0"
            >
              <span>View Application Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Residential Living & Foyer Concepts',
                location: 'Flooring & Feature Wall Concept',
                stone: 'White Marble (Calibrated 18mm)',
                img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=85',
              },
              {
                title: 'Kitchen Countertops & Islands',
                location: 'Countertop & Backsplash Concept',
                stone: 'Polished Granite (Calibrated 20mm)',
                img: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=800&q=85',
              },
              {
                title: 'Courtyards & Verandah Pathways',
                location: 'Landscape & Cladding Concept',
                stone: 'Natural Sandstone & Kota Stone',
                img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=85',
              },
            ].map((p, idx) => (
              <div key={idx} className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-stone-sm group">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={p.img}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <span className="text-[11px] text-bronze-600 font-bold uppercase tracking-wider block">
                    {p.location}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-charcoal-900">
                    {p.title}
                  </h4>
                  <p className="text-xs text-stone-500">
                    {p.stone}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Architectural Notice */}
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-stone-500 text-center">
            * Representative architectural concepts. Verified MMG client installations will be published as photo permissions are approved.
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. SHOWROOM & KELWA YARD VISIT
      ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-charcoal-900 text-white rounded-3xl p-8 sm:p-14 overflow-hidden relative shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            <div className="space-y-6">
              <span className="text-amber-300 text-xs font-bold uppercase tracking-widest block">
                Physical Stockyard & Showroom
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
                Visit Our Stockyard in Raghunathpura, Kelwa
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                Experience natural stone in person. Walk through our A-frame gantry bays, review bookmatched gangsaw slabs under natural sunlight, and discuss custom dimensional cuts with our senior yard team.
              </p>

              <div className="space-y-3 text-xs text-stone-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Stockyard & Showroom:</strong>
                    <a
                      href="https://maps.app.goo.gl/Z4vojjCLAfeXNVvTA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline hover:text-amber-300 transition-colors"
                    >
                      Mahadev Marble and Granite, Raghunathpura, Kelwa
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Stockyard Timings:</strong>
                    <span>Monday to Sunday • 9:00 AM – 7:30 PM (Open 7 Days)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Direct Yard Contact:</strong>
                    <span>+91 98290 12345 / +91 94141 56789</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href={getWhatsAppEnquiryUrl(
                    'Yard Visit Appointment',
                    'HOMEPAGE_VISIT',
                    'Hello MMG, I would like to schedule a visit to your Raghunathpura, Kelwa stockyard to inspect natural marble and granite slabs.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider rounded shadow-md flex items-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Book Yard Appointment</span>
                </a>

                <a
                  href="https://maps.app.goo.gl/Z4vojjCLAfeXNVvTA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded border border-white/20 transition-all flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Google Maps Location</span>
                </a>
              </div>
            </div>

            {/* Visual Yard Badge */}
            <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-stone-700 shadow-inner">
              <Image
                src="https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=1000&q=85"
                alt="Mahadev Marble stockyard gantry in Raghunathpura Kelwa"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-charcoal-950/80 backdrop-blur-md border border-stone-700 text-xs text-stone-300">
                <span className="font-semibold text-white block">Dry-Lay Verification Bays</span>
                Gantry cranes and A-frame inspection racks ready for bookmatching verification.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          10. FINAL REQUIREMENT CTA — TELL US WHAT YOU NEED
      ========================================================================= */}
      <section className="py-16 sm:py-20 bg-stone-900 text-white border-t border-stone-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Prompt Commercial Estimates
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Tell Us What You Need
          </h2>
          <p className="text-stone-300 text-xs sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Submit your floor area, preferred natural stone tone, and project requirements. Our Udaipur technical sales team responds with verified lot photos and transparent commercial quotations within hours.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/send-requirement"
              className="w-full sm:w-auto px-8 py-4 bg-amber-400 hover:bg-amber-300 text-charcoal-950 text-xs font-bold uppercase tracking-widest rounded shadow-md transition-all"
            >
              Send Requirement (No Login Needed)
            </Link>

            <a
              href={getWhatsAppEnquiryUrl(
                'Direct Requirement',
                'FOOTER_CTA',
                'Hello MMG, I would like to enquire about natural marble and granite for my upcoming project.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Requirement</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          11. MOBILE STICKY BOTTOM CONTACT BAR
      ========================================================================= */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-charcoal-950/95 backdrop-blur-md border-t border-stone-800 px-4 py-2.5 flex items-center justify-between gap-2 shadow-2xl">
        <a
          href="tel:+919829012345"
          className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>Call MMG</span>
        </a>

        <a
          href={getWhatsAppEnquiryUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-white" />
          <span>WhatsApp</span>
        </a>

        <Link
          href="/send-requirement"
          className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-charcoal-950 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Enquire</span>
        </Link>
      </div>

    </div>
  );
}
