# Ekaya Explore — Project Roadmap

> A community-first travel and exploration platform for authentic destinations in Mozambique, built with offline-first capabilities and local culture at its core.

---

## Vision

Build a progressive web application that allows travellers to explore UNESCO heritage sites and authentic local destinations in Mozambique — with full offline support, gamification, and community integration.

---

## Phases Overview

| Phase | Name                 | Duration | Status                                          |
| ----- | -------------------- | -------- | ----------------------------------------------- |
| 0     | Foundation & Setup   | 1 week   | Done (TypeScript deferred)                      |
| 1     | Core UI & Navigation | 2 weeks  | Done                                            |
| 2     | Map & Discovery      | 2 weeks  | Done                                            |
| 3     | Content & Culture    | 2 weeks  | Done                                            |
| 4     | Offline & PWA        | 1 week   | Done                                            |
| 5     | Gamification         | 1 week   | Done                                            |
| 6     | Auth & User Profile  | 1 week   | Done (mock auth)                                |
| 7     | Polish & Launch      | 1 week   | Done (deploy hosts configured; E2E/TS deferred) |

---

## Phase 0 — Foundation & Setup

**Goal:** Establish the project structure, tooling, and design system.

### Tasks

- [x] Initialise project (React + Vite or Next.js)
- [x] Configure ESLint and Prettier _(TypeScript migration deferred)_
- [x] Set up folder structure (`/pages`, `/components`, `/hooks`, `/services`, `/assets`)
- [x] Define design tokens (colours, typography, spacing, border radii)
  - Primary action colour: `#e8510a` (orange)
  - Accent: `#7F77DD` (purple), `#D4537E` (pink), `#2563eb` (blue)
  - Background: `#f5f5f3`
- [x] Install and configure routing (React Router or Next.js App Router)
- [x] Set up component library baseline (or Tailwind CSS)
- [x] Configure Git repository and branching strategy (`main`, `develop`, `feature/*`)
- [x] Set up CI pipeline (GitHub Actions) for lint + format + test + build checks

### Deliverables

- Working dev environment
- Design token file
- Empty shell with routing skeleton

---

## Phase 1 — Core UI & Navigation

**Goal:** Build the persistent shell — navbar, layout, and the dashboard screen.

### Tasks

- [x] **Navbar component**
  - Hamburger menu (slide-out drawer)
  - Location title + UNESCO subtitle
  - Language toggle (EN / PT)
  - Offline mode indicator badge
  - Notification bell with badge counter
  - User avatar with dropdown
- [x] **Dashboard screen (`/dashboard`)**
  - Hero banner with background image/illustration
  - "Baixar para usar offline" CTA button
  - Stats row: Locais Salvos, Roteiros Ativos, Badges Ganhos
- [x] **Feature cards grid**
  - 6 cards: Explorar Mapa, Cultura e História, Meus Favoritos, Notícias & Avisos, Roteiros, Experiências
  - Colour-coded top border accent per category
  - "Explorar" link with coloured square indicator
- [x] **Floating Action Button (FAB)**
  - Fixed position, orange, search/explore trigger
- [x] **Responsive layout** — mobile-first, fluid on desktop

### Deliverables

- `/dashboard` route fully rendered and responsive
- Reusable `Navbar`, `StatCard`, `FeatureCard`, `FAB` components

---

## Phase 2 — Map & Discovery

**Goal:** Build the interactive map view for exploring local destinations.

### Tasks

- [x] Integrate map library (Leaflet.js or Mapbox GL JS)
- [x] **Map screen (`/map`)**
  - Full-screen map centred on Ilha de Moçambique
  - Custom pin markers with category icons
  - [x] Cluster markers for dense areas _(leaflet.markercluster)_
  - Bottom sheet / drawer for place preview on pin tap
- [x] **Place detail screen (`/place/:id`)**
  - Hero image
  - Name, category, description
  - Save to favourites button
  - Directions / share actions
- [x] **Search & filter bar**
  - Text search over place names
  - Filter by category (cultural, gastronomy, nature, accommodation)
- [x] **Offline tile caching** (preparation — implemented fully in Phase 4)

### Deliverables

- `/map` route with live pins
- `/place/:id` detail screen
- Search and filter functionality

---

## Phase 3 — Content & Culture

**Goal:** Build the cultural, itineraries, experiences, and news sections.

