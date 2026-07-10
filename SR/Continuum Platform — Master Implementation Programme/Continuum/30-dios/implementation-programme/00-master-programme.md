# Continuum Platform — Master Implementation Programme

> **Basis of record:** DIOS — Digital Institution Starter Platform Engineering Specification v1.0
>
> This programme decomposes the specification into an executable backlog. It does **not** redesign the architecture or rewrite the specification — every phase, module, and interface traces directly to the DIOS spec.

**Document status:** Master roadmap · **Generated for:** Continuum Platform · **Cadence:** 10 phases × 1–2 weeks each

---

## 1. Team model

Small squad of 4–6 senior engineers working alongside AI coding agents (Cursor / Claude Code).

| Role | Focus |
| --- | --- |
| Platform Lead | Owns architecture conformance, ADRs, and the dependency law. Approves interface changes. |
| Core / Infra Engineer | Kernel, tooling, CI/CD, observability, environments. |
| Frontend / Design-System Engineer | Design tokens, component library, Storybook, accessibility. |
| Content / Backend Engineer | CMS, Media, Search/Knowledge, data schemas. |
| Commerce / Ops Engineer | Commerce, Payments, Operations, Notifications. |
| AI / Agent Engineer | AI gateway, RAG, agent rules, generator (create-institution). |

**Velocity assumption.** Each phase is scoped to one to two calendar weeks of squad effort. Milestones are 1–3 days; tasks are sized so a single agent can complete one confidently in under half a day.

## 2. Global engineering conventions

- **Always deployable.** Every task must leave main in a deployable state: all gates green, no half-wired feature behind a flag left enabled.
- **Task shape.** Every task declares Inputs, Outputs, Files created, Files modified, Verification steps, and Manual QA steps.
- **Branching.** Trunk-based: short-lived branches, one task (or a tight milestone) per PR, squash-merge behind required checks.
- **Feature flags.** Incomplete capability ships disabled behind a feature flag or an inactive module toggle; the baseline never regresses.
- **Merge gates.** Merge gates: typecheck · lint · format · unit · integration · a11y (axe) · visual-regression · dependency-graph · secret-scan · build.
- **No code here.** This programme contains no application code. Tasks describe intent, contracts, and verification — the implementing agent writes the code.

### Definition of Ready (every task)

- The task's parent milestone acceptance criteria are understood.
- All upstream tasks it depends on are merged to main.
- Required environment variables and external-service access exist (or a stub/adapter is specified).
- The relevant module interface (from the DIOS spec §4) is identified.

### Definition of Done (every task)

- Code merged to main behind required checks; all merge gates green.
- Declared Outputs exist and are reachable through the module's public interface only.
- Tests specified in the task are present and passing.
- Manual QA steps executed and recorded on the PR.
- Docs updated (module interface doc, ADR if a decision was made, changelog entry).
- main deploys cleanly to a preview environment.

## 3. Phase map

| Phase | Title | Spec ref | Tier | Duration | Detailed backlog |
| --- | --- | --- | --- | --- | --- |
| P0 | Foundations & Standards | Spec Phase 0 | Kernel | 2 weeks | `phase-0-foundations.md` |
| P1 | Design System & Primitives | Spec Phase 1 | Foundation | 2 weeks | `phase-1-design-system.md` |
| P2 | CMS & Media | Spec Phase 2 | Foundation | 2 weeks | `phase-2-cms-media.md` |
| P3 | Identity, Security & Settings | Spec Phase 3 | Foundation | 2 weeks | `phase-3-identity-security.md` |
| P4 | Search, Knowledge & AI Foundation | Spec Phase 4 | Capability | 2 weeks | `phase-4-search-knowledge-ai.md` |
| P5 | Operations & Notifications | Spec Phase 5 | Intelligence | 2 weeks | `phase-5-operations.md` |
| P6 | Commerce & Payments | Spec Phase 6 | Capability | 2 weeks | `phase-6-commerce-payments.md` |
| P7 | Community, Courses & Membership | Spec Phase 7 | Engagement | 2 weeks | `phase-7-community-courses.md` |
| P8 | Research, Governance & Internationalisation | Spec Phase 8 | Intelligence | 2 weeks | `phase-8-research-governance.md` |
| P9 | Generator, Docs & Hardening | Spec Phase 9 | Platform | 2 weeks | `phase-9-generator-hardening.md` |

### Dependency flow

```
P0 Foundations
 └─> P1 Design System
      └─> P2 CMS & Media
           └─> P3 Identity & Security
                ├─> P4 Search / Knowledge / AI
                │     └─> P5 Operations & Notifications
                │          └─> P6 Commerce & Payments
                │               └─> P7 Community / Courses / Membership
                │                    └─> P8 Research / Governance / i18n
                └────────────────────────> P9 Generator / Docs / Hardening
```

