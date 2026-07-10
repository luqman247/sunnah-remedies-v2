# 07 · Accessibility & Legibility Standards

**Implements:** DIOS‑§4.9 (agent and human equally), §3.12 (one standard), §1.9 (boundaries),
§4.10 (observability).
**Layer:** L5 Experience. **Depends on:** `00`, `01`, `06`.

> Accessibility is not a later pass; it is a property of a design's validity. A surface that
> excludes a user is not "mostly done" — it is defective. Legibility extends to AI agents:
> a surface must be as parseable to a machine as it is usable to a person (§4.9).

## 1. Accessibility invariants

- **A11Y‑INV‑1 — WCAG is the floor.** Every surface meets the institution's adopted WCAG
  level (AA or better) before it can ship. Failing Document 07 disqualifies a design (§3.12).
- **A11Y‑INV‑2 — Never colour alone.** Meaning is never carried by colour alone; a second
  cue (text, icon, shape) always accompanies it.
- **A11Y‑INV‑3 — Operable without a mouse.** Every interactive element is reachable and
  operable by keyboard, with a visible focus state.

## 2. Structure & semantics

One H1 per page; logical, sequential heading order; semantic HTML for landmarks. Structure is
meaningful to assistive technology and to AI retrieval alike (Document 09). Tables have
proper headers; lists are real lists.

## 3. Navigation & interaction

Keyboard navigation is complete and predictable; focus is always visible and never trapped.
Screen‑reader support is verified, not assumed — interactive components expose correct roles,
names and states (ARIA used correctly, and only where native semantics fall short).

## 4. Forms

Every input has a programmatic label. Errors are announced, specific and actionable.
Validation guides rather than punishes. Required fields, formats and constraints are stated
before submission, not discovered after.

## 5. Content & perception

Sufficient colour contrast for text and meaningful non‑text (per adopted WCAG). Text resizes
without breaking layout. Alt text is present and descriptive for meaningful imagery, empty for
decorative. Reduced‑motion preferences are honoured (Document 06). Arabic and RTL content is
correctly ordered and shaped (Document 04).

## 6. Verification

Accessibility review is part of the mandatory gate (Document 02 §4, Document 14). It combines
automated checks with keyboard and screen‑reader verification. "WCAG review completed" is a
recorded evidence item, not a claim.

### Related documents
`01` (contrast tokens, type scale), `06` (reduced motion, focus, feedback), `04` (RTL/Arabic),
`09` (semantic structure for retrieval), `14` (the accessibility gate).

*Version 1.0.0.*