### Tasks

- [x] **Cultura e História (`/cultura`)**
  - Article list view with hero images
  - Article detail with rich text content
  - Timeline of historical events
- [x] **Roteiros (`/roteiros`)**
  - Itinerary cards (duration, stops count, difficulty)
  - Itinerary detail: ordered list of stops on mini-map
  - Start / follow itinerary action
- [x] **Experiências (`/experiencias`)**
  - Experience cards with local host info
  - Booking / interest CTA
- [x] **Notícias & Avisos (`/noticias`)**
  - News feed with category tags (events, alerts, community)
  - Read / unread state
  - Notification integration with bell icon
- [x] **Meus Favoritos (`/favoritos`)**
  - Saved places list
  - Saved itineraries list
  - Remove from favourites action

### Deliverables

- All 5 secondary routes functional
- Content data layer (JSON mock or CMS integration)

---

## Phase 4 — Offline & PWA

**Goal:** Make the app fully usable without internet — the core differentiator.

### Tasks

- [x] Configure Service Worker (Workbox or manual)
- [x] App manifest (`manifest.json`) — installable PWA
  - App name, icons, theme colour (`#e8510a`), display: `standalone`
- [x] **Cache strategies**
  - Static assets: Cache First
  - API responses: Stale While Revalidate
  - Map tiles: Cache First with size limit
- [x] **Download for offline flow**
  - [x] "Baixar para usar offline" button pre-caches map tiles (z12–16 over the island) and place/itinerary images via the SW runtime caches
  - [x] Progress indicator during download (progressbar + counter, cancel button)
  - [x] Storage usage indicator
- [x] **Offline state detection**
  - Offline badge in navbar goes active automatically
  - Graceful degradation for unavailable content
- [x] **IndexedDB integration** for saved places and user data persistence _(zustand/persist now backed by `idb-keyval`; one-time migration from legacy localStorage key)_

### Deliverables

- Lighthouse PWA score ≥ 90
- App installable on mobile and desktop
- Full offline browsing of downloaded content

---

## Phase 5 — Gamification

**Goal:** Implement the badge and achievement system to drive engagement.

### Tasks

- [x] **Badge system**
  - Define badge catalogue (First Visit, 5 Places Explored, Cultural Expert, etc.)
  - Badge unlock logic tied to user actions
  - [x] Badge detail screen with unlock criteria _(modal with progress bar, criteria text, and lock state)_
- [x] **Badges Ganhos stat** — live count on dashboard
- [x] **User progress tracking**
  - Places visited counter
  - Itineraries completed
  - Streak tracking (days active)
- [x] **Achievements screen (`/conquistas`)**
  - Grid of locked/unlocked badges
  - Progress bars toward next badge

### Deliverables

- Badge catalogue with at least 12 badges
- Unlock triggers wired to real user actions
- `/conquistas` screen

---

## Phase 6 — Auth & User Profile

**Goal:** Add authentication and personalised user profile.

### Tasks

- [x] **Auth screens**
  - Sign up with email (`/auth/register`)
  - Login with email (`/auth/login`)
  - Continue with Google (OAuth) _(mock — needs real provider)_
- [x] **User profile screen (`/perfil`)**
  - Avatar, name, join date
  - Stats: Locais Salvos, Roteiros Ativos, Badges Ganhos
  - Settings: language, notifications, offline storage
- [x] **Auth state management** (Context API or Zustand)
- [x] **Protected routes** — redirect to login if unauthenticated
- [x] **Notification preferences** (in-app only or push notifications) _(in-app toggle; push pending)_

### Deliverables

- Full auth flow (register, login, logout)
- Persistent session across page reloads
- Profile screen with live user data

---

## Phase 7 — Polish & Launch

**Goal:** Performance, accessibility, testing, and public deployment.

### Tasks

- [x] **Performance**
  - [x] Code splitting per route (lazy loading)
  - [x] Image optimisation _(loading="lazy" + decoding="async" on non-hero images; fetchPriority="high" on hero images)_
  - [x] Bundle size audit (target < 200 KB initial JS) _(initial bundle ~83 KB, gzipped 26 KB)_
