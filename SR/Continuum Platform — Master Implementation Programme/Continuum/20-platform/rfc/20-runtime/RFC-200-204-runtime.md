# RFC-200: Event Log & Storage

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-03 · **Depends:** RFC-111.

## 1. Responsibilities

Durable, ordered, partitioned append-only storage of events; the only authoritative write path. Serves reads for projection building and replay.

## 2. Interface

- `append(partition, expected_seq, events[]) → {head_seq}` — atomic, optimistic-concurrency (RFC-111 §4).
- `read(partition, from_seq, limit) → events[]` — ordered replay.
- `subscribe(partition|tenant, from_seq) → stream` — live tail for projections/clients.
- `snapshot_marker(partition, seq)` — record a snapshot boundary (RFC-802).

## 3. Storage model

- **Local mode:** embedded ordered log (e.g. an embedded LSM/SQLite-class store) — single-tenant daemon.
- **Cloud mode:** partitioned durable log (per-tenant/project partition) with quorum durability; object storage for evidence blobs.
- The *interface* is identical across modes; the store is a plugin (RFC-704 `graph-store`/`log-store` categories). Engines/clients never see the difference.

## 4. Durability & consistency

- Append is durable before ack (INV-EVT: fsync or quorum).
- Within a partition: **serialisable** via `expected_seq`.
- Across partitions: **no ordering guarantee** (none required, RFC-111 §7).
- **INV-LOG-01** The log is the sole source of truth; all else is rebuildable from it.

## 5. Retention & compaction

Events are retained indefinitely by default (audit). Compaction is *snapshot-based*: a snapshot (RFC-802) lets old events be archived to cold storage while the snapshot serves as the replay floor. Compaction MUST NOT lose the ability to reproduce any named snapshot or satisfy the retention/audit policy.

## 6. Failure & recovery

Corrupted projection → rebuild from log. Lost projection store → rebuild. Lost log → restore from backup (the log is the only backed-up-critical asset). Partial append → atomic, so either fully applied or not.

---

# RFC-201: Projections (Read Models)

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-03, CQRS.

## 1. Responsibilities

Derive fast-read state (Context Graph RFC-300, and specialised read models: changelog, health, audit views) by subscribing to the log. Projections are disposable and rebuildable.

## 2. Model

Each projection = `{ name, version, subscribed_types[], apply(event, state)→state, checkpoint_seq }`.
- Projections consume events in `seq` order per partition.
- `checkpoint_seq` records progress; on restart, resume from checkpoint.
- **INV-PRJ-01** Projections are pure functions of the event stream: rebuilding from `seq=0` MUST yield identical state (deterministic replay). This forbids wall-clock or external reads inside `apply`.

## 3. Consistency

Projections are **eventually consistent** with the log (bounded lag). Reads expose a `watermark` (last applied `seq`) so a client can require read-your-writes by waiting for `watermark ≥ its last append seq`. The Context API (RFC-303) exposes this.

## 4. Rebuild & versioning

A projection schema change bumps its version and triggers a background rebuild into a new store, atomically swapped when caught up (zero-downtime). Rebuild cost is bounded by snapshotting (RFC-802).

---

# RFC-202: Access Control & Tenancy (Runtime side)

**Status:** Approved · **Version:** 1.0.0 · **Implements:** INV-G-03. **See:** RFC-901.

## 1. Model

- Every request carries an **actor session** with a **capability set** (RFC-602).
- Every operation declares required capabilities + target partition.
- The Runtime enforces: `authorised = caps ⊇ required ∧ session.tenant == target.tenant`.
- **INV-AC-01** No operation executes without capability + tenant match; failure = `FORBIDDEN`, audited.
- Capabilities are **least-privilege**; irreversible-action capabilities are human-held by default (D-16).

## 2. Node-level ACL

Sensitive nodes (secrets, restricted decisions) carry `acl` (RFC-101). Hydration filters nodes the actor's capabilities don't permit — an agent receives capability-scoped context (INV-CTX ACL).

---

# RFC-203: Runtime Lifecycle & Deployment Modes

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-01.

## 1. Modes

- **Embedded daemon** (local, single-tenant): the full control plane in-process/on-machine; embedded log+graph; local IPC API (RFC-601).
- **Hosted control plane** (multi-tenant): partitioned durable storage; REST+gRPC API; sandbox pool for verification (RFC-402).

