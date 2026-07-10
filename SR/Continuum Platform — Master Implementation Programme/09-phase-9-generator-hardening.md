# Continuum Platform — P9: Generator, Docs & Hardening

> **Part of:** Continuum Platform Master Implementation Programme
>
> **Specification reference:** Spec Phase 9 (§19), §16 (Starter Project Generator), §18 (Documentation), plus §13/§14 hardening.
>
> **Duration:** 2 weeks · **Tier:** Platform

Deliver create-institution, complete the ten-guide documentation set, and harden the platform. One command generates a production-ready institution passing every gate and deploying to a live preview. This phase makes the platform reusable.

---

## Objectives

- Implement the create-institution CLI (§16) with industry presets and module selection.
- Ensure a generated project ships the full baseline: design system, CMS, auth, SEO, analytics, media, operations, docs, testing.
- Complete all ten documentation guides (§18) and example institutions.
- Harden performance (§14) and security (§13) to production budgets across the platform.
- Finalise release and migration workflows so institutions can upgrade safely.

## Deliverables

- tooling/create-institution CLI with the §16.1 generation flow.
- templates/ and examples/ (reference institutions per preset).
- All ten guides published and cross-linked; ADR index complete.
- Performance/security hardening pass with budgets enforced.
- Release + migration workflows and a platform-versioning scheme.

## Repository changes

- Add tooling/create-institution and templates/ for the generator to compose.
- Add examples/ reference institutions (clinic, school, store, firm, charity, research, SaaS, membership presets).
- Add release automation (versioned, changelog-driven) and migration scripts.
- Add analytics (consent-aware) and SEO defaults to the generated baseline.

## Folder structure

```
tooling/
└── create-institution/
    ├── prompts/        # name, industry, modules, brand, deploy
    ├── presets/        # industry → module presets
    ├── compose/        # assemble from templates/ + tokens
    └── verify/         # post-gen gate run
templates/              # project + file templates the generator composes
examples/
├── clinic/ school/ store/ firm/
├── charity/ research/ saas/ membership/
scripts/
├── release/           # versioned, changelog-driven releases
└── migrate/           # platform-version migrations
```

## Modules affected

- All modules — packaged for selective activation by the generator
- Analytics (§4.16) — baseline consent-aware analytics finalised here
- Settings — module presets consumed by the generator

## Interfaces to implement

- create-institution CLI (name → industry → modules → brand → deploy).
- settings.modules() — the generator writes the activation set.
- analytics.track/report — consent-aware baseline.
- Release/migration scripts (versioning, changelog, upgrade).

## External services

- Consent-aware, privacy-first analytics provider.
- Existing providers (Sanity, Cloudinary, Shopify, Stripe, Resend, search, AI) provisioned per activated module.

## Environment variables

| Variable | Purpose | Required |
| --- | --- | --- |
| ANALYTICS_WRITE_KEY | Privacy-first analytics (consent-gated). | yes |
| GENERATOR_TELEMETRY | Opt-in generator usage telemetry. | no |
| PLATFORM_VERSION | Pinned platform version for a generated project. | auto |

## Acceptance criteria

- create-institution generates a production-ready project that passes every gate and deploys to a live preview on first run.
- The generated baseline includes design system, CMS, auth, SEO, analytics, media, operations, docs, and testing with nothing left to hand-wire.
- Optional modules (Commerce, AI, Courses, Community/Membership, Booking, Research, Governance) are off by default and activate cleanly.
- All ten guides are complete; example institutions build green.
- Migration path lets an existing institution upgrade platform versions safely.

## Testing requirements

- Unit: generator prompt handling, preset resolution, template composition, brand-token application.
- Integration: generate each preset → project builds green → deploys to preview → baseline flows work.
- End-to-end: generate a store (Commerce on) and a clinic (Booking/Governance on); confirm both pass all gates.
- Migration: upgrade an example institution across a platform version bump without data loss.

