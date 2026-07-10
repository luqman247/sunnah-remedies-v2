# Continuum Platform — P1: Design System & Primitives

> **Part of:** Continuum Platform Master Implementation Programme
>
> **Specification reference:** Spec Phase 1 (§19) and §5. Ships the immutable design tokens and component primitives. These primitives are frozen: later phases compose them, never alter them.
>
> **Duration:** 2 weeks · **Tier:** Foundation

Deliver the institutional design system as the single source of visual truth: tokens, three-layer components, Storybook, accessibility gates, and theming/dark mode. Frozen after this phase.

---

## Objectives

- Define the token schema (colour, typography, spacing, radius/elevation, motion, grid) per §5.1 as the sole source of visual truth.
- Build the three-layer component system: primitives → elements → patterns (§5.3).
- Stand up Storybook as the visual contract with a story per component.
- Enforce WCAG 2.2 AA via automated axe checks and add visual-regression to CI (§5.4).
- Implement theming (light/dark as token layers) and responsive behaviour.

## Deliverables

- packages/design-system: token definitions + theme layers.
- packages/ui: primitives, elements, and initial editorial patterns.
- A running Storybook (apps/storybook) with accessibility and usage notes per component.
- Visual-regression suite wired into CI.
- Design Guide populated (§18) and design-governance process live.

## Repository changes

- Add packages/design-system and packages/ui.
- Add apps/storybook.
- Add visual-regression tooling and an a11y check to CI gates.
- Add token-lint rule forbidding raw colour/size values in ui and apps.

## Folder structure

```
packages/
├── design-system/
│   ├── tokens/          # colour, type, spacing, radius, motion, grid
│   ├── themes/          # light / dark token layers
│   └── schema/          # token schema + validation
└── ui/
    ├── primitives/      # token-bound atoms (Box, Text, Stack)
    ├── elements/        # Button, Input, Card, Field, …
    └── patterns/        # Article, Product, Profile, Course layouts
apps/
└── storybook/          # visual contract + a11y notes
```

## Modules affected

- Design System (§5) — implemented as packages, not a bounded-context module
- Consumed later by CMS rendering, Commerce, Courses, Notifications templates

## Interfaces to implement

- tokens — typed accessors resolving to CSS variables; no raw values downstream.
- ui primitives/elements/patterns — the only components apps may use.
- theme — light/dark switching via token layers; respects prefers-color-scheme.

## External services

- Chromatic-class visual-regression service or self-hosted snapshot runner.
- No new runtime vendors.

## Environment variables

| Variable | Purpose | Required |
| --- | --- | --- |
| VISUAL_TEST_TOKEN | Auth for the visual-regression service (CI only). | CI only |
| STORYBOOK_BASE_URL | Deployed Storybook URL for reviewers. | no |

## Acceptance criteria

- Every component passes automated a11y (axe) and has a Storybook story.
- Tokens are the sole source of visual truth; the token-lint rule fails any raw colour/size in ui/apps.
- Light and dark themes both pass AA contrast.
- Visual-regression runs in CI and blocks unintended visual drift.
- Primitives are declared frozen and referenced as a stable contract by the Design Guide.

## Testing requirements

- Unit: token resolution, theme switching, component behaviour (keyboard, focus, ARIA).
- Accessibility: axe on every story; manual keyboard/focus audit for interactive elements.
- Visual-regression: baseline snapshots for all components in light and dark.

## Production readiness checklist

- [ ] a11y gate (axe) enforced on merge.
- [ ] Visual-regression gate enforced; baselines reviewed, not auto-approved.
- [ ] Storybook deployed as a reviewable preview.
- [ ] Token-lint rule active in CI.
- [ ] Design Guide published with governance process (ADR + story required for new patterns).

## Risks

