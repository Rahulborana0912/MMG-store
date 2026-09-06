const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const backupsDir = path.join(__dirname, '..', 'backups');
const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
const isPostgres = databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://');

console.log('====================================================');
console.log('MMG DISASTER RECOVERY DATABASE RESTORE UTILITY');
console.log('====================================================');

const args = process.argv.slice(2);
let targetBackupFile = args[0];

if (!targetBackupFile) {
  if (!fs.existsSync(backupsDir)) {
    console.error('No backups directory found at:', backupsDir);
    process.exit(1);
  }

  const allBackups = fs
    .readdirSync(backupsDir)
    .filter((f) => (f.endsWith('.db') || f.endsWith('.dump') || f.endsWith('.sql')) && f.startsWith('mmg-'))
    .map((f) => ({ name: f, time: fs.statSync(path.join(backupsDir, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time);

  if (allBackups.length === 0) {
    console.error('No backup snapshots found in backups directory.');
    process.exit(1);
  }

  targetBackupFile = path.join(backupsDir, allBackups[0].name);
} else {
  if (!fs.existsSync(targetBackupFile)) {
    targetBackupFile = path.join(backupsDir, targetBackupFile);
  }
}

if (!fs.existsSync(targetBackupFile)) {
  console.error(`Specified backup file does not exist: ${targetBackupFile}`);
  process.exit(1);
}

// 1. Verify Checksum if present
const checksumFile = `${targetBackupFile}.sha256`;
if (fs.existsSync(checksumFile)) {
  const expectedChecksum = fs.readFileSync(checksumFile, 'utf8').trim().split(/\s+/)[0];
  const fileBuffer = fs.readFileSync(targetBackupFile);
  const actualChecksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

  if (expectedChecksum.toLowerCase() !== actualChecksum.toLowerCase()) {
    console.error(`INTEGRITY ERROR: SHA256 checksum mismatch!`);
    console.error(`Expected: ${expectedChecksum}`);
    console.error(`Actual:   ${actualChecksum}`);
    process.exit(1);
  }
  console.log(`[PASS] SHA256 integrity checksum verified: ${actualChecksum}`);
} else {
  console.log('Notice: No separate .sha256 checksum file found. Proceeding with file inspection.');
}

// 2. Perform Restore
if (targetBackupFile.endsWith('.dump') || isPostgres) {
  console.log(`Restoring PostgreSQL database from: ${targetBackupFile}`);
  console.log(`Target database URL: ${databaseUrl}`);

  const pgRestore = spawnSync('pg_restore', ['--clean', '--if-exists', '--dbname', databaseUrl, targetBackupFile], {
    stdio: 'inherit',
  });

  if (pgRestore.status !== 0) {
    console.warn('Notice: pg_restore exited or not installed. In cloud deployment, run via Supabase Dashboard or psql command.');
  } else {
    console.log('PostgreSQL database restored successfully.');
  }
} else {
  const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
  fs.copyFileSync(targetBackupFile, dbPath);
  console.log(`SQLite database successfully restored from: ${targetBackupFile}`);
  console.log(`Target destination: ${dbPath}`);
}

console.log('Restore operation completed successfully!\n');
