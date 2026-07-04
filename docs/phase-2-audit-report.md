# Phase 2 Audit Report

**Date:** 4 July 2026  
**Scope:** Complete assessment of CMS integration, third-party services, and frontend data sources  
**Status:** Audit only — no changes made

---

## 1. Sanity CMS

### 1.1 Installation

| Item | Status | Detail |
|------|--------|--------|
| `sanity` | Implemented | ^6.3.0 |
| `next-sanity` | Implemented | ^13.1.1 |
| `@sanity/vision` | Implemented | ^6.3.0 |
| `@sanity/image-url` | Implemented | ^2.1.1 |

### 1.2 Sanity Studio

| Item | Status | Detail |
|------|--------|--------|
| Studio configured | Implemented | `sanity.config.ts` at project root |
| Studio route | Implemented | Embedded at `/studio` via `src/app/(studio)/studio/[[...tool]]/page.tsx` |
| Desk structure | Implemented | Custom organisation by department in `src/sanity/structure/index.ts` |
| Plugins | Implemented | `structureTool` (custom desk), `visionTool` (GROQ playground) |
| Custom tools | Implemented | Operations overview panel |

### 1.3 Schemas

**38 registered types** (16 object types + 22 document types).

#### Object schemas (reusable field groups)

| File | Type |
|------|------|
| `src/sanity/schemas/objects/seo.ts` | `seo` |
| `src/sanity/schemas/objects/media.ts` | `institutionalImage`, `institutionalVideo`, `downloadFile` |
| `src/sanity/schemas/objects/editorial-workflow.ts` | `editorialWorkflow` |
| `src/sanity/schemas/objects/prophetic-reference.ts` | `propheticReference` |
| `src/sanity/schemas/objects/board-approval.ts` | `boardApproval` |
| `src/sanity/schemas/objects/rich-content.ts` | `richContent` + 10 sub-types |

#### Document schemas — Global

| File | Type |
|------|------|
| `src/sanity/schemas/documents/global/institution-settings.ts` | `institutionSettings` |
| `src/sanity/schemas/documents/global/navigation.ts` | `navigation` |
| `src/sanity/schemas/documents/global/footer.ts` | `footerSettings` |
| `src/sanity/schemas/documents/global/global-seo.ts` | `globalSeo` |
| `src/sanity/schemas/documents/global/announcement.ts` | `announcement` |
| `src/sanity/schemas/documents/global/testimonial.ts` | `testimonial` |
| `src/sanity/schemas/documents/global/faq.ts` | `faq` |
| `src/sanity/schemas/documents/global/media-asset.ts` | `mediaAsset` |
| `src/sanity/schemas/documents/global/department-card.ts` | `departmentCard` |

#### Document schemas — The Apothecary

| File | Type |
|------|------|
| `src/sanity/schemas/documents/apothecary/product.ts` | `product` |
| `src/sanity/schemas/documents/apothecary/collection.ts` | `collection` |
| `src/sanity/schemas/documents/apothecary/category.ts` | `category` |
| `src/sanity/schemas/documents/apothecary/ingredient.ts` | `ingredient` |

#### Document schemas — The Academy

| File | Type |
|------|------|
| `src/sanity/schemas/documents/academy/programme.ts` | `programme` |
| `src/sanity/schemas/documents/academy/faculty.ts` | `faculty` |

#### Document schemas — Sacred Journeys

| File | Type |
|------|------|
| `src/sanity/schemas/documents/journeys/journey.ts` | `journey` |

#### Document schemas — Knowledge Library

| File | Type |
|------|------|
| `src/sanity/schemas/documents/knowledge/article.ts` | `article` |
| `src/sanity/schemas/documents/knowledge/author.ts` | `author` |
| `src/sanity/schemas/documents/knowledge/topic.ts` | `topic` |

#### Document schemas — Clinical

| File | Type |
|------|------|
| `src/sanity/schemas/documents/clinical/consultations-page.ts` | `consultationsPage` |

#### Document schemas — Institution

| File | Type |
|------|------|
| `src/sanity/schemas/documents/institution/charter.ts` | `charter` |

#### Document schemas — Operations

