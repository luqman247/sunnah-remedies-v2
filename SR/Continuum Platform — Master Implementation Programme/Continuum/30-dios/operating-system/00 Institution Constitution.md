# 00 · Institution Constitution

> **Notice of authority.** This is Document 00. It is the single root from which every
> other document in the Digital Institution Operating System derives. No standard,
> checklist, design token, contract, specification, prototype, or line of implementation
> may contradict it. Where any downstream artifact conflicts with this document, this
> document prevails and the downstream artifact is void in the conflicting part until
> amended. This document contains **no implementation detail** by design; it constrains
> implementation without performing it.

**Classification:** Root authority (Governance layer, L0)
**Status:** Ratifiable draft — awaiting Freeze
**Version:** 1.0.0
**Derives from:** none — this is the root.
**Governs:** every document `01`–`15`, the master charter, and every digital product the
institution ever builds.

---

## Part 0 — How to read this document

### 0.1 Normative language

The words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**,
**SHOULD NOT**, **MAY** and **OPTIONAL** carry their RFC‑2119 meaning, and only when
capitalised. Prose that does not use them is explanatory and carries no independent
normative weight; where explanation appears to conflict with a normative clause, the
clause governs.

### 0.2 Clause identity

Every normative statement carries a stable identifier of the form `DIOS‑§<part>.<section>`
(e.g. `DIOS‑§3.2`). Identifiers are permanent: once ratified, a clause identifier is never
reused for different content and never renumbered. A retired clause becomes a **tombstone**
(§12.4), never a vacancy. Downstream documents cite the specific clause they derive from,
not this document as a whole.

### 0.3 What this document is not

This is not a specification of any product, not a roadmap, not a requirements document, and
not an implementation plan. It is the constitution: the fixed frame of reference against
which all of those are judged. It changes rarely, deliberately, and only through Part 12.

---

## Part 1 — Preamble, Purpose and Philosophy

### 1.1 What the institution is

**DIOS‑§1.1** Sunnah Remedies is an institution whose digital estate — websites,
platforms, applications, an apothecary, an academy, a clinic and an editorial and research
arm — is built and governed as **one coherent system**, so that every product feels like
it belongs to the same institution and inherits the same standards of truth, care and
craft.

**DIOS‑§1.2** The institution treats **the governed model of truth — not the source text,
not the rendered page — as the primary artifact.** Source code, documents, product pages,
course materials, clinical claims and configuration are *projections* of an underlying,
structured, verifiable model. The institution's first obligation is to keep that model
coherent, verifiable and traceable over the entire lifetime of every product.

**DIOS‑§1.3** This operating system is designed for a horizon of **not less than ten
years**, and for a working population in which **autonomous AI agents and human engineers
participate as co‑equals**. Every decision recorded here is made against that horizon, not
against the convenience of any single release.

### 1.2 The problem this operating system exists to solve

**DIOS‑§1.4** As AI agents take on a growing share of the work, the scarce resource ceases
to be the *production* of code, content or design and becomes the **trustworthy governance
of change**: knowing what is true, who or what changed it, on what authority, and whether
the change is verifiably correct. This operating system makes that governance a
first‑class, enforceable property of the institution rather than a matter of convention or
after‑the‑fact review.

**DIOS‑§1.5** The institution **MUST NOT** be architected around the assumption that a
human reviews every change. It **MUST** be architected around the assumption that most
changes are proposed by agents, that agents are numerous and fast, and that correctness and
authority must therefore be established **by construction and verification** rather than by
human attention. Human attention is reserved, deliberately, for the decisions that most
need it (§3.6).

### 1.3 Philosophy — the five convictions

**DIOS‑§1.6 — Truth is derived, never asserted.** No participant, human or agent, holds
authority merely by claiming it. A statement about a product is trustworthy only if its
derivation can be traced to a ratified source. *(Applies the Continuum conviction
`CON‑§1.3.1`; realised institutionally by Part 10.)*

**DIOS‑§1.7 — Verification precedes trust.** The institution trusts a change because it has
been verified against a stated contract, not because of who or what produced it. Human and
agent authorship are held to the **identical** verification standard (§3.5). *"Verify
before reporting success"* — the Engineering Behaviour Standard's tenth principle — is here
raised from practice to law.

