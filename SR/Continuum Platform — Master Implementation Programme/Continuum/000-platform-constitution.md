---
document: "000"
title: "Continuum Platform Constitution"
classification: "Root Authority — RFC-000 / ISO-0"
status: "RATIFIABLE DRAFT (awaiting freeze)"
version: "0.1.0-draft"
supersedes: "none"
superseded_by: "none"
authority: "highest"
derives_from: "none — this is the root"
children:
  - "specifications/001-runtime-specification.md"
  - "specifications/002-context-graph-specification.md"
  - "specifications/003-engine-contracts.md"
  - "specifications/004-plugin-system.md"
  - "specifications/005-project-schema.md"
  - "specifications/006-verification-protocol.md"
  - "specifications/007-cli-specification.md"
  - "specifications/008-api-specification.md"
  - "specifications/009-sdk-specification.md"
  - "specifications/010-storage-specification.md"
  - "specifications/011-security-model.md"
  - "specifications/012-upgrade-model.md"
  - "specifications/013-state-machine.md"
  - "specifications/014-event-model.md"
  - "specifications/015-query-language.md"
ratified_by: "<pending — Chief Systems Architect + Governing Board>"
ratified_on: "<pending>"
---

# Document 000 — The Continuum Platform Constitution

> **Notice of authority.** This is Document 000. It is the single root from which every
> other artifact in the `continuum/` repository legally derives. No specification,
> contract, runtime definition, SDK, plugin, API surface, schema, test, prototype, or
> line of implementation may contradict it. Where any downstream document conflicts with
> this one, this document prevails and the downstream document is void in the conflicting
> part until amended. This document contains **no implementation detail** by design; it
> constrains implementation without performing it.

---

## Part 0 — How to read this document

### 0.1 Normative language

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**,
**SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL** in this document
are to be interpreted as described in RFC 2119 and RFC 8174, and *only* when they appear
in capital letters. Prose that does not use these words is explanatory and carries no
independent normative weight; where explanatory prose appears to conflict with a
normative clause, the normative clause governs.

### 0.2 Clause identity and citability

Every normative statement in this document carries a stable clause identifier of the form
`CON-§<part>.<section>.<index>` (e.g. `CON-§3.2.1`). Downstream documents **MUST** cite
the specific clause they derive from or satisfy, not the document as a whole. Clause
identifiers are permanent: once assigned and ratified, a clause identifier is never reused
for different content and never renumbered. A retired clause becomes a tombstone
(§12.4), never a vacancy.

### 0.3 What this document is not

This document is not a specification of any subsystem, not a roadmap, not a product
requirements document, and not an implementation plan. It is the constitution: the fixed
frame of reference against which all of those are judged. It changes rarely, deliberately,
and only through the amendment procedure of Part 12.

---

## Part 1 — Preamble, Purpose, and Philosophy

### 1.1 What Continuum is

**CON-§1.1.1** Continuum is an **AI-native software engineering platform**: a system in
which human engineers and autonomous AI agents perform software engineering as
co-equal, governed participants against a shared, verifiable model of a software project.

**CON-§1.1.2** Continuum treats **the software project itself — not the source text — as
the primary artifact.** Source code, tests, documentation, and configuration are
*projections* of an underlying, structured, machine-navigable model of the project. The
platform's obligation is to keep that model coherent, verifiable, and traceable over the
entire lifetime of the project.

**CON-§1.1.3** Continuum is designed for a horizon of **not less than ten years** and a
concurrent population of **hundreds of human engineers and AI agents**. Every decision
recorded in this document is made against that horizon, not against the convenience of any
single release.

### 1.2 The problem Continuum exists to solve

**CON-§1.2.1** As AI agents take on a growing share of software engineering work, the
scarce resource ceases to be the *production* of code and becomes the **trustworthy
governance of change**: knowing what is true about a system, who or what changed it, on
what authority, and whether the change is verifiably correct. Continuum exists to make
that governance a first-class, machine-enforceable property of the platform rather than a
matter of convention or after-the-fact review.

**CON-§1.2.2** Continuum **MUST NOT** be architected around the assumption that a human
reviews every change. It **MUST** be architected around the assumption that most changes
are proposed by agents, that agents may be numerous and fast, and that correctness and
authority must therefore be established by construction and verification rather than by
human attention.