Each phase is independently deployable and leaves `main` in a shippable state. Value compounds: an institution can launch on P0–P3 alone, then activate Commerce, Community, or AI later without re-platforming.

## 4. How to use this backlog

- Work phases in order; within a phase, work milestones in order; within a milestone, tasks may parallelise across the squad where their inputs are met.
- Each task is scoped for one AI agent (Cursor / Claude Code) to complete confidently in a single focused session.
- Open one PR per task (or per tight milestone); the PR template carries the Definition of Done checklist.
- Never merge a task that leaves the baseline broken or a half-wired capability enabled — gate it behind a flag or an inactive module toggle.

## 5. Phase summaries

### P0 — Foundations & Standards

*2 weeks · Spec Phase 0*

Stand up the monorepo, the encoded standards, the CI/CD skeleton, and the Core kernel. Nothing institution-specific ships here; this phase makes every later phase possible and enforces the dependency law from the first commit.

**Objectives**

- Create the monorepo skeleton (apps/, packages/, modules/, standards/, tooling/, docs/, examples/, templates/, scripts/, .github/, .cursor/) per spec §17.
- Encode the standards: TypeScript strict base, lint/format configs, commit hooks, and the token/schema config homes.
- Implement the Core kernel (§4.1): typed config, event bus, adapter registry, logger, error/Result model.
- Stand up CI/CD with all merge gates and the dependency-graph enforcement.
- Establish the ADR process and the agent guidance (.cursor rules + Claude instructions) so AI generation stays on-architecture.

**Scope:** 4 milestones · 18 tasks. Full detail in `phase-0-foundations.md`.

---

### P1 — Design System & Primitives

*2 weeks · Spec Phase 1*

Deliver the institutional design system as the single source of visual truth: tokens, three-layer components, Storybook, accessibility gates, and theming/dark mode. Frozen after this phase.

**Objectives**

- Define the token schema (colour, typography, spacing, radius/elevation, motion, grid) per §5.1 as the sole source of visual truth.
- Build the three-layer component system: primitives → elements → patterns (§5.3).
- Stand up Storybook as the visual contract with a story per component.
- Enforce WCAG 2.2 AA via automated axe checks and add visual-regression to CI (§5.4).
- Implement theming (light/dark as token layers) and responsive behaviour.

**Scope:** 4 milestones · 13 tasks. Full detail in `phase-1-design-system.md`.

---

### P2 — CMS & Media

*2 weeks · Spec Phase 2*

Enable structured, versioned, typed content (CMS) and governed media (Cloudinary pipeline). Editors can model, preview, and publish; publishing emits events for later indexing/embedding.

**Objectives**

- Implement the CMS module (§4.3) with the base content schema (§6.1) as portable, typed documents.
- Implement the editorial lifecycle: draft → preview → review/approval → publish → version/rollback (§6.2).
- Implement the Media module (§4.4) and the Cloudinary pipeline (§7) with governed metadata.
- Emit content.published / media.uploaded events for downstream Search/Knowledge (activated in Phase 4).
- Scaffold content internationalisation (translatable fields, locale-aware references, RTL support) (§6.3).

**Scope:** 4 milestones · 14 tasks. Full detail in `phase-2-cms-media.md`.

---

### P3 — Identity, Security & Settings

*2 weeks · Spec Phase 3*

Provide authentication, centralised RBAC, the security baseline, and institution configuration with jurisdiction profiles. Every protected action now routes through one authorization decision point.

**Objectives**

- Implement Identity (§4.2): auth/sessions, the user/org/role model, and the central authorize() decision point.
- Implement the security baseline (§13): CSRF/XSS defences, rate limiting, secrets, and immutable audit logs.
- Implement Settings (§4.20): institution config, module activation toggles, feature flags, and the outward API gateway skeleton.
- Provide jurisdiction profiles (UK GDPR, EU GDPR, KSA PDPL) with consent, retention, and erasure mechanisms.
- Introduce the sensitive-data category with stricter access and audit (clinical/legal/personal).

**Scope:** 4 milestones · 16 tasks. Full detail in `phase-3-identity-security.md`.

---

### P4 — Search, Knowledge & AI Foundation

*2 weeks · Spec Phase 4*

Make everything publishable discoverable and lay grounded-AI foundations. Publishing triggers indexing and embedding; semantic search and a governed, retrieval-grounded AI gateway come online with moderation and audit.

**Objectives**

