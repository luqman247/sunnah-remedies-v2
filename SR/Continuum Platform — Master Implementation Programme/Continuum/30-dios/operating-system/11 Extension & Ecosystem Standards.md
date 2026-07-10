# 11 · Extension & Ecosystem Standards

**Implements:** DIOS‑§4.5 (small core, replaceable edges), §4.11 (evolve by addition), §3.4
(no ambient authority), §3.8 (bounded blast radius), §5 (boundaries).
**Layer:** L4 Extension. **Depends on:** `00`, `03`, `13`.

> Everything volatile — AI models, CMSs, clouds, CI, frameworks, payment and auth providers —
> churns on 2–5 year cycles. A ten‑year institution cannot hardcode any of them. **Everything
> volatile is a plugin over a stable contract; the core stays small.**

## 1. Extension invariants

- **EXT‑INV‑1 — Volatile at the edges.** Every external or replaceable capability lives behind
  a plugin contract (Document 03). The core owns only the stable contracts and the plugin
  host (§4.5).
- **EXT‑INV‑2 — Least‑privilege isolation.** A plugin runs sandboxed with only the
  capabilities it declares (network allowlist, which scopes, which side‑effects). A payments
  plugin cannot read the whole model; a verifier cannot reach the network (§3.4, §3.8).
- **EXT‑INV‑3 — No cross‑tenant, no cross‑product leakage.** A plugin cannot cross its declared
  boundary or its tenant. Capability violations are blocked and audited (Document 13).

## 2. Plugin categories

AI providers · content/CMS · payments · auth · deployment targets · testing/verification ·
monitoring · compliance regimes · search/index stores · knowledge packs · templates. Each
category is a Contract; each plugin implements exactly one.

## 3. Lifecycle & compatibility

`Discover → Register → Resolve (version + deps) → Isolate → Activate → (Hot‑upgrade |
Rollback) → Deactivate`. Registration validates a plugin against its category contract before
activation; unknown or unsigned plugins are rejected by policy. Plugins declare version
requirements; the host resolves a consistent set or refuses — conflicts surface at resolve
time, never at runtime.

## 4. Hot‑swap & the stability guarantee

Because plugins hold no authoritative state (state lives in the model), they hot‑swap and roll
back safely. A plugin written against contract version X keeps working for its published
support window. This is the promise that lets internal teams and third parties invest in
building on the institution. Contract‑breaking upgrades are handled as migrations (Document
03 §5) — reversible, verified, and never silently destructive (§4.11).

## 5. Third‑party ecosystem

A third party can, without forking the institution: add a verifier, a deployment target, a
template, a knowledge pack, or an alternate surface — all over stable contracts, all
sandboxed, all version‑negotiated. This is the ecosystem flywheel: the institution wins when
others safely build on it.

### Related documents
`03` (contracts plugins implement), `13` (isolation, capabilities, audit), `08` (edge plugins
and scale), `05` (knowledge packs), `12` (telemetry as a plugin category).

*Version 1.0.0.*
