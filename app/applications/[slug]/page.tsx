import React from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import CatalogueClient from '@/components/CatalogueClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const aliasMap: Record<string, string> = {
  'kitchen-countertops': 'kitchen',
  'staircases': 'staircase',
  'bathrooms': 'bathroom',
  'floorings': 'flooring',
};

const applicationMap: Record<string, { title: string; filterKeyword: string; desc: string }> = {
  flooring: {
    title: 'Natural Stone for Living & Bedroom Flooring',
    filterKeyword: 'Flooring',
    desc: 'Crystalline Makrana marble, Morwad white, and durable Indian granites crafted for residential and heavy-traffic floors.',
  },
  kitchen: {
    title: 'Natural Stone for Kitchen Platforms & Countertops',
    filterKeyword: 'Countertops',
    desc: 'Dense, stain-resistant, heat-impervious 20mm Indian granites and dense marble varieties for culinary prep surfaces.',
  },
  staircase: {
    title: 'Natural Stone for Staircase Steps & Risers',
    filterKeyword: 'Staircases',
    desc: 'Calibrated monolithic stone slabs with uniform thickness, rounded bullnose edging, and flamed anti-skid textures.',
  },
  'wall-cladding': {
    title: 'Natural Stone for Feature Wall Cladding',
    filterKeyword: 'Wall Cladding',
    desc: 'Dramatic bookmatched vein patterns, Bidasar Rainforest Green, and Carrara Statuario for statement interior walls.',
  },
  bathroom: {
    title: 'Natural Stone for Bathrooms & Vanity Counters',
    filterKeyword: 'Bathrooms',
    desc: 'Low-porosity marble and calibrated granite tiles suited for humid, serene luxury washroom environments.',
  },
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const canonicalSlug = aliasMap[slug] || slug;
  const config = applicationMap[canonicalSlug];
  if (!config) return {};
  return {
    title: `${config.title} | MMG Kelwa Yard`,
    description: config.desc,
  };
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  if (aliasMap[slug]) {
    permanentRedirect(`/applications/${aliasMap[slug]}`);
  }
  const config = applicationMap[slug];

  if (!config) {
    notFound();
  }

  const products = await prisma.product.findMany({
    where: {
      published: true,
      OR: [
        { recommendedApplications: { contains: config.filterKeyword } },
        { description: { contains: config.filterKeyword } },
      ],
    },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    include: {
      images: { orderBy: { imageOrder: 'asc' } },
      slabs: {
        where: {
          isSample: false,
          status: 'AVAILABLE',
        },
        select: {
          id: true,
          slabCode: true,
          lengthInches: true,
          widthInches: true,
          thicknessMm: true,
          areaSqft: true,
          pricePerSqft: true,
          slabPrice: true,
          location: true,
          status: true,
        },
      },
    },
  });

  return (
    <CatalogueClient
      initialProducts={products as any}
      pageTitle={config.title}
      pageDescription={config.desc}
    />
  );
}
