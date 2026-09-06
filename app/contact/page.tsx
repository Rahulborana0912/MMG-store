import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, Clock, Navigation, Mail } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import BackButton from '@/components/BackButton';
import { getWhatsAppEnquiryUrl } from '@/lib/utils';
import { getSiteSettings } from '@/lib/site-settings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Contact MMG | Mahadev Marble and Granite Showroom & Yard',
  description: 'Reach out to Mahadev Marble and Granite. Visit our processing yard and showroom in Raghunathpura, Kelwa, or request a customized quotation.',
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const primaryPhone = settings.contactNumbers.find((n) => n.isPrimary) || settings.contactNumbers[0];
  const whatsAppNumber = settings.contactNumbers.find((n) => n.isWhatsApp) || primaryPhone;

  return (
    <div className="bg-stone-50 min-h-screen py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Option */}
        <div>
          <BackButton fallbackHref="/" />
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block">
            Kelwa Yard & Showroom • केलवा यार्ड व शो-रूम
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-charcoal-900">
            Contact Mahadev Marble and Granite
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            Whether you need gangsaw slab photographs, pricing per sq.ft., or directions to visit our stockyard in Raghunathpura, Kelwa, our team is here to assist you.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Address */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-stone-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-bronze-600">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-charcoal-900">
              Showroom & Yard
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              {settings.address}
            </p>
            <a
              href={settings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-bronze-600 hover:text-bronze-700 pt-1"
            >
              <span>View on Google Maps</span>
              <Navigation className="w-3 h-3" />
            </a>
          </div>

          {/* Card 2: Direct Phone Lines (Multiple numbers support) */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-stone-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-bronze-600">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-charcoal-900">
              Direct Phone Lines
            </h3>
            <p className="text-xs text-stone-500">
              Speak directly with our team for stone inquiries:
            </p>
            <div className="pt-1 space-y-2">
              {settings.contactNumbers.map((c) => (
                <div key={c.id} className="pb-1 border-b border-stone-100 last:border-0 last:pb-0">
                  <a
                    href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`}
                    className="font-mono text-sm font-bold text-charcoal-900 hover:text-bronze-600 block"
                  >
                    {c.phone}
                  </a>
                  <span className="text-[11px] text-stone-500 flex items-center gap-1">
                    <span>{c.label}</span>
                    {c.isPrimary && <span className="text-[9px] font-bold text-bronze-700 uppercase">(Primary)</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: WhatsApp */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-stone-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-charcoal-900">
              WhatsApp Assistance
            </h3>
            <p className="text-xs text-stone-600">
              Fastest way to receive high-res slab pictures, batch videos, and estimates:
            </p>
            <div className="pt-1">
              <a
                href={getWhatsAppEnquiryUrl(undefined, undefined, undefined, whatsAppNumber?.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp ({whatsAppNumber?.phone})</span>
              </a>
            </div>
          </div>

          {/* Card 4: Official Emails & Hours */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-stone-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-bronze-600">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-charcoal-900">
              Official Email & Hours
            </h3>
            <div className="space-y-1">
              {settings.contactEmails.map((e) => (
                <div key={e.id}>
                  <a
                    href={`mailto:${e.email}`}
                    className="text-xs font-semibold text-charcoal-900 hover:text-bronze-600 block truncate"
                  >
                    {e.email}
                  </a>
                  <span className="text-[10px] text-stone-400">{e.label}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 text-[11px] text-stone-600 border-t border-stone-100 space-y-0.5">
              <p className="font-medium text-stone-800">Yard Hours:</p>
              <p>Mon – Sat: 9:00 AM – 7:30 PM</p>
              <p>Sunday: By Appointment</p>
            </div>
          </div>

        </div>

        {/* 2-Column: Form + Showroom Directions */}
        <div id="quote" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <div className="lg:col-span-5 space-y-6">
            
            {/* Showroom Directions Box */}
            <div className="bg-charcoal-900 text-white p-6 sm:p-8 rounded-2xl border border-stone-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-bronze-400 block">
                Showroom Visit Guide • कैसे पहुंचें
              </span>
              <h3 className="font-serif text-xl font-bold">
                Visiting Raghunathpura, Kelwa
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Kelwa &amp; Raghunathpura are located in Rajasthan&apos;s renowned marble belt along the National Highway (NH 58), with direct transport and logistics access for visiting architects, contractors, and freight trailers.
              </p>
              
              <ul className="space-y-2 text-xs text-stone-300 pt-1">
                <li>• Easy highway access on NH 58 (Udaipur–Nathdwara–Kelwa–Rajsamand corridor)</li>
                <li>• Live gantry stockyard inspection with natural daylight verification</li>
                <li>• Ample parking and loading bays for trucks, containers &amp; personal vehicles</li>
              </ul>

              <div className="pt-3">
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-white text-charcoal-950 text-xs font-semibold uppercase tracking-widest rounded hover:bg-stone-100 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Driving Directions</span>
                </a>
              </div>
            </div>

            {/* Direct Yard Support Box */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-stone-sm space-y-3">
              <h4 className="font-serif font-bold text-sm text-charcoal-900">
                Direct Yard Sourcing & Dispatch
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Visiting our processing yard allows architects and builders to inspect intact gangsaw book-matched blocks in natural daylight before purchase.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
                <span>Direct Owner Support:</span>
                <span className="font-bold text-charcoal-900 font-mono">{primaryPhone?.phone}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
