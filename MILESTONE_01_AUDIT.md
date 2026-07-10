# MILESTONE_01_AUDIT.md

**Date:** 5 July 2026  
**Scope:** Audit Milestone 1 — *Repository, Tooling & Deployable Shell* (Phase A) against the current Sunnah Remedies v2.0 repository  
**Source documents:**
- `docs/Architecture/sunnah_execution_plan.docx` — Engineering Execution Plan v1.0
- `docs/Architecture/01–07.md` — **All empty (0 bytes).** No populated architecture markdown exists in this folder; Milestone 1 requirements are taken exclusively from the execution plan.

**Status:** Audit only — no code modified.

---

## Milestone 1 Summary (from Execution Plan)

| Field | Value |
|-------|-------|
| **Title** | Repository, Tooling & Deployable Shell |
| **Phase** | A · Foundation |
| **Complexity** | Medium |
| **Deployable outcome** | A live, branded holding page |
| **Prerequisites** | GitHub organisation, Vercel account, domain access, agreed Node version |

### Stated objectives

1. Initialise the Next.js 14 App Router project with TypeScript, TailwindCSS, ESLint, and Prettier.
2. Establish the `src/` structure from the folder blueprint (empty module directories with README stubs).
3. Wire CI (lint, type-check, build) and connect the repo to Vercel with preview + production environments.
4. Ship a minimal but branded holding page so production is live from day one.

### Stated acceptance criteria

1. A branded holding page is live in production.
2. Every push produces a preview; main deploys to production automatically.
3. The repository structure matches the folder blueprint.

---

## Overall Verdict

| Status | Count |
|--------|-------|
| ✅ Already complete | 8 |
| ⚠️ Partially complete | 11 |
| ❌ Missing | 14 |

**Interpretation:** The repository **far exceeds** Milestone 1 in functional scope (102 pages, Sanity CMS, commerce, operations, AI, portals). However, it **does not satisfy several literal Milestone 1 deliverables** as written in the execution plan — particularly the holding page, folder blueprint scaffold, CI pipeline, Prettier, and explicit type-check script. The project appears to have been built iteratively across Phases 1–9 without formal Milestone 1 gate compliance.

For the Enterprise Refactor, Milestone 1 should be treated as **partially satisfied at the tooling level** but **not satisfied at the process/scaffold level**. Remaining gaps are low-to-medium effort individually but must be reconciled with the decision to keep the current evolved structure vs. retroactively impose the execution-plan scaffold.

---

## Requirement-by-Requirement Audit

### A. Objectives

#### A1. Next.js App Router project

| Sub-requirement | Status | Evidence |
|-----------------|--------|----------|
| App Router (not Pages Router) | ✅ | `src/app/` only; no `pages/` directory |
| Next.js 14 | ⚠️ | `next@^16.2.10` in `package.json` — newer major version |
| TypeScript | ✅ | `typescript@^6.0.3`, strict `tsconfig.json`, `@/*` path alias |
| TailwindCSS | ⚠️ | `tailwindcss@^4.3.2` via `@tailwindcss/postcss`; configured in `src/app/globals.css` — no `tailwind.config.ts` as plan specifies |
| ESLint | ⚠️ | `eslint` + `eslint-config-next` in devDependencies; **no** `eslint.config.*` or `.eslintrc*`; `npm run lint` **fails** (`Invalid project directory provided, no such directory: …/lint`) |
| Prettier | ❌ | Not in `package.json`; no `.prettierrc` or `.prettierignore` |

**Notes:** Build succeeds (`npm run build` — verified). TypeScript compiles cleanly (`npx tsc --noEmit` — verified). Lint is broken and Prettier was never added.

---

#### A2. `src/` structure from folder blueprint

| Sub-requirement | Status | Evidence |
|-----------------|--------|----------|
| Module scaffold: `shop/`, `academy/`, `clinic/`, … | ❌ | No `src/shop/`, `src/academy/`, or `src/clinic/` directories |
| README stubs in each module | ❌ | Zero `README.md` files under `src/` |
| Structure matches folder blueprint | ❌ | Current layout is institution-first, not execution-plan modular |