### 1.3 Philosophy

**CON-§1.3.1 — Truth is derived, never asserted.** No participant, human or agent, holds
authority merely by claiming it. Authority flows from this document downward through an
unbroken derivation chain (Part 10). A statement about the platform is trustworthy only if
its derivation can be traced to a ratified source.

**CON-§1.3.2 — Verification precedes trust.** The platform trusts a change because it has
been verified against a stated contract, not because of who or what produced it. Human and
agent authorship are subject to the identical verification standard (§3.5).

**CON-§1.3.3 — The model is the source of truth; text is a view.** Where a projected
artifact (e.g. a source file) and the platform's structured model disagree, the model
governs, and the disagreement is itself a defect the platform MUST surface.

**CON-§1.3.4 — Boundaries are load-bearing.** The platform's longevity depends on its
subsystem boundaries (Part 8) being explicit, minimal, and stable. Boundaries are not an
implementation nicety; they are the mechanism by which the platform survives a decade of
change without collapse.

**CON-§1.3.5 — Reversibility over cleverness.** Between two designs of comparable merit,
the platform prefers the one whose effects can be observed, bounded, and undone. Any
irreversible operation MUST be explicitly identified as such and justified.

---

## Part 2 — Terminology (Canonical Definitions)

**CON-§2.0.1** This part is the **single authoritative glossary** for the entire
repository. Downstream documents **MUST** use these terms as defined here and **MUST NOT**
redefine them. A downstream document MAY introduce new terms for its own scope, provided
they do not collide with any term defined here.

**CON-§2.0.2** Where a term is defined here, its capitalized use anywhere in the
repository refers to this definition.

| Term | Canonical definition |
|---|---|
| **Platform** | The totality of Continuum as governed by this document. |
| **Repository** | The `continuum/` tree, rooted at this document. |
| **Participant** | Any actor that can propose, verify, or observe change: a human Engineer or an AI Agent. |
| **Engineer** | A human Participant. |
| **Agent** | An autonomous or semi-autonomous AI Participant acting under a granted authority. |
| **Project** | A unit of software governed by the Platform, represented as a structured model rather than a file tree. |
| **Model** | The structured, canonical, machine-navigable representation of a Project. The source of truth (§1.3.3). |
| **Projection** | Any human- or tool-facing rendering derived from the Model (e.g. source files, docs). |
| **Context Graph** | The typed graph of entities and relationships that constitutes the Model. Specified by Document 002. |
| **Engine** | A governed component that transforms or reasons over the Model under a declared Contract. Specified by Document 003. |
| **Contract** | A declared, verifiable statement of what a component requires, guarantees, and forbids. |
| **Runtime** | The execution substrate that hosts Engines, enforces Contracts, and mediates access to the Model. Document 001. |
| **Plugin** | A third-party or first-party extension admitted to the Platform under the Plugin System. Document 004. |
| **Verification** | The act of establishing, by defined procedure, that a change satisfies its governing Contracts. Document 006. |
| **Invariant** | A property that MUST hold at all times; its violation is by definition a defect of the Platform. |
| **Authority** | The right, derived from this document, to perform a class of action. Never intrinsic to a Participant. |
| **Derivation** | The traceable relationship by which a downstream artifact is legitimated by an upstream one. |
| **Amendment** | A change to this document, made only via Part 12. |
| **Freeze** | The act of ratifying this document, after which it changes only by Amendment. |

---

## Part 3 — Invariants (The Inviolable Core)

**CON-§3.0.1** The clauses in this Part are **Platform Invariants**. They hold at all
times, in all subsystems, for all Participants. A state of the Platform that violates any
invariant in this Part is, by definition, a defect, regardless of any downstream document
that appears to permit it. No downstream document may weaken, suspend, or carve exceptions
into an invariant; a downstream document may only *strengthen* it.

**CON-§3.1.1 — Single Root of Authority.** There is exactly one root authority in the
repository: this document. Every artifact's legitimacy traces to it (Part 10).