| File | Type |
|------|------|
| `src/sanity/schemas/documents/operations/batch-record.ts` | `batchRecord` |
| `src/sanity/schemas/documents/operations/operational-log.ts` | `operationalLog` |
| `src/sanity/schemas/documents/operations/decision-record.ts` | `decisionRecord` |
| `src/sanity/schemas/documents/operations/compliance-entry.ts` | `complianceEntry` |
| `src/sanity/schemas/documents/operations/audit-finding.ts` | `auditFinding` |

#### Document schemas — Pages

| File | Type |
|------|------|
| `src/sanity/schemas/documents/pages/homepage.ts` | `homepage` |

### 1.4 Client configuration

| Client | File | Purpose |
|--------|------|---------|
| `client` | `src/sanity/lib/client.ts` | Read-only, CDN-backed, `published` perspective |
| `previewClient` | `src/sanity/lib/client.ts` | Preview drafts, no CDN, token-authenticated |
| `writeClient` | `src/sanity/lib/write-client.ts` | Server-side mutations, requires `SANITY_API_TOKEN` |

### 1.5 GROQ queries

18 named queries in `src/sanity/lib/queries.ts`:

| Query | Purpose |
|-------|---------|
| `institutionSettingsQuery` | Site-wide settings |
| `navigationQuery` | Main nav + announcement bar |
| `footerQuery` | Footer columns + social links |
| `homepageQuery` | Full homepage content |
| `allProductsQuery` | Product catalogue |
| `productBySlugQuery` | Single product monograph |
| `allProgrammesQuery` | Academy programmes |
| `programmeBySlugQuery` | Single programme + curriculum |
| `allJourneysQuery` | Sacred Journeys listing |
| `journeyBySlugQuery` | Single journey |
| `allArticlesQuery` | Knowledge Library articles |
| `articleBySlugQuery` | Single article |
| `allFacultyQuery` | Faculty members |
| `testimonialsByDepartmentQuery` | Testimonials by department |
| `faqsByDepartmentQuery` | FAQs by department |
| `consultationsPageQuery` | Clinical consultations singleton |
| `charterQuery` | Founding charter |
| `globalSeoQuery` | Default SEO / OG settings |

### 1.6 Data-fetching architecture

**Pattern:** Sanity-first with static fallback (`src/sanity/lib/fetch.ts`)

Every function queries Sanity CMS. If Sanity returns null/empty, it falls back to existing static data files.

**Adapter layer:** `src/sanity/lib/adapters.ts` converts Sanity types to legacy component interfaces:
- `productToRemedy()` — Product → Remedy
- `programmeToAcademyProgramme()` — Programme → AcademyProgramme
- `journeyToSacredJourney()` — Journey → SacredJourney

---

## 2. Shopify

| Item | Status | Detail |
|------|--------|--------|
| Package installed | Not implemented | No Shopify packages in `package.json` |
| Client configured | Not implemented | Stub only — `src/lib/integrations/shopify.ts`, all functions return `null` |
| Inventory connected | Not implemented | — |
| Checkout connected | Not implemented | No cart UI, no checkout page |
| Products from Shopify | Not implemented | Products come from Sanity/static data |
| Architecture prepared | Implemented | TypeScript interfaces, hidden schema fields (`futureShopifyProductId`, `futureShopifyVariantId`), stub client with "Phase 4" gating |

---

## 3. Stripe

| Item | Status | Detail |
|------|--------|--------|
| Package installed | Not implemented | No Stripe packages in `package.json` |
| Payment routes | Not implemented | Stub functions only |
| Checkout implemented | Not implemented | — |
| Webhooks configured | Not implemented | `verifyWebhookSignature` stub returns `false` |
| Architecture prepared | Implemented | Interfaces for `PaymentIntent`, `CheckoutSession`, `PaymentPurpose` (products, programmes, journeys, consultations) |

---

## 4. Cloudinary

| Item | Status | Detail |
|------|--------|--------|
| Package installed | Not implemented | No Cloudinary packages in `package.json` |
| Media served from Cloudinary | Not implemented | All images via Sanity CDN or local `/public/` |
| Architecture prepared | Implemented | Hidden `cloudinaryAssetId` fields on 9 schemas, stub URL resolver in `src/sanity/lib/image.ts` |

