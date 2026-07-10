# Sunnah Remedies — Homepage / Arrival Sequence

## Build Specification · Version 2.0

**Status:** Approved for engineering
**Owner:** Creative Direction
**Consumers:** Frontend engineering, CMS engineering, QA, content
**Stack context:** Next.js (App Router) frontend · Sanity CMS · existing design system and brand assets (Phase 1–2 complete)
**Scope of this document:** The homepage only — the "arrival sequence." This page is the reference implementation. Every token, component, and rule defined here is inherited by the Apothecary, Academy, Sacred Journeys, and Knowledge Library pages and must not be re-invented per page.

---

## Chapter 0 — Review & Disposition (what changed from v1, and why)

Version 1 was a design *direction*, not a specification. It could not have directed an engineering team without a dozen clarifying conversations. This chapter records the review findings and how v2 resolves each, so the change history is auditable.

| # | v1 finding | Type | Disposition in v2 |
|---|------------|------|-------------------|
| 1 | Signature (herbarium/specimen plates) was decorative and belonged on product pages, not the arrival | Weakness | Signature replaced with the **isnād rule** (Ch. 8). Herbarium treatment reassigned to Apothecary product pages, out of scope here. |
| 2 | Type "system" named faces but had no scale/weights/leading/loading | Weakness | Full type ramp, axis settings, fallbacks, and loading strategy (Ch. 6). |
| 3 | Motion hand-waved | Weakness | Full arrival choreography and scroll/hover/reduced-motion spec with exact durations and easing tokens (Ch. 11). |
| 4 | Copy existed as loose sentences with no content model | Weakness (critical for Sanity) | Complete CMS schema with field types, limits, required/optional (Ch. 12). |
| 5 | Photography-paradox "elegant placeholder" was a mood, not a component | Weakness | `Plate` component with three formal states and a zero-CLS degradation path (Ch. 10). |
| 6 | Brief makes photography primary; v1 silently made hero typographic | Assumption | Stated explicitly as a **phased arrival strategy** (Ch. 4). Typographic arrival now; photographic arrival is the same component, later. |
| 7 | Four pillars assumed equal; ignores "emotional centre" and "knowledge before commerce" | Assumption | Department order and weighting decided with rationale (Ch. 9.5). |
| 8 | English-first, LTR assumed; Arabic treated as garnish | Assumption (major for this subject) | Arabic type system, inline bidi rules now, and a full RTL locale mode specified mirror-ready (Ch. 6.4, Ch. 13.6). |
| 9 | No performance budget | Missed opportunity | Hard budget with LCP/CLS/INP targets and weight ceilings (Ch. 14). |
| 10 | No schema decision; risk of medical mis-signalling | Missed opportunity | Schema type decided and constrained (Ch. 15). |
| 11 | "Arrival sequence" designed as a static page | Missed opportunity | Arrival is a timed choreography (Ch. 11.1). |

**Open items requiring a human ratification (do not block engineering — see Ch. 18):** the founding year to display; whether any authority-signal figures are real yet; final department URLs; and scholarly sign-off of all Arabic strings before launch.

---

## Chapter 1 — Purpose & the single job of the page

The homepage has exactly one job: **in the first three seconds, the visitor must feel they have entered a respected institution, not opened a website.**

Everything else — navigation, the four departments, the invitation to correspond — is secondary to that first impression. When a decision is contested, the tie-breaks are, in order:

1. Does it deepen the feeling of arrival and institutional trust?
2. Is it true? (No invented credentials, no staged authenticity, no exaggerated claims. This is an *amāna* constraint, not a stylistic one.)
3. Is it restrained? (When in doubt, remove.)

The page is **not** a conversion funnel. There is no "Shop now." There is one quiet invitation to correspond and four dignified doorways.

---

## Chapter 2 — Audience & voice

**Primary audience:** discerning adults seeking the scholarship, practice, and craft of Ṭibb al-Nabawī (prophetic medicine) — patients, students, practitioners, and readers who value provenance over marketing. They read carefully. They distrust hype. Many read Arabic; all should feel Arabic is native to the institution, not decorative.

**Secondary audience:** professionals and institutions assessing credibility (potential partners, faculty, press).

**Voice:** measured, scholarly, calm, plain. Active voice. Sentence case. No superlatives, no urgency, no promotional register. The institution states what it does; it does not sell. A caption labels; it never persuades.

---

## Chapter 3 — Design principles (non-negotiable for this page)

1. **Photography carries the weight — eventually; typography holds the line — now.** See the phased strategy in Ch. 4. Placeholders are art-directed artefacts, never empty boxes.
2. **One signature, everything else quiet.** The isnād rule is the memorable element. Every other surface is disciplined and plain.
3. **Structure encodes truth.** The department numerals (I–IV) express a real reading order (scholarship → craft → journey), not decoration. Folios and references are genuine metadata, never ornament.
4. **Restraint is the aesthetic.** Generous negative space. Hairlines, not boxes. No shadows except the one defined elevation. No gradients. No border-radius above 2px anywhere.
5. **Truth over furniture.** Any container that would hold a credential renders gracefully empty until the credential is real (Ch. 9.6).
6. **Bilingual by nature.** Arabic is set with the same care as Latin, with correct `lang`/`dir` and a real Arabic face — never a fallback rendering of a Latin font.

---

