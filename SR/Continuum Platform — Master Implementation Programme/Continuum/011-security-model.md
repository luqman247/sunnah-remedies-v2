---
document: "011"
title: "Security Model Specification"
layer: "L0"
status: "draft"
version: "0.1.0-draft"
derives_from:
  - "000-platform-constitution.md#CON-§3.4.1"   # No Ambient Authority
  - "000-platform-constitution.md#CON-§3.5.1"   # Uniform Verification
  - "000-platform-constitution.md#CON-§3.10.1"  # Fail Closed
  - "000-platform-constitution.md#CON-§8.3.1"   # Agent participation
  - "000-platform-constitution.md#CON-§9.1.1"   # Grant, not possession
  - "000-platform-constitution.md#CON-§9.1.2"   # Least authority
  - "000-platform-constitution.md#CON-§9.1.3"   # Revocability
  - "000-platform-constitution.md#CON-§9.1.4"   # Scoped blast radius
  - "000-platform-constitution.md#CON-§9.1.5"   # Auditability
depends_on: []            # L0 root: depends on no subsystem, only on Document 000
depended_on_by:
  - "001-runtime-specification.md"
  - "004-plugin-system.md"
  - "010-storage-specification.md"
  - "008-api-specification.md"
  - "009-sdk-specification.md"
  - "007-cli-specification.md"
  - "006-verification-protocol.md"
invariants:
  - id: "SEC-INV-1"
    statement: "Every capability exercised against the Platform resolves to exactly one Grant; absence of a resolving Grant is denial."
  - id: "SEC-INV-2"
    statement: "Every Grant is scoped, revocable, attributable, and blast-radius-bounded before it may be issued."
  - id: "SEC-INV-3"
    statement: "Human and Agent Principals are authorized by the identical Grant mechanism; identity never substitutes for a Grant."
  - id: "SEC-INV-4"
    statement: "Every authorization decision is recorded immutably with the Grant, Principal, action, target-bound, and verdict."
  - id: "SEC-INV-5"
    statement: "Revocation is forward-acting and never rewrites the historical record."
  - id: "SEC-INV-6"
    statement: "On any ambiguity, unavailable check, or expired/absent Grant, the decision is DENY."
assumptions:
  - "A durable, append-only record exists (obligation discharged by Document 010) for authorization events; 011 defines the semantics, 010 the persistence."
  - "A verification substrate exists (Document 006) to which authorization can defer for change-admission; 011 governs authority, 006 governs correctness."
  - "Cryptographic identity primitives (signing, verification) are available from the Runtime host; 011 specifies their use, not their implementation."
supersedes: "none"
superseded_by: "none"
---

# Document 011 — Security Model Specification

> **Layer L0 (Governance).** This subsystem defines *who may do what, on what authority,
> and how that is proven and revoked*. It is depended upon by the Runtime, Storage, Plugin
> System, and all Experience-layer surfaces. It depends on no subsystem — only on the
> Constitution. Its Contract surface is therefore among the most stable in the Platform and
> changes only under the decision framework of Document 000, Part 7.

---

## 1. Derivation

This document is the sole concrete realization of the **authority model** the Constitution
defines in the abstract. It implements, and MUST NOT weaken, the following constitutional
clauses:

| Constitutional clause | Obligation placed on this document |
|---|---|
| CON-§3.4.1 — No Ambient Authority | Define authority such that nothing is permitted by default; absence of grant is denial. |
| CON-§3.5.1 — Uniform Verification | Ensure the authorization path applies identically to human and Agent Principals. |
| CON-§3.10.1 — Fail Closed | Make DENY the default outcome of every undecidable authorization question. |
| CON-§8.2.1 / §8.2.2 — Legitimacy & narrowing delegation | Make role authority derive downward only; delegation narrows, never widens. |
| CON-§8.3.1 / §8.3.2 — Agent participation & attribution | Treat Agents as Principals; make every Agent action attributable to identity + authority. |
| CON-§9.1.1–§9.1.5 — The Grant model | Provide the concrete Grant: explicit, scoped, revocable, blast-radius-bounded, auditable. |

Per **CON-§10.1.1**, every clause below traces upward to one of these. This document
introduces no authority not licensed by Part 9 of the Constitution.

---

## 2. Invariants (subsystem)

These strengthen, and never weaken, the Platform Invariants of Constitution Part 3
(**CON-§3.0.1**). Each carries an identifier stable for the life of the subsystem.

- **SEC-INV-1 — Grant resolution is total.** Every attempted capability MUST resolve, at
  decision time, to exactly one governing Grant. Zero grants ⇒ DENY. Two conflicting
  grants ⇒ the *more restrictive* governs, then the conflict is recorded as a defect.
  *(Derives CON-§3.4.1, §9.1.1.)*
