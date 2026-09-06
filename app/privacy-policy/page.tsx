import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | MMG Mahadev Marble and Granite Pvt. Ltd.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-stone-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 shadow-stone-sm space-y-6 text-xs text-stone-700 leading-relaxed">
        <h1 className="font-serif text-3xl font-bold text-charcoal-900 border-b border-stone-100 pb-4">
          Privacy Policy — Mahadev Marble and Granite Pvt. Ltd.
        </h1>
        <p>
          At Mahadev Marble and Granite Pvt. Ltd. (&quot;MMG&quot;), we respect and protect the privacy of our customers, architects, and partners who access our digital catalogue or interact with our sales representatives.
        </p>
        <h2 className="font-serif text-base font-bold text-charcoal-900 pt-2">1. Information We Collect</h2>
        <p>
          We collect personal identification information such as your name, mobile number, WhatsApp contact, email address, destination city, and square footage requirements when you submit quotation requests or contact us.
        </p>
        <h2 className="font-serif text-base font-bold text-charcoal-900 pt-2">2. How We Use Your Information</h2>
        <p>
          Your information is strictly utilized to prepare itemized commercial quotations, transmit slab batch photographs/videos via WhatsApp or email, coordinate physical inspection visits at our Raghunathpura, Kelwa facility, and organize freight transit. We do not sell or trade customer contact details.
        </p>
        <h2 className="font-serif text-base font-bold text-charcoal-900 pt-2">3. Contact Us</h2>
        <p>
          For questions regarding this policy, contact our Raghunathpura, Kelwa office at sales@mahadevmarble.com or +91 98290 12345.
        </p>
      </div>
    </div>
  );
}
