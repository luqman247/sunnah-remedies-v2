# Duʿa & Dhikr — publication status corrections

**Date:** 18 July 2026  
**Branch:** `feat/sr-comprehensive-ux-improvement`  
**Classification:** High P1 — misleading publication / navigation state (not P0)

## Source of truth

| Surface | Authoritative gate | Module |
|---------|-------------------|--------|
| Duʿa & Dhikr entries | `DUA_DHIKR_ELIGIBILITY_GROQ` + editorial bypass | `src/sanity/lib/dua-dhikr-publication-gate.ts` via `dua-dhikr-public-fetch.ts` |
| Morning Dhikr items | `DHIKR_ELIGIBILITY_GROQ` + editorial bypass + morning timing | `src/sanity/lib/dhikr-publication-gate.ts` via `getMorningDhikrItemsPublic()` |
| Evening Dhikr items | Same Dhikr gates + evening timing | `getEveningDhikrItemsPublic()` |
| Collection navigation / search / sitemap / related | `publicationState` from gate-passed **entry counts only** | `src/lib/dua-dhikr/publication-status.ts` |

**Decision rule applied:** Arabic text, taxonomy structure, import readiness, or reference-register projections never imply `published`. Only gate-passed public entries do.

## Status corrections

| Collection | Previous UI | Corrected UI | Evidence / SoT |
|------------|-------------|--------------|----------------|
| Morning Dhikr card | “Preparing for publication” while `/knowledge/dhikr/morning` could show gate-passed items | `published` iff `getMorningDhikrItemsPublic().length > 0`; otherwise `in-preparation` (non-link in primary nav) | Morning count wired into `getDuaDhikrCollectionsPublic` |
| Evening Dhikr card | Same mismatch | Same rule via `getEveningDhikrItemsPublic()` | Evening count wired into public collections fetch |
| ~40 empty canonical collections | Active links labelled “Preparing for publication” | Primary browse/quick-access/discovery/search: **published only**; forthcoming grouped under restrained non-interactive “In preparation” | Landing page rewrite |
| Related / prev-next / continue-reading | Could surface empty collections | Published only | Collection page + ContinueReading |
| Sitemap | Products unfiltered; no collection discipline | Products through `isPublicCatalogueProduct`; dua collections only when `published` | `src/app/sitemap.ts` |
| Empty collection direct URL | Indexable empty shell | Honest empty state retained; `robots: noindex, nofollow` when not published | Collection `generateMetadata` |

## What was not changed

- Publication gate predicates themselves (scholarly / editorial pathways) were not weakened.
- Morning/Evening route content and scholarly badges were not re-authored to “look published”.
- No Islamic content was published merely because Arabic appeared on a route.
