# PRODUCTION BOARD

**The operational command centre of Sunnah Remedies.** Status, readiness, and gaps — updated continuously; all planning conversations update this set of six documents rather than creating new ones (D-022).

Last review: 2026-07-06 (independent Enterprise Architecture Review).

---

## Implementation readiness

Scores reflect **what exists in the repositories today**, audited honestly — not aspiration. Method: specification completeness × buildability (could a competent team or AI agent execute without inventing requirements?) × evidence from audits.

| Capability | Score | Basis | Below 90? Action plan |
|---|---|---|---|
| **Brand** | 100% | Manuals, design system, assets complete; SVG masters present | — |
| **Academy (governance)** | 98% | Framework v3, blueprint, standards, certification/assessment/workbook systems all canonical | — |
| **Academy (SRA-001 course)** | 82% | All 17 decks + production package done; **13 of 17 instructor guides and 14 of 17 student workbooks missing** | AP-1 below |
| **Website / experience** | 94% | Standards + Phase 3/5 specs complete; Phase 2 & 6 audits evidence a working estate | — |
| **Commerce** | 95% | 13-document spec to acceptance-checklist level (cart→Stripe→fulfilment) | — |
| **Operations backbone** | 90% | Phase 8 spec complete; automation boundaries defined | — |
| **Community / membership** | 88% | Phase 9 spec complete but depends on commerce entitlements + operations workflows not yet live | AP-2 |
| **Intelligence / AI** | 85% | Phase 6+7 specs complete; governance depends on DIOS Standard 10 pinning + operational RAG corpus not yet assembled | AP-3 |
| **Clinical platform & booking** | 35% | **Declared gap (D-021):** clinic operations exist as handbook chapters and course material only. No booking/scheduling, patient-record, or clinical-platform specification exists anywhere in the corpus | AP-4 |
| **Legal & governance docs** | 92% | Constitution, IP protection, academy constitutions present; company legal pack lives outside this repo | — |

## Action plans (everything below 90%)

**AP-1 — Complete SRA-001 companion material (82 → 100).**
Author instructor guides for modules 3–15 and student workbooks for modules 3–16, using the module 1/2/16/17 documents as the pattern and the production package as law. Estimate: 27 documents, template-driven. Owner: Academy. Target: 30 days.

**AP-2 — Community dependencies (88 → 95).**
Blocked-by, not spec-gap: ship commerce entitlements (Backlog B-2) and operations workflows (B-3), then implement Phase 9 as specified. The **Two Ledgers, One Standard** rule is a hard gate on every automated workflow. Owner: Engineering. Target: after B-2/B-3.

**AP-3 — Intelligence readiness (85 → 95).**
(1) Pin the DIOS handbook version consumed (ECOSYSTEM §4); (2) assemble the governed RAG corpus from this repository's canonical documents (the register is the manifest); (3) stand up evaluation per Phase 6 spec §QA. Owner: Engineering + AI. Target: 60 days.

**AP-4 — Clinical platform & booking (35 → 90).**
The genuine white space. Produce: (1) Clinical Platform Specification — patient journey, records, consent, safeguarding, *Two Ledgers* boundaries (clinical decisions never automated); (2) Booking & Scheduling Specification — practitioner calendars, clinic rooms, payments via existing commerce spec; (3) regulatory review (UK: CQC applicability, GDPR special-category data). Pattern: the commerce set's document structure. Owner: Founders + Clinical + Engineering. Target: specification in 45 days; build per critical path.

## Standing gaps register

| Gap | Severity | Home when resolved |
|---|---|---|
| Booking/scheduling spec absent | High | `30-digital-estate/clinical/` (new) |
| Clinical platform spec absent | High | `30-digital-estate/clinical/` (new) |
| SRA-001 guides/workbooks incomplete | Medium | `20-academy/courses/hijama-practitioner-programme/` |
| Marketing strategy not in repo | Low | `40-marketing/` when first document arrives (by decision-log entry) |
