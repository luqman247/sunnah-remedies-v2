# RFC-400: Verification Runtime Subsystem

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-13..D-17 · **Depends:** RFC-102, RFC-204.

## 1. Responsibilities

Independently prove or refute proposed changes, producing signed evidence and attestations that gate transaction commits. Runs **out-of-process** relative to the proposing actor (INV-G-01). The trust boundary of the entire platform.

## 2. Composition

```
Verification Runtime
├── obligation deriver   (RFC-401)
├── sandbox pool         (RFC-402 — isolated execution)
├── evidence store+signer(RFC-403 — content-address + sign)
├── attestation authority(RFC-404 — verdict + confidence + signature)
└── audit projection     (RFC-405/audit — immutable trail)
```

## 3. Flow (normative)

`Obligated → dispatch verifiers to sandboxes → collect evidence → sign → attest → return`. Called by the Transaction machine (RFC-204 §2). The Verification Runtime never mutates project state; it only produces attestations the Runtime acts on.

**INV-VRT-01** The Verification Runtime holds signing keys the proposing actor cannot access (D-14). **INV-VRT-02** Verifiers receive only the workspace diff + declared inputs — never the ability to write project state or reach the attestation signer.

---

# RFC-401: Obligation Derivation

**Status:** Approved · **Version:** 1.0.0.

## 1. Interface

`derive(transaction, project_conventions, lifecycle_gate, contract_version) → Obligation` (RFC-102 §2).

## 2. Rules

Obligations are computed by a deterministic rule set keyed on `change_class`:

| change_class | required (blocking) | additional | human approval |
|---|---|---|---|
| `docs` | — (doc views are projections; validated for link/ref integrity) | — | no |
| `code` | build, typecheck, lint, test | diff, security | no |
| `schema` | build, typecheck, test, **migration-safety** | diff | if data-affecting |
| `api` | build, test, **contract-compat** | diff, security | if breaking |
| `deploy` | deploy_health, smoke | security | **yes** (irreversible, D-16) |
| `dependency` | build, test, **security(CVE)** | — | if high blast-radius |
| `config` | schema-validate, dry-run | — | if security/permission-affecting |

**INV-OBL-01** Derivation is deterministic (INV-VER-01). **INV-OBL-02** A project MAY add obligations or tighten thresholds but MUST NOT drop Core-mandated blocking evidence below the contract minimum (RFC-102 §5).

## 3. Extensibility

New change classes and evidence requirements are additive via a new Verification Contract version; obligations reference the contract version that derived them for auditability.

---

# RFC-402: Sandbox & Isolation

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-15, D-23.

## 1. Model

Each verification runs in an **ephemeral, single-use, network-restricted sandbox**:
- fresh environment per obligation; destroyed after evidence capture.
- filesystem = the proposed workspace (diff applied over a base snapshot), read-mostly.
- network = deny-by-default; allowlist only what the verifier plugin declared (RFC-104 capabilities).
- no access to: other tenants, secrets beyond declared scope, the attestation signer, the event log write path.

**INV-SBX-01** A sandbox cannot mutate project state or reach the signer (isolation is the tamper barrier). **INV-SBX-02** Sandboxes are single-use; reuse across transactions is forbidden (no state bleed). **INV-SBX-03** Sandbox network egress is default-deny; undeclared egress is blocked and audited.

## 2. Scaling

Sandboxes are the platform's primary compute cost and bottleneck. Design:
- **Pooled + warm** base images per (language, toolchain) to amortise startup.
- **Sharded per tenant**; a tenant's verification load cannot starve another's (fair scheduling).
- **Poolable & preemptible**; long verifications (e2e, deploy) scheduled separately from fast ones (build/lint) so quick gates aren't blocked.

## 3. Isolation classes

Risk-tiered: `container` (default for arbitrary code execution), `microvm` (untrusted/high-assurance), `wasm` (pure analyzers). The class is chosen by the verifier's declared risk (RFC-104 `isolation_class`).

## 4. Failure modes

Sandbox crash/timeout → evidence `inconclusive` → obligation fails closed (RFC-204). Resource-exhaustion → fair-scheduler backpressure, retriable. Escape attempt (undeclared syscall/egress) → kill + audit + quarantine plugin.

---

# RFC-403: Evidence Store & Signing

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-14.

## 1. Storage

Evidence artifacts (logs, screenshots, reports) are **content-addressed** blobs in object storage; the Evidence node (RFC-102 §3) references them by `sha256`. Immutable; identical artifacts dedupe.

## 2. Signing

On evidence capture, the Verification Runtime canonicalises the evidence record (RFC-111 §5 canonical form) and signs it with a **verifier key** held inside the isolation boundary (cloud: HSM/KMS; local: OS keystore). The signature binds `(workspace_hash, obligation_id, verifier_identity+version, produced_at, artifact_hashes)`.

**INV-EVD-01** An evidence record whose signature or content hash fails validation is rejected (never attested). **INV-EVD-02** The signing key is unreachable from sandboxes and proposing actors (INV-VRT-01). **INV-EVD-03** `workspace_hash` in evidence MUST equal the workspace being verified; mismatch = reject (prevents replaying old evidence).

## 3. Key management & rotation

Verifier keys rotate on a schedule; attestations record the key id used; old keys retained for audit verification. Compromise → revoke key id, invalidate attestations signed by it in the affected window (audit trail supports scoped revocation).

---

# RFC-404: Attestation Authority

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-16, D-17.

## 1. Interface

`attest(transaction_id, obligation, evidence[]) → Attestation` (RFC-102 §4).

## 2. Aggregation (normative)

```
1. Verify each evidence signature + content hash + workspace_hash match. Reject any invalid.
2. For each blocking EvidenceReq: require a matching evidence with result=pass.
   Missing/failed blocking → verdict=fail.
3. aggregate_confidence = policy_combine(evidence.confidence...)  (e.g. min of blocking,
   weighted by req). Compare to obligation.confidence_threshold.
4. If human_approval required (D-16): verdict cannot be `pass` until approval(s) present.
5. Sign the attestation with the attestation key.
```

**INV-ATT-01** `pass` requires: all blocking evidence pass, aggregate_confidence ≥ threshold, all required approvals present (INV-VER-04). **INV-ATT-02** Attestation is signed; the Transaction machine validates the signature before commit (INV-TXN-01). **INV-ATT-03** Low-confidence pass on high-blast-radius change escalates to human approval (D-17 ↔ D-16 linkage).

## 3. Approval workflow

An approval is itself signed evidence: `{ approver_identity, on_evidence[], decision, time, signature }`. Recorded as an `Approval` node linked to the attestation (RFC-102). **INV-ATT-04** Irreversible change classes cannot `pass` on machine evidence alone.

## 4. Retry & failure feedback

A `fail` attestation returns **structured** feedback: which obligation, which evidence failed, what threshold, with artifact refs — consumable by the agent for an informed retry (RFC-204 §6). Retries are new transactions linked to the failure; bounded by policy to prevent loops; repeated failure escalates to human.

---

# RFC-405: Audit Trail

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-13/4.13.

Every obligation, evidence bundle, attestation, approval, and failure is an immutable event, projected into a queryable **audit view** linked in the graph. Query: "show the complete verification provenance of change X" → obligations → evidence (with artifacts) → attestation → approvals, all signed, all time-ordered.

**INV-AUD-01** The audit trail is append-only and complete: no committed change lacks a full verification provenance chain. **INV-AUD-02** Audit queries are tenant-scoped (INV-G-03). This is a first-class commercial/compliance feature (SOC2/regulated-domain assurance), not an add-on.
