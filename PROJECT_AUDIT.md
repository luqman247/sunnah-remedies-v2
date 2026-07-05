# PROJECT_AUDIT.md

**Date:** 5 July 2026  
**Scope:** Phase 1 Enterprise Refactor — read-only audit of the complete Sunnah Remedies v2.0 codebase  
**Status:** Audit only — no code, schema, folder, or design changes were made

---

## Executive Summary

Sunnah Remedies v2.0 is a large Next.js 16 App Router institutional platform (~620 TypeScript files, 102 pages, 52 route handlers, 70 Sanity schema types, 101 React components). The codebase reflects multiple completed phases: institutional frontend (Phases 1–3), CMS integration (Phase 2), commerce layer (Phase 4), AI platform (Phase 6), operations engine (Phase 8), and membership portals (Phase 9).

The dominant architectural tension is **dual content ownership**: Sanity CMS is nominally the source of truth, but a parallel static content layer (`src/lib/content/`) remains deeply wired into fetch fallbacks, cart resolution, photography maps, navigation, and ~65 import sites. Four canonical remedies (`black-seed-oil`, `honey`, `senna`, `olive-oil`) are hardcoded across 30+ files.

The Phase 4 commerce **composition layer exists but is not consumed by any page**. Product routes bypass `composeProductView()` and read editorial-only data via `getProductBySlug()` → `productToRemedy()`. The cart (`CounterContext`) resolves line items from static remedies, not CMS or Shopify.

