# Continuum

**An independent, AI-native software engineering platform.**
Version 2.0.0 · Established as a standalone repository 6 July 2026 · Owner: Platform Engineering

Continuum is not Sunnah Remedies. It is a brand-agnostic platform that any organisation — Sunnah Remedies first among them — can use to design, build, verify, and operate serious software with AI agents as first-class engineers. It is structured to stand alone and, one day, to be commercialised on its own. Its boundary is defined in `BOUNDARY.md`; its relationship to its first consumer in `ECOSYSTEM.md` (mirror — canonical copy lives in the Sunnah-Remedies repository).

## The three products

| Folder | Product | What it is |
|---|---|---|
| `10-methodology/` | **The Engineering OS** | The complete method: lifecycle spine (00-foundation → design → plan → build → verify → release → reference), standards, workflows, templates, prompt library, CI. Rebrandable; self-contained. |
| `20-platform/` | **The Continuum runtime** | The AI-native engine. `architecture/` (design rationale) · `rfc/` (the complete 34-RFC Technical Specification v1.0; `CONSOLIDATED.md` is generated) · `specifications/` (the active constitutional stack: 000 Platform Constitution and 011 Security Model authored; thirteen remaining tracked in `SPECIFICATION-PROGRAMME.md`). |
| `30-dios/` | **DIOS — the Digital Institution Operating System** | The generator product: institution constitution + 15 standards + checklists (`operating-system/`, versioned), the 23-module Starter Platform Engineering Specification, and the 10-phase implementation programme (Markdown canonical; `generated-docx/` never hand-edited). |

## How the products relate

The methodology teaches how to build. The platform runs what is built and encodes the methodology's knowledge as machine-readable context. DIOS packages both into a generatable, governable digital institution. First instantiation: Sunnah Remedies.

## Operating rules

1. **Brand-agnostic always.** Consumer-specific requirements enter only translated into generic capability (ECOSYSTEM §contract).
2. **Constitutional order.** Within `20-platform/specifications/`, nothing may contradict 000; within `30-dios/`, nothing may contradict DIOS Document 00.
3. **One source of truth per contract** — the register names it; the RFC set and constitutional stack are complementary layers (rationale vs dependency-ordered law), per D-005.
4. **Versioned releases.** DIOS versions per its own VERSION/CHANGELOG; consumers pin versions.
5. Roadmap and sequencing live in `ROADMAP.md`.
