# Ekaya Explore

> Discover authentic destinations and support local communities in Mozambique.

[![CI](https://github.com/DiogoRibeiro7/ekaya-explore-app/actions/workflows/ci.yml/badge.svg)](https://github.com/DiogoRibeiro7/ekaya-explore-app/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#license)
![Version](https://img.shields.io/badge/version-0.1.0-blue)
![PWA](https://img.shields.io/badge/PWA-offline--first-orange)

Ekaya Explore is an offline-first tourism PWA focused on **Ilha de Moçambique** and nearby community destinations (Cabaceira/Mossuril), with cultural content, curated itineraries, and data-quality safeguards.

---

## Why This Project

- Promote responsible tourism in Mozambique
- Make discovery usable with low/unstable connectivity
- Highlight local culture, heritage, and community impact
- Keep tourism data trustworthy with automated validation

## Gamification Highlights

- 12+ badges with live unlock progress
- Daily and weekly quests with cycle-aware reset logic
- XP system with anti-farming daily caps
- Community-impact quest linked to supporting local Mozambique projects
- Reward activity feed on dashboard

---

## Stack

| Layer    | Technology                                         |
| -------- | -------------------------------------------------- |
| Frontend | React 18 + Vite 8                                  |
| Styling  | Tailwind CSS 3                                     |
| Routing  | React Router 6                                     |
| State    | Zustand + IndexedDB (`idb-keyval`)                 |
| Maps     | Leaflet + react-leaflet + marker clustering        |
| i18n     | i18next + react-i18next (PT default, EN supported) |
| PWA      | vite-plugin-pwa (Workbox)                          |
| Quality  | ESLint 9, Prettier 3, Vitest + RTL                 |

---

## Quick Start

### Prerequisites

- Node.js `>=20`
- Yarn 4 (PnP)

```bash
corepack enable
corepack prepare yarn@4.13.0 --activate
```

### Install and run

```bash
yarn install
yarn dev
```

Local app: `http://localhost:5173`

---

## Environment Variables

Copy `.env.example` to `.env.local`.

| Variable                | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
| `VITE_PLAUSIBLE_DOMAIN` | Enables Plausible analytics when set            |
| `VITE_PLAUSIBLE_HOST`   | Analytics host (`https://plausible.io` default) |

All env vars are optional for local dev.

---

## Scripts

| Command              | Purpose                                                 |
| -------------------- | ------------------------------------------------------- |
| `yarn dev`           | Start dev server                                        |
| `yarn build`         | Production build                                        |
| `yarn preview`       | Preview production build                                |
| `yarn lint`          | Lint source code                                        |
| `yarn format`        | Format files                                            |
| `yarn format:check`  | Check formatting                                        |
| `yarn test`          | Run tests in watch mode                                 |
| `yarn test --run`    | Single test run                                         |
| `yarn validate:data` | Validate tourism dataset (schema, refs, geo, i18n keys) |
| `yarn test:data`     | Run data validator + data-focused test suites           |

---

## Data Pipeline

Tourism content is stored in structured JSON under `src/data/`:

- `places.json`
- `itineraries.json`
- `articles.json`
- `badges.json`
- `timeline.json`
- `notifications.json`

`src/services/data.js` is a thin adapter that re-exports these datasets to the app.

### Validation

`scripts/validate-data.mjs` enforces:

- unique IDs per collection
- valid place categories and itinerary difficulties
- itinerary references (`placeIds`) integrity
- coordinate bounds + approved tourism zones
- content quality bounds (titles/descriptions/tags/images)
- required PT/EN i18n key parity

This validator runs in CI and through `yarn validate:data`.

---

## Project Structure

```text
src/
├── components/         # Reusable UI and layout components
├── data/               # Structured tourism JSON datasets
├── domain/             # Shared domain constants/invariants
├── hooks/              # Browser/runtime hooks
├── i18n/               # Translation files (pt/en)
├── pages/              # Route screens
├── services/           # Adapters and business logic
└── store/              # Zustand store

scripts/                # Validation and utility scripts
tests/                  # Unit/component/data tests
.github/workflows/      # CI pipeline
```

---

## Quality Workflow (Recommended Before PR)

```bash
yarn lint
yarn format:check
yarn validate:data
yarn test --run
yarn build
```

---

## Deployment

- **Vercel**: `vercel.json` already includes SPA rewrites and cache headers
- **Netlify**: `public/_redirects` handles SPA fallback
- **Any static host**: serve `dist/` with SPA rewrite to `/index.html`

---

## Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Data Quality Guide](./docs/DATA_QUALITY.md)
- [Contributing](./CONTRIBUTING.md)
- [Roadmap](./ROADMAP.md)

---

## License

MIT
