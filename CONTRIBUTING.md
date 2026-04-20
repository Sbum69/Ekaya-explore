# Contributing to Ekaya Explore

Thanks for contributing to Ekaya Explore. This project promotes tourism in Mozambique, so content quality and geographic accuracy are first-class requirements.

## Development setup

1. Install dependencies:

```bash
yarn install
```

2. Run locally:

```bash
yarn dev
```

3. Before opening a PR, run quality checks:

```bash
yarn lint
yarn format:check
yarn validate:data
yarn test --run
yarn test:data
yarn build
```

## Content and map data rules

- Keep places within supported tourism zones (Ilha de Moçambique, Cabaceira/Mossuril area).
- Do not add placeholder coordinates.
- Keep itinerary `stops` in sync with `placeIds.length`.
- Reuse domain constants from `src/domain/tourism.js` for categories and difficulty levels.
- Update structured content files in `src/data/*.json` (not component files) when changing tourism dataset entries.

## Pull request checklist

- Scope is focused and documented.
- New behavior has tests or extends existing tests.
- No console errors/warnings introduced in local run.
- README/docs updated when behavior or scripts change.
