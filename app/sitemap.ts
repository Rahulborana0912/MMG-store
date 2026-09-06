import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mahadevmarble.com';

  const staticRoutes = [
    '',
    '/catalogue',
    '/marble',
    '/granite',
    '/stone-tiles',
    '/available-stock',
    '/new-arrivals',
    '/collections',
    '/applications',
    '/applications/flooring',
    '/applications/kitchen',
    '/applications/staircase',
    '/applications/wall-cladding',
    '/applications/bathroom',
    '/compare',
    '/help-me-choose',
    '/send-requirement',
    '/projects',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-conditions',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    const products = await prisma.product.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    const productRoutes = products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
