/**
 * Institutional design tokens — Edition I
 * Binding values per Sunnah-Remedies-Design-Manual.md
 */

export const colors = {
  paper: "#ECE6D6",
  paperDeep: "#E4DCC8",
  ink: "#23201A",
  muted: "#6E6656",
  mutedLight: "#9A9081",
  myrtle: "#1E2A22",
  myrtleDeep: "#182219",
  gilt: "#96763F",
  giltSoft: "#B79A67",
  rule: "#D6CCB5",
  ruleDark: "#38443A",
  oxblood: "#8A4B3B",
  paperDim: "#CFC9B8",
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
} as const;

export const motion = {
  easing: "cubic-bezier(.2,.7,.2,1)",
  quick: "0.30s",
  base: "0.45s",
  slow: "1.10s",
} as const;

export const measure = {
  reading: "34rem",
  wide: "78rem",
} as const;

export const tagline = "Authentic Prophetic Medicine";

export const edition = "Edition I · MMXXV";
