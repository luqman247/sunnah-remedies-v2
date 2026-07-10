# 02 — Design System

## Design Principles

### 1. Institutional, Not Commercial

Every design decision reinforces that this is an institution — not a brand, not a shop, not a startup. The design language draws from university presses, medical institutions, scholarly publishers, and botanical archives.

### 2. Restraint Over Decoration

If an element does not serve comprehension, navigation, or trust — it is removed. Decoration that does not carry meaning is not permitted.

### 3. Typography-Led

The design system is led by typography, not imagery. Text is the primary medium of communication. Photography supports — never replaces — the written word.

### 4. Timelessness

No design trend is followed. No platform aesthetic is imitated. The system is tested against a twenty-year horizon: would this still feel appropriate in two decades?

### 5. Material Honesty

What you see is what exists. No manufactured desire. No implied luxury beyond what is materially present. No dark patterns. No persuasion architecture.

---

## Spacing System

The spacing system uses CSS custom properties based on a consistent scale:

| Token | Value | Usage |
|---|---|---|
| `--s1` | 0.25rem | Hairline gaps |
| `--s2` | 0.5rem | Tight grouping |
| `--s3` | 1rem | Paragraph spacing |
| `--s4` | 1.5rem | Component internal |
| `--s5` | 2.5rem | Section internal |
| `--s6` | 4rem | Section separation |
| `--s7` | 6rem | Major section breaks |
| `--s8` | 10rem | Hero-level spacing |

### Rules

- Spacing between related elements uses `--s3` to `--s4`
- Spacing between distinct sections uses `--s6` to `--s7`
- Hero areas use `--s8` for breathing room
- Never use arbitrary pixel values
- Never compress spacing to fit more content

---

## Layout

### Measure System

| Token | Value | Purpose |
|---|---|---|
| `--measure-reading` | 65ch | Body text maximum width |
| `--measure` | 42rem | Content column |
| `--measure-wide` | 72rem | Wide content areas |

### The Leaf Component

`<Leaf>` is the primary section container. It provides:
- Consistent vertical rhythm
- Optional background variants (`inset`, `grave`)
- Semantic sectioning

Variants:
- Default — ivory background
- `inset` — slightly recessed, subtle paper texture
- `grave` — deep emerald background with reversed type

### Grid

The layout is predominantly single-column for reading, with controlled two-column layouts for editorial features:

- `.editorial-two-col` — text + pull quote side by side
- `.trust-grid` — 2×3 grid for institutional trust markers
- `.footer__grid` — four-column footer navigation

---

## Components

### Navigation — Masthead

- Fixed position
- Horizontal lockup on the left
- Department links centred
- Clinical consultations highlighted as accent
- Mobile: full-screen overlay panel
- No hamburger icon — text button reading "Navigation"

### Hero — CinematicHero

- Full-viewport image
- Overlay text: statement + qualifier
- Minimal: one photograph, one sentence, one line of context
- No buttons in the hero

### Editorial — EditorialPillar

- Large photograph beside editorial text
- Supports `reverse` prop for alternating layout
- Caption below image
- One call-to-action link per pillar

### Editorial — EditorialFeature

- Smaller feature card: image + text
- Used for product monographs, featured content
- Supports `reverse` prop

### Trust — TrustGridItem

- Numeral + title + short text
- Arranged in grid
- Used for institutional standards

### Quote — PullQuote

- Large italic display text
- Supports `dark` variant for grave sections
- No attribution by default (institutional voice)

### Divider — InstitutionalDivider

- Thin hairline with centred emblem
- Used between major sections
- Purely decorative, `aria-hidden`

### Invitation — EditorialInvitation

- Final section before footer
- Title + body + array of action links
- One primary, rest secondary

### Navigation — DepartmentNav

- Section-level navigation within a department
- Lists all subsections with descriptions
- Used at the bottom of department pages

### Footer

- Stacked reversed lockup
- Four columns of links
- Closing statement
- Colophon line

---

## Interaction Principles

### Links

- `GoLink` — primary navigational action, with arrow indicator
- `QuietLink` — understated, for secondary navigation
- No buttons that look like buttons (no fills, no rounded corners, no shadows)
- Hover: subtle opacity shift or underline reveal

### Motion

- No animation for delight
- No entrance animations
- No parallax
- No scroll-triggered reveals
- Permitted motion: hover state transitions (opacity, transform) at 200ms
- Page transitions handled by Next.js router — no custom transitions

### States

- Focus: visible outline for keyboard navigation
- Hover: restrained opacity or colour shift
- Active: no additional state needed
- Disabled: reduced opacity, cursor not-allowed

---

## Responsive Behaviour

### Breakpoints

The design is fluid rather than breakpoint-driven:
- Typography scales via `clamp()`
- Layout shifts at natural content breakpoints
- Single column below ~768px
- Two column features above ~768px
- Full navigation above ~1024px
- Mobile navigation panel below ~1024px

### Mobile Principles

- Same typographic hierarchy
- Same spacing relationships (scaled)
- Same colour system
- Same content — nothing hidden on mobile
- Touch targets minimum 44×44px
- No horizontal scroll

---

## Dark Sections

The `grave` variant provides deep emerald sections:
- Background: `--deep-emerald`
- Text: `--paper` and `--paper-dim`
- Accents: `--gilt-soft`
- Links: `--gilt-soft` with quiet hover

Used for:
- Founding statements
- Pull quotes of institutional gravity
- Footer

---

## Do Not

- Add shadows to cards or containers
- Add border-radius to content areas
- Add gradient backgrounds
- Add decorative borders
- Add icon libraries
- Add illustration systems
- Add micro-interactions
- Add toast notifications
- Add modal dialogs (except mobile navigation)
- Add carousels or sliders
- Add infinite scroll
- Add skeleton loading states styled as content
- Add confetti, particles, or celebration animations
