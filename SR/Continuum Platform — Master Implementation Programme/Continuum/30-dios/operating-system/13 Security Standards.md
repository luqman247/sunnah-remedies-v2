# 13 · Security Standards

**Implements (and MUST NOT weaken):** DIOS‑§3.3 (traceability), §3.4 (no ambient authority),
§3.6 (human gate), §3.7 (append‑only record), §3.8 (bounded blast radius), §3.9 (determinism),
§3.10 (fail closed), Part 9 (authority model).
**Layer:** L0 Governance. **Depends on:** `00`. **Depended on by:** every product and
document that mutates the model.

> Security is the concrete implementation of the institution's authority model. Its axioms:
> **no ambient authority, least privilege, fail closed, and a human at the gate of the
> irreversible.** Authority is always a grant — explicit, scoped, revocable — never a
> possession.

## 1. Security invariants

- **SEC‑INV‑1 — Every action authorised.** No code path mutates the model without a resolved,
  attributable authorisation. A silent mutation is a defect of the highest severity (§3.3).
- **SEC‑INV‑2 — Dual gate on mutation.** For any change to the model, **both** authorisation
  **and** verification MUST pass. Either failing denies the change (§3.5, §3.10).
- **SEC‑INV‑3 — Fail closed.** Missing authority, ambiguity, or unavailable verification
  resolves to DENY. A cache miss or staleness never resolves to a provisional ALLOW (§3.10).
- **SEC‑INV‑4 — Reserved actions.** Actions reserved to humans (§8.4) are never included in
  any grant that resolves to an agent, enforced at issue time.

## 2. Identity & authentication

Every Participant — human or agent — has a stable, unforgeable identity; agents carry a model
and version. Authentication is pluggable (local identity in development; SSO/OIDC in
production) but the requirement is invariant: **there are no anonymous mutations.**

## 3. Authority & authorisation (the grant model)

Authorisation is capability‑based and implements Part 9:

- A **Grant** is the atomic unit of authority: `subject, capability, scope, condition,
  issuer, revocation‑ref`. It conveys the **least** capability sufficient (§9.2) over a
  **statically bounded** scope (§9.4, §3.8).
- **No self‑widening.** An issuer MUST NOT grant a capability or scope broader than it holds
  (§8.2). Delegation narrows; it never widens.
- **One authorisation primitive.** A single `authorize(principal, action, target) → Decision`
  governs every surface. Given identical inputs and grant state, it returns an identical
  decision (§3.9).
- **Meta‑capabilities** (`issue_grant`, `revoke_grant`) are themselves granted — there is no
  ambient administrative power (§3.4).

## 4. Attribution & audit

Every authorisation decision emits an immutable audit event carrying grant reference,
principal, action, target bound and decision. Agent decisions additionally record the model
and version. The audit trail is append‑only (§3.7) and queryable under appropriate authority —
a regulated buyer can prove exactly how any change was authorised and verified.

## 5. Revocation

Revocation is **forward‑only**: it takes effect from the revocation instant onward and never
rewrites past decisions or state (§9.3). Revoking a grant that issued downstream grants renders
those downstream grants unresolvable from the same instant (delegation cascade).

## 6. Isolation

Plugins and untrusted code execute only within their granted scope, sandboxed with a declared
capability set (Document 11). Verification runs in ephemeral, network‑restricted sandboxes the
proposing party cannot influence, holding signing keys that party can never reach. Blast radius
is contained by construction (§3.8).

## 7. Data protection & privacy

- **Secrets** live in environment/secret stores, never in Git; tokens are protected; inputs
  validated and outputs sanitised (from the Security Checklist).
- **Personal and clinical data** receive heightened protection: minimal collection, explicit
  lawful basis, encryption in transit and at rest, strict access control, and honoured data
  subject rights (GDPR and equivalent). Clinical claims and health data are treated with the
  same integrity discipline as scholarly sourcing (Document 04).
- **Consent‑bounded telemetry** (Document 12).

## 8. Prompt‑injection & untrusted content

Ingested and inherited content is marked **untrusted data**; the institution distinguishes
*instructions* (only from authenticated actors under granted authority) from *content*
(everything ingested). An agent never treats untrusted content as authority (Document 10).

### Related documents
`00` Part 9 (authority model this implements), `11` (plugin isolation), `10` (agent
identity & injection defence), `12` (consent), `14`/`15` (security gates).

*Version 1.0.0.*