**Current `src/` top-level (actual):**

```
src/app/          → routes ([locale], staff, studio, api, knowledge, feeds)
src/components/   → UI by department (apothecary, academy, journeys, …)
src/lib/          → utilities, content, commerce, auth, seo
src/sanity/       → CMS schemas, client, queries
src/modules/      → identity, membership, student, practitioner (Phase 9)
src/operations/   → Phase 8 back-office engine
src/ai/           → Phase 6 AI platform
src/i18n/         → next-intl routing
src/db/           → community Drizzle schema
src/context/      → CounterContext
```

**Execution plan expected (Milestone 1):**

```
src/shop/         → README.md stub
src/academy/      → README.md stub
src/clinic/       → README.md stub
… (further domain modules with README stubs)
```

**Notes:** `docs/Architecture/04-folder-structure.md` is empty, so the execution plan text is the only blueprint reference. The repo uses `src/lib/commerce/` and route-based departments (`the-apothecary`, `the-academy`, `consultations`) instead of top-level `shop/` / `clinic/` modules. This is a **structural divergence**, not merely incomplete scaffolding.

---

#### A3. CI and Vercel

| Sub-requirement | Status | Evidence |
|-----------------|--------|----------|
| GitHub repository | ✅ | `origin` → `https://github.com/luqman247/sunnah-remedies-v2.git` |
| CI workflow: lint | ❌ | No `.github/workflows/` directory |
| CI workflow: type-check | ❌ | No `type-check` script in `package.json`; no CI job |
| CI workflow: build | ❌ | Build works locally but not automated in CI |
| Vercel project linked | ✅ | `.vercel/repo.json` — project `sunnah-remedies-v2`, org linked |
| `vercel.json` configuration | ⚠️ | File exists as `{}` (empty) |
| Preview deployments on PR | ⚠️ | Vercel linked (typical default) but **not verified** in this audit; no CI to confirm |
| Production auto-deploy on main | ⚠️ | Assumed via Vercel Git integration; **not verified** in this audit |
| Agreed Node version documented | ❌ | No `engines` in `package.json`, no `.nvmrc`, no `.node-version` |

---

#### A4. Branded holding page

| Sub-requirement | Status | Evidence |
|-----------------|--------|----------|
| Minimal branded holding page | ❌ | No holding page; full Threshold homepage at `src/app/[locale]/page.tsx` (~380 lines) |
| `src/app/page.tsx` | ❌ | File does not exist; homepage is locale-wrapped |
| Production live from day one | ⚠️ | Full institutional site likely deployed via Vercel; exceeds holding page but **does not match M1 deliverable** |

**Notes:** The execution plan explicitly requires a *minimal* holding page for Milestone 1 deployability. The current homepage is a complete arrival sequence (Threshold hero, department cards, authority band, correspondence form, CMS integration). This is Milestone 5+ surface area, not Milestone 1.

---

### B. Files & Areas (Expected vs Actual)

| Expected file (execution plan) | Status | Actual |
|-------------------------------|--------|--------|
| `package.json` | ✅ | Present; evolved with 40+ dependencies |
| `tsconfig.json` | ✅ | Present; strict mode |
| `next.config.js` | ⚠️ | `next.config.ts` (TypeScript variant — acceptable) |
| `tailwind.config.ts` | ❌ | Not present; Tailwind v4 inline config |
| `.eslintrc` | ❌ | Not present |
| `.prettierrc` | ❌ | Not present |
| `src/app/layout.tsx` | ✅ | Present; CMS-driven metadata |
| `src/app/page.tsx` (holding) | ❌ | Not present |
| `src/` module scaffold + README stubs | ❌ | Not present |
| `.github/workflows/ci.yml` | ❌ | Not present |
| `vercel.json` | ⚠️ | Present but empty |
| `.env.example` | ✅ | Present (Sanity, auth, i18n, AI vars) |

---

### C. Testing Checklist

