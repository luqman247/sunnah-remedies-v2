# MILESTONE_02_AUDIT.md

**Date:** 5 July 2026  
**Scope:** Audit Milestone 2 — *Design System Tokens & Typography* (Phase A) against the current Sunnah Remedies v2.0 repository  
**Source documents:**
- `docs/Architecture/sunnah_execution_plan.docx` — Engineering Execution Plan v1.0
- `docs/Architecture/01–07.md` — **All empty (0 bytes).** Requirements taken from the execution plan and cross-referenced with `docs/Phase 1/Sunnah-Remedies-Design-Manual.md` and existing token files.

**Prerequisite status:** Milestone 1 CI/preview work completed (`m1-ci-complete`). Other M1 gaps (holding page, folder blueprint) remain; they do not block token work but are noted below.

**Status:** Audit only — no code modified.

---

## Milestone 2 Summary (from Execution Plan)

| Field | Value |
|-------|-------|
| **Title** | Design System Tokens & Typography |
| **Phase** | A · Foundation |
| **Complexity** | Medium |
| **Deployable outcome** | Holding page plus internal style guide |
| **Prerequisites** | Milestone 1; licensed/hosted fonts; brand token values confirmed |

### Stated objectives

1. Encode the brand as design tokens: colour (deep clinical green `#0A2B21` anchor, brass accent), spacing, radius, shadow, and the type ramp.
2. Configure the five-typeface system (**Fraunces, Newsreader, IBM Plex Mono, Amiri, Reem Kufi**) with correct loading and fallbacks.
3. Expose tokens through **Tailwind theme extension** so no component hardcodes a raw value.
4. Document the tokens in a **living style reference route**.

### Expected files (execution plan)

| Planned path | Purpose |
|--------------|---------|
| `tailwind.config.ts` | Tailwind theme extension |
| `src/styles/tokens.css` | Token definitions |
| `src/styles/globals.css` | Global styles |
| `src/app/fonts.ts` | Centralised `next/font` configuration |
| `src/config/theme.ts` | Typed theme export |
| `src/app/(internal)/style-guide/page.tsx` | Token reference UI |

### Testing checklist

| Test | Status |
|------|--------|
| All fonts load with correct weights; Arabic (Amiri/Reem Kufi) renders RTL-safe | ⚠️ Partial |
| No layout shift from font loading (`font-display` verified) | ✅ |
| Tokens resolve in both light surfaces and dark sections | ⚠️ Partial |
| Style-guide route displays full palette, ramp, and spacing scale | ❌ |

### Acceptance criteria

| Criterion | Status |
|-----------|--------|
| Every colour, space, and type value is available as a token | ⚠️ Partial |
| The style-guide route is the single visual source of truth | ❌ |
| Arabic typography renders correctly | ⚠️ Partial |

---

## Overall Verdict

| Status | Count |
|--------|-------|
| ✅ Already complete | 9 |
| ⚠️ Partially complete | 12 |
| ❌ Missing | 7 |

**Interpretation:** The institution has a **mature, production-grade visual system** built through Phases 1–3 (3,600+ lines of `globals.css`, semantic type classes, four Google fonts, dark theme). It **does not match** the execution plan’s Milestone 2 structure: no style guide, no Tailwind theme bridge, no Reem Kufi, duplicated font setup, and **three divergent colour sources** (`globals.css`, `lib/tokens.ts`, `lib/brand.ts`). Staff/ops surfaces heavily hardcode `#0E3B2E` instead of tokens.

**Milestone 2 gate score: ⚠️ Partially complete (~55%)**

---

## Requirement-by-Requirement Audit

### O1. Colour tokens (anchor `#0A2B21`, brass accent)

