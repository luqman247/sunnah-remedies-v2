# Danish chrome phase — stop report

**Branch:** `feat/sr-comprehensive-ux-improvement`  
**Worktree:** `/Users/nikmaljabarzai/Desktop/sunnah-remedies-ux`  
**Date:** 18 July 2026  

Nothing committed, pushed, merged, or deployed.

## Controlled-state (pre-Danish) — completed

See `docs/ux/SR_UX_CONTROLLED_STATE_REPORT.md`.

| Item | Result |
|------|--------|
| Patch snapshot | `/Users/nikmaljabarzai/Desktop/sr-ux-preapproval-snapshot.patch` |
| Missing assets | Root cause: `beforeFiles` rewrite; fixed via `afterFiles` |
| Verification product | Contained in branch (pending merge/deploy — not claimed live) |
| Dev-preview | Flag-gated; production refuses fixtures |
| Duʿa publication nav | High P1 SoT + in-preparation grouping |
| Build / tsc / focused tests | Pass |

## Danish chrome — implemented

### Root cause of EN chrome on `/dk`
Locale rewrites served `[locale]=da` page content while `getMessages()` / client provider still resolved **English** (middleware locale detection vs rewrite). Chrome now receives **explicit `params.locale`**.

### Changes
- `layout.tsx` — `getMessages({ locale })`, `NextIntlClientProvider locale+messages`, pass locale into Masthead/Footer
- `MastheadServer` / `FooterServer` — labels from `nav` / `footer` message catalogs
- `Breadcrumb` — strip `dk|da|en`; department labels via `nav.*`; no “Dk”
- Homepage eyebrow — reject `———` placeholders; `EST./GRUNDLAGT MMXXV`
- `getHomepage` — no English CMS fallback for DA
- `DepartmentNav` — localised department title + apothecary section labels
- `/en` → unprefixed redirect (as-needed)

### Browser evidence (`/dk`, `/dk/the-apothecary`)
- Masthead: Apoteket, Akademiet, Hellige Rejser, Vidensbiblioteket, Kliniske Konsultationer
- CTA: Anmod om en konsultation
- Footer: Søjlerne + Danish links; brand “Sunnah Remedies” retained in colophon
- Breadcrumb: Hjem / Apoteket (no Dk)
- Switcher: shows “English” on DA; preserves route intent
- EN `/the-apothecary`: English chrome unchanged

### Remaining (page body, not global chrome)
- Some department **page CMS body** still English on `/dk/the-apothecary` (hero copy) — content layer, not chrome
- Academy / Journeys / Knowledge secondary section maps not fully keyed yet (apothecary done)
- Consent banner still hardcoded English (pre-existing)
- Qurʾān verse English translation in reflection (scholarly content)

### Verification
- `tsc --noEmit` pass
- Smokes: danish-chrome, locale-routing, catalogue-guard, dua gates pass
- Production build earlier in cycle pass; re-run recommended before merge
- Viewports: verified via browser on desktop; mobile chrome uses same Masthead/Footer strings

## Stop for approval

Awaiting owner decision before broader UX (homepage tasks, booking, academy, etc.).