- **SEC-INV-2 — Grants are well-formed before issue.** A Grant that lacks a scope, an
  expiry-or-condition, an attributable subject, or a declared blast-radius bound MUST NOT
  be issued. Malformed grants do not exist. *(Derives CON-§9.1.1–§9.1.4.)*
- **SEC-INV-3 — Principal-uniformity.** The authorization function is identical for human
  and Agent Principals. A Principal's *type* MAY be a condition inside a Grant; it is never
  an input that bypasses the Grant. *(Derives CON-§3.5.1, §8.3.1.)*
- **SEC-INV-4 — Decisions are recorded.** Every authorization decision (ALLOW or DENY)
  MUST emit an immutable AuthzEvent carrying grant-ref, principal, action, target-bound,
  verdict, and cause. *(Derives CON-§3.3.1, §9.1.5.)*
- **SEC-INV-5 — Forward-only revocation.** Revoking a Grant affects only decisions made at
  or after the revocation instant; it MUST NOT alter past decisions or their records.
  *(Derives CON-§3.7.1, §9.1.3.)*
- **SEC-INV-6 — Fail closed.** Any of {no grant, expired grant, unresolvable scope,
  unavailable record, unverifiable identity} yields DENY, never a provisional ALLOW.
  *(Derives CON-§3.10.1.)*

> **Non-weakening notice.** No clause in this document may be read to permit an action that
> Constitution Part 3 forbids. Where this document is silent, the Constitution governs and
> the default is DENY (SEC-INV-6).

---

## 3. Assumptions

1. **Persistence is external.** This document defines the *semantics* of the authorization
   record; its durability is the charter of Document 010 (Storage). 011 assumes an
   append-only, immutable sink exists and specifies what MUST be written to it.
2. **Correctness is external.** Whether a *change* is correct is the charter of Document
   006 (Verification). 011 decides only whether a Principal is *authorized to attempt* the
   change. Authorization never implies correctness, and correctness never implies
   authorization; both gates MUST pass (CON-§3.5.1, §13.1.1).
3. **Identity primitives are hosted.** The Runtime (Document 001) provides cryptographic
   signing/verification and a trusted clock. 011 specifies their *use* in authorization; it
   does not specify the primitives themselves.
4. **No network trust is assumed.** Authority is never inferred from network position,
   caller address, or transport. Only a resolved Grant authorizes (SEC-INV-1).

---

## 4. Dependencies

### 4.1 Outbound (this document depends on)

None at the subsystem level. As an L0 root (CON-§5.1.2), 011 depends only on Document 000.
This is deliberate: the authority model must not be able to enter a dependency cycle with
the things it authorizes (CON-§6.2.1).

### 4.2 Inbound (documents that depend on this)

| Document | Reason for dependency |
|---|---|
| 001 Runtime | Must consult the authorization function before dispatching any Engine action. |
| 010 Storage | Must persist AuthzEvents and enforce that revocations do not mutate history. |
| 004 Plugin System | Admits extensions only under scoped Grants; isolation derives from the Grant model. |
| 006 Verification | Pairs its correctness gate with this document's authority gate (dual-gate, §3.2). |
| 007/008/009 CLI/API/SDK | Every Experience-layer entry point authorizes through this model before acting. |

> A change to §5's Contract surface is a **Specification-class** decision (CON-§7.1.1) and
> ripples to every inbound document above. Such a change MUST enumerate the affected
> documents per CON-§12.2.1.

---

## 5. Specification Body

### 5.1 Principals

**SEC-§5.1.1** A **Principal** is any entity capable of holding a Grant. Principals are of
exactly two *kinds*: `human` and `agent` (CON-§2 Engineer/Agent). Kind is a stable
attribute of a Principal identity and MAY be referenced as a *condition* within a Grant
(SEC-INV-3), never as a bypass.

**SEC-§5.1.2** Every Principal has a stable, unforgeable **PrincipalId** bound to a
verifiable credential. An action whose Principal cannot be cryptographically established is
unauthenticated and therefore DENIED (SEC-INV-6). Authentication establishes *who*;
authorization (§5.3) establishes *whether*.

**SEC-§5.1.3** A Principal MAY assume one or more **Roles** (CON-§8.1.1). A Role is a named
bundle of Grants. Assuming a Role conveys exactly the Role's Grants and nothing more
(CON-§8.2.2, delegation narrows).

### 5.2 The Grant

**SEC-§5.2.1** A **Grant** is the atomic unit of authority. It is the concrete form of
CON-§9.1.1. A well-formed Grant carries, at minimum, the fields below. This is a *semantic*
schema (the physical serialization is a Storage/SDK concern, not fixed here):

