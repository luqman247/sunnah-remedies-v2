/**
 * Seller Centre visual language — calm, institutional, Studio-safe inline styles.
 */

import type { CSSProperties } from "react";

export const shell: CSSProperties = {
  padding: "1.75rem 2rem 3rem",
  maxWidth: "72rem",
  margin: "0 auto",
  fontFamily: "Georgia, 'Times New Roman', serif",
  color: "#1a1814",
  background: "#f7f4ef",
  minHeight: "100%",
  boxSizing: "border-box",
};

export const eyebrow: CSSProperties = {
  margin: 0,
  fontSize: "0.7rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#6b6560",
  fontFamily: "system-ui, -apple-system, sans-serif",
};

export const title: CSSProperties = {
  margin: "0.4rem 0 0",
  fontSize: "1.85rem",
  fontWeight: 400,
  letterSpacing: "-0.02em",
};

export const lede: CSSProperties = {
  margin: "0.75rem 0 0",
  color: "#6b6560",
  lineHeight: 1.55,
  maxWidth: "38rem",
  fontSize: "0.98rem",
};

export const primaryBtn: CSSProperties = {
  appearance: "none",
  border: "none",
  background: "#1a1814",
  color: "#f7f4ef",
  padding: "0.7rem 1.25rem",
  fontSize: "0.9rem",
  letterSpacing: "0.04em",
  cursor: "pointer",
  fontFamily: "system-ui, -apple-system, sans-serif",
};

export const secondaryBtn: CSSProperties = {
  ...primaryBtn,
  background: "transparent",
  color: "#1a1814",
  border: "1px solid #c9c2b6",
};

export const ghostBtn: CSSProperties = {
  ...secondaryBtn,
  border: "none",
  textDecoration: "underline",
  paddingLeft: 0,
  paddingRight: 0,
};

export const card: CSSProperties = {
  background: "#fffdf9",
  border: "1px solid #e5dfd4",
  padding: "1rem 1.1rem",
};

export const field: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.35rem",
  marginBottom: "1rem",
};

export const label: CSSProperties = {
  fontSize: "0.78rem",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#6b6560",
  fontFamily: "system-ui, -apple-system, sans-serif",
};

export const input: CSSProperties = {
  border: "1px solid #c9c2b6",
  background: "#fff",
  padding: "0.65rem 0.75rem",
  fontSize: "0.95rem",
  fontFamily: "Georgia, 'Times New Roman', serif",
  color: "#1a1814",
};

export const help: CSSProperties = {
  margin: 0,
  fontSize: "0.82rem",
  color: "#6b6560",
  lineHeight: 1.4,
};

export const errorText: CSSProperties = {
  margin: "0.25rem 0 0",
  color: "#8b1e1e",
  fontSize: "0.85rem",
};

export const table: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.92rem",
};

export const th: CSSProperties = {
  textAlign: "left",
  padding: "0.65rem 0.5rem",
  borderBottom: "1px solid #d9d2c6",
  fontFamily: "system-ui, -apple-system, sans-serif",
  fontSize: "0.72rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#6b6560",
  fontWeight: 500,
};

export const td: CSSProperties = {
  padding: "0.75rem 0.5rem",
  borderBottom: "1px solid #ece7de",
  verticalAlign: "middle",
};

export const stepRail: CSSProperties = {
  display: "flex",
  gap: "0.5rem",
  flexWrap: "wrap",
  margin: "1.5rem 0",
  fontFamily: "system-ui, -apple-system, sans-serif",
  fontSize: "0.78rem",
};

export const dropzone: CSSProperties = {
  border: "1px dashed #b7aea0",
  background: "#fffdf9",
  padding: "1.5rem",
  textAlign: "center",
  color: "#6b6560",
  cursor: "pointer",
};
