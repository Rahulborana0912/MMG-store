import React from 'react';
import prisma from '@/lib/prisma';
import AdminEnquiriesClient from '@/components/AdminEnquiriesClient';

export const dynamic = 'force-dynamic';

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        select: {
          name: true,
          productCode: true,
          material: true,
          format: true,
          pricePerSqft: true,
        },
      },
    },
  });

  return (
    <AdminEnquiriesClient
      initialEnquiries={enquiries.map((e) => ({
        ...e,
        createdAt: e.createdAt.toISOString(),
      })) as any}
    />
  );
}
