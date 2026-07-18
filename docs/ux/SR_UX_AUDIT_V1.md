# Sunnah Remedies UX Audit V1 — Baseline

**Worktree:** `/Users/nikmaljabarzai/Desktop/sunnah-remedies-ux`  
**Branch:** `feat/sr-comprehensive-ux-improvement` (from `origin/main` @ `c82bdb6`)  
**Social-sharing tree:** untouched at `feat/premium-social-sharing-preview` @ `baa538f`  
**Audit date:** 18 July 2026  
**Dev server:** `http://localhost:3010`  
**Method:** Architecture review + HTTP probe of principal routes + browser snapshots (EN + DA)  
**Scope gate:** Baseline only. Broad P1/P2/visual implementation paused pending approval. Only P0 fixture/test/misleading-content containment authorised before this report.

---

## Executive verdict

The site’s institutional visual system is intact and distinctive. The urgent baseline problems are **task clarity**, **Danish chrome parity**, **booking resilience**, and **Duʿa & Dhikr publication honesty** — not a redesign.

One genuine **production-fixture P0** (Apothecary verification product) was found in the public catalogue and has been **contained** in this worktree. No further implementation should proceed until this audit is approved.

---

## P0 — Fixture / unsafe / misleading content

| ID | Finding | Evidence | Status |
|----|---------|----------|--------|
| **F1** | Sanity product **“Apothecary Verification Product — Do Not Buy”** appeared in the public catalogue and was purchasable-affordance adjacent (“Proceed to the counter” / “Add to counter” copy paths) | Prior live catalogue listing; product page itself stated it must not appear publicly | **Contained** — public product guard + GROQ exclusions; catalogue shows **4 remedies** only (Black Seed Oil, Honey, Senna, Olive Oil); direct fixture slug serves institutional not-found body (HTTP still 200 soft-404; “Add to counter” may appear in shared chrome, not as a buyable product); no “Do Not Buy” in catalogue HTML |
| **F2** | Duʿa & Dhikr **dev-preview** route serves synthetic `[ARABIC FIXTURE]` content under `next dev` | `GET /knowledge-library/dua-dhikr/dev-preview` → 200 with fixtures in development | **Acceptable for local QA** — production `NODE_ENV === "production"` calls `notFound()`; `noindex`; **not linked** from public UI. Risk only if a public host runs `next dev` |
| **F3** | Duʿa landing presents ~**40 clickable collections**, nearly all labelled **“Preparing for publication”** | Browser a11y tree on `/knowledge-library/dua-dhikr`; empty collection pages show honest empty-state copy (not blank) | **Open P0 (misleading IA)** — not fake religious text, but unpublished material appears as a fully stocked, navigable library. **Needs approval** before containment (e.g. non-link / in-preparation treatment for zero-entry collections) |
| **F4** | Morning Dhikr quick access says “Preparing for publication” while `/knowledge/dhikr/morning` serves substantial Arabic with many “pending review” markers | Browser + HTTP | **Open P0/P1** — status labelling contradicts available content; dual routes (`/knowledge/dhikr/morning` vs collection cards) confuse availability |

No other `Do Not Buy`, `FIXTURE`, `NOT FOR PUBLICATION`, or `[TEST DATA]` strings were found on public catalogue, monographs, counter, morning/evening dhikr, academy, journeys, or correspondence pages in this pass.

---

## Cross-cutting findings (non-fixture)

| ID | Sev | Finding | Routes |
|----|-----|---------|--------|
| **X1** | P0 | Unprefixed EN and `/dk` routes 404 without rewrite layer (Next 16 middleware/proxy unreliable for `as-needed`) | Global |
| **X2** | P0 | Homepage CTA historically only “Enter the institution” — weak task clarity for clinical/commerce/academy/dhikr visitors | `/` |
| **X3** | P0 | Danish chrome/nav/footer largely **English** while body may be Danish (`The Apothecary`, `Clinical Consultations`, `Request a consultation`, `Daily reflection`, language switcher still labelled “Dansk” while already on DA) | `/dk`, `/dk/*` |
| **X4** | P0 | Booking validation / mobile CTA historically hardcoded English; progressive disclosure without clear progress | `/consultations` |
| **X5** | P1 | Mobile nav: dhikr buried; focus trap / Escape incomplete historically | Global |
| **X6** | P1 | Breadcrumbs: Title-Case English slugs; “Dk” crumb on `/dk`; home label inconsistency | Global |
| **X7** | P1 | Correspondence page is mailto-only despite “write” framing; homepage has email capture | `/correspondence` |
| **X8** | P1 | Academy / Apothecary long pages; operational dates; purchase vs monograph clarity | Academy, Apothecary |
| **X9** | P2 | `EST. ———` placeholder eyebrow; missing brand image assets (`/brand/lockup-*.svg`, hero photography 404 in this worktree) | `/`, chrome |
| **X10** | P2 | Duplicate heading patterns on some department landings; footer key warnings historically | Various |
| **X11** | P2 | Sacred Journeys: multiple parallel CTAs without one preferred next step | `/sacred-journeys` |

