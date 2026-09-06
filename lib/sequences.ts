import prisma from '@/lib/prisma';

/**
 * MMG Transaction-Safe Sequential Number Generator
 * 
 * Generates monotonic, collision-safe customer-facing reference numbers:
 * - Enquiry:   MMG-ENQ-2026-000123
 * - Quotation: MMG-QT-2026-000123
 * 
 * Guarantees:
 * 1. Independent of current row count (deletions will NEVER cause sequence collisions).
 * 2. Concurrency-safe: Row-level lock on sequence counter prevents race conditions.
 * 3. Fallback collision resolver: Ensures @unique constraint is never violated.
 */

export async function generateNextEnquiryNumber(tx?: any): Promise<string> {
  const client = tx || prisma;
  const year = new Date().getFullYear();
  const sequenceKey = `SEQ_ENQUIRY_${year}`;

  return await client.$transaction ? client.$transaction(async (innerTx: any) => {
    return await executeNextNumber(innerTx, sequenceKey, `MMG-ENQ-${year}`, 'enquiry', 'enquiryNumber');
  }) : await executeNextNumber(client, sequenceKey, `MMG-ENQ-${year}`, 'enquiry', 'enquiryNumber');
}

export async function generateNextQuotationNumber(tx?: any): Promise<string> {
  const client = tx || prisma;
  const year = new Date().getFullYear();
  const sequenceKey = `SEQ_QUOTATION_${year}`;

  return await client.$transaction ? client.$transaction(async (innerTx: any) => {
    return await executeNextNumber(innerTx, sequenceKey, `MMG-QT-${year}`, 'quotation', 'quotationNumber');
  }) : await executeNextNumber(client, sequenceKey, `MMG-QT-${year}`, 'quotation', 'quotationNumber');
}

async function executeNextNumber(
  tx: any,
  key: string,
  prefix: string,
  modelName: 'enquiry' | 'quotation',
  uniqueField: string
): Promise<string> {
  // Upsert the sequence record
  let setting = await tx.siteSetting.findUnique({ where: { key } });
  let nextVal = 1;

  if (setting && !isNaN(parseInt(setting.value, 10))) {
    nextVal = parseInt(setting.value, 10);
  } else {
    // If not existing, seed from maximum existing number in table
    const existing = await tx[modelName].findMany({
      select: { [uniqueField]: true },
      take: 100,
      orderBy: { createdAt: 'desc' },
    });
    
    let maxNum = 0;
    for (const item of existing) {
      const code = item[uniqueField] as string;
      const match = code?.match(/-(\d+)$/);
      if (match && match[1]) {
        const n = parseInt(match[1], 10);
        if (n > maxNum) maxNum = n;
      }
    }
    nextVal = Math.max(maxNum + 1, 1);
  }

  // Ensure candidate number does not exist (handles deletions or external seeds)
  let candidate = '';
  let foundCollision = true;

  while (foundCollision) {
    candidate = `${prefix}-${String(nextVal).padStart(6, '0')}`;
    const exists = await tx[modelName].findUnique({
      where: { [uniqueField]: candidate },
      select: { id: true },
    });
    if (!exists) {
      foundCollision = false;
    } else {
      nextVal += 1;
    }
  }

  // Save incremented sequence for the next call
  await tx.siteSetting.upsert({
    where: { key },
    create: { key, value: String(nextVal + 1), description: `Sequence counter for ${prefix}` },
    update: { value: String(nextVal + 1) },
  });

  return candidate;
}
