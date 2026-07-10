# IMPLEMENTATION ROADMAP

What to build, in what order, prioritised by business value — not by document order. Dependencies are stated explicitly; specifications are cited by repository path.

---

## Horizon 0 · Immediate (this month) — revenue and trust

**R0.1 — Ratify the constitutions.**
Three root documents are in "ratifiable draft" status: DIOS Document 00, the plain-language Digital Institution Constitution, and Continuum 000. Everything downstream inherits their authority; freezing them is a one-day founder action that de-risks every other line on this roadmap.
*Depends on:* nothing. *Unblocks:* everything.

**R0.2 — Complete the commerce implementation** (`30-digital-estate/commerce/`).
The commerce set is the most direct revenue path: cart, checkout, Stripe, webhooks, fulfilment, entitlements are fully specified to checklist level, and the Phase 2/6 audits show the surrounding estate is stable.
*Depends on:* digital-estate standards (done). *Quick win:* the migration and acceptance checklists (doc 08) define "done" unambiguously.

**R0.3 — Stand up the operational backbone** (`30-digital-estate/operations/phase-8-operations-spec.md`).
Workflow automation reduces founder load immediately and is prerequisite plumbing for community (Phase 9) and academy delivery.

## Horizon 1 · This quarter — the institution goes live as an institution

**R1.1 — Phase 9 community, membership, and alumni** (`30-digital-estate/community/`).
Recurring-revenue membership and the alumni network. The "Two Ledgers, One Standard" constraint (clinical, religious, and above-threshold financial decisions are never automated) is a hard gate in every workflow built here.
*Depends on:* R0.2 (entitlements), R0.3 (workflows).

**R1.2 — Academy delivery stack** (`20-academy/`).
Certification, assessment, and workbook systems are specified; connect them to the course/community platform from R1.1. This converts the academy's intellectual property into enrolment revenue.
*Depends on:* R1.1.

**R1.3 — Intelligence platform, governed** (`30-digital-estate/intelligence/`).
Phase 6 AI engineering + Phase 7 intelligence platform, under DIOS Standard 10 (AI agents) and the security standards. High leverage, but sequenced after revenue systems deliberately.

## Horizon 2 · This half — the platform ventures

**R2.1 — Finish the Continuum constitutional stack** (`60-continuum/constitutional-specifications/SPECIFICATION-PROGRAMME.md`).
Thirteen specifications remain (001–010, 012–015). The programme document orders them by dependency; the RFC set v1.0 provides source material for each, so this is consolidation-authoring, not invention.
*Critical path within R2.1:* 001 runtime → 003 engine contracts → 002 context graph → 005 project schema → 006 verification → the rest.

**R2.2 — Execute DIOS Phases 0–3** (`50-dios/implementation-programme/`).
Foundations, design system, CMS/media, identity/security — the reusable half of the starter platform. Phases 4–9 follow only after the Sunnah Remedies estate (Horizons 0–1) has validated the patterns in production.

**R2.3 — `create-institution` generator** (DIOS Phase 9).
The strategic payoff of DIOS: generating new institutions from the platform. Deliberately last; it hardens only what production has proven.

## Dependency spine

```
R0.1 ─▶ everything
R0.2 ─▶ R1.1 ─▶ R1.2
R0.3 ─▶ R1.1
standards (done) ─▶ R1.3
R2.1 ─▶ Continuum implementation (beyond this roadmap)
R0–R1 production experience ─▶ R2.2 ─▶ R2.3
```

## Quick wins (any idle week)

1. Freeze VERSION 1.0.0 of the DIOS handbook (R0.1 subtask).
2. Run the Institutional Review Checklist against the live site; file gaps as issues.
3. Author Continuum spec 001 (runtime) directly from RFC-200–204 — the highest-leverage single document in R2.1.
4. Publish the operations handbook internally — it is complete and needs only distribution.

## What deliberately waits

- Continuum implementation code — until the constitutional stack is complete (R2.1).
- DIOS Phases 4–9 — until production validation (R2.2 gate).
- Any new documentation domains — the taxonomy is frozen for one full quarter to let the system bed in (D-001).
