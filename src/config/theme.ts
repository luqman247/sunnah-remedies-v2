/**
 * Canonical design tokens — single TypeScript source of truth.
 * CSS custom properties in src/styles/tokens.css are generated from these values.
 * @see docs/Phase 1/Sunnah-Remedies-Design-Manual.md · Edition I
 */

export const colors = {
  /* Edition I — public surfaces (globals.css runtime) */
  paper: "#ECE6D8",
  paperDeep: "#E3DBC9",
  paperDim: "#cfc9b8",
  paperOnDeep: "#E8E1D0",
  ink: "#201D16",
  inkSoft: "#4A4638",
  muted: "#6e6656",
  mutedLight: "#9a9081",
  sage: "#3C4733",
  sageDeep: "#232A1E",
  myrtle: "#1E2A22",
  myrtleDeep: "#182219",
  brass: "#9A7B4F",
  gilt: "#96763F",
  giltSoft: "#b79a67",
  rule: "#d6ccb5",
  ruleDark: "#38443a",
  oxblood: "#8a4b3b",

  /* Brand / staff surfaces */
  warmIvory: "#F6F3EE",
  deepEmerald: "#0E3B2E",

  /* Execution plan clinical anchor (documented; email templates) */
  clinicalAnchor: "#0A2B21",
} as const;

export const colorsDark = {
  paper: "#1a1814",
  paperDeep: "#141210",
  paperDim: "#cfc9b8",
  paperOnDeep: "#d6ccb5",
  ink: "#e8e2d4",
  inkSoft: "#b0a89a",
  muted: "#9a9081",
  mutedLight: "#6e6656",
  sage: "#2a3028",
  sageDeep: "#1a1f18",
  myrtleDeep: "#0e0c0a",
  brass: "#c7a25a",
  giltSoft: "#b79a67",
  rule: "#38332a",
  ruleDark: "#d6ccb5",
  oxblood: "#c47a68",
} as const;

export const spacing = {
  s1: "0.5rem",
  s2: "0.75rem",
  s3: "1rem",
  s4: "1.5rem",
  s5: "2.5rem",
  s6: "4rem",
  s7: "6rem",
  s8: "9rem",
  space1: "4px",
  space2: "8px",
  space3: "12px",
  space4: "16px",
  space5: "24px",
  space6: "32px",
  space8: "48px",
  space10: "64px",
  space12: "96px",
  space16: "128px",
  space20: "160px",
} as const;

export const radius = {
  base: "2px",
} as const;

export const shadows = {
  masthead: "0 1px 0 color-mix(in srgb, var(--ink) 8%, transparent)",
  subtle: "0 1px 2px color-mix(in srgb, var(--ink) 6%, transparent)",
  elevated: "0 4px 12px color-mix(in srgb, var(--ink) 8%, transparent)",
} as const;

export const motion = {
  ease: "cubic-bezier(0.2, 0.7, 0.2, 1)",
  easeOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  durationQuick: "0.3s",
  durationBase: "0.45s",
  durationSlow: "1.1s",
} as const;

export const measure = {
  reading: "34rem",
  wide: "78rem",
} as const;

export const typeScale = [
  { name: "display-xl", className: "type-display-xl", sample: "Institute of Prophetic Medicine" },
  { name: "display-l", className: "type-display-l", sample: "The Apothecary" },
  { name: "lede", className: "type-lede", sample: "Traditional healing under one house" },
  { name: "title", className: "type-title", sample: "Monograph · Black seed oil" },
  { name: "body-l", className: "type-body-l", sample: "Evidence-informed practice rooted in scholarship." },
  { name: "body", className: "type-body", sample: "The tradition is a trust we inherit and must return improved." },
  { name: "eyebrow", className: "type-eyebrow", sample: "The Academy" },
  { name: "folio", className: "type-folio", sample: "Folio I" },
  { name: "micro", className: "type-micro", sample: "Catalogue reference" },
  { name: "arabic", className: "type-arabic", sample: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" },
  { name: "arabic-display", className: "type-arabic-display", sample: "الشِّفَاءُ" },
] as const;

export const palette = [
  { name: "paper", token: "paper", hex: colors.paper },
  { name: "paper-deep", token: "paper-deep", hex: colors.paperDeep },
  { name: "ink", token: "ink", hex: colors.ink },
  { name: "muted", token: "muted", hex: colors.muted },
  { name: "sage", token: "sage", hex: colors.sage },
  { name: "sage-deep", token: "sage-deep", hex: colors.sageDeep },
  { name: "brass", token: "brass", hex: colors.brass },
  { name: "oxblood", token: "oxblood", hex: colors.oxblood },
  { name: "warm-ivory", token: "warm-ivory", hex: colors.warmIvory },
  { name: "deep-emerald", token: "emerald", hex: colors.deepEmerald },
  { name: "clinical-anchor", token: "clinical-anchor", hex: colors.clinicalAnchor },
] as const;

export const brandColors = {
  deepEmerald: colors.deepEmerald,
  antiqueGold: "#C7A25A",
  warmIvory: colors.warmIvory,
} as const;

export const tagline = "Institute of Prophetic Medicine";
export const edition = "Edition I · MMXXV";
