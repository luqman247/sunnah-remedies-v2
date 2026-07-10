/**
 * Studio input for Shopify Product GIDs.
 *
 * Editors paste a Product GID from Shopify Admin. Full Admin API product
 * picker ships when credentials are wired; this input enforces GID format.
 * Uses plain HTML/CSS (same durability pattern as Operations Overview).
 *
 * @see Phase 4 Part 2, Spec 09 §9.4
 */

"use client";

import { set, unset, type StringInputProps } from "sanity";

const PRODUCT_GID = /^gid:\/\/shopify\/Product\/\d+$/;

export function ShopifyProductIdInput(props: StringInputProps) {
  const { value, onChange, readOnly, id, elementProps } = props;
  const trimmed = typeof value === "string" ? value.trim() : "";
  const hasValue = trimmed.length > 0;
  const isValid = !hasValue || PRODUCT_GID.test(trimmed);

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <input
        {...elementProps}
        id={id}
        type="text"
        value={value ?? ""}
        readOnly={readOnly}
        placeholder="gid://shopify/Product/1234567890"
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "0.65rem 0.75rem",
          border: `1px solid ${hasValue && !isValid ? "#8b1e1e" : "#cac4b8"}`,
          borderRadius: "2px",
          fontFamily: "inherit",
          fontSize: "0.875rem",
          background: readOnly ? "#f5f3ef" : "#fff",
        }}
        onChange={(event) => {
          const next = event.currentTarget.value;
          onChange(next ? set(next) : unset());
        }}
      />
      <p
        style={{
          margin: 0,
          fontSize: "0.75rem",
          lineHeight: 1.45,
          color: hasValue && !isValid ? "#8b1e1e" : "#6b6560",
        }}
      >
        {hasValue && !isValid
          ? "Must match gid://shopify/Product/{digits}."
          : "Authoritative join key. Paste the Shopify Product GID from Admin. Do not invent IDs — handle alone is never sufficient."}
      </p>
    </div>
  );
}
