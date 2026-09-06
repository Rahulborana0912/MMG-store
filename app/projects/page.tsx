import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import BackButton from '@/components/BackButton';

export const metadata = {
  title: 'Stone Applications & Concept Gallery | Mahadev Marble and Granite Udaipur',
  description: 'Explore architectural applications, design layouts, and stone specifications for marble, granite, and natural stones from MMG Udaipur.',
};

export default function ProjectsPage() {
  const concepts = [
    {
      title: 'Residential Living & Grand Foyer',
      applicationType: 'Interior Flooring & Accent Feature',
      stoneUsed: 'Makrana Pure White Marble (18mm)',
      application: 'Drawing Room & Foyer Flooring',
      areaGuidance: 'Ideal for 1,500 - 5,000 sq.ft.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      desc: 'Seamless bookmatched natural white marble delivering high thermal reflectivity and pristine crystalline luster for residential interiors.',
    },
    {
      title: 'Hospitality & Atrium Feature Walls',
      applicationType: 'Vertical Accent Cladding',
      stoneUsed: 'Rainforest Green & Morwad White Marble',
      application: 'Lobby & Reception Feature Cladding',
      areaGuidance: 'Custom Wall Dimensions',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
      desc: 'Dramatic earth-toned serpentine veining creating an organic, distinctive focal point in open lobbies and double-height walls.',
    },
    {
      title: 'Culinary Countertops & Kitchen Islands',
      applicationType: 'Heavy-Duty Counter Surface',
      stoneUsed: 'Black Galaxy Granite (20mm High-Gloss/Leathered)',
      application: 'Waterfall Kitchen Island & Countertops',
      areaGuidance: 'Custom Counter Slabs',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
      desc: 'Dense igneous natural granite with golden bronzite inclusions, providing high scratch resistance and minimal porosity for modern kitchens.',
    },
    {
      title: 'Courtyards, Verandahs & Landscape Pathways',
      applicationType: 'Exterior Non-Slip Paving',
      stoneUsed: 'Kota Stone Natural Green & Sandstone',
      application: 'Patios, Walkways & Covered Verandahs',
      areaGuidance: 'Calibrated Tiles / Slabs',
      image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85',
      desc: 'Durable fine-grained natural stone providing comfortable barefoot walking, natural cooling, and slip resistance for outdoor settings.',
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
            Architectural Concepts • वास्तुशिल्प अनुप्रयोग
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-900">
            Natural Stone Applications & Concepts
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            Recommended architectural applications and design possibilities for Mahadev Marble & Granite stone collections. Verified client project installations will be published as photo permissions are approved.
          </p>
        </div>

        {/* Notice Banner */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          <span>
            <strong>Concept Design Notice:</strong> Visual imagery shown below illustrates representative architectural styling and layout concepts. Actual MMG slab photography is shared for each order prior to dispatch.
          </span>
        </div>

        {/* Projects / Concepts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {concepts.map((project, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-stone-sm hover:shadow-stone-md transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 right-3 bg-charcoal-900/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded backdrop-blur-sm">
                  {project.areaGuidance}
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-bronze-600 font-medium">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{project.applicationType}</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-charcoal-900">
                    {project.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed pt-1">
                    {project.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Recommended Stone:</span>
                    <strong className="text-charcoal-900">{project.stoneUsed}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Typical Area:</span>
                    <span className="text-stone-700">{project.application}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/send-requirement"
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-charcoal-900 hover:text-bronze-600 transition-colors"
                  >
                    <span>Enquire About Similar Slabs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Footer Box */}
        <div className="bg-charcoal-900 text-white rounded-2xl p-8 sm:p-12 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-bronze-400">
            Commercial & Residential Sourcing
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Have a Project Requiring Bulk Slabs or Calibrated Pieces?
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Send us your BOQ or bill of quantities. We provide container load schedules, slab bookmatching dry-lay services, and insured pan-India transit.
          </p>
          <div className="pt-2">
            <Link
              href="/send-requirement"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-charcoal-950 text-xs font-semibold uppercase tracking-widest rounded hover:bg-stone-100 transition-colors"
            >
              <span>Submit Project BOQ</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
