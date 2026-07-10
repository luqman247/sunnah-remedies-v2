# RFC-800: Versioning & Compatibility

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-26, D-27 · **Depends:** RFC-109.

## 1. Three versioned axes

- **Contracts** (RFC-100..111): the constitution.
- **Runtime**: the control-plane implementation.
- **Plugins / Knowledge packs / Templates**: the ecosystem.

All SemVer. A project pins all three (RFC-100). Compatibility is declared, resolved, and enforced (RFC-702).

## 2. Additive-within-major rule

**INV-VER-G-01:** within a contract major, changes are additive — new fields, new node/edge kinds, new event types, new evidence types. A consumer pinned to major N never breaks on N.x. Breaking changes bump major and REQUIRE a migration (RFC-109).

## 3. Upcasters (schema evolution over a decade)

Every event/contract type registers upcasters that lift older payloads to the current schema at projection time (RFC-111 §6). **INV-VER-G-02:** any historical event, however old, is readable via its upcaster chain — ten-year-old history stays replayable. Upcasters are pure, tested functions; the chain is versioned.

## 4. Support windows

Each contract major declares a support window (e.g. current + previous major). Components outside the window are rejected at load (fail closed). This bounds the compatibility matrix so it can't grow without limit over a decade.

---

# RFC-801: Inheritance & Three-Way Merge

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-25 · **THE HARDEST SUBSYSTEM.**

> Every config-inheritance system in history bleeds here. Specified with maximum rigor.

## 1. The classification foundation (recap of RFC-100 §3)

Every inheritable element is `inherited` | `overridden` | `owned`. Upgrade behaviour is decided *by classification*, which is why classification is mandatory and validated (INV-PROJ-01).

## 2. Upgrade algorithm (normative)

Given a project at upstream versions `V_old` upgrading to `V_new`:

```
1. SNAPSHOT the project graph (RFC-802). (INV-MIG-01)
2. Compute upstream delta: what changed between V_old and V_new (per element).
3. Partition elements by classification:
   a. inherited  → apply V_new directly (no conflict possible — project didn't diverge).
   b. owned      → do not touch, EXCEPT required codemods for contract-breaking changes (§6).
   c. overridden → THREE-WAY MERGE (§3).
4. Apply all changes into a WORKSPACE (not committed).
5. Run the FULL verification gate set on the upgraded workspace (RFC-401 all classes).
6. pass → commit as one migration transaction; emit UpgradeCompleted + semantic diff artifact.
   fail → rollback to snapshot; emit UpgradeFailed with evidence; project UNTOUCHED.
```

**INV-UPG-01:** an upgrade that fails verification leaves the project byte-identical to pre-upgrade (snapshot restore). No partial upgrades.

## 3. Three-way semantic merge (for `overridden` elements)

Inputs: `base` = V_old upstream element, `theirs` = V_new upstream element, `mine` = project override.

Because elements are **typed graph nodes / structured contracts**, not text, the merge is **semantic**, per element type:

- **Conventions/Decisions/Config:** field-level merge. If `theirs` changed a field `mine` didn't touch → take `theirs`. If both changed the same field → **conflict** (surface to human as a decision, with both values + rationale). If `mine` changed, `theirs` didn't → keep `mine`.
- **Structural (modules/boundaries):** merge by stable node identity (RFC-301 §4); additions from `theirs` added; `mine` removals respected; genuine structural conflicts surfaced.
- **Gates/thresholds:** if `theirs` *tightened* a gate `mine` had loosened → surface as a decision (upstream raised the bar); Core minimums always win (RFC-401 INV-OBL-02).

**INV-UPG-02:** semantic merge produces either a clean result or an explicit, typed conflict — never a silent overwrite of `mine`. **INV-UPG-03:** conflict rate is strictly lower than textual merge would produce (semantic equivalence recognised).

## 4. Conflict resolution

Unresolved conflicts halt the upgrade in a `conflicts-pending` state; each conflict is presented as a structured decision (what upstream wants, what you have, why they differ). Resolution is recorded as a Decision node (RFC-106) — so the *reasoning* is captured, not just the outcome. Only when all conflicts resolve does the upgrade proceed to verification (§2.5).

## 5. Diff artifact

Every upgrade produces a **semantic diff**: which decisions/contracts/conventions/gates changed and why, reviewable as a PR-like artifact before acceptance. This is how a human approves an upgrade with understanding, not blind trust.

## 6. Codemods (contract-breaking changes to `owned` code)

When a contract major bump requires changes to project-owned code (e.g. an API contract renamed a required field), the migration ships a **codemod**: a deterministic transformation applied to owned code as a *proposed, verified* transaction. **INV-UPG-04:** codemods are proposals gated by full verification like any change — a codemod that breaks the build fails and rolls back. Codemods never silently rewrite owned code without verification.

## 7. Fork (the escape hatch)

A project may convert an `inherited`/`overridden` element to `owned` (fork), permanently diverging. **INV-UPG-05:** forking is an explicit recorded Decision documenting the forgone-upgrade cost. Forked elements no longer receive upstream changes; the cost is visible, not hidden.

## 8. Test criteria

CTS asserts: clean upgrade of pure-inherited (no conflicts), correct three-way merge outcomes (all six cases in §3), no-silent-overwrite of overrides, failed-verification full rollback (INV-UPG-01), codemod-under-verification, and fork cost recording.

---

# RFC-802: Snapshots, History, Branching

**Status:** Approved · **Version:** 1.0.0 · **Implements:** 3.18.

## 1. Snapshots

A snapshot is a named, immutable marker at a log `seq` + a materialised graph state, enabling O(1)-restore and bounded projection rebuild. Created before every upgrade/release (INV-MIG-01, INV-REL-02) and on demand.

**INV-SNAP-01:** a snapshot is fully reproducible from the log up to its `seq` (consistency); restore is deterministic.

## 2. History & time-travel

The event log gives free time-travel: reconstruct the graph at any past `seq`. Node/edge versioning (RFC-101) gives per-entity history. Queries can target a historical watermark (RFC-305).

## 3. Branching & merge

A project may branch its graph (spike/experiment) as a copy-on-write overlay on the log from a snapshot. Branch merges reuse the RFC-801 semantic three-way merge machinery (base = branch point). **INV-BR-01:** branching never mutates the parent; merge back is a verified transaction. This is why RFC-801's merge engine is the most-reused component in the platform (upgrades AND branch merges AND graph merges share it).

## 4. Recovery

- corrupted projection → rebuild from log (bounded by nearest snapshot).
- bad migration → rollback to pre-migration snapshot (INV-UPG-01).
- catastrophic → restore log from backup (the only backed-up-critical asset), rebuild all derived state.
