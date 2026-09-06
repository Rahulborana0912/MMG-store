/**
 * Public Inventory Security Filter & Whitelist
 * 
 * Strict field whitelisting for public-facing queries involving SlabInventory.
 * NEVER expose: notes, reservedBy, reservedAt, batchId, reservationNotes,
 * internal yard bins, or private customer/staff operational metadata.
 */

export const PUBLIC_SLAB_WHERE = {
  isSample: false,
  status: 'AVAILABLE' as const,
} as const;

export const PUBLIC_SLAB_SELECT = {
  id: true,
  slabCode: true,
  lengthInches: true,
  widthInches: true,
  thicknessMm: true,
  areaSqft: true,
  pricePerSqft: true,
  slabPrice: true,
  location: true,
  status: true,
} as const;

export type PublicPhysicalSlab = {
  id: string;
  slabCode: string;
  lengthInches: number;
  widthInches: number;
  thicknessMm: number;
  areaSqft: number;
  pricePerSqft?: number | null;
  slabPrice?: number | null;
  location?: string | null;
  status: 'AVAILABLE';
};
