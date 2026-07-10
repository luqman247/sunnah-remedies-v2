# DECISION LOG

Permanent institutional memory of every significant decision made during the 6 July 2026 consolidation, and the template for all future decisions. Append-only.

**Format:** ID · Date · Problem · Alternatives · Decision · Reasoning · Consequences.

---

## D-001 — Domain-first, authority-numbered information architecture

**Date:** 2026-07-06
**Problem:** Eleven source archives used four incompatible organising principles (by phase, by lifecycle, by tool, by export batch). A new employee could not find anything; documents about one subject lived in five places.
**Alternatives considered:** (a) preserve source archive structure with an index overlay; (b) organise by lifecycle only, mirroring `40-engineering`; (c) organise by knowledge domain with numeric authority prefixes.
**Decision:** (c). Nine top-level domains numbered `00`–`90` by institutional precedence, with governance records at the root.
**Reasoning:** Domains are stable for decades; phases and tools are not. Numeric prefixes encode authority order visibly, which AI agents and new staff can follow without oral tradition.
**Consequences:** All source folder names retired. Phase-numbered specs retained *inside* domains because later documents cite them by phase number.

## D-002 — The Engineering OS is canonical; the Engineering Playbook is archived

**Date:** 2026-07-06
**Problem:** Two complete engineering methodologies existed: the "Sunnah Remedies Engineering Playbook" (171 files, ad-hoc folder names containing `:` characters, five checklists that were byte-identical placeholder stubs) and "engineering-os" (149 files, numbered lifecycle spine, CI workflows, CONTRIBUTING guide). Content-hash analysis found only 1 file in common — the second is a full rewrite, not a copy.
**Alternatives:** keep both; merge file-by-file; canonise the rewrite and archive the original.
**Decision:** `engineering-os` → `40-engineering/` (canonical). Playbook → `archive/superseded-engineering-playbook/` intact.
**Reasoning:** The OS's own README declares itself the successor; its structure is a superset (adds foundation, examples good/bad, CI); the Playbook contains identical-stub checklists indicating unfinished consolidation that the OS completed. No unique Playbook idea was found absent from the OS at the structural level; the full Playbook is preserved so any line can be recovered.
**Consequences:** All future engineering references point to `40-engineering/`. The Playbook copy embedded inside `docs.zip` was an exact duplicate and was not carried (see duplicate manifest).

## D-003 — Two identical uploads collapsed to one (three cases)

**Date:** 2026-07-06
**Problem:** `Sunnah_Remedies_Engineering_OS_v1.zip` and `engineering-os.zip` were byte-identical (differing only in `.DS_Store`); `AI-native_software_engineering_platform.zip` and `..._2.zip` were byte-identical; `docs.zip` contained a byte-identical copy of the entire Engineering Playbook.
**Decision:** One copy carried in each case; duplication recorded in `archive/duplicate-manifest/DUPLICATE_MANIFEST.md`.
**Reasoning:** The non-negotiable principles forbid losing information, not deleting redundant identical bytes; the manifest preserves the evidence.

## D-004 — The AI-native platform scaffold contained no content

**Date:** 2026-07-06
**Problem:** Both AI-native platform archives contained fifteen specification files (`001`–`015`) that were all **zero bytes** — a folder scaffold, not a specification.
**Decision:** The scaffold is recorded (file list preserved in the duplicate manifest) but empty files are not carried into the canonical tree. The real, authored `000-platform-constitution.md` and `011-security-model.md` (from a later export) are canonical in `60-continuum/constitutional-specifications/`, and `SPECIFICATION-PROGRAMME.md` tracks the thirteen specifications still to be authored under the numbering the scaffold established.
**Reasoning:** An empty file is not knowledge; carrying it would misrepresent completeness. The numbering scheme — the scaffold's only intellectual content — is preserved in the programme document.

## D-005 — Continuum lineage ratified: four generations, one active stack

**Date:** 2026-07-06
**Problem:** Four platform documents overlapped: `eos-v2-architecture.md`, `Continuum_Platform_Architecture.md`, the 34-RFC Technical Specification v1.0, and the constitutional stack (000 + 011).
**Decision:** Lineage recorded as **EOS-v2 → Continuum Architecture → RFC set v1.0 → constitutional stack (active)**. EOS-v2 archived. Continuum Architecture remains canonical (the RFCs derive from it and cite it for rationale). RFC set v1.0 remains canonical reference. The constitutional stack is the active specification programme.
**Reasoning:** EOS-v2 is explicitly a predecessor design the Continuum document supersedes conceptually while renaming the venture. The architecture and RFC set are complementary layers (rationale vs. implementable contract), not duplicates. The constitution (000) commissions fifteen numbered specifications — a re-expression of the RFC content in dependency order — of which two exist; it is the live workstream.
**Consequences:** No document claims sole authority prematurely; the programme document makes the v2 stack's incompleteness explicit.

## D-006 — Markdown is source; docx is generated

