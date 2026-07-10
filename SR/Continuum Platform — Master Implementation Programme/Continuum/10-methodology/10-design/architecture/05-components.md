# Architecture 05 — Components

## Purpose

Defines how UI components are structured, composed, and kept small and single-purpose.

## Scope

Everything under `components/`, including the fixed design-system primitives in `components/ui/`.

---

# Component Layers

1. **Primitives** (`components/ui/`) — the design system: buttons, cards, typography, layout. Fixed foundation.
2. **Composites** — feature components assembled from primitives (e.g. `CourseCard`, `BookingForm`).
3. **Sections** — page regions assembled from composites (e.g. `AcademyHero`).

Higher layers compose lower layers. Lower layers never depend on higher layers.

---

# Rules

- A component has one responsibility. If it renders and computes, split it.
- Server components fetch data; client components handle interactivity. Mark the boundary deliberately.
- No business logic in components — call a service from `lib/`.
- Prefer composition over configuration flags; three boolean props is a smell.
- Every interactive component is keyboard-navigable and labelled.

---

# The Design Language

The visual language sits between Aesop, Aman, Brunello Cucinelli, and Loro Piana: restraint, materiality, and quiet confidence. Deep clinical green (`#0A2B21`) is the anchor. Motion is capped (≤250ms). These are fixed foundations composed by feature work, never overridden.

---

# Anti-patterns

- A 400-line component doing fetching, business logic, and rendering (see `examples/bad/large-component.md`).
- Business logic mixed into presentation (see `examples/bad/mixed-business-logic.md`).

→ **Do this instead:** small primitives, composed upward, logic in `lib/`.

---

# Related Documents

- 04 Folder Structure
- Example — Good Component
- Coding Standards

## Document Metadata

**Document Type:** Architecture
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Every 6 months
