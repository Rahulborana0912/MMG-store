'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, CheckCircle2, MessageCircle, FileText, ShieldCheck } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { getWhatsAppEnquiryUrl } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export default function SendRequirementPage() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    city: '',
    application: 'Flooring',
    material: 'Marble Slabs',
    approxAreaSqft: '',
    quantity: '',
    budget: '',
    preferredColour: 'White',
    message: '',
    consent: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError(language === 'hi' ? 'कृपया अपना नाम और मोबाइल नंबर अवश्य भरें।' : 'Name and Phone number are required.');
      return;
    }

    if (!formData.consent) {
      setError(language === 'hi' ? 'कृपया सहमति चेकबॉक्स चुनें।' : 'Please agree to allow MMG representatives to contact you.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fullMessage = `Requirement Details: Application=${formData.application}, Material=${formData.material}, Colour=${formData.preferredColour}, City=${formData.city || 'Not specified'}, Budget=${formData.budget || 'Open'}. Client Note: ${formData.message || 'None'}`;

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          whatsapp: formData.whatsapp || formData.phone,
          email: formData.email,
          city: formData.city,
          application: formData.application,
          preferredColour: formData.preferredColour,
          approxAreaSqft: formData.approxAreaSqft ? parseFloat(formData.approxAreaSqft) : null,
          quantity: formData.quantity || (formData.approxAreaSqft ? `${formData.approxAreaSqft} sq.ft.` : undefined),
          budget: formData.budget,
          message: fullMessage,
          source: 'SEND_REQUIREMENT',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit requirement.');
      }

      setSubmittedEnquiry(data.enquiry);
    } catch (err: any) {
      setError(err.message || 'Submission error. Please connect directly on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen py-8 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Option */}
        <div>
          <BackButton fallbackHref="/" />
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-bronze-600 block">
            Direct Showroom Desk • सीधा शो-रूम संपर्क
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-charcoal-900">
            {language === 'hi' ? 'मकान या प्रोजेक्ट की जरूरत भेजें' : 'Send Your Stone Requirement'}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto">
            {language === 'hi'
              ? 'बिना किसी लॉगिन के अपनी जरूरत, नाप और पसंद का पत्थर भेजें। हमारी सेल्स टीम आपको यार्ड की वास्तविक फोटो और रेट भेजेगी।'
              : 'Submit your architectural drawing, square footage, or material preference. No account creation required for public enquiry.'}
          </p>
        </div>

        {submittedEnquiry ? (
          /* Success Screen */
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 shadow-stone-md text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-bronze-600">
                Enquiry Number: {submittedEnquiry.enquiryNumber}
              </span>
              <h2 className="font-serif text-2xl font-bold text-charcoal-900">
                {language === 'hi' ? 'आपकी जरूरत सफलतापूर्वक प्राप्त हुई!' : 'Requirement Registered Successfully!'}
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed pt-1">
                {language === 'hi'
                  ? `धन्यवाद ${formData.name} जी। आपकी पूछताछ महादेव मार्बल एंड ग्रेनाइट (सुखेर, उदयपुर) टीम को मिल गई है। हम शीघ्र ही संपर्क करेंगे।`
                  : `Thank you ${formData.name}. Your requirement has been saved under ${submittedEnquiry.enquiryNumber}. Our sales manager will contact you promptly.`}
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={getWhatsAppEnquiryUrl(
                  undefined,
                  submittedEnquiry.enquiryNumber,
                  `Hello MMG, I just submitted requirement ${submittedEnquiry.enquiryNumber} for ${formData.material} (${formData.approxAreaSqft || 'project'} sq.ft.). Please share slab photos and quotation.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{language === 'hi' ? 'व्हाट्सएप पर बात जारी रखें' : 'Continue on WhatsApp'}</span>
              </a>

              <Link
                href="/catalogue"
                className="w-full sm:w-auto px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-charcoal-900 text-xs font-semibold uppercase tracking-wider rounded transition-colors"
              >
                {language === 'hi' ? 'कैटलॉग देखें' : 'Browse Catalogue'}
              </Link>
            </div>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-200 shadow-stone-md space-y-6">
            
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded">
                {error}
              </div>
            )}

            {/* Section 1: Contact Details */}
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-stone-100 pb-2 mb-4">
                1. {language === 'hi' ? 'संपर्क विवरण' : 'Contact Information'}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {language === 'hi' ? 'आपका नाम *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rajesh Singhal"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {language === 'hi' ? 'मोबाइल नंबर *' : 'Mobile Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98873 90222"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {language === 'hi' ? 'व्हाट्सएप नंबर (फोटो के लिए)' : 'WhatsApp Number'}
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="Same as mobile"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {language === 'hi' ? 'ईमेल (वैकल्पिक)' : 'Email Address (Optional)'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
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
                    placeholder="e.g. Udaipur / Delhi"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Stone Requirements */}
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-stone-100 pb-2 mb-4">
                2. {language === 'hi' ? 'पत्थर व प्रोजेक्ट की जानकारी' : 'Stone Specifications & Quantities'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {language === 'hi' ? 'कहाँ लगाना है (एप्लीकेशन)' : 'Application Area'}
                  </label>
                  <select
                    value={formData.application}
                    onChange={(e) => setFormData({ ...formData, application: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500"
                  >
                    <option value="Flooring">Living & Bedroom Flooring</option>
                    <option value="Kitchen Platform">Kitchen Platform / Countertop</option>
                    <option value="Staircase">Staircase Steps & Risers</option>
                    <option value="Wall Cladding">Feature Wall Cladding</option>
                    <option value="Bathroom">Bathroom Vanity & Walls</option>
                    <option value="Pooja Room">Pooja Room / Temple</option>
                    <option value="Multiple Areas">Whole House / Multiple Areas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {language === 'hi' ? 'पत्थर का प्रकार' : 'Material Type'}
                  </label>
                  <select
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500"
                  >
                    <option value="Marble Slabs">Marble Slabs (Gangsaw Cut)</option>
                    <option value="Granite Slabs">Granite Slabs (20mm Polished)</option>
                    <option value="Stone Tiles">Natural Stone Tiles (Kota / Sandstone)</option>
                    <option value="Mixed Slabs & Tiles">Mixed Slabs & Cut Tiles</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {language === 'hi' ? 'पसंदीदा रंग' : 'Preferred Colour / Look'}
                  </label>
                  <select
                    value={formData.preferredColour}
                    onChange={(e) => setFormData({ ...formData, preferredColour: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500"
                  >
                    <option value="White">White (Makrana / Morwad / Statuario)</option>
                    <option value="Black">Black (Black Galaxy / Black Marquina)</option>
                    <option value="Grey">Steel Grey / Graphite</option>
                    <option value="Beige">Beige / Crema / Travertine</option>
                    <option value="Green">Rainforest Green / Exotic</option>
                    <option value="Brown">Tan Brown / Imperial Red</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {language === 'hi' ? 'अनुमानित क्षेत्रफल (वर्ग फुट)' : 'Approx Area (sq.ft.)'}
                  </label>
                  <input
                    type="number"
                    value={formData.approxAreaSqft}
                    onChange={(e) => setFormData({ ...formData, approxAreaSqft: e.target.value })}
                    placeholder="e.g. 1200"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {language === 'hi' ? 'अनुमानित बजट दायरा' : 'Budget Range'}
                  </label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="e.g. ₹150 - ₹300 per sq.ft."
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {language === 'hi' ? 'विस्तृत संदेश / ड्राइंग का विवरण' : 'Project Details / Architectural Notes'}
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={language === 'hi' ? 'कमरों की संख्या, मोटाई (18mm या 20mm), बुकमैचिंग या कोई अन्य बात लिखें...' : 'Specify floor plan dimensions, required slab sizes, bookmatch matching preferences, or target delivery timeframe...'}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="pt-2 border-t border-stone-100 flex items-start gap-2.5 text-xs text-stone-600">
              <input
                type="checkbox"
                id="consent"
                checked={formData.consent}
                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                className="rounded border-stone-300 text-bronze-600 focus:ring-bronze-500 mt-0.5 w-4 h-4"
              />
              <label htmlFor="consent" className="cursor-pointer">
                I authorize Mahadev Marble and Granite Pvt. Ltd. to contact me via Phone / WhatsApp regarding slab photographs, pricing, and dispatch schedule.
              </label>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-widest rounded shadow-stone-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Registering Requirement...' : 'Send Stone Requirement to MMG'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