| Test | Status | Notes |
|------|--------|-------|
| CI runs lint, type-check, and build green on clean clone | ❌ | No CI; lint broken; no type-check script |
| Preview deployment on pull request | ⚠️ | Vercel linked; behaviour not verified in audit |
| Production on primary domain over HTTPS | ⚠️ | `.env.example` references `https://sunnahremedies.com`; deployment not verified |
| Lighthouse smoke on holding page, no console errors | ❌ | No holding page to test |

---

### D. Acceptance Criteria

| Criterion | Status | Notes |
|-----------|--------|-------|
| Branded holding page live in production | ❌ | Full site deployed instead; holding page never existed |
| Every push → preview; main → production | ⚠️ | Vercel integration likely provides this; no CI/CD config in repo to prove or enforce |
| Repository structure matches folder blueprint | ❌ | Structural divergence (see A2) |

---

## Missing Items — Detail

Each ❌ or critical ⚠️ gap is expanded below with cause, files, effort, and dependencies.

---

### M1. Prettier not configured

| Field | Detail |
|-------|--------|
| **Status** | ❌ Missing |
| **Why missing** | Never added during initial setup; project predates or skipped execution-plan tooling step |
| **Files involved** | `package.json` (add `prettier` devDependency + format script), `.prettierrc` or `prettier.config.mjs`, `.prettierignore`, optionally `.github/workflows/ci.yml` |
| **Estimated effort** | **Low** — 1–2 hours |
| **Dependencies** | None; should be done before CI to avoid formatting churn in later milestones |

---

### M2. ESLint not properly configured / lint script broken

| Field | Detail |
|-------|--------|
| **Status** | ❌ Missing (functional) |
| **Why missing** | `eslint-config-next` installed but no flat config file; `next lint` fails with directory error on Next.js 16 |
| **Files involved** | `eslint.config.mjs` (or `.eslintrc.json`), `package.json` (`lint` script may need adjustment), `.github/workflows/ci.yml` |
| **Estimated effort** | **Low** — 2–4 hours (config + fix any surfaced violations) |
| **Dependencies** | Should precede CI workflow; may surface lint debt across ~620 TS files |

---

### M3. No `type-check` npm script

| Field | Detail |
|-------|--------|
| **Status** | ❌ Missing |
| **Why missing** | TypeScript strict checking relies on implicit `next build`; no standalone `tsc --noEmit` script for CI |
| **Files involved** | `package.json` — add `"type-check": "tsc --noEmit"` |
| **Estimated effort** | **Low** — 15 minutes |
| **Dependencies** | None; `tsc --noEmit` already passes today |

---

### M4. No GitHub Actions CI pipeline

| Field | Detail |
|-------|--------|
| **Status** | ❌ Missing |
| **Why missing** | Project built with Vercel-only deploy; no `.github/workflows/` ever created |
| **Files involved** | `.github/workflows/ci.yml` (lint, type-check, build), optionally `package.json` scripts |
| **Estimated effort** | **Low–Medium** — 2–4 hours (workflow + fix lint if broken) |
| **Dependencies** | M2 (ESLint fix), M3 (type-check script); Node version pin (M10) recommended |

---

### M5. No `tailwind.config.ts` (execution plan format)

| Field | Detail |
|-------|--------|
| **Status** | ⚠️ Partially complete — Tailwind works via v4 PostCSS |
| **Why missing / different** | Project adopted Tailwind CSS v4 which uses `@import "tailwindcss"` in CSS instead of JS config |
| **Files involved** | `src/app/globals.css` (~3,600 lines), `postcss.config.mjs`; would need `tailwind.config.ts` only if reverting to v3 pattern or extending v4 theme file |
| **Estimated effort** | **Medium** — 4–8 hours if aligning to execution plan's `tailwind.config.ts` + token extension model (Milestone 2 territory) |
| **Dependencies** | Milestone 2 (Design System Tokens); decision needed: keep Tailwind v4 CSS-first or add config file per plan |

---

### M6. Folder blueprint module scaffold missing

