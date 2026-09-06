'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Trash2, Save, ArrowLeft, Printer, Calculator } from 'lucide-react';
import { formatINR } from '@/lib/utils';

interface AvailableProduct {
  id: string;
  name: string;
  productCode: string;
  format: string;
  pricePerSqft: number;
}

interface QuotationBuilderFormProps {
  availableProducts: AvailableProduct[];
}

export default function QuotationBuilderForm({ availableProducts }: QuotationBuilderFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const prefillEnquiryId = searchParams.get('enquiryId') || '';
  const prefillName = searchParams.get('name') || '';
  const prefillPhone = searchParams.get('phone') || '';
  const prefillEmail = searchParams.get('email') || '';
  const prefillArea = searchParams.get('area') || '100';
  const prefillProductId = searchParams.get('productId') || '';

  const matchedProduct = availableProducts.find((p) => p.id === prefillProductId);

  // Form State
  const [customerName, setCustomerName] = useState(prefillName);
  const [customerPhone, setCustomerPhone] = useState(prefillPhone);
  const [customerEmail, setCustomerEmail] = useState(prefillEmail);
  const [customerAddress, setCustomerAddress] = useState('');

  // Line items
  const [items, setItems] = useState([
    {
      productId: matchedProduct?.id || availableProducts[0]?.id || '',
      description: matchedProduct
        ? `${matchedProduct.name} (${matchedProduct.productCode})`
        : availableProducts[0]
        ? `${availableProducts[0].name} (${availableProducts[0].productCode})`
        : 'Natural Stone Slab',
      format: matchedProduct?.format || 'SLAB',
      quantitySqft: parseFloat(prefillArea) || 100,
      ratePerSqft: matchedProduct?.pricePerSqft || 250,
    },
  ]);

  const [discount, setDiscount] = useState('0');
  const [additionalCharges, setAdditionalCharges] = useState('1500'); // Default local freight / crating
  const [notes, setNotes] = useState(
    '1. Rates include safe wooden crated packing and crane loading at Raghunathpura, Kelwa yard.\n2. Transportation to destination site on client account.'
  );
  const [termsAndConditions, setTermsAndConditions] = useState(
    '1. 50% advance along with confirmed order, balance prior to dispatch.\n2. Natural stone variation in shade and veins is inherent and acceptable.\n3. Goods once inspected and unloaded at site cannot be returned.\n4. Subject to Rajsamand/Udaipur jurisdiction.'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Line item handlers
  const handleItemProductSelect = (index: number, prodId: string) => {
    const p = availableProducts.find((item) => item.id === prodId);
    if (!p) return;

    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              productId: p.id,
              description: `${p.name} (${p.productCode}) - Calibrated Polish`,
              format: p.format,
              ratePerSqft: p.pricePerSqft,
            }
          : item
      )
    );
  };

  const updateItem = (index: number, field: string, value: any) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        productId: availableProducts[0]?.id || '',
        description: availableProducts[0]
          ? `${availableProducts[0].name} (${availableProducts[0].productCode})`
          : 'Natural Stone Slab',
        format: 'SLAB',
        quantitySqft: 100,
        ratePerSqft: 200,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  // Computations
  const subtotal = items.reduce(
    (sum, item) => sum + (parseFloat(item.quantitySqft.toString()) || 0) * (parseFloat(item.ratePerSqft.toString()) || 0),
    0
  );
  const disc = parseFloat(discount) || 0;
  const addl = parseFloat(additionalCharges) || 0;
  const taxable = Math.max(0, subtotal - disc + addl);
  const gstRate = 18.0;
  const gstAmount = Math.round((taxable * gstRate) / 100);
  const grandTotal = taxable + gstAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setError('Customer Name and Phone number are required.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      enquiryId: prefillEnquiryId || null,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || null,
      customerAddress: customerAddress.trim() || null,
      items,
      discount: disc,
      additionalCharges: addl,
      notes,
      termsAndConditions,
    };

    try {
      const res = await fetch('/api/admin/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save quotation.');
      }

      router.push('/admin/quotations');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create quotation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-charcoal-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Quotations</span>
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-wider rounded shadow-stone-sm transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Generating...' : 'Issue Formal Quotation'}</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
          {error}
        </div>
      )}

      {/* Customer Info Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-stone-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-stone-100 pb-3">
          1. Customer & Destination Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Customer Full Name *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Customer Mobile / WhatsApp *
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="e.g. client@example.com"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Delivery Site Address / City
            </label>
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="e.g. Bungalow 14, Udaipur, Rajasthan"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Line Items Builder (Section 31) */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-stone-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              2. Stone Items & Rates
            </h3>
            <p className="text-xs text-stone-500">
              Select products from inventory or write custom item specifications
            </p>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-charcoal-900 text-xs font-semibold rounded"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, idx) => {
            const lineAmount = (parseFloat(item.quantitySqft.toString()) || 0) * (parseFloat(item.ratePerSqft.toString()) || 0);
            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase text-stone-500">
                    Item #{idx + 1}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Quick Select Product */}
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Choose from Inventory
                    </label>
                    <select
                      value={item.productId}
                      onChange={(e) => handleItemProductSelect(idx, e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-stone-300 rounded text-xs text-charcoal-900 focus:ring-1 focus:ring-bronze-500"
                    >
                      <option value="">-- Custom Item --</option>
                      {availableProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.productCode}) - ₹{p.pricePerSqft}/sq.ft.
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Description on Quotation
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(idx, 'description', e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-stone-300 rounded text-xs text-charcoal-900 focus:ring-1 focus:ring-bronze-500"
                    />
                  </div>

                  {/* Format */}
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Format
                    </label>
                    <select
                      value={item.format}
                      onChange={(e) => updateItem(idx, 'format', e.target.value)}
                      className="w-full px-2 py-2 bg-white border border-stone-300 rounded text-xs text-charcoal-900"
                    >
                      <option value="SLAB">SLAB</option>
                      <option value="TILE">TILE</option>
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Qty (sq.ft.)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={item.quantitySqft}
                      onChange={(e) => updateItem(idx, 'quantitySqft', e.target.value)}
                      className="w-full px-2 py-2 bg-white border border-stone-300 rounded text-xs text-charcoal-900 font-semibold text-right"
                    />
                  </div>

                  {/* Rate */}
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Rate (₹)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={item.ratePerSqft}
                      onChange={(e) => updateItem(idx, 'ratePerSqft', e.target.value)}
                      className="w-full px-2 py-2 bg-white border border-stone-300 rounded text-xs text-charcoal-900 font-semibold text-right"
                    />
                  </div>

                  {/* Total Line Amount */}
                  <div className="sm:col-span-1 text-right">
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Amount (₹)
                    </label>
                    <div className="py-2 text-xs font-bold text-charcoal-900 font-sans">
                      {formatINR(lineAmount)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Calculations / Summary Strip */}
        <div className="border-t border-stone-200 pt-6 mt-6 max-w-sm ml-auto space-y-3 text-xs">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal:</span>
            <span className="font-semibold text-charcoal-900">{formatINR(subtotal)}</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-stone-600">Discount (₹):</span>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-28 px-2 py-1 bg-stone-50 border border-stone-300 rounded text-right text-xs"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-stone-600">Freight & Crated Packing (₹):</span>
            <input
              type="number"
              value={additionalCharges}
              onChange={(e) => setAdditionalCharges(e.target.value)}
              className="w-28 px-2 py-1 bg-stone-50 border border-stone-300 rounded text-right text-xs"
            />
          </div>

          <div className="flex justify-between text-stone-600">
            <span>GST (18% Standard):</span>
            <span className="font-semibold text-charcoal-900">{formatINR(gstAmount)}</span>
          </div>

          <div className="flex justify-between text-base font-bold text-charcoal-950 pt-2 border-t-2 border-stone-900">
            <span>Grand Total (INR):</span>
            <span className="font-sans">{formatINR(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-stone-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-stone-100 pb-3">
          3. Notes & Terms of Supply
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Quotation Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Terms & Conditions
            </label>
            <textarea
              rows={3}
              value={termsAndConditions}
              onChange={(e) => setTermsAndConditions(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

    </form>
  );
}
