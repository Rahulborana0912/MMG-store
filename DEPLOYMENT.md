# MMG Production Deployment & Operations Guide
## Mahadev Marble and Granite Pvt. Ltd. (MMG)

This operational manual documents how to configure, migrate, secure, backup, and deploy the MMG digital showroom platform.

---

## 1. Production Architecture Overview

The MMG platform is architected for production stability, low operational overhead, and high security:

- **Frontend & App Engine**: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS
- **Production Database**: **Supabase PostgreSQL** (Managed cloud database)
  > *Note: SQLite (`file:./dev.db`) is strictly for local offline development and sandbox unit tests. SQLite is NEVER used in production.*
- **Database Migrations**: Version-controlled Prisma migrations executed via `npx prisma migrate deploy`.
  > *Critical: Never use `prisma db push` in production deployments.*
- **Authentication**: **Supabase Auth** (`@supabase/ssr`) with HTTP-only, secure, sameSite session cookies. Application roles (`SUPER_ADMIN`, `MANAGER`, `STAFF`, `SALES_STAFF`, `CUSTOMER`) are strictly resolved and enforced server-side from PostgreSQL `User.role`.
- **Persistent Image Storage**: **Supabase Storage** (`mmg-stones`, `mmg-slabs`, `mmg-projects`, `mmg-requirements`) with Next.js responsive image optimization (`formats: ['image/avif', 'image/webp']`).
- **Disaster Recovery**: Dual-engine backup utility with SHA-256 checksum verification, automated 10-snapshot retention, and point-in-time recovery.
- **Business Model**: Digital Marble & Granite Showroom + Live Stock Catalogue + Requirement Finder + Lead Management + Commercial Quotation System (Strictly NO e-commerce, cart, or checkout).

---

## 2. Production Environment Variables Checklist (`.env.production`)

```env
# ==============================================================================
# 1. SUPABASE POSTGRESQL DATABASE
# ==============================================================================
# Production connection string with connection pooling (PgBouncer) on port 6543
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct URL for Prisma Migrations (Port 5432)
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

# ==============================================================================
# 2. SUPABASE AUTH & STORAGE
# ==============================================================================
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
# Service role key is strictly server-side (Never expose in client code)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."

# ==============================================================================
# 3. CANONICAL DOMAIN & CONTACT DETAILS
# ==============================================================================
NEXT_PUBLIC_APP_URL="https://mahadevmarble.com"
NEXT_PUBLIC_COMPANY_NAME="Mahadev Marble and Granite Pvt. Ltd."
NEXT_PUBLIC_WHATSAPP_NUMBER="919829012345"
NEXT_PUBLIC_SHOWROOM_PHONE="+91 98290 12345"
NEXT_PUBLIC_SHOWROOM_EMAIL="sales@mahadevmarble.com"

# ==============================================================================
# 4. OPTIONAL DISTRIBUTED RATE LIMITING (FOR SERVERLESS MULTI-INSTANCE)
# ==============================================================================
# Single-process/VPS uses fast in-memory rate limiting by default.
# For multi-instance/serverless deployments (e.g. Vercel), configure Upstash Redis:
# UPSTASH_REDIS_REST_URL="https://[YOUR-ID].upstash.io"
# UPSTASH_REDIS_REST_TOKEN="[YOUR-TOKEN]"
# *Note: Free-tier quotas on third-party services are subject to provider limits and pricing changes.
```

---

## 3. Production Deployment Workflow

### Step 1: Initialize Database & Apply Migrations
In your production terminal or CI/CD pipeline (e.g. GitHub Actions, Vercel Build Step):

```bash
# 1. Validate Prisma schema
npx prisma validate

# 2. Generate Prisma Client
npx prisma generate

# 3. Deploy version-controlled migrations against Supabase PostgreSQL
npx prisma migrate deploy
```
*(Do not run `prisma db push` on production databases. `prisma migrate deploy` ensures zero data loss and exact migration history).*

### Step 2: Provision Initial Administrator
To securely create or upgrade an existing account to `SUPER_ADMIN`:
```bash
node scripts/create-admin.js "owner@mahadevmarble.com" "YourSecureStrongPassword2026!" "Rameshwar Sharma" "SUPER_ADMIN"
```

### Step 3: Compile Production Next.js Application
```bash
npm run build
```

### Step 4: Launch Production Service
- **Vercel / Cloudflare**: Automatically handled upon git push to `main`.
- **Dedicated VPS (PM2)**:
  ```bash
  pm2 start npm --name "mmg-production" -- start
  pm2 save
  ```

---

## 4. Disaster Recovery & Backup Strategy

Disaster recovery is divided into three distinct layers:

### A. Database Backup (Supabase PostgreSQL)
1. **Automated Daily Backups**: Enabled by default in Supabase (7-day retention on Pro/Free).
2. **Scheduled CLI Snapshots**:
   Execute the dual backup script:
   ```bash
   node scripts/backup.js
   ```
   - Automatically detects PostgreSQL connection and executes `pg_dump`.
   - Generates a timestamped `.dump` archive in `./backups/`.
   - Generates a SHA-256 integrity checksum file (`.sha256`).
   - Automatically prunes snapshots older than the 10 most recent.
   - Updates `./backups/manifest.json`.
3. **Database Restore Procedure**:
   ```bash
   node scripts/restore.js backups/mmg-postgres-backup-[TIMESTAMP].dump
   ```
   - Validates SHA-256 checksum before execution.
   - Invokes `pg_restore` against `DATABASE_URL`.

### B. Image & Storage Backup (Supabase Storage)
- Stone photos, physical slab images, and customer project attachments are stored in Supabase Storage buckets:
  - `mmg-stones`
  - `mmg-slabs`
  - `mmg-requirements`
  - `mmg-projects`
- **What happens if the database is restored?**
  - Database records (`ProductImage.imageUrl`) reference persistent object URLs in Supabase Storage.
  - If the database is restored to a prior snapshot, image URLs remain intact and valid because Supabase Storage objects are preserved independently.

### C. Application Source Code Backup
- Preserved in private Git repository (GitHub / GitLab).

---

## 5. Physical Slab Inventory: Sample Data vs. Live Yard Stock

- The initial 36 simulated slabs are tagged with `isSample: true`.
- **Public Customers**: Sample slabs are 100% hidden across `/available-stock` and product detail pages.
- **Admin Yard Staff**:
  - A prominent warning banner is displayed on `/admin/slabs`.
  - A 1-click **"Purge Sample Slabs"** button is available in the admin UI and CLI (`npm run db:purge-sample-slabs`).
  - When Sukher yard supervisors complete physical gangsaw measurements, verified lots are imported via `scripts/seed-verified-slabs.js`.

---

## 6. Commercial Quotations

- Terminology is strictly **Commercial Quotation / Commercial Estimate** (Never "Tax Invoice" or "Indian Invoice").
- All mathematics (Subtotal, Clamped Discount, Additional Charges, GST, and Total) are strictly calculated server-side in an atomic database transaction.
- Configurable GST rates (18%, 0%, 5%, 12%, 28%) are supported.

---

## 7. Operational Health Checks

- **Health Check Endpoint**: `GET /api/health` returns HTTP 200 with JSON status and database query latency.
- **Sitemap**: `GET /sitemap.xml`
- **Robots**: `GET /robots.txt`
