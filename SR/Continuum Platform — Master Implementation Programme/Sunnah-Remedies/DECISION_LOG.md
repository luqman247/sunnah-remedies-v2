# DECISION LOG — Sunnah-Remedies

Append-only institutional memory. Entries D-001 – D-014 record the founding consolidation (full originals preserved in `Archive/consolidation-v1/`); D-015 onward record the independent Enterprise Architecture Review of 2026-07-06 that produced this repository's current form.

---

## Founding consolidation (2026-07-06, morning) — summary of entries relevant to this repository

- **D-001** Domain-numbered information architecture adopted over phase- or tool-based structures.
- **D-007** Branded IP-protection PDF canonical; unbranded original archived.
- **D-008** Three constitutions retained with disjoint scopes (institution / DIOS / plain-language DIOS).
- **D-010** The Phase 1–9 digital-estate record kept whole, audits included, because later phases cite them.
- **D-011** kebab-case naming; generated content in marked folders.
- **D-012** Logo SVG masters are truth; PNGs are exports.
- **D-013** SRA-001 course material organised by component under `20-academy/courses/`; unlabeled files identified by content and renamed.
- **D-014** Academy Blueprint: newer re-export canonical; older export archived.

## Enterprise Architecture Review (2026-07-06, afternoon)

### D-015 — The institution and its platform are separated into independent repositories
**Problem:** The v1 repository mixed two different kinds of knowledge: what Sunnah Remedies *is* (institution) and what it *builds with* (Engineering OS, Continuum platform, DIOS). The platform products are brand-agnostic and potentially commercial; housing them inside the institution repository misstated ownership, blocked independent versioning, and made both harder to reason about.
**Alternatives:** (a) keep one repository with stronger internal boundaries; (b) four repositories (institution / methodology / platform / DIOS); (c) two working repositories + shared archive.
**Decision:** (c). `Sunnah-Remedies` (institution only), `Continuum` (methodology + platform + DIOS as three bounded products), `Archive` (shared history).
**Reasoning:** One repo (a) cannot express "SR *uses* the platform" — the dependency direction is the architecture. Four repos (b) is premature: methodology, platform, and DIOS share one owner, one lifecycle, and heavy cross-reference today; splitting them now triples governance overhead for no consumer benefit. The split point that carries meaning today is institution vs platform.
**Consequences:** SR pins the DIOS version it builds against (`ECOSYSTEM.md` §4). The boundary test for every future document is written into `ECOSYSTEM.md`. Trade-off accepted: cross-repository links are weaker than in-repo links; mitigated by the ecosystem contract and registers.

### D-016 — `30-digital-estate` folder simplifications
`homepage-and-experience/` → `experience/` (it holds Phase 5 vision material, not only homepage); `phase-audits/` → `audits/`. Phase-1 numeric filename prefixes stripped (e.g. `05-information-architecture.md` → `information-architecture.md`): grep across the corpus found **zero inbound references** to the numbered names, and the numbers encoded the order of a bundle that no longer exists. Reading order is the README's job, not the filename's.

### D-017 — `90-templates/` folder removed
It contained a single index README — hierarchy without content, and its engineering rows moved to Continuum anyway. The SR-relevant template (institutional review checklist) is registered where it lives. One-file folders are a smell; removed.

### D-019 — KNOWLEDGE_MAP and KNOWLEDGE_GRAPH merged
Two root documents covered one need (orientation + relationships) with overlapping content and double maintenance cost. Merged into `KNOWLEDGE_MAP.md`. Root governance reduced from eight documents to seven with no information loss.

### D-020 — Register granularity: documents, not files
The v1 register listed every PNG logo export (42 asset rows of 545). Assets are registered as collections with a named source of truth; documents (including each course deck) remain individually registered. The register is for finding knowledge, not for inventorying bytes — the filesystem already does that.

### D-021 — Honest implementation-readiness scoring
The production board scores what exists, not what is hoped. Notably: **no booking/scheduling specification exists anywhere in the corpus** and no clinical-platform specification beyond handbook chapters — both are declared gaps with action plans, not assumed capabilities. (See `production/PRODUCTION_BOARD.md`.)

### D-022 — Planning consolidates into `/production`
The v1 `IMPLEMENTATION_ROADMAP.md` is superseded by the production board set (board, backlog, critical path, 90 days, launch checklist, post-launch). Roadmap content was carried into `CRITICAL_PATH.md` and `NEXT_90_DAYS.md`; the v1 file is preserved in `Archive/consolidation-v1/`. All future planning updates these six files.

### D-023 — ECOSYSTEM.md canonical here, mirrored in Continuum
The consuming institution defines the demand side of the contract, and founders govern from this repository; the platform repo carries an identical mirror so it remains self-explanatory when read alone. Both copies change together.