## Chapter 4 — Art direction & the phased photography strategy

The brief makes photography the primary language. Commissioned photography does not yet exist and will take months. v2 states the resolution plainly rather than hiding it:

- **Arrival A (launch, now):** Typographic arrival. The hero is language — an Arabic line and its English rendering joined by the isnād rule. Every image region renders as a **Plate in `brief` state** (Ch. 10): a considered panel carrying a shot brief. The absence of photography is expressed as art-directed restraint, not as a gap.
- **Arrival B (as photography is delivered):** The identical `Plate` components move from `brief` → `interim` → `final` as assets arrive, one at a time, with **no layout change and no code change** — only a CMS status flip. The page becomes photograph-led gradually and invisibly.

This means the "unfinished" site is deliberately composed, and the transition to the finished site is a content operation, not a redesign. Engineering builds once.

**Prohibited imagery (enforced at content review, not code):** generic stock, AI-generated imagery, posed lifestyle, corporate smiles, wellness clichés, floating herbs. Every final image must read as commissioned for Sunnah Remedies.

---

## Chapter 5 — Design tokens

All values are authoritative. Implement as CSS custom properties on `:root`. No hard-coded colours or sizes in components.

### 5.1 Colour

| Token | Hex | Role |
|-------|-----|------|
| `--paper` | `#ECE6D8` | Page ground (manuscript paper) |
| `--paper-sunk` | `#E3DBC9` | Recessed panels, Plate `brief` ground, department cards |
| `--ink` | `#201D16` | Primary text (warm sepia-black) |
| `--ink-soft` | `#4A4638` | Secondary text, captions, standfirsts |
| `--sage` | `#3C4733` | Primary accent: section numerals, select headings, rules |
| `--sage-deep` | `#232A1E` | Inverted section ground ("On the tradition" band, footer) |
| `--brass` | `#9A7B4F` | The isnād rule, hairlines, folio marks. **Never used for body text.** |
| `--paper-on-deep` | `#E8E1D0` | Text on `--sage-deep` |

**Contrast requirements (WCAG 2.2):** body text ≥ 4.5:1; large text (≥24px or ≥18.66px bold) and UI/graphical objects ≥ 3:1. `--ink` on `--paper` and `--paper-on-deep` on `--sage-deep` clear ≥ 12:1 and are the defaults. `--ink-soft` on `--paper` is the minimum-contrast pairing and **must be verified ≥ 4.5:1 in a token contrast test in CI** (see Ch. 13.3). `--brass` is decorative/graphical only and must clear 3:1 against its ground for non-text use; it is never a text colour.

### 5.2 Spacing scale (8px base)

`--space-1: 4px · --space-2: 8px · --space-3: 12px · --space-4: 16px · --space-5: 24px · --space-6: 32px · --space-8: 48px · --space-10: 64px · --space-12: 96px · --space-16: 128px · --space-20: 160px`

Section vertical padding: `--space-16` (mobile) → `--space-20` (≥lg). Never improvise spacing outside this scale.

### 5.3 Radii, elevation, lines

- `--radius: 2px` (maximum radius anywhere; default 0).
- `--hairline: 1px solid color-mix(in srgb, var(--ink) 14%, transparent)` — the default divider.
- `--rule-brass: 1px solid var(--brass)` — reserved for the isnād rule only.
- **One** elevation exists, used only for the sticky masthead on scroll: `0 1px 0 color-mix(in srgb, var(--ink) 8%, transparent)`. No other shadows.

---

## Chapter 6 — Typography system

Three faces, three clearly separated jobs. This is a "scholarly press with a laboratory/archive stamp layer": two serifs for reading, one mono for metadata. It is deliberately not the single-serif luxury default.

### 6.1 Faces, roles, licensing

| Role | Face | Licence | Notes |
|------|------|---------|-------|
| Display (institution voice) | **Fraunces** | SIL OFL | Variable. Use `opsz` high, low `SOFT`, `WONK 0`. Warmth without theatrics. |
| Body / editorial reading | **Newsreader** | SIL OFL | Designed for on-screen long-form; expressive italic used for pull quotes. |
| Utility / data (labels, folios, captions, shot briefs) | **IBM Plex Mono** | SIL OFL | The archive/laboratory layer. |
| Arabic body & quotes | **Amiri** | SIL OFL | Naskh revival (Bulaq/Amiria lineage) — scholarly and correct for classical text. |
| Arabic display (optional, single hero line only) | **Reem Kufi** | SIL OFL | Only if the arrival Arabic line needs display weight; otherwise Amiri. |

All faces are open-licence and self-hosted (no third-party CDN at runtime). Confirm current licence text at build time and vendor the licence files with the fonts.

### 6.2 Type ramp (fluid; `clamp(min, preferred, max)`)

