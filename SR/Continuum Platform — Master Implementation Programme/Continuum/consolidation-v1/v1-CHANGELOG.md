# CHANGELOG

All notable changes to the Master Knowledge System. Newest first. Every merge, move, rename, archive, and canonical decision is traceable here; reasoning lives in `DECISION_LOG.md` (referenced by D-number).

---

## [1.0.0] — 2026-07-06 · Founding consolidation

**Input:** 11 archives + 3 loose documents · 849 files · 443 unique by content hash.
**Output:** this repository — 497 canonical/archived files + governance records. Nothing unique was lost.

### Repository established
- Created domain-numbered structure `00`–`90` + `archive/` (D-001).
- Authored root governance set: `README.md`, `START_HERE.md`, `KNOWLEDGE_MAP.md`, `KNOWLEDGE_GRAPH.md`, `DOCUMENT_REGISTER.md`, `DECISION_LOG.md`, `IMPLEMENTATION_ROADMAP.md`, this changelog.

### Canonical placements (moved + renamed to kebab-case unless noted)
- **00-institution/** ← Phase 1 Institution Constitution; Academy Three Foundational Constitutions PDF; the 14-chapter Operations Handbook + security-operations annex (Phase 4 Part 1); branded IP Protection System PDF (D-007).
- **10-brand/** ← Brand Manual, Design System, Institutional Design Manual, Photography Manual, Editorial Style Guide, Editors' Guide (Phase 1); Brand Bible, Academy Visual Identity, Islamic Visual Language, Academy Design Bible, Icon Library, Photography Style Guide PDFs (Academy bundle); complete logo asset package (SVG masters + PNG exports) with brand guidelines docx (D-012).
- **20-academy/courses/hijama-practitioner-programme/** ← SRA-001 complete course: production package v1.0 (SRA-DOC-2026-PROD-001), programme master deck, module decks 01–17 (renamed to module convention), instructor guides (01, 02, 16, 17 — unlabeled files identified by content, D-013), student workbooks (01, 02, 17).
- **20-academy/** ← Academy Framework v3.0 (definitive institutional framework); Academy Blueprint updated to the 2026-07-06 re-export (D-014).
- **20-academy/** ← Academy Standards (Phase 1); Academy Blueprint, Certification System, Assessment Framework, Workbook System, Presentation Design System, Medical Illustration System PDFs.
- **30-digital-estate/** ← Bilingual (EN/DA) i18n architecture guide → `standards/bilingual-i18n-architecture-guide.md`; Phase 1 standards set (IA, CMS, engineering, SEO, accessibility, product, Sacred Journeys, review checklist, Cursor rebuild directive); Phase 3 homepage + implementation specs; Phase 5 Institute Vision + SEO knowledge spec; Phase 4 Part 2 commerce set (13 documents); Phase 8 operations spec; Phase 6 AI engineering spec; Phase 7 intelligence platform spec; Phase 9 community/membership/alumni spec; Phase 2 + Phase 6 audits into `phase-audits/` (D-010).
- **40-engineering/** ← the complete Engineering Operating System tree (149 files), unmodified (D-002).
- **50-dios/** ← DIOS handbook (constitution, plain-language constitution, standards 01–15, review + release checklists, README/VERSION/CHANGELOG), internal filenames preserved (D-011); DIOS Starter Platform Engineering Specification v1.0 docx; 10-phase implementation programme, Markdown canonical, docx renderings under `generated-docx/` (D-006).
- **60-continuum/** ← Continuum Platform Architecture; Technical Specification v1.0 (34-RFC set + generated `CONSOLIDATED.md`); constitutional specifications 000 + 011; authored `SPECIFICATION-PROGRAMME.md` tracking specs 001–010 and 012–015 as commissioned-not-yet-authored (D-004, D-005).
- **90-templates/** ← authored template index.

### Archived (append-only, fully preserved)
- Engineering Playbook, complete 171-file tree → `archive/superseded-engineering-playbook/` (D-002).
- `eos-v2-architecture.md` → `archive/superseded-platform-documents/` (D-005).
- Unbranded `SRA_Intellectual_Property_Protection_System.pdf` → `archive/superseded-brand-documents/` (D-007).
- Academy Blueprint v2.0, 2026-07-05 export → `archive/superseded-academy-documents/` (D-014).

### Duplicates collapsed (evidence in `archive/duplicate-manifest/DUPLICATE_MANIFEST.md`)
- `Sunnah_Remedies_Engineering_OS_v1.zip` ≡ `engineering-os.zip` — one carried (D-003).
- `AI-native_software_engineering_platform.zip` ≡ `..._2.zip`; all 15 spec files zero-byte — scaffold recorded, empty files not carried (D-003, D-004).
- Engineering Playbook copy inside `docs.zip` ≡ standalone Playbook — one archived (D-003).
- DIOS loose root constitution copies ≡ nested handbook copies — nested carried (D-009).
- `SRA_Intellectual_Property_Protection_System (1).pdf` ≡ unbranded original — one archived (D-007).
- Five byte-identical placeholder checklists noted inside the archived Playbook (evidence for D-002).

### Renames of note
- All Phase-derived files normalised to kebab-case with content untouched; mapping preserved in the duplicate manifest's rename table.
- `Continuum_Technical_Specification_v1.0_CONSOLIDATED.md` → `60-continuum/technical-specification-v1/CONSOLIDATED.md` (marked generated).

---

*Future entries follow [semver] — date, grouped Added / Changed / Superseded / Archived.*
