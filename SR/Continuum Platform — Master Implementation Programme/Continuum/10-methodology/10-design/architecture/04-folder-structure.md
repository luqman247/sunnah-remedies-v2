# Architecture 04 — Folder Structure

## Purpose

Defines the canonical folder structure of the production codebase, so that any engineer or AI agent can locate and place code predictably.

## Scope

The Next.js application repository (not this Engineering OS repository).

---

# Canonical Structure

```
app/                 # Next.js App Router routes
  (marketing)/       # Public marketing surfaces
  academy/           # Academy
  apothecary/        # Commerce
  api/               # Route handlers (the boundary)
components/          # Reusable presentation primitives
  ui/                # Design-system primitives (see below)
lib/                 # Business logic, services, integrations
  booking/
  search/
  cms/
sanity/              # Schemas and CMS configuration
  schemas/
styles/              # Tailwind config, tokens
```

---

# Placement Rules

- **Business logic never lives in `app/` or `components/`.** It lives in `lib/`.
- **Route handlers in `app/api/` are boundaries**: they validate and orchestrate, they do not contain rules.
- **`components/ui/` is the design system** and is composed, never altered, by feature work (see Principle: design-system primitives are fixed).
- **CMS schemas live only in `sanity/`.**

---

# The Fixed Design-System Foundation

The Phase 1 design-system primitives — including the five-typeface stack (Fraunces, Newsreader, IBM Plex Mono, Amiri, Reem Kufi) — are a fixed foundation. Later work composes these primitives; it never alters them. Changing a primitive is a design-system decision requiring explicit approval, not a feature-level choice.

---

# Related Documents

- 02 System Architecture
- 05 Components
- Naming Conventions

## Document Metadata

**Document Type:** Architecture
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Every 6 months