| Sub-requirement | Status | Evidence |
|-----------------|--------|----------|
| Deep clinical green `#0A2B21` as anchor | ⚠️ | Execution plan specifies `#0A2B21`. Codebase uses **`#0E3B2E`** (`src/lib/brand.ts`), **`#232A1E` / `--sage-deep`** (`globals.css`), and `#0A2B21` only in email templates (`src/operations/email/service/resend.ts`). |
| Brass accent token | ⚠️ | `--brass` / `--gilt` in `globals.css` (`#9A7B4F`); `brandColors.antiqueGold` = `#C7A25A`; `lib/tokens.ts` `gilt` = `#96763F`. Three values. |
| Full palette as tokens | ⚠️ | `:root` block in `src/app/globals.css` (lines 3–73) defines paper, ink, sage, brass, rule, oxblood, etc. |
| Dark-mode token overrides | ✅ | `[data-theme="dark"]` block in `globals.css` (lines 76–95) |
| Single source of truth | ❌ | Parallel definitions in `globals.css`, `src/lib/tokens.ts`, `src/lib/brand.ts` with **different hex values** |

---

### O2. Spacing, radius, shadow tokens

| Sub-requirement | Status | Evidence |
|-----------------|--------|----------|
| Spacing scale | ✅ | Legacy `--s1`–`--s8` and 8px-base `--space-1`–`--space-20` in `globals.css`; duplicate subset in `lib/tokens.ts` |
| Radius | ⚠️ | `--radius: 2px` in `globals.css` only; not in `lib/tokens.ts` or Tailwind theme |
| Shadow / elevation | ⚠️ | `--elevation-masthead` only; ad-hoc `box-shadow` in component CSS; **no shadow token scale** as plan implies |
| Type ramp | ✅ | `.type-display-xl` through `.type-micro`, `.type-arabic` in `globals.css` (lines 144–237) |

---

### O3. Five-typeface system

| Font | Status | Evidence |
|------|--------|----------|
| Fraunces (display) | ✅ | `next/font/google` in `src/app/[locale]/layout.tsx`, `(staff)/layout.tsx` → `--font-display` |
| Newsreader (body) | ✅ | → `--font-body` |
| IBM Plex Mono (utility) | ✅ | → `--font-utility` |
| Amiri (Arabic) | ✅ | → `--font-arabic`; used in `.type-arabic`, revelation, arrival, department components |
| **Reem Kufi** | ❌ | **Not loaded anywhere** in the codebase |
| Centralised `fonts.ts` | ❌ | Font config **duplicated** across `[locale]/layout.tsx` and `(staff)/layout.tsx`; no `src/app/fonts.ts` |
| `font-display: swap` | ✅ | All four font loaders use `display: "swap"` |
| Fallback stacks | ✅ | CSS fallbacks: Georgia, system-ui, `"Noto Naskh Arabic"`, monospace |

---

### O4. Tailwind theme extension

| Sub-requirement | Status | Evidence |
|-----------------|--------|----------|
| `tailwind.config.ts` with theme extension | ❌ | Not present; project uses **Tailwind CSS v4** via `@import "tailwindcss"` in `globals.css` |
| `@theme` directive bridging CSS vars to Tailwind | ❌ | No `@theme` block in `globals.css` |
| Components consume tokens, not raw values | ❌ | Public site mostly uses CSS vars and utility classes; **staff/ops pages** use extensive hardcoded Tailwind arbitrary values (`text-[#0E3B2E]`, `bg-[#F6F3EE]`) across 10+ files |
| Tailwind utility access to design tokens | ⚠️ | Tailwind present but tokens live as CSS custom properties + semantic classes, not as `theme.extend` |

---

### O5. Style reference route

| Sub-requirement | Status | Evidence |
|-----------------|--------|----------|
| `src/app/(internal)/style-guide/page.tsx` | ❌ | Route group `(internal)` does not exist |
| Living style guide as visual source of truth | ❌ | Closest artefacts: `docs/Phase 1/Sunnah-Remedies-Design-Manual.md` (markdown, not renderable route) and scattered CSS |
| Component gallery (Milestone 3 overlap) | ❌ | Not in M2 scope but noted — no internal gallery |

---