**CON-§3.2.1 — Model Primacy.** The Model is the sole source of truth about a Project.
Where a Projection disagrees with the Model, the Model governs (§1.3.3).

**CON-§3.3.1 — Total Traceability.** Every change to a Project's Model MUST carry an
immutable record of: what changed, the pre- and post-state references, the Participant of
record, the Authority under which it was made, and the Verification result. There are no
untraceable mutations.

**CON-§3.4.1 — No Ambient Authority.** No Participant, Engine, or Plugin possesses any
authority by default. All authority is explicitly granted, scoped, and revocable (Part 9,
Document 011). Absence of a grant is denial.

**CON-§3.5.1 — Uniform Verification.** A change is admitted to the Model only after it has
passed the Verification required by its governing Contracts. The verification standard is
**identical** for human- and agent-authored change (§1.3.2). Identity may determine
*authority to attempt* a change; it never substitutes for verification of the change.

**CON-§3.6.1 — Contract Precedence.** No Engine, Plugin, or API surface may perform an
action that its declared Contract does not permit. Undeclared capability is forbidden
capability.

**CON-§3.7.1 — Reversibility of Record.** The historical record of the Model is
append-only and immutable. State may move forward; the record of how it got there MUST NOT
be rewritten or deleted. (This governs the *record*, not the working state.)

**CON-§3.8.1 — Bounded Blast Radius.** Every operation MUST have a statically declarable
upper bound on the set of Model entities it can affect. An operation whose effect cannot be
bounded MUST NOT be admitted.

**CON-§3.9.1 — Determinism of Verification.** Given the same input state and the same
Contract, Verification MUST yield the same verdict. Verification MUST NOT depend on
un-recorded, non-reproducible inputs.

**CON-§3.10.1 — Fail Closed.** In the presence of ambiguity, missing authority, or
unavailable Verification, the Platform denies the action. Safety is the default; capability
is the exception that must be earned.

> **Invariant amendment lock.** The clauses of Part 3 are amendable only under the
> heightened procedure of §12.3 (super-majority + cooling-off). They are the last thing to
> change and the hardest.

---

## Part 4 — Principles (Design Doctrine)

Principles guide judgment where invariants do not decide the case. Where two principles
tension, the earlier-numbered principle is weighted more heavily, and the resolving
document MUST record which principle it favored and why.

**CON-§4.1.1 — Governance before capability.** A capability is added only once its
governance (authority, verification, traceability) is defined. Capability without
governance is not shipped.

**CON-§4.2.1 — Explicit over implicit.** Behavior, authority, and dependency are declared,
never inferred. If it matters, it is written down and citable.

**CON-§4.3.1 — Small, stable cores; large, replaceable edges.** The invariant core stays
small and changes rarely; capability lives at the edges (Plugins, Engines) where it can be
replaced without disturbing the core.

**CON-§4.4.1 — Design for the agent and the human equally.** Every surface is designed to
be legible and safe for both an Engineer reading it and an Agent operating it. Neither is a
second-class Participant.

**CON-§4.5.1 — Observability is not optional.** If the Platform does something, that
something is observable, attributable, and explainable after the fact.

**CON-§4.6.1 — Prefer composition to privilege.** Extend the Platform by composing
governed components, not by granting exceptions. An exception is a debt; a composition is
an asset.

**CON-§4.7.1 — Evolve by addition, retire by tombstone.** New capability arrives as
additive, versioned surface; old capability is deprecated and tombstoned, never silently
removed (§12.4, Document 012).

**CON-§4.8.1 — Cost of change is a design input.** The difficulty of changing a decision
later is weighed at the time the decision is made. Decisions that are cheap to reverse may
be made quickly; decisions that are expensive to reverse require the decision framework of
Part 7.

---

## Part 5 — Architectural Boundaries

**CON-§5.0.1** The Platform is partitioned into **Layers** and **Subsystems**. A boundary
between layers is a **contract surface**: the only legitimate way to cross it is through a
declared Contract (§3.6.1). Reaching across a boundary by any other means is forbidden and
is a defect.

### 5.1 The Layer Model

**CON-§5.1.1** The Platform has exactly the following ordered layers. A layer MAY depend
only on layers at or below it. Upward dependency is forbidden (§6.2.1).

