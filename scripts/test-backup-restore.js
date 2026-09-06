const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

async function testBackupAndRestore() {
  console.log('====================================================');
  console.log('MMG BACKUP & DISASTER RECOVERY VERIFICATION TEST');
  console.log('====================================================\n');

  const backupsDir = path.join(__dirname, '..', 'backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  // 1. Run backup script
  console.log('Step 1: Running scripts/backup.js...');
  const backupResult = spawnSync('node', [path.join(__dirname, 'backup.js')], {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8',
  });

  if (backupResult.status !== 0) {
    console.error('Backup script failed:', backupResult.stderr || backupResult.stdout);
    process.exit(1);
  }
  console.log('[PASS] Backup script executed successfully.');

  // 2. Verify Manifest
  console.log('\nStep 2: Verifying backup manifest.json...');
  const manifestPath = path.join(backupsDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('FAIL: manifest.json not found in backups directory.');
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  console.log(`[PASS] Manifest verified: Latest backup is ${manifest.latestBackup} (${manifest.sizeKb} KB, Engine: ${manifest.engine})`);

  // 3. Verify SHA256 Checksum
  console.log('\nStep 3: Verifying SHA256 Checksum...');
  const backupFilePath = path.join(backupsDir, manifest.latestBackup);
  const checksumFilePath = `${backupFilePath}.sha256`;
  if (!fs.existsSync(checksumFilePath)) {
    console.error('FAIL: Checksum file not found:', checksumFilePath);
    process.exit(1);
  }
  const expectedChecksum = fs.readFileSync(checksumFilePath, 'utf8').trim().split(/\s+/)[0];
  const fileBytes = fs.readFileSync(backupFilePath);
  const actualChecksum = crypto.createHash('sha256').update(fileBytes).digest('hex');

  if (expectedChecksum.toLowerCase() !== actualChecksum.toLowerCase()) {
    console.error(`FAIL: Checksum mismatch! Expected: ${expectedChecksum}, Got: ${actualChecksum}`);
    process.exit(1);
  }
  console.log(`[PASS] SHA256 Checksum verified: ${actualChecksum}`);

  // 4. Test Restoration into a clean isolated verification database
  console.log('\nStep 4: Restoring into clean isolated database for data readability verification...');
  const tempDbPath = path.join(__dirname, '..', 'prisma', 'test-restore.db');
  if (fs.existsSync(tempDbPath)) {
    fs.unlinkSync(tempDbPath);
  }

  // Copy backup to temp DB
  fs.copyFileSync(backupFilePath, tempDbPath);
  console.log(`[PASS] Restored snapshot into isolated target: ${tempDbPath}`);

  // 5. Connect Prisma to the restored database and verify data integrity
  console.log('\nStep 5: Verifying restored database data via Prisma...');
  const testPrisma = new PrismaClient({
    datasources: {
      db: {
        url: `file:${tempDbPath}`,
      },
    },
  });

  try {
    const productsCount = await testPrisma.product.count();
    const usersCount = await testPrisma.user.count();
    const categoriesCount = await testPrisma.category.count();
    const enquiriesCount = await testPrisma.enquiry.count();

    console.log(`  - Products in restored database: ${productsCount}`);
    console.log(`  - Users in restored database: ${usersCount}`);
    console.log(`  - Categories in restored database: ${categoriesCount}`);
    console.log(`  - Enquiries in restored database: ${enquiriesCount}`);

    if (productsCount >= 12 && usersCount >= 4 && categoriesCount >= 3) {
      console.log('\n[PASS] All critical database records verified intact in restored database!');
    } else {
      console.error('FAIL: Expected records missing from restored database!');
      process.exit(1);
    }
  } finally {
    await testPrisma.$disconnect();
    if (fs.existsSync(tempDbPath)) {
      try { fs.unlinkSync(tempDbPath); } catch {}
    }
  }

  console.log('\n====================================================');
  console.log('BACKUP & DISASTER RECOVERY VERIFICATION: 100% PASSED');
  console.log('====================================================\n');
}

testBackupAndRestore().catch((e) => {
  console.error('Disaster recovery test failure:', e);
  process.exit(1);
});
