# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production (static export to ./out)
npm run lint     # ESLint 9 (flat config in eslint.config.mjs)
npx tsc --noEmit # Typecheck — the build will NOT do this for you
```

No test suite is configured. `ignoreBuildErrors: true` in `next.config.mjs` means `npm run build` never fails on TypeScript errors, so run `npx tsc --noEmit` separately to check types. Both lint and typecheck pass clean as of 2026-09-12.

ESLint config lives in `eslint.config.mjs` (`eslint-config-next` core-web-vitals + typescript). `components/ui/**` and `hooks/**` are shadcn-generated scaffolding and have a few React-hooks rules turned off there — that exception is for generated code only, so if you ever hand-edit one of those files, take it out of the exception.

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
- `app/layout.tsx` — Root layout: metadata, Google Fonts (Poppins), theme color, and **Google Analytics** (GA4 `G-GBG1JM7H2F`, injected as raw `next/script` tags and gated to `NODE_ENV === 'production'`). Analytics is wired by hand here, not through an npm package — a dependency scan will not reveal it, so do not conclude the site has no analytics from `package.json` alone.
- `components/menu-item-card.tsx` — Renders individual product cards with image, name, description, price.
- `components/menu-section.tsx` — Renders a full category section (grid of `MenuItemCard`).
- `components/header.tsx` — Sticky navigation with category tabs.
- `components/contact-section.tsx` — Contact/location info section.
- `components/footer.tsx` — Footer with "Desarrollado por RENOA" credit linking to renoa.tech. Contains commented-out `linear-gradient` styles pending client approval.

### Styling

- Tailwind CSS v4 (configured via `@tailwindcss/postcss`). Tailwind scans **every** source file, so an unused component still inflates the generated CSS — deleting dead files is a real production win, not just tidiness.
- Brand colors are CSS custom properties in `app/globals.css`: `--brand-red`, `--brand-blue`, `--brand-yellow`. `app/globals.css` is the only stylesheet — a stale `styles/globals.css` duplicate was deleted.
- Shadcn/ui: `components/ui/` holds **only `button.tsx`** — the one component the site actually uses. The rest of the generated catalogue was deleted (it never shipped in the JS, but Tailwind scanned it and inflated the CSS by ~83 KB). Add any component back on demand with `npx shadcn@latest add <name>`; `components.json` is still configured for it. Generated files are edited via the CLI, not by hand.
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

- **Nothing runs lint or typecheck automatically.** `deploy.yml` only builds; a lint or type error reaches production unnoticed. Adding those steps to CI would catch it, at the cost of a lint error blocking an urgent price change — decide which tradeoff suits the client.
- **Next is pinned by caret, not exact.** `next: ^16.3.5` means `npm ci` in CI installs whatever 16.x the lockfile holds — fine today, but the lockfile is the only thing keeping CI and local identical. `npm audit` reports 0 vulnerabilities as of 2026-09-13; re-check after any dependency change.
- **Node version is not pinned locally.** `deploy.yml` builds on Node 22; `package.json` has no `engines` field, so a local machine on a different major (this one runs 24) can build differently than CI without warning.