**DIOS‑§1.8 — The model is the source of truth; text is a view.** Where a projection (a
source file, a product page, a PDF) disagrees with the governed model, the model governs,
and the disagreement is itself a defect the institution MUST surface. Business content
lives in the content model, never hardcoded (§3.11).

**DIOS‑§1.9 — Boundaries are load‑bearing.** Longevity depends on subsystem and layer
boundaries (Part 5) being explicit, minimal and stable. Boundaries are not a nicety; they
are the mechanism by which the institution survives a decade of change without collapse.

**DIOS‑§1.10 — Reversibility over cleverness.** Between two designs of comparable merit, the
institution prefers the one whose effects can be observed, bounded and undone. Any
irreversible operation MUST be explicitly identified as such and justified.

---

## Part 2 — Canonical terminology

**DIOS‑§2.0** This Part is the single authoritative glossary for the operating system.
Downstream documents MUST use these terms as defined and MUST NOT redefine them. Capitalised
use of a term anywhere refers to this definition.

| Term | Canonical definition |
|---|---|
| **Institution** | The totality of Sunnah Remedies as governed by this operating system. |
| **Product** | Any governed digital unit: a website, application, platform, service, course, storefront, document set, or interface. |
| **Participant** | Any actor that can propose, verify or observe change: a human Engineer, or an AI Agent. |
| **Engineer** | A human Participant (extends to designers, editors and product owners where context applies). |
| **Agent** | An autonomous or semi‑autonomous AI Participant acting under a granted Authority. |
| **Model** | The structured, canonical, machine‑navigable representation of a Product — its architecture, decisions, content, conventions and history. The source of truth (§1.8). |
| **Projection** | Any human‑ or tool‑facing rendering derived from the Model (source files, pages, docs, deployments). |
| **Contract** | A declared, verifiable statement of what a component requires, guarantees and forbids. |
| **Verification** | The act of establishing, by defined procedure, that a change satisfies its governing Contracts. |
| **Transaction** | A proposed set of changes plus the Verification obligations they incur; admitted only when those obligations are satisfied by independent evidence. |
| **Evidence** | A signed, immutable Verification artifact bound to the exact state it attests. |
| **Authority** | The right, derived from this document, to perform a class of action. Never intrinsic to a Participant. |
| **Grant** | An explicit, scoped, revocable assignment of a specific capability to a specific Participant or role. |
| **Invariant** | A property that MUST hold at all times; its violation is by definition a defect. |
| **Derivation** | The traceable relationship by which a downstream artifact is legitimated by an upstream one. |
| **Content** | Business‑editable material (products, prices, courses, ingredients, articles, testimonials, team) that lives in the content model, never in code. |
| **Amendment** | A change to this document, made only via Part 12. |
| **Freeze** | The act of ratifying this document, after which it changes only by Amendment. |

---

## Part 3 — Invariants (the inviolable core)

**DIOS‑§3.0** The clauses in this Part are **Institution Invariants**. They hold at all
times, in all products, for all Participants. A state that violates any invariant is, by
definition, a defect, regardless of any downstream document that appears to permit it. No
downstream document may weaken, suspend or carve exceptions into an invariant; it may only
*strengthen* one.

**DIOS‑§3.1 — Single root of authority.** There is exactly one root authority: this
document. Every artifact's legitimacy traces to it (Part 10).

**DIOS‑§3.2 — Model primacy.** The Model is the sole source of truth about a Product. Where
a Projection disagrees with the Model, the Model governs (§1.8).

**DIOS‑§3.3 — Total traceability.** Every change to a Product's Model MUST carry an
immutable record of: what changed, the pre‑ and post‑state, the Participant of record, the
Authority under which it was made, and the Verification result. **There are no untraceable
mutations.**

**DIOS‑§3.4 — No ambient authority.** No Participant, component or plugin possesses any
authority by default. All authority is explicitly granted, scoped and revocable (Part 9).
**Absence of a grant is denial.**

**DIOS‑§3.5 — Uniform verification.** A change is admitted to the Model only after it has
passed the Verification required by its governing Contracts. The standard is **identical**
for human‑ and agent‑authored change. Identity may determine *authority to attempt* a
change; it never substitutes for verification of the change.

