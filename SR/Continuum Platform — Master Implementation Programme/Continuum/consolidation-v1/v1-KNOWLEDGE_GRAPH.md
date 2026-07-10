# KNOWLEDGE GRAPH

How the documents of the Master Knowledge System relate: authority, dependency, derivation, and reading order. `KNOWLEDGE_MAP.md` tells you what each folder *is*; this document tells you how everything *connects*.

---

## 1 · The authority chain

Authority flows strictly downward. A document may refine, implement, or specialise anything above it; it may contradict nothing above it.

```
L0  00-institution/constitution/00-institution-constitution.md
     │
     ├── L1  00-institution/operations-handbook/          (daily law of the physical institution)
     ├── L1  10-brand/identity/01-brand-manual.md         (expression law)
     │        └── L2  design-system → photography → editorial → assets
     ├── L1  20-academy/academy-blueprint.pdf             (teaching law)
     │        └── L2  standards → certification → assessment → workbook
     ├── L1  30-digital-estate/standards/                 (digital product law)
     │        └── L2  phase specifications (3,4,5,6,7,8,9)
     │                 └── L3  phase audits (evidence)
     ├── L1  40-engineering/00-foundation/                (method law)
     │        └── L2  10-design → 20-plan → 30-build → 40-verify → 50-release
     │                 └── L3  90-reference (standards, workflows, prompts, glossary)
     ├── L1  50-dios/operating-system/00 Institution Constitution.md   (digital-estate root, DIOS L0)
     │        ├── L2  standards 01–15 + checklists
     │        ├── L2  platform-specification (23-module spec)
     │        │        └── L3  implementation-programme (phases 0–9)
     │        │                 └── L4  generated-docx (renderings)
     │        └── (peer) Digital Institution Constitution (plain-language, equal authority)
     └── L1  60-continuum/constitutional-specifications/000-platform-constitution.md  (Continuum L0)
              ├── L2  011-security-model.md  + specs 001–015 (13 pending — see SPECIFICATION-PROGRAMME.md)
              ├── (rationale) architecture/continuum-platform-architecture.md
              └── (reference) technical-specification-v1/ (34 RFCs → generated CONSOLIDATED.md)
```

## 2 · Derivation lineage (what came from what)

```
Engineering Playbook (archived) ──rewritten as──▶ 40-engineering (Engineering OS)
                                                        │ distilled with Continuum learnings
EOS v2 architecture (archived) ──renamed/redesigned──▶ 60-continuum/architecture
        continuum architecture ──specified as──▶ technical-specification-v1 (34 RFCs)
        continuum architecture ──re-expressed as──▶ constitutional-specifications (000 → 001…015)
40-engineering + continuum + 30-digital-estate practice ──distilled into──▶ 50-dios/operating-system
        dios operating-system ──specified as──▶ 50-dios/platform-specification
        platform-specification ──decomposed into──▶ 50-dios/implementation-programme
30-digital-estate phase programme: Phase1 standards ─▶ Phase2 audit ─▶ Phase3 experience ─▶ Phase4 commerce+handbook ─▶ Phase5 vision/SEO ─▶ Phase6 AI ─▶ Phase7 intelligence ─▶ Phase8 operations ─▶ Phase9 community
```

## 3 · Document roles

| Role | Meaning | Examples |
|---|---|---|
| **Constitution** | Root authority; ratified or ratifiable; amend only by declared procedure | institution constitution; DIOS 00; Continuum 000 |
| **Standard** | Binding constraint on all work in scope | 30-digital-estate/standards/*; DIOS 01–15; engineering 90-reference/standards |
| **Specification** | Implementable contract for one system | commerce set; phase specs; RFC set; DIOS platform spec |
| **Programme** | Ordered decomposition of a specification into work | DIOS implementation programme; Continuum SPECIFICATION-PROGRAMME |
| **Manual / Handbook** | Operating reference for people | operations handbook; design manual; editors' guide |
| **Template / Prompt** | Reusable starting artifact | 40-engineering templates + prompt library; DIOS checklists |
| **Audit / Evidence** | Point-in-time verification record | phase-audits/* |
| **Generated** | Machine-produced from a source; never hand-edited | generated-docx; CONSOLIDATED.md; PNG logo exports; DOCUMENT_REGISTER.md |
| **Archived** | Superseded; preserved read-only | everything in archive/ |

## 4 · Inputs and outputs of the living workstreams

| Workstream | Consumes | Produces next |
|---|---|---|
| Continuum specification stack | 000 constitution, architecture, RFC set | specs 001–010, 012–015 (dependency order in SPECIFICATION-PROGRAMME.md) |
| DIOS implementation | platform specification, standards | phase deliverables per implementation-programme |
| Digital estate | standards, phase specs, audits | phase implementations in the product codebase |
| Academy | blueprint, standards, certification system | course material (future `20-academy/courses/`) |

## 5 · Reading orders

- **Whole-institution:** START_HERE → KNOWLEDGE_MAP → institution constitution → brand manual → academy blueprint → digital-estate standards → engineering 00-foundation → DIOS constitution → Continuum architecture.
- **Continuum implementer:** architecture → RFC-000 index → RFC-001/002/003 → contracts (RFC-111, 100-101) → your subsystem group → 000 constitution → 011 security model.
- **DIOS implementer:** DIOS 00 → standards 01–15 → platform specification → master programme → your phase.
- **Website contributor:** digital-estate standards (all nine) → your phase spec → institutional review checklist before merge.