| Field | Meaning | Constitutional basis |
|---|---|---|
| `grant_id` | Stable, unique, never reused. | CON-§9.1.5 (auditability) |
| `subject` | The PrincipalId or Role the Grant empowers. | CON-§9.1.1 |
| `capability` | The specific action-class permitted (see §5.4). | CON-§9.1.2 (least authority) |
| `scope` | The bounded set of Model targets it may affect. | CON-§9.1.4 (blast radius) |
| `condition` | Predicate that MUST hold for the Grant to apply (time window, Principal kind, state). | CON-§9.1.3 |
| `issuer` | The authority that issued it; MUST itself hold ≥ the granted capability. | CON-§8.2.2 |
| `revocation_ref` | Handle by which the Grant can be revoked forward-only. | CON-§9.1.3 |
| `justification` | Recorded reason, REQUIRED when the Grant is broader than minimal. | CON-§9.1.2, §7.3.1 |

**SEC-§5.2.2 — Least-authority default.** A Grant's `capability` and `scope` MUST be the
narrowest sufficient for its stated purpose. A broad Grant is not forbidden but MUST carry
`justification` recorded at issue time (CON-§9.1.2, §7.3.1). Un-justified breadth is a
defect.

**SEC-§5.2.3 — No self-widening.** An issuer MUST NOT issue a Grant whose `capability` or
`scope` exceeds the issuer's own. Delegation strictly narrows (CON-§8.2.2). A violation is
rejected at issue time and recorded.

**SEC-§5.2.4 — Bounded scope.** A Grant's `scope` MUST reference, or be, a statically
bounded set of Model targets (CON-§3.8.1). A Grant whose scope cannot be bounded MUST NOT
be issued (SEC-INV-2).

### 5.3 The authorization function (Contract surface)

**SEC-§5.3.1** The Security Model exposes exactly one authorization primitive across its
boundary. Its *shape* is fixed here; its implementation is not (CON-§5.2.2):

```
authorize(principal, capability, target) -> Decision
    where Decision ∈ { ALLOW(grant_ref), DENY(cause) }
```

**SEC-§5.3.2 — Resolution algorithm (normative, mechanism-free).** Given `(principal,
capability, target)`:
1. Establish the Principal's authenticated identity. If unestablished ⇒ `DENY(unauthenticated)`.
2. Collect all Grants whose `subject` matches the Principal or an assumed Role.
3. Retain those whose `capability` covers the requested capability, whose `scope` covers
   `target`, and whose `condition` currently holds.
4. If the retained set is empty ⇒ `DENY(no_grant)` (SEC-INV-1).
5. If two retained Grants conflict, the **more restrictive** governs; the conflict is
   emitted as a defect record (SEC-INV-1).
6. Otherwise ⇒ `ALLOW(grant_ref)` for the governing Grant.
7. In all cases, emit an AuthzEvent (§5.5) before returning.

**SEC-§5.3.3 — Determinism.** Given identical inputs and identical Grant state,
`authorize` MUST return an identical Decision (mirrors CON-§3.9.1). No non-recorded input
may influence the verdict.

**SEC-§5.3.4 — Dual-gate composition.** For any action that *mutates* the Model,
`authorize` establishes the *authority* gate only. The *correctness* gate is Document 006's
Verification. Both MUST return ALLOW/PASS for the mutation to be admitted; either failing
denies admission (CON-§3.5.1, §13.1.1). Neither gate may be skipped on the strength of the
other.

### 5.4 Capabilities

**SEC-§5.4.1** A **capability** names an action-class the Platform can perform. Capabilities
are declared, hierarchical, and closed: an action not covered by any declared capability is
un-grantable and therefore impossible to authorize (CON-§3.6.1, undeclared ⇒ forbidden).

**SEC-§5.4.2** Capabilities are partitioned by the layer whose actions they govern (read
Model, mutate Model, host Engine, admit Plugin, issue Grant, revoke Grant, read record,
amend governance). The concrete capability catalog is maintained as an appendix to this
document and versioned under Document 012; adding a capability is a Specification-class
decision (CON-§7.1.1).

**SEC-§5.4.3 — Meta-capabilities.** `issue_grant` and `revoke_grant` are themselves
capabilities and MUST themselves be granted (no ambient administrative power, CON-§3.4.1).
The capacity to grant is never intrinsic to a Role; it is a Grant like any other.

### 5.5 Attribution and the AuthzEvent

**SEC-§5.5.1** Every call to `authorize` MUST emit an immutable **AuthzEvent** carrying:
`principal`, `capability`, `target`, `verdict`, `governing_grant` (or `cause` on DENY),
`timestamp`, and a link to the resulting Model change if any. This discharges CON-§3.3.1
and §9.1.5. The event's persistence is Document 010's charter; its *content* is fixed here.

**SEC-§5.5.2 — Agent attribution.** For an Agent Principal, the AuthzEvent MUST additionally
carry the Agent identity and the Authority under which it acted, per CON-§8.3.2. An Agent
action that cannot be so attributed MUST be DENIED before execution (SEC-INV-6).

