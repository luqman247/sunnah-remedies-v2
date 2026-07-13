# 00 — Existing-System Audit

Purpose: confirm what already exists in the repository that a Daily Dhikr feature would reuse, so the rest of this pack never re-specifies systems that are already built and general-purpose. Every row below was verified directly against the repository on `feature/dhikr-architecture` (branched from `main` @ `79f2ef4`).

## Reuse table

| System | Location | Verified state | Reuse posture for Dhikr |
|---|---|---|---|
| Department navigation | `src/components/ui/DepartmentNav.tsx` | Exists, general | Reuse as-is if Dhikr is surfaced as a department-level destination |
| Department hero/section/feature components | `src/components/department/DepartmentHero.tsx`, `DepartmentSection.tsx`, `DepartmentFeature.tsx`, `DepartmentStatement.tsx`, `RotatingDepartmentPullQuote.tsx` | Exist, general | Compose these for Dhikr landing rather than building new hero/section primitives |
| Department gateway / arrival card | `src/components/threshold/DepartmentGateway.tsx`, `src/components/arrival/DepartmentCard.tsx` | Exist, general | Reuse for homepage-level entry point into Dhikr |
| Department Sanity schema | `src/sanity/schemas/documents/global/department-card.ts` | Exists, general (fields: `order`, `nameEn`, `nameAr`, `standfirst`, `href`, ...) | Pattern to follow (not duplicate) when a Dhikr content schema is eventually authored — see [04](04-dhikr-content-schema.md) and [12](12-sanity-integration-plan.md) |
| Audio asset schema | `src/sanity/schemas/documents/global/audio-asset.ts` | Exists, general | Pattern to follow for any Dhikr recitation asset — see [10](10-audio-review-and-delivery.md) |
| Content-volume pattern | `src/lib/content/volumes/volume-i/supplication.ts` | Exists — theme file for "Supplication," references dhikr only in a code comment | Not a Dhikr system; the only place "dhikr" appears anywhere in the repo prior to this branch |
| Localisation architecture | `src/i18n/locales.ts`, `routing.ts`, `request.ts`, `navigation.ts`; `src/messages/en.json`, `da.json` | Exists, general, EN/DA complete | Reuse the system; only a new message-key namespace is needed — see [13](13-localisation-plan.md) |
| Design tokens | `src/lib/tokens.ts`, `src/components/motion/motionTokens.ts`, `Logo/tokens.json` | Exist, general | Reuse directly, no Dhikr-specific tokens needed |
| Brand assets / logo | `Logo/`, `public/brand/` | Exist, general (full icon/lockup/print/social set) | Reuse directly |
| Design manuals | `Sunnah-Remedies-Design-Manual.md`, `Photography-Art-Direction-Manual.md` | Exist, general | Reuse directly; typography rules referenced in [09](09-arabic-content-presentation.md) |
| SEO schema helpers | `src/lib/seo/schema/*` (`product.ts`, `article.ts`, `medical.ts`, `course.ts`, `content.ts`) | Exist, general | Reuse pattern for Dhikr JSON-LD — see [14](14-seo-and-sharing.md) |
| Structured-data CI validator | `scripts/validate-schema.ts` | Exists, general | Extend later rather than build a parallel validator — see [17](17-test-and-validation-plan.md) |
| Metadata localisation scripts | `scripts/localize-page-metadata.ts`, `scripts/pages-metadata-en.json` | Exist, general | Reuse pattern once Dhikr pages exist |
| Analytics/tracking plan | `analytics/tracking-plan.yaml`, `analytics/event-taxonomy.md` | Exist, general | Extend with Dhikr-specific events later, don't fork a parallel system |
| Architecture decision-log precedent | `docs/Phase 4/phase-4-architecture-decisions.md` | Exists, Phase-4-scoped | Format precedent for [21-decision-log.md](21-decision-log.md), not reused directly (Dhikr gets its own scoped log) |
| Engineering OS | `engineering-os/10-design`, `30-build`, `40-verify`, `90-reference` | Exists, general | Not modified; Dhikr roadmap in [19](19-implementation-roadmap.md) is written to slot into these phases conceptually, without editing Engineering OS files |

## Confirmed gap

Prior to this branch, `docs/dhikr/` did not exist, and no other file in the repository specifies Dhikr-specific product scope, content schema, taxonomy, reader UX, counter/memorisation mechanics, Arabic presentation rules, audio pipeline, routing, Sanity integration, localisation namespace, SEO, accessibility, privacy, testing, roadmap, risk, or decisions. This pack fills that gap; it duplicates none of the systems in the table above.
