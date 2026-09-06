'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  Home,
  Utensils,
  Layers,
  Building,
  Bath
} from 'lucide-react';
import BackButton from '@/components/BackButton';
import { getWhatsAppEnquiryUrl } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export default function HelpMeChoosePage() {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    application: 'Flooring',
    material: 'Marble',
    colour: 'White',
    areaSqft: '500',
    budget: '₹150 - ₹350 / sq.ft.',
    name: '',
    phone: '',
    city: '',
    message: '',
  });

  const applications = [
    { id: 'Flooring', label: 'Living & Bedroom Flooring', hi: 'कमरे व हॉल का फर्श', icon: Home },
    { id: 'Kitchen', label: 'Kitchen Platform / Countertop', hi: 'किचन प्लेटफॉर्म व स्लैब', icon: Utensils },
    { id: 'Wall Cladding', label: 'Feature Wall Cladding', hi: 'दीवार व टीवी बैकग्राउंड', icon: Layers },
    { id: 'Staircase', label: 'Staircase Steps & Risers', hi: 'सीढ़ियां (टप्पे)', icon: Building },
    { id: 'Bathroom', label: 'Bathroom Vanity & Walls', hi: 'बाथरूम व वॉशबेसिन काउंटर', icon: Bath },
    { id: 'Temple', label: 'Pooja Room / Temple', hi: 'मंदिर व पूजा घर', icon: Sparkles },
  ];

  const materials = [
    { id: 'Marble', label: 'Natural Marble', hi: 'प्राकृतिक मार्बल', desc: 'Elegant veining, cooling touch, timeless prestige' },
    { id: 'Granite', label: 'High-Strength Granite', hi: 'मजबूत ग्रेनाइट', desc: 'Scratch-resistant, non-porous, zero-maintenance' },
    { id: 'Natural Stone', label: 'Natural Stone Tiles (Kota / Sandstone)', hi: 'कोटा व प्राकृतिक टाइलें', desc: 'Authentic quarry stone tiles, rustic textures' },
    { id: 'Not Sure', label: 'Not Sure — Recommend Best', hi: 'सुझाव दें — कौन सा बेहतर है', desc: 'Let MMG experts advise according to application' },
  ];

  const colours = [
    { id: 'White', label: 'White / Crystalline', hi: 'सफेद (White)', preview: 'bg-white border-stone-300' },
    { id: 'Black', label: 'Jet Black / Galaxy Sparkle', hi: 'काला (Black)', preview: 'bg-stone-900 border-stone-800 text-white' },
    { id: 'Beige', label: 'Warm Beige / Travertine Crema', hi: 'बेज / क्रीम (Beige)', preview: 'bg-[#EDE4D3] border-[#D5CBBA]' },
    { id: 'Grey', label: 'Steel Grey / Charcoal', hi: 'ग्रे (Grey)', preview: 'bg-stone-400 border-stone-500 text-white' },
    { id: 'Green', label: 'Rainforest Green / Exotic', hi: 'हरा (Rainforest Green)', preview: 'bg-emerald-800 border-emerald-900 text-white' },
    { id: 'Brown', label: 'Copper / Tan Brown', hi: 'भूरा (Brown)', preview: 'bg-amber-900 border-amber-950 text-white' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError(language === 'hi' ? 'कृपया अपना नाम और मोबाइल नंबर भरें।' : 'Name and Mobile Number are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fullRequirement = `Help Me Choose Request: Application=${formData.application}, Material=${formData.material}, Colour=${formData.colour}, Area=${formData.areaSqft} sq.ft., Budget=${formData.budget}, City=${formData.city || 'Not specified'}. Note: ${formData.message || 'None'}`;

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          city: formData.city,
          application: formData.application,
          preferredColour: formData.colour,
          approxAreaSqft: parseFloat(formData.areaSqft) || 500,
          quantity: `${formData.areaSqft} sq.ft.`,
          budget: formData.budget,
          message: fullRequirement,
          source: 'HELP_ME_CHOOSE',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit requirement.');
      }

      setSubmittedLead(data.enquiry);
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please contact us directly on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setError(null);
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="bg-stone-50 min-h-screen py-8 sm:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Option */}
        <div>
          <BackButton fallbackHref="/" />
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-200/80 rounded-full text-xs font-semibold text-charcoal-900 mb-1">
            <Compass className="w-3.5 h-3.5 text-bronze-600" />
            <span>{language === 'hi' ? 'स्टोन गाइड व सुझाव विज़ार्ड' : 'Stone Recommendation Wizard'}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-charcoal-900">
            {language === 'hi' ? 'अपने मकान के लिए सही पत्थर चुनें' : 'Help Me Choose the Right Stone'}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto">
            {language === 'hi'
              ? 'सिर्फ 4 आसान सवालों के जवाब दें। हमारी टीम आपके बजट और इस्तेमाल के हिसाब से सर्वोत्तम प्राकृतिक पत्थर सुझाएगी।'
              : 'Answer 4 simple questions. Our stone specialists will shortlist the most durable and cost-effective natural stone options for your space.'}
          </p>
        </div>

        {submittedLead ? (
          /* Confirmation State */
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-stone-200 shadow-stone-md text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-bronze-600">
                Requirement Ref: {submittedLead.enquiryNumber}
              </span>
              <h2 className="font-serif text-2xl font-bold text-charcoal-900">
                {language === 'hi' ? 'आपकी जरूरत दर्ज कर ली गई है!' : 'Requirement Received Successfully!'}
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed pt-1">
                {language === 'hi'
                  ? `धन्यवाद ${formData.name} जी। हमारी सुखेर यार्ड टीम आपके ${formData.application} के लिए ${formData.material} के फोटो और रेट आपके नंबर पर भेजेगी।`
                  : `Thank you ${formData.name}. Our stone team has shortlisted suitable ${formData.material} slabs for your ${formData.application} (${formData.areaSqft} sq.ft.).`}
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs text-left max-w-sm mx-auto space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Application:</span>
                <strong className="text-charcoal-900">{formData.application}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Material Preference:</span>
                <strong className="text-charcoal-900">{formData.material}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Approx Area:</span>
                <strong className="text-charcoal-900">{formData.areaSqft} sq.ft.</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Budget Range:</span>
                <strong className="text-charcoal-900">{formData.budget}</strong>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={getWhatsAppEnquiryUrl(
                  undefined,
                  submittedLead.enquiryNumber,
                  `Hello MMG, I just submitted requirement ${submittedLead.enquiryNumber} for ${formData.application} (${formData.material}, ${formData.areaSqft} sq.ft.). Please share recommended stone photos and rates.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{language === 'hi' ? 'व्हाट्सएप पर तुरंत फोटो मांगें' : 'Get Photos on WhatsApp'}</span>
              </a>

              <Link
                href="/catalogue"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-charcoal-900 text-xs font-semibold uppercase tracking-wider rounded transition-colors"
              >
                <span>{language === 'hi' ? 'कैटलॉग देखें' : 'Browse Catalogue'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Step Wizard Container */
          <div className="bg-white rounded-2xl border border-stone-200 shadow-stone-md overflow-hidden">
            
            {/* Step Progress Bar */}
            <div className="bg-stone-100 border-b border-stone-200 px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Step {currentStep} of 5
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((stepNum) => (
                  <div
                    key={stepNum}
                    className={`h-2 rounded-full transition-all ${
                      currentStep >= stepNum
                        ? 'w-6 bg-charcoal-900'
                        : 'w-2 bg-stone-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="m-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded">
                {error}
              </div>
            )}

            <div className="p-6 sm:p-8">
              {/* STEP 1: Application */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-charcoal-900">
                      1. {language === 'hi' ? 'आप पत्थर कहाँ लगाना चाहते हैं?' : 'Where will this stone be installed?'}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      {language === 'hi' ? 'जगह के अनुसार पत्थर की मजबूती और मोटाई तय होती है।' : 'Application determines required density, finish, and recommended thickness.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {applications.map((app) => {
                      const Icon = app.icon;
                      const isSelected = formData.application === app.id;
                      return (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, application: app.id })}
                          className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                            isSelected
                              ? 'border-charcoal-900 bg-stone-100 ring-1 ring-charcoal-900 shadow-sm'
                              : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-charcoal-900 text-white' : 'bg-stone-200 text-stone-700'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-semibold text-xs text-charcoal-900 block">
                              {language === 'hi' ? app.hi : app.label}
                            </span>
                            <span className="text-[11px] text-stone-500 block mt-0.5">{app.id}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Material Preference */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-charcoal-900">
                      2. {language === 'hi' ? 'आपकी पसंद का पत्थर कौन सा है?' : 'What is your preferred natural material?'}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      {language === 'hi' ? '100% असली प्राकृतिक पत्थर। कोई सिरेमिक या बनावटी टाइल नहीं।' : 'Strictly 100% quarried natural stone. Zero ceramic or composites.'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {materials.map((mat) => {
                      const isSelected = formData.material === mat.id;
                      return (
                        <button
                          key={mat.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, material: mat.id })}
                          className={`w-full p-4 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-charcoal-900 bg-stone-100 ring-1 ring-charcoal-900 shadow-sm'
                              : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-charcoal-900">
                              {language === 'hi' ? mat.hi : mat.label}
                            </span>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-bronze-600" />}
                          </div>
                          <p className="text-xs text-stone-600 mt-1">{mat.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: Colour / Look */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-charcoal-900">
                      3. {language === 'hi' ? 'किस रंग या शेड का पत्थर पसंद करेंगे?' : 'Which colour tone or look do you prefer?'}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      {language === 'hi' ? 'प्राकृतिक पत्थर में हर स्लैब की धारियां कुदरती और अनोखी होती हैं।' : 'Natural veining and crystalline patterns vary inherently between slabs.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {colours.map((col) => {
                      const isSelected = formData.colour === col.id;
                      return (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, colour: col.id })}
                          className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                            isSelected
                              ? 'border-charcoal-900 bg-stone-100 ring-1 ring-charcoal-900 shadow-sm'
                              : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full border shadow-inner shrink-0 ${col.preview}`} />
                          <span className="font-semibold text-xs text-charcoal-900">
                            {language === 'hi' ? col.hi : col.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: Area & Budget */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-charcoal-900">
                      4. {language === 'hi' ? 'लगभग कितना नाप (एरिया) और बजट है?' : 'Approximate Area & Budget'}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      {language === 'hi' ? 'अनुमानित वर्ग फुट बताएं ताकि हम सही लॉट और रेट सुझा सकें।' : 'Helps us calculate slab lots, wastage margins, and transport schedules.'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-2">
                      {language === 'hi' ? 'अनुमानित क्षेत्रफल (वर्ग फुट)' : 'Approximate Area (sq.ft.)'}
                    </label>
                    <div className="flex gap-2 mb-3">
                      {['300', '600', '1200', '2500'].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setFormData({ ...formData, areaSqft: preset })}
                          className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${
                            formData.areaSqft === preset
                              ? 'bg-charcoal-900 text-white border-charcoal-900'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {preset} sq.ft.
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={formData.areaSqft}
                      onChange={(e) => setFormData({ ...formData, areaSqft: e.target.value })}
                      placeholder="e.g. 850"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-2">
                      {language === 'hi' ? 'बजट दायरा (वैकल्पिक)' : 'Preferred Budget Range (Optional)'}
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500"
                    >
                      <option value="Under ₹100 / sq.ft.">Standard / Rugged (Under ₹100 / sq.ft.)</option>
                      <option value="₹100 - ₹250 / sq.ft.">Medium Residential (₹100 - ₹250 / sq.ft.)</option>
                      <option value="₹250 - ₹500 / sq.ft.">Premium Indian Marble & Granite (₹250 - ₹500 / sq.ft.)</option>
                      <option value="₹500 - ₹1000+ / sq.ft.">Luxury & Imported Statuario (₹500 - ₹1000+ / sq.ft.)</option>
                      <option value="Open / Quality Focused">Open / Quality Focused</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 5: Contact Details */}
              {currentStep === 5 && (
                <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-charcoal-900">
                      5. {language === 'hi' ? 'सुझाव और फोटो कहाँ भेजें?' : 'Where should we send stone options?'}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      {language === 'hi' ? 'हम आपके व्हाट्सएप या फोन पर वास्तविक स्लैब की फोटो और रेट भेजेंगे।' : 'We will send actual slab photographs and yard pricing directly.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        {language === 'hi' ? 'आपका नाम *' : 'Your Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Suresh Agarwal"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        {language === 'hi' ? 'मोबाइल नंबर / WhatsApp *' : 'Mobile / WhatsApp *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        {language === 'hi' ? 'शहर / राज्य' : 'Delivery City / State'}
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Delhi / Ahmedabad / Jaipur"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        {language === 'hi' ? 'कोई विशेष बात / संदेश' : 'Additional Message / Preference'}
                      </label>
                      <input
                        type="text"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="e.g. Bookmatch veining needed"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 px-6 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-widest rounded shadow-stone-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 text-bronze-400" />
                      <span>{loading ? 'Submitting Requirement...' : 'Let MMG Recommend Suitable Stones'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Navigation Controls */}
              {currentStep < 5 && (
                <div className="pt-8 border-t border-stone-100 flex items-center justify-between">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'पिछला सवाल' : 'Previous'}</span>
                    </button>
                  ) : <div />}

                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-charcoal-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-charcoal-800 transition-colors shadow-stone-sm"
                  >
                    <span>{language === 'hi' ? 'अगला सवाल' : 'Next Step'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
