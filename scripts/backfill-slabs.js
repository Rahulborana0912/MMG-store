const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function backfill() {
  console.log('Starting physical slab inventory backfill...');
  const products = await prisma.product.findMany();

  for (const product of products) {
    if (product.format === 'SLAB') {
      const existingSlabs = await prisma.slabInventory.count({
        where: { productId: product.id },
      });

      if (existingSlabs === 0) {
        console.log(`Backfilling slabs for product: ${product.name} (${product.productCode})`);
        
        // Generate 2-3 realistic physical slabs for each slab stone
        const slabCount = Math.min(Math.max(product.quantity, 2), 4);
        for (let i = 1; i <= slabCount; i++) {
          const slabSuffix = String(i).padStart(3, '0');
          const codeParts = product.productCode.split('-');
          const typePart = codeParts[1] || 'STN';
          const slabCode = `MMG-SLB-${typePart}-${codeParts[3] || '001'}-${slabSuffix}`;

          // Vary length and width slightly to reflect real physical gangsaw slabs
          const lengthVariance = (i % 2 === 0 ? 2 : -2) * (i - 1);
          const widthVariance = (i % 3 === 0 ? 1 : -1) * (i - 1);
          const length = product.lengthInches + lengthVariance;
          const width = product.widthInches + widthVariance;
          const areaSqft = parseFloat(((length * width) / 144).toFixed(2));
          const slabPrice = Math.round(areaSqft * product.pricePerSqft);

          // Give realistic yard location and batch
          const location = `Kelwa Yard, Bay ${(i % 4) + 1}, A-Frame Lot ${(i % 3) + 1}`;
          const batchId = `LOT-2026-${(i % 5) + 10}`;

          // Status: mostly AVAILABLE, 1 RESERVED or SOLD to demonstrate real inventory
          let status = 'AVAILABLE';
          let reservedAt = null;
          let reservedBy = null;
          let reservationNotes = null;

          if (i === slabCount && slabCount > 2) {
            status = 'RESERVED';
            reservedAt = new Date();
            reservedBy = 'Rahul Sharma (Customer)';
            reservationNotes = 'Held for 48 hours for living room dry-lay inspection';
          }

          await prisma.slabInventory.create({
            data: {
              slabCode,
              productId: product.id,
              batchId,
              material: product.material,
              colour: product.colour,
              finish: product.finish,
              lengthInches: length,
              widthInches: width,
              thicknessMm: product.thicknessMm,
              areaSqft,
              pricePerSqft: product.pricePerSqft,
              slabPrice,
              location,
              status,
              isSample: true,
              notes: `Inspected first-choice gangsaw slab. Uniform ${product.thicknessMm}mm calibration. (SAMPLE DEMO RECORD)`,
              arrivalDate: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000),
              reservedAt,
              reservedBy,
              reservationNotes,
            },
          });
        }
      }
    }
  }

  const totalSlabs = await prisma.slabInventory.count();
  console.log(`Backfill complete! Total physical slabs in inventory: ${totalSlabs}`);
}

backfill()
  .catch((e) => {
    console.error('Backfill error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