| Style | Face / axis | Size | Line-height | Tracking |
|-------|-------------|------|-------------|----------|
| Hero display | Fraunces `opsz 144 wght 380` | `clamp(2.75rem, 6vw, 5.25rem)` | 1.02 | −0.01em |
| Section title (H2) | Fraunces `opsz 72 wght 420` | `clamp(1.75rem, 3vw, 2.75rem)` | 1.08 | −0.005em |
| Department name (H3) | Fraunces `opsz 40 wght 460` | `clamp(1.25rem, 2vw, 1.6rem)` | 1.15 | 0 |
| Standfirst / lede | Newsreader `wght 400` | `clamp(1.125rem, 1.4vw, 1.375rem)` | 1.5 | 0 |
| Body | Newsreader `wght 400` | `1.0625rem` (17px) | 1.62 | 0 |
| Pull quote | Newsreader `italic wght 400` | `clamp(1.375rem, 2.4vw, 2rem)` | 1.35 | 0 |
| Small / footnote | Newsreader `wght 400` | `0.9375rem` | 1.55 | 0 |
| Eyebrow / label | IBM Plex Mono `wght 500`, uppercase | `0.75rem` | 1.2 | 0.16em |
| Folio / catalogue mark | IBM Plex Mono `wght 500` | `0.6875rem` | 1.2 | 0.08em |
| Caption / shot brief | IBM Plex Mono `wght 400` | `0.75rem` | 1.5 | 0.02em |

### 6.3 Fallback stacks & loading

- Display/body fallback: `Fraunces`/`Newsreader`, then `Georgia, 'Times New Roman', serif`, with `size-adjust`/`ascent-override` tuned to the primary metrics to hold layout (target CLS contribution = 0).
- Mono fallback: `'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace`.
- Arabic fallback: `Amiri`, then `'Noto Naskh Arabic', serif`.
- `font-display: swap`. Preload only the two LCP-critical resources: Fraunces display cut and Newsreader body cut. Everything else loads non-blocking.
- Subset aggressively: Latin (+ Latin-ext) for the serifs and mono; Arabic subset for Amiri/Reem Kufi. WOFF2 only. Font payload ceiling: **≤ 140KB total, ≤ 6 files** (Ch. 14).
- Use `next/font` (local) so hashing, preload, and fallback metrics are handled at build.

### 6.4 Arabic & bidi rules (applies now, at inline scope)

- Every Arabic run is wrapped with `lang="ar" dir="rtl"` and set in Amiri (or Reem Kufi for the single hero display line). Never allow Arabic to render in a Latin face.
- Arabic optical size runs larger: Arabic body 1.375rem / line-height 1.9 minimum; the hero Arabic line matches the English hero optical weight, not its pixel size.
- Punctuation, numerals, and diacritics (ḥarakāt) must be preserved exactly from source; treat Arabic strings as immutable content — no automated transforms, no `text-transform`, no letter-spacing on Arabic.
- The page ships in LTR document mode with inline RTL runs (bidi). A full RTL *locale* mode is specified as future work in Ch. 13.6 and must be built mirror-ready (logical properties, no physical `left/right`).

---

## Chapter 7 — Layout & grid

### 7.1 Breakpoints

`sm: 480px · md: 768px · lg: 1024px · xl: 1440px`. Mobile-first; min-width queries.

### 7.2 Grid & margins

- Content max-width: `1200px`, centred.
- Page inline padding: `20px` (base) → `40px` (≥md) → `64px` (≥lg).
- **Marginal rail (the folio device):** on ≥lg, a fixed-width rail (`72px`) sits *outside* the 1200px content column on the leading side. It carries section Roman numerals and folio/reference marks in mono/brass — a critical-edition reference to manuscript scholarship.
  - **Below lg the rail collapses.** Folios do not disappear; they move **inline**, rendered as a mono "section stamp" line immediately above each section title (e.g. `II · ON THE TRADITION`). This is a defined responsive transformation, not a hide. (The marginal device must survive mobile conceptually, never simply vanish.)
- Vertical rhythm follows the 8px scale (Ch. 5.2).
- Use CSS logical properties throughout (`padding-inline`, `margin-block`, `inset-inline-start`) so the RTL locale mode mirrors without rework.

### 7.3 Desktop wireframe (≥lg)

```
│rail│            1200px content column                     │
│    │                                                       │
│  I │  EST. ——— · INSTITUTE OF PROPHETIC MEDICINE   (eyebrow)
│    │                                                       │
│    │   طِبُّ ٱلنَّبَوِيّ            ← Arabic hero line (Amiri, RTL)
│    │   ────────────────●───────  ← THE ISNĀD RULE (brass)
│    │   The medicine of the prophetic
│    │   tradition, kept living.   ← English hero (Fraunces)
│    │
│    │   [standfirst · Newsreader · ≤240ch]
│    │                              Enter the institution ⟶
├────┼───────────────────────────────────────────────────────
│    │  ‖‖‖  THRESHOLD PLATE (full-content-width) ‖‖‖
│    │  [caption: shot brief · mono]
├────┼───────────────────────────────────────────────────────
│ II │  ON THE TRADITION      (inverted --sage-deep band)
│    │   standfirst → two measured paragraphs
│    │   ── pull quote (Newsreader italic) ──
├────┼───────────────────────────────────────────────────────
│III │  THE DEPARTMENTS
│    │   I. Knowledge Library   II. The Academy
│    │   III. The Apothecary    IV. Sacred Journeys (feature)
├────┼───────────────────────────────────────────────────────
│ IV │  AUTHORITY (restrained band; graceful-empty)
├────┼───────────────────────────────────────────────────────
│  V │  CORRESPONDENCE (the single invitation)
├────┴───────────────────────────────────────────────────────
│  FOOTER (--sage-deep): departments · institution · isnād
```

---

## Chapter 8 — The signature element: the Isnād Rule

