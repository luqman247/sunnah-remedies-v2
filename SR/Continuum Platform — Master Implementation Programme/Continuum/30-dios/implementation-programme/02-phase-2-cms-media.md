# Continuum Platform — P2: CMS & Media

> **Part of:** Continuum Platform Master Implementation Programme
>
> **Specification reference:** Spec Phase 2 (§19), §6 (CMS) and §7 (Media), plus module specs §4.3 and §4.4.
>
> **Duration:** 2 weeks · **Tier:** Foundation

Enable structured, versioned, typed content (CMS) and governed media (Cloudinary pipeline). Editors can model, preview, and publish; publishing emits events for later indexing/embedding.

---

## Objectives

- Implement the CMS module (§4.3) with the base content schema (§6.1) as portable, typed documents.
- Implement the editorial lifecycle: draft → preview → review/approval → publish → version/rollback (§6.2).
- Implement the Media module (§4.4) and the Cloudinary pipeline (§7) with governed metadata.
- Emit content.published / media.uploaded events for downstream Search/Knowledge (activated in Phase 4).
- Scaffold content internationalisation (translatable fields, locale-aware references, RTL support) (§6.3).

## Deliverables

- modules/cms with schemas, lifecycle, preview, and a typed read interface.
- modules/media with upload, transformation, responsive derivatives, and metadata governance.
- Sanity project wired via the CMS interface; Cloudinary wired via the media adapter.
- Editorial Guide published (§18).

## Repository changes

- Add modules/cms and modules/media as bounded-context packages.
- Implement the storage/media adapter against Cloudinary in packages/adapters.
- Add content preview route to apps/shell (signed preview surface).
- Add alt-text-required accessibility gate to media handling.

## Folder structure

```
modules/
├── cms/
│   ├── schema/         # Page, Article, Product, Course, Event, Person/Team,
│   │                   # Research, Download, Media(ref), Navigation, SEO, Reference
│   ├── lifecycle/      # draft/preview/review/publish/version
│   ├── query/          # typed read surface (GROQ/typed)
│   └── interface/      # content.query / content.preview / events
└── media/
    ├── pipeline/       # upload, transform, responsive derivatives
    ├── metadata/       # alt text, credits, licensing, AI tags
    ├── library/        # media library surface
    └── interface/      # media.asset / media.upload / events
```

## Modules affected

- CMS (§4.3) — implemented
- Media (§4.4) — implemented
- Core (events) — consumed
- Design System — consumed for preview rendering

## Interfaces to implement

- content.query(type, filter) — typed read of published content.
- content.preview(token) — draft rendering for editors.
- Events: content.published, content.unpublished, content.updated.
- media.asset(id) — resolved, transformable asset.
- media.upload(file, meta) — governed asset record.
- Events: media.uploaded, media.tagged.

## External services

- Sanity (structured content backend).
- Cloudinary (media transformation & delivery) via the media adapter.

## Environment variables

| Variable | Purpose | Required |
| --- | --- | --- |
| SANITY_PROJECT_ID | Sanity project. | yes |
| SANITY_DATASET | Sanity dataset (per environment). | yes |
| SANITY_API_TOKEN | Server-side read/write token (secret manager). | yes |
| SANITY_PREVIEW_SECRET | Signs the preview surface. | yes |
| CLOUDINARY_CLOUD_NAME | Cloudinary account. | yes |
| CLOUDINARY_API_KEY | Cloudinary key (secret manager). | yes |
| CLOUDINARY_API_SECRET | Cloudinary secret (secret manager). | yes |

## Acceptance criteria

- Editors can model, draft, preview, and publish every base content type.
- Publishing versions the document and emits content.published.
- Media transforms on delivery, ships responsive derivatives, and meets image budgets.
- Alt text is required; missing alt text fails the accessibility gate.
- Content presentation is fully separated from content (no HTML stored in documents).

## Testing requirements

- Unit: schema validation, lifecycle transitions, query typing, media metadata governance.
- Integration: publish → event emitted; upload → derivative generated; preview → draft rendered via signed surface.
- Accessibility: alt-text-required gate on media; rendered content passes axe via the design system.

## Production readiness checklist

- [ ] Preview surface is signed (SANITY_PREVIEW_SECRET); no unsigned draft exposure.
- [ ] Media secrets in the secret manager; no keys in client bundles.
- [ ] Image/video budgets enforced; derivatives cached at the CDN.
- [ ] content.published events observable in logs for downstream consumers.
- [ ] Rollback: any prior content version restorable.

## Risks

