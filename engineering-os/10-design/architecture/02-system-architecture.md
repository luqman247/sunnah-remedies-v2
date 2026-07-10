# Architecture 02 — System Architecture

## Purpose

Defines the high-level technical shape of the platform: the stack, the major systems, and the boundaries between them.

## Scope

The production system and its immediate operational backbone.

---

# Technology Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS |
| CMS | Sanity.io |
| Hosting | Vercel |
| Orchestration | Inngest |
| Booking | Cal.com |
| Transactional email | Resend |
| Lifecycle email | Loops |
| CRM | Canonical Postgres (HubSpot as marketing satellite) |

This stack is stable. Changing any element is a significant decision and requires an ADR.

---

# System Boundaries

Presentation (Next.js) — renders; holds no business rules.

↓

Application services — business logic; the single source of truth for rules.

↓

Content (Sanity) — editorial and configuration data.

↓

Operational backbone (Inngest, Cal.com, Resend, Loops, CRM) — workflow and communication.

Each boundary is one-directional in authority: presentation depends on services, services depend on content and the backbone, never the reverse.

---

# Principles

- Business logic is computed server-side, once, and never duplicated in the client.
- Content is CMS-driven; nothing editable is hardcoded.
- Integrations are wrapped behind a service so that a tool can be replaced without touching presentation.

---

# Related Documents

- 01 Vision
- 03 Content Model
- 04 Folder Structure
- 07 Development Standards

## Document Metadata

**Document Type:** Architecture
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Every 6 months
