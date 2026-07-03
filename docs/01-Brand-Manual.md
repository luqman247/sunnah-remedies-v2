# 01 — Brand Manual

## Brand Identity

Sunnah Remedies is an institute of Prophetic Medicine. The brand identity communicates:

- Institutional authority
- Scholarly rigour
- Clinical professionalism
- Material honesty
- Long stewardship

It does not communicate:
- Wellness trends
- Lifestyle aspiration
- Urgency or scarcity
- Commercial persuasion
- Spiritual performance

---

## Brand Marks

### Primary Logo System

The logo system consists of three elements:

1. **Emblem** — the standalone institutional mark
2. **Wordmark** — the name rendered in Libre Baskerville
3. **Lockup** — emblem and wordmark combined

### Approved Variations

| Variation | Use Case |
|---|---|
| `icon-primary` | Default emblem on light backgrounds |
| `icon-emerald` | Monochrome emerald contexts |
| `icon-emerald-gold` | Premium applications |
| `icon-ivory-reversed` | Dark backgrounds |
| `icon-mono-black` | Print, single-colour |
| `icon-mono-white` | Dark surfaces |
| `lockup-horizontal-primary` | Navigation, headers |
| `lockup-horizontal-descriptor` | With tagline |
| `lockup-horizontal-reversed` | Dark backgrounds |
| `lockup-stacked-primary` | Hero areas, formal contexts |
| `lockup-stacked-descriptor` | Full identification |
| `lockup-stacked-reversed` | Footer, dark sections |
| `wordmark-black` | Print, documents |
| `wordmark-emerald` | Digital, on ivory |
| `wordmark-ivory` | Digital, on emerald |

### Asset Locations

- Source files: `/Logo/Sunnah-Remedies-Brand-Package/`
- Deployed assets: `/public/brand/`
- Configuration: `src/lib/brand.ts`

### Rules

- Never redraw or recreate the logo
- Never distort proportions
- Never recolour assets outside approved variations
- Never apply effects, shadows, gradients, or glows
- Never place the logo on busy or low-contrast backgrounds
- Maintain clear space equal to the height of the emblem on all sides
- Minimum size: 28px height for digital, 12mm for print

---

## Colour Palette

### Primary Colours

| Token | Name | Hex | Usage |
|---|---|---|---|
| `--deep-emerald` | Deep Emerald | `#0E3B2E` | Backgrounds, headings, primary surfaces |
| `--gilt` | Antique Gold | `#C7A25A` | Accents, labels, institutional highlights |
| `--paper` | Warm Ivory | `#F6F3EE` | Page background, reading surfaces |

### Extended Palette

| Token | Purpose |
|---|---|
| `--ink` | Body text — near-black with warmth |
| `--muted` | Secondary text, metadata |
| `--gilt-soft` | Subtle gold on dark |
| `--paper-dim` | Subdued text on dark surfaces |
| `--hairline` | Borders, dividers |

### Colour Usage Rules

- Deep Emerald is the institutional colour — used for gravity, not decoration
- Antique Gold marks institutional significance — never used for alerts or errors
- Warm Ivory is the reading surface — text-heavy areas always rest on ivory
- Never introduce colours outside the approved palette
- Never use brand colours for UI feedback states (success, error, warning)

---

## Typography

### Type System

| Variable | Family | Role |
|---|---|---|
| `--font-display` | Cormorant Garamond | Display headings, institutional statements |
| `--font-body` | EB Garamond | Body text, editorial content |
| `--font-utility` | Inter | Labels, navigation, metadata, UI |
| `--font-arabic` | Amiri | Arabic text, Qur'anic references |

### Type Scale

The scale follows a modular progression:

| Class | Size | Use |
|---|---|---|
| `type-display-xl` | clamp(2.4rem, 5vw, 3.6rem) | Hero statements |
| `type-display-l` | clamp(1.8rem, 3.5vw, 2.8rem) | Section headings |
| `type-title` | clamp(1.4rem, 2.5vw, 2rem) | Subsection headings |
| `type-body-l` | clamp(1.1rem, 1.5vw, 1.25rem) | Lead paragraphs |
| `type-body` | 1rem | Standard body text |
| `type-small` | 0.875rem | Metadata, captions |
| `type-micro` | 0.75rem | Footnotes, legal |
| `type-eyebrow` | Inter, tracked, uppercase | Labels, categories |
| `type-folio` | Inter, tracked | Page numbers, folios |

### Typography Rules

- Display type is always Cormorant Garamond — light weight, generous leading
- Body copy is always EB Garamond — for sustained reading
- Navigation and UI labels are always Inter — for clarity at small sizes
- Arabic text is always Amiri — with appropriate `dir="rtl"` and `lang="ar"`
- Never bold display headings
- Never underline for emphasis (reserve for links)
- Line length never exceeds `--measure-reading` (65ch)
- Paragraph spacing uses `--s3` to `--s4`

---

## Voice & Tone

### Institutional Voice

The institution speaks with:
- **Declaration** over persuasion
- **Restraint** over enthusiasm
- **Precision** over generality
- **Accountability** over aspiration

### What the Voice Does

- States facts
- Names sources
- Declares limits
- Invites without urging
- Explains without simplifying

### What the Voice Never Does

- Uses superlatives (except the approved Threshold statement)
- Creates urgency
- Makes promises about outcomes
- Uses marketing language (revolutionary, exclusive, limited, amazing)
- Addresses the reader as a consumer
- Uses exclamation marks
- Uses emoji

### Approved Exception

The single superlative — *The world's leading institute of Prophetic Medicine* — is retained on the Threshold hero by explicit institutional decision.

---

## Brand Application

### Digital

- Website maintains institutional palette throughout
- No third-party branding visible to visitors
- No stock photography
- No generic illustrations
- All imagery follows Photography Manual

### Print

- Institutional stationery uses the horizontal lockup
- All documents carry the folio system
- Brand colours reproduced in Pantone equivalents

### Environment

- Physical spaces reflect the same restraint as digital
- Signage uses the approved logo at correct proportions
- Dispensary and clinic environments follow the material honesty principle