**DIOS‑§3.6 — Human gate on the irreversible.** Machine evidence is *necessary* for every
change; for **irreversible** actions (production deploy, data migration, permission change,
publishing a clinical claim, destructive deletion) it is *not sufficient*. Irreversible
actions MUST additionally carry a recorded human approval. Reversible actions MAY be fully
automated on evidence.

**DIOS‑§3.7 — Reversibility of record.** The historical record is append‑only and
immutable. State may move forward; the record of how it got there MUST NOT be rewritten or
deleted.

**DIOS‑§3.8 — Bounded blast radius.** Every operation MUST have a statically declarable
upper bound on the set of Model entities it can affect. An operation whose effect cannot be
bounded MUST NOT be admitted.

**DIOS‑§3.9 — Determinism of verification.** Given the same input state and the same
Contract, Verification MUST yield the same verdict. It MUST NOT depend on unrecorded,
non‑reproducible inputs.

**DIOS‑§3.10 — Fail closed.** In the presence of ambiguity, missing authority, or
unavailable Verification, the institution denies the action. Safety is the default;
capability is the exception that must be earned.

**DIOS‑§3.11 — Content is content.** Business content MUST live in the content model and
remain editable by non‑engineers. It MUST NOT be hardcoded into implementation. A Product
that hardcodes a product, price, course, ingredient, article, testimonial or team member is
non‑conformant.

**DIOS‑§3.12 — One institution, one standard.** Every Product inherits this operating
system by reference. A Product MAY add stricter local standards; it MUST NOT remove or
weaken an institution standard. This is what makes every future product feel like it
belongs to the same institution.

> **Invariant amendment lock.** Part 3 is amendable only under the heightened procedure of
> §12.3 (super‑majority + cooling‑off). These are the last things to change and the hardest.

---

## Part 4 — Principles (design doctrine)

Principles guide judgment where invariants do not decide the case. Where two principles
tension, the earlier‑numbered one is weighted more heavily, and the resolving document MUST
record which it favoured and why.

**DIOS‑§4.1 — Understand before acting.** No implementation begins without understanding the
business objective, the engineering objective, the existing implementation, the
architectural context, and the expected outcome. *Read before writing; think before
changing.*

**DIOS‑§4.2 — Audit before modifying.** Before any change: review what exists, understand
current behaviour, identify reusable code and content, identify dependencies and affected
modules. *Never assume; always investigate first.*

**DIOS‑§4.3 — Governance before capability.** A capability is added only once its governance
— authority, verification, traceability — is defined. Capability without governance is not
shipped.

**DIOS‑§4.4 — Explicit over implicit.** Behaviour, authority and dependency are declared,
never inferred. If it matters, it is written down and citable.

**DIOS‑§4.5 — Small, stable cores; large, replaceable edges.** The invariant core stays
small and changes rarely; capability lives at the edges (components, plugins, engines) where
it can be replaced without disturbing the core.

**DIOS‑§4.6 — Prefer reuse, prefer simplicity.** Before creating anything new, ask whether an
existing component, service, hook, schema or pattern can be reused. Choose the simplest
solution that satisfies the requirement. Avoid clever code, unnecessary abstraction,
premature optimisation and over‑engineering.

**DIOS‑§4.7 — Separate responsibilities.** Each module has one clear responsibility.
Business logic, presentation, data access, content and configuration are kept apart.

**DIOS‑§4.8 — Stay within scope.** Implement only the approved work. Do not add unrelated
features, redesign without approval, or change behaviour outside the request. Scope
discipline reduces risk.

**DIOS‑§4.9 — Design for the agent and the human equally.** Every surface is legible and safe
for both an Engineer reading it and an Agent operating it. Neither is a second‑class
Participant.

**DIOS‑§4.10 — Observability is not optional.** If the institution does something, that
something is observable, attributable and explainable after the fact.

**DIOS‑§4.11 — Evolve by addition, retire by tombstone.** New capability arrives as additive,
versioned surface; old capability is deprecated and tombstoned, never silently removed
(§12.4).

