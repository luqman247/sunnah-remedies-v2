# Daily Dhikr — Architecture Documentation

Branch: `feature/dhikr-architecture`
Status: architecture-only. No production code, routes, Sanity schemas, or Islamic content have been created under this initiative.

## What this folder is

`docs/dhikr/` is the complete gap-architecture pack for a future "Daily Dhikr" reading/reciting feature. It exists because no Dhikr-specific architecture existed anywhere in the repository prior to this branch (confirmed by full-repo audit — see [00-existing-system-audit.md](00-existing-system-audit.md)).

It is written to be detailed enough that an implementer (human or AI-assisted) can build each section later without re-deriving the product vision from scratch. Where a decision genuinely depends on scholarly input (source verification, translation accuracy, category framing), that dependency is called out explicitly rather than guessed at.

## What this folder is not

- Not a rebuild of the general Sunnah Remedies brand system, design manuals, logo guidance, or design tokens — those already exist and are referenced, not duplicated.
- Not a rebuild of the Engineering OS (`engineering-os/`).
- Not a rebuild of the localisation architecture (`src/i18n/`, `src/messages/`) — the Dhikr localisation plan here only defines what new message-key *namespace* would be needed, not a new system.
- Not a general repository audit — [00-existing-system-audit.md](00-existing-system-audit.md) is scoped strictly to systems a Dhikr feature would plug into.

## Restrictions honored throughout this pack

- Documentation only — no `.ts`/`.tsx` production code, no Next.js route files, no Sanity schema files.
- No Arabic text, no hadith citations or gradings, no repetition counts.
- No translations (EN or DA) written.
- No unverified religious claims of any kind.
- No changes outside `docs/dhikr/`.
- No duplication of existing brand system, design manuals, localisation system, department components, or Engineering OS.

Anywhere a document needs to reference specific dhikr content (an example category, a sample field, a v1 register entry), it uses placeholders explicitly marked `[Pending scholarly input]` rather than real content.

## Reading order

| # | Document | Covers |
|---|---|---|
| 00 | [Existing-System Audit](00-existing-system-audit.md) | What already exists and will be reused |
| 01 | [Product Scope](01-product-scope.md) | Goals, non-goals, audience, success criteria |
| 02 | [Information Architecture](02-information-architecture.md) | Page hierarchy, navigation, department integration |
| 03 | [Authenticity & Scholarly Review Policy](03-authenticity-and-scholarly-review-policy.md) | How content gets sourced, verified, and approved |
| 04 | [Content Schema (shape only)](04-dhikr-content-schema.md) | Field names/types — no data |
| 05 | [Category Taxonomy](05-category-taxonomy.md) | Organisational labels |
| 06 | [Reader Experience Specification](06-reader-experience-specification.md) | Reading UX and session flow |
| 07 | [Repeat Counter Specification](07-repeat-counter-specification.md) | Generic counter mechanism |
| 08 | [Memorisation System](08-memorisation-system.md) | Progress tracking design |
| 09 | [Arabic Content Presentation](09-arabic-content-presentation.md) | Typography/RTL rendering rules |
| 10 | [Audio Review & Delivery](10-audio-review-and-delivery.md) | Recitation pipeline |
| 11 | [Route & Component Map](11-route-and-component-map.md) | URL structure, component reuse |
| 12 | [Sanity Integration Plan](12-sanity-integration-plan.md) | CMS integration approach |
| 13 | [Localisation Plan](13-localisation-plan.md) | Message-key namespace plan |
| 14 | [SEO & Sharing](14-seo-and-sharing.md) | Metadata and JSON-LD strategy |
| 15 | [Accessibility Requirements](15-accessibility-requirements.md) | a11y for Arabic/RTL/audio/counter |
| 16 | [Privacy & Local Storage Policy](16-privacy-and-local-storage-policy.md) | What progress data is stored, and where |
| 17 | [Test & Validation Plan](17-test-and-validation-plan.md) | Testing strategy |
| 18 | [v1 Content Register](18-v1-content-register.md) | Placeholder slots for launch content |
| 19 | [Implementation Roadmap](19-implementation-roadmap.md) | Phased build plan |
| 20 | [Risk Register](20-risk-register.md) | Known risks and mitigations |
| 21 | [Decision Log](21-decision-log.md) | Running ADR-style log |
