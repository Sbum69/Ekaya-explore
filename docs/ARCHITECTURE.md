# Architecture Overview

Ekaya Explore is a client-side React PWA optimized for offline tourism discovery in Mozambique.

## Runtime layers

- `src/pages`: route screens and page-level orchestration.
- `src/components`: reusable UI and layout pieces.
- `src/services`: domain services and static content dataset.
- `src/data`: structured JSON content (places, itineraries, articles, badges, timeline, notifications).
- `src/store`: Zustand state with persisted user/session data.
- `src/hooks`: browser integration (offline status, install prompt, storage estimate).
- `src/domain`: shared domain constants and invariants.

## Core flows

## 1. Discovery and map browsing

- `Map.jsx` reads `PLACES` from `src/services/data.js`.
- Filters are applied in memory by category and text search.
- Leaflet + marker clustering render pins and map interactions.

## 2. User progression and badges

- Visit actions and itinerary completions are recorded in store state.
- `src/services/badges.js` computes unlock progress from current state and place metadata.

## 3. Offline experience

- Vite PWA plugin + Workbox cache static assets and runtime content.
- Download flow pre-caches tiles/images and reports progress.
- Store persistence uses IndexedDB through `idb-keyval`.

## Data contracts

- Place categories and itinerary difficulties are centralized in `src/domain/tourism.js`.
- `src/services/data.js` is an adapter that re-exports structured JSON from `src/data`.
- Data validation runs through both `scripts/validate-data.mjs` and test suites.

## Quality gates

- Lint: `yarn lint`
- Formatting: `yarn format:check`
- Unit/component tests: `yarn test --run`
- Data quality tests: `yarn test:data`
- Standalone data validation: `yarn validate:data`
- Production build: `yarn build`
