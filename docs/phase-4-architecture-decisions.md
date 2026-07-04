# Phase 4: Operational Excellence — Architecture Decisions

This document records the major architectural decisions made during the
Phase 4 implementation. It exists so a successor can understand *why*
things are as they are without meeting the original authors.

**Document control:** v1.0 · Custodian: Head of Systems · Classification: Internal

---

## ADR-001: Sanity as the single operational data store

**Context:** Phase 4 requires storage for batch records, operational logs,
compliance registers, decision logs, and audit findings. The v1 plan proposed
adding PostgreSQL alongside Sanity.

**Decision:** Use Sanity for all operational records.

**Rationale:**
- Sanity already handles documents, versioning, access control, and querying.
- Adding a second database creates sync problems and doubles backup burden.
- Clinical/health data (which genuinely needs higher protection) is deliberately
  excluded from this system — it lives in paper records or a purpose-built EHR.
- One data store means one backup strategy, one access model, one API.
- Sanity's data is exportable as NDJSON, making it portable if we ever migrate.

**Consequences:** Sanity API token is required for write operations.
Query performance should be monitored as operational log volume grows.

---

## ADR-002: NextAuth with Credentials provider for staff authentication

**Context:** Internal staff tools need authentication. Options considered:
Clerk (managed), Auth0 (managed), Supabase Auth, NextAuth (self-hosted).

**Decision:** NextAuth (Auth.js) with Credentials provider.

**Rationale:**
- Open-source, self-hostable, runs on any Node runtime.
- No vendor lock-in, no monthly cost, no API changes beyond our control.
- Credentials provider means the institution manages accounts directly
  via environment variables (appropriate for <30 staff).
- JWT sessions eliminate the need for a session database.
- Migratable: can add OAuth providers later without changing middleware.

**Consequences:** Staff credential management is manual (env vars).
At scale (>30 staff), should migrate to database-backed credentials
with password hashing.

---

## ADR-003: (staff) route group with separate layout

**Context:** Internal tools need to be visually and functionally separate
from the public-facing site, without affecting public performance or UX.

**Decision:** Use Next.js route groups — `(staff)` group with its own layout
that excludes the public Masthead and Footer.

**Rationale:**
- Zero impact on public site (no shared state, no bundle bloat).
- Middleware applies only to staff routes (`/handbook/*`, `/ops/*`).
- robots noindex prevents accidental indexing.
- Clean separation of concerns: public vs. internal.
- The public site continues to work identically even if auth is misconfigured.

**Consequences:** Staff pages use the same root layout (fonts, globals.css)
but different chrome. CSS is scoped via `.handbook-content` class.

---

## ADR-004: Markdown handbook rendered from filesystem, not CMS

**Context:** The 15-chapter Operations Handbook needs to be available
to staff as a searchable reference. Options: store in Sanity, or read
from the docs/ directory.

**Decision:** Read directly from the filesystem.

**Rationale:**
- The handbook is already in `docs/phase 4/` as markdown files.
- Version-controlled alongside code: changes go through code review
  (matching the Handbook's own document-control process).
- Plain text is the most durable format — readable by anything, forever.
- No additional infrastructure, no sync issues, no CMS migration risk.
- Updates to the handbook follow the same PR process as code changes.

**Consequences:** Handbook content is only updated via code deployment.
This is intentional — handbook changes should be deliberate and reviewed.

---

## ADR-005: Validation rules over custom publish actions

**Context:** The approval matrix (Ch 12) requires certain sign-offs before
publishing. Options: custom document actions that block publishing, or
validation rules that surface warnings.

**Decision:** Use Sanity's built-in validation system with custom validators.

**Rationale:**
- Validation surfaces immediately as editors work (not just at publish time).
- Declarative and maintainable — just functions that return strings or true.
- Cannot be bypassed without resolving the issue.
- No custom UI code needed — uses Studio's native validation display.
- Works across all document types that embed the editorial workflow.

**Consequences:** Editors see validation errors inline. The slow-lane status
requires a reason. Published articles require a review date and provenance.

---

## ADR-006: No custom clinical record system

**Context:** Phase 4 Chapter 06 defines clinical record requirements.
V1 proposed building a custom encrypted clinical records database.

**Decision:** Do NOT build a clinical record system. Use paper records
initially; procure a compliant EHR when scale requires it.

**Rationale:**
- Custom clinical systems carry medical-device regulatory risk.
- Health data encryption, access control, and audit requirements
  are best met by purpose-built, professionally maintained software.
- Paper records in a locked cabinet meet the spec's requirements
  for confidentiality, access control, and retention.
- Building custom health software is a multi-year maintenance
  commitment with regulatory oversight — inappropriate for this team.

**Consequences:** Clinical record-keeping is a manual process until
the institution procures a third-party EHR system.

---

## ADR-007: Operational forms write via Server Actions

**Context:** Staff forms (temperature logs, goods-in, sign-offs) need
to write data to Sanity. Options: custom API routes, or Next.js Server Actions.

**Decision:** Use Server Actions.

**Rationale:**
- No separate API layer to maintain or version.
- Type-safe: actions share types with the forms that call them.
- Collocated with the Sanity write client — clear data flow.
- Authenticated server-side (getServerSession check in every action).
- Standard HTTP POST under the hood — no protocol lock-in.

**Consequences:** Forms call server actions directly. No REST API
documentation needed for internal forms. If external systems need
to write operational data in future, API routes can be added then.

---

*End of architectural decisions. New decisions should be appended below
with an incrementing ADR number.*