- Implement Search (§4.7): indexing, keyword/facets, filters, and the query interface.
- Implement Knowledge (§4.8): the knowledge graph, embeddings (pgvector), and the retrieval interface.
- Implement the AI gateway (§4.9): the OpenAI-compatible, provider-neutral model interface with RAG orchestration.
- Wire content.published/media.uploaded to indexing/embedding jobs (jobs land properly in Phase 5; interim inline handlers here).
- Add moderation and generation audit logging; enable AI media tagging (from Phase 2 seam).

**Scope:** 3 milestones · 11 tasks. Full detail in `phase-4-search-knowledge-ai.md`.

---

### P5 — Operations & Notifications

*2 weeks · Spec Phase 5*

Automate back-office work and communications. A durable job runner, scheduler, and declarative workflow engine drive indexing, embeddings, emails, and syncs; Notifications delivers consent-aware messages; CRM holds the canonical relationship record.

**Objectives**

- Implement Operations (§4.17): the workflow engine, durable jobs/queues, and scheduling.
- Move Phase 4's interim inline indexing/embedding onto durable background jobs.
- Implement Notifications (§4.15): channel adapters (email via Resend), templated in the design system, consent-enforced.
- Implement CRM (§4.11): the canonical relationship record, segments, tags, and consent state.
- Provide operational dashboards and job/workflow health with alerting.

**Scope:** 4 milestones · 13 tasks. Full detail in `phase-5-operations.md`.

---

### P6 — Commerce & Payments

*2 weeks · Spec Phase 6*

Enable selling — physical, digital, and subscription — via headless Shopify, with Stripe for non-storefront flows (memberships, donations, fees). PCI scope and money-critical correctness stay with the providers; the platform owns the experience.

**Objectives**

- Implement Commerce (§4.5): headless Shopify catalog, cart, checkout orchestration, orders, and customers.
- Implement Payments (§4.6): Stripe payment intents, subscriptions, invoices, and refunds for non-storefront flows.
- Mirror Shopify products to CMS Product docs for editorial context (§8).
- Support digital-product entitlement and subscription state; expose the marketplace extension seam.
- Link commerce customers and payment records to Identity by id.

**Scope:** 3 milestones · 10 tasks. Full detail in `phase-6-commerce-payments.md`.

---

### P7 — Community, Courses & Membership

*2 weeks · Spec Phase 7*

Turn audiences into members and learners. Membership tiers and entitlements, role-specific portals (Student, Practitioner, Research), Courses with progress and certificates, forums/events, and recognition — all composed from existing primitives.

**Objectives**

- Implement Membership (§4.14): tiers, entitlements, and lifecycle (join, renew, lapse).
- Implement role-specific portals (Student, Practitioner, Research) as configured surfaces over shared primitives.
- Implement Courses (§4.13): curriculum, enrolment, progress, assessment, and certificates.
- Implement Community: forums/discussion, events, and recognition/badging, with AI moderation.
- Compose — not rebuild — using Identity, Payments, Courses, Community, and Notifications.

**Scope:** 3 milestones · 10 tasks. Full detail in `phase-7-community-courses.md`.

---

### P8 — Research, Governance & Internationalisation

*2 weeks · Spec Phase 8*

Add scholarship, the integrity constraint, and full multi-locale support. Governance activates the Integrity-Ledger veto over commercial and AI actions; the previously inert Governance hooks become live. Content localises fully, including RTL and multi-jurisdiction.

**Objectives**

- Implement Research (§4.18): outputs, datasets, citations, and provenance/source-grading metadata.
- Implement Governance (§4.19): the Integrity Ledger, assertions, and permit()/veto over commercial and AI actions.
- Activate the Governance hooks seeded inert in Phases 2, 4, and 6.
- Implement full Translation & i18n (§4.10): locale routing, catalogues, formatting, RTL, and jurisdiction profiles.
- Complete AI-assisted translation coordinated with the CMS workflow.

**Scope:** 3 milestones · 12 tasks. Full detail in `phase-8-research-governance.md`.

---

### P9 — Generator, Docs & Hardening

*2 weeks · Spec Phase 9*

Deliver create-institution, complete the ten-guide documentation set, and harden the platform. One command generates a production-ready institution passing every gate and deploying to a live preview. This phase makes the platform reusable.

**Objectives**

- Implement the create-institution CLI (§16) with industry presets and module selection.
- Ensure a generated project ships the full baseline: design system, CMS, auth, SEO, analytics, media, operations, docs, testing.
- Complete all ten documentation guides (§18) and example institutions.
- Harden performance (§14) and security (§13) to production budgets across the platform.
- Finalise release and migration workflows so institutions can upgrade safely.

**Scope:** 3 milestones · 12 tasks. Full detail in `phase-9-generator-hardening.md`.

---

