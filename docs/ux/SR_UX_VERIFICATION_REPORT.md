# SR UX Verification Report

**Branch:** `feat/sr-comprehensive-ux-improvement`  
**Worktree:** `/Users/nikmaljabarzai/Desktop/sunnah-remedies-ux`  
**Base:** `origin/main` @ `c82bdb6`  
**Date:** 18 July 2026  
**Commit / push / deploy:** none (awaiting Phase 2A closure approval)

## Phase 2A closure pass (verification)

### Quality checks

| Check | Result |
|-------|--------|
| TypeScript `npx tsc --noEmit` | Pass (exit 0) |
| Lint command | `npm run lint` → `eslint .` (see Lint section) |
| Full-repo lint | **Fails** — exit 1; **170 errors, 172 warnings** (pre-existing debt; not rewritten in this phase) |
| UX-touched lint subset | Pass (exit 0; CSS files ignored by ESLint flat config with “no matching configuration” warnings only) |
| Smoke `tests/ux/*.ts` + `tests/dua-dhikr/*.test.ts` | Pass — 24/24 |
| Production `npm run build` | Pass (exit 0) |
| Dev server | `:3010` |
| Production `next start` | `:3011` (status smokes) |

### Lint (honest)

- **Next.js 16.2.10** removed `next lint` (CLI treats `lint` as a directory). That is not an acceptable substitute for lint.
- **Intended command restored:** `package.json` → `"lint": "eslint ."` with new `eslint.config.mjs` using existing `eslint-config-next` (core-web-vitals + typescript).
- **Ignores:** `.next/**`, `out/**`, `build/**`, `node_modules/**`, `next-env.d.ts`, `coverage/**`.
- **Full run:** exit **1** — 342 problems (170 errors, 172 warnings). Dominant debt: `@typescript-eslint/no-require-imports` in pre-existing `tests/dhikr/*`, unused vars in ops/workflows, etc. **Not fixed** (unrelated repository-wide rewrite refused).
- **UX-caused fixes applied:** consent `set-state-in-effect` → `useSyncExternalStore`; `tests/dua-dhikr/dua-dhikr-dev-fixtures.test.ts` `require()` → ESM imports.
- **Do not claim** “lint passed” for the full repository.

### Tablet 768 × 1024 (actual viewport — not inferred)

Device metrics: width 768, height 1024. Masthead desktop nav breakpoint raised to **1024px** so tablet uses **Navigation** (Danish labels no longer overflow).

| Route | Locale | Result |
|-------|--------|--------|
| `/dk/the-academy` | DA | Pass — Navigation menu; crumb `HJEM / AKADEMIET`; secondary Pensum/…; footer DA; no overflow |
| `/the-academy` | EN | Pass — Navigation; crumb `HOME / THE ACADEMY`; no overflow |
| Consent banner + Tilpas prefs | DA | Pass — Cookieindstillinger; Afvis/Tilpas/Acceptér; prefs categories DA; Escape → focus Tilpas |
| `/dk/this-route-does-not-exist` | DA | Pass — institutional 404; no slug crumb; recovery links |
| `/dk/knowledge-library/dua-dhikr` | DA | Pass — chrome/breadcrumb DA; **In preparation** unavailable cards visible |
| Footer / language switcher | EN+DA | Pass — EN\|DA; switchTo labels |

Screenshots (local agent capture):  
`phase2a-tablet-da-academy-768x1024.png`, `phase2a-tablet-da-consent-768x1024.png`, `phase2a-tablet-da-consent-prefs-768x1024.png`, `phase2a-tablet-en-academy-768x1024.png`, `phase2a-tablet-da-404-768x1024.png`, `phase2a-tablet-da-dua-768x1024.png`, `phase2a-tablet-da-dua-in-preparation-768x1024.png`.

**Note:** Next.js dev “N” badge can overlap **Afvis alle** in development only — not a production chrome defect.

### 200% browser zoom

Method: CDP `Emulation.setPageScaleFactor(2)` at 768×1024 (visualViewport ≈ 384×512 @ scale 2). CSS `zoom` alone inflated `scrollWidth` spuriously and was not used as the pass criterion.

| Surface | Result |
|---------|--------|
| `/dk` homepage | Pass — reflow; Navigation usable; no required H-scroll |
| `/dk/the-academy` | Pass — crumb/nav usable; consent reachable |
| Consent preferences (Tilpas) | Pass — panel opens; controls reachable; Escape restores focus |
| `/dk/knowledge-library` | Pass — crumb DA; no H-scroll |
| `/dk/this-route-does-not-exist` | Pass — 404 copy + recovery links usable; no slug |

Screenshots: `phase2a-zoom200-da-home.png`, `phase2a-zoom200-da-academy.png`, `phase2a-zoom200-da-knowledge-library.png`, `phase2a-zoom200-da-404.png`.

### Reduced motion (`prefers-reduced-motion: reduce`)

Emulated via CDP. Global rule in `globals.css` forces `animation/transition-duration: 0.01ms`.

| Interaction | Result |
|-------------|--------|
| Consent open / Escape | Pass — state change immediate; focus return |
| Navigation menu | Pass — expanded/collapsed without relying on motion |
| Language switch DA→EN | Pass — `/dk` → `/`; chrome EN; no route loop |
| Page content | Pass — essential state remains perceivable |

### Keyboard

| Control | Result |
|---------|--------|
| Consent Tilpas → Escape → focus return | Pass |
| Consent scroll unlock after Escape | Pass |
| Navigation open / Escape close | Pass |
| Language switcher | Pass |
| Breadcrumb links | Pass (present; activatable) |
| 404 recovery (Tilbage til tærsklen → `/dk`) | Pass (Enter on focused link) |

### Catch-all / error-boundary safety

Catch-all: `src/app/[locale]/[...rest]/page.tsx` → `notFound()`.  
Error boundary: `src/app/[locale]/error.tsx` (localised `common.*`).

| Target | Result |
|--------|--------|
| Static `/`, `/the-academy`, `/dk/the-academy`, `/dk/knowledge-library` | 200 — not masked |
| Dynamic product `/the-apothecary/black-seed-oil` | 200 |
| Duʿa `/dk/knowledge-library/dua-dhikr/morning-dhikr` | 200 |
| API `/api/search` | 200 `application/json` (not HTML 404) |
| Asset `/brand/icon-primary.svg` | 200 `image/svg+xml` |
| Auth `/api/auth/providers` | 200 |
| `/studio` | 200 |
| `/en/the-academy` | 307 → `/the-academy` |
| Unknown EN + DA | Institutional 404 UI; correct locale; **no visible slug breadcrumbs** |
| HTTP status on unknown | **200 soft-404** in both `next dev` and `next start` — **pre-existing sitewide** next-intl/`[locale]` + `notFound()` limitation (documented in `docs/dhikr/21-decision-log.md` ADR-017). Phase 2A does not claim true HTTP 404. |

### Console / hydration

No hydration warnings observed on verified pages. Language switch and consent behaved without loops. Dev-only Next.js overlay present.

### Deferred (out of Phase 2A)

- Department landing **body** still English on many `/dk` routes (D→E) — gap register
- Sitewide soft-404 HTTP status (infrastructure)
- Homepage task pathways / booking redesign / Academy programme UX / commerce redesign

## Prior retained work

Verification-product containment, asset-routing, dev-preview gate, Duʿa publication-state, Danish chrome layout fix, route/rewrite protections — retained.

## Approval boundary

No commit, push, merge, or deploy. Phase 2B not started.
