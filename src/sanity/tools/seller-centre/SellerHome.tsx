/**
 * Seller Centre home — summary cards, filters, product table, actions.
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";
import { useRouter } from "sanity/router";
import type { SanityClient } from "sanity";
import type { RefOption, SellerProductRow, SellerView } from "./types";
import * as s from "./styles";
import {
  formatMoney,
  isHiddenProduct,
  languageCompletion,
  needsAttention,
  newKey,
  openProductPreview,
  statusLabel,
  stockLabel,
  stripDraftId,
  toDraftId,
  visibilityLabel,
} from "./utils";
import { publishProductDocument, unpublishProductDocument } from "./document";

interface SellerHomeProps {
  onNavigate: (view: SellerView) => void;
}

interface Summary {
  live: number;
  draft: number;
  hidden: number;
  outOfStock: number;
  attention: number;
}

const PRODUCT_QUERY = `*[_type == "product"] | order(_updatedAt desc) {
  _id,
  _updatedAt,
  name,
  slug,
  language,
  price,
  salePrice,
  currency,
  stockStatus,
  status,
  visibleInApothecary,
  featured,
  institutionalSummary,
  subtitle,
  volume,
  sku,
  productType,
  mainImage { alt, asset->{ url } },
  "category": category->{ _id, name },
  "collection": collection->{ _id, name },
  aiDraft { reviewStatus }
}`;

export function SellerHome({ onNavigate }: SellerHomeProps) {
  const client = useClient({ apiVersion: "2024-01-01" }) as SanityClient;
  const router = useRouter();
  const [rows, setRows] = useState<SellerProductRow[]>([]);
  const [categories, setCategories] = useState<RefOption[]>([]);
  const [collections, setCollections] = useState<RefOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [attentionOnly, setAttentionOnly] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [products, cats, cols] = await Promise.all([
        client.fetch<SellerProductRow[]>(PRODUCT_QUERY),
        client.fetch<{ _id: string; name?: string }[]>(
          `*[_type == "category"]|order(name asc){ _id, name }`,
        ),
        client.fetch<{ _id: string; name?: string }[]>(
          `*[_type == "collection"]|order(name asc){ _id, name }`,
        ),
      ]);
      setRows(products || []);
      setCategories(
        (cats || []).map((c) => ({ _id: c._id, title: c.name || c._id })),
      );
      setCollections(
        (cols || []).map((c) => ({ _id: c._id, title: c.name || c._id })),
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const summary: Summary = useMemo(() => {
    const live = rows.filter(
      (r) => r.status === "active" && r.visibleInApothecary !== false,
    ).length;
    const draft = rows.filter((r) => r.status === "draft").length;
    const hidden = rows.filter(
      (r) =>
        r.visibleInApothecary === false ||
        r.status === "draft" ||
        r.status === "archived",
    ).length;
    const outOfStock = rows.filter(
      (r) =>
        r.status === "out-of-stock" || r.stockStatus === "out-of-stock",
    ).length;
    const attention = rows.filter((r) => needsAttention(r)).length;
    return { live, draft, hidden, outOfStock, attention };
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (q && !(r.name || "").toLowerCase().includes(q)) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (visibilityFilter === "hidden" && !isHiddenProduct(r)) return false;
      if (visibilityFilter === "visible" && isHiddenProduct(r)) return false;
      if (stockFilter !== "all" && r.stockStatus !== stockFilter) return false;
      if (categoryFilter !== "all" && r.category?._id !== categoryFilter) {
        return false;
      }
      if (collectionFilter !== "all" && r.collection?._id !== collectionFilter) {
        return false;
      }
      if (attentionOnly && !needsAttention(r)) return false;
      if (languageFilter === "incomplete" && r.institutionalSummary?.trim()) {
        return false;
      }
      if (languageFilter === "ready" && !r.institutionalSummary?.trim()) {
        return false;
      }
      if (languageFilter === "en" && r.language === "da") return false;
      if (languageFilter === "da" && r.language !== "da") return false;
      return true;
    });
  }, [
    rows,
    search,
    statusFilter,
    visibilityFilter,
    stockFilter,
    categoryFilter,
    collectionFilter,
    languageFilter,
    attentionOnly,
  ]);

  async function runAction(
    row: SellerProductRow,
    action: "publish" | "unpublish" | "hide" | "archive" | "duplicate" | "restore",
  ) {
    setBusyId(row._id);
    setMenuOpen(null);
    try {
      const id = stripDraftId(row._id);
      if (action === "publish") {
        await publishProductDocument(client, row._id);
      } else if (action === "unpublish") {
        if (
          !window.confirm(
            `Unpublish “${row.name}”? It will leave the public catalogue but remain editable as a draft`,
          )
        ) {
          return;
        }
        await unpublishProductDocument(client, row._id);
      } else if (action === "hide") {
        await client.patch(row._id).set({ visibleInApothecary: false }).commit();
      } else if (action === "archive") {
        if (!window.confirm(`Archive “${row.name}”? It will leave the public catalogue.`)) {
          return;
        }
        await client
          .patch(row._id)
          .set({
            status: "archived",
            visibleInApothecary: false,
            featured: false,
          })
          .commit();
      } else if (action === "restore") {
        await client
          .patch(row._id)
          .set({ status: "draft", visibleInApothecary: false })
          .commit();
      } else if (action === "duplicate") {
        const source =
          (await client.fetch(`*[_id == $id][0]`, { id: row._id })) ||
          (await client.fetch(`*[_id == $id][0]`, { id: toDraftId(id) }));
        if (!source) throw new Error("Could not load product to duplicate");
        const copyId = `product-copy-${newKey("dup")}`;
        const slugSuffix = newKey("s").slice(-4);
        const rest = { ...(source as Record<string, unknown>) };
        delete rest._id;
        delete rest._rev;
        await client.create({
          ...rest,
          _id: toDraftId(copyId),
          _type: "product",
          name: `${row.name || "Product"} (copy)`,
          slug: {
            _type: "slug",
            current: `${row.slug?.current || "product"}-copy-${slugSuffix}`,
          },
          status: "draft",
          visibleInApothecary: false,
          featured: false,
        });
      }
      await load();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  function openAdvanced(row: SellerProductRow) {
    router.navigateIntent("edit", {
      id: stripDraftId(row._id),
      type: "product",
    });
  }

  function preview(row: SellerProductRow) {
    void (async () => {
      try {
        await openProductPreview(row, client.config().token || "");
      } catch (err) {
        window.alert(err instanceof Error ? err.message : "Preview failed");
      }
    })();
  }

  function rowActions(row: SellerProductRow): [string, () => void][] {
    const actions: [string, () => void][] = [
      ["Edit", () => onNavigate({ kind: "edit", documentId: row._id })],
      ["Preview Draft", () => preview(row)],
    ];

    if (row.status === "draft" || row.visibleInApothecary === false) {
      actions.push([
        "Resume Draft",
        () =>
          onNavigate({
            kind: "add",
            draftId: stripDraftId(row._id),
            step: 2,
          }),
      ]);
    }

    if (row.status === "archived") {
      actions.push(["Restore", () => void runAction(row, "restore")]);
      actions.push(["Open Advanced Editor", () => openAdvanced(row)]);
      return actions;
    }

    actions.push(["Duplicate", () => void runAction(row, "duplicate")]);

    if (row.status === "draft" || row.visibleInApothecary === false) {
      actions.push(["Publish", () => void runAction(row, "publish")]);
    } else {
      actions.push(["Unpublish", () => void runAction(row, "unpublish")]);
      actions.push(["Hide", () => void runAction(row, "hide")]);
    }

    actions.push(["Archive", () => void runAction(row, "archive")]);
    actions.push(["Open Advanced Editor", () => openAdvanced(row)]);
    return actions;
  }

  const cards: { label: string; value: number; hint: string; onClick?: () => void }[] = [
    {
      label: "Live Products",
      value: summary.live,
      hint: "Active and visible",
      onClick: () => {
        setStatusFilter("active");
        setVisibilityFilter("visible");
        setAttentionOnly(false);
      },
    },
    {
      label: "Draft Products",
      value: summary.draft,
      hint: "Not yet live",
      onClick: () => {
        setStatusFilter("draft");
        setVisibilityFilter("all");
        setAttentionOnly(false);
      },
    },
    {
      label: "Hidden Products",
      value: summary.hidden,
      hint: "Draft, hidden or archived",
      onClick: () => {
        setStatusFilter("all");
        setVisibilityFilter("hidden");
        setAttentionOnly(false);
      },
    },
    {
      label: "Out of Stock",
      value: summary.outOfStock,
      hint: "Unavailable to dispense",
      onClick: () => {
        setStockFilter("out-of-stock");
        setAttentionOnly(false);
      },
    },
    {
      label: "Needs Attention",
      value: summary.attention,
      hint: "AI review, price or copy",
      onClick: () => {
        setStatusFilter("all");
        setVisibilityFilter("all");
        setLanguageFilter("all");
        setAttentionOnly(true);
      },
    },
  ];

  return (
    <div style={s.shell}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1.5rem",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p style={s.eyebrow}>The Apothecary</p>
          <h1 style={s.title}>Apothecary Seller Centre</h1>
          <p style={s.lede}>
            Add Product: Details → Media → Generate Content → Price → Preview.
            Advanced scholarship fields remain available when you need them
          </p>
        </div>
        <button
          type="button"
          style={s.primaryBtn}
          onClick={() => onNavigate({ kind: "add", step: 1 })}
        >
          Add Product
        </button>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(9.5rem, 1fr))",
          gap: "0.75rem",
          marginTop: "1.75rem",
        }}
      >
        {cards.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={c.onClick}
            style={{
              ...s.card,
              textAlign: "left",
              cursor: c.onClick ? "pointer" : "default",
              width: "100%",
            }}
          >
            <p style={{ ...s.eyebrow, marginBottom: "0.35rem" }}>{c.label}</p>
            <p style={{ margin: 0, fontSize: "1.6rem" }}>{c.value}</p>
            <p style={{ ...s.help, marginTop: "0.35rem" }}>{c.hint}</p>
          </button>
        ))}
      </div>

      <section style={{ marginTop: "2rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(12rem, 1.4fr) repeat(5, minmax(7rem, 1fr))",
            gap: "0.6rem",
            marginBottom: "1rem",
          }}
        >
          <input
            style={s.input}
            placeholder="Search by product name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
          />
          <select
            style={s.input}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Status filter"
          >
            <option value="all">All statuses</option>
            <option value="active">Live</option>
            <option value="draft">Draft</option>
            <option value="coming-soon">Coming soon</option>
            <option value="out-of-stock">Out of stock</option>
            <option value="archived">Archived</option>
          </select>
          <select
            style={s.input}
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            aria-label="Stock filter"
          >
            <option value="all">All stock</option>
            <option value="in-stock">In stock</option>
            <option value="low-stock">Low stock</option>
            <option value="out-of-stock">Out of stock</option>
            <option value="backorder">Backorder</option>
          </select>
          <select
            style={s.input}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Category filter"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
          <select
            style={s.input}
            value={collectionFilter}
            onChange={(e) => setCollectionFilter(e.target.value)}
            aria-label="Collection filter"
          >
            <option value="all">All collections</option>
            {collections.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
          <select
            style={s.input}
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            aria-label="Language completion filter"
          >
            <option value="all">All languages</option>
            <option value="en">English</option>
            <option value="da">Dansk</option>
            <option value="ready">Copy ready</option>
            <option value="incomplete">Copy incomplete</option>
          </select>
        </div>

        {loading ? <p style={s.help}>Loading products…</p> : null}
        {error ? <p style={s.errorText}>{error}</p> : null}

        {!loading && !error ? (
          <div style={{ overflowX: "auto", background: "#fffdf9", border: "1px solid #e5dfd4" }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Product</th>
                  <th style={s.th}>Price</th>
                  <th style={s.th}>Stock</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Visibility</th>
                  <th style={s.th}>Updated</th>
                  <th style={s.th}>Language</th>
                  <th style={s.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td style={s.td} colSpan={8}>
                      No products match these filters
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr key={row._id}>
                      <td style={s.td}>
                        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                          <div
                            style={{
                              width: 48,
                              height: 48,
                              background: "#ece7de",
                              flexShrink: 0,
                              overflow: "hidden",
                            }}
                          >
                            {row.mainImage?.asset?.url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={row.mainImage.asset.url}
                                alt={row.mainImage.alt || row.name || ""}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            ) : null}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500 }}>{row.name || "Untitled"}</div>
                            <div style={{ ...s.help, marginTop: 2 }}>
                              {row.volume || row.productType || "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={s.td}>
                        {formatMoney(row.price, row.currency)}
                        {typeof row.salePrice === "number" ? (
                          <div style={s.help}>
                            Sale {formatMoney(row.salePrice, row.currency)}
                          </div>
                        ) : null}
                      </td>
                      <td style={s.td}>{stockLabel(row.stockStatus)}</td>
                      <td style={s.td}>{statusLabel(row.status)}</td>
                      <td style={s.td}>{visibilityLabel(row)}</td>
                      <td style={s.td}>
                        {row._updatedAt
                          ? new Date(row._updatedAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td style={s.td}>{languageCompletion(row)}</td>
                      <td style={{ ...s.td, position: "relative" }}>
                        <button
                          type="button"
                          style={s.secondaryBtn}
                          disabled={busyId === row._id}
                          onClick={() =>
                            setMenuOpen((open) => (open === row._id ? null : row._id))
                          }
                        >
                          Actions
                        </button>
                        {menuOpen === row._id ? (
                          <div
                            style={{
                              position: "absolute",
                              right: 8,
                              top: "100%",
                              zIndex: 20,
                              background: "#fffdf9",
                              border: "1px solid #d9d2c6",
                              minWidth: 180,
                              boxShadow: "0 8px 24px rgba(26,24,20,0.08)",
                            }}
                          >
                            {rowActions(row).map(([label, fn]) => (
                              <button
                                key={label}
                                type="button"
                                onClick={fn}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  textAlign: "left",
                                  border: "none",
                                  background: "transparent",
                                  padding: "0.65rem 0.85rem",
                                  cursor: "pointer",
                                  fontFamily: "system-ui, sans-serif",
                                  fontSize: "0.88rem",
                                }}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}