```
┌─────────────────────────────────────────────────────────────┐
│  L5  Experience Layer   — CLI (007), API (008), SDK (009)    │
├─────────────────────────────────────────────────────────────┤
│  L4  Extension Layer    — Plugin System (004)                │
├─────────────────────────────────────────────────────────────┤
│  L3  Reasoning Layer    — Engine Contracts (003),            │
│                           Verification (006), Query (015)    │
├─────────────────────────────────────────────────────────────┤
│  L2  Model Layer        — Context Graph (002),               │
│                           Project Schema (005),              │
│                           State Machine (013), Events (014)  │
├─────────────────────────────────────────────────────────────┤
│  L1  Substrate Layer    — Runtime (001), Storage (010)       │
├─────────────────────────────────────────────────────────────┤
│  L0  Governance Layer   — THIS DOCUMENT (000),               │
│                           Security Model (011),              │
│                           Upgrade Model (012)                │
└─────────────────────────────────────────────────────────────┘
```

**CON-§5.1.2** L0 (Governance) is depended upon by every layer and depends on nothing. The
Security Model (011) and Upgrade Model (012) are placed in L0 because authority and
evolution are governance concerns that all other layers must obey, not services those
layers consume at will.

**CON-§5.1.3** No layer may be added, removed, or reordered except by Amendment (Part 12).

### 5.2 Boundary rules

**CON-§5.2.1** Every cross-boundary interaction occurs through a Contract (Document 003
defines Engine Contracts; the API/SDK/CLI define their own surface contracts derived from
it).

**CON-§5.2.2** A subsystem MUST NOT expose internal structure across its boundary.
Consumers depend on the Contract, never on the implementation behind it.

**CON-§5.2.3** The Model Layer (L2) is the only layer permitted to hold the canonical
Model. All other layers operate on the Model exclusively through L2's contracts. No layer
may keep a second, authoritative copy of the Model (§3.2.1).

---

## Part 6 — Subsystem Map and Dependency Model

### 6.1 The canonical subsystem register

**CON-§6.1.1** The Platform consists of exactly the following ratified subsystems. Each is
governed by the numbered specification shown, and each such specification is a child of
this document. This register is authoritative; a subsystem not listed here does not exist
for governance purposes until admitted by Amendment.

| Doc | Subsystem | Layer | One-line charter (binding scope) |
|---|---|---|---|
| 001 | Runtime | L1 | Hosts Engines, enforces Contracts, mediates Model access. |
| 002 | Context Graph | L2 | Defines the typed graph that *is* the Model. |
| 003 | Engine Contracts | L3 | Defines what an Engine may require, guarantee, forbid. |
| 004 | Plugin System | L4 | Admits, isolates, and governs extensions. |
| 005 | Project Schema | L2 | Defines the shape of a governed Project within the Graph. |
| 006 | Verification Protocol | L3 | Defines how a change is proven to satisfy Contracts. |
| 007 | CLI Specification | L5 | Human/agent command surface over the Platform. |
| 008 | API Specification | L5 | Programmatic surface over the Platform. |
| 009 | SDK Specification | L5 | Language-level surface for building on the Platform. |
| 010 | Storage Specification | L1 | Durable, append-only persistence of Model and record. |
| 011 | Security Model | L0 | Identity, authority, isolation, revocation. |
| 012 | Upgrade Model | L0 | Versioning, migration, deprecation, tombstoning. |
| 013 | State Machine | L2 | Legal states of a Project and transitions between them. |
| 014 | Event Model | L2 | The append-only event record and its semantics. |
| 015 | Query Language | L3 | The declared language for reading the Model. |

**CON-§6.1.2** Each subsystem specification **MUST** open by declaring: the clause(s) of
this document it derives from, its layer, its inbound and outbound dependencies (by
document number), its invariants, its assumptions, and its traceability block (Part 11).
A subsystem specification that omits any of these is non-conformant and MUST NOT be frozen.

### 6.2 Dependency law

**CON-§6.2.1 — Acyclic dependency.** The subsystem dependency graph MUST be a directed
acyclic graph. No cycles, at any layer, ever. A proposed dependency that would introduce a
cycle is rejected by construction.

