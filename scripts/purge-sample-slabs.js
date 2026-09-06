const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function purgeSampleSlabs() {
  console.log('====================================================');
  console.log('MMG PHYSICAL SLAB INVENTORY PURGE TOOL');
  console.log('====================================================\n');

  const count = await prisma.slabInventory.count({
    where: { isSample: true },
  });

  if (count === 0) {
    console.log('No synthetic/sample slabs found in database. Live inventory is clean.');
    return;
  }

  console.log(`Found ${count} sample/demonstration slabs.`);
  console.log('Purging sample slabs safely (preserving Products, Users, Quotations, and Enquiries)...');

  const result = await prisma.slabInventory.deleteMany({
    where: { isSample: true },
  });

  console.log(`Successfully purged ${result.count} sample slab records.`);
  console.log('Physical slab table is now prepared for verified MMG yard inventory.');
}

purgeSampleSlabs()
  .catch((e) => {
    console.error('Purge error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
