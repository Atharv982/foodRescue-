# FoodRescue — Wedding, Party & Event Food Rescue Organization

> A full-stack web platform connecting wedding families, banquet halls, event caterers, and food outlets with volunteer rescue logistics to prevent massive food waste and deliver warm, nutritious meals directly to shelter homes, orphanages, and needy communities. Built for a Web/Software Development Internship Assessment.

---

## 🌟 Live Demo & Local Access

- **Local Development URL**: [http://localhost:3000](http://localhost:3000)
- **Deployment Platform**: Vercel-ready with zero external database lock-in (supports Supabase PostgreSQL with an automatic durable serverless fallback).

---

## 🎯 The Core Mission: From Celebration Excess to Empty Plates

Every evening, grand celebrations, weddings, and banquets across the city prepare buffer food (often 15%–20% surplus) to ensure buffets never run short. Once the reception concludes, huge pots of delicious, untouched food are often thrown away.

**FoodRescue bridges this gap:**
1. **Event Hosts, Families & Caterers**: Can alert our volunteer network and schedule a rapid, free surplus food pickup within 30 minutes of dinner service ending.
2. **Needy People, Orphanages & Shelter Homes**: Receive warm, restaurant-grade feasts packed in sterile, food-grade thermal containers within the 2-hour safety window.
3. **Environment**: Tons of edible food are diverted from landfills, averting harmful methane and CO₂ emissions.

---

## 📋 Assessment Requirements Checklist

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **7+ Meaningful Landing Page Sections** | 9 comprehensive sections: Hero with live wedding batch deal card, Live Impact Metrics, Interactive Event Waste Calculator, 4-Step Rescue Workflow, Available Food Batches for Relief, Partner Venues & Recipient Shelters, Community Stories, Interactive FAQ Accordion, and Event Food Rescue Donation Form. | ✅ Complete |
| **Responsive Layouts** | Fully responsive across mobile (375px+), tablet (768px), and desktop (1280px+). Includes sticky header with brand identity, smooth anchor scrolling, and accessible mobile menu. | ✅ Complete |
| **Interactive Elements** | 1) Dynamic Event Waste & Hunger Relief Calculator with celebration presets and guest slider; 2) Real-time keyword search; 3) Event category pills; 4) Dietary classification dropdown; 5) Sorting controls; 6) FAQ accordion; 7) Portion unit stepper and relief claim flow. | ✅ Complete |
| **Frontend Form + Backend API** | **Two working forms**: 1) Event Food Donation & Pickup Scheduling Form connected to `POST /api/donations`; 2) Food Relief Batch Claim Form connected to `POST /api/reservations`. Both feature client-side and server-side Zod validation. | ✅ Complete |
| **Durable Storage & Persistence** | Dual-tier storage: Supabase PostgreSQL with atomic RPC function (`reserve_food_box`), and a zero-config durable JSON/memory store (`data/donations.json` & `data/reservations.json`). Test submissions persist reliably. | ✅ Complete |
| **Vercel Deployment Compatibility** | Standalone resilience: Deployed prototype works immediately on Vercel without crashing, even before external Supabase environment variables are configured. | ✅ Complete |
| **README Documentation** | Local setup steps, technology stack choices, environment variable specifications, and Vercel deployment walkthrough documented below. | ✅ Complete |

---

## 🏗️ Landing Page Structure (9 Sections)

1. **Header & Navigation**: Sticky navbar with brand identity, smooth anchor navigation (`#batches`, `#calculator`, `#how`, `#partners`, `#stories`, `#faq`, `#donate-form`), quick CTA, and mobile drawer.
2. **Hero Section (`#hero`)**: High-impact value proposition (*"Don’t let celebration food go to waste. Feed those in need."*), volunteer trust badges, dual CTAs (*"Schedule Event Pickup"* & *"Claim Food for Shelter"*), and floating featured wedding feast card.
3. **Live Relief Metrics Strip (`#metrics`)**: 4 key impact metrics: 18,400+ needy people nourished, 340+ weddings and banquets rescued, 32,500 kg food saved, and 48+ partner shelter homes.
4. **Interactive Event Waste & Hunger Calculator (`#calculator`)**: Dynamic interactive tool allowing users to select celebration types (Weddings, Banquets, Corporate, Religious) and adjust guest counts (50–1,200) to calculate leftover plates, kg of food, and number of hungry children/families fed.
5. **How It Works (`#how`)**: 4-step workflow explaining event host notification, rapid volunteer vehicle dispatch, hygiene inspection, and direct delivery to shelters within 2 hours.
6. **Available Food Batches for Relief (`#batches`)**: Live feed of surplus celebration food batches with instant search, event category filters, dietary tags, sorting, and portion claim buttons.
7. **Partner Venues & Recipient Shelter Homes (`#partners`)**: Dual showcase featuring partner banquet halls (Royal Palms, Renaissance Banquets, Sea Breeze) alongside recipient shelter homes (Sneha Sadan Orphanage, Asha Sadan, Night Homeless Shelters).
8. **Community Voices & Stories (`#stories`)**: Verified testimonials from wedding families, shelter directors, and executive banquet chefs.
9. **Interactive FAQ Accordion (`#faq`)**: Expandable accordion answering questions on food safety, rapid pickup, zero cost, and eligible foods.
10. **Event Food Rescue Donation Form (`#donate-form`)**: Dedicated working form for wedding hosts, banquet managers, and caterers to schedule an immediate pickup connected to `POST /api/donations`.
11. **Global Footer (`#footer`)**: Comprehensive footer with 24/7 hotline details, category directory, prototype assessment notice, and non-profit disclaimer.

