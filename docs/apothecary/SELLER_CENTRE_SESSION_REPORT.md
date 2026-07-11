# Apothecary Seller Centre — Session Report

**Branch:** `feature/apothecary-product-manager`  
**Date:** 11 July 2026  
**Scope:** Secure draft preview, Seller Centre Phases 2–10 / Milestones 1–3 (partial), guided Add Product journey  

This document summarises everything implemented, verified, blocked, and left open in this workstream. It is the narrative companion to `SELLER_CENTRE_GUIDE.md` and `PHASE9_DELIVERABLES.md`.

---

## 1. Purpose

Build a calm, Amazon-Seller-Central-style **Apothecary Seller Centre** on canonical Sanity Product documents so editors can:

1. Add products through a guided wizard  
2. Upload images and video  
3. Generate AI copy (review-required)  
4. Set price and availability  
5. Preview drafts securely without publishing  
6. Publish only when ready  

Sanity remains the single source of truth. The Advanced Editor is retained for scholarship and specialist fields. The public Apothecary was not redesigned.

---

## 2. Release path (agreed)

Do **not** merge to `main` until the simple routine has been personally completed **without** the Advanced Editor:

```
Add Product → upload images/video → generate description → enter price → preview → publish
```

After all three milestones pass:

```
feature/apothecary-product-manager
        ↓
enterprise-refactor
        ↓
Vercel Preview testing
        ↓
main
        ↓
production
```

---

## 3. What was built

### 3.1 Studio route

| Route | Purpose |
| --- | --- |
| `/studio/apothecary-manager` | Seller Centre home (first Studio tool) |
| `?add=1` | Add Product wizard |
| `?edit={documentId}` | Quick Edit |

### 3.2 Normal journey (current UX)

```
Seller Centre
  → Add Product
  → Details
  → Media
  → Generate Content
  → Price
  → Preview
```

- Step rail labels match that path  
- Continue buttons name the next step (e.g. “Continue to Media”)  
- Final step: **Preview Draft** is primary; Publish is secondary  
- Home lede states the same journey  

### 3.3 Screens

| Screen | Status |
| --- | --- |
| Dashboard (summary cards, search, filters, table, Actions) | Implemented |
| Add Product — Details | Implemented |
| Add Product — Media (images, gallery reorder, video, poster) | Implemented |
| Add Product — Generate Content (AI + Accept section / Accept all / Reject) | Implemented (needs AI env) |
| Add Product — Price | Implemented |
| Add Product — Preview | Implemented |
| Quick Edit (+ Save price, Replace Main Image, Unpublish, Archive) | Implemented |
| Advanced Settings → Open full Advanced Editor | Implemented |
| Resume Draft (row action → hydrate wizard from Sanity) | Implemented |

### 3.4 Draft preview (Phase 0–1)

Secure Draft Mode for Draft + Hidden products:

- `GET /api/draft` — secret → enable Draft Mode → redirect to monograph with `previewId`  
- `GET /api/draft/disable` — exit preview  
- Preview client uses `perspective: "drafts"`  
- Public GROQ stays published + visible only  
- **Preview Draft** from Seller Centre, Quick Edit, and document actions  
- Studio preview secret inlined via `next.config.ts` for client Studio bundle  

### 3.5 Seller Centre files

```
src/sanity/tools/seller-centre/
  index.tsx              — tool entry, view routing
  SellerHome.tsx         — dashboard, filters, Actions, Resume Draft
  AddProductWizard.tsx   — five-step guided workflow
  QuickEdit.tsx          — routine edits + Advanced Settings
  document.ts            — Sanity create/patch/publish/unpublish/hydrate/upload
  persistence.ts         — browser recovery of in-progress wizard
  utils.ts               — AI call, preview URL, labels, IDs
  styles.ts              — Studio-inline styles
  types.ts               — shared types
```

### 3.6 Related docs

| File | Role |
| --- | --- |
| `docs/apothecary/SELLER_CENTRE_GUIDE.md` | Editor guide |
| `docs/apothecary/PHASE9_DELIVERABLES.md` | Deliverables + verification evidence |
| `docs/apothecary/DRAFT_PREVIEW_AUDIT.md` | Preview audit notes |
| `docs/apothecary/SELLER_CENTRE_SESSION_REPORT.md` | This report |

---

## 4. Milestone summary

### Milestone 1 — Draft preview + Seller Centre Phases 2–5

**Committed:** `10e762d` — `feat(apothecary): complete Seller Centre Phases 2–5 for guided product ops`  
(Also prior: `02f7f53` secure draft preview)

**Verified:**

- Dashboard, five-step wizard, Quick Edit  
- End-to-end Add Product for **Seller Centre Flow Test — Do Not Buy**  
- Save Draft → Preview Draft → absent from public catalogue  

### Milestone 2 — Draft workflow (no publish)

**Test product:** Seller Centre Flow Test — Do Not Buy  
**Id:** `product-seller-centre-flow-test-do-not-buy-mrfpw4wn`

| Step | Result |
| --- | --- |
| Resume Draft | Hydrates from Sanity |
| Upload + reorder images | Pass |
| Video + poster | Pass (Gallery 2 · Video 1) |
| AI + Accept section | Blocked — no AI admin token |
| Preview Draft | Pass — Draft Preview Active |
| Remains private | Pass |
| Quick Edit price + image | Pass — £32 via Save price |
| Advanced Editor same doc | Pass |

**Code fixes in this milestone (uncommitted at last check):**

- Resume Draft action + wizard step hydrate from Sanity  
- Quick Edit always patches draft id; **Save price** button  
- Journey labels: Details → Media → Generate Content → Price → Preview  

