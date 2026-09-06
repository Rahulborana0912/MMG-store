'use client';

import React, { useState } from 'react';
import {
  Building,
  Phone,
  Mail,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
  MessageCircle,
  AlertCircle,
  ExternalLink,
  Users,
} from 'lucide-react';
import { SiteSettingsData, ContactNumber, ContactEmail } from '@/lib/site-settings';

interface AdminSettingsClientProps {
  initialSettings: SiteSettingsData;
  staffUsers: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    department?: string | null;
  }>;
}

export default function AdminSettingsClient({
  initialSettings,
  staffUsers,
}: AdminSettingsClientProps) {
  const [settings, setSettings] = useState<SiteSettingsData>(initialSettings);
  const [numbers, setNumbers] = useState<ContactNumber[]>(initialSettings.contactNumbers);
  const [emails, setEmails] = useState<ContactEmail[]>(initialSettings.contactEmails);
  const [address, setAddress] = useState(initialSettings.address);
  const [mapsUrl, setMapsUrl] = useState(initialSettings.mapsUrl);
  const [companyName, setCompanyName] = useState(initialSettings.companyName);
  const [brandName, setBrandName] = useState(initialSettings.brandName);

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Contact Numbers handlers
  const handleAddNumber = () => {
    const newNumber: ContactNumber = {
      id: `phone-${Date.now()}`,
      phone: '',
      label: 'Showroom Desk',
      isPrimary: numbers.length === 0,
      isWhatsApp: false,
    };
    setNumbers([...numbers, newNumber]);
  };

  const handleUpdateNumber = (index: number, field: keyof ContactNumber, value: any) => {
    const updated = [...numbers];
    if (field === 'isPrimary') {
      // Single primary phone
      updated.forEach((n, idx) => {
        n.isPrimary = idx === index;
      });
    } else if (field === 'isWhatsApp') {
      // Single primary WhatsApp or multi-whatsapp
      updated.forEach((n, idx) => {
        n.isWhatsApp = idx === index;
      });
    } else {
      (updated[index] as any)[field] = value;
    }
    setNumbers(updated);
  };

  const handleRemoveNumber = (index: number) => {
    if (numbers.length <= 1) {
      alert('You must have at least one contact phone number.');
      return;
    }
    const updated = numbers.filter((_, idx) => idx !== index);
    if (!updated.some((n) => n.isPrimary)) {
      updated[0].isPrimary = true;
    }
    if (!updated.some((n) => n.isWhatsApp)) {
      updated[0].isWhatsApp = true;
    }
    setNumbers(updated);
  };

  // Contact Emails handlers
  const handleAddEmail = () => {
    const newEmail: ContactEmail = {
      id: `email-${Date.now()}`,
      email: '',
      label: 'Sales Enquiries',
      isPrimary: emails.length === 0,
    };
    setEmails([...emails, newEmail]);
  };

  const handleUpdateEmail = (index: number, field: keyof ContactEmail, value: any) => {
    const updated = [...emails];
    if (field === 'isPrimary') {
      updated.forEach((e, idx) => {
        e.isPrimary = idx === index;
      });
    } else {
      (updated[index] as any)[field] = value;
    }
    setEmails(updated);
  };

  const handleRemoveEmail = (index: number) => {
    if (emails.length <= 1) {
      alert('You must have at least one email address.');
      return;
    }
    const updated = emails.filter((_, idx) => idx !== index);
    if (!updated.some((e) => e.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setEmails(updated);
  };

  // Submit Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactNumbers: numbers,
          contactEmails: emails,
          address,
          mapsUrl,
          companyName,
          brandName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update settings.');
      }

      setSettings(data.settings);
      setNumbers(data.settings.contactNumbers);
      setEmails(data.settings.contactEmails);
      setSuccessMessage('Settings and contact numbers updated successfully across the entire website!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block mb-1">
            Corporate & Live Contact Configuration
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Showroom & Contact Settings
          </h1>
          <p className="text-xs text-stone-500">
            Manage public contact numbers, WhatsApp numbers, email addresses, and yard location. Changes take effect immediately.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-wider rounded shadow-stone-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* 1. Multiple Contact Numbers Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-stone-sm space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 flex-wrap gap-2">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <Phone className="w-5 h-5 text-bronze-600" />
              <span>Contact Phone Numbers (Multiple Direct Lines)</span>
            </h3>
            <button
              type="button"
              onClick={handleAddNumber}
              className="inline-flex items-center gap-1 text-xs font-semibold text-bronze-600 hover:text-bronze-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Phone Number</span>
            </button>
          </div>

          <p className="text-xs text-stone-500">
            These numbers are displayed on the website Navbar, Footer, and Contact page. You can set which number is the primary calling line and which number receives WhatsApp messages.
          </p>

          <div className="space-y-3">
            {numbers.map((item, index) => (
              <div
                key={item.id || index}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 transition-colors flex flex-col md:flex-row items-start md:items-center gap-3 justify-between"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto md:flex-1">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={item.phone}
                      onChange={(e) => handleUpdateNumber(index, 'phone', e.target.value)}
                      placeholder="+91 98873 90222"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Label / Contact Person
                    </label>
                    <input
                      type="text"
                      required
                      value={item.label}
                      onChange={(e) => handleUpdateNumber(index, 'label', e.target.value)}
                      placeholder="e.g. Rahul Borana / Owner / Showroom Desk"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2 md:pt-0 shrink-0">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-stone-700">
                    <input
                      type="radio"
                      name="primaryPhone"
                      checked={item.isPrimary}
                      onChange={() => handleUpdateNumber(index, 'isPrimary', true)}
                      className="text-bronze-600 focus:ring-bronze-500"
                    />
                    <span>Primary Call</span>
                  </label>

                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-emerald-800">
                    <input
                      type="radio"
                      name="whatsappPhone"
                      checked={item.isWhatsApp}
                      onChange={() => handleUpdateNumber(index, 'isWhatsApp', true)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRemoveNumber(index)}
                    disabled={numbers.length <= 1}
                    className="text-stone-400 hover:text-rose-600 disabled:opacity-30 p-1 transition-colors"
                    title="Delete number"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Multiple Email Addresses Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-stone-sm space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 flex-wrap gap-2">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-bronze-600" />
              <span>Official Email Addresses</span>
            </h3>
            <button
              type="button"
              onClick={handleAddEmail}
              className="inline-flex items-center gap-1 text-xs font-semibold text-bronze-600 hover:text-bronze-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Email</span>
            </button>
          </div>

          <div className="space-y-3">
            {emails.map((item, index) => (
              <div
                key={item.id || index}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 transition-colors flex flex-col md:flex-row items-start md:items-center gap-3 justify-between"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto md:flex-1">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={item.email}
                      onChange={(e) => handleUpdateEmail(index, 'email', e.target.value)}
                      placeholder="rahulborana1306@gmail.com"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Department / Purpose Label
                    </label>
                    <input
                      type="text"
                      required
                      value={item.label}
                      onChange={(e) => handleUpdateEmail(index, 'label', e.target.value)}
                      placeholder="e.g. Official Support & Quotations"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2 md:pt-0 shrink-0">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-stone-700">
                    <input
                      type="radio"
                      name="primaryEmail"
                      checked={item.isPrimary}
                      onChange={() => handleUpdateEmail(index, 'isPrimary', true)}
                      className="text-bronze-600 focus:ring-bronze-500"
                    />
                    <span>Primary Email</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(index)}
                    disabled={emails.length <= 1}
                    className="text-stone-400 hover:text-rose-600 disabled:opacity-30 p-1 transition-colors"
                    title="Delete email"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Company Particulars & Location Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-stone-sm space-y-5">
          <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Building className="w-5 h-5 text-bronze-600" />
            <span>Company Name & Physical Showroom Address</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Full Registered Company Name
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Brand / Acronym
              </label>
              <input
                type="text"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 font-semibold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Showroom & Stockyard Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-stone-700">
                  Google Maps Location URL
                </label>
                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-bronze-600 hover:underline"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                required
                value={mapsUrl}
                onChange={(e) => setMapsUrl(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-wider rounded shadow-stone-md transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>

      {/* Staff Accounts Reference */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-stone-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-stone-100 pb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-bronze-600" />
          <span>Authorized Staff & Administrator Accounts</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase">
              <tr>
                <th className="p-3">Staff Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">Role</th>
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
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-stone-500">
                    {u.department || 'Operations'}
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
