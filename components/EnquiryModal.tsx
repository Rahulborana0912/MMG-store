'use client';

import React, { useState } from 'react';
import { X, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { getWhatsAppEnquiryUrl } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    id?: string;
    name?: string;
    code?: string;
  };
}

export default function EnquiryModal({ isOpen, onClose, product }: EnquiryModalProps) {
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    quantity: '',
    approxAreaSqft: '',
    message: product
      ? (language === 'hi'
          ? `नमस्ते MMG, मुझे ${product.name} (${product.code}) के दाम, स्लैब की लाइव फोटो और यार्ड में उपलब्धता की जानकारी चाहिए।`
          : `Please share the latest price, slab photos, and current availability for ${product.name} (${product.code}).`)
      : (language === 'hi'
          ? 'नमस्ते MMG, मुझे अपने मकान/प्रोजेक्ट के लिए पत्थर की वैरायटी और रेट की जानकारी चाहिए।'
          : 'Please share catalog, pricing and showroom consultation details.'),
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem('mmg_user');
        if (stored) {
          const user = JSON.parse(stored);
          setFormData((prev) => ({
            ...prev,
            name: prev.name || user.name || '',
            phone: prev.phone || user.phone || '',
            whatsapp: prev.whatsapp || user.phone || '',
            email: prev.email || user.email || '',
          }));
        }
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError(language === 'hi' ? 'कृपया अपना नाम और मोबाइल नंबर दर्ज करें।' : 'Please provide your name and mobile number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product?.id,
          name: formData.name,
          phone: formData.phone,
          whatsapp: formData.whatsapp || formData.phone,
          email: formData.email,
          quantity: formData.quantity,
          approxAreaSqft: formData.approxAreaSqft ? parseFloat(formData.approxAreaSqft) : null,
          message: formData.message,
        }),
      });

      if (!res.ok) {
        throw new Error(language === 'hi' ? 'पूछताछ भेजने में समस्या आई। कृपया व्हाट्सएप पर संपर्क करें।' : 'Failed to submit enquiry. Please try again or WhatsApp us.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const url = getWhatsAppEnquiryUrl(product?.name, product?.code);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-stone-xl max-w-lg w-full overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-stone-100 px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-bronze-600 block">
              {t('directShowroomEnquiry')}
            </span>
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              {product ? `${t('requestStoneQuotation')}: ${product.name}` : t('requestStoneQuotation')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-xl font-bold text-charcoal-900">
                {t('enquiryReceived')}
              </h4>
              <p className="text-sm text-stone-600 max-w-sm mx-auto">
                {t('enquirySuccessMsg')}
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleWhatsAppRedirect}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold uppercase tracking-wider rounded"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t('whatsappDirectly')}
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 bg-stone-100 text-stone-700 text-xs font-semibold uppercase tracking-wider rounded hover:bg-stone-200"
                >
                  {language === 'hi' ? 'ठीक है' : 'Done'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {product && (
                <div className="p-3 bg-stone-50 border border-stone-200 rounded flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-500 block">{language === 'hi' ? 'चुना हुआ पत्थर:' : 'Selected Product:'}</span>
                    <span className="font-semibold text-charcoal-900">{product.name}</span>
                  </div>
                  {product.code && (
                    <span className="font-mono bg-white px-2 py-1 border border-stone-200 rounded text-stone-700 font-medium">
                      {product.code}
                    </span>
                  )}
                </div>
              )}

              {error && (
                <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {t('yourName')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
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
                    placeholder="e.g. 98765 43210"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {t('whatsappNumber')}
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="98765 43210"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
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
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {t('requirementQuantity')}
                  </label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="e.g. 2 Slabs or 50 Pieces"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {t('approxAreaSqft')}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.approxAreaSqft}
                    onChange={(e) => setFormData({ ...formData, approxAreaSqft: e.target.value })}
                    placeholder="e.g. 150"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
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
                  placeholder={language === 'hi' ? 'शहर का नाम, मोटाई (18mm, 20mm) या कोई अन्य बात लिखें...' : 'Share details such as destination city, required thickness, or application...'}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 py-3 px-4 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {loading ? t('sendingEnquiry') : t('sendEnquiry')}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppRedirect}
                  className="w-full sm:w-auto py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t('whatsappDirectly')}
                </button>
              </div>

              <div className="text-[11px] text-stone-500 text-center">
                {language === 'hi' ? '* पक्का रेट साइज, मोटाई और दूरी के हिसाब से तय होगा।' : '* Final pricing may vary based on slab size, thickness, finish, and current quarry lot.'}
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