**Concept.** *Isnād* is the chain of transmission that authenticates classical Islamic knowledge — the lineage by which a text or teaching is known to be sound. It is the truest possible metaphor for what this institution claims: knowledge received, verified, and passed on. The signature is a fine brass hairline carrying a single mark at a node along its length — a rule that *joins* things. It is the one bold move; everything else stays quiet.

**Form.** A `1px` `--brass` horizontal line. At one node sits a small mark: a `5px` filled brass lozenge (rotated square) OR a short vertical tick. The rule is drawn (animated width/scale) on arrival (Ch. 11.1); static thereafter.

**Where it appears (and only here):**
1. **Arrival:** between the Arabic hero line and the English hero line — literally transmitting one to the other. The node sits at the optical centre.
2. **Between departments:** as the divider separating the four department entries — lineage, not just a rule.
3. **Footer:** a single closing instance above the institution statement — the institution signing its name.

**Constraints.** Never more than these three placements on this page. Never coloured anything but `--brass`. Never thicker than 1px. Never decorative infill. The node mark appears once per rule instance, at a defined position. Implement as `<IsnadRule variant="arrival|divider|footer" nodePosition="center|0.5|...">`.

**RTL:** the draw animation `transform-origin` and node position flip with `dir`. Use logical origin.

---

## Chapter 9 — Section-by-section specification

Each section below defines: **intent · structure · content (see Ch. 12 for schema) · states · responsive · motion (see Ch. 11) · a11y (see Ch. 13).** Sections appear in DOM in the order listed; DOM order equals visual order equals reading order.

### 9.1 Masthead (`<header>`)

- **Intent:** quiet institutional identity and wayfinding; never a marketing bar.
- **Structure:** wordmark `SUNNAH REMEDIES` (Fraunces, `opsz 40`, small) with the line `Institute of Prophetic Medicine` beneath it (mono eyebrow style). Primary nav: `The Apothecary · The Academy · Sacred Journeys · Knowledge Library`, then a hairline-separated `About` and `Contact`. Nav links are Newsreader small, `--ink`, underline-on-focus/hover drawn left-to-right (150ms).
- **States:** transparent over `--paper` at top; on scroll past the hero it becomes sticky with `--paper` background and the single defined elevation (Ch. 5.3). Transition 200ms.
- **Responsive:** ≥md full horizontal nav. Below md the nav collapses to a single `Menu` control opening a full-height `--paper` panel; the panel lists departments as a numbered index (I–IV) with Arabic names beneath. Focus is trapped in the open panel; `Esc` closes; focus returns to the trigger.
- **a11y:** `role="banner"`; nav in `<nav aria-label="Primary">`; the mobile trigger is a real `<button aria-expanded aria-controls>`.

### 9.2 Arrival / hero

- **Intent:** the three-second promise. Language, not decoration.
- **Structure (top to bottom):** eyebrow (mono; e.g. `EST. ——— · INSTITUTE OF PROPHETIC MEDICINE`) → Arabic hero line (`lang="ar" dir="rtl"`, Amiri/Reem Kufi, `--sage`) → **isnād rule (arrival variant)** → English hero line (Fraunces hero display, `--ink`) → standfirst (Newsreader lede, `--ink-soft`, ≤240 chars) → a single text affordance `Enter the institution ⟶` linking to the departments section (in-page) or `/about`.
- **Content:** all fields CMS-driven (Ch. 12). The founding year is a field; render `———` if unset (never invent it).
- **States:** the affordance has hover (arrow advances 4px, 200ms) and focus-visible states.
- **Responsive:** hero display scales via clamp; Arabic line never below its optical minimum; on `sm` the eyebrow may wrap to two lines — allow it, do not truncate.
- **Motion:** the arrival choreography (Ch. 11.1) — this is the one orchestrated moment on the page.
- **a11y:** the hero is the page's single `<h1>`. If the Arabic and English lines are two visual lines of one title, mark up as one `<h1>` containing both, with the Arabic in a `<span lang="ar" dir="rtl">`; provide the English as the accessible name and the Arabic as supplementary (do not double-announce the same meaning confusingly — see Ch. 13.5 for the exact pattern).

### 9.3 Threshold plate

- **Intent:** the first image moment — crossing the threshold into the institution.
- **Structure:** a full-content-width `Plate` (Ch. 10) at a defined aspect ratio (`16:7` on ≥md, `4:5` on `sm`), with a mono caption beneath carrying the shot brief.
- **States:** `brief` at launch; `interim`/`final` as photography arrives.
- **Performance:** in `final` state this is the LCP element → preloaded, `fetchpriority="high"`, eager. In `brief` state it must still reserve identical layout (Ch. 10) so the eventual swap causes zero CLS.
- **a11y:** see Ch. 10 for the alt/`aria-label` rules per state.

### 9.4 On the tradition (statement)

- **Intent:** the institution's reason for being, told as story, not service description. The emotional register lifts here.
- **Structure:** inverted band on `--sage-deep` with `--paper-on-deep` text. Section stamp `II · ON THE TRADITION` (mono). A standfirst, two measured paragraphs (Newsreader body), and one pull quote (Newsreader italic, large). Optional Arabic epigraph (`lang="ar"`) set small and centred above the standfirst.
- **Content:** CMS body as portable text (constrained — Ch. 12.3). The pull quote carries text + attribution + source; if attribution is a hadith or scholar, the source field is required and must be reviewed (Ch. 18).
- **Responsive:** single column, generous measure (≤ 62ch). Pull quote breaks full-bleed within the band on ≥md.
- **a11y:** contrast verified for `--paper-on-deep` on `--sage-deep`; the pull quote is a `<blockquote>` with `<cite>`.