Same code, same contracts, deployment-mode config only (D-01 risk mitigation). Migration local→cloud is an export/import of the event log (the only critical asset).

## 2. Runtime lifecycle

`Boot → LoadContracts → ResolvePlugins → StartProjections(catch-up) → Ready → Serving → Draining → Stopped`. Not `Ready` until projections are caught up to head and plugins resolved. Draining finishes in-flight transactions or rolls them back cleanly.

---

# RFC-204: Transaction State Machine

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-04 · **Depends:** RFC-102, RFC-400.
The single most important behavioural spec: how change is admitted.

## 1. Transaction shape

`{ txn_id, correlation_id, actor, change_class, workspace_ref, proposed_delta, obligations[], attestations[], state }`.

## 2. States & transitions

| State | Meaning |
|---|---|
| `Proposed` | actor submitted a change; workspace created |
| `Obligated` | obligations derived (RFC-401) |
| `Verifying` | verifiers dispatched to sandboxes |
| `Attested` | signed attestation received |
| `Committed` | events appended, graph updated (terminal, success) |
| `RolledBack` | reverted; failure recorded (terminal) |
| `Approving` | awaiting required human approval |

Transition table (guards in brackets):

```
Proposed   --derive-->                 Obligated
Obligated  --dispatch-->               Verifying
Verifying  --attestation.pass [no human req]--> Attested
Verifying  --attestation.pass [human req]-->    Approving
Verifying  --attestation.fail-->               RolledBack
Approving  --approved-->                        Attested
Approving  --rejected|timeout-->               RolledBack
Attested   --commit [workspace_hash matches]--> Committed
Attested   --commit [hash mismatch]-->          RolledBack   (guard failure = tamper/stale)
any        --error|cancel-->                    RolledBack
```

**INV-TXN-01** No path reaches `Committed` except through a `pass` attestation whose evidence `workspace_hash` matches the workspace being committed (INV-G-01, INV-VER-05).
**INV-TXN-02** `Committed` and `RolledBack` are terminal; a transaction is single-use.
**INV-TXN-03** Commit is atomic: all events of the transaction append under one `correlation_id`, all-or-nothing.
**INV-TXN-04** Every terminal state emits an event (`Txn.Committed`/`Txn.RolledBack`) with the deciding attestation/failure referenced.

## 3. Commit protocol

1. Validate attestation signature + `workspace_hash` match (guard).
2. Append transaction's events atomically (`Txn.Committed`, plus domain events + write-back deltas) with optimistic concurrency on each affected partition.
3. On append `CONFLICT` (concurrent commit moved head): re-validate the delta against new head; if still valid, retry; if the delta now conflicts semantically, roll back with `CONFLICT` surfaced to actor.
4. Projections apply asynchronously; the txn API returns `Committed` with the `watermark` needed for read-your-writes.

## 4. Concurrency & isolation

Transactions on the same partition serialise at commit via `expected_seq`. Concurrent transactions on disjoint nodes proceed in parallel and both commit if their appends don't conflict. Conflicting concurrent commits: first wins, second re-validates or rolls back (optimistic, no locks).

## 5. Reconciliation (Kubernetes-style)

The Runtime holds `desired` (accepted plan/WorkItems) and `actual` (committed reality). A reconciliation loop surfaces divergence (planned-but-unbuilt, built-but-unverified) as findings (Quality Engine RFC-509), driving `actual → desired` via new transactions. This makes execution asynchronous and self-healing rather than a blocking RPC.

## 6. Failure modes & recovery

| Mode | Behaviour |
|---|---|
| verifier crash | obligation `inconclusive` → treated as fail (fail closed); retriable txn |
| sandbox timeout | fail; recorded; retriable |
| commit conflict | re-validate/retry or roll back with `CONFLICT` |
| runtime crash mid-commit | append is atomic → on restart, txn is either Committed (append landed) or not (safe to roll back); no partial truth |
| approval timeout | RolledBack |

## 7. Test criteria

CTS asserts INV-TXN-01..04 under: concurrent conflicting commits, injected tamper (mismatched workspace_hash → must roll back), verifier crash (fail closed), and crash-during-commit (recovery yields consistent terminal state).
