# UX controlled-state report (pre–Danish phase)

**Worktree:** `/Users/nikmaljabarzai/Desktop/sunnah-remedies-ux`  
**Branch:** `feat/sr-comprehensive-ux-improvement`  
**Date:** 18 July 2026  
**Git actions:** nothing committed, pushed, merged, or deployed.

## Snapshot

| Artifact | Path |
|----------|------|
| Full patch | `/Users/nikmaljabarzai/Desktop/sr-ux-preapproval-snapshot.patch` |
| Manifest | `/Users/nikmaljabarzai/Desktop/sr-ux-preapproval-snapshot.manifest.txt` |
| Quarantined F copies | `/Users/nikmaljabarzai/Desktop/sr-ux-quarantine-F/` |
| Classification | `docs/ux/SR_UX_DIFF_CLASSIFICATION.md` |

## Classification summary

| Cat | Disposition |
|-----|-------------|
| A docs | Retained (`docs/ux/*`) |
| B verification product | Retained + extended (related products, sitemap) |
| C routing | Retained; English rewrite moved to `afterFiles` |
| D dev-preview | Implemented (`ENABLE_DHIKR_DEV_PREVIEW`) |
| E Danish chrome | Next phase (this cycle) |
| F broader UX | Quarantined / restored to HEAD (TaskPathways, booking, academy CTA, masthead a11y extras, etc.) |
| G Footer unique key | Retained |

## Missing assets — root cause

Files exist and are tracked on `origin/main` under `public/brand` and `public/photography` (not LFS, not ignored, not social-branch-only).

**Cause:** `beforeFiles` English locale rewrite intercepted `/brand/*` and `/photography/*` → `/en/…` soft 404.

**Fix:** English catch-all moved to `afterFiles`. Verified HTTP 200 for brand SVG and institution hero on prod (`3011`) and dev (`3010`).

Visual comparisons involving those assets may now proceed; earlier broken-image judgements are **inconclusive / superseded**.

## Verification product (P0 — resolved in this UX branch, pending merge/deploy)

- Catalogue excludes fixture; browser: 4 remedies; no “Do Not Buy”
- Direct slug serves institutional not-found body
- Guard covers fetch, GROQ list/detail, related products, slugs, breadcrumbs, sitemap
- **Do not claim removed from live production until deployment**

## Dev-preview

- Gate: `isDhikrDevPreviewEnabled()` — requires `ENABLE_DHIKR_DEV_PREVIEW=true` and non-production
- Prod `next start`: no fixture strings; institutional not-found body
- `noindex, nofollow` retained; not in nav/search/sitemap
- Tests: enabled-local / disabled-local / production

## Duʿa publication navigation (High P1)

- SoT documented in `docs/ux/SR_DUA_PUBLICATION_STATUS.md`
- Morning/Evening counts from Dhikr public gates
- Primary nav / search / discovery / related / continue-reading: published only
- Forthcoming: restrained non-interactive “In preparation” section
- Empty collection pages: honest empty + `noindex, nofollow`

## Routing tests

- Unprefixed EN `/` → 200
- `/dk` → 200
- Brand/photo assets → 200 (afterFiles)
- Unknown route → 404
- API `/api/cart` unaffected (200/commerce response)
- Locale smoke + build route table OK
- Soft-404 pages may still report HTTP 200 with institutional body (existing pattern)

## Tooling

| Check | Result |
|-------|--------|
| `tsc --noEmit` | Pass |
| `npm run lint` | Next 16 reports invalid `next lint` project dir quirk (exit 0; known script limitation) |
| Focused smoke/tests | Pass |
| `npm run build` | Pass |
| Prod `next start` probes | Pass |

## Proceeding

Danish global-chrome parity is the next authorised phase.