### 9.5 The departments (four pillars)

- **Intent:** four dignified doorways, ordered to encode the institution's values.
- **Order & rationale (decision — v1 assumption resolved):** the reading order is **I. Knowledge Library → II. The Academy → III. The Apothecary → IV. Sacred Journeys.** Scholarship and teaching lead (knowledge before commerce); craft/commerce sits third; Sacred Journeys is last and is the **feature** card (largest plate) as the emotional crescendo the brief calls for. This order is a value statement and must not be changed for conversion reasons.
- **Structure:** each department is a card: Roman numeral (mono/brass) · department name (Fraunces H3) with Arabic name beneath (`lang="ar"`, Amiri, `--ink-soft`) · one-line standfirst · a `Plate` · a text link `Enter ⟶`. **Isnād divider** rules separate the entries.
- **Sizing:** I–III render at `standard` size in a two-column arrangement on ≥lg; IV (`Sacred Journeys`) renders `feature` — full-width with a larger plate and a longer standfirst.
- **Content:** `departments` is an ordered array of 4 references (Ch. 12.4). Order, names (En + Ar), standfirst, href, plate, and size are all CMS fields.
- **Responsive:** single column below lg; the two-up becomes stacked; the feature card remains full-width.
- **Motion:** scroll-reveal with 80ms stagger across the four (Ch. 11.2). Hover: the department's isnād node shifts toward the link and the link underline draws (200ms).
- **a11y:** each card is an `<article>`; the whole card is a link target (the heading link is the accessible name); Arabic name has `lang="ar"`; focus-visible outlines the card.

### 9.6 Authority signals (restrained, graceful-empty)

- **Intent:** quiet institutional credibility — never marketing statistics.
- **Structure:** a hairline-bounded band of up to four items, each `label` (mono eyebrow) + `value` (Fraunces, medium) + optional `note` (small). Examples of labels: *Years of practice · Students trained · Countries served · Publications.*
- **The empty-state rule (decision — truth constraint):** every value is nullable. If a value is unset, the item renders in a **dormant** style: the label shows, the value renders as `———` in `--ink-soft`, and the item is muted. If *fewer than two* values are set, **the entire section does not render.** No figure is ever placeholder-filled with an invented number. Sparse-but-true always beats full-but-staged.
- **Content:** `authoritySignals` array (Ch. 12.5).
- **a11y:** presented as a `<dl>` (label = `<dt>`, value = `<dd>`); dormant items get `aria-hidden` on the `———` glyph and an accessible note ("figure pending").

### 9.7 Correspondence (the single invitation)