**Date:** 2026-07-06
**Problem:** The DIOS implementation programme shipped every phase in both `.md` and `.docx`.
**Decision:** Markdown canonical in `50-dios/implementation-programme/`; Word renderings in `generated-docx/`, marked never-edit-by-hand.
**Reasoning:** Single source of truth; the docx files are styled renderings whose content must always be regenerable from the Markdown.

## D-007 — Branded IP-protection PDF is canonical

**Date:** 2026-07-06
**Problem:** Three IP-protection PDFs: `SRA_IP_Protection_System_Branded.pdf`, `SRA_Intellectual_Property_Protection_System.pdf`, and a `(1)` copy byte-identical to the second.
**Decision:** Branded edition → `00-institution/governance/`. Unbranded edition → archive (superseded). The `(1)` duplicate recorded in the manifest, not carried.
**Reasoning:** The branded edition is the later, house-styled evolution of the same system; the unbranded original is preserved for provenance.

## D-008 — Three constitutions retained, scopes disjoint

**Date:** 2026-07-06
**Problem:** Apparent triplication: the Institution Constitution (Phase 1), the DIOS Document 00 "Institution Constitution", and the plain-language "Digital Institution Constitution".
**Decision:** All three are canonical, in different domains.
**Reasoning:** They govern different things: (1) the *institution itself* — mission, *Tibb al-Nabawi*, stewardship; (2) the *digital operating system* — root authority for every digital product, L0 of DIOS; (3) a plain-language companion of (2) at equal declared authority, for whole-picture readers. Merging them would collapse three authority scopes into one document with no single audience.
**Consequences:** `DOCUMENT_REGISTER.md` states each scope explicitly to prevent future confusion.

## D-009 — DIOS loose root copies collapsed into the nested handbook

**Date:** 2026-07-06
**Problem:** The DIOS export carried `00 Institution Constitution.md` and `Digital Institution Constitution.md` both loose at the archive root and inside the nested `Digital-Institution-Operating-System/` folder — byte-identical pairs.
**Decision:** One copy each, inside the complete handbook at `50-dios/operating-system/`. Duplicates recorded in the manifest.

## D-010 — The digital-estate phase record is kept whole, audits included

**Date:** 2026-07-06
**Problem:** The Phase 1–9 rebuild documents mix binding standards, one-off implementation specs, and two audits. Should audits be archived as historical?
**Decision:** Keep the entire phase record active inside `30-digital-estate/`, with audits in a dedicated `phase-audits/` subfolder.
**Reasoning:** Later phase specs cite the audits as evidence and baseline; archiving them would break the citation chain of an active programme.

## D-011 — Naming and metadata conventions

**Date:** 2026-07-06
**Decision:** Files are `kebab-case`; numeric prefixes indicate reading/authority order within a folder; folders are singular-concept nouns; generated content lives in `generated-*` folders; the DIOS handbook's original internal filenames (with spaces) are preserved unchanged because its own README, VERSION, and CHANGELOG cross-reference them verbatim.
**Reasoning:** Consistency for new material; zero silent link-breakage in a ratifiable-draft body of law.

## D-012 — Brand assets: SVG masters are truth, PNGs are exports

**Date:** 2026-07-06
**Decision:** The logo package is carried whole into `10-brand/assets/`; the register marks SVGs as source of truth and PNGs as generated exports.

---

*Future decisions append below, numbered sequentially, in the same format.*

## D-013 — Course material inaugurates `20-academy/courses/`, organised by component

**Date:** 2026-07-06
**Problem:** The SRA-001 Hijama Practitioner Programme arrived as a flat export: 18 decks, guides and workbooks with three unlabeled filenames (`workbook.pdf`, `instructor-guide.pdf`, `instructor-guide (1).pdf`), and mixed governance documents.
**Decision:** Created `20-academy/courses/hijama-practitioner-programme/` with `module-decks/`, `instructor-guides/`, `student-workbooks/`, the production package, and the master deck. Unlabeled files were identified by content (workbook.pdf → Module 17 Student Workbook; instructor-guide.pdf → Module 17 Instructor Guide; instructor-guide (1).pdf → Module 16 Instructor Guide) and renamed to the module convention. Governance documents (Framework v3, Blueprint) moved to the academy root, not the course folder.
**Reasoning:** Courses are products of the academy's law, not part of it; component folders scale to future courses (SRA-002…). Filenames now self-identify — no oral tradition required.

## D-014 — Academy Blueprint: newer re-export canonical, older export archived

**Date:** 2026-07-06
**Problem:** Two byte-different PDFs of the Academy Blueprint, both titled v2.0 with identical page counts — re-exports of the same edition ~11 hours apart.
**Decision:** The 2026-07-06 export is canonical at `20-academy/academy-blueprint.pdf`; the 2026-07-05 export is preserved at `archive/superseded-academy-documents/`.
**Reasoning:** Same declared version; the later render is presumed to carry any final corrections. Both preserved per the never-lose-information principle.
