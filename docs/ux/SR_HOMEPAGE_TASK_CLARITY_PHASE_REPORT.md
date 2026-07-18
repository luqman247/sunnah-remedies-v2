# Phase 2B — Homepage task clarity and task-led global navigation

**Branch:** `feat/sr-comprehensive-ux-improvement`  
**Worktree:** `/Users/nikmaljabarzai/Desktop/sunnah-remedies-ux`  
**Date:** 18 July 2026  
**Status:** Closure checks complete — authorised for local commits  

## Closure — masthead at desktop widths

Intended breakpoint (from Phase 2A): **1024px**.

| Width | Desktop `masthead-nav` | `Navigation` trigger | Overlap / duplicate |
|-------|------------------------|----------------------|---------------------|
| 1023 | `display: none` | `display: block` (panel architecture) | None |
| 1024 | `display: flex` (6 links) | `display: none`, not in layout | None |
| 1279 | flex | none | None |
| 1280 | flex | none | None |
| 1440 | flex | none | None |

**1440 × 900 final behaviour:** Full institutional desktop navigation is visible (Apothecary, Academy, Sacred Journeys, Knowledge Library, The Institute, Book a consultation). The “Navigation” drawer trigger is **not** visible — it remains in the DOM for the <1024 panel path but is CSS-hidden and excluded from layout/focus. Earlier notes that “still shows Navigation” referred to accessibility-tree presence of a hidden control, not a visible duplicate. EN and DA share the same CSS breakpoint behaviour.

No masthead redesign was required.

## Closure — `/da` versus `/dk`

| Question | Result |
|----------|--------|
| Finding | **B (corrected):** `/da` is the **internal** next-intl / App Router locale id. Public canonical Danish is **`/dk`**. Direct `/da` was accidentally publicly reachable (HTTP 200) — not an intentional alias. |
| Canonical strategy | Unchanged: EN unprefixed; DA public prefix `/dk`; rewrite `/dk` → internal `/da`. |
| Fix | Permanent redirects `/da` → `/dk` and `/da/:path*` → `/dk/:path*` (query preserved). |
| `localeUrl` | Emits `/dk`, never `/da`. |
| Language switcher | Generates `/dk` via next-intl `prefixes`. |
| Homepage metadata on `/dk` | Canonical `…/dk`; hreflang `en` → `/`, `da` → `/dk`. |
| Sitemap | Continues to emit EN URLs only; `localeUrl("da", …)` would not emit `/da` if used later. |

Reporting earlier used `/da` as a convenient probe of the internal segment; that must not be treated as a public locale.

## Objective

Preserve the existing premium, scholarly UI while making the visitor’s practical next step immediately understandable.

## Baseline (before edit)

Inspected live at `:3010` in EN and DA at 390×844, 768×1024, 1440×900.

| Surface | Baseline |
|---------|----------|
| Hero primary CTA | Sole action: **Enter the institution** → `#departments` |
| Secondary CTA | None in hero |
| Masthead transaction | Highlighted **Clinical Consultations** (institutional, not action-led) |
| Mobile | Navigation panel; Escape + scroll-lock present; weak focus trap |
| Task pathways | None on homepage |
| Trust in first viewport | Standfirst only; no compact trust line under actions |

### Baseline interaction counts (home → principal task)

| Task | Desktop | Mobile |
|------|---------|--------|
| Book consultation | 1 (masthead) | 2 (Navigation → item) |
| Browse remedies | 1 | 2 |
| Explore programmes | 1 | 2 |
| Find Duʿa & Dhikr | 2+ (Knowledge Library → drill) | 3+ |
| Explore the Institute | 2+ (footer / secondary) | 2+ |

## Design decisions

| Decision | Why | Gate |
|----------|-----|------|
| Keep hero composition, Arabic, typography, art direction | Identity must remain unmistakably Sunnah Remedies | Aesop / 20 years |
| Primary solid action: **Book a consultation** | Highest-value transactional intent; direct label | Mayo clarity |
| Secondary: **Enter the institution** | Evocative institutional path retained, no longer sole option | Oxford declaration |
| Quiet support links under hero | Remedies / programmes / Duʿa without SaaS button cluster | Aesop restraint |
| Editorial task list (not card grid) | Intention before department name | Wellcome / no cards |
| Sacred Journeys pathway only if `getAllJourneys().length > 0` | No false open registration | Mayo honesty |
| Trust line from existing standards language | No invented stats, endorsements, or outcomes | Mayo / Oxford |
| Masthead: accent CTA label → bookConsultation; Institute in institutional row; mobile “Common tasks” group | Task-led without mega-menu | Design gate |
| Modest mobile hero spacing only | Bring primary CTA into first viewport at 390 without crowding | Restraint |
| Quarantined TaskPathways not restored wholesale | Reassessed hunk-by-hunk against current architecture | Staff engineering |

