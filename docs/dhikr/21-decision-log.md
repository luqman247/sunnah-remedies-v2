# 21 — Decision Log

ADR-style running log, scoped to Dhikr architecture decisions only. Format follows the precedent set by `docs/Phase 4/phase-4-architecture-decisions.md` (see [00-existing-system-audit.md](00-existing-system-audit.md)), applied as a new, separately-scoped log rather than appending to that Phase 4 file.

---

## ADR-001 — Dhikr is a standalone Sunnah Remedies department

**Status**: Decided
**Context**: [02-information-architecture.md](02-information-architecture.md) raised department-level vs. sub-section placement as an open question.
**Decision**: Dhikr is treated as a standalone department-level destination, reusing `DepartmentNav`, `DepartmentGateway`, `DepartmentCard`, and the `department-card` Sanity schema pattern (see [00](00-existing-system-audit.md), [11](11-route-and-component-map.md)).
**Rationale**: Dhikr is an ongoing, distinct daily-practice offering rather than a feature that topically nests inside an existing department; department-level placement gives it the same top-level navigational visibility as other departments and avoids overloading an unrelated department's information architecture.
**Assumption flag**: this is a product decision for this architecture pack, not derived directly from repository evidence beyond the existence of a reusable department pattern — flagged for product-owner confirmation before Phase 3 routing work begins (see [19](19-implementation-roadmap.md), [20-risk-register.md](20-risk-register.md) R-08).

## ADR-002 — Browser-based, not a downloadable app

**Status**: Decided
**Decision**: Dhikr ships as pages within the existing Next.js site, not as a native or downloadable application.
**Rationale**: repository evidence — the entire existing product (department system, i18n, Sanity CMS integration, per [00](00-existing-system-audit.md)) is a Next.js web app with no downloadable-app precedent anywhere in the repository. Staying browser-based reuses the full existing routing, i18n, design-token, and component architecture (see [11-route-and-component-map.md](11-route-and-component-map.md)) instead of requiring a separate technical stack and distribution channel.

## ADR-003 — Account-free for v1

**Status**: Decided
**Decision**: no login or account requirement for any Dhikr v1 functionality.
**Rationale**: stated as a non-goal in [01-product-scope.md](01-product-scope.md); keeps friction low for a reading/reciting feature and avoids the consent and data-retention obligations an account system would introduce. Directly enables ADR-005.

## ADR-004 — Non-gamified

**Status**: Decided
**Decision**: no streaks, badges, leaderboards, or social comparison of counts or progress.
**Rationale**: stated as a non-goal in [01](01-product-scope.md), [07-repeat-counter-specification.md](07-repeat-counter-specification.md), and [08-memorisation-system.md](08-memorisation-system.md). The product intent is a calm, private practice tool; gamification mechanics would conflict with the unhurried reading experience specified in [06-reader-experience-specification.md](06-reader-experience-specification.md).

## ADR-005 — Local-storage-first

**Status**: Decided
**Decision**: repeat-counter and memorisation-progress data are stored in browser local storage, not a server-side database, for v1.
**Rationale**: direct consequence of ADR-003 — without an account, there is no reliable per-visitor server-side identity to key personal data against. Local storage keeps the v1 data model simple and avoids the privacy/consent obligations a server-held personal record would carry (see [16-privacy-and-local-storage-policy.md](16-privacy-and-local-storage-policy.md)).

## ADR-006 — Subject to scholarly approval before any religious content is published

**Status**: Decided, non-negotiable for this architecture phase
**Decision**: no dhikr content — Arabic text, translation, transliteration, grading, repetition count, or audio — is published until it clears the full review pipeline defined in [03-authenticity-and-scholarly-review-policy.md](03-authenticity-and-scholarly-review-policy.md).
**Rationale**: this is the load-bearing decision underneath the entire pack. [20-risk-register.md](20-risk-register.md) (R-01) identifies unreviewed-content publication as the single most severe risk this feature carries. The `reviewStatus` gating in [04](04-dhikr-content-schema.md)/[12](12-sanity-integration-plan.md) and the release-blocking test in [17-test-and-validation-plan.md](17-test-and-validation-plan.md) exist specifically to enforce this decision technically, not just as policy on paper.

