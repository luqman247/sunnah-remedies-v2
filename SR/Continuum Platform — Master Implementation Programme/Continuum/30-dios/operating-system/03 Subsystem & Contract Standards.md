# 03 · Subsystem & Contract Standards

**Implements:** DIOS‑§1.9 (boundaries), §3.2 (model primacy), §4.4 (explicit), §4.5 (small
core), §4.7 (separation), §5 (layers), §6 (dependency law).
**Layer:** L3/L4 (contracts span all). **Depends on:** `00`, `02`, `05`.

> The longest‑lived asset in any durable institution is its **interface contracts** (POSIX,
> SQL, HTTP outlive every implementation). This document defines the institution's stable
> contracts and reusable subsystems. Code is disposable around them.

## 1. Contract invariants

- **CON‑INV‑1 — Contract precedence.** No component, plugin or surface may perform an action
  its declared Contract does not permit. Undeclared capability is forbidden capability (§3.4).
- **CON‑INV‑2 — Contracts are the stable core.** Contracts evolve only additively or by
  versioned migration; they are never destructively renamed (§4.11).
- **CON‑INV‑3 — Behaviour, not implementation.** A Contract specifies what a component
  requires, guarantees and forbids — never how it is built.

## 2. The reusable subsystems

Every product composes from a common set of governed subsystems rather than reinventing them.
Each is a Contract with a stable interface:

- **Content model & schema** — the authoritative shape of every business entity (product,
  course, ingredient, article, practitioner, booking). One schema per entity, never
  duplicated (§3.11, Document 05).
- **Context & retrieval** — how truth about a product is stored, kept fresh, and served to
  humans and agents (Document 05).
- **Verification** — the obligation/evidence/attestation contract that gates every change
  (Document 02 §4, Document 14).
- **Engines / workers** — stateless components that read context, propose transactions, and
  emit events; they own no truth (§3.2). Adding one cannot corrupt state because it can only
  propose, never commit.
- **Design primitives** — the tokenised components of Document 01 (header, footer, nav, card,
  button, form, input, table, gallery, search, filters, product/editorial/course/knowledge
  layouts), each specified by *behaviour* and *accessibility*, never by implementation.
- **Query** — the declared way to read the Model (Document 05, Document 09).
- **Telemetry** — the opt‑in, privacy‑bounded signal contract (Document 12).

## 3. Component standards (behaviour, never implementation)

Reusable UI components are Contracts. For each primitive the standard declares: its
responsibility (single), its states (default, hover, focus, active, disabled, loading,
error, empty), its accessibility obligations (Document 07), its content source (the model,
never hardcoded), and its composition rules. A product implements the contract in its stack
of choice; the behaviour is invariant across products, which is what makes the institution
coherent (§3.12).

## 4. The eleven‑contract spine (governance backbone)

For platform‑class products the institution inherits Continuum's contract spine as the
interoperability standard: **Project, Context, Verification, Prompt, Plugin, Engine,
Decision, Knowledge, Release, Migration, Telemetry.** Each declares its purpose, key
invariants and evolution rule. An implementation is *institution‑compliant* iff it honours
them. Contract changes are the most protected changes in the institution — a constitutional
concern, versioned and migration‑planned (§7.1, §12).

## 5. Evolution

Contracts add fields (safe) and version breaking changes (migrated by Document 11). Old
records remain readable forever via upcasters. A contract written against version X keeps
working for its published support window. This is the promise that lets both internal teams
and third parties invest in building on the institution (Document 11).

### Related documents
`02` (engineering), `05` (content/context model), `11` (extension & migration), `01`
(design primitives), `12` (telemetry).

*Version 1.0.0.*
