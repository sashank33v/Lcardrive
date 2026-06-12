# LCarDrive 🚗

> Australia's driving instructor aggregator — Find, compare, and connect with verified driving instructors across Melbourne and greater Australia.

**Live:** https://lcardrive.sashank.info

**Repo:** https://github.com/sashank33vs/lcardrive

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [File & Folder Structure](#4-file--folder-structure)
5. [Database Schema](#5-database-schema)
6. [User Flows & Workflows](#6-user-flows--workflows)
7. [All URL Paths & Routes](#7-all-url-paths--routes)
8. [API Endpoints](#8-api-endpoints)
9. [Authentication Flow](#9-authentication-flow)
10. [Environment Variables](#10-environment-variables)
11. [Local Development Setup](#11-local-development-setup)
12. [Deployment](#12-deployment)
13. [Current Status & Known Issues](#13-current-status--known-issues)

---

## 1. Project Overview

LCarDrive is a directory and aggregator platform for driving instructors in Australia, initially focused on Melbourne. It solves two problems:

- **For learner drivers:** Hard to compare instructors, prices, availability, and language support in one place.
- **For instructors:** No easy way to get a professional online presence and receive verified reviews.

### Features

| Feature | Status |
|---|---|
| Public instructor directory with suburb search | ✅ Built |
| Individual instructor profile pages | ✅ Built |
| Email-based sign-up / sign-in (Clerk) | ✅ Built |
| Google OAuth login | ✅ Built |
| Instructor portal (profile management) | ✅ Built |
| Review submission system | ✅ Built |
| AI-powered instructor matching | ✅ Built |
| AI bio writer for instructors | ✅ Built |
| Admin panel (claims, reviews, flags) | ✅ Built |
| CSV import tool for bulk listings | ✅ Built |
| SEO (metadata, JSON-LD, sitemap) | ✅ Built |
| Vercel production deployment | ✅ Live |

---

## 2. Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2.6 | Full-stack React framework (App Router) |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| shadcn/ui | Latest | Component library (Button, Card, Dialog, etc.) |
| Leaflet + React-Leaflet | Latest | Interactive suburb maps |
| Lucide React | Latest | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Next.js API Routes (`app/api/`) | All backend endpoints (serverless functions on Vercel) |
| Zod | Request validation and schema enforcement |
| csv-parse | CSV import processing |
| Sharp | Image optimization |

### Database
| Technology | Purpose |
|---|---|
| Supabase (PostgreSQL) | Primary database |
| Supabase RLS (Row Level Security) | Data access control per user role |
| PostGIS / earthdistance | Radius-based geographic search |
| Supabase Storage | Instructor profile photo uploads |

### Authentication
| Technology | Purpose |
|---|---|
| Clerk | Full auth provider (email + Google OAuth) |
| Clerk Middleware (`proxy.ts`) | Route protection for `/portal` and `/admin` |

### AI
| Technology | Purpose |
|---|---|
| Anthropic Claude API (`claude-sonnet-4-20250514`) | AI instructor matching + bio writing |

### Email
| Technology | Purpose |
|---|---|
| Resend | Transactional emails (claim notifications, approvals) |

### Deployment
| Technology | Purpose |
|---|---|
| Vercel | Hosting (Production + Preview environments) |
| GitHub (`main` branch) | Source control, auto-deploy trigger |
| Clerk Production Instance | Auth for live site |
| Clerk Development Instance | Auth for local dev |

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      USER BROWSER                        │
│                                                          │
│  Public Pages    Instructor Portal    Admin Panel        │
│  (no auth)       (Clerk protected)    (admin role only)  │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    VERCEL (Edge Network)                  │
│                                                          │
│  Next.js App Router                                      │
│  ├── Server Components (SSR/SSG for SEO)                 │
│  ├── Client Components (interactive UI)                  │
│  ├── proxy.ts (Clerk auth middleware)                    │
│  └── app/api/* (Serverless API Routes)                   │
└────────┬──────────────────┬──────────────────┬──────────┘
         │                  │                  │
         ▼                  ▼                  ▼
┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│   SUPABASE     │ │     CLERK      │ │   ANTHROPIC    │
│  (PostgreSQL)  │ │  (Auth + JWT)  │ │  (Claude API)  │
│                │ │                │ │                │
│  6 tables      │ │  Dev instance  │ │  Matching AI   │
│  RLS policies  │ │  Prod instance │ │  Bio writer    │
│  Storage       │ │  Google OAuth  │ │                │
└────────────────┘ └────────────────┘ └────────────────┘
         │
         ▼
┌────────────────┐
│    RESEND      │
│  (Emails)      │
│                │
│  Claim emails  │
│  Notifications │
└────────────────┘
```

### Data Flow — Search Request

```
User types suburb → /api/instructors/search?suburb=Footscray&radius=5
    → Zod validates query params
    → Supabase earthdistance query (lat/lng radius search)
    → Returns paginated instructor list (JSON)
    → React renders SearchResults component
    → Leaflet map updates with pins
```

### Authentication Flow

```
User visits /portal/* or /admin/*
    → proxy.ts (Clerk middleware) intercepts
    → Checks for valid Clerk session JWT
    → If no session → redirect to /sign-in
    → If valid session → allow through
    → Server component reads auth() to get userId
    → Queries Supabase with userId for user-specific data
```

---

## 4. File & Folder Structure

```
lcardrive/
│
├── app/                              # Next.js App Router root
│   │
│   ├── (public)/                     # Public routes (no auth required)
│   │   ├── search/
│   │   │   └── page.tsx              # /search — suburb search results
│   │   ├── find-my-instructor/
│   │   │   └── page.tsx              # /find-my-instructor — AI match flow
│   │   ├── instructors/
│   │   │   └── [suburb]/
│   │   │       └── [slug]/
│   │   │           └── page.tsx      # /instructors/:suburb/:slug — profile page
│   │   ├── instructors-in/
│   │   │   └── [suburb]/
│   │   │       └── page.tsx          # /instructors-in/:suburb — SEO suburb page
│   │   └── claim/
│   │       └── [id]/
│   │           └── page.tsx          # /claim/:id — instructor claim form
│   │
│   ├── portal/                       # Instructor-facing dashboard (Clerk protected)
│   │   ├── layout.tsx                # Portal shell layout with sidebar nav
│   │   ├── page.tsx                  # /portal — dashboard home
│   │   ├── profile/
│   │   │   └── page.tsx              # /portal/profile — edit profile
│   │   ├── pricing/
│   │   │   └── page.tsx              # /portal/pricing — manage lesson prices
│   │   ├── availability/
│   │   │   └── page.tsx              # /portal/availability — set availability
│   │   └── service-areas/
│   │       └── page.tsx              # /portal/service-areas — manage suburbs
│   │
│   ├── admin/                        # Admin panel (admin role only)
│   │   ├── layout.tsx                # Admin shell layout with sidebar
│   │   ├── page.tsx                  # /admin — stats dashboard
│   │   ├── claims/
│   │   │   └── page.tsx              # /admin/claims — review claim requests
│   │   ├── reviews/
│   │   │   └── page.tsx              # /admin/reviews — moderate reviews
│   │   ├── flags/
│   │   │   └── page.tsx              # /admin/flags — review flagged listings
│   │   ├── import/
│   │   │   └── page.tsx              # /admin/import — CSV bulk import
│   │   └── listings/
│   │       └── page.tsx              # /admin/listings — manage all listings
│   │
│   ├── api/                          # Backend API routes (serverless)
│   │   ├── instructors/
│   │   │   ├── search/
│   │   │   │   └── route.ts          # GET /api/instructors/search
│   │   │   └── [id]/
│   │   │       └── route.ts          # GET/PATCH/DELETE /api/instructors/:id
│   │   ├── reviews/
│   │   │   └── route.ts              # GET/POST /api/reviews
│   │   ├── flags/
│   │   │   └── route.ts              # POST /api/flags
│   │   ├── claims/
│   │   │   └── route.ts              # POST /api/claims
│   │   ├── ai/
│   │   │   ├── match/
│   │   │   │   └── route.ts          # POST /api/ai/match (streaming)
│   │   │   └── bio/
│   │   │       └── route.ts          # POST /api/ai/bio (rate limited)
│   │   ├── portal/
│   │   │   └── route.ts              # GET/PATCH /api/portal
│   │   └── admin/
│   │       ├── claims/[id]/
│   │       │   └── route.ts          # PATCH /api/admin/claims/:id
│   │       ├── reviews/[id]/
│   │       │   └── route.ts          # PATCH /api/admin/reviews/:id
│   │       ├── import/
│   │       │   └── route.ts          # POST /api/admin/import
│   │       └── listings/
│   │           └── route.ts          # GET/PATCH /api/admin/listings
│   │
│   ├── layout.tsx                    # Root layout (ClerkProvider, fonts, metadata)
│   ├── page.tsx                      # / — Homepage
│   ├── globals.css                   # Global styles + Tailwind imports
│   ├── sitemap.ts                    # Auto-generated sitemap.xml
│   └── robots.ts                     # robots.txt rules
│
├── components/                       # Reusable React components
│   ├── ui/                           # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── progress.tsx
│   │   └── tabs.tsx
│   │
│   ├── search/                       # Search feature components
│   │   ├── search-bar.tsx            # Suburb autocomplete input
│   │   ├── search-filters.tsx        # Filters (transmission, language, price)
│   │   ├── search-results.tsx        # Results grid
│   │   └── instructor-card.tsx       # Individual result card
│   │
│   ├── instructor/                   # Instructor profile components
│   │   ├── profile-header.tsx        # Name, photo, rating, badges
│   │   ├── profile-about.tsx         # Bio, languages, specializations
│   │   ├── profile-pricing.tsx       # Lesson price table
│   │   ├── profile-reviews.tsx       # Reviews list + submission form
│   │   └── profile-map.tsx           # Service area map (Leaflet)
│   │
│   ├── ai/                           # AI feature components
│   │   ├── match-flow.tsx            # 5-question stepper for AI matching
│   │   ├── match-result.tsx          # AI match result card with reasoning
│   │   └── bio-writer-modal.tsx      # AI bio generator modal (portal)
│   │
│   ├── portal/                       # Instructor portal components
│   │   ├── portal-nav.tsx            # Sidebar navigation
│   │   ├── profile-form.tsx          # Edit profile form
│   │   ├── pricing-form.tsx          # Edit pricing form
│   │   ├── availability-picker.tsx   # Day/time availability selector
│   │   └── service-area-map.tsx      # Edit service suburb map
│   │
│   ├── admin/                        # Admin panel components
│   │   ├── admin-nav.tsx             # Admin sidebar
│   │   ├── claims-table.tsx          # Claims queue table
│   │   ├── reviews-table.tsx         # Reviews moderation table
│   │   ├── flags-table.tsx           # Flagged listings table
│   │   └── import-uploader.tsx       # CSV drag-and-drop uploader
│   │
│   └── layout/                       # Layout components
│       ├── navbar.tsx                # Public site top navigation
│       ├── footer.tsx                # Site footer
│       └── breadcrumb.tsx            # Page breadcrumb trail
│
├── lib/                              # Shared utilities and clients
│   ├── clients/
│   │   ├── supabase.ts               # Supabase server + browser client factories
│   │   ├── anthropic.ts              # Anthropic client setup
│   │   └── resend.ts                 # Resend email client
│   │
│   ├── services/
│   │   ├── instructors.ts            # Business logic for instructor operations
│   │   ├── geocode.ts                # Suburb → lat/lng (Nominatim)
│   │   └── ai.ts                     # AI prompt builders + response parsers
│   │
│   ├── repos/                        # Database query functions
│   │   ├── instructors.repo.ts       # All instructor DB queries
│   │   ├── reviews.repo.ts           # All review DB queries
│   │   ├── flags.repo.ts             # All flag DB queries
│   │   └── logs.repo.ts              # Search log DB queries
│   │
│   ├── schemas/                      # Zod validation schemas
│   │   ├── instructor.schema.ts      # Instructor create/update shapes
│   │   ├── review.schema.ts          # Review submission shape
│   │   └── ai.schema.ts              # AI request/response shapes
│   │
│   └── utils/
│       ├── slug.ts                   # Name → URL slug generator
│       ├── completeness.ts           # Profile completeness % calculator
│       └── format.ts                 # Date, price, phone formatters
│
├── data/                             # Static reference data (JSON)
│   ├── melbourne-suburbs.json        # 35 target Melbourne suburbs with lat/lng
│   ├── vicroads-test-centres.json    # VicRoads test centre locations
│   └── languages.json                # Supported instructor languages list
│
├── scripts/
│   └── seed.ts                       # Initial data seeder (for local dev)
│
├── tests/
│   ├── unit/
│   └── e2e/
│
├── public/
│   ├── logo.svg
│   ├── og-image.png
│   └── favicon.ico
│
├── proxy.ts                          # Clerk auth middleware
├── next.config.mjs                   # Next.js configuration
├── tailwind.config.ts                # Tailwind theme + content paths
├── tsconfig.json                     # TypeScript compiler config
├── postcss.config.mjs                # PostCSS (required by Tailwind)
├── .env.local                        # Local environment variables (NOT committed)
├── .env.example                      # Template showing required variables
├── .gitignore
└── package.json                      # Dependencies + npm scripts
```

---

## 5. Database Schema

All tables live in Supabase (PostgreSQL). Row Level Security (RLS) is enabled on all tables.

### `instructors`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
slug            text UNIQUE NOT NULL          -- URL slug: "sarah-m-footscray"
first_name      text NOT NULL
last_name       text NOT NULL
email           text UNIQUE
phone           text
suburb          text NOT NULL
postcode        text
state           text DEFAULT 'VIC'
lat             float                         -- For map + radius search
lng             float
bio             text                          -- AI-generated or manual
photo_url       text
adi_number      text                          -- VicRoads ADI registration
licence_types   text[]                        -- ['car', 'motorcycle', 'truck']
transmission    text[]                        -- ['manual', 'automatic']
languages       text[]                        -- ['English', 'Hindi', 'Mandarin']
price_per_hour  numeric(8,2)
rating          numeric(3,2) DEFAULT 0        -- Auto-updated by trigger
review_count    integer DEFAULT 0             -- Auto-updated by trigger
completeness    integer DEFAULT 0             -- Profile % (auto-calculated)
is_claimed      boolean DEFAULT false
clerk_user_id   text                          -- Links to Clerk auth user
is_active       boolean DEFAULT true
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

### `reviews`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
instructor_id   uuid REFERENCES instructors(id) ON DELETE CASCADE
reviewer_name   text NOT NULL
reviewer_email  text
rating          integer CHECK (rating BETWEEN 1 AND 5)
body            text NOT NULL
is_approved     boolean DEFAULT false         -- Admin must approve before showing
created_at      timestamptz DEFAULT now()
```

### `claims`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
instructor_id   uuid REFERENCES instructors(id)
clerk_user_id   text NOT NULL
claimant_email  text NOT NULL
claimant_phone  text
status          text DEFAULT 'pending'        -- 'pending' | 'approved' | 'rejected'
admin_notes     text
created_at      timestamptz DEFAULT now()
resolved_at     timestamptz
```

### `listing_flags`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
instructor_id   uuid REFERENCES instructors(id)
reason          text NOT NULL
details         text
reporter_email  text
status          text DEFAULT 'open'           -- 'open' | 'resolved' | 'dismissed'
created_at      timestamptz DEFAULT now()
```

### `search_logs`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
suburb          text NOT NULL
result_count    integer
session_id      text
created_at      timestamptz DEFAULT now()
```

### `ai_usage`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
clerk_user_id   text NOT NULL
feature         text NOT NULL                 -- 'bio' | 'match'
tokens_used     integer
created_at      timestamptz DEFAULT now()
```

### Database Triggers
- **Rating recompute** — when a review is approved, recalculates `instructors.rating` and `review_count`
- **Profile completeness** — on any instructor update, recalculates `completeness` percentage
- **Updated_at** — auto-sets `updated_at` on every row update

---

## 6. User Flows & Workflows

### Learner finds an instructor

```
1. Lands on Homepage (/)
2. Types suburb into search bar
3. Navigates to /search?suburb=Footscray&radius=5
4. Sees paginated instructor cards (name, photo, price, rating, languages)
5. Applies filters (manual/auto, language, max price)
6. Clicks card → /instructors/footscray/sarah-m
7. Reads profile (bio, pricing, availability, service area map, reviews)
8. Clicks "Contact" → phone/email revealed
9. Leaves a review via form at bottom of profile
```

### Learner uses AI matching

```
1. Clicks "Find My Instructor" → /find-my-instructor
2. Answers 5-question stepper:
   - Which suburb are you in?
   - Manual or automatic?
   - Preferred language?
   - Budget per hour?
   - Any other requirements?
3. Submits → POST /api/ai/match (streaming)
4. Claude receives answers + matching instructors from DB
5. Returns recommended instructor + reasoning paragraph
6. "View Profile" button links to full profile
```

### Instructor claims their listing

```
1. Finds profile at /instructors/:suburb/:slug
2. Clicks "Claim this listing"
3. If not signed in → redirected to /sign-in
4. After sign-in → returns to /claim/:id
5. Fills claim form (ADI number, phone, email)
6. Submits → POST /api/claims
7. Admin receives email notification via Resend
8. Admin reviews at /admin/claims
9. Admin approves → PATCH /api/admin/claims/:id
10. Instructor receives approval email
11. Clerk userId linked to listing in DB
12. Instructor can now access /portal
```

### Instructor manages their portal

```
1. Signs in → /portal (dashboard)
2. Sees: profile completeness %, recent reviews, quick stats
3. Edit Profile → /portal/profile
   - Updates bio (or generates with AI bio writer → POST /api/ai/bio)
   - Uploads photo (Supabase Storage)
   - Updates phone, languages, licence types
4. Pricing → /portal/pricing (lesson rates and packages)
5. Availability → /portal/availability (days and time windows)
6. Service Areas → /portal/service-areas (suburb coverage map)
7. All saves via PATCH /api/portal
```

### Admin moderates content

```
1. Signs in → /admin (stats dashboard)
2. /admin/claims — approve or reject pending claims
3. /admin/reviews — approve reviews before they go live
4. /admin/flags — investigate flagged listings
5. /admin/import → uploads CSV
   - System geocodes each row (suburb → lat/lng)
   - Detects duplicates by email/phone
   - Imports valid rows to instructors table
6. /admin/listings — edit, deactivate, or delete any listing
```

---

## 7. All URL Paths & Routes

### Public (no auth required)

| URL | Description |
|---|---|
| `/` | Homepage — hero search, featured instructors |
| `/search` | Search results. Params: `suburb`, `radius`, `transmission`, `language`, `max_price`, `page` |
| `/instructors/:suburb/:slug` | Instructor profile. e.g. `/instructors/footscray/sarah-m` |
| `/instructors-in/:suburb` | SEO suburb page e.g. `/instructors-in/footscray` |
| `/find-my-instructor` | AI matching flow |
| `/claim/:id` | Instructor claim form |
| `/sign-in` | Clerk sign-in |
| `/sign-up` | Clerk sign-up |

### Instructor Portal (Clerk auth required)

| URL | Description |
|---|---|
| `/portal` | Dashboard — completeness, stats, reviews |
| `/portal/profile` | Edit bio, photo, contact, languages |
| `/portal/pricing` | Manage lesson rates |
| `/portal/availability` | Set available days and hours |
| `/portal/service-areas` | Manage suburb coverage |

### Admin Panel (admin role required)

| URL | Description |
|---|---|
| `/admin` | Stats dashboard |
| `/admin/claims` | Approve / reject claim requests |
| `/admin/reviews` | Approve / reject submitted reviews |
| `/admin/flags` | Investigate flagged listings |
| `/admin/import` | Bulk CSV import |
| `/admin/listings` | Manage all listings |

### System

| URL | Description |
|---|---|
| `/sitemap.xml` | Auto-generated sitemap |
| `/robots.txt` | Crawler rules |

---

## 8. API Endpoints

All endpoints are under `/api/`. Authenticated endpoints require a valid Clerk session JWT.

### Instructors

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/instructors/search` | None | Search by suburb and filters |
| `GET` | `/api/instructors/:id` | None | Get single instructor |
| `PATCH` | `/api/instructors/:id` | Portal (owner) | Update profile |
| `DELETE` | `/api/instructors/:id` | Admin | Delete listing |

**Search params:** `suburb`, `radius` (km, default 5), `transmission`, `language`, `min_price`, `max_price`, `page` (default 1), `limit` (default 12)

### Reviews

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/reviews?instructor_id=` | None | Get approved reviews |
| `POST` | `/api/reviews` | None | Submit a review |

### Claims

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/claims` | Clerk | Submit a claim request |

### Flags

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/flags` | None | Flag a listing |

### Portal

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/portal` | Clerk | Get own instructor data |
| `PATCH` | `/api/portal` | Clerk | Update own profile |

### AI

| Method | Endpoint | Auth | Rate Limit | Description |
|---|---|---|---|---|
| `POST` | `/api/ai/match` | None | None | Streaming instructor match |
| `POST` | `/api/ai/bio` | Clerk | 5/day per user | AI bio generator |

### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/listings` | Admin | All listings with filters |
| `PATCH` | `/api/admin/listings` | Admin | Bulk update listings |
| `PATCH` | `/api/admin/claims/:id` | Admin | Approve or reject claim |
| `PATCH` | `/api/admin/reviews/:id` | Admin | Approve or reject review |
| `POST` | `/api/admin/import` | Admin | Process CSV upload |

---

## 9. Authentication Flow

LCarDrive uses **Clerk** for all authentication.

### Instances

| Instance | Keys | Used For |
|---|---|---|
| Development | `pk_test_...` / `sk_test_...` | Local dev (`localhost:3000`) |
| Production | `pk_live_...` / `sk_live_...` | Live site (`lcardrive-gules.vercel.app`) |

### Route Protection (`proxy.ts`)

```typescript
export default clerkMiddleware((auth, req) => {
  if (req.nextUrl.pathname.startsWith('/portal')) {
    auth().protect()
  }
  if (req.nextUrl.pathname.startsWith('/admin')) {
    auth().protect()
    // admin role checked via Clerk publicMetadata
  }
})
```

### User Roles

| Role | How Set | Access |
|---|---|---|
| Unauthenticated | Default | Public pages only |
| Instructor | Claim approved → Clerk userId linked to instructor row | `/portal/*` |
| Admin | Clerk Dashboard → User → `publicMetadata: { role: "admin" }` | `/admin/*` |

### Redirect URLs (`.env.local`)

```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/portal
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/portal
```

---

## 10. Environment Variables

Create `.env.local` in the project root. **Never commit this file.**

```bash
# ── SUPABASE ──────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...        # Server-only

# ── CLERK ─────────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/portal
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/portal

# ── ANTHROPIC ─────────────────────────────────────────────
ANTHROPIC_API_KEY=sk-ant-...                 # Server-only

# ── RESEND ────────────────────────────────────────────────
RESEND_API_KEY=re_...                        # Server-only

# ── APP ───────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ── GOOGLE MAPS ───────────────────────────────────────────
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...      # Browser-safe (restricted by domain)
```

Production values for all of the above are set in:  
`Vercel → lcardrive → Settings → Environment Variables → Production`

---

## 11. Local Development Setup

**Prerequisites:** Node.js 20+, npm 10+, Git

```bash
# Clone
git clone https://github.com/sashank33vs/lcardrive.git
cd lcardrive

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Fill in .env.local with your keys

# Start dev server
npm run dev
# → http://localhost:3000
```

### npm Scripts

```bash
npm run dev      # Dev server at localhost:3000
npm run build    # Production build
npm run start    # Run production build locally
npm run lint     # ESLint check
```

### Database (first time)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor → run the full schema SQL
3. Verify 6 tables exist in Table Editor
4. Optionally run `scripts/seed.ts` for test data

---

## 12. Deployment

Hosted on **Vercel**, auto-deploys on every push to `main`.

**Production URL:** `https://lcardrive-gules.vercel.app`

| Environment | Branch | URL |
|---|---|---|
| Production | `main` | `lcardrive-gules.vercel.app` |
| Preview | Any non-main branch | `lcardrive-<hash>-sashank33vs-projects.vercel.app` |
| Development | Local | `localhost:3000` |

```bash
# Deploy — just push to main
git add .
git commit -m "feat: your change"
git push origin main
# Vercel builds and deploys in ~1-2 minutes
```

Manual redeploy: Vercel Dashboard → Deployments → Latest → `...` → Redeploy

---

## 13. Current Status & Known Issues

### Working
- Full instructor directory and search
- Email sign-up and sign-in (Clerk)
- Instructor portal (profile, pricing, availability, service areas)
- AI instructor matching (Anthropic Claude, streaming)
- AI bio writer (rate limited to 5/day per user)
- Admin panel (claims, reviews, flags, CSV import)
- Vercel production deployment — Ready
- TypeScript build — 0 errors

### Known Issues

| Issue | Impact | Fix |
|---|---|---|
| Clerk production instance domain saved as `vercel.ap` (missing `p`) | Auth broken on live site | Get custom domain (e.g. `lcardrive.com.au`), re-create production instance |
| DNS records 0/5 verified in Clerk production | Production auth not fully active | Same fix as above |
| Google OAuth shows "Setup required" in production | Google sign-in disabled on live site | Fix domain first, then update Google Cloud redirect URI to `https://clerk.lcardrive.com.au/v1/oauth_callback` |
| `proxy.ts` deprecation warning (Next.js 16) | Warning only — not broken | Already renamed from `middleware.ts` |

> **Temporary workaround:** The live Vercel app currently uses development Clerk keys. This works but has a 100 monthly active user limit on the free plan. Getting a custom domain resolves all auth issues permanently.

---

## License

Private — All rights reserved © 2026 LCarDrive