### O6. Expected file paths vs actual

| Planned | Actual | Status |
|---------|--------|--------|
| `tailwind.config.ts` | Absent; `postcss.config.mjs` + inline Tailwind v4 | ⚠️ |
| `src/styles/tokens.css` | Absent; tokens inline in `src/app/globals.css` | ⚠️ |
| `src/styles/globals.css` | `src/app/globals.css` | ⚠️ (different path, functionally present) |
| `src/app/fonts.ts` | Font loaders inline in layouts | ❌ |
| `src/config/theme.ts` | Absent; partial `src/lib/tokens.ts` + `src/lib/brand.ts` | ❌ |
| `src/app/(internal)/style-guide/page.tsx` | Absent | ❌ |

---

## Testing Checklist — Detail

### Fonts load; Arabic RTL-safe

**⚠️ Partially complete**

- Amiri loads with `subsets: ["arabic", "latin"]`; RTL via `dir="rtl"` on homepage, revelation, department cards, portable text.
- Reem Kufi missing — execution plan expects both Amiri and Reem Kufi for Arabic typography.
- `[locale]/layout.tsx` sets `dir={cfg.dir}` on `<html>` for locale-aware direction (en/da LTR).

### No layout shift from font loading

**✅ Complete**

- All `next/font` instances use `display: "swap"`.

### Tokens in light and dark sections

**⚠️ Partially complete**

- Light: `:root` tokens drive public site.
- Dark: `[data-theme="dark"]` overrides exist; `ThemeToggle` in masthead.
- Staff layout uses hardcoded `#F6F3EE` background, not `--paper` token.
- Inconsistency between surfaces.

### Style guide displays palette, ramp, spacing

**❌ Missing**

- No route to verify visually.

---

## Already Complete — Summary

| Item | Location |
|------|----------|
| Four Google fonts (Fraunces, Newsreader, IBM Plex Mono, Amiri) | `src/app/[locale]/layout.tsx`, `src/app/(staff)/layout.tsx` |
| `font-display: swap` on all fonts | Same files |
| CSS custom property palette | `src/app/globals.css` `:root` |
| Dark theme token overrides | `src/app/globals.css` `[data-theme="dark"]` |
| Semantic type ramp (display → micro) | `src/app/globals.css` `.type-*` classes |
| Arabic typography class + RTL usage | `.type-arabic`, revelation, arrival, editorial |
| Spacing tokens (dual scale) | `globals.css` `--s*` and `--space-*` |
| Radius token | `--radius: 2px` |
| Motion tokens | `--ease`, `--duration-*` in CSS; `lib/tokens.ts` motion export |
| Brand asset catalogue | `src/lib/brand.ts` |
| Partial TS token export | `src/lib/tokens.ts` |

---

## Partially Complete — Summary

| Item | Gap |
|------|-----|
| Anchor green `#0A2B21` | Codebase uses `#0E3B2E` / sage palette instead |
| Brass accent | Three different gold/brass hex values across files |
| Token single source | `globals.css` vs `lib/tokens.ts` vs `lib/brand.ts` diverge |
| Five-font system | Reem Kufi absent |
| Font configuration | Duplicated in two layouts; no `fonts.ts` |
| Tailwind integration | v4 CSS-first; no `@theme` / `tailwind.config.ts` |
| No raw values in components | Staff ops + handbook pages hardcode hex extensively |
| Shadow tokens | No systematic elevation scale |
| `lib/tokens.ts` adoption | Imported in ~6 files only; CSS vars dominate |
| Dark/light consistency | Staff surfaces bypass token system |
| Milestone 1 prerequisite | CI complete; holding page still absent |

---

## Missing — Detail

For each ❌ item: why missing, files involved, estimated effort, dependencies.

---

### M2-1. Style guide route