| Risk | Description | Mitigation |
| --- | --- | --- |
| Schema lock-in | Early schema shapes become hard to change once content exists. | Design schemas as additive; use references over embedding; version schema changes with migrations. |
| Preview leakage | Draft content visible publicly. | Sign the preview surface and scope it to authenticated editors. |
| Media cost/perf | Unbounded transformations inflate cost and latency. | Enforce budgets; cache derivatives; restrict transformation params to a safe allow-list. |
| Presentation creep | Editors embed HTML/styling in content. | Structured fields only; block rich HTML; render via design-system patterns. |

## Dependencies

- Phase 0 (Core, events, adapters).
- Phase 1 (design system for preview rendering and content patterns).

## Documentation updates

- Publish the Editorial Guide (§18): content modelling, workflow, localisation, publishing without developers.
- Document the CMS and Media interface contracts.
- ADR: content-modelling approach (references vs embedding) and preview signing.
- Update Developer Guide with 'consuming content via content.query' patterns.

---

## Milestones & tasks

### Milestone 2.1 — CMS foundation & schema

**Objective.** The base content schema exists as typed, portable documents.

#### Task 2.1.1 — Provision Sanity and wire the CMS interface shell

- **Inputs:** Spec §4.3; Sanity credentials.
- **Outputs:** modules/cms connects to Sanity; a typed content.query stub returns real data.
- **Files created:** `modules/cms/interface/`, `modules/cms/query/`
- **Files modified:** `packages/config (Sanity env)`
- **Verification steps:**
  - A test query returns documents.
  - Interface exposes only content.query/preview, not Sanity internals.
- **Manual QA steps:**
  - Confirm no Sanity client is importable outside modules/cms.

#### Task 2.1.2 — Author core content-type schemas (batch 1)

- **Inputs:** Spec §6.1 (Page, Article, Product, Person/Team, Media ref).
- **Outputs:** Typed schemas for Page, Article, Product, Person/Team, and Media references with relationships.
- **Files created:** `modules/cms/schema/{page,article,product,person,media-ref}`
- **Files modified:** `cms schema index`
- **Verification steps:**
  - Schemas validate.
  - Relationships resolve (Article→Person, Product→Media).
- **Manual QA steps:**
  - Create one of each in the editor; confirm references link correctly.

#### Task 2.1.3 — Author core content-type schemas (batch 2)

- **Inputs:** Spec §6.1 (Course, Event, Research, Download, Navigation, SEO, Reference).
- **Outputs:** Typed schemas for the remaining base types with SEO and Reference (integrity-aware) fields.
- **Files created:** `modules/cms/schema/{course,event,research,download,navigation,seo,reference}`
- **Files modified:** `cms schema index`
- **Verification steps:**
  - All base types present per §6.1.
  - Reference type carries provenance fields.
- **Manual QA steps:**
  - Confirm the full type list matches §6.1 with no omissions.

#### Task 2.1.4 — Implement the typed read query surface

- **Inputs:** Spec §4.3 content.query.
- **Outputs:** content.query(type, filter) returns typed published content only.
- **Files created:** `modules/cms/query/ (typed accessors)`
- **Files modified:** `cms interface`
- **Verification steps:**
  - Only published docs are returned by default.
  - Types flow to callers.
- **Manual QA steps:**
  - Query as an anonymous consumer; confirm drafts are excluded.

### Milestone 2.2 — Editorial lifecycle & preview

**Objective.** The governed draft→publish lifecycle with signed preview and versioning.

#### Task 2.2.1 — Implement draft/publish lifecycle and versioning

- **Inputs:** Spec §6.2 lifecycle states.
- **Outputs:** Documents move draft→publish; every publish creates a restorable version.
- **Files created:** `modules/cms/lifecycle/`
- **Files modified:** `cms interface`
- **Verification steps:**
  - Publish creates a version.
  - A prior version is restorable.
- **Manual QA steps:**
  - Publish, edit, republish, then roll back; confirm the restored content.

#### Task 2.2.2 — Implement the signed preview surface

- **Inputs:** Spec §6.2 preview; SANITY_PREVIEW_SECRET.
- **Outputs:** A signed preview route in apps/shell renders drafts for authenticated editors only.
- **Files created:** `apps/shell preview route`, `modules/cms preview handler`
- **Files modified:** `cms interface (content.preview)`
- **Verification steps:**
  - Valid signature renders draft.
  - Invalid/absent signature is rejected.
- **Manual QA steps:**
  - Attempt preview without a signature; confirm rejection.

#### Task 2.2.3 — Add review/approval hooks

