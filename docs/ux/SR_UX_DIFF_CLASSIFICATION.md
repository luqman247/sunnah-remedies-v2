# UX working-tree diff classification

**Snapshot:** `/Users/nikmaljabarzai/Desktop/sr-ux-preapproval-snapshot.patch`  
**Manifest:** `/Users/nikmaljabarzai/Desktop/sr-ux-preapproval-snapshot.manifest.txt`  
**Quarantine F copies:** `/Users/nikmaljabarzai/Desktop/sr-ux-quarantine-F/`  
**Branch:** `feat/sr-comprehensive-ux-improvement` @ pre-control working tree

## Categories

| Cat | Meaning |
|-----|---------|
| A | Baseline audit documentation |
| B | Verification-product P0 containment |
| C | Routing/infrastructure required to run baseline |
| D | Dev-preview hardening |
| E | Danish chrome correction (after control report) |
| F | Broader unapproved UX implementation |
| G | Unrelated / uncertain (retained only if trivial safety) |

## File classification

| Path | Class | Disposition |
|------|-------|-------------|
| `docs/ux/*` | A | Retain |
| `src/lib/commerce/public-product-guard.ts` | B | Retain |
| `src/sanity/lib/fetch.ts` | B | Retain |
| `src/sanity/lib/queries.ts` | B | Retain |
| `src/components/ui/Breadcrumb.tsx` | B (+ E-ready home crumb) | Retain product-guard hunks |
| `tests/ux/public-catalogue-guard.smoke.ts` | B | Retain |
| `next.config.ts` | C | Retain; move English rewrite to `afterFiles` so public assets are not intercepted |
| `middleware.ts` | C | Retain matcher `/` |
| `tests/ux/locale-routing.smoke.ts` | C | Retain / extend |
| Dev-preview gate + tests | D | Implement in this cycle |
| Duʿa publication navigation | High P1 (authorised) | Implement in this cycle |
| `src/components/chrome/Footer.tsx` | G | Retain unique React key (duplicate-key safety) |
| `src/app/[locale]/page.tsx` TaskPathways | F | Restored to HEAD |
| `src/components/arrival/TaskPathways.tsx` | F | Moved to quarantine-F |
| `src/components/arrival/arrival.css` task styles | F | Restored to HEAD |
| `ConsultationsClient.tsx`, booking files, `ProgrammeView.tsx` | F | Restored to HEAD |
| `Masthead.tsx`, `LanguageSwitcher.tsx` analytics | F | Restored to HEAD |
| `messages/*` tasks/booking/academy/nav shortcut keys | F | Restored to HEAD |

## Missing assets — root cause

Files **exist** under `public/brand/` and `public/photography/` and are tracked on `origin/main`. They are **not** LFS, ignored, or worktree-relative path bugs.

**Root cause:** `next.config.ts` locale rewrites used `beforeFiles`, which runs **before** the public filesystem. Paths such as `/brand/lockup-*.svg` and `/photography/institution-hero.jpg` were rewritten to `/en/brand/…` and `/en/photography/…`, producing soft 404 HTML.

**Correction:** Serve static public assets first; apply English `as-needed` rewrites via `afterFiles` (or explicitly exclude `brand|photography` and extensioned paths). Do not copy assets from the social-sharing worktree.