| Field | Detail |
|-------|--------|
| **Status** | ❌ Missing |
| **Why missing** | Project built full institutional UI directly; no internal reference route was created |
| **Files involved** | Create `src/app/(internal)/style-guide/page.tsx`, optional `(internal)/layout.tsx`; wire colour swatches, type specimens, spacing scale from tokens |
| **Estimated effort** | **Medium** — 1–2 days |
| **Dependencies** | Token consolidation (M2-3) recommended first so guide reflects one source |

---

### M2-2. Reem Kufi typeface

| Field | Detail |
|-------|--------|
| **Status** | ❌ Missing |
| **Why missing** | Implementation used Amiri only; Reem Kufi never added to font loaders |
| **Files involved** | `src/app/fonts.ts` (new) or `src/app/[locale]/layout.tsx`, `(staff)/layout.tsx`; CSS assigning `--font-arabic-display` or similar; `.type-arabic` rules in `globals.css` |
| **Estimated effort** | **Low** — 2–4 hours |
| **Dependencies** | Design decision: Reem Kufi role vs Amiri (display Arabic vs body Arabic per design manual §20) |

---

### M2-3. Centralised theme module (`src/config/theme.ts`)

| Field | Detail |
|-------|--------|
| **Status** | ❌ Missing |
| **Why missing** | Tokens evolved organically in CSS; `lib/tokens.ts` is a partial export, not authoritative |
| **Files involved** | Create `src/config/theme.ts`; reconcile with `globals.css` `:root`; deprecate duplicate values in `lib/tokens.ts` / hardcoded staff colours |
| **Estimated effort** | **Medium** — 1 day |
| **Dependencies** | Agreement on canonical hex values (`#0A2B21` vs `#0E3B2E` vs Design Manual Edition I palette) |

---

### M2-4. Centralised `src/app/fonts.ts`

| Field | Detail |
|-------|--------|
| **Status** | ❌ Missing |
| **Why missing** | Fonts inlined when locale and staff layouts were built separately |
| **Files involved** | Create `src/app/fonts.ts`; refactor `[locale]/layout.tsx`, `(staff)/layout.tsx` to import shared font variables |
| **Estimated effort** | **Low** — 2–3 hours |
| **Dependencies** | M2-2 (add Reem Kufi in one place) |

---

### M2-5. Tailwind theme extension (`tailwind.config.ts` or `@theme`)

| Field | Detail |
|-------|--------|
| **Status** | ❌ Missing |
| **Why missing** | Tailwind v4 adopted with CSS-first config; execution plan written for v3 `tailwind.config.ts` pattern |
| **Files involved** | Add `@theme { ... }` block in `globals.css` **or** `tailwind.config.ts`; map `--paper`, `--ink`, `--gilt`, spacing, fonts to Tailwind utilities |
| **Estimated effort** | **Medium** — 4–8 hours |
| **Dependencies** | M2-3 token consolidation; decision on Tailwind v4 `@theme` vs legacy config |

---

### M2-6. `src/styles/tokens.css` (separate token layer)

| Field | Detail |
|-------|--------|
| **Status** | ❌ Missing (as specified) |
| **Why missing** | Tokens merged into monolithic `globals.css` during Phase 1–3 build |
| **Files involved** | Extract `:root` and `[data-theme="dark"]` from `globals.css` → `src/styles/tokens.css`; import from `globals.css` |
| **Estimated effort** | **Low** — 2–4 hours (refactor only) |
| **Dependencies** | M2-3; optional but improves maintainability |

---

### M2-7. No hardcoded raw values in components

| Field | Detail |
|-------|--------|
| **Status** | ❌ Missing (acceptance intent) |
| **Why missing** | Staff/ops surfaces built quickly with arbitrary Tailwind hex; public site mostly compliant via CSS classes |
| **Files involved** | `src/app/(staff)/ops/**/*.tsx`, `handbook/**/*.tsx`, `sign-in/page.tsx`, `(staff)/layout.tsx`, `PaymentForm.tsx`, `BotanicalFigure.tsx` — replace `#0E3B2E`, `#F6F3EE` with token utilities |
| **Estimated effort** | **Medium** — 1–2 days |
| **Dependencies** | M2-5 Tailwind theme bridge so `text-myrtle`, `bg-paper` etc. exist |

