# Mahadev Marble and Granite (MMG) 🏛️

> **Premium Architectural Stone Portal, Stockyard Inventory & Quotation Management System**  
> Located in **Raghunathpura, Kelwa (Rajsamand, Rajasthan, India)**.

---

## 📌 Overview

**Mahadev Marble and Granite (MMG)** is a modern, high-performance web platform and enterprise management system designed specifically for the natural stone, marble, and granite industry.

It bridges the gap between high-end architectural clients and physical stockyard operations—offering real-time slab tracking, instant cost estimation, automated quotation generation with official letterhead printouts, multi-stage enquiry tracking, and a customer account portal.

---

## 🌟 Key Features

### 🏢 Customer Experience & Public Portal
- **Interactive Stone Catalogue**: Filter and browse Premium Marble, Granite, and Natural Stone tiles with detailed specifications (thickness, finish, origin, applications).
- **Live Stockyard Slabs**: Browse real slabs currently stored in bays at the Kelwa yard with high-resolution imagery, block IDs, and square-footage quantities.
- **Multilingual Support**: Seamless English and Hindi toggle across all public pages, forms, and product specifications.
- **Stone Cost Estimator**: Calculate project requirements including square footage, wastage percentage (5–15%), edge-polishing, wooden crating, and estimated freight.
- **Direct WhatsApp & Phone Connect**: One-click WhatsApp enquiry with pre-filled stone specifications and Google Maps navigation to the Kelwa showroom.
- **Smart Post-Login Flow**: Customers retain their browsing flow upon login/signup and access quotation tracking, project requirements, and saved enquiries on demand.

### 🛡️ Admin & Showroom Staff Console (`/admin`)
- **Executive Dashboard**: Real-time business analytics for daily enquiries, active quotations, available yard slabs, and aggregate inventory valuation.
- **Yard Slab Inventory Manager**: Add, edit, verify, and track individual marble/granite slabs with lot numbers, bay locations, and dimensions.
- **Enquiry CRM**: Status management pipeline (`NEW` → `CONTACTED` → `QUOTED` → `CLOSED`) with customer contact details and notes.
- **Quotation Generator**: Build formal multi-item quotations with GST breakdown, transport freight, discounts, terms & conditions, and printable PDF letterhead.
- **Showroom Settings**: Update operating hours, yard addresses, contact numbers, and letterhead configurations.

---

## 👥 Role-Based Access Control (RBAC)

| Role | Access Level | Primary Dashboard | Capabilities |
| :--- | :--- | :--- | :--- |
| **Administrator** | Full Console | `/admin` | Complete catalogue control, slab inventory, staff management, quotations, CRM & settings |
| **Showroom Staff** | Operations CRM | `/admin/slabs` & `/admin/enquiries` | Stock bay slab management and enquiry handling |
| **Sales Manager** | Commercial CRM | `/admin/quotations` | Quotation preparation, client follow-ups, and price calculation |
| **Customer** | Client Portal | `/account` | Track submitted enquiries, view formal quotations, and save project estimates |

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Components & Server Actions)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database ORM**: [Prisma ORM](https://www.prisma.io/)
- **Database**: [Supabase](https://supabase.com/) (Managed PostgreSQL Connection Pooler)
- **Authentication**: Supabase Auth + Secure HTTP-only cookies & Session Guards
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd mmg-project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory using `.env.example`:
```bash
cp .env.example .env
```

Fill in your database and Supabase credentials:
```env
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

NEXT_PUBLIC_COMPANY_NAME="Mahadev Marble and Granite Pvt. Ltd."
NEXT_PUBLIC_BRAND_NAME="MMG"
NEXT_PUBLIC_PHONE="+91 98873 90222"
NEXT_PUBLIC_WHATSAPP="+919887390222"
NEXT_PUBLIC_EMAIL="rahulborana1306@gmail.com"
NEXT_PUBLIC_ADDRESS="Mahadev Marble and Granite, Raghunathpura, Kelwa"
NEXT_PUBLIC_MAPS_URL="https://maps.app.goo.gl/Z4vojjCLAfeXNVvTA"

NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### 4. Run Prisma Migrations & Seed
```bash
npx prisma generate
npx prisma db push
node prisma/seed.js
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production Build & Deployment
```bash
npm run build
npm run start
```

---

## 📍 Showroom & Stockyard Location

- **Facility**: Mahadev Marble and Granite
- **Address**: Raghunathpura, Kelwa, Rajsamand District, Rajasthan, India
- **Google Maps**: [View Location on Google Maps](https://maps.app.goo.gl/Z4vojjCLAfeXNVvTA)

---

## 📄 License & Proprietary Rights

All rights reserved © 2026 **Mahadev Marble and Granite Pvt. Ltd.**
