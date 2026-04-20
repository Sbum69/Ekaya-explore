# Data Quality Guide

This project ships a curated static dataset in `src/data/*.json` (exposed through `src/services/data.js`). Because the app is tourism-facing, data quality issues directly impact trust and usability.

## Required invariants

- Unique IDs across each collection (`PLACES`, `ITINERARIES`, `ARTICLES`, etc.).
- Valid coordinates and in-scope geography.
- Valid place category and itinerary difficulty values.
- Itinerary `stops` must match `placeIds.length`.
- Every `placeId` in an itinerary must exist in `PLACES`.

## Domain source of truth

- Use `src/domain/tourism.js` for:
  - `PLACE_CATEGORIES`
  - `PLACE_CATEGORY_COLORS`
  - `ITINERARY_DIFFICULTIES`
  - `ITINERARY_DIFFICULTY_COLORS`

Avoid duplicating these literals in new files.

## Automated checks

- `scripts/validate-data.mjs`:
  - standalone validator for schema, references, geo limits, content bounds, and i18n parity.
- `yarn validate:data`:
  - runs the standalone validator and exits non-zero on first failure.

- `tests/coordinates.test.js`:
  - checks that places remain inside approved tourism zones.
  - validates numeric coordinate bounds.
- `tests/data-integrity.test.js`:
  - checks IDs, category/difficulty validity, and itinerary reference integrity.
- `tests/content-lint.test.js`:
  - checks minimum/maximum text lengths and required content fields.
- `tests/i18n-keys.test.js`:
  - checks required translation key parity between PT and EN.

Run both via:

```bash
yarn validate:data
yarn test:data
```

## When adding new places

1. Confirm real coordinates (avoid approximate ocean points).
2. Verify reverse-geocode area context (Ilha de Moçambique / Mossuril region, as applicable).
3. Update associated itineraries and tests if new zones or constraints are needed.