**DIOS‑§4.12 — Cost of change is a design input.** The difficulty of reversing a decision
later is weighed when the decision is made. Cheap‑to‑reverse decisions may be made quickly;
expensive‑to‑reverse decisions require the framework of Part 7.

---

## Part 5 — Architectural boundaries

**DIOS‑§5.0** The institution's digital estate is partitioned into **layers**. A boundary
between layers is a **contract surface**: the only legitimate way to cross it is through a
declared Contract (§3.6 of the Continuum model; §4.4 here). Reaching across a boundary by
any other means is a defect.

### 5.1 The layer model

**DIOS‑§5.1** Every Product is organised into these ordered layers. A layer MAY depend only
on layers at or below it; upward dependency is forbidden.

```
┌────────────────────────────────────────────────────────────────┐
│  L5  Experience     — interfaces humans and agents touch:        │
│                        UI, CLI, API, SDK, editorial surfaces     │
├────────────────────────────────────────────────────────────────┤
│  L4  Extension      — plugins, integrations, third‑party surface │
├────────────────────────────────────────────────────────────────┤
│  L3  Reasoning      — engines/workers, verification, query       │
├────────────────────────────────────────────────────────────────┤
│  L2  Model          — the content & context model, schema,       │
│                        lifecycle states, event record            │
├────────────────────────────────────────────────────────────────┤
│  L1  Substrate      — runtime/hosting, storage, delivery         │
├────────────────────────────────────────────────────────────────┤
│  L0  Governance     — THIS DOCUMENT, security, evolution/upgrade │
└────────────────────────────────────────────────────────────────┘
```

**DIOS‑§5.2** L0 (Governance) is depended upon by every layer and depends on nothing.
Security and evolution live in L0 because authority and change are governance concerns all
layers must obey, not services layers consume at will.

**DIOS‑§5.3** The Model layer (L2) is the **only** layer permitted to hold the canonical
Model. All other layers operate on the Model exclusively through L2's contracts. No layer
may keep a second, authoritative copy of the Model (§3.2).

**DIOS‑§5.4** No layer may be added, removed or reordered except by Amendment (Part 12).

### 5.2 Boundary rules

**DIOS‑§5.5** Every cross‑boundary interaction occurs through a Contract. A subsystem MUST
NOT expose internal structure across its boundary; consumers depend on the Contract, never
on the implementation behind it. Storage internals can change entirely with zero change to
the layers above, because those layers speak contracts, not internals.

---

## Part 6 — Dependency law

**DIOS‑§6.1 — Acyclic dependency.** The subsystem dependency graph MUST be a directed
acyclic graph. No cycles, at any layer, ever. A proposed dependency that would introduce a
cycle is rejected by construction.

**DIOS‑§6.2 — Downward‑only.** A subsystem may depend only on subsystems in its own layer or
a lower layer. Same‑layer dependencies are permitted only if acyclic and declared.

**DIOS‑§6.3 — Declared dependency only.** A subsystem may rely only on dependencies it has
declared. Undeclared reliance is a defect.

**DIOS‑§6.4 — Minimal dependency.** A subsystem depends on the fewest others necessary to
fulfil its charter. Convenience is not a justification for a dependency.

---

## Part 7 — Decision framework

**DIOS‑§7.0** This Part governs *how* binding decisions are made, so that decisions are
legitimate, recorded and traceable (§3.3). It decides no specific question.

### 7.1 Decision classes

**DIOS‑§7.1** Every decision is classified by reversibility and scope:

| Class | Definition | Required procedure |
|---|---|---|
| **Constitutional** | Changes this document. | Amendment (Part 12). |
| **Structural** | Adds/removes a subsystem, layer or cross‑layer contract. | Proposal + institutional ratification (§7.2). |
| **Specification** | Changes a subsystem's Contract or invariants within its charter. | Proposal + owner + one reviewer. |
| **Local** | Internal to a subsystem, no Contract change. | Owner discretion, recorded. |

**DIOS‑§7.2** When the class is disputed, the decision is treated as the *higher* class
until resolved (fail closed, §3.10). Structural and Specification decisions are made through
recorded proposals stating: the problem, the clause(s) they operate under, the options
considered, the decision, the invariants affected, and the rollback plan. A proposal that
changes an invariant escalates to Constitutional class.

