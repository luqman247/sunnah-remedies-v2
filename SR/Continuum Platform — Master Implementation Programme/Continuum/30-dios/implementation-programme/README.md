# Continuum Platform — Master Implementation Programme

This bundle decomposes the **DIOS — Digital Institution Starter Platform Engineering Specification (v1.0)** into a complete, task-level engineering backlog. It does not redesign the architecture or rewrite the specification; every phase, module, and interface traces directly to the spec.

## What's inside

Two formats of the same programme:

- **`docx/`** — styled Word documents (master + one per phase), matching the specification's house style.
- **`md/`** — Markdown files (master + one per phase), ready to import into an issue tracker, wiki, or agent context.

## Structure

| File | Contents |
| --- | --- |
| `00-master-programme` | Team model, global conventions, Definition of Ready/Done, phase map, dependency flow, and phase summaries. |
| `00-phase-0-foundations` | Monorepo, standards, CI/CD, Core kernel, ADRs, agent rules. |
| `01-phase-1-design-system` | Tokens, primitives, Storybook, a11y + visual-regression gates. |
| `02-phase-2-cms-media` | Structured content, editorial lifecycle, Cloudinary media pipeline. |
| `03-phase-3-identity-security` | Auth, RBAC, security baseline, Settings, jurisdiction profiles. |
| `04-phase-4-search-knowledge-ai` | Search, knowledge graph, embeddings, governed RAG. |
| `05-phase-5-operations` | Workflow engine, jobs, notifications, CRM. |
| `06-phase-6-commerce-payments` | Headless Shopify commerce, Stripe payments, entitlements. |
| `07-phase-7-community-courses` | Membership, courses, community, role portals. |
| `08-phase-8-research-governance` | Research, Integrity-Ledger governance, i18n/RTL. |
| `09-phase-9-generator-hardening` | `create-institution` generator, docs, hardening, releases. |

## How to read it

1. Start with the master document for the operating model and phase map.
2. Work phases in order (P0 → P9). Each phase is independently deployable and leaves `main` shippable.
3. Within a phase: milestones in order; tasks within a milestone parallelise across the squad where inputs are met.
4. Each task is scoped for one AI agent (Cursor / Claude Code) to complete in a single focused session, and carries Inputs, Outputs, Files created, Files modified, Verification steps, and Manual QA steps.

## Programme at a glance

- **10 phases**, each ~1–2 weeks for a squad of 4–6 engineers plus AI agents.
- **35 milestones**, **129 tasks**, every task independently completable and deployable.
- Merge gates on every task: typecheck · lint · format · unit · integration · a11y · visual-regression · dependency-graph · secret-scan · build.
