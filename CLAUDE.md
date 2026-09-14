# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production (static export to ./out)
npm run lint      # ESLint 9 (flat config in eslint.config.mjs)
npm run typecheck # tsc --noEmit — the build will NOT do this for you
```

No test suite is configured. `ignoreBuildErrors: true` in `next.config.mjs` means `npm run build` never fails on TypeScript errors, which is why `typecheck` is a separate script. **CI runs `lint` and `typecheck` before `build`, and a failure in either blocks the deploy** — so run both locally before pushing. Both pass clean as of 2026-09-13.

If a lint error ever blocks an urgent price change, fix the error rather than bypassing CI; there is no deploy path that skips these steps short of editing the workflow.

ESLint config lives in `eslint.config.mjs` (`eslint-config-next` core-web-vitals + typescript). The rule exception it carries for `components/ui/**` and `hooks/**` has no effect today (that scaffolding was deleted), but is kept for components re-added later via the shadcn CLI.

## Architecture

This is a **Next.js App Router** single-page restaurant website (Pizzería Las Vegas, Guatemala) built with TypeScript, Tailwind CSS v4, and Shadcn/ui components.

### How the app works

The entire site is a single page (`app/page.tsx`) that renders different menu categories based on a React state variable. There is no multi-page routing — navigation tabs just update state to show the selected category.

**Data flow:**
1. All product/menu data lives in `lib/menu-data.ts` as typed arrays (`MenuCategory[]`, `MenuItem[]`, `ContactInfo`).
2. `app/page.tsx` holds `activeCategory` state and renders `<MenuSection>` with the matching data.
3. `components/header.tsx` emits category change events to control which section is shown.

`app/page.tsx` does **not** hand `setActiveCategory` to the header directly. It wraps it in `handleCategoryChange`, which also calls `window.scrollTo(0, 0)` — without that, switching category swaps the section while the scroll position stays put, so the new category opens mid-page (or pinned to the bottom, if it is shorter than the one before). Keep the scroll reset if you touch this; it fixes a bug the client reported.

Two deliberate choices there: the reset lives in the handler rather than a `useEffect`, so it only fires on a real tab click and does not fight the browser's scroll restoration on reload; and the jump is instant rather than `behavior: 'smooth'`, because a shorter category shrinks the page mid-animation and the browser clamps the scroll partway through.

### Key files

- `lib/menu-data.ts` — Single source of truth for all menu items, prices, descriptions, and contact info. **Edit this file to add/modify/remove products.**
- `app/page.tsx` — Home page with category state and layout orchestration.
- `app/layout.tsx` — Root layout: metadata, Google Fonts (Poppins), theme color, and **Google Analytics** (GA4 `G-GBG1JM7H2F`, injected as raw `next/script` tags and gated to `NODE_ENV === 'production'`). Analytics is wired by hand here, not through an npm package — a dependency scan will not reveal it, so do not conclude the site has no analytics from `package.json` alone.
- `components/menu-item-card.tsx` — Renders individual product cards with image, name, description, price.
- `components/menu-section.tsx` — Renders a full category section (grid of `MenuItemCard`).
- `components/header.tsx` — Sticky navigation with category tabs.
- `components/contact-section.tsx` — Contact/location info section.
- `components/footer.tsx` — Footer with "Desarrollado por RENOA" credit linking to renoa.tech. Contains commented-out `linear-gradient` styles pending client approval.

### Styling

- Tailwind CSS v4 (configured via `@tailwindcss/postcss`). Tailwind scans **every** source file, so an unused component still inflates the generated CSS. Worth cleaning up, but keep the scale honest: see "What actually reaches the visitor" below — gzip absorbs most of a CSS saving before it reaches anyone.
- Brand colors are CSS custom properties in `app/globals.css`: `--brand-red`, `--brand-blue`, `--brand-yellow`. `app/globals.css` is the only stylesheet — a stale `styles/globals.css` duplicate was deleted.
- Shadcn/ui: `components/ui/` holds **only `button.tsx`** — the one component the site actually uses. The rest of the generated catalogue was deleted: it never shipped in the JS, but Tailwind scanned it and generated utilities for a sidebar, a drawer, recharts and a command palette, cutting the CSS from 120 KB to 35 KB on disk (~17 KB gzipped). Add any component back on demand with `npx shadcn@latest add <name>`; `components.json` is still configured for it. Generated files are edited via the CLI, not by hand.
- Path alias `@/` maps to the repo root.

### Images

Product images live in `public/images/`, named in descriptive camelCase matching the product. **28 of the 30 are `.webp`**; `pizza2Estaciones.jpg` and `pizzaEspecialidad.jpg` stayed JPEG because WebP made them 4% and 7% *bigger*. Extensions therefore vary — copy the exact filename into `lib/menu-data.ts`.

**Next's image optimization is off** (`unoptimized: true`, forced by `output: 'export'`), so the committed file is what the phone downloads. To add a new photo:

```bash
# sharp ships with Next — no install needed
node -e "require('sharp')('foto.jpg').resize({width:1400,fit:'inside'}).webp({quality:75,effort:6}).toFile('public/images/nombre.webp')"
```

- **Cap the long side at 1400px.** Cards render at ~390px, but clicking one opens a lightbox at `90vh/90vw` (`components/menu-item-card.tsx`), so the file has to hold up viewed large. Verified in production: at 1400px WebP q75 the lightbox stays sharp, fine print included.
- **WebP q75, effort 6.** Roughly equivalent to JPEG q82. Note q82 WebP only beat optimized JPEG by 15% here — the win comes from q75, not from the format alone.
- **Never commit a photo as PNG.** The two that were PNG were the heaviest files in the repo (1.4 MB and 820 KB) and both were fully opaque, so the alpha channel was pure waste. They dropped 95% and 91%.
- **Confirm the result is actually smaller, per file.** Many of these images were already well compressed; re-encoding those *grew* them by up to 19% while still losing fidelity. If a file does not shrink by a clear margin, keep the original — that is why two are still JPEG.
- **Look at the output before committing it.** Byte counts do not tell you whether a photo still looks appetizing. The logo is the case in point: at 224px it saved 86% but the lettering visibly softened, so it sits at 336px (3× its 112px display) and quality 90.

### What actually reaches the visitor

GitHub Pages gzips text assets, so **on-disk size is not download size** — a distinction worth keeping straight before celebrating a byte count:

| | On disk | Over the wire |
|---|---|---|
| JS | 707 KB | **169 KB** |
| CSS | 35 KB | **7 KB** |
| Images | 1519 KB | **1519 KB** |

Images are already compressed and gzip does nothing for them, which makes them ~88% of what a visitor actually downloads. Work on image weight pays off roughly 1:1; work on CSS and JS weight is discounted by whatever gzip was already doing. Measure with `performance.getEntriesByType('resource')` in the browser (`encodedBodySize` vs `decodedBodySize`), not with `ls`.

## Deployment

Production is **GitHub Pages**, deployed automatically by `.github/workflows/deploy.yml` on every push to `main` (`npm ci` → `lint` → `typecheck` → `build` → publish `./out`). There is no manual deploy step: pushing to `main` *is* the release. Lint and typecheck gate the build, so a failure in either means nothing is published and the site keeps serving the previous version.

```bash
git push origin main                   # triggers the deploy
gh run list --limit 3                  # find the run id
gh run watch <run-id> --exit-status    # wait for it to finish
```

A run takes roughly 45 seconds. Confirm it concluded `success` before telling the client the change is live.

### Conventions

Price and menu changes are committed straight to `main` — no feature branch. Commit subjects are in Spanish, following `git log`: `<Producto>: actualiza precio de Q<viejo> a Q<nuevo>`.

### Known issues / pending maintenance

- **Next is pinned by caret, not exact.** `next: ^16.3.5` means `npm ci` in CI installs whatever 16.x the lockfile holds — fine today, but the lockfile is the only thing keeping CI and local identical. `npm audit` reports 0 vulnerabilities as of 2026-09-13; re-check after any dependency change.
- **`engines` is a floor, not a lock.** `package.json` declares `node: >=22` while both CI (`deploy.yml`) and the dev machine run 24. The declaration stays at 22 because the project did build clean there — but nothing tests 22 any more, so treat it as a claim, not a guarantee. npm only warns on a mismatch regardless (no `.npmrc` with `engine-strict=true`).