## ADR-007 — Dhikr schemas live under `documents/dhikr/`

**Status**: Decided (Phase 2 implementation)
**Decision**: `dhikrItem` and `dhikrCategory` are defined under `src/sanity/schemas/documents/dhikr/`, a new subfolder, registered in `src/sanity/schemas/index.ts` in a dedicated "Dhikr" section. Neither is added to the custom Studio desk structure (`src/sanity/structure/index.ts`).
**Rationale**: matches the per-department subfolder convention already used for `apothecary/`, `academy/`, `journeys/`, `clinical/`. Not adding desk-structure entries matches the precedent set by `clinicalProtocol`/`practitionerResource`, which also rely on Sanity's default document listing rather than custom placement.
**Resolves**: OD-04.

## ADR-008 — Reuse `sourceReference` and `boardApproval` instead of bespoke fields

**Status**: Decided (Phase 2 implementation)
**Decision**: `dhikrItem.sourceReferences` is `array of sourceReference` (the existing object). `dhikrItem.boardApprovals` is `array of boardApproval` (the existing object), requiring both a `scholarly`-board and an `editorial`-board entry, each `approved: true`, before `reviewStatus` can reach `published`.
**Rationale**: repository inspection during Phase 2 found `sourceReference` already encodes citation + hadith grading + the "unverified attribution" rule, and `boardApproval` already has "Scholarly Review Board" and "Editorial" as board options — both are strictly better fits than the `sourceCitation`/`gradingNote`/`reviewerId`/`reviewDate` fields originally proposed in [04-dhikr-content-schema.md](04-dhikr-content-schema.md), which is updated to match. This directly satisfies "extend existing validation patterns instead of creating a parallel validation system."
**Compatibility check performed**: both objects' fields (`board`, `approved` on `boardApproval`; `citation`, `hadithGrading`, `verifiedStatus` on `sourceReference`) were inspected directly before use, not assumed from names alone. Both cleanly support the Dhikr requirement — no incompatible field was needed.

## ADR-009 — Dual-field EN/DA localisation on `dhikrItem`, provisional

**Status**: Decided, provisional — subject to review before the mature multilingual content model is finalised
**Decision**: `dhikrItem`/`dhikrCategory` use dual fields on one document (`titleEn`/`titleDa`, `translationEn`/`translationDa`) rather than the site's dominant one-document-per-`language` pattern (used by `product`, `programme`, `journey`, `article`).
**Rationale**: this is deliberate and Dhikr-specific, not an oversight or a change to the wider repository localisation model. `arabicText` must be stored exactly once per item and never duplicated between an English record and a Danish record — splitting into sibling documents-per-language would require copying (or cross-referencing) `arabicText` and `sourceReferences` across two documents, recreating the exact "two Arabics could drift" risk that the authoritative-source rule in [03](03-authenticity-and-scholarly-review-policy.md) exists to prevent.
**Scope of the deviation**: this affects `dhikrItem`/`dhikrCategory` only. No other schema, and no part of `src/i18n/`, was changed.

## ADR-010 — Publication eligibility is a compound rule, defined once