**CON-§6.2.2 — Downward-only.** A subsystem may depend only on subsystems in its own layer
or a lower layer (§5.1.1). Same-layer dependencies are permitted only if acyclic and
declared.

**CON-§6.2.3 — Declared dependency only.** A subsystem may rely only on dependencies it has
declared in its traceability block. Undeclared reliance is a defect (mirrors §4.2.1).

**CON-§6.2.4 — Minimal dependency.** A subsystem MUST depend on the fewest other
subsystems necessary to fulfill its charter. Convenience is not a justification for a
dependency.

### 6.3 Canonical dependency direction (informative summary)

The following is the intended shape; each specification's own traceability block (Part 11)
is the normative statement of its dependencies.

```
000 (this document)
 └─ everything derives from here
011 Security ──┐
012 Upgrade  ──┤  (L0, depended on broadly)
               ▼
001 Runtime ── 010 Storage                (L1)
               ▼
002 Graph ── 005 Schema ── 013 State ── 014 Events   (L2)
               ▼
003 Engines ── 006 Verification ── 015 Query          (L3)
               ▼
004 Plugins                                            (L4)
               ▼
007 CLI ── 008 API ── 009 SDK                          (L5)
```

---

## Part 7 — Decision Framework

**CON-§7.0.1** This Part governs how binding decisions are made about the Platform. It
does not decide any specific question; it defines the *procedure* by which questions are
decided so that decisions are legitimate, recorded, and traceable (§3.3.1).

### 7.1 Decision classes

**CON-§7.1.1** Every Platform decision is classified by reversibility and scope:

| Class | Definition | Required procedure |
|---|---|---|
| **Constitutional** | Changes this document. | Amendment (Part 12). |
| **Structural** | Adds/removes a subsystem, layer, or cross-layer contract. | RFC + Governing Board ratification (§7.2). |
| **Specification** | Changes a subsystem's Contract or invariants within its charter. | RFC + subsystem owner + one reviewer. |
| **Local** | Internal to a subsystem, no Contract change. | Owner discretion, recorded. |

**CON-§7.1.2** When the class of a decision is disputed, it is treated as the *higher*
class until resolved (fail closed, §3.10.1).

### 7.2 The RFC instrument

**CON-§7.2.1** Structural and Specification decisions are made through **RFCs** stored in
`RFC/`. An RFC MUST state: the problem, the clause(s) of this document it operates under,
the options considered, the decision, the invariants affected, and the rollback plan
(§3.5, §4.8). An RFC that changes an invariant escalates to Constitutional class.

**CON-§7.2.2** Every RFC has a lifecycle: `Draft → Review → Accepted → (Superseded |
Retired)`. State transitions are recorded and append-only (§3.7.1). An Accepted RFC that is
later reversed is Superseded by a new RFC, never deleted.

**CON-§7.2.3** An RFC becomes binding only when Accepted by the authority required for its
class (§7.1.1). Until then it has no derivational force and nothing may cite it as
authority.

### 7.3 Decision record obligations

**CON-§7.3.1** Every decision at Specification class or above MUST leave a durable,
citable record identifying the deciding authority, the date, the clauses relied upon, and
the alternatives rejected. A decision without such a record has no derivational force
(§3.3.1).

---

## Part 8 — Governance Model

### 8.1 Roles

**CON-§8.1.1** The Platform recognizes exactly these governance roles. Roles grant
Authority; they are not identities. A single Participant may hold multiple roles; a role
may be held by an Agent where this document does not reserve it to a human.

| Role | Authority | Reserved to human? |
|---|---|---|
| **Governing Board** | Ratify Amendments and Structural decisions; freeze this document. | Yes (§8.4.1). |
| **Chief Systems Architect** | Steward this document; adjudicate derivation disputes; sponsor Structural RFCs. | Yes. |
| **Subsystem Owner** | Steward one subsystem specification; accept Specification RFCs within charter. | No. |
| **Reviewer** | Verify conformance of a proposed change to governing Contracts. | No. |
| **Contributor** | Propose change under granted Authority. | No (Agents included). |

### 8.2 Legitimacy of authority

