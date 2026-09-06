/**
 * MMG VERIFIED PHYSICAL SLAB IMPORT TEMPLATE
 * 
 * IMPORTANT: This is a CONTROLLED MANUAL IMPORT UTILITY, not an automatic production seed.
 * Do not run this script until MMG yard management provides actual physical gangsaw
 * measurements, batch numbers, and A-frame bay assignments from the Kelwa stockyard.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Example schema for verified physical lots provided by Kelwa yard supervisors
const VERIFIED_LOTS_TEMPLATE = [
  /*
  {
    productCode: 'MMG-MRB-MKR-001', // Must match an active Product in MMG database
    batchId: 'YARD-LOT-2026-A1',
    slabs: [
      {
        slabCode: 'MMG-SLB-MKR-001-01',
        lengthInches: 114.0,
        widthInches: 72.0,
        thicknessMm: 18.0,
        location: 'Kelwa Yard, Bay 2, A-Frame 3',
        pricePerSqft: 450.0,
      }
    ]
  }
  */
];

async function importVerifiedSlabs(lots = VERIFIED_LOTS_TEMPLATE) {
  console.log('====================================================');
  console.log('MMG CONTROLLED PHYSICAL SLAB IMPORTER');
  console.log('====================================================\n');

  if (!lots || lots.length === 0) {
    console.log('NOTICE: No verified lots provided in template.');
    console.log('To import verified yard stock:');
    console.log('1. Populate VERIFIED_LOTS_TEMPLATE with actual Kelwa yard gangsaw measurements.');
    console.log('2. Ensure productCode matches an existing published Product.');
    console.log('3. Run: node scripts/seed-verified-slabs.js\n');
    return;
  }

  let importedCount = 0;
  for (const lot of lots) {
    const product = await prisma.product.findUnique({
      where: { productCode: lot.productCode },
    });

    if (!product) {
      console.warn(`Skipping lot ${lot.batchId}: Product ${lot.productCode} not found.`);
      continue;
    }

    for (const slab of lot.slabs) {
      const areaSqft = parseFloat(((slab.lengthInches * slab.widthInches) / 144).toFixed(2));
      const rate = slab.pricePerSqft || product.pricePerSqft;
      const slabPrice = Math.round(areaSqft * rate);

      await prisma.slabInventory.create({
        data: {
          slabCode: slab.slabCode,
          productId: product.id,
          batchId: lot.batchId,
          material: product.material,
          colour: product.colour,
          finish: product.finish,
          lengthInches: slab.lengthInches,
          widthInches: slab.widthInches,
          thicknessMm: slab.thicknessMm,
          areaSqft,
          pricePerSqft: rate,
          slabPrice,
          location: slab.location,
          status: 'AVAILABLE',
          isSample: false, // Explicitly marked as VERIFIED
          arrivalDate: new Date(),
          notes: `Verified physical gangsaw lot inspected at Kelwa stockyard.`,
        },
      });
      importedCount++;
      console.log(`[VERIFIED IMPORT] Slab ${slab.slabCode} (${areaSqft} sq.ft.) imported.`);
    }
  }

  console.log(`\nImport complete: ${importedCount} verified slabs loaded into live inventory.`);
}

if (require.main === module) {
  importVerifiedSlabs()
    .catch((e) => {
      console.error('Import error:', e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}

module.exports = { importVerifiedSlabs };
