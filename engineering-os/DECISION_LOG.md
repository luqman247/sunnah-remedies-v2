# Decision Log

A running record of significant engineering decisions. Each entry is dated and immutable; supersede rather than edit. Significant, hard-to-reverse decisions also warrant a full ADR in `10-design/architecture/`.

---

## 2026-07-05 — Adopt a lifecycle spine as the canonical structure

**Context:** The repository had three competing organising schemes (numbered chapters, type-folders, lifecycle phases), with the most prominent scheme empty.
**Decision:** Adopt the engineering lifecycle (`00-foundation → 10-design → 20-plan → 30-build → 40-verify → 50-release → 90-reference`) as canonical; nest type-folders beneath it.
**Why:** It matches how work actually flows and how an AI agent should traverse the repo per task. It also gives every document one unambiguous home.
**Consequence:** Numbered chapters retired; type-folders relocated; all references updated.

---

## 2026-07-05 — Enforce structure with docs-lint

**Context:** The repository had rotted into 42+ empty files, colon-named folders, and format bloat.
**Decision:** Add `docs-lint.sh` and run it in CI; it fails on empty files, illegal paths, missing metadata, and un-paired bad examples.
**Why:** Documentation rot is silent. Only automated enforcement prevents recurrence.
**Consequence:** Every commit must pass the linter.

---

## 2026-06 — Two Ledgers, One Standard (recorded retrospectively)

**Context:** Commercial optimisation could, if unchecked, erode clinical accuracy and source authenticity.
**Decision:** The Integrity Ledger holds veto power over the Commercial Ledger.
**Why:** Integrity is the institution's reason to exist; it cannot be a variable.
**Consequence:** Every planned item is checked against integrity before commerce. See `10-design/architecture/01-vision.md`.

---

## 2026 — Core stack: Next.js 14, TypeScript, Sanity, Vercel (recorded retrospectively)

**Context:** The platform needed a modern, CMS-driven, server-rendered foundation.
**Decision:** Next.js 14 (App Router) + TypeScript + TailwindCSS + Sanity.io on Vercel; Inngest, Cal.com, Resend, Loops, and a canonical Postgres CRM for the operational backbone.
**Why:** Server-side rendering, strong typing, editorial content separation, and mature hosting.
**Consequence:** Changing any element is a significant decision requiring an ADR.

## Document Metadata

**Document Type:** Reference
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Continuous (append-only)