---

## Route-by-route baseline

### Homepage `/` — Clinical / all visitors
- **Question:** What is this, and what can I do?
- **Primary CTA:** Enter the institution (+ task pathways present in current worktree)
- **Issues:** Task clarity (X2); placeholder `EST. ———` (X9); missing images in this worktree
- **Sev:** P0 task clarity · P2 assets

### Global nav / mobile / footer / language
- **EN:** Departments + Clinical Consultations accent — clear institutional IA, weak task verbs
- **DA `/dk`:** Body Danish; **masthead/footer English** (X3) — fails bilingual parity
- **Mobile:** Navigation control present; full a11y not re-verified this pass
- **Sev:** P0 i18n chrome

### Consultations `/consultations`
- **Visitor:** Clinical patient
- **Primary task:** Book Hijama with gender-appropriate pathway
- **Observed:** Hero “Book Your Hijama Session”; practitioner gender; summary panel; progress chrome in current worktree
- **Issues:** Historically EN-only validation; payment timing / cancel expectations; resilience
- **Sev:** P0/P1

### Apothecary `/the-apothecary`, catalogue, monographs, counter
- **Catalogue (verified):** 4 real remedies; **no** Do Not Buy
- **Fixture slug:** not-found body (F1 contained)
- **Counter:** empty / commerce not configured — honest for now
- **Issues:** Monograph vs purchase clarity when commerce returns (P1)
- **Sev:** F1 contained · P1 commerce clarity

### Academy `/the-academy`, Hijāma Diploma
- **Diploma:** Fee, duration, intake visible; application affordance present
- **Issues:** Progressive disclosure / TOC / operational date primary wording (P1)
- **Sev:** P1

### Sacred Journeys landing + registration
- Interest / registration / programme paths all present
- **Issues:** Preferred primary action unclear (P2/P1)
- **Sev:** P1/P2

### Knowledge Library
- Articles readable; reading modes present
- **Issues:** Hub oversells Duʿa depth relative to publication state (ties F3)
- **Sev:** P1

### Duʿa & Dhikr landing + Morning / Evening / During Salah path
- Landing: search, quick access, browse, discovery, learning (learning correctly non-linked with notice)
- **F3/F4:** Mass “Preparing for publication” on active links; morning content exists with pending-review density
- Empty collections: honest empty-state paragraph (not blank)
- **Sev:** P0 misleading publication UX

### Correspondence / auth / 404
- Correspondence: mailto, no in-page form (P1)
- Sign-in: loads
- Unknown path: 404

### Danish `/dk` (+ sample subroutes)
- Hero/departments/tasks: Danish
- Chrome/nav/pre-footer/reflection: English leaks (X3)
- Breadcrumb shows “Dk”

---

## P0 containment already applied (this worktree only)

| Change | Purpose |
|--------|---------|
| `src/lib/commerce/public-product-guard.ts` | Deny-list verification/fixture products |
| `src/sanity/lib/queries.ts` / `fetch.ts` | Exclude from catalogue queries, by-slug, slugs/sitemap |
| `src/components/ui/Breadcrumb.tsx` | Do not title-case fixture slugs into breadcrumbs |
| `tests/ux/public-catalogue-guard.smoke.ts` | Guard regression smoke |
| `next.config.ts` rewrites | Restore EN unprefixed + `/dk` + dhikr routing (X1) — **infrastructure**, not visual redesign |

**Note:** Earlier conversation turns also left **uncommitted broader UX edits** (homepage task pathways, booking i18n/progress, masthead mobile a11y, academy header CTA, etc.). Those exceed the current “audit + P0 fixture containment only” authorisation. They remain in the working tree for your decision: keep, revert, or approve as Phase 2+.

---

## Recommended next phases (awaiting approval)

1. **Approve / adjust** F3–F4 Duʿa publication containment approach  
2. **Danish chrome parity** (X3) — CMS nav English vs i18n fallbacks  
3. **Homepage task clarity** (X2) — if prior TaskPathways retained  
4. **Booking journey hardening** (X4)  
5. Academy / Journeys / forms / a11y / performance / analytics per original brief  

---

## Explicit stop

- No commit, push, merge, or deploy performed.  
- No further P1/P2/visual implementation in this turn.  
- Awaiting approval of this baseline and direction on open P0s F3–F4 and on the broader uncommitted diff.
