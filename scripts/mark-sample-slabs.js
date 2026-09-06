const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function markSampleSlabs() {
  console.log('Marking backfilled synthetic slabs as isSample = true...');
  const result = await prisma.slabInventory.updateMany({
    where: { isSample: false },
    data: { isSample: true },
  });
  console.log(`Updated ${result.count} slabs to isSample = true.`);
  console.log('These slabs are now strictly hidden from public customers.');
}

markSampleSlabs()
  .catch((e) => {
    console.error('Error marking sample slabs:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
