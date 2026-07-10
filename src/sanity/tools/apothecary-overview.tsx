/**
 * Apothecary Product Manager overview — Studio tool.
 *
 * Counts and shortcuts for product publication health.
 * Plain HTML/CSS (same durability pattern as Operations Overview).
 */

"use client";

import { useEffect, useState } from "react";
import { useClient } from "sanity";

interface StatusCounts {
  total: number;
  active: number;
  draft: number;
  comingSoon: number;
  outOfStock: number;
  archived: number;
  featured: number;
  needsPrice: number;
  aiReview: number;
}

const EMPTY: StatusCounts = {
  total: 0,
  active: 0,
  draft: 0,
  comingSoon: 0,
  outOfStock: 0,
  archived: 0,
  featured: 0,
  needsPrice: 0,
  aiReview: 0,
};

export function ApothecaryOverview() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [counts, setCounts] = useState<StatusCounts>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const result = await client.fetch<StatusCounts>(`{
          "total": count(*[_type == "product"]),
          "active": count(*[_type == "product" && status == "active"]),
          "draft": count(*[_type == "product" && status == "draft"]),
          "comingSoon": count(*[_type == "product" && status == "coming-soon"]),
          "outOfStock": count(*[_type == "product" && (status == "out-of-stock" || stockStatus == "out-of-stock")]),
          "archived": count(*[_type == "product" && status == "archived"]),
          "featured": count(*[_type == "product" && featured == true]),
          "needsPrice": count(*[_type == "product" && status == "active" && purchaseFraming != "reference-only" && !defined(price)]),
          "aiReview": count(*[_type == "product" && aiDraft.reviewStatus == "review-required"])
        }`);
        setCounts(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load Apothecary overview");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [client]);

  const cards: { label: string; value: number; hint: string }[] = [
    { label: "All products", value: counts.total, hint: "Every language document" },
    { label: "Active", value: counts.active, hint: "Publication status active" },
    { label: "Draft", value: counts.draft, hint: "Not yet active" },
    { label: "Coming soon", value: counts.comingSoon, hint: "Announced, not selling" },
    { label: "Out of stock", value: counts.outOfStock, hint: "Status or stock flag" },
    { label: "Archived", value: counts.archived, hint: "Hidden from Apothecary" },
    { label: "Featured", value: counts.featured, hint: "Featured flag set" },
    { label: "Needs price", value: counts.needsPrice, hint: "Active shoppable without price" },
    { label: "AI review", value: counts.aiReview, hint: "AI draft awaiting approval" },
  ];

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "56rem",
        fontFamily: "Georgia, 'Times New Roman', serif",
        color: "#1a1814",
      }}
    >
      <header style={{ marginBottom: "2rem" }}>
        <p
          style={{
            margin: 0,
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#6b6560",
          }}
        >
          The Apothecary
        </p>
        <h1 style={{ margin: "0.5rem 0 0", fontSize: "1.75rem", fontWeight: 400 }}>
          Product Manager
        </h1>
        <p style={{ margin: "0.75rem 0 0", color: "#6b6560", lineHeight: 1.5, maxWidth: "36rem" }}>
          Create and edit products in Structure → The Apothecary. Use document
          actions to archive, feature, activate, or preview. AI drafts never
          publish without review
        </p>
      </header>

      {loading ? (
        <p style={{ color: "#6b6560" }}>Loading catalogue health…</p>
      ) : null}

      {error ? (
        <p style={{ color: "#8b1e1e" }}>{error}</p>
      ) : null}

      {!loading && !error ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(10rem, 1fr))",
            gap: "1rem",
          }}
        >
          {cards.map((card) => (
            <div
              key={card.label}
              style={{
                border: "1px solid #cac4b8",
                padding: "1rem",
                background: "#faf8f5",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.7rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#6b6560",
                }}
              >
                {card.label}
              </p>
              <p style={{ margin: "0.5rem 0 0", fontSize: "1.75rem" }}>{card.value}</p>
              <p style={{ margin: "0.35rem 0 0", fontSize: "0.75rem", color: "#6b6560" }}>
                {card.hint}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <section style={{ marginTop: "2.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 400, margin: "0 0 0.75rem" }}>
          Editor checklist
        </h2>
        <ol style={{ margin: 0, paddingLeft: "1.25rem", color: "#3d3a36", lineHeight: 1.7 }}>
          <li>Open Structure → The Apothecary → All Products</li>
          <li>Create a product (English), then add the Danish translation document</li>
          <li>Set Essentials, Media, Pricing, and Inventory before marking Active</li>
          <li>Use Preview on site from the document actions menu</li>
          <li>Archive instead of deleting when a remedy leaves the catalogue</li>
          <li>Keep price, stock, SKU, and media aligned across language documents</li>
        </ol>
      </section>
    </div>
  );
}
