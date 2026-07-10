# Sunnah Remedies — Institutional Knowledge System

**The single source of truth for the Sunnah Remedies institution.**
Version 2.0.0 · Restructured 6 July 2026 by independent architecture review · Custodian: Office of the Founders

This repository contains everything that *is* Sunnah Remedies — governance, brand, academy, clinical operations, website, commerce, and business operations — and nothing that isn't. The software platform the institution builds upon lives in its own independent repository, **Continuum**; superseded history lives in **Archive**. The relationship is defined in `ECOSYSTEM.md`; this repository's exact boundary is defined in `BOUNDARY.md`.

## Structure

| Folder | Contents |
|---|---|
| `00-institution/` | Constitution · 14-chapter Operations Handbook · IP protection |
| `10-brand/` | Brand manual · design system · photography · editorial · logo assets |
| `20-academy/` | Framework v3 · blueprint · certification, assessment, workbook systems · SRA-001 Hijama Practitioner course |
| `30-digital-estate/` | Website & product programme: standards, experience, commerce, operations, intelligence, community, audits |
| `production/` | **The operational command centre** — production board, backlog, critical path, next 90 days, launch checklist, post-launch plan |

Root records: `START_HERE.md` (orientation), `KNOWLEDGE_MAP.md` (tour + dependency graph), `DOCUMENT_REGISTER.md` (catalogue, generated), `DECISION_LOG.md` (why things are as they are), `CHANGELOG.md` (what changed), `ECOSYSTEM.md`, `BOUNDARY.md`.

## Operating rules

1. **One source of truth per domain.** The register names it; duplication is a defect.
2. **Supersede, never overwrite.** Old versions go to the `Archive` repository with a decision-log entry.
3. **Planning happens in `/production`.** Future work updates the production board and backlog — no new disconnected planning documents.
4. **Platform-generic knowledge is contributed to Continuum,** never accumulated here (`ECOSYSTEM.md` §contract).
5. **Generated artifacts are never hand-edited** — the register marks them.
