# KNOWLEDGE MAP

**The guided tour of the entire knowledge system.** Written for a new employee or AI agent; thirty minutes here yields a working mental model of the whole institution.

---

## The shape of the institution

Sunnah Remedies is one institution with several organs and two platform ventures. The repository mirrors that anatomy exactly:

```
                    ┌────────────────────────────┐
                    │  00-institution (governs)  │
                    └──────────────┬─────────────┘
        ┌──────────────┬──────────┼──────────────┬─────────────┐
   10-brand       20-academy   30-digital   40-engineering  operations
  (expression)    (teaching)    -estate      (method)       handbook
                                (product)                   (in 00-)
        └──────────────┴──────────┼──────────────┘
                    ┌─────────────┴─────────────┐
               50-dios                    60-continuum
        (institution-as-platform)   (engineering-as-platform)
```

Authority flows downward: nothing in a lower folder may contradict a constitution above it.

---

## Folder by folder

### `00-institution/` — governance

**Why it exists:** the institution's identity, law, and daily operating reality.

- `constitution/00-institution-constitution.md` — the founding document. Sunnah Remedies as an institution for the preservation, transmission, and responsible practice of *Tibb al-Nabawi*. **The highest authority in the repository.**
- `constitution/academy-three-foundational-constitutions.pdf` — the academy's three foundational constitutions, styled edition.
- `operations-handbook/` — the fourteen-chapter Institutional Operations Handbook (welcome, mission and *adab*, people operations, the headquarters, health and safety and safeguarding, dispensary and apothecary, the clinic, the academy, Sacred Journeys office, editorial desk, photography studio, technology handbook, governance and escalation, quality and QA, reference and glossary) plus the security-operations annex. This is the daily manual of the physical institution.
- `governance/intellectual-property-protection-system.pdf` — the branded IP protection system.

**Essential:** the constitution. **Reference:** everything else, chapter as needed.

### `10-brand/` — expression

**Why it exists:** one visual and editorial voice across every surface.

- `identity/` — the Brand Manual (canonical Markdown), the Brand Bible (styled PDF), the Academy Visual Identity System, and the Islamic Visual Language System.
- `design-system/` — the Design System spec, the 150-page Institutional Design Manual (*Dalīl al-Muʾassasa*), the Academy Design Bible, and the icon library.
- `photography/` — the Photography Manual and the academy style guide.
- `editorial/` — the Editorial Style Guide and the working Editors' Guide.
- `assets/` — the complete logo package: SVG masters (source of truth) and PNG exports (generated), plus the brand guidelines document.

**Essential:** Brand Manual + Design System. **Source of truth for logos:** the SVGs.

### `20-academy/` — teaching

**Why it exists:** how the academy designs courses, assesses students, and certifies practitioners.

Governance: the Academy Framework v3.0 (the definitive institutional framework every course is built upon), the Phase 1 Academy Blueprint, Academy Standards, and the certification, assessment, workbook, presentation-design, and medical-illustration systems — each the sole source of truth for its function.

Courses: `courses/hijama-practitioner-programme/` — SRA-001, the flagship certification programme, complete with production package, master deck, seventeen module decks, instructor guides, and student workbooks.

### `30-digital-estate/` — the website and digital products

**Why it exists:** everything the public-facing digital institution must be. This is the record of the phased institutional rebuild programme (Phases 1–9).

- `standards/` — the binding Phase 1 manuals: information architecture, CMS architecture, engineering standards, SEO, accessibility, product standards, Sacred Journeys, the institutional review checklist, and the Cursor rebuild directive. **Read before touching the codebase.**
- `homepage-and-experience/` — homepage specification v2, the Phase 3 implementation spec, the Institute Vision, and the SEO knowledge specification.
- `commerce/` — the Phase 4 commerce implementation: master architecture, data model and sync, API and data flow, cart and checkout, Stripe payments, webhooks and fulfilment, folder structure, security and performance, migration checklists, and the Sanity schema definition sheet.
- `operations/` — Phase 8: the operational backbone and workflow automation specification.
- `intelligence/` — Phase 6 (AI engineering) and Phase 7 (institutional intelligence platform).
- `community/` — Phase 9: community, membership, and alumni network ("The Living Institution").
- `phase-audits/` — the Phase 2 audit and Phase 6 implementation audit. Historical evidence, kept active because later phases cite them.

