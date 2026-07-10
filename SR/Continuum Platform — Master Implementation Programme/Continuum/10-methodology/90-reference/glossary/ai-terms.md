# Glossary — AI and Engineering Terms

## Purpose

Defines the shared vocabulary of the Engineering Operating System so that humans and AI assistants interpret every term identically. Consistent terminology is the foundation of AI-friendly documentation.

## Scope

Terms used across this Engineering OS. Domain terms (Prophetic Medicine, Hijama, isnād) are defined in the domain glossary, not here.

---

# Terms

**ADR (Architecture Decision Record)** — A dated record of a significant, hard-to-reverse decision: its context, options, decision, and consequences.

**Acceptance Criteria** — The verifiable conditions a piece of work must satisfy to be considered complete. Each must be objectively checkable.

**Agent** — An AI assistant (Claude, Cursor, or successor) operating within this OS, bound by the Engineering Behaviour Standard.

**Boundary** — A point where authority changes hands (e.g. an API route). Boundaries validate input and orchestrate; they hold no business rules.

**Composite** — A feature component assembled from design-system primitives.

**Definition of Done** — The fixed checklist that determines whether work is complete. Evidence-based, not assertion-based.

**Design-system Primitive** — A foundational, fixed UI element (`components/ui/`). Composed by feature work, never altered by it.

**Evidence** — Observable proof that work is complete: build output, passing type-check, lint result, browser verification, updated docs. Required before any claim of completion.

**Fixed Foundation** — An established primitive (design tokens, typography, palette, motion caps) that later work composes but must not change.

**Integrity Ledger** — The governing record of clinical accuracy and source authenticity. Holds veto power over the Commercial Ledger.

**Lifecycle** — The canonical flow: DESIGN → PLAN → BUILD → VERIFY → RELEASE. This OS is organised along it.

**Milestone** — A discrete, verifiable unit of delivery within a phase.

**Prompt** — A reusable, versioned instruction to an AI agent with one responsibility, explicit constraints, acceptance criteria, and deliverables.

**Provenance** — The recorded source and authenticity grade of a claim. Structural data, not an informal note.

**Service** — A unit of business logic in `lib/`; the single source of truth for a rule.

**Two Ledgers, One Standard** — The governing doctrine: the Integrity Ledger and the Commercial Ledger are held to one standard, with integrity holding veto.

**Verification Report** — The evidence-backed record produced at the VERIFY stage, including what was and was not verified.

---

# Related Documents

- Engineering Behaviour Standard
- Definition of Done
- Prompt Writing Standard

## Document Metadata

**Document Type:** Glossary
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Annual
