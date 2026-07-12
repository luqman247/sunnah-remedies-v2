/**
 * Listing Centre dashboard — product list, search, open composer.
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";
import type { SanityClient } from "sanity";
import type { ListingProductRow, ListingView } from "./listing-types";
import * as s from "./styles";
import {
  formatMoney,
  statusLabel,
  stockLabel,
  stripDraftId,
} from "./utils";

interface ListingDashboardProps {
  onNavigate: (view: ListingView) => void;
}

const LIST_QUERY = `*[_type == "product"] | order(_updatedAt desc) {
  _id,
  _updatedAt,
  name,
  slug,
  language,
  price,
  currency,
  stockStatus,
  status,
  visibleInApothecary,
  featured,
  institutionalSummary,
  mainImage { alt, asset->{ url } }
}`;

export function ListingDashboard({ onNavigate }: ListingDashboardProps) {
  const client = useClient({ apiVersion: "2024-01-01" }) as SanityClient;
  const [rows, setRows] = useState<ListingProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await client.fetch<ListingProductRow[]>(LIST_QUERY);
      setRows(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load products");
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!q) return true;
      return (
        row.name?.toLowerCase().includes(q) ||
        row.slug?.current?.toLowerCase().includes(q) ||
        false
      );
    });
  }, [rows, search, statusFilter]);

  return (
    <div style={s.shell}>
      <p style={s.eyebrow}>The Apothecary</p>
      <h1 style={s.title}>Listing Centre</h1>
      <p style={s.lede}>
        Compose product listings in one page. Media and AI arrive in later
        milestones. The Seller Centre remains available for the guided workflow.
      </p>

      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginTop: "1.75rem",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          style={s.primaryBtn}
          onClick={() => onNavigate({ kind: "add" })}
        >
          Add product
        </button>
        <button type="button" style={s.secondaryBtn} onClick={() => void load()}>
          Refresh
        </button>
        <input
          style={{ ...s.input, minWidth: "14rem", marginBottom: 0 }}
          placeholder="Search by name or slug"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search products"
        />
        <select
          style={{ ...s.input, marginBottom: 0 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="coming-soon">Coming soon</option>
          <option value="out-of-stock">Out of stock</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {error ? <p style={s.errorText}>{error}</p> : null}
      {loading ? (
        <p style={{ ...s.help, marginTop: "1.5rem" }}>Loading products…</p>
      ) : (
        <div style={{ ...s.card, marginTop: "1.5rem", overflowX: "auto" }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Name</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Price</th>
                <th style={s.th}>Stock</th>
                <th style={s.th}>Updated</th>
                <th style={s.th}> </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row._id}>
                  <td style={s.td}>
                    <div>{row.name || "Untitled"}</div>
                    <div style={s.help}>{row.slug?.current || "—"}</div>
                  </td>
                  <td style={s.td}>{statusLabel(row.status)}</td>
                  <td style={s.td}>
                    {formatMoney(row.price, row.currency || "GBP")}
                  </td>
                  <td style={s.td}>{stockLabel(row.stockStatus)}</td>
                  <td style={s.td}>
                    {row._updatedAt
                      ? new Date(row._updatedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td style={s.td}>
                    <button
                      type="button"
                      style={s.ghostBtn}
                      onClick={() =>
                        onNavigate({
                          kind: "edit",
                          documentId: stripDraftId(row._id),
                        })
                      }
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td style={s.td} colSpan={6}>
                    No products match this view.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