---

## Colour Source Divergence (Critical Finding)

Three authoritative-ish sources disagree:

| Token concept | `globals.css` | `lib/tokens.ts` | `lib/brand.ts` | Execution plan |
|---------------|---------------|-----------------|----------------|----------------|
| Green anchor | `--sage-deep: #232A1E` | `myrtleDeep: #182219` | `deepEmerald: #0E3B2E` | `#0A2B21` |
| Gold/brass | `--brass: #9A7B4F` | `gilt: #96763F` | `antiqueGold: #C7A25A` | brass accent |
| Paper | `--paper: #ECE6D8` | `paper: #ECE6D6` | `warmIvory: #F6F3EE` | — |

**Recommendation for Milestone 2 implementation:** Pick one canonical module (`src/config/theme.ts` + CSS `:root` generated from it) aligned with `Sunnah-Remedies-Design-Manual.md` Edition I values, then migrate staff hardcoded colours.

---

## Comparison with Design Manual (Phase 1)

The execution plan anchor `#0A2B21` aligns with email templates and differs from the **institutional rebuild palette** documented in `CURSOR-INSTITUTIONAL-REBUILD.md` and `lib/brand.ts` (`#0E3B2E` Deep Emerald). The live site uses **Edition I** tokens in `globals.css` (sage/myrtle family), not the execution plan’s `#0A2B21`.

This is an **architecture conflict** to resolve before closing Milestone 2:

| Document | Green anchor |
|----------|--------------|
| Execution plan M2 | `#0A2B21` |
| `lib/brand.ts` | `#0E3B2E` |
| `globals.css` | `#232A1E` (sage-deep) |
| Design Manual Edition I | `#1E2A22` (myrtle) via `lib/tokens.ts` |

---

## Milestone 2 Gate Scorecard

| Category | Score | Notes |
|----------|-------|-------|
| Colour tokens | 60% | Present but fragmented and conflicting |
| Spacing / radius | 75% | Present; radius minimal; no shadow scale |
| Typography / fonts | 70% | 4/5 fonts; type ramp strong; Reem Kufi missing |
| Tailwind integration | 25% | Tailwind installed; no theme bridge |
| Style guide | 0% | Route absent |
| No hardcoded values | 40% | Public site good; staff ops poor |
| **Overall M2** | **~55%** | **⚠️ Partially complete** |

---

## Recommended Implementation Order (When Ready)

| Priority | Task | Closes |
|----------|------|--------|
| P0 | Resolve canonical palette (execution plan vs Design Manual vs live CSS) | M2-3 |
| P0 | Create `src/app/fonts.ts` + add Reem Kufi | M2-2, M2-4 |
| P1 | Consolidate `src/config/theme.ts` + sync `:root` | M2-3, M2-6 |
| P1 | Add `@theme` / Tailwind token bridge | M2-5 |
| P1 | Build `(internal)/style-guide` route | M2-1 |
| P2 | Refactor staff hardcoded hex to tokens | M2-7 |
| P2 | Extract `tokens.css` from `globals.css` | M2-6 |

---

## Document References

| Document | Path | Relevance |
|----------|------|-----------|
| Engineering Execution Plan | `docs/Architecture/sunnah_execution_plan.docx` | Milestone 2 definition |
| Design Manual Edition I | `docs/Phase 1/Sunnah-Remedies-Design-Manual.md` | Binding colour/type values |
| Live tokens (CSS) | `src/app/globals.css` | Primary runtime tokens |
| Live tokens (TS) | `src/lib/tokens.ts` | Partial export |
| Brand colours | `src/lib/brand.ts` | Marketing hex constants |
| Milestone 1 audit | `MILESTONE_01_AUDIT.md` | Prerequisite status |

---

*End of Milestone 2 audit. No code was modified.*