- [x] **Accessibility (a11y)**
  - [x] Keyboard navigation throughout _(focus-visible outlines, FeatureCard converted to button, skip link)_
  - [x] ARIA labels on icon buttons and FAB _(navbar, FAB, filter buttons with aria-pressed, form label associations)_
  - [x] Colour contrast audit (WCAG AA) _(automated tests in `tests/contrast.test.js` enforce ratios; report in `tests/contrast-audit.test.js`. Fixed: bumped all `text-gray-400` → `text-gray-500` (2.54→4.83); btn-primary now `font-semibold`. Brand orange #e8510a is AA-Large compliant on white/orange surfaces — accepted trade-off documented in audit test)_
- [x] **Testing**
  - [x] Unit tests for utility functions and hooks (Vitest)
  - [x] Component tests (React Testing Library) _(StatCard, FeatureCard, ProtectedRoute)_
  - [ ] E2E smoke tests for critical flows (Playwright) _(deferred)_
- [x] **Internationalisation (i18n)**
  - Portuguese (PT) as default
  - English (EN) toggle — already shown in navbar
  - `i18next` integration
- [x] **Deployment**
  - [x] Deploy config for Vercel (`vercel.json`) and Netlify (`public/_redirects`)
  - [ ] Custom domain configuration _(user action)_
  - [x] Environment variables for API keys _(`.env.example`)_
- [x] **Analytics** — privacy-respecting (Plausible) _(opt-in via `VITE_PLAUSIBLE_DOMAIN`)_
- [x] **Documentation** — README refreshed with stack, scripts, env vars, deployment

### Deliverables

- Public URL live
- Lighthouse scores: Performance ≥ 85, A11y ≥ 90, PWA ≥ 90
- README with setup instructions

---

## Technical Stack (Recommended)

| Layer     | Choice                                      |
| --------- | ------------------------------------------- |
| Framework | React + Vite (or Next.js for SSR)           |
| Language  | TypeScript                                  |
| Styling   | Tailwind CSS                                |
| Routing   | React Router v7                             |
| State     | Zustand                                     |
| Map       | Leaflet.js + react-leaflet                  |
| Offline   | Workbox (Service Worker)                    |
| Storage   | IndexedDB (idb library)                     |
| Auth      | Firebase Auth or Supabase                   |
| Testing   | Vitest + React Testing Library + Playwright |
| Deploy    | Vercel                                      |

---

## Folder Structure

```
ekaya-explore/
├── public/
│   ├── manifest.json
│   ├── icons/
│   └── sw.js
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/        # Navbar, FAB, Drawer
│   │   ├── ui/            # StatCard, FeatureCard, Badge, Button
│   │   └── map/           # MapView, PlacePin, BottomSheet
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Map.tsx
│   │   ├── PlaceDetail.tsx
│   │   ├── Cultura.tsx
│   │   ├── Roteiros.tsx
│   │   ├── Experiencias.tsx
│   │   ├── Noticias.tsx
│   │   ├── Favoritos.tsx
│   │   ├── Conquistas.tsx
│   │   └── auth/
│   │       ├── Login.tsx
│   │       └── Register.tsx
│   ├── hooks/
│   │   ├── useOffline.ts
│   │   ├── useFavourites.ts
│   │   └── useAuth.ts
│   ├── services/
│   │   ├── places.ts
│   │   ├── itineraries.ts
│   │   └── offline.ts
│   ├── store/
│   │   └── index.ts        # Zustand store
│   ├── i18n/
│   │   ├── pt.json
│   │   └── en.json
│   ├── tokens/
│   │   └── design.ts       # Colour, spacing tokens
│   ├── App.tsx
│   └── main.tsx
├── tests/
├── .github/workflows/
├── ROADMAP.md
└── README.md
```

---

## Milestones

| Milestone         | Target         | Criteria                                |
| ----------------- | -------------- | --------------------------------------- |
| M1 — Shell        | End of Week 2  | Dashboard renders, routing works        |
| M2 — Map          | End of Week 4  | Map loads with pins, place detail works |
| M3 — Content      | End of Week 6  | All 6 feature sections navigable        |
| M4 — Offline      | End of Week 7  | PWA installable, offline browsing works |
| M5 — Gamification | End of Week 8  | Badges unlock, conquistas screen live   |
| M6 — Auth         | End of Week 9  | Login/register flow complete            |
| M7 — Launch       | End of Week 10 | Live URL, passing Lighthouse audits     |

---

_Roadmap version 1.0 — Ekaya Explore — April 2026_
