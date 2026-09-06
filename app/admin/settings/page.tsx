import React from 'react';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Building, ShieldCheck, Phone, Mail, MapPin, Users } from 'lucide-react';
import { formatIndianDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  try {
    await requireAuth(['ADMIN']);
  } catch {
    redirect('/admin');
  }

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
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block mb-1">
          Corporate & Master Configuration
        </span>
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">
          Showroom & Company Settings
        </h1>
        <p className="text-xs text-stone-500">
          Company registration particulars, tax identification, and staff authorization.
        </p>
      </div>

      {/* Company Legal Identity */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-stone-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-stone-100 pb-3 flex items-center gap-2">
          <Building className="w-5 h-5 text-bronze-600" />
          <span>Entity & Tax Details</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-stone-400 block text-[11px]">Full Registered Name</span>
            <span className="font-bold text-charcoal-900 text-sm">Mahadev Marble and Granite Pvt. Ltd.</span>
          </div>

          <div>
            <span className="text-stone-400 block text-[11px]">Short Brand Name</span>
            <span className="font-bold text-charcoal-900 text-sm">MMG</span>
          </div>

          <div>
            <span className="text-stone-400 block text-[11px]">GSTIN (Rajasthan)</span>
            <span className="font-mono text-stone-500 italic">Not Configured / Available on Registration</span>
          </div>

          <div>
            <span className="text-stone-400 block text-[11px]">Corporate Identification Number (CIN)</span>
            <span className="font-mono text-stone-500 italic">Not Configured</span>
          </div>

          <div className="sm:col-span-2">
            <span className="text-stone-400 block text-[11px]">Showroom & Yard Address</span>
            <a
              href="https://maps.app.goo.gl/Z4vojjCLAfeXNVvTA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-800 hover:text-bronze-600 font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-bronze-600" />
              <span>Mahadev Marble and Granite, Raghunathpura, Kelwa</span>
            </a>
          </div>

          <div>
            <span className="text-stone-400 block text-[11px]">Official Phone</span>
            <span className="font-bold text-stone-800">+91 98290 12345</span>
          </div>

          <div>
            <span className="text-stone-400 block text-[11px]">Official WhatsApp</span>
            <span className="font-bold text-emerald-700">+91 98290 12345</span>
          </div>
        </div>
      </div>

      {/* Staff & Role-Based Access List (Section 29) */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-stone-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-stone-100 pb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-bronze-600" />
          <span>Staff Accounts & Role-Based Access</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase">
              <tr>
                <th className="p-3">Staff Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">Role & Permissions</th>
                <th className="p-3">Department</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-charcoal-900">
              {staffUsers.map((u) => (
                <tr key={u.id}>
                  <td className="p-3 font-semibold">{u.name}</td>
                  <td className="p-3 text-stone-600">{u.email}</td>
                  <td className="p-3 text-stone-600">{u.phone}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'ADMIN'
                          ? 'bg-charcoal-900 text-white'
                          : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      {u.role === 'ADMIN' ? 'ADMIN' : 'STAFF'}
                    </span>
                  </td>
                  <td className="p-3 text-stone-500">
                    {u.staffProfile?.department || 'Operations'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