**CON-§8.2.1** All role authority derives from this document (§3.1.1). A role may exercise
only the authority this document or a ratified RFC grants it. Role authority is scoped,
recorded, and revocable (§3.4.1).

**CON-§8.2.2** No role may grant to another role an authority it does not itself hold.
Delegation narrows; it never widens.

### 8.3 Agent participation

**CON-§8.3.1** Agents are Participants and MAY hold any role not reserved to humans
(§8.1.1). An Agent's authority is granted, scoped, verifiable, and revocable on the
identical basis as a human's (§3.4.1, §3.5.1). No Agent holds standing authority merely by
virtue of being capable.

**CON-§8.3.2** Every action taken by an Agent is attributable to (a) the Agent identity and
(b) the Authority under which it acted, both recorded immutably (§3.3.1). An Agent action
that cannot be so attributed MUST be refused (§3.10.1).

### 8.4 Reserved human authority

**CON-§8.4.1** The following MUST NOT be performed by an Agent under any circumstances,
regardless of capability or delegated authority: ratifying an Amendment to this document;
freezing this document; altering a Part 3 invariant; and granting the Governing Board or
Chief Systems Architect role. These are reserved to human authority permanently. This
clause is itself invariant-locked (§12.3).

---

## Part 9 — Authority and Dependency Grants (Model)

**CON-§9.0.1** This Part defines the *model* of authority the Security Model (Document 011)
MUST implement. It defines the shape, not the mechanism.

**CON-§9.1.1 — Grant, not possession.** Authority exists only as a **grant**: an explicit,
scoped, time- or condition-bounded, revocable assignment of a specific capability to a
specific Participant or role. There is no un-granted authority (§3.4.1).

**CON-§9.1.2 — Least authority.** A grant MUST convey the minimum capability sufficient for
its purpose. Broad grants require justification recorded at decision time (§7.3.1).

**CON-§9.1.3 — Revocability.** Every grant MUST be revocable, and revocation MUST take
effect without requiring rewriting of history (§3.7.1). Revocation is forward-acting.

**CON-§9.1.4 — Scoped blast radius.** A grant MUST carry, or reference, the bound on the
set of Model entities it can affect (§3.8.1). A grant with unbounded reach MUST NOT be
issued.

**CON-§9.1.5 — Auditability.** Every grant, use of a grant, and revocation is recorded
immutably and is queryable through the governed Query surface (Document 015) under
appropriate authority.

---

## Part 10 — The Derivation and Traceability Rules

**CON-§10.0.1** This Part is the mechanism that makes "everything derives from Document
000" enforceable rather than aspirational.

### 10.1 The derivation chain

**CON-§10.1.1** Every artifact in the repository MUST sit on an unbroken **derivation
chain** whose root is this document. The chain is expressed by explicit citation: each
artifact names the upstream clause(s) or document(s) that legitimate it (§0.2, §6.1.2).

**CON-§10.1.2** An artifact with no valid upstream citation has **no authority** and MUST
NOT be relied upon, cited, or implemented. Orphaned artifacts are defects.

**CON-§10.1.3** A citation is valid only if (a) the cited clause or artifact exists, (b) it
is at an equal-or-higher authority than the citing artifact, and (c) the citing artifact
does not contradict it. A citation that fails any of these is invalid and confers no
authority.

### 10.2 Non-contradiction

**CON-§10.2.1** No artifact may contradict this document or any artifact above it in the
derivation chain. Where a contradiction exists, the higher artifact governs and the lower
is void in the contradicting part until amended (restates the opening Notice; here made a
citable clause).

**CON-§10.2.2** Detection of a contradiction is a defect that MUST be surfaced, not
silently resolved. Silent resolution of a contradiction is itself a governance violation.

### 10.3 Traceability obligations on every document

**CON-§10.3.1** Every specification, contract, and RFC MUST carry a **traceability block**
(the concrete form is fixed in Part 11) recording: derivation (upstream), dependencies
(lateral/downward), invariants introduced, assumptions, version, and change history. A
document lacking a conformant traceability block MUST NOT be frozen.

**CON-§10.3.2** Traceability is bidirectional in principle: from any clause of this
document, it MUST be possible to enumerate the downstream artifacts that derive from it;
from any artifact, it MUST be possible to walk to this document. The tooling that realizes
this is a subsystem concern; the *obligation* is constitutional.