**Critical finding:** `docs/Architecture/*.md` (01–07) are **empty placeholder files** (0 bytes). Architecture comparison must rely on Phase 4 Part 2 specs, Phase 1 CMS docs, and the execution plan `.docx`.

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Sanity Schemas](#2-sanity-schemas)
3. [GROQ Queries](#3-groq-queries)
4. [API Routes](#4-api-routes)
5. [Reusable Components](#5-reusable-components)
6. [Product Pages](#6-product-pages)
7. [All Routes](#7-all-routes)
8. [Duplicated Code](#8-duplicated-code)
9. [Hardcoded Products](#9-hardcoded-products)
10. [Hardcoded Categories](#10-hardcoded-categories)
11. [Hardcoded Collections](#11-hardcoded-collections)
12. [Duplicated UI](#12-duplicated-ui)
13. [Duplicated Business Logic](#13-duplicated-business-logic)
14. [Technical Debt](#14-technical-debt)
15. [Folder Organisation Issues](#15-folder-organisation-issues)
16. [Modularisation Opportunities](#16-modularisation-opportunities)
17. [Architecture Document Comparison](#17-architecture-document-comparison)

---

## 1. Project Structure

### 1.1 Top-Level Layout

```
/
├── .cursor/rules/          Cursor IDE rules (sunnah-remedies-identity.mdc)
├── analytics/              Analytics layer (consent, GTM, warehouse) — root-level, not in src/
├── config/                 GTM container JSON, Clarity config
├── docs/                   Phase specs (1–9), Architecture placeholders, handbooks
├── drizzle/                PostgreSQL migrations
├── Logo/                   Brand asset source files
├── public/                 Static assets (brand/, photography/)
├── scripts/                CMS seeding, reindex, schema validation
├── src/                    All application source code
├── tests/                  Unit tests (AI guardrails, community permissions)
├── middleware.ts           next-intl + next-auth (root, not src/)
├── next.config.ts
├── sanity.config.ts        Sanity Studio config (root)
├── sanity.cli.ts
├── drizzle.config.ts
├── tsconfig.json           @/* → ./src/*
└── package.json
```

### 1.2 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js App Router | ^16.2.10 |
| UI | React | ^19.2.7 |
| Language | TypeScript | ^6.0.3 |
| Styling | Tailwind CSS v4 (inline in globals.css) | ^4.3.2 |
| CMS | Sanity + embedded Studio at `/studio` | ^6.3.0 |
| i18n | next-intl (en, da) | ^4.13.1 |
| Auth | NextAuth.js v4 (staff + member) | ^4.24.14 |
| ORM | Drizzle + Neon Postgres | ^0.45.2 |
| Commerce | Shopify Storefront + Stripe | — |
| Jobs | Inngest | ^4.11.0 |
| AI/RAG | Anthropic, OpenAI, Pinecone | — |
| Search | Algolia (via abstraction) | — |
| Email | Resend + React Email | — |
| Media | Cloudinary + Sanity CDN | — |

### 1.3 `src/` Directory Map

| Directory | Purpose | Approx. files |
|-----------|---------|---------------|
| `src/app/` | App Router pages, layouts, API routes | 160+ |
| `src/components/` | UI by domain (18 folders) | 101 `.tsx` |
| `src/sanity/` | Schemas, client, queries, Studio tools | 55+ schema files |
| `src/lib/` | Shared utilities, content, commerce, auth, SEO | 150+ |
| `src/lib/content/` | **Static fallback content layer** | 37 files |
| `src/lib/commerce/` | Shopify/Stripe/composition (Phase 4) | 31 files |
| `src/operations/` | Back-office engine (Phase 8) | 80+ |
| `src/ai/` | AI platform (Phase 6) | 60+ |
| `src/modules/` | Domain services (identity, membership, student, practitioner) | 20+ |
| `src/i18n/` | Locale routing, navigation, request config | 5 |
| `src/messages/` | en.json, da.json | 2 |
| `src/context/` | CounterContext (cart) | 1 |
| `src/db/` | Community Drizzle schema | 3 |

### 1.4 Routing Model

- **App Router only** — no `pages/` directory
- **Locale wrapper:** `src/app/[locale]/` for all public i18n routes
- **Route groups:** `(staff)`, `(studio)` for isolated layouts
- **Non-locale routes:** `/knowledge/[type]/[slug]`, feeds, sitemaps, llms.txt
- **Middleware at root:** URL normalization, next-intl, next-auth for `/handbook`, `/ops`, `/intelligence`

### 1.5 Database Schemas (Dual)

Drizzle config points to two schema files:

- `src/operations/db/schema.ts` — operations (bookings, CRM, inventory, finance, alerts)
- `src/db/schema/community.ts` — community/membership (Phase 9)

Two separate `db/index.ts` entry points: `src/operations/db/index.ts` and `src/db/index.ts`.

---

## 2. Sanity Schemas

### 2.1 Registry

**File:** `src/sanity/schemas/index.ts`  
**Total registered types:** 70 (28 objects + 42 documents)

Studio config: `sanity.config.ts` with structure tool, Vision, document internationalization (21 translatable types), language filter, custom Operations overview tool.

### 2.2 Object Schemas (`src/sanity/schemas/objects/`)

| File | Types | Purpose |
|------|-------|---------|
| `seo.ts` | `seo` | Meta, OG, robots, focusEntities refs |
| `media.ts` | `institutionalImage`, `institutionalVideo`, `downloadFile` | Media objects |
| `editorial-workflow.ts` | `editorialWorkflow` | Draft/review/publish workflow |
| `prophetic-reference.ts` | `propheticReference` | Citation object |
| `board-approval.ts` | `boardApproval` | Governance approvals |
| `translation-status.ts` | `translationStatus` | i18n sync state |
| `commerce-reference.ts` | `commerceReference` | Shopify product/variant join |
| `variant-reference.ts` | `variantReference` | Variant SKU mapping |
| `tradition-layers.ts` | `traditionLayers` | Established/interpreted/traditional/ours |
| `source-reference.ts` | `sourceReference` | Hadith/Qur'an/source refs |
| `product-clinical-note.ts` | `productClinicalNote` | Clinical notes on products |
| `provenance-note.ts` | `provenanceNote` | Origin/cultivation |
| `season-window.ts` | `seasonWindow` | Seasonal availability |
| `relationship.ts` | `relationship` | Knowledge-graph edge type |
| `rich-content.ts` | `richContent`, `arabicText`, `quranReference`, `hadithReference`, `footnote`, `academicCitation`, `evidencePanel`, `clinicalNote`, `scholarNote`, `calloutBox`, `warningBlock`, `internalLink` | Portable Text + editorial blocks |

### 2.3 Document Schemas by Department

#### Global (`documents/global/`)

| Type | File | Notes |
|------|------|-------|
| `institutionSettings` | `institution-settings.ts` | Singleton |
| `navigation` | `navigation.ts` | Singleton |
| `footerSettings` | `footer.ts` | Singleton |
| `globalSeo` | `global-seo.ts` | Singleton |
| `announcement` | `announcement.ts` | Department-scoped |
| `testimonial` | `testimonial.ts` | Department-scoped |
| `faq` | `faq.ts` | Department-scoped |
| `mediaAsset` | `media-asset.ts` | Photography QC |
| `videoAsset` | `video-asset.ts` | → mediaAsset |
| `audioAsset` | `audio-asset.ts` | → person |
| `person` | `person.ts` | → mediaAsset |
| `departmentCard` | `department-card.ts` | Homepage gateway cards |

#### Apothecary (`documents/apothecary/`)

| Type | Key relationships |
|------|-------------------|
| `product` | → ingredient, product, collection, category, batchRecord; commerceReference; rich monograph fields |
| `collection` | → product[] (products, featuredProducts); shopifyCollectionRef |
| `category` | Standalone taxonomy |
| `ingredient` | → product, article, programme, journey, faculty; relationship[] graph |

#### Academy (`documents/academy/`)

| Type | Key relationships |
|------|-------------------|
| `programme` | → faculty[] |
| `faculty` | Portrait, departments, specialisms |
| `campusCourse` | → programme |
| `campusLesson` | → campusCourse, videoAsset |

#### Other Departments

| Folder | Types |
|--------|-------|
| `journeys/` | `journey` |
| `knowledge/` | `article`, `author`, `topic` |
| `clinical/` | `consultationsPage`, `clinicalProtocol`, `practitionerResource`, `researchPublication` |
| `institution/` | `charter` |
| `pages/` | `homepage` |
| `operations/` | `batchRecord`, `operationalLog`, `decisionRecord`, `complianceEntry`, `auditFinding` |
| Root | `condition`, `bodySystem`, `hadith`, `quranReferenceDoc`, `researchPaper`, `scholar`, `citation` (knowledge graph) |

### 2.4 Schema Observations

| Issue | Detail |
|-------|--------|
| Schema growth since Phase 2 | Phase 2 audit reported 38 types; current count is 70 (+84%) |
| `ingredient` has no frontend GROQ query | Schema exists; no `ingredientBySlugQuery` in `queries.ts` |
| `collection` has no frontend route or GROQ query | Schema + Shopify join exist; no `/collections/[slug]` page |
| `category` has no frontend GROQ query | Schema exists; categories not fetched independently |
| Knowledge entity type naming | Schema uses `quranReferenceDoc`, `researchPaper`; some routes use `quranReference`, `research` |
| Translatable types | 21 document types via `@sanity/document-internationalization` |
| Plugin-managed type | `translation.metadata` (not in schemaTypes) |

### 2.5 Relationship Graph

Central edge type: `relationship` object with 14 relation types (`treats`, `containsIngredient`, `evidencedBy`, etc.). GROQ helpers in `src/lib/knowledge-graph/relationships.ts`.

---

## 3. GROQ Queries

### 3.1 Primary Query Module

**File:** `src/sanity/lib/queries.ts`  
**Named exports:** 27 queries + `translationSiblings` fragment

| Query | Purpose |
|-------|---------|
| `institutionSettingsQuery` | Site identity singleton |
| `navigationQuery` | Masthead nav + announcement bar |
| `footerQuery` | Footer columns, colophon |
| `homepageQuery` | Full homepage with dereferenced departmentCards |
| `allProductsQuery` | Published products by language, orderRank |
| `productBySlugQuery` | Full product + relatedProducts, ingredients, seo, translations |
| `allProgrammesQuery` | Programme listing |
| `programmeBySlugQuery` | Full programme + faculty |
| `allJourneysQuery` | Journey listing |
| `journeyBySlugQuery` | Full journey detail |
| `allArticlesQuery` | Article index |
| `articleBySlugQuery` | Full article + body, author, topics |
| `allFacultyQuery` | Faculty directory |
| `testimonialsByDepartmentQuery` | Dept-filtered testimonials |
| `faqsByDepartmentQuery` | Dept-filtered FAQs |
| `consultationsPageQuery` | Consultations page + practitioners |
| `charterQuery` | Charter document |
| `globalSeoQuery` | Default SEO |
| `productSlugsQuery` | Static params for products |
| `programmeSlugsQuery` | Static params for programmes |
| `journeySlugsQuery` | Static params for journeys |
| `articleSlugsQuery` | Static params for articles |
| `clinicalProtocolsQuery` | Practitioner portal protocols |
| `clinicalProtocolBySlugQuery` | Single protocol |
| `practitionerResourcesQuery` | Practitioner downloads |
| `researchPublicationsQuery` | Research list |
| `practitionerAnnouncementsQuery` | Practitioner announcements |

### 3.2 Campus Queries

**File:** `src/sanity/lib/campus-fetch.ts`

| Query | Purpose |
|-------|---------|
| `campusCoursesQuery` | Student course list |
| `campusCourseBySlugQuery` | Single course |
| `campusLessonsQuery` | Lessons for course |
| `campusLessonBySlugQuery` | Lesson detail |
| `studentAnnouncementsQuery` | Student portal announcements |

### 3.3 Inline / Ad-Hoc GROQ

| File | Purpose |
|------|---------|
| `src/sanity/lib/fetch.ts` | Inline slug queries (duplicates exported `*SlugsQuery`) |
| `src/app/sitemap.ts` | Slug + `_updatedAt` for products, programmes, journeys, articles, knowledge entities |
| `src/app/knowledge/[type]/[slug]/page.tsx` | Dynamic entity by type + slug |
| `src/app/knowledge/citations/[refId]/page.tsx` | Citation + inbound references |
| `src/lib/commerce/reconciliation/index.ts` | `SANITY_COMMERCE_QUERY` for Shopify sync |
| `src/lib/knowledge-graph/relationships.ts` | `inboundReferencesQuery()` |
| `src/app/feeds/rss.xml/route.ts` | Latest 50 articles |
| `src/app/feeds/[collection]/rss.xml/route.ts` | Per-collection RSS (29 items) |
| `src/app/sitemaps/videos.xml/route.ts` | Video sitemap |
| `src/app/sitemaps/images.xml/route.ts` | Image sitemap |
| `src/app/llms-full.txt/route.ts` | LLM corpus index |
| `src/sanity/tools/operations-overview.tsx` | Studio dashboard queries |
| `src/app/api/sanity/on-source-change/route.ts` | Translation metadata |
| `src/app/api/sanity/generate-danish-draft/route.ts` | Danish draft generation |
| `src/ai/ingestion/adapters/index.ts` | AI corpus ingestion by ID/type |
| `scripts/reindex-full.ts` | Search reindex bulk fetch |
| `scripts/broken-reference-audit.ts` | Reference integrity audit |
| `scripts/seed-danish-cms.ts` | Danish seeding |

### 3.4 Missing GROQ (Schema Exists, No Query)

| Entity | Impact |
|--------|--------|
| `ingredient` | Ingredients page uses static `apothecary.ts` array |
| `collection` | No collection pages; composition layer expects Sanity slug |
| `category` | No category listing or filtering |
| `topic` (standalone) | Topics embedded in articles only |
| `mediaAsset`, `videoAsset`, `audioAsset` | Resolved via dereferencing, no list queries |
| Knowledge entities (bulk) | Only inline in knowledge pages and sitemap |

### 3.5 Client Configuration

| Client | File | Config |
|--------|------|--------|
| Read | `src/sanity/lib/client.ts` | CDN in prod, `perspective: "published"` |
| Preview | `src/sanity/lib/client.ts` | `perspective: "previewDrafts"`, `SANITY_API_TOKEN` |
| Write | `src/sanity/lib/write-client.ts` | `SANITY_API_TOKEN`, no CDN |
| API write | `on-source-change`, `generate-danish-draft` | Inline `SANITY_API_WRITE_TOKEN` |
| Scripts | `broken-reference-audit`, `reindex-full`, `seed-danish-cms` | Standalone clients |

**Data flow:** Pages → `safeFetch()` (locale fallback) or direct `client.fetch()` → Sanity Content Lake.

**`safeFetch()` behaviour:** Merges `$language`, retries with `DEFAULT_LOCALE` on null, swallows errors → returns null. Higher-level getters in `fetch.ts` fall back to static TypeScript content when CMS is empty.

### 3.6 GROQ Inconsistencies

| Issue | Location | Detail |
|-------|----------|--------|
| Type name mismatch | `sitemap.ts` | Uses `quranReference`; schema is `quranReferenceDoc` |
| Type name mismatch | `knowledge/[type]/[slug]/page.tsx` | Accepts `quranReference`, `research`; schema uses `quranReferenceDoc`, `researchPaper` |
| Duplicate slug queries | `queries.ts` vs `fetch.ts` | Exported `*SlugsQuery` constants unused; inline GROQ in fetch.ts |
| No ingredient/collection/category queries | `queries.ts` | Schemas orphaned from query layer |

---

## 4. API Routes

**Total route handlers:** 52 (`route.ts` files)  
**Location:** `src/app/api/**` + 7 non-api routes (feeds, sitemaps, llms)

### 4.1 Commerce & Cart

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/cart` | GET, POST | Shopify cart proxy; cart ID in httpOnly cookie |
| `/api/payments` | POST | Stripe PaymentIntent (institutional flows) |
| `/api/webhooks/shopify` | POST | Shopify webhooks (HMAC, revalidate, analytics) |
| `/api/webhooks/stripe` | POST | Stripe payment webhooks |

### 4.2 Search & Revalidation

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/search` | GET | Algolia search proxy |
| `/api/revalidate` | POST | On-demand ISR from Sanity/Shopify webhooks |

### 4.3 AI Gateway

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/ai/query` | POST | Main AI gateway (multi-surface routing) |
| `/api/ai/session` | GET, DELETE | Session inspect/erase (GDPR) |
| `/api/ai/analytics` | GET | Knowledge-gap dashboard |
| `/api/ai/ingest` | POST | Manual AI corpus ingestion |
| `/api/ai/editorial` | POST | Sanity Studio editorial AI |
| `/api/ai/translate` | POST | Governed translation |

### 4.4 Membership & Portals (Phase 9)

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/auth/[...nextauth]` | GET, POST | Staff NextAuth |
| `/api/auth/member/[...nextauth]` | GET, POST | Member NextAuth |
| `/api/membership` | GET | Current member + permissions |
| `/api/membership/register` | POST | Member registration |
| `/api/membership/permissions` | POST | Capability check |
| `/api/portal/student/*` | GET, POST | Dashboard, enrolments, notes, progress |
| `/api/portal/practitioner/*` | GET, POST, PATCH, DELETE | Profile, saved, CPD |

### 4.5 Operations (Phase 8)

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/operations/dashboard` | GET | Ops dashboard aggregates |
| `/api/operations/inventory` | GET, POST | Stock, batches, goods-in |
| `/api/operations/bookings` | GET, POST | Booking CRUD (Cal.com) |
| `/api/operations/crm` | GET, POST, PATCH | CRM person CRUD |
| `/api/operations/alerts` | GET, POST | Alert management |
| `/api/operations/finance` | GET | Revenue, reconciliation, exports |
| `/api/operations/audit` | GET | Audit trail |
| `/api/intelligence` | GET | Analytics dashboard JSON |
| `/api/inngest` | GET, POST, PUT | Durable workflows |

### 4.6 Cron Jobs

| Route | Auth | Purpose |
|-------|------|---------|
| `/api/cron/health` | Bearer `CRON_SECRET` | System health + alerts |
| `/api/cron/inventory` | Bearer `CRON_SECRET` | Low-stock + expiry checks |
| `/api/cron/alerts` | Bearer `CRON_SECRET` | Escalate critical alerts |

### 4.7 Webhooks & Sanity

| Route | Purpose |
|-------|---------|
| `/api/webhooks/sanity-publish` | Publish → Inngest orchestration |
| `/api/webhooks/sanity-ai` | Publish → AI vector index |
| `/api/webhooks/calcom` | Cal.com booking events |
| `/api/webhooks/resend` | Email delivery events |
| `/api/sanity/on-source-change` | Translation metadata sync |
| `/api/sanity/generate-danish-draft` | Auto-generate Danish drafts |

### 4.8 Draft Mode & Misc

| Route | Purpose |
|-------|---------|
| `/api/draft` | Enable Sanity preview + redirect |
| `/api/draft/disable` | Disable draft mode |
| `/api/subscribe` | Correspondence subscription (**TODO: not wired**) |

### 4.9 Non-API Route Handlers

| Route | Purpose |
|-------|---------|
| `/feeds/rss.xml` | Site-wide RSS |
| `/feeds/[collection]/rss.xml` | Per-collection RSS |
| `/sitemaps/images.xml` | Image sitemap |
| `/sitemaps/news.xml` | News sitemap |
| `/sitemaps/videos.xml` | Video sitemap |
| `/llms.txt` | LLM discovery manifest |
| `/llms-full.txt` | Extended LLM manifest |

### 4.10 API Observations

| Issue | Detail |
|-------|--------|
| No `/api/checkout` route | Phase 4 spec proposed checkoutUrl resolution endpoint; cart returns checkoutUrl directly |
| Dual booking backends | Frontend uses `lib/booking/service` (mock); ops uses `operations/booking/service` (Cal.com + DB) |
| Subscribe placeholder | `api/subscribe/route.ts` logs only |
| Five Sanity client patterns | Read, preview, write, API write, script — token env var names differ |

---

## 5. Reusable Components

**Total:** 101 `.tsx` files across 18 folders in `src/components/`

### 5.1 Component Inventory by Domain

| Folder | Count | Primary purpose |
|--------|-------|-----------------|
| `apothecary/` | 10 | Product monograph, dispensation, botanical figures |
| `arrival/` | 10 | Homepage threshold sequence |
| `academy/` | 7 | Programme pages, enrolment |
| `booking/` | 9 | Consultation booking flow |
| `chrome/` | 8 | Masthead, footer, language switcher, seal |
| `commerce/` | 1 | Stripe PaymentForm (**unused**) |
| `department/` | 6 | Department hub sections |
| `editorial/` | 12 | Portable Text, citations, pull quotes |
| `institutional/` | 4 | Revelation, seasonal greeting |
| `journeys/` | 9 | Journey detail, registration |
| `knowledge/` | 1 | RelatedSection (**unused**) |
| `media/` | 8 | Editorial image/video, gallery, 360° |
| `motion/` | 4 | Parallax, reduced motion tokens |
| `portal/` | 6 | Student/practitioner page shells |
| `search/` | 1 | SearchInterface |
| `threshold/` | 2 | ThresholdHero, DepartmentGateway (**unused**) |
| `ui/` | 11 | Leaf, SectionPage, breadcrumb, links, attestation |
| `ai/` | 1 | InstitutionalAssistant |

### 5.2 High-Reuse Primitives

| Component | Used by |
|-----------|---------|
| `ui/Leaf` | Nearly all content pages |
| `ui/SectionPage` / `DepartmentHub` | Apothecary, knowledge sub-pages |
| `ui/PageIntro` | Widespread section headers |
| `ui/DepartmentNav` | All department sub-navigation |
| `ui/Attestation` | Catalogue, register, portals |
| `editorial/PortableBody` | Articles, lessons, protocols |
| `apothecary/RemedyMonograph` | Product detail shell |

### 5.3 Unused / Orphaned Components

| Component | Status |
|-----------|--------|
| `threshold/ThresholdHero.tsx` | Defined; homepage uses inline arrival sequence |
| `threshold/DepartmentGateway.tsx` | No imports found |
| `commerce/PaymentForm.tsx` | No page imports |
| `knowledge/RelatedSection.tsx` | Defined; knowledge pages don't import |

### 5.4 Section Page Proliferation

Five near-identical section page wrappers exist:

| Component | File | Difference from `ui/SectionPage` |
|-----------|------|----------------------------------|
| `SectionPage` | `ui/SectionPage.tsx` | Generic; accepts `department` prop |
| `AcademySectionPage` | `academy/AcademySectionPage.tsx` | Hardcodes academy dept + i18n breadcrumbs |
| `JourneySectionPage` | `journeys/JourneySectionPage.tsx` | Hardcodes journeys dept + i18n |
| `StudentSectionPage` | `portal/StudentSectionPage.tsx` | Portal-specific nav |
| `PractitionerSectionPage` | `portal/PractitionerSectionPage.tsx` | Portal-specific nav |

Each duplicates the Leaf → Breadcrumb → DepartmentNav → PageIntro → body layout (~50 lines × 5).

---

## 6. Product Pages

There is **no `/shop` route**. Commerce is framed as **The Apothecary** (dispensary).

### 6.1 Apothecary Routes

| Route | File | Data source |
|-------|------|-------------|
| `/the-apothecary` | `the-apothecary/page.tsx` | `getAllProducts()` + **hardcoded featured links** |
| `/the-apothecary/[slug]` | `the-apothecary/[slug]/page.tsx` | `getProductBySlug()` → `productToRemedy()` → `RemedyMonograph` |
| `/the-apothecary/catalogue` | `catalogue/page.tsx` | `getAllProducts()` |
| `/the-apothecary/monographs` | `monographs/page.tsx` | `getAllProducts()` |
| `/the-apothecary/ingredients` | `ingredients/page.tsx` | **Static** `apothecary.ts` ingredients array |
| `/the-apothecary/counter` | `counter/page.tsx` | `CounterContext` (static remedy lookup) |
| `/the-apothecary/order-confirmation` | `order-confirmation/page.tsx` | Post-checkout |
| `/the-apothecary/quality-standards` | `quality-standards/page.tsx` | Static `apothecary.ts` |
| `/the-apothecary/laboratory-verification` | `laboratory-verification/page.tsx` | Static `apothecary.ts` |
| `/the-apothecary/faqs` | `faqs/page.tsx` | Static `apothecaryFaqs[]` |

### 6.2 Cross-Department Product Surfaces

| Route | File | Data source |
|-------|------|-------------|
| `/the-register` | `the-register/page.tsx` | `getAllProducts()` + academy entries |
| `/the-academy/materia-medica` | `materia-medica/page.tsx` | `getAllProducts()` with static fallback |

### 6.3 Product Data Pipeline (Current vs Intended)

```
CURRENT:
  Page → getProductBySlug() → productToRemedy() → RemedyMonograph
                              ↑
                    Sanity OR static fallback (fetch.ts)
                    NO Shopify commerce data at render time

INTENDED (Phase 4 Spec 06):
  Page → composeProductView() → ProductView → existing components
                              ↑
                    Sanity editorial + Shopify commerce merged
```

**Finding:** `composeProductView()` is exported from `lib/commerce/index.ts` but **imported by zero pages**. The composition layer is dead code from the frontend's perspective.

### 6.4 Cart / Checkout Flow

- `CounterContext` stores items in **localStorage** (`sunnah-remedies-counter`)
- Line items resolved via `getRemedyBySlug()` from **static remedies only**
- When Shopify configured: syncs to `/api/cart` → Shopify Cart API → `checkoutUrl`
- When not configured: local-only mode with static pricing from remedy objects

---

## 7. All Routes

### 7.1 Route Counts

| Type | Count |
|------|-------|
| Pages (`page.tsx`) | 102 |
| Route handlers (`route.ts`) | 52 |
| Layouts (`layout.tsx`) | 10 |

### 7.2 Public Routes — `[locale]`

| Section | Routes | Notes |
|---------|--------|-------|
| Homepage | `/` | Threshold arrival sequence |
| Institute | `/institute` | |
| Charter | `/charter` | |
| Correspondence | `/correspondence` | |
| Search | `/search` | Algolia via API |
| Calendar | `/calendar` | |
| Consultations | `/consultations` | Booking flow (mock service) |
| Research | `/research` | |
| Press | `/press` | |
| Exhibitions | `/exhibitions` | |
| The Register | `/the-register` | Canonical product index |
| Knowledge Library | `/knowledge-library`, `/[slug]` | Static topics + CMS articles |
| The Apothecary | `/the-apothecary` + 9 sub-routes + `[slug]` | See §6 |
| The Academy | `/the-academy` + 28 sub-routes + `[slug]` | Largest section |
| Sacred Journeys | `/sacred-journeys` + 18 sub-routes + `[slug]` | |
| Membership | `/membership/sign-in`, `/access-denied` | |
| Student Portal | `/portal/student/**` (11 pages) | |
| Practitioner Portal | `/portal/practitioner/**` (12 pages) | |

### 7.3 Non-Locale Routes

| Route | Purpose |
|-------|---------|
| `/knowledge/[type]/[slug]` | Knowledge graph entity pages |
| `/knowledge/citations/[refId]` | Citation resolver |
| `/search` | Global search (duplicate of locale search?) |
| `/feeds/*` | RSS |
| `/sitemaps/*` | XML sitemaps |
| `/llms.txt`, `/llms-full.txt` | LLM discovery |

### 7.4 Staff Routes `(staff)`

| Route | Purpose |
|-------|---------|
| `/sign-in` | Staff auth |
| `/handbook`, `/handbook/[chapter]` | Institutional handbook |
| `/ops`, `/ops/dashboard`, `/ops/goods-in`, `/ops/temperature-log`, `/ops/daily-sign-off` | Operations |
| `/intelligence` | Analytics dashboard |

### 7.5 Studio

| Route | Purpose |
|-------|---------|
| `/studio/[[...tool]]` | Embedded Sanity Studio |

### 7.6 Catch-All

| Route | Purpose |
|-------|---------|
| `[...rest]` | 404 handler |

### 7.7 Missing Routes (Per Architecture Spec)

| Expected route | Spec reference | Status |
|----------------|----------------|--------|
| `/collections/[handle]` | Phase 4 Spec 06 §6.2 | **Not implemented** |
| `/account/*` | Phase 4 Spec 06 §6.2 | **Not implemented** |
| Dedicated `/api/checkout` | Phase 4 Spec 06 §6.2 | **Not implemented** (checkoutUrl via cart) |

---

## 8. Duplicated Code

### 8.1 Section Page Layout (5 variants)

`AcademySectionPage`, `JourneySectionPage`, `StudentSectionPage`, `PractitionerSectionPage` each reimplement the same layout as `ui/SectionPage` with hardcoded department constants and breadcrumb construction. ~250 lines of near-identical JSX.

### 8.2 Breadcrumb Components (2 systems)

| Component | File | Behaviour |
|-----------|------|-----------|
| Global auto breadcrumb | `ui/Breadcrumb.tsx` | Pathname-derived segments; used in locale layout |
| Manual breadcrumb | `apothecary/Breadcrumb.tsx` | Explicit `items[]` prop; used in section pages |

Both render nav + separator + links with different styling and aria labels.

### 8.3 Booking Services (2 backends)

| Module | File | Purpose |
|--------|------|---------|
| Frontend mock | `lib/booking/service.ts` | Hardcoded clinics, fake time slots; used by consultations UI |
| Operations real | `operations/booking/service.ts` | Cal.com API + Drizzle DB; used by ops API + webhooks |

No bridge between them. Consultations page does not use the production booking backbone.

### 8.4 Shopify Integration (2 modules)

| Module | File | Status |
|--------|------|--------|
| Phase 2 stub | `lib/integrations/shopify.ts` | Interface-only placeholder ("DO NOT implement during Phase 2") |
| Phase 4 implementation | `lib/commerce/shopify/*` | Full Storefront/Admin clients, cart, products |

The stub file is stale and potentially confusing.

### 8.5 Product Type Adapters

| Path | Detail |
|------|--------|
| `sanity/lib/adapters.ts` | `productToRemedy()` — Sanity Product → static Remedy type |
| `sanity/lib/fetch.ts` | `getProductBySlug()` falls back to static remedy |
| `lib/content/types.ts` | `Remedy` interface (static era) |
| `sanity/lib/types.ts` | `Product` interface (CMS era) |
| `lib/commerce/composition/types.ts` | `ProductView` (intended unified type) |

Three parallel product type systems; only two are wired; `ProductView` is unused.

### 8.6 Slug Query Duplication

`queries.ts` exports `productSlugsQuery`, `programmeSlugsQuery`, etc. `fetch.ts` reimplements inline GROQ for the same purpose instead of importing the exports.

### 8.7 Static Content Parallel to CMS

Every major content domain has both Sanity schemas/queries AND static TypeScript files:

| Domain | Static | CMS |
|--------|--------|-----|
| Products | `lib/content/remedies/` | `product` schema + queries |
| Programmes | `lib/content/academy/` | `programme` schema + queries |
| Journeys | `lib/content/journeys/` | `journey` schema + queries |
| Knowledge topics | `lib/content/sections/knowledge-library.ts` | `topic`, `article` schemas |
| Navigation | `lib/navigation/site-structure.ts` | `navigation` schema |
| Campus | `lib/content/campus/` | `campusCourse`, `campusLesson` schemas |
| Apothecary sections | `lib/content/sections/apothecary.ts` | Partial CMS (faqs query exists) |

`fetch.ts` is the bridge: Sanity-first with static fallback on every getter.

### 8.8 Database Entry Points

- `src/operations/db/index.ts` — operations tables
- `src/db/index.ts` — community/membership tables
- Both use Drizzle + Neon; single `drizzle.config.ts` merges schemas

---

## 9. Hardcoded Products

### 9.1 Canonical Static Remedy Array

**File:** `src/lib/content/remedies/index.ts`

```typescript
export const remedies: Remedy[] = [blackSeedOil, honey, senna, oliveOil];
```

| Slug | File | Price (static) |
|------|------|----------------|
| `black-seed-oil` | `remedies/black-seed-oil.ts` | Embedded |
| `honey` | `remedies/honey.ts` | Embedded |
| `senna` | `remedies/senna.ts` | Embedded |
| `olive-oil` | `remedies/olive-oil.ts` | Embedded |

### 9.2 Files Referencing Hardcoded Product Slugs (30+)

| Category | Files |
|----------|-------|
| Static content | `remedies/*.ts`, `sections/apothecary.ts`, `sections/knowledge-library.ts` |
| Navigation | `lib/navigation/site-structure.ts` |
| Pages | `the-apothecary/page.tsx` (featured: honey, black-seed-oil, olive-oil) |
| Components | `RemedyMonograph.tsx` (photography map), `BotanicalFigure.tsx` (4 variants) |
| Adapters | `sanity/lib/adapters.ts` (slug → photography heuristics) |
| Cart | `context/CounterContext.tsx` (`getRemedyBySlug`) |
| Journeys | `journeys/desert-way.ts`, `journeys/olive-grove.ts` |
| AI | `ai/surfaces/personalisation/`, `ai/surfaces/translation/` |
| Search | `lib/search/engine.ts`, `lib/search/index-config/content.ts` (synonyms) |
| Scripts | `scripts/validate-schema.ts`, `scripts/seed-danish-cms.ts` |

### 9.3 Impact

- Adding a 5th product requires CMS **and** updating photography maps, botanical figures, search synonyms, featured links, and potentially journey cross-links manually
- Cart cannot resolve CMS-only products when static fallback lacks them
- `productToRemedy()` adapter uses slug heuristics defaulting to `honey` photography for unknown slugs

---

## 10. Hardcoded Categories

### 10.1 Apothecary Ingredient Categories (Static)

**File:** `src/lib/content/sections/apothecary.ts`

Hardcoded `ingredients[]` array with names and hrefs to the four canonical products. Used by `/the-apothecary/ingredients` page despite `ingredient` Sanity schema existing.

### 10.2 Knowledge Library Topics (Static Categories)

**File:** `src/lib/content/sections/knowledge-library.ts`

| Slug | Links to product |
|------|------------------|
| `prophetic-medicine` | — |
| `hijama` | — |
| `black-seed` | `/the-apothecary/black-seed-oil` |
| `honey` | `/the-apothecary/honey` |
| `olive-oil` | `/the-apothecary/olive-oil` |
| `saffron` | "in preparation" |
| `nutrition` | `/knowledge-library/honey` |
| `research` | — |
| `patient-guides` | — |

Also duplicated in `lib/navigation/site-structure.ts` Knowledge Library sections.

### 10.3 Analytics Categories

**File:** `analytics/lib/ecommerce.ts`

Hardcoded `item_category`: `"Apothecary"`, `"Academy"`, `"Sacred Journeys"`.

### 10.4 Sanity `category` Schema

`category` document type exists with name, slug, description. **No frontend query, no page, no filtering by category.**

---

## 11. Hardcoded Collections

### 11.1 RSS Feed Collection Keys

**File:** `src/app/feeds/[collection]/rss.xml/route.ts`

Hardcoded collection slugs: `remedies`, `articles`, `courses`, `journeys`.

### 11.2 Revalidation Type Map

**File:** `src/app/api/revalidate/route.ts`

`TYPE_ROUTE_MAP` maps Sanity types to routes (e.g. `product` → `/the-apothecary`).

### 11.3 Sanity `collection` Schema

`collection` document exists with:
- `products[]`, `featuredProducts[]`
- `shopifyCollectionRef`
- `season` (seasonWindow)

**No collection pages, no GROQ queries, no navigation links.** `composeCollectionView()` exists in commerce layer but is unused.

### 11.4 Shopify Collections

`lib/commerce/shopify/collections.ts` implements `getCollectionCommerce()`. Only called from unused `composeCollectionView()`.

---

## 12. Duplicated UI

### 12.1 Department Section Templates

~55 pages use one of five section page wrappers with identical visual structure:
- Breadcrumb trail
- Left sidebar `DepartmentNav`
- `PageIntro` with folio/title/lede
- Inset body leaf

Only props and hardcoded department differ.

### 12.2 Pull Quote Components

| Component | Location |
|-----------|----------|
| `editorial/PullQuote.tsx` | Static pull quote |
| `editorial/RotatingPullQuote.tsx` | Rotating set |
| `department/RotatingDepartmentPullQuote.tsx` | Department-scoped rotation |
| `arrival/ArrivalPullQuote.tsx` | Homepage-specific |

Four pull quote variants with overlapping behaviour.

### 12.3 Monograph vs Programme vs Journey Page Shells

| Shell | Components | Pattern |
|-------|------------|---------|
| Product | `RemedyMonograph` + `MonographLedger` + `MonographContents` | TOC sidebar + ledger + sections |
| Programme | `ProgrammeView` + `ProgrammeLedger` + `ProgrammeContents` | Same pattern |
| Journey | `JourneyView` + `JourneyRegistrationLedger` + `JourneyContents` | Same pattern |

Three parallel "detail page" architectures with duplicated TOC/ledger/section patterns.

### 12.4 FAQ Rendering

FAQs rendered via:
- Static arrays in `lib/content/sections/apothecary.ts` (apothecary pages)
- Static arrays in journey/academy content files
- CMS `faqsByDepartmentQuery` (available but not universally used)
- `MonographExtras.tsx` (product FAQs from remedy object)

---

## 13. Duplicated Business Logic

### 13.1 Content Fetching with Fallback

**File:** `src/sanity/lib/fetch.ts` (~480 lines)

Every getter (`getProductBySlug`, `getAllProgrammes`, `getNavigation`, etc.) implements:
1. Query Sanity with locale
2. If null → query default locale
3. If still null → return static TypeScript content
4. Adapter transforms CMS type → legacy static type where needed

This pattern duplicates business rules in both CMS adapters and static files.

### 13.2 Pricing Logic

| Source | Where |
|--------|-------|
| Static remedy `price` field | `lib/content/remedies/*.ts` |
| Sanity product `price` field | Schema (editorial note, not commerce truth) |
| Shopify live price | `lib/commerce/shopify/products.ts` |
| Counter subtotal | Computed from static remedy prices in `CounterContext` |

Four pricing sources; no single authority wired to UI.

### 13.3 Inventory / Stock Status

| Source | Where |
|--------|-------|
| Static `inStock` boolean | Remedy objects |
| Sanity `inStock` field | Product schema |
| Shopify `availableForSale` | Commerce layer (unused by pages) |
| Operations inventory | `operations/inventory/service.ts` (internal ops) |

### 13.4 Search Indexing

Properly abstracted (`lib/search/engine.ts` interface → `lib/search/algolia.ts` implementation). Indexers in `lib/search/indexers/`. Not duplicated, but reindex script uses inline GROQ separate from `queries.ts`.

### 13.5 Translation Workflow

Three paths:
- Sanity document internationalization plugin
- `api/sanity/on-source-change` webhook
- `api/sanity/generate-danish-draft` + `scripts/seed-danish-cms.ts`
- Static content has no translation path

---

## 14. Technical Debt

### 14.1 Critical

| Item | Severity | Detail |
|------|----------|--------|
| Composition layer unused | **Critical** | `composeProductView()` built per Phase 4 spec; zero page imports |
| Static content fallback | **Critical** | 65+ files import `lib/content/`; CMS migration incomplete |
| Cart uses static remedies | **Critical** | `CounterContext.getRemedyBySlug()` cannot resolve CMS-only products |
| Dual booking systems | **High** | Mock frontend vs production Cal.com backend |
| Empty Architecture docs | **High** | `docs/Architecture/01–07.md` are 0-byte placeholders |

### 14.2 High

| Item | Detail |
|------|--------|
| `lib/integrations/shopify.ts` stale stub | Conflicts with `lib/commerce/shopify/` |
| Knowledge entity type mismatches | Sitemap and routes use wrong type names |
| `safeFetch` swallows all errors | Silent failures; no observability |
| localStorage cart persistence | Conflicts with Phase 4 spec (server-authoritative cart) |
| Missing ingredient/collection/category queries | Schemas exist without data layer |
| Unused components | ThresholdHero, DepartmentGateway, PaymentForm, RelatedSection |

### 14.3 Medium

| Item | Detail |
|------|--------|
| `globals.css` ~3,600 lines | Monolithic design token + component CSS |
| Five Sanity client configurations | Inconsistent token env var names |
| `api/subscribe` placeholder | TODO comment; not wired to email service |
| Duplicate slug queries | Exported but unused in `queries.ts` |
| `productToRemedy` adapter | Legacy bridge; slug heuristics default to honey |
| Phase 2 audit outdated | Reports 38 schemas; now 70 |
| No ESLint config file | Only `eslint-config-next` in package.json |
| `vercel.json` empty `{}` | No deployment config |

### 14.4 Low

| Item | Detail |
|------|--------|
| `lib/content/volumes/` | Volume I content files; only referenced in library.ts comment |
| Windows temp file in Architecture | `~$nnah_execution_plan.docx` committed |
| Test coverage sparse | Only `tests/ai/` and `tests/community/` |

---

## 15. Folder Organisation Issues

### 15.1 Split Concerns

| Issue | Detail |
|-------|--------|
| `analytics/` at root | Not in `src/`; imported relatively from app layout |
| `middleware.ts` at root | Conventionally fine, but splits from `src/` |
| `lib/content/` vs `sanity/` | Parallel content systems without clear deprecation path |
| `lib/booking/` vs `operations/booking/` | Frontend mock vs backend real |
| `lib/integrations/` vs `lib/commerce/` | Stale stub vs implementation |
| `db/` vs `operations/db/` | Two Drizzle schemas, two entry points |
| `docs/Architecture/` vs `docs/architecture/` | Case-insensitive duplicate on macOS; both exist with same empty files |

### 15.2 Phase 4 Spec vs Actual Structure

| Spec proposed | Actual |
|---------------|--------|
| `app/(shop)/apothecary/[handle]/` | `app/[locale]/the-apothecary/[slug]/` |
| `app/(shop)/collections/[handle]/` | **Missing** |
| `app/(shop)/cart/` | `app/[locale]/the-apothecary/counter/` |
| `lib/commerce/composition/` consumed by routes | **Exists but unused** |
| `components/` read-only | Correct — components not modified for commerce |

Route naming differs (institutional framing vs `(shop)` group) but is intentional. The missing collection routes and unused composition layer are gaps.

### 15.3 Component Organisation

Components organised by department (`apothecary/`, `academy/`, `journeys/`) rather than by abstraction level. Shared primitives in `ui/` but department-specific section pages duplicate `ui/SectionPage`.

### 15.4 Scripts & Tooling

`scripts/` at root (appropriate). No dedicated `tests/` mirror of source structure.

---

## 16. Modularisation Opportunities

### 16.1 Priority 1 — Content Layer Unification

| Action | Benefit |
|--------|---------|
| Wire pages to `composeProductView()` | Single product data pipeline with Shopify commerce |
| Replace `productToRemedy()` with `ProductView` props | Eliminate adapter layer |
| Migrate `CounterContext` to use composed product data | Cart works for all CMS products |
| Add GROQ for `ingredient`, `collection`, `category` | Activate existing schemas |
| Deprecate static remedies with feature flag | Controlled migration off `lib/content/remedies/` |

### 16.2 Priority 2 — Component Consolidation

| Action | Benefit |
|--------|---------|
| Unify 5 section page wrappers into configurable `SectionPage` | ~200 lines removed |
| Extract shared DetailPage shell (TOC + ledger + sections) | RemedyMonograph/ProgrammeView/JourneyView share 60% structure |
| Consolidate pull quote components | Single component with variants |
| Merge breadcrumb systems or define clear usage rules | Eliminate dual breadcrumb |

### 16.3 Priority 3 — Service Layer

| Action | Benefit |
|--------|---------|
| Bridge consultations UI to `operations/booking/service` | Single booking backbone |
| Delete `lib/integrations/shopify.ts` stub | Remove confusion |
| Centralise Sanity client creation | One factory, consistent token names |
| Move `analytics/` into `src/analytics/` | Consistent import paths |

### 16.4 Priority 4 — Data Layer

| Action | Benefit |
|--------|---------|
| Implement collection routes + queries | Activate collection schema |
| Fix knowledge entity type names in sitemap/routes | Prevent missing pages |
| Use exported slug queries in `fetch.ts` | DRY GROQ |
| Add error logging to `safeFetch` | Observability for CMS failures |

### 16.5 Priority 5 — Documentation

| Action | Benefit |
|--------|---------|
| Populate `docs/Architecture/01–07.md` | Architecture docs currently empty |
| Mark static content files as deprecated | Clear migration path |
| Update Phase 2 audit or supersede with this document | Accurate baseline |

---

## 17. Architecture Document Comparison

### 17.1 `docs/Architecture/` Status

| File | Size | Status |
|------|------|--------|
| `01-vision.md` | 0 bytes | **Empty placeholder** |
| `02-system-architecture.md` | 0 bytes | **Empty placeholder** |
| `03-content-model.md` | 0 bytes | **Empty placeholder** |
| `04-folder-structure.md` | 0 bytes | **Empty placeholder** |
| `05-components.md` | 0 bytes | **Empty placeholder** |
| `06-roadmap.md` | 0 bytes | **Empty placeholder** |
| `07-development-standards.md` | 0 bytes | **Empty placeholder** |
| `sunnah_execution_plan.docx` | 40 KB | Populated (binary, not auditable in diff) |

**Comparison against empty documents is not possible.** Analysis below uses Phase 4 Part 2 Master Architecture Spec, Phase 4 Folder Structure spec, and Phase 1 CMS Architecture doc.

### 17.2 Phase 4 Master Architecture (00-Master-Architecture-Spec.md)

| Requirement | Status | Gap |
|-------------|--------|-----|
| Sanity owns editorial | **Partial** | Static fallback still authoritative for 4 products |
| Shopify owns commerce | **Partial** | Layer built; not wired to product pages |
| Stripe for institutional payments | **Implemented** | `/api/payments` exists |
| Cloudinary for media | **Implemented** | Loader + Sanity mediaAsset schema |
| Join key (Sanity ↔ Shopify) | **Schema exists** | `commerceReference` on product; composition unused |
| Two transaction paths (Shopify checkout + Stripe) | **Implemented** | Cart → checkoutUrl; payments API for institutional |
| Feature flags | **Implemented** | `operations/engine/feature-flags.ts` |
| Frontend not redesigned | **Compliant** | No redesign in commerce phase |
| Composition at render time | **Not compliant** | Pages skip composition layer |

### 17.3 Phase 4 Folder Structure (06-Folder-Structure-and-Components.md)

| Requirement | Status | Gap |
|-------------|--------|-----|
| All Shopify/Stripe in `lib/commerce/` | **Compliant** | Correctly isolated |
| `components/` read-only | **Compliant** | |
| Composition layer consumed by routes | **Not compliant** | Zero imports from pages |
| Collection routes | **Missing** | |
| Account routes | **Missing** | |
| Typed view models (ProductView) | **Defined but unused** | |
| Server-authoritative cart | **Partial** | localStorage fallback in local mode |
| Webhook receivers with verify + idempotency | **Compliant** | |

### 17.4 Phase 1 CMS Architecture (06-CMS-Architecture.md)

| Requirement | Status | Gap |
|-------------|--------|-----|
| Sanity as sole CMS | **Not compliant** | Static `lib/content/` parallel layer |
| All GROQ in `src/sanity/lib/queries.ts` | **Not compliant** | 35+ inline queries elsewhere |
| Schema organisation by department | **Compliant** | Well structured |
| Studio at `/studio` | **Compliant** | |
| i18n via document internationalization | **Compliant** | 21 translatable types |
| Cloudinary integration | **Implemented** (exceeds "Future" note) | |

### 17.5 Phase 1 Institutional Rebuild (CURSOR-INSTITUTIONAL-REBUILD.md)

| Requirement | Status | Gap |
|-------------|--------|-----|
| One institution, four pillars | **Mostly compliant** | Route structure reflects pillars |
| One design system | **Compliant** | Shared tokens, components |
| One navigation model | **Partial** | CMS nav with static fallback |
| Cross-reference by default | **Partial** | Schema supports relationships; not all pages use them |
| `/docs/_audit/current-state.md` | **Missing** | Required by rebuild doc; never created |
| Map before editing | **This audit fulfils that requirement** | |

### 17.6 Compliance Summary

| Architecture area | Compliance |
|-------------------|------------|
| Commerce isolation (`lib/commerce/`) | ✅ Good |
| Commerce wiring to frontend | ❌ Missing |
| CMS as sole content source | ❌ Dual layer |
| Schema design | ✅ Good |
| Query centralisation | ⚠️ Partial |
| Component architecture | ⚠️ Duplicated section pages |
| Operations engine | ✅ Good |
| AI platform | ✅ Good |
| Architecture documentation | ❌ Empty files |

---

## Appendix A: File Counts

| Category | Count |
|----------|-------|
| TypeScript/TSX files (total) | ~620 |
| Pages | 102 |
| Route handlers | 52 |
| Layouts | 10 |
| Components (.tsx) | 101 |
| Sanity schema types | 70 |
| Named GROQ queries | 27 |
| Inline GROQ locations | 35+ |
| Static content files | 37 |
| Commerce module files | 31 |
| API route groups | 9 |

## Appendix B: Static Content Import Sites

65+ files import from `@/lib/content/` including:
- All apothecary section pages (quality-standards, faqs, ingredients, etc.)
- All academy section pages (curriculum, policies, equipment, etc.)
- All journey section pages (packing, preparation, policies, etc.)
- `sanity/lib/fetch.ts` (fallback layer)
- `context/CounterContext.tsx` (cart)
- Multiple components (MonographLedger, RemedyMonograph, ProgrammeView, etc.)

## Appendix C: Environment & Config Files

| File | Purpose |
|------|---------|
| `next.config.ts` | next-intl, image domains, redirects |
| `middleware.ts` | i18n + auth |
| `sanity.config.ts` | Studio config |
| `drizzle.config.ts` | Dual schema paths |
| `tsconfig.json` | Strict, `@/*` alias |
| `postcss.config.mjs` | Tailwind v4 |
| `.env.example`, `.env.local.example` | Env templates |

---

*End of audit. No code was modified.*