| Field | Detail |
|-------|--------|
| **Status** | ❌ Missing |
| **Why missing** | Project evolved with institution-first routing (`src/app/[locale]/the-apothecary/`) and domain services in `src/lib/`, `src/modules/`, `src/operations/` instead of execution-plan `src/shop/`, `src/academy/`, `src/clinic/` |
| **Files involved** | Would require creating `src/shop/`, `src/academy/`, `src/clinic/`, `src/research/`, `src/membership/`, etc. each with `README.md` — **or** updating the execution plan / Architecture docs to reflect the actual structure |
| **Estimated effort** | **Low** (stub READMEs only) — 1–2 hours · **High** (full restructure to match plan) — 2–4 weeks |
| **Dependencies** | **Architecture decision:** retroactive scaffold vs. amend blueprint to match evolved layout. Recommend amending blueprint rather than moving 620 files |

---

### M7. No README stubs in module directories

| Field | Detail |
|-------|--------|
| **Status** | ❌ Missing |
| **Why missing** | Same as M6; no scaffold step performed |
| **Files involved** | `src/*/README.md` for each domain module per blueprint |
| **Estimated effort** | **Low** — 1 hour (documentation-only stubs) |
| **Dependencies** | M6 architecture decision on which directories qualify as "modules" |

---

### M8. Branded holding page (`src/app/page.tsx`)

| Field | Detail |
|-------|--------|
| **Status** | ❌ Missing (as specified) |
| **Why missing** | Project jumped directly to full Threshold homepage; holding page was never shipped |
| **Files involved** | Would be `src/app/page.tsx` — currently absent; homepage is `src/app/[locale]/page.tsx` |
| **Estimated effort** | **N/A for greenfield** · **Not recommended** to revert full site to holding page |
| **Dependencies** | **Architecture decision:** Mark M1 holding-page criterion as superseded by existing production site, or create a `/holding` route for compliance testing only |

---

### M9. `vercel.json` empty

| Field | Detail |
|-------|--------|
| **Status** | ⚠️ Partially complete |
| **Why missing** | File created as placeholder `{}`; no headers, redirects, or build config added |
| **Files involved** | `vercel.json` |
| **Estimated effort** | **Low** — 1–2 hours (headers, regions, cron config as needed) |
| **Dependencies** | Milestone 1 CI (M4); may overlap with Milestone 12 SEO redirects |

---

### M10. No agreed Node version documented

| Field | Detail |
|-------|--------|
| **Status** | ❌ Missing |
| **Why missing** | Prerequisites mention "agreed Node version" but never codified in repo |
| **Files involved** | `package.json` (`engines.node`), `.nvmrc`, or `.node-version`; CI workflow `node-version` |
| **Estimated effort** | **Low** — 30 minutes |
| **Dependencies** | M4 (CI); team agreement on LTS version (recommend Node 20 or 22) |

---

### M11. CI lint + type-check + build green (composite)

| Field | Detail |
|-------|--------|
| **Status** | ❌ Missing |
| **Why missing** | No CI (M4); lint broken (M2); no type-check script (M3) |
| **Files involved** | `.github/workflows/ci.yml`, `package.json`, `eslint.config.mjs` |
| **Estimated effort** | **Medium** — 4–8 hours including lint fix pass |
| **Dependencies** | M2, M3, M4, M10 |

---

### M12. Preview / production deploy verification

| Field | Detail |
|-------|--------|
| **Status** | ⚠️ Partially complete |
| **Why missing** | Vercel project linked locally (`.vercel/repo.json`) but no repo config documenting or enforcing preview/production behaviour; not verified in this audit |
| **Files involved** | Vercel dashboard (external), optionally `vercel.json`, GitHub branch protection rules |
| **Estimated effort** | **Low** — 1 hour verification · **Medium** if branch protection + required checks needed |
| **Dependencies** | M4 (CI checks as deploy gates) |

---

### M13. Lighthouse smoke on holding page

| Field | Detail |
|-------|--------|
| **Status** | ❌ Missing |
| **Why missing** | No holding page (M8); no Lighthouse CI step |
| **Files involved** | `.github/workflows/ci.yml` (optional Lighthouse action), or manual runbook |
| **Estimated effort** | **Low** — 2 hours for CI integration |
| **Dependencies** | M8 decision (holding page vs. homepage as smoke target); M4 |

---

### M14. Architecture markdown documents empty

