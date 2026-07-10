# RFC-111: Event Contract

**Status:** Approved · **Version:** 1.0.0 · **Class:** Normative (foundational) · **Implements:** D-03, D-05
**Depended on by:** everything.

## 1. Purpose

Defines the append-only event envelope that is the sole authoritative write mechanism of the platform (INV-G-02). All state changes, everywhere, are events conforming to this contract.

## 2. Event envelope

| Field | Type | Req | Constraint | Description |
|---|---|---|---|---|
| `event_id` | ULID | ✔ | unique, time-ordered | Global identity |
| `seq` | uint64 | ✔ | monotonic **per partition** | Ordering authority; assigned by log on append |
| `partition` | string | ✔ | `tenant/{tid}/project/{pid}` | Isolation + ordering scope |
| `type` | string | ✔ | `Domain.PastTenseVerb` e.g. `Txn.Committed` | Event type; namespaced |
| `schema_version` | semver | ✔ | | Version of this event type's payload |
| `time` | rfc3339 | ✔ | UTC ms | Wall-clock (informational; ordering is `seq`) |
| `actor` | ActorRef | ✔ | | Who caused it (RFC-002) |
| `cause` | EventId? | ✔? | null only for genesis | Causal parent — the event/command that led here |
| `correlation_id` | ULID | ✔ | | Groups all events of one transaction/operation |
| `payload` | object | ✔ | matches `type`+`schema_version` | Type-specific body |
| `payload_hash` | sha256 | ✔ | over canonical payload | Integrity |
| `tenant_sig` | sig? | ✖ | | Optional tenant-scoped signature for high-assurance mode |

`ActorRef` = `{ kind: "human"|"agent", id, model?, model_version?, session_id }`.

## 3. Invariants

- **INV-EVT-01** Events are immutable. No update or delete operation exists. Correction is a new compensating event.
- **INV-EVT-02** `seq` is gap-free and strictly increasing within a partition; the log assigns it atomically on append.
- **INV-EVT-03** Every non-genesis event has a resolvable `cause`; the causal graph is acyclic.
- **INV-EVT-04** `payload_hash` MUST validate; a mismatched event is rejected at append and quarantined.
- **INV-EVT-05** An event's `partition` MUST match the caller's authorised tenant (INV-G-03).

## 4. Append semantics

`append(partition, expected_seq, event) → {seq}`:
- **Optimistic concurrency:** `expected_seq` is the caller's last-seen `seq` for the partition. If the current head ≠ `expected_seq`, append fails with `CONFLICT` (retriable after re-read). This gives serialisable ordering without global locks.
- Append is atomic and durable before ack (fsync/quorum per deployment).
- Batch append is all-or-nothing within a partition.

## 5. Canonical encoding (for hashing/signing)

Payloads MUST be canonicalised (sorted keys, no insignificant whitespace, normalised numbers, UTF-8 NFC) before hashing/signing so hashes are stable across implementations. The canonicalisation algorithm is specified in Appendix 111-A (deterministic JSON canonical form).

## 6. Event type registry

Event types are registered in `contracts/event/registry` with `{ type, schema_version, payload_schema, upcasters[] }`. Unregistered types are rejected. New payload fields MUST be additive within a major (RFC-800); breaking changes bump the type's major and add an upcaster.

## 7. Partitioning & ordering rationale

Ordering is per-partition (per project) because cross-project ordering is never required (cross-project truth flows only through versioned KnowledgeNodes, RFC-107). This makes the log embarrassingly shardable (INV-G-03, RFC-901) with no global sequencer bottleneck.

## 8. Failure modes

| Mode | Behaviour |
|---|---|
| append conflict | `CONFLICT`, retriable; caller re-reads head |
| hash mismatch | `INTEGRITY`, non-retriable; event quarantined; alert |
| partition unauthorised | `FORBIDDEN`, non-retriable |
| storage unavailable | `UNAVAILABLE`, retriable with backoff |

## 9. Test criteria

CTS asserts: immutability (no mutate API), gap-free monotonic `seq` under concurrent appenders, conflict on stale `expected_seq`, hash validation, causal acyclicity, and cross-tenant append rejection.
