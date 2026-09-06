import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import AccountClient from '@/components/AccountClient';
import AccountSessionGuard from '@/components/AccountSessionGuard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'My Account & Quotations | MMG Mahadev Marble and Granite',
  description: 'Manage your stone enquiries, track formal quotations, and view saved specifications.',
};

export default async function AccountPage() {
  const session = await getCurrentUser();

  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    redirect('/login');
  }

  // Fetch enquiries submitted by this user (or by this email)
  const enquiries = await prisma.enquiry.findMany({
    where: {
      OR: [
        { customerId: user.id },
        { email: user.email },
      ],
    },
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        select: {
          name: true,
          productCode: true,
          format: true,
        },
      },
    },
  });

  // Fetch formal quotations prepared for this user
  const quotations = await prisma.quotation.findMany({
    where: {
      OR: [
        { customerId: user.id },
        { customerEmail: user.email },
      ],
    },
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
    },
  });

  return (
    <>
      <AccountSessionGuard />
      <Suspense fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-stone-800 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-stone-600 uppercase tracking-widest">Loading Account Portal...</p>
          </div>
        </div>
      }>
        <AccountClient
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
          }}
          enquiries={enquiries.map((e) => ({
            id: e.id,
            enquiryNumber: e.enquiryNumber,
            quantity: e.quantity,
            approxAreaSqft: e.approxAreaSqft,
            message: e.message,
            status: e.status,
            createdAt: e.createdAt.toISOString(),
            product: e.product,
          }))}
          quotations={quotations.map((q) => ({
            id: q.id,
            quotationNumber: q.quotationNumber,
            subtotal: q.subtotal,
            discount: q.discount,
            additionalCharges: q.additionalCharges,
            gstRate: q.gstRate,
            gstAmount: q.gstAmount,
            total: q.total,
            status: q.status,
            validUntil: q.validUntil ? q.validUntil.toISOString() : null,
            notes: q.notes,
            termsAndConditions: q.termsAndConditions,
            createdAt: q.createdAt.toISOString(),
            items: q.items.map((it) => ({
              id: it.id,
              description: it.description,
              format: it.format,
              quantitySqft: it.quantitySqft,
              ratePerSqft: it.ratePerSqft,
              amount: it.amount,
            })),
          }))}
        />
      </Suspense>
    </>
  );
}