| Field | Detail |
|-------|--------|
| **Status** | ❌ Missing |
| **Why missing** | `docs/Architecture/01–07.md` created as 0-byte placeholders; content not migrated from execution plan or `.docx` |
| **Files involved** | `docs/Architecture/01-vision.md` through `07-development-standards.md`, `04-folder-structure.md` (defines blueprint referenced by M1) |
| **Estimated effort** | **Medium** — 1–2 days to populate from execution plan + existing Phase docs |
| **Dependencies** | Should precede or run parallel to M6 decision; blocks authoritative folder-blueprint comparison |

---

## Already Complete — Summary

| Item | Evidence |
|------|----------|
| Next.js App Router | `src/app/` structure |
| TypeScript strict mode | `tsconfig.json` |
| Production build | `npm run build` succeeds |
| Root layout | `src/app/layout.tsx` |
| Path alias `@/*` | `tsconfig.json` |
| GitHub remote | `github.com/luqman247/sunnah-remedies-v2` |
| Vercel project link | `.vercel/repo.json` |
| Environment template | `.env.example`, `.env.local.example` |
| PostCSS + Tailwind v4 pipeline | `postcss.config.mjs`, `globals.css` |

---

## Partially Complete — Summary

| Item | Gap |
|------|-----|
| Next.js version | Plan says 14; repo on 16 |
| TailwindCSS | Works via v4 CSS; no `tailwind.config.ts` |
| ESLint | Dependency present; not functional |
| Vercel deploy | Linked; no repo config; not verified |
| Production live | Full site, not holding page |
| `vercel.json` | Exists but empty |
| `next.config` | `.ts` not `.js` (acceptable) |
| Preview on PR | Assumed via Vercel; unverified |

---

## Recommended Actions Before Milestone 2

The execution plan states Milestone 2 (*Design System Tokens & Typography*) depends on Milestone 1. Given the repo's evolved state, recommended minimum closure of M1 gaps:

| Priority | Action | Effort |
|----------|--------|--------|
| P0 | Fix ESLint + add `eslint.config.mjs` | Low |
| P0 | Add `type-check` script + GitHub Actions CI (lint, type-check, build) | Low–Medium |
| P0 | Pin Node version (`.nvmrc` + `engines`) | Low |
| P1 | Add Prettier + format check in CI | Low |
| P1 | Populate `docs/Architecture/04-folder-structure.md` documenting **actual** structure (or amend blueprint) | Medium |
| P2 | Decide: holding page criterion superseded vs. `/holding` route | Decision |
| P2 | Add README stubs to existing domain dirs (`src/lib/commerce/`, `src/modules/`, etc.) if documentation scaffold required | Low |
| P3 | Enrich `vercel.json` | Low |

**Do not recommend:** Reverting the full homepage to a holding page, or restructuring 620 files into `src/shop/` without an explicit architecture amendment.

---

## Milestone 1 Gate Scorecard

| Category | Score |
|----------|-------|
| **Tooling foundation** | 70% — TS, build, Tailwind work; lint/Prettier/CI missing |
| **Deployability** | 85% — Vercel linked, build green; no CI enforcement |
| **Scaffold / blueprint** | 15% — Structure diverged; no README stubs |
| **Holding page deliverable** | 0% — Never implemented as specified |
| **Overall M1 compliance** | **⚠️ Partially complete** |

---

## Document References

| Document | Path | Status |
|----------|------|--------|
| Engineering Execution Plan | `docs/Architecture/sunnah_execution_plan.docx` | Populated |
| Vision | `docs/Architecture/01-vision.md` | Empty |
| System Architecture | `docs/Architecture/02-system-architecture.md` | Empty |
| Content Model | `docs/Architecture/03-content-model.md` | Empty |
| Folder Structure | `docs/Architecture/04-folder-structure.md` | Empty |
| Components | `docs/Architecture/05-components.md` | Empty |
| Roadmap | `docs/Architecture/06-roadmap.md` | Empty |
| Development Standards | `docs/Architecture/07-development-standards.md` | Empty |
| Prior audit | `PROJECT_AUDIT.md` | Populated (Phase 1 enterprise audit) |

---

*End of Milestone 1 audit. No code was modified.*