---

## 🛠️ Technology Stack & Architecture Decisions

| Technology | Purpose | Rationale |
| :--- | :--- | :--- |
| **Next.js 14 (App Router)** | Framework | Provides React Server and Client Components, optimized image loading with `next/image`, and seamless Next.js Route Handlers. |
| **React 18 & TypeScript 5** | Core UI & Logic | Strict type safety across client modals, form states, and API responses prevents runtime bugs and enhances code clarity. |
| **Tailwind CSS** | Styling System | Custom color palette (`#f7f4ec` warm cream, `#2f5d46` forest moss, `#a8c5a0` sage) tailored for sustainability and modern aesthetic appeal without bloat. |
| **Zod** | Validation | Shared type-safe schemas between frontend forms and backend API endpoints, delivering consistent client-side and server-side validation error messages. |
| **Supabase (PostgreSQL)** | Database | Relational database handling atomic inventory decrement via PostgreSQL stored procedure (`reserve_food_box`). |
| **Durable Fallback Store** | Persistence | File-backed JSON store in `data/` (or `/tmp` on serverless) + in-process cache ensuring the prototype works out-of-the-box on both localhost and Vercel. |
| **Lucide React** | Iconography | Lightweight, accessible SVG icons for intuitive visual cues. |

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

| Variable Name | Required? | Description | Example Value |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Supabase project URL for PostgreSQL connection | `https://xyzcompany.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Secret service-role key for backend server operations | `eyJhbGciOi...` |

> **Note**: If Supabase variables are omitted or invalid, FoodRescue automatically activates its built-in **Durable Store** (`data/donations.json` & `data/reservations.json` / `/tmp/` on serverless), allowing full evaluation of form submissions, inventory decrement, and persistence without external dependencies.

---

## 🚀 Local Setup Instructions

### Prerequisites
- Node.js 18.17+ or 20.x
- npm or yarn

### 1. Clone repository & install dependencies
```bash
git clone <repository-url>
cd FoodRescue-End-to-End
npm install
```

*(On Windows PowerShell, use `npm.cmd install` if script execution is restricted).*

### 2. Configure environment variables (Optional)
```bash
cp .env.example .env.local
```
Add your Supabase URL and service role key if testing against a live PostgreSQL instance.

### 3. (Optional) Run Supabase SQL migrations
If using Supabase, navigate to the Supabase SQL Editor and execute:
1. `supabase/schema.sql` (Creates `food_boxes` and `reservations` tables, plus the `reserve_food_box` RPC).
2. `supabase/seed.sql` (Inserts initial sample food batches).

### 4. Start the local development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Endpoints

### 1. `POST /api/donations`
Schedules an event food pickup from weddings, parties, or banquets.

**Request Body:**
```json
{
  "eventName": "Sharma & Verma Wedding Reception",
  "eventType": "Wedding",
  "venueAddress": "Royal Palms Grand Ballroom, Aarey Road",
  "city": "Goregaon East, Mumbai",
  "contactPerson": "Sunil Sharma",
  "phone": "9820123456",
  "email": "sunil.sharma@example.com",
  "estimatedServings": 85,
  "cookedTime": "19:30",
  "pickupTimeWindow": "22:30 – 23:45",
  "dietaryType": "Pure Vegetarian",
  "foodDescription": "4 large pots of Shahi Paneer, Dal Makhani, Jeera Rice, and 90 fresh tandoori rotis",
  "packagingStatus": "Needs Rescue Team Containers"
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "donationId": "FR-EVENT-HHAIO",
  "message": "Pickup request received! Our nearby volunteer rescue van has been notified for dispatch."
}
```

### 2. `GET /api/donations`
Returns all persisted event pickup requests.

### 3. `POST /api/reservations`
Claims an available surplus food batch for a shelter home or community relief drive.

**Request Body:**
```json
{
  "foodBoxId": "8f7a7d52-0b01-4a5a-8e34-000000000001",
  "customerName": "Sneha Sadan Orphanage Home",
  "representativeName": "Sister Teresa",
  "email": "coordinator@snehasadan.org",
  "phone": "9876543210",
  "quantity": 2,
  "destinationType": "Children Shelter / Orphanage",
  "notes": "Please enter via Gate 2 for hot food delivery"
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "reservationId": "FR-RELIEF-1LFP4D",
  "foodBoxId": "8f7a7d52-0b01-4a5a-8e34-000000000001",
  "source": "durable-store",
  "message": "Food relief batch reserved successfully! Distribution details have been confirmed."
}
```

### 4. `GET /api/reservations`
Returns all persisted relief claims and allocation records.

---

## ☁️ Vercel Deployment Instructions

1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New..."** > **"Project"**.
3. Import your GitHub repository.
4. **Environment Variables**:
   - If connecting to Supabase: Add `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
   - If deploying standalone: You can deploy immediately with zero environment variables; the built-in durable store handles all event pickups and shelter claims seamlessly!
5. Click **"Deploy"**.
6. Once deployed, open the live URL, test the event waste calculator, submit an event donation, and claim a relief batch.

---

## 📄 Non-Profit & Assessment Disclaimer

FoodRescue is a prototype non-profit organization model assembled for assessment purposes. All collected food is distributed free of charge to verified shelters and hungry communities.