---

## 5. CMS Coverage by Section

### Homepage — `src/app/page.tsx`

**Status: Partially implemented**

Calls `getHomepage()` from Sanity with field-by-field CMS override. However, `departments` array and `authoritySignals` always use hardcoded inline fallback — they are never overridden by CMS data even if published.

### The Apothecary

| Page | Status | Detail |
|------|--------|--------|
| Landing (`page.tsx`) | Hardcoded | All editorial content is inline JSX |
| Catalogue (`catalogue/page.tsx`) | Hybrid | `getAllProducts()` — Sanity-first, static fallback |
| Monographs (`monographs/page.tsx`) | Hybrid | Same pattern |
| Product detail (`[slug]/page.tsx`) | Hybrid | `getProductBySlug()` — Sanity-first, static fallback |
| Ingredients (`ingredients/page.tsx`) | Hardcoded | Has `// TODO: Migrate to Sanity` |
| Quality Standards (`quality-standards/page.tsx`) | Hardcoded | Has `// TODO: Migrate to Sanity` |
| Laboratory Verification (`laboratory-verification/page.tsx`) | Hardcoded | Has `// TODO: Migrate to Sanity` |
| FAQs (`faqs/page.tsx`) | Hardcoded | Has `// TODO: Migrate to Sanity` |
| Counter (`counter/page.tsx`) | Hardcoded | Client component using static data |

### The Academy

| Page | Status | Detail |
|------|--------|--------|
| Landing + 20 sub-pages | Hybrid | All use `getProgrammeBySlug("hijama-diploma")` via Sanity bridge |
| Clinical Ethics (`clinical-ethics/page.tsx`) | Hardcoded | All inline JSX, no Sanity import |
| Foundations (`foundations/page.tsx`) | Hardcoded | All inline content |
| Foundations Enrol (`foundations/enrol/page.tsx`) | Hardcoded | Client-side form |

### Sacred Journeys

| Page | Status | Detail |
|------|--------|--------|
| Dynamic routes (`[slug]`, `umrah`, `itineraries`, `gallery`) | Hybrid | Sanity-first with static fallback |
| Landing (`page.tsx`) | Hardcoded | Has `// TODO: migrate to Sanity CMS` |
| Preparation | Hardcoded | Imports from static `journeyInstitution` |
| Reading | Hardcoded | Same |
| Packing | Hardcoded | Same |
| Flight Guidance | Hardcoded | Same |
| Accommodation | Hardcoded | Same |
| Educational Sessions | Hardcoded | Same |
| Reflection Journals | Hardcoded | Same |
| Companionship | Hardcoded | Same |
| Health Guidance | Hardcoded | Same |
| Registration | Hardcoded | Same |
| Policies | Hardcoded | Same |
| FAQs | Hardcoded | Same |

### Knowledge Library

| Page | Status | Detail |
|------|--------|--------|
| Landing (`page.tsx`) | Hardcoded | All inline JSX |
| Topic pages (`[slug]/page.tsx`) | Hardcoded | Uses `getKnowledgeTopic()` from static lib, not Sanity `getArticleBySlug()` |

### Clinical Consultations — `src/app/consultations/page.tsx`

**Status: Not implemented**

Client component using static booking service. `getConsultationsPage()` Sanity function exists but is never called.

### Charter — `src/app/charter/page.tsx`

**Status: Not implemented**

All inline JSX. `getCharter()` Sanity function exists but is never called.

### Navigation

**Status: Implemented**

`MastheadServer` calls `getNavigation()` — Sanity-first with hardcoded fallback.

### Footer

**Status: Implemented**

`FooterServer` calls `getFooter()` — Sanity-first with hardcoded fallback.

### Testimonials

**Status: Partially implemented**

`getTestimonials(dept)` query exists and is callable. Individual pages use inline testimonials rather than calling it.

### Institution Settings

**Status: Partially implemented**

Schema and query exist. Not consumed by any page directly.

### Global SEO

**Status: Partially implemented**

Schema and `getGlobalSeo()` query exist. `layout.tsx` does not call it — metadata is hardcoded in each page's `generateMetadata`.

