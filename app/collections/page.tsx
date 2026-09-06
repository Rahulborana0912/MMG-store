import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import BackButton from '@/components/BackButton';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Curated Natural Stone Collections | MMG Mahadev Marble and Granite',
  description: 'Explore our curated stone groupings: White Marble, Black Granite, Exotic Rainforest Green, South Indian Granites, and Calibrated Natural Stone Tiles.',
};

export default async function CollectionsPage() {
  const whiteMarbles = await prisma.product.findMany({
    where: { material: 'Marble', colour: 'White', published: true },
    include: { images: { orderBy: { imageOrder: 'asc' } } },
  });

  const blackStones = await prisma.product.findMany({
    where: { colour: 'Black', published: true },
    include: { images: { orderBy: { imageOrder: 'asc' } } },
  });

  const exoticStones = await prisma.product.findMany({
    where: {
      published: true,
      OR: [{ colour: 'Green' }, { pattern: 'Exotic' }],
    },
    include: { images: { orderBy: { imageOrder: 'asc' } } },
  });

  const naturalTiles = await prisma.product.findMany({
    where: {
      published: true,
      format: 'TILE',
    },
    include: { images: { orderBy: { imageOrder: 'asc' } } },
  });

  return (
    <div className="bg-stone-50 min-h-screen py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Option */}
        <div>
          <BackButton fallbackHref="/catalogue" />
        </div>

        {/* Header */}
        <div className="border-b border-stone-200 pb-8 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block mb-2">
            Architectural Groupings • खास पत्थर कलेक्शन
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-900 mb-3">
            Curated Stone Collections
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            Organized by material lineage, colour harmony, and architectural application. Discover matching slabs and tiles for cohesive interior spaces.
          </p>
        </div>

        {/* Collection 1: White Marble Legacy */}
        {whiteMarbles.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Collection 01
                </span>
                <h2 className="font-serif text-2xl font-bold text-charcoal-900">
                  The White Marble Heritage • सफेद मार्बल
                </h2>
                <p className="text-xs text-stone-600">
                  Makrana Pure White, Morwad, and Italian Statuario slabs with delicate veining.
                </p>
              </div>
              <Link
                href="/marble"
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-bronze-600 hover:text-bronze-700"
              >
                <span>View All White Marble</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {whiteMarbles.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </section>
        )}

        {/* Collection 2: Deep Obsidian & Black Granite */}
        {blackStones.length > 0 && (
          <section className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Collection 02
                </span>
                <h2 className="font-serif text-2xl font-bold text-charcoal-900">
                  Obsidian & Black Galaxy Granites • काला ग्रेनाइट
                </h2>
                <p className="text-xs text-stone-600">
                  Golden-flecked Black Galaxy, Black Marquina marble, and high-density dark stone slabs.
                </p>
              </div>
              <Link
                href="/granite"
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-bronze-600 hover:text-bronze-700"
              >
                <span>View All Black Stones</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blackStones.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </section>
        )}

        {/* Collection 3: Exotic & Coloured Natural Stones */}
        {exoticStones.length > 0 && (
          <section className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Collection 03
                </span>
                <h2 className="font-serif text-2xl font-bold text-charcoal-900">
                  Exotic & Feature Wall Stones • डिजाइनर दीवार के पत्थर
                </h2>
                <p className="text-xs text-stone-600">
                  Bidasar Rainforest Green, dramatic vein patterns, and statement stone slabs.
                </p>
              </div>
              <Link
                href="/catalogue"
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-bronze-600 hover:text-bronze-700"
              >
                <span>View Full Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {exoticStones.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </section>
        )}

        {/* Collection 4: Natural Stone Tiles & Calibrated Pieces */}
        {naturalTiles.length > 0 && (
          <section className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Collection 04
                </span>
                <h2 className="font-serif text-2xl font-bold text-charcoal-900">
                  Calibrated Natural Stone Tiles • प्राकृतिक पत्थर टाइल्स
                </h2>
                <p className="text-xs text-stone-600">
                  Kota Stone, Jaisalmer Sandstone, and pre-cut granite tiles. 100% natural quarried stone.
                </p>
              </div>
              <Link
                href="/stone-tiles"
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-bronze-600 hover:text-bronze-700"
              >
                <span>View Stone Tiles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {naturalTiles.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