| Risk | Description | Mitigation |
| --- | --- | --- |
| Token churn after freeze | Later phases pressure primitives to change, breaking the contract. | Freeze primitives; new needs are new compositions or additive tokens, gated by ADR. |
| Visual-regression noise | Flaky snapshots cause reviewers to rubber-stamp. | Stabilise rendering (fonts, animation off in tests); require human baseline approval. |
| Accessibility debt | Components pass axe but fail real assistive tech. | Add manual audit for key interactive patterns beyond automated checks. |

## Dependencies

- Phase 0 (monorepo, standards, CI gates).

## Documentation updates

- Publish the Design Guide (§18): tokens, components, editorial layout, accessibility, governance.
- ADR: token schema and the primitive-freeze decision.
- Update Developer Guide with 'building UI with tokens only' conventions.
- Update .cursor rules to reinforce token-only styling.

---

## Milestones & tasks

### Milestone 1.1 — Token schema & themes

**Objective.** Tokens exist as validated, typed truth with light/dark layers.

#### Task 1.1.1 — Define the token schema

- **Inputs:** Spec §5.1 token families and governance rules.
- **Outputs:** A validated schema covering colour, typography, spacing, radius/elevation, motion, grid.
- **Files created:** `packages/design-system/schema/`
- **Files modified:** —
- **Verification steps:**
  - Schema validates a sample token set.
  - Invalid tokens (e.g. failing contrast intent) are rejected.
- **Manual QA steps:**
  - Review the schema against §5.1 to confirm every token family is represented.

#### Task 1.1.2 — Author the base token set

- **Inputs:** Schema from 1.1.1; luxury principles (§5.5).
- **Outputs:** A default institutional token set anchored by one deep primary, resolving to CSS variables.
- **Files created:** `packages/design-system/tokens/`
- **Files modified:** —
- **Verification steps:**
  - Tokens resolve to CSS variables.
  - Modular type scale and 4-based spacing hold.
- **Manual QA steps:**
  - Render a token sheet and confirm rhythm and scale match the spec's intent.

#### Task 1.1.3 — Implement light/dark theme layers

- **Inputs:** Spec §5.4 theming via token layers.
- **Outputs:** Light and dark themes as token overrides; switch respects prefers-color-scheme.
- **Files created:** `packages/design-system/themes/`
- **Files modified:** `tokens index`
- **Verification steps:**
  - Both themes resolve.
  - Contrast passes AA in both.
- **Manual QA steps:**
  - Toggle themes in a sample view; confirm no hard-coded colours leak.

#### Task 1.1.4 — Add the token-lint rule

- **Inputs:** Spec §5.1 (feature code never uses raw values).
- **Outputs:** A lint rule failing any raw colour/size in packages/ui and apps.
- **Files created:** `standards/eslint token-lint rule`
- **Files modified:** `CI lint config`
- **Verification steps:**
  - A raw hex in ui is flagged.
  - Token usage passes.
- **Manual QA steps:**
  - Introduce a raw colour, confirm lint fails, then revert.

### Milestone 1.2 — Component primitives & elements

**Objective.** Build the frozen primitives and the element layer, accessible by construction.

#### Task 1.2.1 — Build layout primitives

- **Inputs:** Tokens; §5.3 three-layer architecture; §5.1 grid.
- **Outputs:** Box, Stack, Grid, Text primitives bound to tokens with the 12-column fluid grid and measure caps.
- **Files created:** `packages/ui/primitives/`
- **Files modified:** —
- **Verification steps:**
  - Primitives compose without raw values.
  - Line length caps at ~66ch for body.
- **Manual QA steps:**
  - Assemble a sample layout from primitives; confirm rhythm and measure hold across breakpoints.

#### Task 1.2.2 — Build form & action elements

- **Inputs:** Primitives; shadcn/ui owned-component model (§2.1, §5.3).
- **Outputs:** Button, Input, Field, Select, Checkbox with full keyboard/focus/ARIA contracts.
- **Files created:** `packages/ui/elements/`
- **Files modified:** `ui index`
- **Verification steps:**
  - Each element passes axe.
  - Keyboard and focus order are correct.
- **Manual QA steps:**
  - Keyboard-only walkthrough of each element; confirm focus visibility and ARIA roles.