- **Inputs:** Spec §6.2 review/approval (Governance may gate later).
- **Outputs:** A review state and approval transition; a hook point for Governance (activated Phase 8).
- **Files created:** `modules/cms/lifecycle/ (review)`
- **Files modified:** `cms interface`
- **Verification steps:**
  - Content can require approval before publish.
  - The Governance hook is present but inert until Phase 8.
- **Manual QA steps:**
  - Route a document through review→approve→publish; confirm gating works.

#### Task 2.2.4 — Emit content lifecycle events

- **Inputs:** Spec §4.3 events; Core event bus.
- **Outputs:** content.published/unpublished/updated emitted on transitions.
- **Files created:** —
- **Files modified:** `modules/cms/lifecycle`, `cms interface`
- **Verification steps:**
  - Publishing emits content.published with document ref.
  - Unpublish/update emit their events.
- **Manual QA steps:**
  - Subscribe a temporary logger; publish; confirm the event and payload.

### Milestone 2.3 — Media pipeline

**Objective.** Governed media with transformation, derivatives, and required metadata.

#### Task 2.3.1 — Implement the Cloudinary media adapter

- **Inputs:** Spec §2 portability; §7 pipeline; Cloudinary credentials.
- **Outputs:** The storage/media adapter resolves to Cloudinary behind the media interface.
- **Files created:** `packages/adapters/media-cloudinary/`
- **Files modified:** `packages/adapters index`
- **Verification steps:**
  - Upload returns a governed asset record.
  - No Cloudinary SDK leaks outside the adapter.
- **Manual QA steps:**
  - Upload a test image; confirm it lands and returns a transformable reference.

#### Task 2.3.2 — Implement transformation & responsive derivatives

- **Inputs:** Spec §7 (transformation on delivery, responsive images, focal points).
- **Outputs:** media.asset(id) yields responsive sources with format/quality negotiation and focal-point crops.
- **Files created:** `modules/media/pipeline/`
- **Files modified:** `media interface`
- **Verification steps:**
  - Modern formats served per client.
  - Focal point holds the subject across breakpoints.
- **Manual QA steps:**
  - Render an asset at several sizes; confirm crop and format are correct.

#### Task 2.3.3 — Enforce governed metadata (alt text, credits, licensing)

- **Inputs:** Spec §7 governed metadata; §5.4 a11y.
- **Outputs:** Alt text, credits, and licensing are required; missing alt text fails the a11y gate.
- **Files created:** `modules/media/metadata/`
- **Files modified:** `media interface`, `CI a11y gate`
- **Verification steps:**
  - Asset without alt text is blocked at publish.
  - Metadata persists with the asset.
- **Manual QA steps:**
  - Try to publish content referencing an asset lacking alt text; confirm the block.

#### Task 2.3.4 — Build the media library surface and emit events

- **Inputs:** Spec §4.4 media library; AI tagging seam (tagging model wired in Phase 4).
- **Outputs:** A media library listing with collections; media.uploaded/tagged events emitted (tagging inert until Phase 4).
- **Files created:** `modules/media/library/`
- **Files modified:** `media interface`
- **Verification steps:**
  - Library lists governed assets.
  - media.uploaded emitted on upload.
- **Manual QA steps:**
  - Upload several assets; confirm they appear in the library with metadata.

### Milestone 2.4 — Content i18n scaffolding & Editorial Guide

**Objective.** Localisation-ready content and published editorial documentation.

#### Task 2.4.1 — Add translatable fields and locale-aware references

- **Inputs:** Spec §6.3 content i18n (full i18n module in Phase 8).
- **Outputs:** Schemas support translatable fields and locale-aware references; RTL content stored correctly.
- **Files created:** —
- **Files modified:** `modules/cms/schema/*`, `cms query`
- **Verification steps:**
  - A field can hold multiple locales.
  - RTL content persists without corruption.
- **Manual QA steps:**
  - Author an Arabic (RTL) article field; confirm storage and retrieval fidelity.

#### Task 2.4.2 — Publish the Editorial Guide and interface docs

- **Inputs:** Spec §18 Editorial Guide; CMS/Media interfaces.
- **Outputs:** Editorial Guide published; CMS and Media interface contracts documented.
- **Files created:** —
- **Files modified:** `docs/guides/editorial.md`, `module interface docs`
- **Verification steps:**
  - Guide covers modelling, workflow, localisation, publishing.
  - Interface docs match implemented contracts.
- **Manual QA steps:**
  - A non-developer follows the guide to publish a page end to end.

