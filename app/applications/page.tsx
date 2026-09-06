import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Home, Utensils, Layers, Building, Bath } from 'lucide-react';
import BackButton from '@/components/BackButton';

export const metadata = {
  title: 'Architectural Natural Stone Applications | MMG Udaipur',
  description: 'Explore ideal natural marble, granite, and stone applications: living room flooring, kitchen countertops, wall cladding, staircases, and luxury bathrooms.',
};

export default function ApplicationsOverviewPage() {
  const applicationCategories = [
    {
      slug: 'flooring',
      title: 'Living & Bedroom Flooring',
      hi: 'कमरे व हॉल का फर्श',
      desc: 'Seamless bookmatched white marble slabs and durable granite for residential and commercial floors.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      icon: Home,
    },
    {
      slug: 'kitchen',
      title: 'Kitchen Platform & Countertops',
      hi: 'किचन प्लेटफॉर्म व स्लैब',
      desc: 'High-density 20mm heat and stain resistant granites like Black Galaxy, Tan Brown, and Steel Grey.',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      icon: Utensils,
    },
    {
      slug: 'wall-cladding',
      title: 'Feature Wall Cladding',
      hi: 'दीवार व टीवी बैकग्राउंड',
      desc: 'Dramatic exotic stones like Bidasar Rainforest Green, Italian Statuario, and Black Marquina.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      icon: Layers,
    },
    {
      slug: 'staircase',
      title: 'Staircase Steps & Risers',
      hi: 'सीढ़ियां (टप्पे व राइजर)',
      desc: 'Heavy-traffic natural granite and chamfered stone slabs with flamed anti-skid surface treatments.',
      image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80',
      icon: Building,
    },
    {
      slug: 'bathroom',
      title: 'Bathroom Vanity & Walls',
      hi: 'बाथरूम व वॉशबेसिन काउंटर',
      desc: 'Crystalline white Makrana marble and exotic Carrara stones for serene, water-resistant luxury.',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      icon: Bath,
    },
  ];

  return (
    <div className="bg-stone-50 min-h-screen py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back Option */}
        <div>
          <BackButton fallbackHref="/" />
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block">
            Architectural Material Guide • सही जगह, सही पत्थर
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-900">
            Natural Stone Applications
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            Every natural stone possesses distinct hardness, density, and absorption levels. Select an application below to view stones engineered by nature for specific spaces.
          </p>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {applicationCategories.map((app) => {
            const Icon = app.icon;
            return (
              <Link
                key={app.slug}
                href={`/applications/${app.slug}`}
                className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-stone-sm hover:shadow-stone-md transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <Image
                    src={app.image}
                    alt={app.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 backdrop-blur-md rounded">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-serif font-bold text-base">{app.title}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {app.desc}
                  </p>

                  <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-bronze-600 group-hover:text-charcoal-900 transition-colors">
                    <span>View Recommended Stones</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
