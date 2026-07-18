# SR Global Localisation Phase Report (Phase 2A)

**Branch:** `feat/sr-comprehensive-ux-improvement`  
**Worktree:** `/Users/nikmaljabarzai/Desktop/sunnah-remedies-ux`  
**Date:** 18 July 2026  
**Commit / push / merge / deploy:** none

## Scope completed

Shared system surfaces and navigation architecture only. Homepage task pathways, booking redesign, Academy restructuring, commerce redesign, and broad page-body translation were **not** begun.

## Implemented

### 1. Consent and privacy interface
- Full `consent` message namespace in `en.json` / `da.json`
- `ConsentBanner` uses `useTranslations("consent")` — no hard-coded visitor strings
- Storage remains `sr_consent_v1` (language-agnostic; locale switch does not reset choice)
- Preference panel: Escape closes, focus returns to Customise, body scroll locked while open, live status region, privacy policy link
- Consent semantics unchanged (no new tracking)

### 2. Secondary navigation localisation
- Extended `DEPARTMENT_SECTION_MESSAGE_KEYS` for Academy, Sacred Journeys, Knowledge, Institution
- `DepartmentNav` resolves `apothecary` / `academy` / `journeys` / `duaDhikr` / `institutionNav`
- Retained: Hijāma, Umrah, Duʿa & Dhikr (documented)

### 3. Global system-state parity
- Expanded `common.*` (retry, returnHome, unavailable, empty, sessionExpired, preparing, errorTitle/Body, …)
- Locale `error.tsx` boundary uses `common` messages
- Localised 404 via catch-all `[locale]/[...rest]` + client `NotFoundContent` (follows layout locale, not stale cookie)
- Loading continues via `CorridorLoader` → `common.loading`
- `hospitable` / `form` / `search` / `notFound` catalogues already EN+DA

### 4. Breadcrumb architecture
- Locale segments (`dk`/`da`/`en`) stripped; never shown as “Dk”
- Leaf labels from section message map where available
- Unknown routes: no invented slug breadcrumbs
- Accessible label: `breadcrumbs.ariaLabelNav`
- Long Danish labels: wrap via `overflow-wrap`

### 5. Language-switcher resilience
- Strategy documented in `LanguageSwitcher.tsx`
- Preserves equivalent path; as-needed EN / `/dk` DA prefixes
- Does not forward query strings (avoids form-state leakage)
- Accessible `nav.switchTo` labels; `document` lang from layout

### 6. Danish CMS body boundary
- Gap register: `docs/ux/SR_DANISH_CONTENT_GAP_REGISTER.md`
- Class A: 0
- Class C fixed: department-nav maps; knowledge hero name + skip link; booking mobile CTA message key; consent/system chrome; 404 catch-all
- Class C remaining / D→E: documented for editorial — no invented clinical/Islamic translations

## Intentionally retained terms

Sunnah Remedies, Hijāma, Umrah, Duʿa & Dhikr, Arabic display, scholarly transliterations (isnād, bimāristān, …), place names.

## Closure pass (18 July 2026)

### Lint infrastructure

- Next.js 16 removed `next lint`. Claiming “lint unavailable” is not acceptable.
- Restored intended path: `npm run lint` → `eslint .` via `eslint.config.mjs` (`eslint-config-next` already in package).
- **Full-repo result:** exit 1 — 170 errors, 172 warnings (pre-existing; not a Phase 2A rewrite).
- **UX subset:** clean of errors after consent + dua-fixture fixes.
- Reports must not state that full-repo lint “passed”.

### Layout / a11y closure

- Masthead desktop nav breakpoint **1024px** (tablet 768 uses Navigation; Danish overflow fixed).
- Tablet 768×1024, 200% zoom, reduced-motion, keyboard, catch-all safety — see `SR_UX_VERIFICATION_REPORT.md`.
- Soft HTTP 404 status remains a known next-intl/`[locale]` sitewide limit; institutional UI is correct.

## Approval boundary

Stop after Phase 2A closure report. Do not begin homepage task clarity, booking, Academy, or other broad UX until further approval. Do not commit until checkpoint plan is approved.
