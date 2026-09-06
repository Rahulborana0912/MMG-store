import React from 'react';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getSiteSettings } from '@/lib/site-settings';
import AdminSettingsClient from '@/components/AdminSettingsClient';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  try {
    await requireAuth(['ADMIN']);
  } catch {
    redirect('/admin');
  }

  const settings = await getSiteSettings();

  const staffUsers = await prisma.user.findMany({
    where: {
      role: {
        in: ['ADMIN', 'STAFF'],
      },
    },
    include: {
      staffProfile: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <AdminSettingsClient
      initialSettings={settings}
      staffUsers={staffUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        department: u.staffProfile?.department,
      }))}
    />
  );
}