**DIOS‑§7.3 — Decision‑record obligation.** Every decision at Specification class or above
MUST leave a durable, citable record (an **ADR** — Architecture Decision Record) identifying
the deciding authority, the date, the clauses relied upon, and the alternatives rejected. A
decision without such a record has no derivational force. ADRs are immutable and
superseded‑not‑edited; the record can always answer *"why is it this way?"* and *"what
breaks if we change it?"*

---

## Part 8 — Governance model

### 8.1 Roles

**DIOS‑§8.1** The institution recognises these governance roles. Roles grant Authority; they
are not identities. One Participant may hold several roles; a role may be held by an Agent
where this document does not reserve it to a human.

| Role | Authority | Reserved to human? |
|---|---|---|
| **Founder / Governing authority** | Ratify Amendments and Structural decisions; freeze this document; approve production releases and irreversible actions. | Yes (§8.4). |
| **Chief Architect** | Steward this document; adjudicate derivation disputes; sponsor Structural proposals. | Yes. |
| **Subsystem Owner** | Steward one standard or product area; accept Specification proposals within charter. | No. |
| **Reviewer** | Verify conformance of a proposed change to its governing Contracts. | No. |
| **Contributor** | Propose change under granted Authority (Agents included). | No. |

### 8.2 Legitimacy and delegation

**DIOS‑§8.2** All role authority derives from this document (§3.1). A role may exercise only
the authority this document or a ratified proposal grants it; role authority is scoped,
recorded and revocable. **No role may grant an authority it does not itself hold.**
Delegation narrows; it never widens.

### 8.3 Agent participation

**DIOS‑§8.3** Agents are Participants and MAY hold any role not reserved to humans. An
Agent's authority is granted, scoped, verifiable and revocable on the identical basis as a
human's. **No Agent holds standing authority merely by being capable.** Every Agent action
is attributable to (a) the Agent identity, including its model and version, and (b) the
Authority under which it acted, both recorded immutably. An action that cannot be so
attributed MUST be refused.

### 8.4 Reserved human authority

**DIOS‑§8.4** The following MUST NOT be performed by an Agent under any circumstances,
regardless of capability or delegation: ratifying or freezing this document; altering a
Part 3 invariant; approving an irreversible production action (§3.6); and granting the
Founder or Chief Architect role. These are reserved to human authority permanently. This
clause is itself invariant‑locked (§12.3).

---

## Part 9 — Authority model

**DIOS‑§9.0** This Part defines the *model* of authority that the Security Standards
(Document 13) MUST implement. It defines the shape, not the mechanism.

**DIOS‑§9.1 — Grant, not possession.** Authority exists only as a **Grant**: an explicit,
scoped, time‑ or condition‑bounded, revocable assignment of a specific capability to a
specific Participant or role. There is no un‑granted authority (§3.4).

**DIOS‑§9.2 — Least authority.** A Grant conveys the minimum capability sufficient for its
purpose. Broad grants require justification recorded at decision time.

**DIOS‑§9.3 — Revocability.** Every Grant is revocable, and revocation takes effect
**forward‑only**, without rewriting history (§3.7).

**DIOS‑§9.4 — Bounded scope.** A Grant carries, or references, the bound on the set of Model
entities it can affect (§3.8). A Grant with unbounded reach MUST NOT be issued.

**DIOS‑§9.5 — Auditability.** Every Grant, every use of a Grant, and every revocation is
recorded immutably and is queryable under appropriate authority.

---

## Part 10 — Derivation and traceability

**DIOS‑§10.0** This Part makes *"everything derives from Document 00"* enforceable rather
than aspirational.

**DIOS‑§10.1 — The derivation chain.** Every artifact in the operating system sits on an
unbroken derivation chain whose root is this document, expressed by explicit citation: each
artifact names the upstream clause(s) it implements. An artifact with no valid upstream
citation has **no authority** and MUST NOT be relied upon. Orphans are defects.

**DIOS‑§10.2 — Non‑contradiction.** No artifact may contradict this document or any artifact
above it. Where a contradiction exists, the higher artifact governs and the lower is void in
the contradicting part until amended. Detection of a contradiction is a defect that MUST be
surfaced, not silently resolved.

