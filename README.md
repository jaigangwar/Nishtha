# Nishtha

Nishtha is an evidence-first opportunity research experience. The local app combines an art-directed landing page, a lightweight real-time Three.js evidence desk, a contextual guide called Nishi, and a local investigation/report flow.

## Requirements

- Node.js `22.14.0` (see `.nvmrc`)
- npm 10+

## Setup

```bash
npm ci
```

## Run

```bash
npm run dev
```

Open `http://localhost:5173`.

## Test and build

```bash
npm test
npm run build
```

`npm test` is the single offline-friendly test command and covers the contextual guide routing helpers. The Vite build verifies the complete browser bundle and Three.js scene imports.

## Docker

```bash
docker build -t nishtha .
docker run --rm -p 4173:4173 nishtha
```

The application is a local demonstration. Investigation content is fictional and stored only in the browser when a case is saved; no external verification or API key is required. When WebGL is unavailable, the hero scene changes to a layered static evidence-desk study. Reduced-motion preferences pause nonessential scene and guide animation.