---

## Part 11 — Mandatory Document Structure (Derivation Template)

**CON-§11.0.1** Every child specification of this document (Documents 001–015 and any
future addition) **MUST** begin with the following normative front-matter and header
blocks. This is the physical form of the traceability obligation (§10.3.1). Fields marked
REQUIRED MUST be present and non-empty at freeze.

```yaml
---
document: "<NNN>"                      # REQUIRED, stable, never reused
title: "<Subsystem> Specification"     # REQUIRED
layer: "<L0..L5>"                       # REQUIRED, per §5.1.1
status: "draft | ratified | superseded" # REQUIRED
version: "<semver>"                     # REQUIRED, per Document 012 rules
derives_from:                           # REQUIRED, ≥1 entry, root-reachable
  - "000-platform-constitution.md#CON-§X.Y.Z"
depends_on:                             # REQUIRED (may be empty ONLY for L0/L1 roots)
  - "<NNN>-<name>.md"
depended_on_by: []                      # REQUIRED (maintained; may be empty)
invariants:                             # REQUIRED (may be empty)
  - id: "<DOC>-INV-1"
    statement: "..."
assumptions: []                         # REQUIRED (may be empty)
supersedes: "none"                      # REQUIRED
superseded_by: "none"                   # REQUIRED
---
```

**CON-§11.0.2** Immediately after front-matter, every child document MUST contain, in
order: (1) a **Derivation** section naming the constitutional clauses it implements; (2) an
**Invariants** section (its own, which MUST NOT weaken any Part 3 invariant, §3.0.1); (3)
an **Assumptions** section; (4) a **Dependencies** section listing inbound and outbound by
document number with the reason for each; (5) the **Specification body**; (6) a **Future
Evolution** section describing anticipated change and what MUST remain stable; and (7) a
**Version History** section (append-only, §3.7.1).

**CON-§11.0.3** A child document MUST NOT introduce a term that collides with Part 2, MUST
NOT declare an invariant that contradicts Part 3, and MUST NOT declare a dependency that
violates Part 6. Violation of any of these renders the document non-conformant and unfit to
freeze.

**CON-§11.0.4** This document is exempt from §11.0.1's `derives_from` requirement because
it is the root (§3.1.1). It is the only artifact in the repository so exempt.

---

## Part 12 — Amendment, Versioning, and Evolution

### 12.1 Versioning of this document

**CON-§12.1.1** This document is versioned by semantic versioning adapted to governance:
**MAJOR** for any change to a Part 3 invariant or Part 5 layer model; **MINOR** for adding
a clause, principle, subsystem register entry, or role that does not alter an invariant;
**PATCH** for clarifications that change no normative meaning. The rules for versioning all
*other* artifacts are delegated to Document 012, which MUST NOT contradict this clause.

**CON-§12.1.2** The transition from `0.x` to `1.0.0` **is the Freeze**. Freeze is performed
by the Governing Board (§8.4.1) and, once done, this document changes only by Amendment.

### 12.2 Ordinary amendment

**CON-§12.2.1** An ordinary Amendment (anything not touching Part 3 or Part 5) requires: a
Constitutional-class RFC (§7.1.1), Chief Systems Architect sponsorship, and Governing Board
ratification. The Amendment records what changed, why, and every downstream document
thereby placed out of conformance.

### 12.3 Heightened amendment (invariants and layers)

**CON-§12.3.1** An Amendment that alters any Part 3 invariant, any Part 5 layer, or §8.4.1
requires, in addition to §12.2.1: a documented super-majority of the Governing Board; a
cooling-off period during which the proposal is public in `RFC/` and unchanged; and an
explicit migration and conformance plan for every affected downstream artifact. Absent any
of these, the Amendment fails (§3.10.1).

### 12.4 Deprecation and tombstoning

**CON-§12.4.1** Nothing normative is ever silently deleted. A retired clause, subsystem, or
role becomes a **tombstone**: a record that states what existed, why it was retired, what
(if anything) supersedes it, and from which version it is inert. Tombstones are permanent
(§3.7.1, §4.7.1). Clause identifiers of tombstoned clauses are never reused (§0.2).

