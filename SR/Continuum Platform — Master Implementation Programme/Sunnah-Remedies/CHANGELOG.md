# CHANGELOG — Sunnah-Remedies

## [2.0.0] — 2026-07-06 · Enterprise Architecture Review restructure
**Breaking:** repository split. Platform content (Engineering OS, Continuum platform, DIOS) moved to the independent `Continuum` repository; superseded material to the `Archive` repository (D-015).

### Added
- `ECOSYSTEM.md` (canonical) and `BOUNDARY.md` — the inter-repository contract and this repository's charter.
- `production/` command centre: PRODUCTION_BOARD, IMPLEMENTATION_BACKLOG, CRITICAL_PATH, NEXT_90_DAYS, LAUNCH_CHECKLIST, POST_LAUNCH_PLAN (D-022).

### Changed
- `30-digital-estate/homepage-and-experience/` → `experience/`; `phase-audits/` → `audits/` (D-016).
- Phase-1 numeric prefixes stripped from brand, academy, and standards filenames — zero inbound references existed (D-016).
- `KNOWLEDGE_MAP.md` now incorporates the dependency graph; `KNOWLEDGE_GRAPH.md` retired (D-019).
- `DOCUMENT_REGISTER.md` regenerated at document granularity; asset packs registered as collections (D-020).

### Removed
- `90-templates/` folder (single-file hierarchy, D-017).
- `40-engineering/`, `50-dios/`, `60-continuum/` → `Continuum` repository (D-015).
- `archive/` → `Archive` repository (D-015).
- `IMPLEMENTATION_ROADMAP.md` → superseded by `/production` (D-022; preserved in Archive).

## [1.0.0] — 2026-07-06 · Founding consolidation
See `Archive/consolidation-v1/v1-CHANGELOG.md` for the complete founding record (849 source files → 443 unique → canonical tree; nothing lost).