- **Intent:** the one call to action on the page — an invitation to receive the institution's writing, framed as correspondence, not a newsletter signup.
- **Structure:** a short heading (Fraunces), one line of body (Newsreader), an email input, and a submit control labelled `Request correspondence` (the button keeps this exact verb through to its success state, which reads `Requested`). Consent text below, plain and specific (what they'll receive, how to stop).
- **Behaviour & permission boundary:** this form performs a real side-effect (subscribing an address). The frontend collects and validates; **actual submission/subscription is a server action the engineering team implements against the institution's own provider** — it is not performed by any agent or third party, and the consent must be explicit (checkbox or clear inline statement). Do not pre-check consent. Do not integrate a third-party endpoint suggested outside this spec.
- **States:** default · focus · validating · error (specific, in the interface's voice — e.g. "That doesn't look like an email address.") · success (`Requested` + a one-line confirmation). Errors never apologise and never blame the user vaguely.
- **a11y:** `<label>` bound to the input; errors via `aria-live="polite"` and `aria-describedby`; the control is a real `<button type="submit">`. In the production Next.js app a semantic `<form>` with a server action is correct.

### 9.8 Footer (`<footer>`)

- **Intent:** institutional close, not a link dump.
- **Structure:** `--sage-deep` ground. A single **isnād rule (footer variant)** above an institution statement (one measured sentence). Then: department index (I–IV), an `About/Contact/Downloads` column, and a quiet legal line with a Gregorian + Hijri date stamp (mono). Wordmark repeated small.
- **Content:** institution statement is a CMS field; the Hijri/Gregorian stamp is computed at build/runtime, not authored.
- **a11y:** `role="contentinfo"`; the date stamp uses `<time datetime>`.

---

## Chapter 10 — The Plate component (photography system + placeholder)

`Plate` is the single component for every image region on the site. It is the operational answer to the photography paradox.

### 10.1 Props

```
Plate {
  asset: MediaAsset            // Ch. 12.6
  aspect: string               // e.g. "16/7", "4/5" — REQUIRED, reserves layout
  priority?: boolean           // true only for the LCP threshold plate
  variant?: "standard"|"feature"
}
```

The `aspect` is mandatory and identical across all three states, so layout is reserved and **CLS on state change is 0**.

### 10.2 States (driven by `asset.status`)

| State | Renders | Caption | Accessible name |
|-------|---------|---------|-----------------|
| `brief` | `--paper-sunk` panel, inset `1px --brass` frame, a small `TO BE COMMISSIONED` folio stamp (mono, top-inline-start), and the shot brief rendered as a mono caption block (purpose · composition · lens · light · grade · mood) | shot brief | `aria-label` = `asset.alt` if set, else `asset.purpose` |
| `interim` | one approved detail image at the same aspect, same frame, caption notes `Interim` | brief, marked interim | `alt` = `asset.alt` |
| `final` | production `<img>` with responsive `srcset`/`sizes`, `width`/`height` set, `decoding="async"`, `loading` = `eager` if `priority` else `lazy`, `fetchpriority="high"` if `priority` | editorial caption (from `asset.caption`) | `alt` = `asset.alt`, or `alt=""` if `asset.decorative` |

### 10.3 Degradation path

`brief → interim → final` is a **CMS status change only**. No component swap, no layout change, no engineering ticket per asset. The page becomes photograph-led as `status` values flip, section by section, exactly as Ch. 4 requires.

### 10.4 Image delivery (final state)

AVIF with WebP fallback; responsive `srcset` at 1×/2× for the rendered widths at each breakpoint; served through the Next.js image pipeline (or Sanity's CDN transforms) with explicit dimensions. Never ship an un-dimensioned image.

---

## Chapter 11 — Motion & choreography

Global easing tokens: `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` · `--ease-inout: cubic-bezier(0.65, 0, 0.35, 1)`. Default duration `--dur: 200ms`; reveal duration `--dur-reveal: 600ms`.

### 11.1 The arrival choreography (page load — the one orchestrated moment)

Runs once, on first paint of the hero. Timeline (t in ms):

- **t0:** `--paper` ground present immediately (no white flash; set background before hydration). Masthead hairline draws width 0→100% over 600ms `--ease-out`.
- **t150:** eyebrow fades up (`translateY(8px)→0`, opacity 0→1), 500ms `--ease-out`.
- **t300:** Arabic hero line fades in (opacity 0→1, `translateY(6px)→0`), 500ms.
- **t450:** **isnād rule (arrival)** draws — `scaleX(0)→1` from logical origin, 700ms `--ease-out`; node mark fades in at t900.
- **t600:** English hero line fades up, 550ms.
- **t900:** standfirst + `Enter` affordance settle, 450ms.

Total ≈ 1.35s, unobtrusive. Nothing blocks interaction; the page is usable throughout.

### 11.2 Scroll reveals

`IntersectionObserver`, `threshold: 0.2`, `rootMargin: 0px 0px -10% 0px`, fire once. Revealed elements: section stamps, headings, paragraphs, plates, department cards. Effect: `translateY(16px)→0` + opacity 0→1, `--dur-reveal` `--ease-out`. Grouped items stagger 80ms (max 4 in a group). The observer script is ≤ 1KB; no animation library.

### 11.3 Hover / focus micro-interactions

- Nav & text links: underline draws left-to-right, 150ms.
- `Enter` affordances: arrow advances 4px, 200ms.
- Department cards: isnād node shifts toward the link + link underline draws, 200ms.
- All interactive elements have a visible focus-visible ring (Ch. 13.2) identical in weight to hover affordances.

### 11.4 Reduced motion (`prefers-reduced-motion: reduce`)

- No transforms, no scroll reveals: all content is visible by default (final state), no `translateY`.
- Arrival choreography is skipped; the isnād rule renders drawn (static).
- Opacity-only transitions permitted at ≤ 200ms for hover/focus.
- This is a first-class path, not a fallback afterthought; QA tests it explicitly.

---

## Chapter 12 — Content model (Sanity CMS)

The homepage is a **singleton** document `homepage`. Departments and media are their own documents so they are reusable across the site. All strings have hard limits; the CMS enforces them. Nothing on this page is hard-coded copy except structural labels defined here.

### 12.1 `homepage` (singleton)

| Field | Type | Req | Limit / notes |
|-------|------|-----|---------------|
| `eyebrow` | string | yes | ≤ 48 chars |
| `foundingYear` | number | no | if unset, UI renders `———` |
| `arrivalArabic` | string | yes | ≤ 60 chars; stored with diacritics; `lang=ar` |
| `arrivalEnglish` | string | yes | ≤ 120 chars |
| `standfirst` | text | yes | ≤ 240 chars |
| `enterLabel` | string | yes | ≤ 32 chars; default "Enter the institution" |
| `enterHref` | string | yes | internal path |
| `thresholdPlate` | reference → `mediaAsset` | yes | LCP plate |
| `tradition` | object | yes | see 12.3 |
| `departments` | array<reference → `department`> | yes | exactly 4, ordered |
| `authoritySignals` | array<object> | no | 0–4 items, see 12.5 |
| `correspondence` | object | yes | see 12.7 |
| `institutionStatement` | text | yes | footer sentence, ≤ 200 chars |
| `seo` | object | yes | see Ch. 15 |

### 12.3 `tradition` object

| Field | Type | Req | Notes |
|-------|------|-----|-------|
| `stamp` | string | yes | e.g. "On the tradition" |
| `arabicEpigraph` | string | no | `lang=ar`; ≤ 80 chars |
| `standfirst` | text | yes | ≤ 200 chars |
| `body` | array (portable text, restricted to paragraph + emphasis only — no headings, lists, or images) | yes | 2 paragraphs recommended |
| `pullQuote` | object `{ text ≤160, attribution, source }` | yes | `source` required when attribution is a hadith/scholar (Ch. 18) |

### 12.4 `department` (document, reusable)

| Field | Type | Req | Notes |
|-------|------|-----|-------|
| `order` | number (1–4) | yes | drives Roman numeral & reading order |
| `nameEn` | string | yes | ≤ 40 |
| `nameAr` | string | yes | `lang=ar`; ≤ 40 |
| `standfirst` | string | yes | ≤ 120 (standard) / ≤ 200 (feature) |
| `href` | string | yes | internal path |
| `plate` | reference → `mediaAsset` | yes | |
| `size` | string enum `standard\|feature` | yes | only one `feature` allowed on homepage (Sacred Journeys) |

### 12.5 `authoritySignals[]` item

`{ label (string ≤32, req), value (string, nullable), note (string ≤80, optional) }`. Empty-state behaviour per Ch. 9.6 is a rendering rule, not a content rule.

### 12.6 `mediaAsset` (document — the shot-brief model)

This schema operationalises the brief's photography system.

| Field | Type | Req | Notes |
|-------|------|-----|-------|
| `status` | enum `brief\|interim\|final` | yes | drives `Plate` state |
| `purpose` | string | yes | why this image exists |
| `composition` | string | yes | framing |
| `lens` | string | no | e.g. "50mm, shallow" |
| `lighting` | string | yes | e.g. "single north window, morning" |
| `grade` | string | no | colour grade / mood direction |
| `mood` | string | yes | one word/phrase |
| `location` | string | no | |
| `subject` | string | no | |
| `props` | array<string> | no | |
| `image` | image | when interim/final | with hotspot/crop |
| `caption` | string | no | editorial caption for `final` |
| `alt` | string | when informational | required unless `decorative` |
| `decorative` | boolean | default false | if true → `alt=""` |
| `credit` | string | no | |

### 12.7 `correspondence` object

`{ heading (≤64, req), body (≤160, req), placeholder (≤40), consentText (≤200, req), successText (≤120, req) }`.

---

## Chapter 13 — Accessibility specification

Target: **WCAG 2.2 AA**, verified, not aspirational.

### 13.1 Landmarks & structure

One `<h1>` (the hero). Landmark order: `banner` → `main` → `contentinfo`. Each `main` section has an accessible name via `aria-labelledby` pointing at its stamp/heading. DOM order equals visual order equals reading order — **including the marginal folios, which are in-flow in the DOM even when positioned into the rail visually (CSS positioning only, never DOM reordering).**

### 13.2 Keyboard & focus

- Every interactive element reachable and operable by keyboard, in logical order.
- `focus-visible` ring: `2px solid var(--sage)`, `2px` offset, on every focusable element. Never remove outlines without an equivalent visible replacement.
- A skip link (`Skip to content`) is the first focusable element, visible on focus.
- Mobile nav panel traps focus while open; `Esc` closes; focus returns to trigger.

### 13.3 Contrast

Enforce the Ch. 5.1 requirements. Add a **CI token-contrast test** that fails the build if any defined text/background pairing drops below its threshold (body 4.5:1; large/UI 3:1). `--ink-soft`/`--paper` is the watch pairing.

### 13.4 Motion

`prefers-reduced-motion` path per Ch. 11.4 is tested. No parallax, no autoplaying motion, no motion that conveys information without a static equivalent.

### 13.5 Bilingual screen-reader pattern

- The `<h1>` contains the English hero as its accessible name; the Arabic line is a sibling `<span lang="ar" dir="rtl">`. To avoid a screen reader announcing the same idea twice in two languages confusingly, mark the Arabic line's role deliberately: if the Arabic and English are translations of each other, expose one as primary and the other with context (e.g. an adjacent visually-hidden gloss "in Arabic:"), decided with the content team. Never leave Arabic with an implicit Latin `lang`, which produces garbled speech.
- All Arabic runs carry correct `lang="ar"` and `dir="rtl"`.

### 13.6 RTL locale mode (future, build mirror-ready now)

The page ships LTR with inline bidi. Because all layout uses **logical properties** and no physical `left/right`, a future `dir="rtl"` locale mode mirrors automatically: the marginal rail moves to the opposite side, the isnād draw origin flips, and department reading order reverses. Engineering must not introduce physical-direction CSS that would block this.

### 13.7 Alt-text strategy

Informational plates (threshold, department plates) require descriptive `alt` from `asset.alt`. Purely atmospheric imagery is marked `decorative` → `alt=""`. In `brief` state the Plate exposes `asset.purpose`/`asset.alt` as its `aria-label` so the intent is still announced. Captions are supplementary, not a substitute for alt.

---

## Chapter 14 — Performance budget (hard)

The design must live inside these numbers; they are acceptance criteria, not goals.

| Metric | Target | Google "good" ceiling |
|--------|--------|-----------------------|
| LCP (threshold plate) | ≤ 2.0s | 2.5s |
| CLS | ≤ 0.03 | 0.1 |
| INP | ≤ 150ms | 200ms |

Weight ceilings (initial, above-the-fold, compressed): **HTML+CSS ≤ 90KB · fonts ≤ 140KB (≤ 6 WOFF2 files) · JS ≤ 60KB · LCP image ≤ 200KB.** Rules: no render-blocking JS; motion is CSS + one ≤1KB IntersectionObserver; fonts subset + preloaded critical cuts + fallback metric overrides (font-induced CLS = 0); images AVIF/WebP with dimensions and lazy-below-fold; the threshold plate is the only preloaded, priority image. Fail the build if the budget is exceeded (Lighthouse CI or equivalent, Ch. 17).

---

## Chapter 15 — SEO & structured data

- `<title>` and meta description authored per `seo` object (Ch. 12); canonical self-referencing; OpenGraph + Twitter card with `seo.ogImage` (fallback to threshold `final` when available, never a `brief` placeholder).
- **Schema decision (v1 gap resolved):** emit JSON-LD `Organization` extended with `EducationalOrganization` for the institute, and `WebSite` with `SearchAction` if site search exists. **Do not emit `MedicalOrganization`, `MedicalClinic`, or medical-claim schema** — the institution teaches and practises a traditional discipline; medical schema would be both untrue and an SEO/compliance liability. Departments may carry their own appropriate schema on their own pages (`Course`, `Product`, `Article`) — out of scope here.
- Semantic HTML, one `<h1>`, meaningful heading hierarchy, and internal links to all four departments give the page its crawlable structure. Breadcrumbs are not used on the homepage (it is the root).

---

## Chapter 16 — Component inventory & tech notes

Reusable components this page introduces (framework: Next.js App Router; styling: CSS variables + CSS Modules or the existing system's convention — do not introduce a new styling paradigm):

| Component | Purpose | Notes |
|-----------|---------|-------|
| `IsnadRule` | the signature (Ch. 8) | variants `arrival\|divider\|footer`; logical origin |
| `Plate` | all imagery + placeholders (Ch. 10) | state machine on `asset.status`; reserves aspect |
| `SectionStamp` | folio/roman-numeral + section label | renders in rail (≥lg) or inline (<lg) |
| `Eyebrow` | mono uppercase label | |
| `PullQuote` | `<blockquote>` + `<cite>` | |
| `AuthorityBand` | dl with graceful-empty logic (Ch. 9.6) | |
| `DepartmentCard` | `<article>` doorway | `standard\|feature` |
| `CorrespondenceForm` | the single CTA (Ch. 9.7) | real server action; explicit consent |
| `Masthead` / `SiteFooter` | banner / contentinfo | |
| `Reveal` | scroll-reveal wrapper (Ch. 11.2) | respects reduced motion |

Data flow: Sanity → typed GROQ queries → server components; images via next/image or Sanity CDN with explicit dimensions; fonts via `next/font/local`. No client-side data fetching for above-the-fold content. Hydration limited to the mobile nav, the reveal observer, and the correspondence form.

---

## Chapter 17 — Acceptance criteria (definition of done)

A build is done when **all** of the following pass:

1. All eight sections render from CMS content with zero hard-coded copy beyond defined structural labels.
2. `Plate` renders correctly in `brief`, `interim`, and `final`, and a status flip causes **zero layout shift** (measured).
3. The isnād rule appears in exactly its three placements and nowhere else.
4. Arabic strings render in Amiri/Reem Kufi with correct `lang`/`dir`; no Arabic renders in a Latin face.
5. Arrival choreography runs once and matches Ch. 11.1 timings; `prefers-reduced-motion` path matches Ch. 11.4.
6. Authority band obeys the graceful-empty rule (hidden when < 2 values; `———` for dormant items; no invented figures).
7. Keyboard: full operability, visible focus on every control, working skip link, mobile-nav focus trap + `Esc`.
8. Contrast CI test passes for every defined pairing.
9. Performance budget met on a mid-tier mobile profile: LCP ≤ 2.0s, CLS ≤ 0.03, INP ≤ 150ms; weight ceilings respected; Lighthouse a11y and best-practices ≥ 95.
10. JSON-LD is `Organization`/`EducationalOrganization` only; no medical schema; OG image never a placeholder.
11. Responsive integrity at `sm/md/lg/xl`: marginal folios collapse to inline stamps below lg; feature card stays full-width; no horizontal scroll.
12. Layout uses logical properties throughout; a forced `dir="rtl"` render mirrors without broken layout (RTL smoke test).
13. The correspondence form validates client-side, submits via a real server action, requires explicit consent, and shows specific error/success states.

---

## Chapter 18 — Decisions requiring leadership ratification

These are business/brand decisions, **not** engineering blockers — engineering builds against the schema and empty-states regardless. Ratify before public launch:

1. **Founding year** to display (or leave dormant `———`).
2. **Authority figures:** which, if any, are real and verifiable today. Anything unverified stays dormant. No figure is invented.
3. **Final department URLs** and the exact English/Arabic department names.
4. **Scholarly review of all Arabic strings and any hadith/scholar attributions** (arrival line, epigraph, pull-quote source). For an institution of this kind this is an integrity requirement (*amāna*): no Arabic text or attribution ships without qualified sign-off. Treat this as release-blocking for the *content*, not the *build*.
5. **Correspondence provider** (the email service the server action targets) and the exact consent wording.

---

*End of Version 2.0. This document is intended to be sufficient to direct a senior engineering team without further clarification. Where a value here conflicts with a later revision, the later approved revision governs; record the change in Chapter 0.*