---

## 6. Architecture Assessment

### 6.1 Remaining hardcoded content (~27 pages)

- **Apothecary:** landing, ingredients, quality-standards, laboratory-verification, FAQs, counter
- **Academy:** clinical-ethics, foundations, foundations/enrol
- **Sacred Journeys:** landing + 11 institutional section pages
- **Knowledge Library:** landing + all topic pages
- **Clinical Consultations:** entire page
- **Charter:** entire page
- **Correspondence:** entire page

### 6.2 Sanity functions defined but never called

| Function | File | Notes |
|----------|------|-------|
| `getConsultationsPage()` | `src/sanity/lib/fetch.ts` | Consultations page uses static booking service instead |
| `getCharter()` | `src/sanity/lib/fetch.ts` | Charter page uses inline JSX instead |
| `getAllArticles()` | `src/sanity/lib/fetch.ts` | Knowledge Library uses static `getKnowledgeTopic()` |
| `getArticleBySlug()` | `src/sanity/lib/fetch.ts` | Same as above |
| `getGlobalSeo()` | `src/sanity/lib/fetch.ts` | `layout.tsx` does not call it |
| `getTestimonials()` | `src/sanity/lib/fetch.ts` | Individual pages use inline testimonials |

### 6.3 Duplicate schema files (legacy)

Three files exist alongside their properly-organised counterparts in `global/`:

- `src/sanity/schemas/documents/institution-settings.ts`
- `src/sanity/schemas/documents/navigation.ts`
- `src/sanity/schemas/documents/footer-settings.ts`

### 6.4 Technical debt

| Issue | Severity | Detail |
|-------|----------|--------|
| No `.env.example` | Medium | New developers have no documentation of required environment variables |
| No preview mode | Medium | `previewClient` exists but no `/api/preview` or `/api/draft` route for editors |
| No revalidation webhook verified | Medium | `/api/revalidate` route exists but no documentation that Sanity webhook is configured |
| Duplicate legacy schema files | Low | Three files duplicated in old location |
| Homepage `departments` never from CMS | Low | Hardcoded inline even when CMS data available |
| No Sanity content published | High | Impossible to verify GROQ queries return correct shapes without published content |

### 6.5 Missing integrations (by design)

| Service | Planned Phase | Current State |
|---------|--------------|---------------|
| Cloudinary | Phase 3 | Architecture stubs only |
| Shopify | Phase 4 | Architecture stubs only |
| Stripe | Phase 4 | Architecture stubs only |

### 6.6 Items required before production

1. Publish content in Sanity Studio to validate all GROQ queries
2. Connect remaining ~27 hardcoded pages to CMS
3. Wire `getGlobalSeo()` into `layout.tsx`
4. Add draft preview route for editorial workflow
5. Configure Sanity webhook → `/api/revalidate`
6. Create `.env.example` documenting all required variables
7. Remove duplicate legacy schema files
8. Ensure `getHomepage()` CMS data can fully override fallback (including `departments`)
9. Connect `getConsultationsPage()` to consultations page
10. Connect `getCharter()` to charter page
11. Connect `getAllArticles()` / `getArticleBySlug()` to Knowledge Library

---

## Summary

| Area | Overall Status |
|------|---------------|
| Sanity CMS | **Partially implemented** — comprehensive schema and query layer exists; ~50% of pages connected |
| Shopify | **Not implemented** — architecture prepared (Phase 4) |
| Stripe | **Not implemented** — architecture prepared (Phase 4) |
| Cloudinary | **Not implemented** — architecture prepared (Phase 3) |
| Frontend CMS coverage | **~50%** — 27 pages hybrid (Sanity-first), 27 pages fully hardcoded |
| Navigation | **Implemented** — CMS-driven with fallback |
| Footer | **Implemented** — CMS-driven with fallback |

The architectural foundation is solid. The "Sanity-first with static fallback" data bridge, adapter layer, and schema coverage are well-designed and comprehensive. The primary gap is that approximately half of all pages bypass the data bridge and import directly from static TypeScript files. The Sanity queries and functions to serve these pages already exist — they simply need to be wired in.
