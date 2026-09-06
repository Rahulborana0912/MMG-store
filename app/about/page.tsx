import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, MapPin, Building2, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { getWhatsAppEnquiryUrl } from '@/lib/utils';
import BackButton from '@/components/BackButton';

export const metadata = {
  title: 'About MMG | Mahadev Marble and Granite Kelwa',
  description: 'Learn about Mahadev Marble and Granite Pvt. Ltd., our processing infrastructure in Raghunathpura, Kelwa, quarry sourcing, and commitment to authentic natural stone.',
};

export default function AboutPage() {
  return (
    <div className="bg-stone-50 min-h-screen py-8 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Button */}
        <div>
          <BackButton fallbackHref="/" />
        </div>

        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block">
            Natural Stone Excellence • प्राकृतिक पत्थर विशेषज्ञ
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-900 leading-tight">
            About Mahadev Marble and Granite Pvt. Ltd.
          </h1>
          <p className="text-stone-600 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            Located in Raghunathpura, Kelwa (Rajasthan) — in the heart of India&apos;s stone processing belt. Dedicated to supplying authentic quarried marble, granite, and natural stone products.
          </p>
        </div>

        {/* Hero Photo with Caption */}
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-stone-md border border-stone-200">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85"
            alt="Mahadev Marble and Granite showroom inventory"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 text-white text-xs">
            <span className="font-semibold block text-sm">MMG Digital Showroom & Stockyard Concept</span>
            Mahadev Marble and Granite, Raghunathpura, Kelwa, Rajasthan
          </div>
        </div>

        {/* Section 1: Who We Are & Natural Stone Heritage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-bronze-600">
              Our Identity • हमारी पहचान
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
              Authentic Natural Stone. Honest Pricing.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              <strong>Mahadev Marble and Granite Pvt. Ltd. (MMG)</strong> operates as a registered Indian natural stone company based in Raghunathpura, Kelwa. We connect traditional stone mining regions in Rajasthan and South India with architects, builders, and homeowners across the country.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              We focus on material integrity, clear stone grading, and accurate physical specifications. Our digital platform allows clients to explore natural marble, granite, and sandstone collections with complete clarity on rates and characteristics.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-stone-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-stone-100 pb-3">
              Our Core Principles • हमारे मूल नियम
            </h3>
            <ul className="space-y-3 text-xs text-stone-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-bronze-600 shrink-0 mt-0.5" />
                <span><strong>100% Quarried Natural Stone:</strong> We supply genuine natural stone extracted from established quarry reserves without artificial composites.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-bronze-600 shrink-0 mt-0.5" />
                <span><strong>Accurate Thickness & Sizing:</strong> Transparent reporting of standard 16mm, 18mm, 20mm, and 30mm dimensions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-bronze-600 shrink-0 mt-0.5" />
                <span><strong>Lot Transparency:</strong> We share natural daylight photographs and lot details of slabs prior to packing and loading.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-bronze-600 shrink-0 mt-0.5" />
                <span><strong>Pan-India Transport Coordination:</strong> Heavy wooden crating and transit coordination to residential sites and commercial projects.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section 2: Stone Sourcing & Processing Flow */}
        <div className="bg-stone-100/70 rounded-2xl p-8 sm:p-12 border border-stone-200 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block mb-1">
              From Quarry to Space • खदान से आपके घर तक
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
              How We Source & Process Stone
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-stone-sm">
              <span className="font-serif text-2xl font-bold text-bronze-600 block mb-2">01</span>
              <h4 className="font-bold text-sm text-charcoal-900 mb-1">Block Sourcing</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Selected monolithic blocks sourced from established stone mining belts across Rajasthan and South India.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-stone-sm">
              <span className="font-serif text-2xl font-bold text-bronze-600 block mb-2">02</span>
              <h4 className="font-bold text-sm text-charcoal-900 mb-1">Gangsaw Cutting</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Precision wire-saw and gangsaw slicing ensuring uniform calibrated thickness (18mm, 20mm) and clean diagonal edges.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-stone-sm">
              <span className="font-serif text-2xl font-bold text-bronze-600 block mb-2">03</span>
              <h4 className="font-bold text-sm text-charcoal-900 mb-1">Polishing & Honing</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Multi-head line polishing machines delivering high gloss, matte honed, or leathered textures suited for diverse applications.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-stone-sm">
              <span className="font-serif text-2xl font-bold text-bronze-600 block mb-2">04</span>
              <h4 className="font-bold text-sm text-charcoal-900 mb-1">Crated Loading</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                A-frame wooden bundling with edge protectors and crane loading for safe, zero-breakage transit to client sites across India.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Visit Our Showroom CTA */}
        <div className="bg-charcoal-900 text-white rounded-2xl p-8 sm:p-12 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-bronze-400 block">
            Raghunathpura, Kelwa, Rajasthan
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold">
            Plan a Visit to Our Showroom & Yard
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Experience standing gangsaw slabs in full daylight. Bring your architect or interior designer to view bookmatched pairs and discuss customized cutting schedules.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-white text-charcoal-950 text-xs font-semibold uppercase tracking-widest rounded hover:bg-stone-100 transition-colors"
            >
              Get Directions & Showroom Info
            </Link>
            <a
              href={getWhatsAppEnquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-[#25D366] text-white text-xs font-semibold uppercase tracking-widest rounded hover:bg-[#20bd5a] transition-colors"
            >
              WhatsApp Our Team
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