#### Task 1.2.3 — Build content & container elements

- **Inputs:** Primitives; §5.2 editorial layout.
- **Outputs:** Card, Dialog, Tabs, Accordion, Table with accessible semantics.
- **Files created:** `packages/ui/elements/ (additions)`
- **Files modified:** `ui index`
- **Verification steps:**
  - Elements pass axe.
  - Dialog traps focus and restores it on close.
- **Manual QA steps:**
  - Open/close dialog with keyboard; confirm focus trap and return.

### Milestone 1.3 — Editorial patterns

**Objective.** Compose reusable institutional layouts from elements.

#### Task 1.3.1 — Build the Article pattern

- **Inputs:** Elements; §5.2 measure/rhythm/hierarchy.
- **Outputs:** An Article layout (headline, deck, body, media, references) with editorial typography.
- **Files created:** `packages/ui/patterns/article/`
- **Files modified:** `ui index`
- **Verification steps:**
  - Renders long-form content with correct hierarchy.
  - Passes a11y and visual-regression baseline.
- **Manual QA steps:**
  - Drop sample article content; confirm heading steps and measure read well.

#### Task 1.3.2 — Build Product / Profile / Course patterns

- **Inputs:** Elements; content types (§6.1) these patterns will render.
- **Outputs:** Product, Person/Profile, and Course layout patterns as composition-only.
- **Files created:** `packages/ui/patterns/{product,profile,course}/`
- **Files modified:** `ui index`
- **Verification steps:**
  - Each pattern composes from elements with no raw values.
  - Baselines captured.
- **Manual QA steps:**
  - Render each with placeholder data; confirm consistency with the Article pattern's rhythm.

### Milestone 1.4 — Storybook, a11y & visual-regression

**Objective.** Make the visual contract enforceable in CI.

#### Task 1.4.1 — Stand up Storybook with stories for all components

- **Inputs:** ui packages; §15 Storybook as the visual contract.
- **Outputs:** apps/storybook renders a story per primitive/element/pattern with usage + a11y notes.
- **Files created:** `apps/storybook/`
- **Files modified:** `workspace config`
- **Verification steps:**
  - Every component has a story.
  - Storybook builds and deploys as a preview.
- **Manual QA steps:**
  - Browse Storybook; confirm each component documents usage and accessibility notes.

#### Task 1.4.2 — Wire automated accessibility checks

- **Inputs:** Spec §5.4 (axe as a merge gate).
- **Outputs:** axe runs against every story; violations fail CI.
- **Files created:** `a11y test config`
- **Files modified:** `.github/workflows/ci.yml`
- **Verification steps:**
  - A seeded a11y violation fails CI.
  - Clean components pass.
- **Manual QA steps:**
  - Introduce a contrast violation in a story; confirm the gate blocks merge; revert.

#### Task 1.4.3 — Add visual-regression to CI

- **Inputs:** Spec §5.5 (headless rendering verifies no drift).
- **Outputs:** Baseline snapshots for all components (light+dark); drift blocks merge pending human approval.
- **Files created:** `visual-regression config + baselines`
- **Files modified:** `.github/workflows/ci.yml`
- **Verification steps:**
  - An intentional visual change is flagged.
  - Approved baselines update deliberately.
- **Manual QA steps:**
  - Nudge a component's spacing; confirm the diff is caught and requires approval.

#### Task 1.4.4 — Publish the Design Guide and freeze primitives

- **Inputs:** Spec §5.5 design governance; §19 primitive-freeze constraint.
- **Outputs:** Design Guide published; primitives declared frozen; new-pattern process (ADR + story) documented.
- **Files created:** —
- **Files modified:** `docs/guides/design.md`, `docs/adr/ (freeze decision)`
- **Verification steps:**
  - Guide covers tokens, components, layout, a11y, governance.
  - Freeze decision recorded as ADR.
- **Manual QA steps:**
  - Confirm the guide's governance section matches §5.5 and references the visual-regression loop.

