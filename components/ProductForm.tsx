'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Save,
  ArrowLeft,
  UploadCloud,
  Trash2,
  Check,
  Plus,
  Info,
  Upload,
  Star,
  Loader2
} from 'lucide-react';
import { formatImageUrl } from '@/lib/utils';

interface ProductFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState(initialData?.name || '');
  const [productCode, setProductCode] = useState(initialData?.productCode || '');
  const [material, setMaterial] = useState(initialData?.material || 'Marble');
  const [format, setFormat] = useState<'SLAB' | 'TILE'>(initialData?.format || 'SLAB');
  const [colour, setColour] = useState(initialData?.colour || 'White');
  const [pattern, setPattern] = useState(initialData?.pattern || 'Natural Veins');
  const [finish, setFinish] = useState(initialData?.finish || 'Polished');
  const [description, setDescription] = useState(initialData?.description || '');
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || '');
  const [pricePerSqft, setPricePerSqft] = useState(initialData?.pricePerSqft || '');
  const [pricePerPiece, setPricePerPiece] = useState(initialData?.pricePerPiece || '');
  const [slabPrice, setSlabPrice] = useState(initialData?.slabPrice || '');
  const [thicknessMm, setThicknessMm] = useState(initialData?.thicknessMm || '18');
  const [lengthInches, setLengthInches] = useState(initialData?.lengthInches || '120');
  const [widthInches, setWidthInches] = useState(initialData?.widthInches || '72');
  const [areaSqft, setAreaSqft] = useState(initialData?.areaSqft || '60');
  const [quantity, setQuantity] = useState(initialData?.quantity || '10');
  const [availability, setAvailability] = useState(initialData?.availability || 'AVAILABLE');
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [isNewArrival, setIsNewArrival] = useState(initialData?.isNewArrival || false);
  const [published, setPublished] = useState(initialData?.published !== false);
  const [recommendedApplications, setRecommendedApplications] = useState(
    initialData?.recommendedApplications || 'Living Room Flooring, Wall Cladding, Countertops'
  );
  const [origin, setOrigin] = useState(initialData?.origin || 'Rajasthan, India');

  // Photo gallery state
  const [images, setImages] = useState<{ imageUrl: string; imageType: string; isMain?: boolean }[]>(
    initialData?.images?.map((img: any) => ({
      imageUrl: img.imageUrl,
      imageType: img.imageType || 'MAIN',
      isMain: img.isMain,
    })) || [
      {
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
        imageType: 'MAIN',
        isMain: true,
      },
    ]
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  // Auto-calculate area in sq.ft. when dimensions change: (L * W) / 144
  const handleDimensionChange = (newLength: string, newWidth: string) => {
    setLengthInches(newLength);
    setWidthInches(newWidth);
    const l = parseFloat(newLength);
    const w = parseFloat(newWidth);
    if (!isNaN(l) && !isNaN(w) && l > 0 && w > 0) {
      const calculatedSqft = Math.round(((l * w) / 144) * 10) / 10;
      setAreaSqft(calculatedSqft.toString());

      // If price per sq.ft is set, calculate approx slab price
      const rate = parseFloat(pricePerSqft.toString());
      if (!isNaN(rate) && rate > 0) {
        setSlabPrice(Math.round(calculatedSqft * rate).toString());
      }
    }
  };

  const handlePriceChange = (newRate: string) => {
    setPricePerSqft(newRate);
    const rate = parseFloat(newRate);
    const sqft = parseFloat(areaSqft.toString());
    if (!isNaN(rate) && !isNaN(sqft) && rate > 0 && sqft > 0) {
      setSlabPrice(Math.round(sqft * rate).toString());
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const addImage = () => {
    if (newImageUrl.trim()) {
      const formatted = formatImageUrl(newImageUrl.trim());
      setImages((prev) => [
        ...prev,
        {
          imageUrl: formatted,
          imageType: prev.length === 0 ? 'MAIN' : 'SLAB',
          isMain: prev.length === 0,
        },
      ]);
      setNewImageUrl('');
    }
  };

  const setMainImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        isMain: idx === index,
        imageType: idx === index ? 'MAIN' : (img.imageType === 'MAIN' ? 'SLAB' : img.imageType),
      }))
    );
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const next = prev.filter((_, idx) => idx !== index);
      if (next.length > 0 && !next.some((img) => img.isMain)) {
        next[0].isMain = true;
        next[0].imageType = 'MAIN';
      }
      return next;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload image.');
      }
      if (data.url) {
        setImages((prev) => [
          ...prev,
          {
            imageUrl: data.url,
            imageType: prev.length === 0 ? 'MAIN' : 'SLAB',
            isMain: prev.length === 0,
          },
        ]);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !productCode.trim() || !pricePerSqft) {
      setError('Product Name, Product Code, and Price per sq.ft. are required.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      name: name.trim(),
      productCode: productCode.trim(),
      material,
      format,
      colour,
      pattern,
      finish,
      description: description.trim(),
      shortDescription: shortDescription.trim() || null,
      pricePerSqft: parseFloat(pricePerSqft.toString()) || 0,
      pricePerPiece: pricePerPiece ? parseFloat(pricePerPiece.toString()) : null,
      slabPrice: slabPrice ? parseFloat(slabPrice.toString()) : null,
      thicknessMm: parseFloat(thicknessMm.toString()) || 18,
      lengthInches: parseFloat(lengthInches.toString()) || 0,
      widthInches: parseFloat(widthInches.toString()) || 0,
      areaSqft: parseFloat(areaSqft.toString()) || 0,
      quantity: parseInt(quantity.toString()) || 1,
      availability,
      featured,
      isNewArrival,
      published,
      recommendedApplications,
      origin,
      images,
    };

    try {
      const url = isEditing
        ? `/api/admin/products/${initialData.id}`
        : '/api/admin/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save product.');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error saving product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-charcoal-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-wider rounded shadow-stone-sm transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : isEditing ? 'Update Product' : 'Publish Product'}</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
          {error}
        </div>
      )}

      {/* 1. Basic Information */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-stone-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-stone-100 pb-3">
          1. Basic Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Makrana Pure White Marble"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Product / Slab Code *
            </label>
            <input
              type="text"
              required
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              placeholder="e.g. MMG-MAR-WHT-024"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded font-mono text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Stone Material *
            </label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500"
            >
              <option value="Marble">Marble</option>
              <option value="Granite">Granite</option>
              <option value="Natural Stone">Natural Stone (Sandstone/Limestone)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Format Specification *
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs font-bold text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500"
            >
              <option value="SLAB">Gangsaw Slab (Dimensions & Area)</option>
              <option value="TILE">Tile / Piece (Cut-to-size)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Stone Attributes & Mineral Profile */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-stone-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-stone-100 pb-3">
          2. Stone Specifications & Finish
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Colour Tone
            </label>
            <select
              value={colour}
              onChange={(e) => setColour(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500"
            >
              <option value="White">White</option>
              <option value="Black">Black</option>
              <option value="Grey">Grey</option>
              <option value="Beige">Beige</option>
              <option value="Brown">Brown</option>
              <option value="Green">Green</option>
              <option value="Red">Red</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Vein / Pattern
            </label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. Natural Veins / Speckled / Cloudy"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Surface Finish
            </label>
            <select
              value={finish}
              onChange={(e) => setFinish(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500"
            >
              <option value="Polished">Polished (High Gloss)</option>
              <option value="Honed">Honed (Matte Smooth)</option>
              <option value="Leathered">Leathered (Tactile Texture)</option>
              <option value="Flamed">Flamed (Thermal Rugged)</option>
              <option value="Antique">Antique Brushed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Quarry Origin
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Makrana, Rajasthan, India"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Recommended Applications
            </label>
            <input
              type="text"
              value={recommendedApplications}
              onChange={(e) => setRecommendedApplications(e.target.value)}
              placeholder="e.g. Flooring, Wall Cladding, Countertops"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* 3. Dimensions & Physical Measurements */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-stone-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-stone-100 pb-3">
          3. Physical Dimensions ({format === 'SLAB' ? 'Slab Format' : 'Tile / Piece Format'})
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Length (Inches)
            </label>
            <input
              type="number"
              step="any"
              value={lengthInches}
              onChange={(e) => handleDimensionChange(e.target.value, widthInches.toString())}
              placeholder="120"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Width (Inches)
            </label>
            <input
              type="number"
              step="any"
              value={widthInches}
              onChange={(e) => handleDimensionChange(lengthInches.toString(), e.target.value)}
              placeholder="72"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Calibrated Thickness (mm)
            </label>
            <select
              value={thicknessMm}
              onChange={(e) => setThicknessMm(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500"
            >
              <option value="16">16 mm</option>
              <option value="18">18 mm (Standard Marble)</option>
              <option value="20">20 mm (Standard Granite)</option>
              <option value="22">22 mm (Kota Stone)</option>
              <option value="30">30 mm (Heavy Duty)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Approx. Area (sq.ft.)
            </label>
            <input
              type="number"
              step="any"
              value={areaSqft}
              onChange={(e) => setAreaSqft(e.target.value)}
              placeholder="60.0"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs font-bold text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* 4. Pricing & Inventory */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-stone-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-stone-100 pb-3">
          4. Pricing (₹ INR) & Yard Inventory
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Price per sq.ft. (₹) *
            </label>
            <input
              type="number"
              required
              step="any"
              value={pricePerSqft}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="e.g. 250"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded font-sans text-xs font-bold text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              {format === 'SLAB' ? 'Approx. Total Slab Price (₹)' : 'Price per Piece (₹)'}
            </label>
            <input
              type="number"
              step="any"
              value={format === 'SLAB' ? (slabPrice || '') : (pricePerPiece || '')}
              onChange={(e) =>
                format === 'SLAB' ? setSlabPrice(e.target.value) : setPricePerPiece(e.target.value)
              }
              placeholder="Auto-calculated or custom"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Stock Quantity ({format === 'SLAB' ? 'Slabs' : 'Pieces'})
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="10"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">
            Current Availability Status
          </label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value as any)}
            className="w-full sm:w-64 px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs font-semibold text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500"
          >
            <option value="AVAILABLE">Available in Yard</option>
            <option value="LOW_STOCK">Low Stock (Few Slabs Left)</option>
            <option value="SOLD_OUT">Sold Out</option>
            <option value="ON_REQUEST">On Quarry Request</option>
          </select>
        </div>
      </div>

      {/* 5. Photo Gallery Management */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-stone-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              5. Staff Photo Management ({images.length} Photos)
            </h3>
            <span className="text-[11px] text-stone-500">
              Upload stone photographs directly or paste Google Drive image links
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-bronze-600 hover:bg-bronze-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload from Device</span>
                </>
              )}
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {uploadError}
          </div>
        )}

        {/* Existing Images Gallery */}
        {images.length === 0 ? (
          <div className="py-8 text-center border-2 border-dashed border-stone-200 rounded-xl bg-stone-50/50">
            <UploadCloud className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-xs text-stone-600 font-medium">No photos added yet</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Upload photos from device or paste Google Drive / image URLs below</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 group transition-all ${
                  img.isMain || idx === 0
                    ? 'border-charcoal-900 ring-2 ring-bronze-500/30'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <Image
                  src={img.imageUrl}
                  alt={`Photo ${idx + 1}`}
                  fill
                  unoptimized={img.imageUrl.includes('googleusercontent') || img.imageUrl.includes('drive.google')}
                  className="object-cover"
                />
                
                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-charcoal-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  {!(img.isMain || idx === 0) && (
                    <button
                      type="button"
                      onClick={() => setMainImage(idx)}
                      className="px-2 py-1 bg-charcoal-900 hover:bg-black text-white text-[10px] font-semibold rounded flex items-center gap-1 shadow"
                      title="Set as Main Cover Photo"
                    >
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>Set Main</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded shadow"
                    title="Delete photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {(img.isMain || idx === 0) && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-charcoal-900 text-white text-[10px] font-bold rounded shadow-sm flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    MAIN COVER
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add photo URL / Google Drive link */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <label className="block text-xs font-semibold text-stone-700">
            Or Paste Image URL / Google Drive Share Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addImage();
                }
              }}
              placeholder="Paste Google Drive share link (e.g. drive.google.com/file/d/...) or web image URL..."
              className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
            />
            <button
              type="button"
              onClick={addImage}
              className="px-5 py-2.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded transition-colors whitespace-nowrap"
            >
              Add Link
            </button>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-[11px] text-stone-600 leading-relaxed flex items-start gap-2.5">
            <Info className="w-4 h-4 text-bronze-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-charcoal-900">Google Drive Tips:</span>
              <p className="text-stone-500 mt-0.5">
                Google Drive se share link copy karein aur yahan paste karein. Ensure karein file ka permission <strong>&quot;Anyone with the link can view&quot;</strong> (Public) ho. Link automatically high-speed direct CDN format me convert ho jayega.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Descriptions */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-stone-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-stone-100 pb-3">
          6. Stone Descriptions
        </h3>

        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">
            Short Description (Catalog subtitle)
          </label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="e.g. The quintessential Indian white marble with subtle grey veins."
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">
            Detailed Technical & Aesthetic Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter quarry details, vein characteristics, luster, and architectural suitability..."
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-bronze-500 focus:bg-white"
          />
        </div>
      </div>

      {/* 7. Publishing Options */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-stone-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-stone-100 pb-3">
          7. Publishing Toggles
        </h3>

        <div className="flex flex-wrap items-center gap-6 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded border-stone-300 text-bronze-600 focus:ring-bronze-500 w-4 h-4"
            />
            <span className="font-medium text-stone-800">Published on Website</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded border-stone-300 text-bronze-600 focus:ring-bronze-500 w-4 h-4"
            />
            <span className="font-medium text-stone-800">Mark as Featured Stone</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isNewArrival}
              onChange={(e) => setIsNewArrival(e.target.checked)}
              className="rounded border-stone-300 text-bronze-600 focus:ring-bronze-500 w-4 h-4"
            />
            <span className="font-medium text-stone-800">Mark as New Arrival Lot</span>
          </label>
        </div>
      </div>

    </form>
  );
}
