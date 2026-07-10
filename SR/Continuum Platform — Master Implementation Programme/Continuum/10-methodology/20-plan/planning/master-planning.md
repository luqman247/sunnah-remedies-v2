# Master Planning

## Purpose

The top-level planning document that sequences the entire platform build. It sits above individual milestone, sprint, and roadmap plans and is the single place to understand *what is being built, in what order, and why*.

## Scope

The full platform delivery across Phases A–J.

---

# How Planning Nests

Master Plan (this document — phases and their order)

↓

Roadmap (phase intent and timing)

↓

Milestone Planning (30–50 sequenced milestones)

↓

Sprint Planning (near-term execution)

Each level refines the one above it. Nothing at a lower level may contradict a higher level without an approved change.

---

# Planning Principles

- **Architecture before implementation.** No milestone begins without an approved specification.
- **Dependency-aware sequencing.** A milestone that depends on another is never scheduled first.
- **Fixed foundations respected.** No plan reopens a fixed design-system primitive.
- **Verification gates every milestone.** A milestone is done only when its verification report passes.
- **Compliance designed in.** Data-handling milestones carry their UK GDPR / EU GDPR / KSA PDPL scope from the start.

---

# The Two Ledgers in Planning

Every planned item is checked against the Integrity Ledger before the Commercial Ledger. A milestone that would accelerate revenue at the cost of accuracy or authenticity is rejected or re-scoped, regardless of commercial pressure.

---

# Master Sequence

See `10-design/architecture/06-roadmap.md` for the Phase A–J table. This document governs the ordering rules; the roadmap holds the phase content.

---

# Related Documents

- Roadmap
- Milestone Planning
- Sprint Planning
- Risk Analysis

## Document Metadata

**Document Type:** Planning
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Quarterly
