'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { getWhatsAppEnquiryUrl } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactForm() {
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    stoneInterest: 'Marble Slabs',
    approxAreaSqft: '',
    city: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError(language === 'hi' ? 'कृपया अपना नाम और मोबाइल नंबर भरें।' : 'Name and Phone number are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fullMessage = `Requirement: ${formData.stoneInterest}. Destination City: ${formData.city || 'Not specified'}. Message: ${formData.message}`;

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          whatsapp: formData.whatsapp || formData.phone,
          email: formData.email,
          quantity: formData.stoneInterest,
          approxAreaSqft: formData.approxAreaSqft ? parseFloat(formData.approxAreaSqft) : null,
          message: fullMessage,
        }),
      });

      if (!res.ok) throw new Error(language === 'hi' ? 'पूछताछ भेजने में समस्या आई। कृपया कॉल या व्हाट्सएप करें।' : 'Submission failed. Please call or WhatsApp us directly.');

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-stone-sm text-center space-y-4">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-charcoal-900">
          {t('enquiryReceived')}
        </h3>
        <p className="text-stone-600 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
          {t('enquirySuccessMsg')}
        </p>
        <div className="pt-2">
          <a
            href={getWhatsAppEnquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider rounded"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t('whatsappDirectly')}</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-stone-sm space-y-4">
      <div className="border-b border-stone-100 pb-4 mb-2">
        <h3 className="font-serif text-xl font-bold text-charcoal-900">
          {t('sendProjectReq')}
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          {t('sendProjectReqSub')}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">
            {t('yourName')}
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Ramesh Patel"
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">
            {t('mobileNumber')}
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="e.g. +91 98765 43210"
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">
            {t('whatsappNumber')}
          </label>
          <input
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            placeholder="98765 43210"
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">
            {t('emailAddress')}
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="contact@example.com"
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">
            {language === 'hi' ? 'पत्थर की श्रेणी' : 'Stone Category'}
          </label>
          <select
            value={formData.stoneInterest}
            onChange={(e) => setFormData({ ...formData, stoneInterest: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500"
          >
            <option value="Marble Slabs">{language === 'hi' ? 'मार्बल स्लैब (Marble Slabs)' : 'Marble Slabs'}</option>
            <option value="Marble Tiles / Pieces">{language === 'hi' ? 'मार्बल टाइल्स (Marble Tiles)' : 'Marble Tiles / Pieces'}</option>
            <option value="Granite Slabs">{language === 'hi' ? 'ग्रेनाइट स्लैब (Granite Slabs)' : 'Granite Slabs'}</option>
            <option value="Granite Tiles / Pieces">{language === 'hi' ? 'ग्रेनाइट टाइल्स (Granite Tiles)' : 'Granite Tiles / Pieces'}</option>
            <option value="Natural Stone Tiles">{language === 'hi' ? 'कोटा व प्राकृतिक टाइल्स (Stone Tiles)' : 'Natural Stone Tiles'}</option>
            <option value="Multiple Stone Requirements">{language === 'hi' ? 'अन्य / कई प्रकार के पत्थर' : 'Multiple Requirements'}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">
            {t('approxAreaSqft')}
          </label>
          <input
            type="number"
            value={formData.approxAreaSqft}
            onChange={(e) => setFormData({ ...formData, approxAreaSqft: e.target.value })}
            placeholder="e.g. 500"
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">
            {language === 'hi' ? 'डिलीवरी का शहर / राज्य' : 'Delivery City / State'}
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="e.g. Ahmedabad / Delhi / Mumbai"
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-700 mb-1">
          {t('messageRequirement')}
        </label>
        <textarea
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder={language === 'hi' ? 'कमरे का नाप, मोटाई या कोई विशेष पसंद यहाँ लिखें...' : 'Specify stone preferences, required thickness (e.g. 18mm, 20mm), or application details...'}
          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
        />
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:flex-1 py-3 px-6 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-widest rounded shadow-stone-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{loading ? t('sendingEnquiry') : t('sendEnquiry')}</span>
        </button>

        <a
          href={getWhatsAppEnquiryUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto py-3 px-5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{t('whatsappDirectly')}</span>
        </a>
      </div>
    </form>
  );
}
