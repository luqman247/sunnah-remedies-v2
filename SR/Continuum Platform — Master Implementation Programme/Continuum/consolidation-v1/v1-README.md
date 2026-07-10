# Sunnah Remedies — Master Knowledge System

**The single source of truth for the entire institution.**
Version 1.0.0 · Established 6 July 2026 · Custodian: Office of the Founders

---

## What this repository is

This is the permanent, consolidated knowledge base of Sunnah Remedies and its associated ventures. Every canonical document the institution owns — constitutional, brand, academy, clinical-operational, digital, engineering, and platform — lives here, exactly once, in its highest-quality form.

It replaces every prior repository, bundle, and export. Those prior collections contained 849 files; semantic and content analysis found only 443 unique documents among them, arranged inconsistently across eleven overlapping archives. This repository is the result of a full consolidation: one canonical copy of every unique document, a complete audit trail for every decision, and a historical archive preserving everything that was superseded.

**Nothing was lost.** Every unique piece of intellectual property from the source archives is either canonical here or preserved in `/archive` with an explanation of why it was superseded.

## The structure

The repository is organised by knowledge domain, numbered by institutional precedence — governance first, ventures last:

| Folder | Domain | What lives here |
|---|---|---|
| `00-institution/` | Governance | Constitution, Operations Handbook, IP protection |
| `10-brand/` | Brand | Identity, design system, photography, editorial, logo assets |
| `20-academy/` | Academy | Blueprint, certification, assessment, workbook, illustration systems |
| `30-digital-estate/` | Website & products | Standards, experience specs, commerce, operations, intelligence, community |
| `40-engineering/` | Engineering method | The Engineering Operating System — the lifecycle spine (design → plan → build → verify → release) |
| `50-dios/` | Digital Institution OS | The DIOS constitution, sixteen standards, platform specification, and 10-phase implementation programme |
| `60-continuum/` | Continuum platform | Architecture, the 34-RFC technical specification, and the active constitutional specification stack |
| `90-templates/` | Templates | Index of every reusable template in the system |
| `archive/` | History | Everything superseded, with full provenance |

## The rule of one

Every knowledge domain has exactly one canonical source of truth. Where a document appears to overlap another, the `DOCUMENT_REGISTER.md` entry states its distinct purpose, and `DECISION_LOG.md` records why both exist. If you find genuine duplication, that is a defect — raise it and consolidate.

## How documentation evolves

1. **New documents** are added to the domain folder they belong to, named in `kebab-case`, registered in `DOCUMENT_REGISTER.md`, and noted in `CHANGELOG.md`.
2. **Superseding documents** never overwrite. The old version moves to `/archive` with a note; the new version takes the canonical position; both moves are logged.
3. **Generated documents** (e.g. styled `.docx` renderings of Markdown sources) live in clearly marked `generated-*` folders and are never edited by hand — regenerate them from source.
4. **The four root records** — `DOCUMENT_REGISTER.md`, `DECISION_LOG.md`, `CHANGELOG.md`, `KNOWLEDGE_GRAPH.md` — are living documents updated with every structural change.

## How to use this repository

- **Humans:** read `START_HERE.md`, then `KNOWLEDGE_MAP.md`. Thirty minutes gives you the whole institution.
- **AI agents:** load `START_HERE.md` and the README of whichever domain you are working in. Domain READMEs declare authority order and reading order; never contradict a document of higher authority.
- **Executives:** the constitution (`00-institution/constitution/`) and `IMPLEMENTATION_ROADMAP.md` are the strategic surface.
- **Developers:** `40-engineering/` is your method, `30-digital-estate/standards/` your constraints, `50-dios/` and `60-continuum/` your platform specifications.

## Quality standards

Every document in this repository must have: a clear title, a stated purpose, a defined audience, and exactly one home. Every document is either **canonical**, **supporting**, **generated**, or **archived** — the register records which. Documents are written to be modular, cross-linked, token-efficient for AI consumption, and readable by a new employee without oral tradition.

## Governance

Changes to `00-institution/constitution/` and `50-dios/operating-system/00 Institution Constitution.md` require founder ratification. Everything else follows the amendment procedures declared inside the documents themselves. The archive is append-only: nothing in it is ever deleted or rewritten.