## Navigation hierarchy

### Institutional (preserved)

Apothecary · Academy · Sacred Journeys · Knowledge Library · The Institute · Clinical consultations (as book CTA)

### Task-led (added without duplication)

- Desktop: accent **Book a consultation**; Institute in primary row  
- Mobile panel: primary book CTA; Departments group; Common tasks (book, Apothecary, Academy, Duʿa & Dhikr, Institute)  
- Route-aware `aria-current` + `--current` class (not colour alone)

## Homepage action hierarchy

1. **Primary:** Book a consultation → `/consultations`  
2. **Secondary:** Enter the institution → `#departments` (CMS/fallback)  
3. **Supporting:** Browse remedies · Explore programmes · Find Duʿa & Dhikr  
4. **Trust line:** scholarship / laboratory / clinical accountability / plain limits — before commerce  
5. **Pathways section:** “What brings you here” editorial list after Tradition, before Departments  

## Task pathways

| Intention | Destination | Gating |
|-----------|-------------|--------|
| Book Hijāma | `/consultations` | Always |
| Looking for a remedy | `/the-apothecary` | Always |
| Study | `/the-academy` | Always |
| Duʿa or Dhikr | `/knowledge-library/dua-dhikr` (hub) | Always — hub only; unpublished collections remain “In preparation” on hub |
| Understand the Institute | `/institute` | Always |
| Sacred Journey | `/sacred-journeys` | Only when public journeys exist |

## Localisation

- All new UI strings in `src/messages/en.json` and `src/messages/da.json`  
- Hijāma, Duʿa, Dhikr preserved where established  
- Danish long labels verified at 390 / 768 / 1440 — no clip/collision in chrome or pathways  
- Deferred: remaining editorial CMS body gaps (e.g. some DA reflection translations still EN from CMS)

## Accessibility

| Check | Result |
|-------|--------|
| Semantic nav / headings | Pass |
| Escape closes mobile panel; focus returns to Navigation | Pass |
| Focus trap (Tab cycle in panel) | Pass |
| Scroll lock while open | Pass |
| 44×44 targets on support links and pathways | Pass |
| Active state via `aria-current` + class | Pass |
| Reduced motion | Pass (`animation-duration` ≈ 0.01ms) |
| 200% zoom (page scale 2) | Pass — no required H-scroll at 768 |
| Horizontal overflow | Pass at verified viewports |

## Performance

- TaskPathways is a **Server Component** (no new client island for pathways)  
- Masthead remains the existing client chrome surface (focus/Escape/scroll)  
- No new third-party libraries  
- Modest CSS only; no additional hero imagery  

## After interaction counts

| Task | Desktop | Mobile |
|------|---------|--------|
| Book consultation | **1** (hero or masthead) | **1** (hero) or **2** (nav) |
| Browse remedies | **1** (hero quiet / pathway / nav) | **1** (hero) or **2** |
| Explore programmes | **1** | **1** or **2** |
| Find Duʿa & Dhikr | **1** (hero quiet / pathway / mobile task) | **1** or **2** |
| Explore the Institute | **1** (pathway / masthead) | **1** or **2** |

## Quality (this phase)

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | Pass |
| `node --import tsx --test tests/ux/*.ts` | Pass (7/7) |
| Route HTTP smokes | 200 on `/`, `/da`, `/dk`, consultations, apothecary, academy, dua-dhikr, institute |
| `npm run build` | Pass |
| Changed-file ESLint via external temp config | **0 errors** (config at `/Users/nikmaljabarzai/Desktop/sr-eslint-next16-temp.config.mjs`) |
| Full-repo lint | **Known debt** — do not claim pass (~170 errors / 172 warnings) |

## Scope boundary — not performed

- Consultation booking-flow redesign  
- Academy programme-page restructuring / application redesign  
- Apothecary catalogue or checkout redesign  
- Sacred Journeys registration redesign  
- Broad Danish CMS translation  
- New analytics implementation  
- Visual rebranding  

## Deferred

- Commit / push / PR  
- Full-repo lint remediation  
- Editorial DA CMS body gaps  
- Soft HTTP 200 on `notFound()` under `[locale]` (ADR-017)  