### 12.5 Continuity guarantee

**CON-§12.5.1** No Amendment may break the derivation chain (Part 10) for any existing
conformant artifact without providing, in the same Amendment, the migration path that
restores conformance. Evolution never orphans the past; it re-parents it (§4.7.1).

---

## Part 13 — Conformance and Enforcement

**CON-§13.1.1** An artifact is **conformant** if and only if: it sits on a valid derivation
chain to this document (§10.1.1); it carries a conformant traceability block (§11); it
contradicts nothing above it (§10.2.1); and it respects the dependency law (§6.2). All four
conditions are necessary; none alone is sufficient.

**CON-§13.2.1** Only a conformant, frozen/ratified artifact may be relied upon, cited as
authority, or implemented. A non-conformant artifact has no force regardless of its
content's apparent quality (§10.1.2).

**CON-§13.3.1** Conformance is intended to be **machine-checkable**. The obligations in
Parts 10 and 11 are written so that a tool can verify derivation, citation validity,
dependency acyclicity, and traceability completeness. Building that checker is a subsystem
concern (it will derive from Documents 006 and 015); the *requirement that conformance be
checkable* is constitutional.

**CON-§13.4.1** Discovery of a non-conformance is a defect to be recorded and remediated
through the appropriate decision class (Part 7), never waived informally. There is no
informal exception path (§3.10.1, §4.6.1).

---

## Part 14 — Ratification

**CON-§14.1.1** This document takes force upon Freeze (§12.1.2): ratification by the
Governing Board with the Chief Systems Architect as steward of record. Prior to Freeze it
is a `0.x` draft with no binding force; no artifact may yet cite it as ratified authority.

**CON-§14.1.2** Upon Freeze, every child specification (Documents 001–015) MUST be brought
into conformance with Part 11 before it may itself be frozen. Freezing this document does
not retroactively legitimate non-conformant children; it sets the standard they must meet.

---

### Ratification block

| Field | Value |
|---|---|
| Document | 000 — Continuum Platform Constitution |
| Version at freeze | `1.0.0` (upon ratification) |
| Chief Systems Architect | `<signature pending>` |
| Governing Board | `<signatures pending>` |
| Freeze date | `<pending>` |
| Supersedes | none (root) |

---

## Appendix A — Version History (append-only, §3.7.1)

| Version | Date | Class | Summary |
|---|---|---|---|
| 0.1.0-draft | 2026-07-05 | — | Initial authored draft presented for ratification. Establishes Parts 0–14: philosophy, terminology, ten platform invariants, design principles, five-layer boundary model, subsystem register (001–015), decision framework, governance and agent-participation model, authority-grant model, derivation/traceability rules, mandatory document template, amendment procedure, and conformance regime. Awaiting Freeze. |

## Appendix B — Traceability index (informative)

This index will, at Freeze, be maintained as the authoritative forward-map from each
constitutional clause to the child documents that derive from it (§10.3.2). It is populated
as each child specification is brought into conformance under Part 11.

| Constitutional clause | Derived-in (documents) |
|---|---|
| CON-§3.2.1 (Model Primacy) | 002, 005, 010, 013, 014 |
| CON-§3.3.1 (Total Traceability) | 006, 010, 011, 014 |
| CON-§3.4.1 (No Ambient Authority) | 004, 011 |
| CON-§3.5.1 (Uniform Verification) | 003, 006 |
| CON-§3.6.1 (Contract Precedence) | 003, 004, 008, 009 |
| CON-§5.1.1 (Layer Model) | all (001–015) |
| CON-§6.2.1 (Acyclic dependency) | all (001–015) |
| CON-§9.x (Authority grants) | 011 |
| CON-§10.x (Derivation) | all (001–015) + RFC/ |
| CON-§11.x (Document template) | all (001–015) + RFC/ |
| CON-§12.x (Evolution) | 012 |
| CON-§15 (Query surface for audit) | 015 |

*(Cross-references above are the intended derivations; they become normative as each child
document declares them in its own traceability block per §11.)*

---

*End of Document 000. This is the root. Nothing above it exists.*
