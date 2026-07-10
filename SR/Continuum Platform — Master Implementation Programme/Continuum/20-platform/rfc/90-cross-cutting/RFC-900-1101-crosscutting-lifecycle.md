# RFC-900: Cross-Cutting — Security Model

**Status:** Approved · **Version:** 1.0.0 · **Implements:** INV-G-03, INV-G-05.

## 1. Threat model

Adversaries: a compromised/prompt-injected **agent**; a malicious **plugin**; a malicious **tenant** attempting cross-tenant access; a tampering **actor** trying to forge verification. The architecture defends each structurally, not procedurally.

## 2. Defences (each maps to an invariant)

| Threat | Structural defence | Invariant |
|---|---|---|
| Agent forges "it works" | out-of-process signed verification; keys unreachable | INV-VER-03, INV-ATT-01 |
| Agent takes injected instruction | `ingested` content never treated as instruction | INV-CTX-04 / INV-G-05 |
| Agent does irreversible harm | irreversible ⇒ human approval; least-privilege caps | INV-ATT-04, INV-AUTHZ-01 |
| Malicious plugin | sandbox + declared capabilities + signing | INV-ISO-01..03 |
| Cross-tenant access | partitioned log/graph; tenant check on every op | INV-G-03, INV-AC-01 |
| Tamper with evidence/history | content-addressing + signing + append-only | INV-EVD-01, INV-EVT-01 |
| Secret leakage | secrets by-handle, never in events/context/logs | INV-SEC-01 |

**INV-SECU-01:** every defence is structural (a boundary the adversary cannot cross), not a policy the adversary could be trusted to follow.

---

# RFC-901: Multi-Tenancy & Isolation

**Status:** Approved · **Version:** 1.0.0 · **Implements:** INV-G-03.

- **Partitioning:** the event log, graph, indexes, and evidence store are partitioned per tenant (`tenant/{tid}/...`). No cross-partition query.
- **Enforcement:** every operation carries a tenant-scoped session; the Runtime rejects any op whose target partition ≠ session tenant (INV-AC-01).
- **Shared knowledge exception:** the *only* cross-tenant data is the shared knowledge base (RFC-107), which is versioned, immutable-per-version, and public-to-inheritors — it contains no tenant data (curated patterns only, INV-TEL-02 guarantees no tenant data reaches it).
- **Noisy-neighbour:** per-tenant fair scheduling for verification sandboxes (RFC-402) and indexer queues (RFC-301); one tenant's load cannot starve another.
- **INV-TEN-01:** a tenant compromise is contained to that tenant's partition; blast radius never crosses.

---

# RFC-902: Observability

**Status:** Approved · **Version:** 1.0.0.

- **Metrics:** each subsystem exposes SLO metrics (RFC-904). Golden signals: hydration latency, index freshness lag, verification throughput/latency, transaction commit rate, upgrade success rate.
- **Tracing:** `correlation_id` threads a transaction across engines/verifiers/log for end-to-end traces.
- **Logging:** structured, tenant-tagged, secret-scrubbed (INV-SEC-01). Operational logs are distinct from the event log (which is truth, not telemetry).
- **INV-OBS-01:** every committed transaction is traceable end-to-end via its `correlation_id`.

---

# RFC-903: Disaster Recovery & Durability

**Status:** Approved · **Version:** 1.0.0.

- **The only critical asset is the event log** (+ evidence blobs). Everything else is rebuildable (INV-LOG-01).
- **Backup:** continuous log backup + periodic snapshots to independent storage.
- **RPO/RTO:** RPO bounded by log-backup lag (target near-zero via streaming replication); RTO bounded by projection rebuild from nearest snapshot.
- **Recovery drills:** the CTS includes a "rebuild-all-derived-state-from-log" test that MUST pass — proving derived stores are truly disposable.
- **INV-DR-01:** from the log + evidence blobs alone, the entire platform state (graph, indexes, audit) is reconstructable.

---

# RFC-904: Performance & Scale SLOs

**Status:** Approved · **Version:** 1.0.0.

Targets for the 10k-company / 100k-project / millions-of-executions scale (D-12/Phase 12):

| Metric | Target | Mechanism |
|---|---|---|
| Warm hydration | p95 < 50ms | cached projections, budget-bounded (RFC-303) |
| Cold hydration | p95 < 300ms | structural-first retrieval |
| Incremental index → fresh | p95 < 2s | incremental hashing (RFC-301) |
| Staleness window | p99 < 1s | reactive invalidation |
| False-fresh rate | **0** | source-pinning (INV-IDX-01) |
| Fast-gate verification (build/lint/type) | p95 < 60s | warm sandbox pools (RFC-402) |
| Transaction commit (post-attest) | p95 < 100ms | atomic append + async projection |
| Cross-partition scaling | linear | per-tenant sharding (INV-G-03) |

**INV-PERF-01:** hydration latency is independent of total platform size (bounded by budget + local graph neighbourhood, not global scale) — the property that makes 100k projects viable.

---

# RFC-1101: Project Lifecycle State Machine

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-29, Phase 11 · **Depends:** RFC-204.

## 1. States & entry gates

| State | Entry gate (MUST pass to enter) |
|---|---|
| `Attached` | valid Project Contract (RFC-100); baseline graph indexed (RFC-301) |
| `Specified` | every Requirement has verifiable acceptance criteria |
| `Planned` | plan graph acyclic (INV-PLN-01); risks recorded; significant decisions raised |
| `Building` | proposals reference a WorkItem + hydrated context |
| `Verifying` | signed attestation per obligation (RFC-102) |
| `Released` | release-gate attestation + required human approval (RFC-108, D-16) |
| `Maintaining` | same gates as Building/Verifying at maintenance grain |
| `Upgrading` | verified reversible upgrade transaction (RFC-801) |
| `Retired` | retirement Decision recorded |

## 2. Transition table (guards bracketed)

```
∅         --attach [valid contract + indexed]-->  Attached
Attached  --specify-->                            Specified
Attached  --(direct build for adopted repos)-->   Building
Specified --plan [acyclic]-->                      Planned
Planned   --build-->                               Building
Building  --submit-->                              Verifying
Verifying --pass-->                                Building (next work) | Released (if release txn)
Verifying --fail-->                                Building (with feedback)
Building  --release [release gate]-->              Released
Released  --maintain-->                            Maintaining
Maintaining --upgrade-->                           Upgrading
Upgrading --pass-->                                Maintaining
Upgrading --fail-->                                Maintaining (rolled back, INV-UPG-01)
any       --retire [decision]-->                   Retired
```

**INV-LC-01:** every transition is an event, gated, immutable. **INV-LC-02:** `Attach` is a first-class entry equal to greenfield generation (D-29) — the primary entry for the 95% brownfield market; generation is an *action available from any state*, not the birth event. **INV-LC-03:** archetypes/plugins may add states/gates but MUST NOT remove Core gates.

## 3. Why lifecycle is a state machine, not folders

The lifecycle lives in `runtime/txn` as enforced states, identical across all projects, because consistency of *process* is as important as consistency of *structure*. There is no lifecycle folder taxonomy anywhere in the system (the architecture's explicit rejection of documentation-as-structure).
