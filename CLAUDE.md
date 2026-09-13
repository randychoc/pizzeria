# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production (static export to ./out)
npm run lint     # BROKEN — eslint is not installed; see Known issues
```

No test suite is configured. TypeScript build errors are suppressed via `ignoreBuildErrors: true` in `next.config.mjs`, so `npm run build` is the only local check — and it will not fail on type errors. Verify changes by eye with `npm run dev`.

## Architecture

This is a **Next.js App Router** single-page restaurant website (Pizzería Las Vegas, Guatemala) built with TypeScript, Tailwind CSS v4, and Shadcn/ui components.

### How the app works

The entire site is a single page (`app/page.tsx`) that renders different menu categories based on a React state variable. There is no multi-page routing — navigation tabs just update state to show the selected category.

**Data flow:**
1. All product/menu data lives in `lib/menu-data.ts` as typed arrays (`MenuCategory[]`, `MenuItem[]`, `ContactInfo`).
2. `app/page.tsx` holds `activeCategory` state and renders `<MenuSection>` with the matching data.
3. `components/header.tsx` emits category change events to control which section is shown.

### Key files

- `lib/menu-data.ts` — Single source of truth for all menu items, prices, descriptions, and contact info. **Edit this file to add/modify/remove products.**
- `app/page.tsx` — Home page with category state and layout orchestration.
- `app/layout.tsx` — Root layout: metadata, Google Fonts (Poppins), theme color.
- `components/menu-item-card.tsx` — Renders individual product cards with image, name, description, price.
- `components/menu-section.tsx` — Renders a full category section (grid of `MenuItemCard`).
- `components/header.tsx` — Sticky navigation with category tabs.
- `components/contact-section.tsx` — Contact/location info section.
- `components/footer.tsx` — Footer with "Desarrollado por RENOA" credit linking to renoa.tech. Contains commented-out `linear-gradient` styles pending client approval.

### Styling

- Tailwind CSS v4 (configured via `@tailwindcss/postcss`).
- Brand colors are CSS custom properties in `app/globals.css`: `--brand-red`, `--brand-blue`, `--brand-yellow`. `app/globals.css` is the only stylesheet — a stale `styles/globals.css` duplicate was deleted.
- Shadcn/ui components live in `components/ui/` — these are generated files; prefer editing via the `shadcn` CLI rather than modifying directly.
- Path alias `@/` maps to the repo root.

### Images

Product images are stored in `public/images/`. Names are descriptive camelCase matching the product (e.g. `calzoneJamon.jpg`, `pizzaPersonalHawaiana.jpg`, `lasanaFamiliar.png`) — extensions vary (`.jpg`, `.jpeg`, `.png`), so copy the exact filename into `lib/menu-data.ts`. Next.js Image optimization is disabled (`unoptimized: true`).

## Deployment

Production is **GitHub Pages**, deployed automatically by `.github/workflows/deploy.yml` on every push to `main` (`npm ci` → `npm run build` → publish `./out`). There is no manual deploy step: pushing to `main` *is* the release.

```bash
git push origin main                   # triggers the deploy
gh run list --limit 3                  # find the run id
gh run watch <run-id> --exit-status    # wait for it to finish
```

A run takes roughly 45 seconds. Confirm it concluded `success` before telling the client the change is live.

### Conventions

Price and menu changes are committed straight to `main` — no feature branch. Commit subjects are in Spanish, following `git log`: `<Producto>: actualiza precio de Q<viejo> a Q<nuevo>`.

### Known issues / pending maintenance

- **"El scroll no se reinicia."** Reported by the client 2026-09-12; full context not yet given, and not yet reproduced. Likely relates to switching categories in `app/page.tsx` — `activeCategory` changes the rendered section but nothing resets the window scroll position, so the new category opens mid-page. Confirm the exact symptom before fixing.
- **`npm run lint` does not work.** The script calls `eslint .`, but eslint is not in `package.json` at all, so it fails with `eslint: command not found`. Either install it (`npm i -D eslint eslint-config-next`) or drop the script.
- **Suppressed type errors.** `ignoreBuildErrors: true` in `next.config.mjs` means neither the local nor the deploy build fails on TypeScript mistakes. With lint broken too, nothing is checking types right now.
- **Build pinned to Node 20.** `deploy.yml` sets `node-version: '20'`, which is past end-of-life. The actions themselves run on Node 24; only the build step is pinned. Bump to `'22'` and confirm the deploy still succeeds.