### Milestone 3 — Final verification (partial)

**Test product:** Apothecary Verification Product — Do Not Buy  
**Id:** `product-apothecary-verification-preview`  
**Slug:** `apothecary-verification-product`

| Step | Result |
| --- | --- |
| 1–3 Seller Centre + required fields | Pass (£12, image, summary) |
| 4 Generate AI | Blocked — no AI token |
| 5 Preview Draft+Hidden | Pass |
| 6 Absent from catalogue | Pass |
| 7 Explicit publish approval | Waited; later release gate stated, but AI still blocks “generate description” |
| 8–24 Publish → public → edits → unpublish → archive → 404 | **Not run** |

---

## 5. Verification evidence (automated + security)

| Check | Result |
| --- | --- |
| `npm run type-check` | Pass |
| Seller Centre / draft / AI route eslint | Pass (0 warnings on scoped paths) |
| `npm run build` | Pass |
| Full-repo `npm run lint` | Avoided / OOM risk on `dist/` historically |
| `npm test` | No test script in `package.json` |
| `POST /api/apothecary/generate-content` no/bad auth | **401** |
| `GET /api/draft` no/bad secret | **401** |
| Secrets in public catalogue HTML | None found |
| Public slug without Draft Mode | Not-found UI (`NEXT_HTTP_ERROR_FALLBACK;404`; Next.js soft **200** in local dev) |
| Draft Mode preview with valid secret | **200** + Draft Preview Active |

---

## 6. Test products in Sanity

| Name | Id | Status (last known) |
| --- | --- | --- |
| Apothecary Verification Product — Do Not Buy | `product-apothecary-verification-preview` | Draft, Hidden — Milestone 3 |
| Seller Centre Flow Test — Do Not Buy | `product-seller-centre-flow-test-do-not-buy-mrfpw4wn` | Draft, Hidden — Milestone 2 |
| Duplicate incomplete verification draft | `drafts.1c4dc252-…` | Draft, incomplete — cleanup candidate |

Do not publish verification products to production without intent. Prefer archive/cleanup after Milestone 3.

---

## 7. Environment requirements

Present in local `.env.local` (at last check):

- `NEXT_PUBLIC_SANITY_PROJECT_ID`  
- `NEXT_PUBLIC_SANITY_DATASET`  
- `SANITY_API_TOKEN`  
- `SANITY_PREVIEW_SECRET` / `SANITY_STUDIO_PREVIEW_SECRET`  
- `SANITY_STUDIO_SITE_URL` / `NEXT_PUBLIC_SITE_URL`  

**Missing (blocks Generate Content and merge gate):**

- `AI_ADMIN_TOKEN`  
- `SANITY_STUDIO_AI_ADMIN_TOKEN` (same value; inlined for Studio via `next.config.ts`)  
- `ANTHROPIC_API_KEY`  

**Recommended for webhook revalidation checks:**

- `REVALIDATION_SECRET`  

See `.env.example` for placeholders.

---

## 8. Blocking issues

1. **AI Generate Content** cannot run locally without admin + Anthropic credentials. The merge gate requires:  
   `Add Product → … → generate description → … → publish`  
2. **Milestone 3 steps 8–24** (publish lifecycle, EN/DA, unpublish, archive, genuine HTTP 404) not completed.  
3. **Genuine HTTP 404:** unpublished slug shows institutional not-found UI, but local Next.js often returns soft **HTTP 200** with `NEXT_HTTP_ERROR_FALLBACK;404`. Confirm/fix for production status code before calling Milestone 3 complete.  

---

## 9. Non-blocking follow-ups

- Archive or delete the incomplete duplicate verification draft (`1c4dc252-…`)  
- Danish AI translation does not yet create a linked DA document  
- Variants in the wizard are a free-text note, not full variant records  
- Media Library pick (vs upload) not in the wizard  
- Counter / checkout still incomplete (out of scope)  
- Commit remaining uncommitted Seller Centre + docs changes when ready  

---

## 10. Uncommitted changes (at last check)

```
M docs/apothecary/PHASE9_DELIVERABLES.md
M docs/apothecary/SELLER_CENTRE_GUIDE.md
M src/sanity/tools/seller-centre/AddProductWizard.tsx
M src/sanity/tools/seller-centre/QuickEdit.tsx
M src/sanity/tools/seller-centre/SellerHome.tsx
```

Plus this report file when added.

**Suggested commit message (when asked to commit):**

```
feat(apothecary): polish Seller Centre journey and Milestone 2–3 gate docs

Align Add Product steps with Details → Media → Generate Content → Price →
Preview, harden Quick Edit draft saves, and record verification evidence.
```

---

## 11. How to resume

1. Add AI tokens + `ANTHROPIC_API_KEY` to `.env.local`; restart `npm run dev`.  
2. Explicitly approve publish for Milestone 3.  
3. Personally run (or have the agent run) the simple routine without Advanced Editor:  
   Add Product → media → **generate description** → price → preview → **publish**.  
4. Finish Milestone 3 steps 8–24 on the verification product.  
5. Only then: merge `feature/apothecary-product-manager` → `enterprise-refactor` → Vercel Preview → `main` → production.  

---

## 12. Related commits already on the branch

| Commit | Summary |
| --- | --- |
| `10e762d` | Seller Centre Phases 2–5 |
| `02f7f53` | Secure draft product preview |
| `ca278e0` | Draft Mode for hidden products |
| `b8f0701` | Product manager CMS wiring + AI drafts |

---

*End of session report.*
