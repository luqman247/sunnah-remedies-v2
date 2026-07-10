# ENTERPRISE ARCHITECTURE REVIEW — 6 July 2026

Independent review of the v1 Master Knowledge System (this folder preserves its governance record). The board audited the repository as adversarially as its author built it. Findings, verdicts, and dispositions below; full reasoning in the decision logs of the successor repositories.

## Findings

**F-1 · Product/institution conflation — CRITICAL, upheld the restructure.** The v1 repository housed three brand-agnostic software products (Engineering OS, Continuum platform, DIOS) inside the institution's knowledge system. Ownership, versioning, and the consumer relationship were all misstated by the containment. → Three-repository ecosystem (D-015); the dependency direction *is* the architecture.

**F-2 · Register noise — MODERATE.** 42 of 545 register rows were individual PNG logo exports. A register exists to find knowledge, not inventory bytes. → Document-granularity register; asset packs as collections (D-020).

**F-3 · Governance-document overlap — MINOR.** KNOWLEDGE_MAP and KNOWLEDGE_GRAPH covered one need in two files with double maintenance. → Merged (D-019).

**F-4 · Hierarchy without content — MINOR.** `90-templates/` held one README. → Removed; templates live beside their governing standards (D-017).

**F-5 · Fossil numbering — MINOR.** Phase-1 bundle numbers survived in filenames (`05-information-architecture.md`) after the bundle ceased to exist, starting folders at 05. Verified zero inbound references. → Prefixes stripped (D-016).

**F-6 · Misleading folder name — TRIVIAL.** `homepage-and-experience/` also held Phase 5 vision material. → `experience/` (D-016).

**F-7 · Aspirational-scoring risk — IMPORTANT, prevented.** The commissioning prompt's example readiness scores included "Booking 92%". **No booking or clinical-platform specification exists anywhere in the corpus.** The board scored honestly: clinical/booking 35%, with a concrete action plan (AP-4). Boards that inherit example numbers produce launch-day surprises.

**F-8 · Decisions the board examined and UPHELD.** Keeping architecture + RFC set + constitutional stack as complementary layers (D-005) — a naive "one document per domain" merge would destroy the rationale/contract distinction. Preserving DIOS internal filenames (D-011) — five documents cite them verbatim; renaming a ratifiable legal corpus for folder aesthetics is churn, not clarity. Three constitutions with disjoint scopes (D-008). The archive-whole-trees policy (D-002).

## Verdict

The v1 consolidation was sound in content and lossless in execution; its structural flaw was singular but fundamental (F-1). The successor ecosystem corrects it and installs the production command centre so that documentation now serves execution rather than accumulating alongside it.
