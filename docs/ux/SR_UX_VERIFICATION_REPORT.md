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

---

## Phase 2B — Homepage task clarity (verification)

**Status:** Implementation complete and verified in browser — **not committed**  
**Dev server:** `:3010`  
**External ESLint config (outside Git):** `/Users/nikmaljabarzai/Desktop/sr-eslint-next16-temp.config.mjs`  
**Safety patch (outside Git):** `/Users/nikmaljabarzai/Desktop/sr-ux-preapproval-snapshot.patch`

### Quality

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | Pass |
| `node --import tsx --test tests/ux/*.ts` | Pass — 7/7 |
| Focused `homepage-task-clarity.smoke.ts` | Pass |
| Production `npm run build` | Pass |
| Changed-file ESLint (external temp config) | **0 errors** |
| Full-repo lint | **Known debt** — ~170 errors / 172 warnings — do not claim pass |

### Viewports × locales

| Viewport | EN | DA |
|----------|----|----|
| 390×844 | Pass — primary CTA in first viewport; Navigation panel tasks | Pass — Book en konsultation; pathways DA |
| 768×1024 | Pass — Navigation (panel); no H-overflow | Pass — long DA labels; no clip |
| 1440×900 | Pass — desktop masthead with Institute + Book accent | Pass — parity |

### Routes verified

`/`, `/dk` (canonical Danish), `/consultations` (aria-current on Book), `/the-apothecary`, `/the-academy`, `/knowledge-library/dua-dhikr`, `/institute` — HTTP 200; no fixture/dev-preview links on homepage.

**`/da` closure:** Direct `/da` and `/da/:path*` return **308 Permanent Redirect** to `/dk` (query preserved). Internal rewrite `/dk` → `/da` unchanged. Homepage on `/dk` canonical = `https://www.sunnahremedies.com/dk`; hreflang da → `/dk` (never `/da`).

### Masthead breakpoint closure

| Width | Mode |
|-------|------|
| ≤1023 | Navigation panel trigger visible; desktop nav hidden |
| ≥1024 (incl. 1440) | Desktop institutional nav visible; Navigation trigger `display: none` |

No visible dual chrome; no redesign required.

### Accessibility / motion / zoom

| Check | Result |
|-------|--------|
| Mobile Escape → focus Navigation | Pass |
| Scroll lock while panel open | Pass |
| Tab focus containment in panel | Present in Masthead implementation |
| Reduced motion | Pass |
| 200% zoom @ 768 | Pass — no required H-scroll |
| Console / hydration | No hydration errors observed on verified surfaces; Next.js dev “N” badge only |

### Interaction counts

See `SR_HOMEPAGE_TASK_CLARITY_PHASE_REPORT.md` and `SR_USER_JOURNEYS.md`.

### Scope boundary

No booking-flow redesign, Academy restructuring, commerce redesign, Sacred Journeys registration redesign, broad DA CMS translation, analytics, or visual rebrand.

## Phase 2C — Consultation booking journey (18 July 2026)

**Commit / push / deploy:** none (awaiting approval). Working tree holds Phase 2C changes uncommitted.

### Quality checks

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | Pass |
| UX + Duʿa tests + `booking-journey.smoke.ts` | Pass — 34/34 |
| Locale-routing + catalogue-guard smokes | Pass (included in UX suite) |
| Production `npm run build` | Pass |
| Changed-file ESLint (temp `_eslint-temp.config.mjs` from Desktop) | Pass — 0 errors |
| Full-repo lint | Known debt (~170 errors / 172 warnings) — not claimed fixed |

### Browser interaction sequence (safe mock on `:3011`)

1. `/dk/consultations` — progress **Trin 1 af 5: Behandler**; Fortsæt disabled until selection  
2. Kvindelig behandler → Fortsæt  
3. London (Riyadh disabled / Kommer snart) → Fortsæt; summary updates  
4. Mandag → empty availability + Korrespondance fallback  
5. Tirsdag → availability error + Prøv igen → retry recovers slots  
6. Onsdag → times with **Ikke ledig** text on disabled slots → 10:30 → Fortsæt  
7. Details → Review (URL remains `/dk/consultations` — no health/query data)  
8. Submit mock → success **Tak**, reference `SR-…`, payment/cancellation copy present  
9. `/consultations` EN — Step 1 of 5 / Continue / View appointment summary  
10. Homepage `/dk` — **Book en konsultation** primary intact  

### HTTP smokes

| Route | Result |
|-------|--------|
| `/`, `/dk`, consultations EN/DA, dua-dhikr EN/DA, catalogue | 200 |
| Unknown route | Soft 200 institutional 404 (known ADR-017) |
| `/da` | **308** → `/dk` |
| `/brand/wordmark-emerald.svg` | 200 |

### Viewports / a11y

| Check | Result |
|-------|--------|
| 390 / 768 / 1440 | Progress wraps; summary jump on small screens; sticky CTA only on review |
| Keyboard | Radios, dates, times, Back/Continue operable |
| Reduced motion | Emulated; spinner CSS respects `prefers-reduced-motion` |
| Console / hydration | No unexpected app errors observed on booking path |
| Overflow | No required horizontal overflow on booking shell at verified widths |

### Safe-testing limitation

Default / production: **contact fallback** only — no fabricated booking reference.  
Local mock confirmation (`TEST-SR-…`) only when `ENABLE_MOCK_BOOKING_FLOW=true` and not production. Hooks: Monday empty, Tuesday first-fail, `+stale@`, `+fail@`.

### Production-safety correction

Verified: production-mode submit cannot invent a live `SR-` reference; EN/DA request wording; mock gate blocked in production; focused tests include `booking-production-safety.smoke.ts`.

### Scope boundary (Phase 2C)

No Academy, Apothecary/checkout, Sacred Journeys registration, analytics, broad CMS translation, or visual rebrand.

## Prior retained work

Phase 2A commits intact:

1. `91fd1ed` fix: correct locale routing and static asset resolution  
2. `9ffe377` fix: protect public fixtures and publication states  
3. `dd1aef8` feat: localise Danish global chrome and system states  
4. `77fb345` docs: record ux audit and phase verification  

Verification-product containment, asset-routing, Duʿa publication-state, Danish chrome — retained.

## Approval boundary

No commit, push, merge, deploy, or pull request for Phase 2B. Stop for approval.

## Approval boundary (Phase 2C)

No commit, push, merge, deploy, or pull request for Phase 2C. Stop for approval.