**Reading order for a new build task:** standards → the phase spec for your area → the relevant audit.

### `40-engineering/` — the method

**Why it exists:** the Engineering Operating System — *how* software is made, independent of any one project. Organised along the lifecycle spine:

```
00-foundation → 10-design → 20-plan → 30-build → 40-verify → 50-release → 90-reference
```

Each stage hands off to the next; nothing later may contradict an approved earlier decision. `90-reference/` carries the standards, workflows, glossary, and the full prompt library. The folder has its own README, CONTRIBUTING guide, and CI workflows — it is a complete, rebrandable methodology and the canonical successor to the retired Engineering Playbook (see `/archive`).

### `50-dios/` — the Digital Institution Operating System

**Why it exists:** the reusable platform from which every future digital institution is generated.

- `operating-system/` — the DIOS handbook: Document 00 (Institution Constitution — root authority of the digital estate), the plain-language Digital Institution Constitution, standards 01–15 (design language, engineering, contracts, documentation, context, interface and motion, accessibility, performance, discoverability, AI agents, extensions, telemetry, security), and the review and release checklists, with VERSION and CHANGELOG.
- `platform-specification/` — the DIOS Starter Platform Engineering Specification v1.0 (23-module architecture, approved for implementation).
- `implementation-programme/` — the 10-phase, task-level engineering backlog derived from the specification (master programme + Phases 0–9, Markdown canonical). `generated-docx/` holds the styled Word renderings — never edit those by hand.

**Authority order:** constitution → standards → specification → programme.

### `60-continuum/` — the Continuum platform

**Why it exists:** the AI-native, runtime-first software engineering platform venture.

- `architecture/continuum-platform-architecture.md` — the approved platform architecture, first principles to full system.
- `technical-specification-v1/` — the complete 34-RFC set across ten subsystem groups (meta, contracts, runtime, context, verification, engines, SDK and plugins, upgrade, cross-cutting), plus the generated single-file `CONSOLIDATED.md`.
- `constitutional-specifications/` — the **active** v2 specification stack: `000-platform-constitution.md` (root authority, ratifiable draft) and `011-security-model.md`, with `SPECIFICATION-PROGRAMME.md` tracking the thirteen remaining numbered specifications the constitution commissions.

**Lineage** (full history in `DECISION_LOG.md`): EOS v2 architecture → Continuum architecture → RFC set v1.0 → constitutional stack (current).

### `90-templates/`

An index pointing to every reusable template in the system (engineering templates live inside `40-engineering/10-design/templates/`; DIOS checklists inside `50-dios/operating-system/`). Templates stay beside the standards that govern them; this folder is the directory.

### `archive/` — history

Append-only. Contains the superseded Engineering Playbook (the raw predecessor of `40-engineering/`), the EOS v2 architecture document (predecessor of Continuum), the unbranded IP-protection PDF, and the duplicate manifest recording every exact-duplicate file found during consolidation. Nothing here is ever edited or deleted.

---

## Source-of-truth quick reference

| Question | The answer lives in |
|---|---|
| What is Sunnah Remedies? | `00-institution/constitution/` |
| How do we run the building? | `00-institution/operations-handbook/` |
| What do we look like? | `10-brand/` (SVGs are logo truth) |
| How do we teach and certify? | `20-academy/` |
| What must the website be? | `30-digital-estate/standards/` + phase specs |
| How do we build software? | `40-engineering/` |
| How is a digital institution generated? | `50-dios/` |
| What is the Continuum platform? | `60-continuum/` |
| Why is anything the way it is? | `DECISION_LOG.md` |
| What happened to the old files? | `archive/` + `CHANGELOG.md` |
