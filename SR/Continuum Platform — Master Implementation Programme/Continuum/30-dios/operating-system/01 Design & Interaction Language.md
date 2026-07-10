# 01 · Design & Interaction Language

**Implements:** DIOS‑§1.2 (projection), §1.9 (boundaries), §3.11 (content is content),
§3.12 (one institution, one standard), §4.6 (reuse & simplicity), §4.9 (design for agent
and human equally).
**Layer:** L5 Experience. **Depends on:** `00`, `03 Subsystem & Contract Standards`,
`07 Accessibility & Legibility Standards`, `06 Interface & Motion Standards`.

> The design language is what makes every Sunnah Remedies product recognisably one
> institution. It is a *projection standard*: it governs how the model of truth is rendered
> to humans, never what is true. A page is a view; the model is the source (§1.8).

## 1. Design invariants

- **DL‑INV‑1 — One institution, one language.** Every surface composes the same tokens,
  scale and rhythm. A product MAY extend the language; it MUST NOT fork it (§3.12).
- **DL‑INV‑2 — Tokens, not values.** No implementation hardcodes a colour, size or timing
  literal that a token exists for. Design decisions live in named tokens so they can evolve
  once and propagate everywhere (§4.5).
- **DL‑INV‑3 — Content is content.** Layouts render content from the content model; they
  never embed product, price, course, ingredient or editorial copy (§3.11).
- **DL‑INV‑4 — Accessible by construction.** A design that fails Document 07 is not a
  candidate design. Accessibility is not a later pass.

## 2. Foundations

**Grid & spacing.** A single spacing scale (a geometric step, e.g. 4·n) governs all
margins, padding and gaps. Layout uses a consistent column grid with defined gutters and
max content measures for readability. Whitespace is a material, not an absence — the
institution's calm, considered character is carried primarily by generous, rhythmic space.

**Scale & rhythm.** A modular type and spacing scale creates vertical rhythm. Heading
levels map to a strict hierarchy (one H1 per page — see Document 07); size, weight and
spacing express hierarchy before colour does.

**Colour.** A small, semantic palette: surface, ink, primary, accent, and state colours
(success/warning/danger/info), each as a token with guaranteed contrast pairings (Document
07). Colour never carries meaning alone. Dark mode is a token remapping, not a separate
design.

**Typography.** A defined typeface set with roles (display, body, mono, and script where
Arabic/Qur'anic text appears — see Document 04 for Arabic and Qur'an/Hadith formatting).
Line length, line height and measure are tokenised for legibility.

**Iconography, elevation, depth, materials.** Icons share one grid, weight and metaphor
family. Elevation and depth are expressed through a small, tokenised set (shadow/às
surface layering), used sparingly and consistently — the institution reads as quiet luxury,
not ornament for its own sake.

## 3. Composition patterns

**Cards & sections.** Cards are a reusable primitive (Document 03), never a bespoke layout
per page. Sections follow a predictable anatomy: eyebrow → heading → supporting text →
content → action. Editorial and knowledge layouts share this skeleton so every product
feels coherent.

**Page hierarchy.** Every page declares a single primary intent, one primary action, and a
clear reading order. Secondary actions never compete visually with the primary one.

**Luxury principles.** Restraint over decoration; precision over flourish; consistency over
novelty. The premium character is achieved by discipline — rhythm, contrast, and craft —
not by effects.

## 4. Interaction & responsive philosophy

- **Responsive by intent, not breakpoint.** Layouts adapt to content and reading comfort;
  breakpoints are tokens, and the same component behaves predictably across them.
- **Micro‑interactions** provide feedback, never spectacle. Motion timing, easing and the
  reduced‑motion contract live in Document 06 and MUST be honoured here.
- **Predictable interaction patterns.** The same gesture does the same thing everywhere.
  Novelty in interaction is a cost paid in learnability and is avoided (§4.6).

## 5. Governance of the language

The design language is a versioned Contract (`03`). A change to a token or a primitive is a
Specification‑class decision (§7.1) recorded as an ADR. Because every product composes the
same tokens, improving the language once improves every product on upgrade — the compounding
benefit of a single institution standard (§3.12).

### Related documents
`03` (primitives as contracts), `06` (motion & interface feedback), `07` (accessibility),
`04` (editorial & Arabic/Qur'an formatting), `08` (performance budgets that constrain
visual richness).

*Version 1.0.0.*
