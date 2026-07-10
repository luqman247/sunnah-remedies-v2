# 06 · Interface & Motion Standards

**Implements:** DIOS‑§4.9 (agent and human equally), §4.10 (observability), §1.10
(reversibility), §3.6 (human gate on irreversible).
**Layer:** L5 Experience. **Depends on:** `00`, `01`, `07`, `08`.

> Every surface — graphical UI, command line, API, SDK, editorial tool — is a *binding over
> the same contracts*. There is no privileged back door. What the API cannot express, no
> surface can do. Motion serves comprehension, never spectacle.

## 1. Interface invariants

- **IF‑INV‑1 — One contract, many surfaces.** UI, CLI, API and SDK are thin bindings over
  the same governed contracts (Document 03). Feature parity is automatic; divergence is a
  defect.
- **IF‑INV‑2 — Irreversible actions are unmistakable.** Any surface that can trigger an
  irreversible action (publish, delete, deploy, migrate) MUST make that consequence explicit
  and MUST route it through the human gate (§3.6).
- **IF‑INV‑3 — Feedback for every action.** Every action produces observable feedback —
  success, progress, or a clear, actionable error (§4.10). Silence is never a valid outcome.

## 2. Interface surfaces

- **Graphical UI** composes Document 01 primitives; interaction patterns are predictable and
  consistent across products.
- **CLI / API / SDK** expose the same operations with structured, scriptable output (human
  and machine readable). Every call carries an actor identity and is authorised against
  capabilities (§3.4, Document 13).
- **Editorial surfaces** let non‑engineers edit content safely within the content/CMS
  boundary (§3.11) without touching implementation.

## 3. Motion standards

- **Purposeful only.** Motion communicates state, hierarchy, continuity or feedback. It never
  decorates.
- **Timing & easing are tokens** (Document 01), capped to keep interfaces responsive and calm
  (motion is brief, in the low hundreds of milliseconds by default). Consistent easing curves
  express the institution's measured character.
- **Motion hierarchy.** Primary transitions read first; secondary motion is subordinate and
  never competes.
- **Loading, scroll reveal, hover, page transitions, parallax and video** each have a defined,
  restrained pattern. Video and heavy motion respect performance budgets (Document 08).

## 4. Reduced motion & accessibility

The reduced‑motion contract is mandatory: when a user requests reduced motion, non‑essential
animation is removed and never merely slowed. Motion is never the sole carrier of meaning
(Document 07). Feedback remains fully available without animation.

### Related documents
`01` (tokens & primitives), `07` (reduced motion, focus, feedback accessibility), `08`
(motion/video budgets), `13` (authorised actions on every surface).

*Version 1.0.0.*