**Status**: Decided (Phase 2 implementation)
**Decision**: "publicly eligible" is `reviewStatus == "published"` **AND** `arabicText`/`translationEn`/`translationDa` present **AND** at least one `sourceReference` **AND** an approved `scholarly` board approval **AND** an approved `editorial` board approval — never `reviewStatus == "published"` alone. This rule is defined exactly once, in `src/sanity/lib/dhikr-publication-gate.ts` (a GROQ fragment plus a logically-identical TypeScript predicate), and reused by the public query, the Studio publish-time validators, and the test suite.
**Rationale**: makes the safeguard architectural rather than dependent on a developer remembering to repeat a filter correctly in multiple places. Directly supersedes the earlier, weaker design (a bare `reviewStatus == "published"` filter mirroring `clinicalProtocolsQuery`'s simpler `== "approved"` gate) once it was clear the Dhikr policy in [03](03-authenticity-and-scholarly-review-policy.md) requires both review roles independently, not just a status string.
**Verified compatible**: `boardApprovals` and `sourceReferences` are inline object arrays (not references requiring dereferencing), so the identical condition is expressible in both GROQ (server/query-time) and Sanity's synchronous validation context (write-time) without divergence.

## ADR-011 — Internal review route reuses the existing `(staff)` gate, not a new one

**Status**: Decided (Phase 2 implementation)
**Decision**: the internal prototype lives at `src/app/(staff)/dhikr-review/page.tsx`, added to `middleware.ts`'s existing `authMiddleware`-gated pathname list alongside `/handbook`, `/ops`, `/intelligence`. It uses the plain `(staff)` layout styling, not `DepartmentHero`/`DepartmentSection`. Its data access uses `previewClient` (draft-visible) via a new, physically separate `src/sanity/lib/dhikr-fetch.ts` module, never the shared public `fetch.ts`.
**Rationale**: `(staff)` is already a genuinely access-controlled (NextAuth), non-indexed route group with proven siblings — reusing it is stronger than inventing a new "unlisted" convention, and was confirmed correct against `next.config.ts` (no rewrites) and a full production build, which shows `/dhikr-review` resolving exactly as expected alongside the other staff routes. `DepartmentHero`/`DepartmentSection` were not reused because they assume the `[locale]` layout's fonts/providers, which `(staff)` deliberately does not share (separate root layout) — reusing them would have created the provider/font coupling the brief asked to avoid.

## ADR-012 — `scripts/validate-schema.ts` is not the right validation target

**Status**: Decided (Phase 2 implementation)
**Decision**: Dhikr schema/gating tests were added as `tests/dhikr/*.test.ts` (following the `tests/ai/`/`tests/community/` `assert()`-based convention), not as an extension of `scripts/validate-schema.ts`.
**Rationale**: repository inspection confirmed that script validates SEO/JSON-LD structured data (product/article/medical/course schemas) — an unrelated domain to Sanity document-schema or publish-gating correctness. [12](12-sanity-integration-plan.md) and [17](17-test-and-validation-plan.md), which originally assumed otherwise, are corrected.

## ADR-013 — Staff route auth-gate: fail-open observation, verified root cause, and remediation

**Status**: Decided and verified
**Context**: `/dhikr-review` depends entirely on the repository's pre-existing, shared staff authentication system (`middleware.ts` + `src/lib/auth/config.ts`, NextAuth v4 credentials provider) — this is not a Dhikr-specific system and this ADR does not duplicate general auth documentation; it records only what was found and changed in the course of making `/dhikr-review` trustworthy.

**Original observation**: in local `next dev`, `/dhikr-review` and `/ops` both returned `HTTP 200` with full internal content to a request carrying no session cookie, and `GET /api/auth/session` returned `{}`. This looked like a fail-open authentication bypass.

**Verified root cause** (by reading `node_modules/next-auth`'s actual `withAuth`/`handleMiddleware` source, and by empirical testing — not by inference):
1. Missing `NEXTAUTH_SECRET`/`NEXTAUTH_URL`/`STAFF_CREDENTIALS` was **not** the root cause of the dev-mode observation. Next-auth v4's own source, when the secret is missing, explicitly logs `[next-auth][error][NO_SECRET]` and redirects to `/api/auth/error?error=Configuration` — it fails closed by design.
2. Empirical testing proved: **`next start` (production — what Vercel runs) executes `middleware.ts` correctly and fails closed**, with or without the three env vars configured. **`next dev` (Turbopack) does not execute the custom `middleware.ts` function body at all**, confirmed using a control unrelated to auth (the file's own `utm_source` tracking-param-stripping logic also never fired in dev, while it fired correctly in production). This was re-tested a second time with the three env vars fully and correctly configured — the dev-mode gap persisted regardless of configuration, ruling out "missing configuration" as the cause. This is classified as a Next.js 16 Turbopack dev-server middleware-execution discrepancy, not an application defect, and not something this task attempted to fix (root internal mechanism not diagnosed; recommended as separate tooling investigation if it persists across Next.js versions).
3. A second, separate, genuinely pre-existing defect was found and fixed: `GET /sign-in` itself returned `404` in every environment, because `middleware.ts` did not exempt `/sign-in` from the `next-intl` locale-rewrite fallthrough, so it was rewritten to a non-existent `/en/sign-in`. This meant a real user redirected to sign in had no way to reach the login form via normal navigation (only a direct API POST to `/api/auth/callback/credentials` worked, which is how authentication succeeded in earlier curl-only testing without this being noticed).

**Chosen remediation** (all additive, none touching the auth-gating logic itself):
- `middleware.ts`: added `pathname.startsWith("/sign-in")` to the same condition that routes `/handbook`/`/ops`/`/intelligence`/`/dhikr-review` to `authMiddleware` — this works because `withAuth`'s own internal logic already exempts its configured `pages.signIn` path from requiring auth, so `/sign-in` now passes through untouched instead of falling into the `next-intl` rewrite.
- `src/lib/auth/config.ts`: `getStaffCredentials` changed from a private to an exported function — no behaviour change, added solely so its parsing/matching logic is unit-testable.
- New `tests/auth/staff-credentials.test.ts` (7 unit tests) and `tests/auth/staff-route-matcher.test.ts` (3 static tests, including a regression guard for the `/sign-in` fix) — see [17-test-and-validation-plan.md](17-test-and-validation-plan.md).
- The plaintext password comparison in `authorize()` (`s.password === credentials.password`, no hashing) was identified and recorded as a residual property of the existing system, not redesigned — it was judged not "fundamentally unsafe" for an env-var-controlled list of under 30 staff with 8-hour JWT sessions, per the existing code's own rationale, and redesigning it was out of scope for this task.

**Evidence that unauthenticated access is now denied** (production mode, `next start`, using ephemeral/throwaway test credentials never persisted to any file):
- `GET /sign-in`, `/dhikr-review`, `/ops`, `/handbook`, `/intelligence` (no cookies): `/sign-in` → `200` (fixed from 404); the other four → `307` to `/sign-in?callbackUrl=...`, verified both via raw `curl` and via genuine browser navigation (no internal content present in either case — confirmed by inspecting `document.body.textContent` for the four routes and the rendered sign-in form for `/sign-in`).
- Invalid credentials, submitted through the actual rendered sign-in form in a browser: no session created (`/api/auth/session` → `{}`), user remains on the sign-in page.
- Valid (ephemeral test) credentials, submitted through the actual rendered sign-in form: session created (role correctly embedded), browser redirected to the original `callbackUrl` (`/dhikr-review`), full internal content rendered.
- Sign-out via the actual NextAuth sign-out confirmation page: session cleared (`/api/auth/session` → `{}`); a subsequent navigation to `/dhikr-review` redirected to `/sign-in?callbackUrl=...` again, with no internal content present.
- `noindex, nofollow` confirmed present on `/dhikr-review` and `/ops` in the authenticated response body.

**Remaining environment responsibilities** (not resolved by this ADR, and explicitly not claimed as verified): `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and `STAFF_CREDENTIALS` must be configured with real values in `.env.local` for local development, and in Vercel's Preview and Production environment variable settings, before `/dhikr-review` (or any staff route) can be considered genuinely private in those environments. This repository audit cannot confirm Vercel's actual configuration — that requires the project owner's direct confirmation. See R-09 in [20-risk-register.md](20-risk-register.md).

**Re-verification addendum**: the `/sign-in` fix and full matrix were independently re-verified in a follow-up pass with fresh ephemeral test credentials, using a mix of live browser interaction (confirming the sign-in form renders after client-side hydration — `/sign-in` is statically prerendered, so a non-JS request such as `curl` only sees the Suspense fallback shell; this is expected Next.js behaviour, not a defect) and direct HTTP requests (CSRF token + credentials callback flow) for the parts the browser tooling could not reliably complete in that session. Every result matched the original evidence above. `tests/auth/staff-route-matcher.test.ts` was extended with three additional static checks: the auth-routed branch (including `/sign-in`) returns before the code can reach the `intlMiddleware` fallback; known public `[locale]` routes remain absent from the auth-protected block; and the existing URL-normalisation/tracking-parameter-stripping logic is unchanged and still runs first.

**Vercel environment-readiness addendum**: no code change was made or required in this pass — the object was to confirm exact deployment requirements, not to alter behaviour. Confirmed additionally from source: `STAFF_CREDENTIALS` passwords are plaintext (`===` comparison, no hashing); `role` is TypeScript-typed but not runtime-validated by `authorize()` (currently harmless, since no route performs role-specific gating); and the codebase has no dynamic `NEXTAUTH_URL` derivation from Vercel's `VERCEL_URL` — a fixed value is required per environment, with a stable Git-branch alias recommended for Preview *if* this specific Vercel project has one configured (not verified either way). The full deployment checklist and a Development/Preview/Production verification matrix now live in `docs/Phase 4/phase-4-security-operations.md` §§9–10, the existing canonical operations document, rather than being duplicated here. **Neither Preview nor Production has been tested against a real deployed URL** — only local production-mode behaviour is verified. The internal Dhikr prototype must not be treated as securely deployed until both pass that matrix.

## ADR-014 — Public integration supersedes ADR-001: Dhikr joins the Knowledge Library, not a standalone department

**Status**: Decided (repository-owner instruction, branch `feature/knowledge-library-dhikr`)
**Context**: ADR-001 recorded standalone-department placement as a default, explicitly flagged as pending product-owner confirmation before Phase 3 routing work began (see ADR-001, R-08 in [20-risk-register.md](20-risk-register.md)).
**Decision**: that confirmation resolved the other way. Dhikr's public surface integrates into the existing Knowledge Library (`src/app/[locale]/knowledge-library/`), reusing its `SectionPage` shell, breadcrumb, department-nav, and metadata conventions. It is surfaced only as an entry in `knowledgeLibrary.sections` (`src/lib/navigation/site-structure.ts`) — the Knowledge Library's own existing topic-entry mechanism — not via `DepartmentGateway`/`DepartmentCard`/global navigation. ADR-001, ADR-002 through ADR-013 are otherwise unaffected (browser-based, account-free, non-gamified, local-storage-first, scholarly-review-gated, schema location, gate design, and staff-route auth all stand as decided).
**Rationale**: repository inspection confirmed `departmentCard`'s own schema caps `order` at `max(4)` — the four existing departments (Apothecary, Academy, Sacred Journeys, Knowledge Library) structurally fill that slot; a 5th top-level department was never a frictionless option. Nesting under Knowledge Library also avoids duplicating a page shell, breadcrumb system, and metadata pattern that already exist and are reused as-is.
**Scope of the deviation**: affects placement/navigation only. No schema, gate, or reader-experience decision from ADR-002–ADR-013 is revisited.

## ADR-015 — Optional slug fields added; item-detail route deferred

**Status**: Decided (Stage 2 of the Knowledge Library integration)
**Decision**: `dhikrItem.slug` and `dhikrCategory.slug` were added (Sanity `type: "slug"`, following the repository's existing convention seen in `article.ts`/`author.ts`/`topic.ts` — `options: { source, maxLength: 96 }`). Both are optional in this prototype: `dhikrItem.slug` is required only once `reviewStatus` reaches `"published"` (via `requiredWhenDhikrPublished`, the same mechanism already used for `arabicText`/`translationEn`/`translationDa`); `dhikrCategory.slug` carries no required-ness at all, since `dhikrCategory` has no `reviewStatus`/publish gate of its own (see ADR-007, [12-sanity-integration-plan.md](12-sanity-integration-plan.md)). Both fields wire a new shared `isUniqueDhikrSlug` check (`src/sanity/validation/governance.ts`) as `options.isUnique`, scoped per-`_type` and excluding the document's own draft/published id, so two documents of the same type can never silently save the same slug. Neither field's presence auto-publishes anything or creates a public route by itself.
**Public item-detail route deferred**: `/knowledge-library/dhikr/[slug]` and `/knowledge-library/dhikr/[category]/[slug]` are **not created** in this phase, and must not be, until reviewed `published`-eligible content actually exists to build and verify the reader view against — building it now, against zero eligible items, would produce exactly the thin/placeholder page this initiative is required to avoid. The `/knowledge-library/dhikr/[category]` index route is scaffolded no earlier than Stage 4, and only ever resolves a category backed by at least one eligible published item (`notFound()` otherwise).
**Rationale**: a slug is a URL-routing concern, not an eligibility concern — the canonical rule in `src/sanity/lib/dhikr-publication-gate.ts` was read and confirmed unmodified (no reference to `slug` exists in that file). Deferring the leaf route keeps the public surface honest: nothing is served at a URL a reader could reach until there is real, reviewed content to serve there.
**Compatibility check performed**: `tests/dhikr/dhikr-slug-fields.test.ts` behaviourally confirms neither slug field is unconditionally required, confirms the uniqueness check scopes by `_type` and excludes the editing document's own id, and confirms `dhikr-publication-gate.ts`'s source contains no reference to `slug`.

## ADR-016 — Dedicated public fetch module; categories derived, never queried directly

**Status**: Decided (Stage 2 of the Knowledge Library integration)
**Decision**: `src/sanity/lib/dhikr-public-fetch.ts` is the sole public-safe Dhikr data-access module, importable only by routes under `src/app/[locale]/`. It uses the public `client` (never `previewClient`) and consumes `dhikrItemsPublicEligibleQuery` from `queries.ts` as-is — the eligibility gate is applied inside that query's GROQ filter, not re-implemented, not applied after fetching. That query's projection was extended (same query, same filter, richer projection) to include `slug`, `arabicText`, `transliteration`, `translationEn`/`translationDa`, category public-identity fields (`categoryName`, `categoryNameDa`, `categorySlug`), and an explicit, field-by-field reader-safe projection of `sourceReferences` — in preparation for the future reader view, not consumed by any route yet. `getDhikrCategoriesPublic()` derives category listings purely by grouping `getDhikrItemsPublic()`'s results by `categorySlug`; there is no direct public query against the `dhikrCategory` document type, so a category is never publicly visible on the strength of its own record — only by virtue of at least one eligible item referencing it (see [12-sanity-integration-plan.md](12-sanity-integration-plan.md): categories remain "internal-preview-only" as their own document type).
**Rationale**: satisfies "do not create a second public eligibility implementation" — there remains exactly one gate (`dhikr-publication-gate.ts`) and exactly one public query (`dhikrItemsPublicEligibleQuery`); extending its projection, rather than adding a parallel query, keeps that singular.
**Explicit non-goal**: `dhikr-public-fetch.ts` does not use `safeFetch()` from the shared `fetch.ts` — that helper's per-locale `language` parameter and fallback behaviour assumes a one-document-per-language content model, which Dhikr deliberately does not use (ADR-009).

---

## Open decisions (not yet resolved by this architecture pack)

| ID | Open question | Raised in | Blocking |
|---|---|---|---|
| OD-01 | Final category taxonomy naming and count (currently draft) | [05-category-taxonomy.md](05-category-taxonomy.md) | Blocks finalising `dhikrCategory` content, not engineering scaffolding |
| OD-02 | Whether counter state persists across sessions ("today's count") or resets each session | [07-repeat-counter-specification.md](07-repeat-counter-specification.md) | Blocks Phase 4 implementation detail, not Phase 4 start |
| OD-03 | Whether individual dhikr items carry rich structured data (e.g. Article-style), or omit item-level structured data in v1 | [14-seo-and-sharing.md](14-seo-and-sharing.md) | Blocks Phase 6 SEO polish, not launch itself |
| ~~OD-04~~ | ~~Exact Sanity schema subfolder grouping for `dhikrItem`/`dhikrCategory`~~ | Resolved by **ADR-007** below | — |

These remain open by design — resolving them is an editorial/engineering-lead decision at implementation time, not something this architecture pack should pre-decide without that input.

---

## Pre-commit QA review — corrections applied (2026-07-12)

A full integrated review of all 23 files surfaced the following defects, corrected before commit:

1. **Contradiction — department placement.** ADR-001 recorded the standalone-department placement as decided, but [01](01-product-scope.md), [02](02-information-architecture.md), [11](11-route-and-component-map.md), and risk R-08 in [20](20-risk-register.md) still described it as fully open, unresolved either at the time ADR-001 was written. Corrected all four to state the default decision explicitly while preserving the still-needed product-owner confirmation before Phase 3 (ADR-001's own caveat) — no information was lost, only made consistent.
2. **Safeguard gap — autoplay audio.** No document stated the no-autoplay requirement. Added explicit rules to [10](10-audio-review-and-delivery.md) and [15](15-accessibility-requirements.md).
3. **Safeguard gap — Arabic as authoritative source.** Not previously stated as a governance rule (only as a presentation/typography fact). Added an explicit rule to [03](03-authenticity-and-scholarly-review-policy.md) and a cross-reference in [04](04-dhikr-content-schema.md): Arabic is authoritative, translations are derived, and discrepancies are resolved by correcting the translation.
4. **Safeguard gap — reward/virtue claims.** No rule prevented an unverified reward/virtue claim from entering through a loosely-reviewed field (category `description`, `tags`). Added an explicit rule to [03](03-authenticity-and-scholarly-review-policy.md) and tightened the `description` field note in [04](04-dhikr-content-schema.md).
5. **Safeguard gap — memorisation is not a religious ruling.** [08](08-memorisation-system.md) did not disclaim that "Memorised" is a personal self-report, not a claim of religious merit or acceptance. Added an explicit disclaimer.
6. **Clarity gap — local storage terminology and resilience.** "Local storage" and "resets per session" were used across [06](06-reader-experience-specification.md), [07](07-repeat-counter-specification.md), and [08](08-memorisation-system.md) without distinguishing persistent storage from session-scoped behaviour, and no document addressed what happens if storage is blocked. Added clarifying language to [16](16-privacy-and-local-storage-policy.md) rather than editing the three source documents, since 16 is the canonical storage policy.
7. **Traceability gap — tests not connected to risks.** [17](17-test-and-validation-plan.md)'s test categories did not reference risk IDs, and risks R-03 (audio accuracy) and R-04 (Arabic rendering) had no corresponding test category. Added a "Related risk(s)" column to 17, two new test categories (audio-text consistency, Arabic rendering), and cross-referenced them back from R-03/R-04 in [20](20-risk-register.md).
8. **Non-goal gap — separate brand identity.** No document stated that Dhikr must not become a distinct sub-brand. Added to [01](01-product-scope.md) non-goals.

No file was created, deleted, or renamed. No Arabic text, translation, hadith reference, grading, or repetition count was introduced by these corrections — all changes are structural/policy clarifications.
