# Changelog — Engineering Operating System

All notable changes to this Engineering OS are recorded here. This tracks the *methodology*, not any project built with it.

The format follows Keep a Changelog; the OS uses Semantic Versioning.

---

## [1.0.0] — 2026-07-05

### Added
- Canonical lifecycle spine: `00-foundation → 10-design → 20-plan → 30-build → 40-verify → 50-release → 90-reference`.
- Claude (Architect/Planner) workflow.
- Seven-part canonical architecture (`10-design/architecture/01–07`).
- Five previously-missing worked "good" examples, including the Hijama booking flow.
- Master planning document, AI/engineering glossary, root README, AI entry point, CONTRIBUTING, and docs-lint.

### Changed
- Reorganised from three competing schemes (chapters, type-folders, lifecycle) into a single lifecycle spine.
- Standardised all filenames to `kebab-case.md`; removed spaces and colons from all paths.
- Appended a consistent metadata block to every document.
- Cross-linked every bad example to its good twin.

### Removed
- 27 empty chapter/appendix placeholder files (intent folded into lifecycle folders).
- Duplicate example variants and macOS cruft.

### Fixed
- Loose-list formatting bloat across 78 files.
- Illegal colon-suffixed directory names (24 folders).

## Document Metadata

**Document Type:** Reference
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Per release