## Production readiness checklist

- [ ] Generated projects pass typecheck, lint, a11y, visual-regression, performance, and security gates out of the box.
- [ ] Core Web Vitals within the 'good' band on the generated baseline (§14).
- [ ] Security baseline (§13) active by default in generated projects.
- [ ] Release workflow publishes versioned platform packages with changelogs.
- [ ] Migration guide + scripts verified against an example institution.

## Risks

| Risk | Description | Mitigation |
| --- | --- | --- |
| Generator drift | Generated projects diverge from platform standards over time. | Generator composes the same packages/standards; a post-gen gate run blocks non-conforming output. |
| Template rot | Templates lag behind module changes. | Templates consume module interfaces; CI builds every example on each release. |
| Upgrade breakage | Version bumps break existing institutions. | Semver + migration scripts + example-institution upgrade test in CI. |
| Perf regressions at scale | Baseline degrades as modules activate. | Budgets enforced per activated module; RUM monitoring in generated projects. |

## Dependencies

- All prior phases — the generator packages and activates everything built in Phases 0–8.

## Documentation updates

- Complete and cross-link all ten guides (§18), including Migration and Deployment.
- Publish the generator documentation (§16) and preset catalogue.
- Finalise the ADR index; ensure every major decision is recorded.
- Publish the Platform Guide's 'activate a module' and 'generate an institution' walkthroughs.

---

## Milestones & tasks

### Milestone 9.1 — Generator core

**Objective.** create-institution scaffolds a conforming project.

#### Task 9.1.1 — Implement the generation prompt flow

- **Inputs:** Spec §16.1 (name → industry → modules → brand → deploy).
- **Outputs:** The CLI collects name, industry, modules, brand tokens, and deploy target.
- **Files created:** `tooling/create-institution/prompts/`
- **Files modified:** —
- **Verification steps:**
  - The flow collects all five inputs.
  - Invalid inputs are rejected with guidance.
- **Manual QA steps:**
  - Run the CLI; confirm each prompt and validation.

#### Task 9.1.2 — Implement industry presets

- **Inputs:** Spec §16.1 industry presets; Settings module toggles.
- **Outputs:** Presets mapping each industry to a sensible module activation set.
- **Files created:** `tooling/create-institution/presets/`
- **Files modified:** —
- **Verification steps:**
  - Each preset resolves to a valid module set.
  - Presets are overridable in the modules step.
- **Manual QA steps:**
  - Select a clinic preset; confirm Booking/Governance suggested, Commerce off.

#### Task 9.1.3 — Implement template composition and brand-token application

- **Inputs:** Spec §16.2; templates/; design-system tokens.
- **Outputs:** The generator composes templates/ and applies brand tokens to theme the design system.
- **Files created:** `tooling/create-institution/compose/`, `templates/ (base project)`
- **Files modified:** —
- **Verification steps:**
  - Composition produces a buildable project.
  - Brand tokens theme the output.
- **Manual QA steps:**
  - Generate with a custom palette; confirm the theme reflects it.

#### Task 9.1.4 — Implement the post-generation gate run

- **Inputs:** Spec §16.2 definition of production-ready.
- **Outputs:** The generator runs all gates and a preview deploy; it fails loudly if any gate fails.
- **Files created:** `tooling/create-institution/verify/`
- **Files modified:** —
- **Verification steps:**
  - A generated project passes all gates.
  - A forced failure is surfaced clearly.
- **Manual QA steps:**
  - Generate a project; confirm it builds green and deploys to a preview automatically.

### Milestone 9.2 — Baseline, analytics & examples

**Objective.** Every generated project ships the full baseline; examples prove it.

#### Task 9.2.1 — Finalise the consent-aware analytics baseline

- **Inputs:** Spec §4.16 (privacy-first, consent-gated, no PII).
- **Outputs:** analytics.track/report in the baseline, consent-gated with no PII by default.
- **Files created:** `packages/adapters/analytics-*`, `baseline analytics wiring`
- **Files modified:** `templates baseline`
- **Verification steps:**
  - Analytics respects consent.
  - No PII in events by default.