**DIOS‑§10.3 — Traceability obligation.** Every standard, contract and proposal carries a
traceability block recording derivation (upstream), dependencies (lateral/downward),
invariants introduced, assumptions, version and change history. Traceability is
bidirectional in principle: from any clause here it MUST be possible to enumerate what
derives from it, and from any artifact it MUST be possible to walk back to this document.

---

## Part 11 — Mandatory document structure

**DIOS‑§11.0** Every child document of this operating system MUST open by declaring, in
order: (1) which constitutional clauses it implements; (2) its own invariants, which MUST
NOT weaken any Part 3 invariant; (3) its assumptions; (4) its inbound and outbound
dependencies with a reason for each; (5) the body; (6) a *future evolution* section stating
what MUST remain stable; and (7) an append‑only version history.

**DIOS‑§11.1** A child document MUST NOT introduce a term that collides with Part 2, MUST NOT
declare an invariant that contradicts Part 3, and MUST NOT declare a dependency that
violates Part 6. Violation of any of these renders the document non‑conformant and unfit to
freeze. This document is the only artifact exempt from the derivation requirement, because
it is the root.

---

## Part 12 — Amendment, versioning and evolution

**DIOS‑§12.1 — Versioning of this document.** Semantic versioning adapted to governance:
**MAJOR** for any change to a Part 3 invariant or the Part 5 layer model; **MINOR** for
adding a clause, principle, role or register entry that alters no invariant; **PATCH** for
clarifications that change no normative meaning. The transition from `0.x`/`1.0.0` onward at
Freeze fixes this document; thereafter it changes only by Amendment.

**DIOS‑§12.2 — Ordinary amendment.** Anything not touching Part 3, Part 5 or §8.4 requires a
Constitutional‑class proposal, Chief Architect sponsorship and Founder ratification,
recording what changed, why, and every downstream document thereby placed out of
conformance.

**DIOS‑§12.3 — Heightened amendment.** An Amendment altering any Part 3 invariant, any Part 5
layer, or §8.4 requires, in addition: a documented super‑majority of the governing
authority; a cooling‑off period during which the proposal is public and unchanged; and an
explicit migration and conformance plan for every affected downstream artifact. Absent any
of these, the Amendment fails (§3.10).

**DIOS‑§12.4 — Deprecation and tombstoning.** Nothing normative is ever silently deleted. A
retired clause, subsystem or role becomes a **tombstone**: a record of what existed, why it
was retired, what supersedes it, and from which version it is inert. Tombstones are
permanent; retired clause identifiers are never reused.

**DIOS‑§12.5 — Continuity guarantee.** No Amendment may break the derivation chain for an
existing conformant artifact without providing, in the same Amendment, the migration path
that restores conformance. Evolution never orphans the past; it re‑parents it.

---

## Part 13 — Conformance and enforcement

**DIOS‑§13.1** An artifact is **conformant** if and only if: it sits on a valid derivation
chain to this document (§10.1); it carries a conformant traceability block (§11); it
contradicts nothing above it (§10.2); and it respects the dependency law (§6). All four are
necessary; none alone is sufficient.

**DIOS‑§13.2** Conformance is enforced at the gates: the **Review Checklist** (Document 14)
before merge, and the **Release Checklist** (Document 15) before production. A change that
fails conformance does not merge; a release that fails conformance does not ship. There are
no exceptions (§3.10).

---

## The single institutional thesis

> The institution's product is a **governed, verifiable model of truth**, of which every
> website, application, document and interface is a projection. Humans and AI agents propose
> change as co‑equals; change becomes true only through verification the proposer cannot
> influence, recorded immutably, under authority that is always granted and never assumed —
> with a human always standing at the gate of the irreversible.

Everything in Documents `01`–`15` executes this thesis. Nothing in them may contradict it.

---

### Related documents

Every downstream document (`01`–`15`) and the master `Digital Institution Constitution`
derive from this document. See in particular: `02 Engineering Standards` (§3.5, §4.1–§4.8),
`10 AI Agent Standards` (§3.5, §8.3, §8.4), `13 Security Standards` (Part 9), `14 Review
Checklist` and `15 Release Checklist` (§13.2).

*Version 1.0.0 · append‑only history in `CHANGELOG.md`.*