**SEC-§5.5.3 — No silent authorization.** There is no code path that mutates the Model
without a corresponding ALLOW AuthzEvent. An observed mutation lacking its AuthzEvent is a
defect of the highest severity (violates CON-§3.3.1) and MUST halt the affected operation
(fail closed).

### 5.6 Revocation

**SEC-§5.6.1** A Grant is revoked through its `revocation_ref`. Revocation is **forward-only
and immediate**: from the revocation instant, the Grant no longer resolves in §5.3.2 step 3
(SEC-INV-5). Revocation MUST NOT alter any prior AuthzEvent or any prior Model state
(CON-§3.7.1).

**SEC-§5.6.2** Revocation is itself an authorized, recorded action (requires the
`revoke_grant` capability, emits an AuthzEvent). There is no privileged out-of-band
revocation path (CON-§3.4.1).

**SEC-§5.6.3 — Cascade.** Revoking a Grant that was the issuer-authority for downstream
Grants MUST render those downstream Grants unresolvable from the same instant (delegation
cannot outlive its source, CON-§8.2.2). The cascade is recorded.

### 5.7 Reserved authority (constitutional passthrough)

**SEC-§5.7.1** The actions reserved to human authority by CON-§8.4.1 (ratify/freeze the
Constitution, alter a Part 3 invariant, grant the Board/Architect role) are represented as
capabilities that **MUST NOT** be included in any Grant whose `subject` resolves to an
Agent Principal. This is enforced at issue time (SEC-§5.2.3 extended): a Grant that would
convey a reserved capability to an Agent is rejected as malformed. This clause is as
immutable as its constitutional source.

### 5.8 Isolation boundary for extensions

**SEC-§5.8.1** A Plugin (Document 004) executes only within the scope of the Grants it
holds. The Plugin System derives its isolation guarantees from this model: a Plugin cannot
perform any action for which it lacks a resolving Grant (SEC-INV-1). 011 defines the
authority; 004 defines the sandbox that makes the authority the *only* channel of effect.

---

## 6. Threat Model (informative, bounded)

This section is explanatory (§0.1 of the Constitution) and constrains design without adding
new normative force beyond §§2–5. It records the adversaries this model is built to resist:

- **Over-broad Agent.** A capable Agent attempting actions beyond intent → contained by
  least-authority Grants (§5.2.2) and bounded scope (§5.2.4).
- **Confused deputy.** A component induced to act on another's behalf → contained because
  authority follows the *resolved Grant of the acting Principal*, not the caller (§5.3.2).
- **Privilege accumulation.** Delegation chains widening authority → impossible by
  §5.2.3/§5.6.3 (narrowing delegation, cascade revocation).
- **History rewriting.** Attempt to erase an action → impossible by SEC-INV-5 and
  CON-§3.7.1 (append-only record).
- **Ambient/administrative backdoor.** A special path bypassing grants → none exists by
  §5.4.3 and §5.6.2 (even administration is granted and recorded).

Threats *out of scope* for 011 and delegated elsewhere: correctness of changes (006);
durability/tamper-evidence of the record (010); supply-chain trust of Plugin code (004).

---

## 7. Future Evolution

**What MUST remain stable (decade-horizon):** the single-authorization-primitive shape
(§5.3.1), the Grant as the atomic unit of authority (§5.2), fail-closed default
(SEC-INV-6), forward-only revocation (SEC-INV-5), and dual-gate composition with
Verification (§5.3.4). Downstream documents build on these as fixed points.

**What is expected to evolve (additively, per CON-§4.7.1):** the capability catalog (§5.4.2,
grows by Specification-class RFC); condition predicate richness (§5.2.1); Role definitions
(§5.1.3); and delegation-chain tooling. Each addition arrives as new surface and old surface
is tombstoned, never silently changed (CON-§12.4.1).

**Anticipated pressures:** larger Agent populations will stress Grant-resolution latency —
future work MAY add caching *provided determinism (§5.3.3) and fail-closed (SEC-INV-6) are
preserved*; a cache miss or staleness MUST resolve to DENY, never provisional ALLOW.

---

## 8. Version History (append-only, CON-§3.7.1)

| Version | Date | Class | Summary |
|---|---|---|---|
| 0.1.0-draft | 2026-07-05 | — | Initial authored draft. Establishes Principals, the Grant, the single authorization primitive and its deterministic fail-closed resolution algorithm, capabilities and meta-capabilities, AuthzEvent attribution, forward-only revocation with cascade, reserved-authority passthrough, and extension isolation boundary. Six subsystem invariants (SEC-INV-1..6) derived from Constitution Parts 3, 8, 9. Awaiting freeze; conformant to Part 11. |

---

*End of Document 011. Derives from Document 000; depends on no subsystem. Depended upon by
001, 004, 006, 007, 008, 009, 010.*