- **Manual QA steps:**
  - Decline consent; confirm no tracking fires.

#### Task 9.2.2 — Add SEO and metadata defaults to the baseline

- **Inputs:** Spec §6.1 SEO; §14 performance.
- **Outputs:** Per-document and global SEO/metadata defaults in generated projects.
- **Files created:** —
- **Files modified:** `templates baseline (SEO defaults)`
- **Verification steps:**
  - Generated pages have correct metadata.
  - Sitemaps/robots present.
- **Manual QA steps:**
  - Generate a project; inspect metadata and sitemap output.

#### Task 9.2.3 — Build example institutions (batch 1)

- **Inputs:** Spec §16 presets; examples/.
- **Outputs:** clinic, school, store, and firm example institutions building green.
- **Files created:** `examples/{clinic,school,store,firm}/`
- **Files modified:** —
- **Verification steps:**
  - Each example builds and passes gates.
  - Each demonstrates its preset.
- **Manual QA steps:**
  - Build each example; confirm gate pass and preset behaviour.

#### Task 9.2.4 — Build example institutions (batch 2)

- **Inputs:** Spec §16 presets; examples/.
- **Outputs:** charity, research, saas, and membership example institutions building green.
- **Files created:** `examples/{charity,research,saas,membership}/`
- **Files modified:** —
- **Verification steps:**
  - Each example builds and passes gates.
  - CI builds all examples on release.
- **Manual QA steps:**
  - Build each example; confirm gate pass and CI coverage.

### Milestone 9.3 — Hardening, docs & release

**Objective.** Production hardening, complete documentation, and safe upgrades.

#### Task 9.3.1 — Performance hardening pass

- **Inputs:** Spec §14 (Core Web Vitals, budgets, caching, edge).
- **Outputs:** Baseline meets CWV 'good' band; budgets enforced; caching/edge tuned.
- **Files created:** —
- **Files modified:** `baseline performance config`, `CI performance gate`
- **Verification steps:**
  - CWV within budget on the baseline.
  - Budget breach fails CI.
- **Manual QA steps:**
  - Run Lighthouse/RUM on a generated project; confirm the 'good' band.

#### Task 9.3.2 — Security hardening pass

- **Inputs:** Spec §13 (full baseline active by default).
- **Outputs:** Security baseline verified across generated projects; dependency/supply-chain scanning enforced.
- **Files created:** —
- **Files modified:** `baseline security config`, `CI security gates`
- **Verification steps:**
  - Generated projects pass the security gate set.
  - Dependency scan blocks known-vulnerable packages.
- **Manual QA steps:**
  - Generate a project; run the security suite; confirm a clean pass.

#### Task 9.3.3 — Complete the ten documentation guides

- **Inputs:** Spec §18 documentation set (stubs from Phase 0).
- **Outputs:** All ten guides complete, cross-linked, with a finished ADR index.
- **Files created:** —
- **Files modified:** `docs/guides/*`, `docs/adr index`
- **Verification steps:**
  - Each guide's scope matches §18.
  - Cross-links resolve; ADR index complete.
- **Manual QA steps:**
  - Review each guide against its §18 scope; follow cross-links.

#### Task 9.3.4 — Implement release and migration workflows

- **Inputs:** Spec §18 (Migration Guide); §15 release workflow.
- **Outputs:** Versioned, changelog-driven releases; migration scripts; an example-institution upgrade test.
- **Files created:** `scripts/release/`, `scripts/migrate/`
- **Files modified:** `Migration Guide`, `CI (example upgrade test)`
- **Verification steps:**
  - A release publishes versioned packages + changelog.
  - An example upgrades across a version bump without data loss.
- **Manual QA steps:**
  - Cut a test release; upgrade an example institution; confirm no data loss.

