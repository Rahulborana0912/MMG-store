import React from 'react';
import prisma from '@/lib/prisma';
import AdminQuotationsClient from '@/components/AdminQuotationsClient';

export const dynamic = 'force-dynamic';

export default async function AdminQuotationsPage() {
  const quotations = await prisma.quotation.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
    },
  });

  return (
    <AdminQuotationsClient
      initialQuotations={quotations.map((q) => ({
        ...q,
        createdAt: q.createdAt.toISOString(),
        validUntil: q.validUntil ? q.validUntil.toISOString() : null,
      })) as any}
    />
  );
}
