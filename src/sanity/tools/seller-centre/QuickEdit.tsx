/**
 * Quick Edit + Advanced Settings progressive disclosure.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";
import { useRouter } from "sanity/router";
import type { SanityClient } from "sanity";
import type { SellerView } from "./types";
import * as s from "./styles";
import {
  imageRef,
  publishProductDocument,
  uploadImageAsset,
} from "./document";
import {
  callProductAi,
  formatMoney,
  newKey,
  productPreviewUrl,
  publishRequirements,
  statusLabel,
  stripDraftId,
} from "./utils";

interface QuickEditProps {
  documentId: string;
  onNavigate: (view: SellerView) => void;
}

interface EditableProduct {
  _id: string;
  name?: string;
  slug?: { current?: string };
  language?: string;
  subtitle?: string;
  institutionalSummary?: string;
  historicalContext?: string[];
  price?: number;
  salePrice?: number;
  currency?: string;
  stockStatus?: string;
  status?: string;
  visibleInApothecary?: boolean;
  featured?: boolean;
  volume?: string;
  sku?: string;
  productType?: string;
  mainImage?: { asset?: { _ref?: string; url?: string }; alt?: string };
  gallery?: Array<{
    _key?: string;
    asset?: { _ref?: string; url?: string };
    alt?: string;
  }>;
  productVideos?: Array<Record<string, unknown>>;
  seo?: { metaTitle?: string; metaDescription?: string; canonicalUrl?: string };
  commerce?: { shopifyProductId?: string };
  estimatedDispatchTime?: string;
  allowBackorder?: boolean;
  lowStockThreshold?: number;
  stockQuantity?: number;
  publishedAt?: string;
  visibilityStartsAt?: string;
  visibilityEndsAt?: string;
}

export function QuickEdit({ documentId, onNavigate }: QuickEditProps) {
  const client = useClient({ apiVersion: "2024-01-01" }) as SanityClient;
  const router = useRouter();
  const [doc, setDoc] = useState<EditableProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [fullDescription, setFullDescription] = useState("");

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const found = await client.fetch<EditableProduct | null>(
          `*[_id in [$id, $draft]]|order(_updatedAt desc)[0]{
            ...,
            mainImage{alt, asset->{_id, url}},
            gallery[]{ _key, alt, asset->{_id, url} }
          }`,
          {
            id: stripDraftId(documentId),
            draft: documentId.startsWith("drafts.")
              ? documentId
              : `drafts.${stripDraftId(documentId)}`,
          },
        );
        setDoc(found);
        setFullDescription((found?.historicalContext || []).join("\n\n"));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [client, documentId]);

  const missing = useMemo(
    () =>
      publishRequirements({
        name: doc?.name,
        slug: doc?.slug?.current,
        price: doc?.price,
        shortDescription: doc?.institutionalSummary,
        hasPrimaryImage: Boolean(doc?.mainImage?.asset?._ref || doc?.mainImage?.asset?.url),
        comingSoon: doc?.status === "coming-soon",
      }),
    [doc],
  );

  async function patch(fields: Record<string, unknown>) {
    if (!doc) return;
    setBusy(true);
    setError(null);
    try {
      const next = await client.patch(doc._id).set(fields).commit();
      setDoc((prev) => (prev ? { ...prev, ...next } : prev));
      setMessage("Saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function replaceMainImage(file: File | undefined) {
    if (!file || !doc) return;
    setBusy(true);
    try {
      const uploaded = await uploadImageAsset(client, file);
      await patch({
        mainImage: imageRef(uploaded.assetId, doc.mainImage?.alt || doc.name || "Product image"),
      });
      setDoc((prev) =>
        prev
          ? {
              ...prev,
              mainImage: {
                alt: prev.mainImage?.alt || prev.name,
                asset: { _ref: uploaded.assetId, url: uploaded.url },
              },
            }
          : prev,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function addGalleryImage(file: File | undefined) {
    if (!file || !doc) return;
    setBusy(true);
    try {
      const uploaded = await uploadImageAsset(client, file);
      const item = {
        _key: newKey("gal"),
        ...imageRef(uploaded.assetId, file.name),
      };
      await client
        .patch(doc._id)
        .setIfMissing({ gallery: [] })
        .append("gallery", [item])
        .commit();
      setDoc((prev) =>
        prev
          ? {
              ...prev,
              gallery: [
                ...(prev.gallery || []),
                {
                  _key: item._key,
                  alt: file.name,
                  asset: { _ref: uploaded.assetId, url: uploaded.url },
                },
              ],
            }
          : prev,
      );
      setMessage("Gallery image added");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gallery upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function addExternalVideo() {
    if (!doc) return;
    const url = window.prompt("Approved external video URL");
    if (!url?.trim()) return;
    const title = window.prompt("Video title", "Product video") || "Product video";
    setBusy(true);
    try {
      await client
        .patch(doc._id)
        .setIfMissing({ productVideos: [] })
        .append("productVideos", [
          {
            _key: newKey("vid"),
            title,
            externalUrl: url.trim(),
            autoplay: false,
            muted: true,
            controls: true,
            role: "product-demonstration",
          },
        ])
        .commit();
      setMessage("Video added");
      const refreshed = await client.fetch(`*[_id == $id][0]{ productVideos }`, {
        id: doc._id,
      });
      setDoc((prev) =>
        prev ? { ...prev, productVideos: refreshed?.productVideos || [] } : prev,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add video");
    } finally {
      setBusy(false);
    }
  }

  async function improveDescription() {
    if (!doc?.name) return;
    setBusy(true);
    try {
      const result = await callProductAi({
        name: doc.name,
        existingShortDescription: doc.institutionalSummary,
        existingFullDescription: fullDescription,
        action: "generate_description",
      });
      const draft = (result.draft || {}) as {
        shortDescription?: string;
        fullDescription?: string;
      };
      if (draft.shortDescription) {
        await patch({ institutionalSummary: draft.shortDescription });
      }
      if (draft.fullDescription) {
        const paragraphs = draft.fullDescription
          .split(/\n+/)
          .map((p) => p.trim())
          .filter(Boolean);
        setFullDescription(paragraphs.join("\n\n"));
        await patch({ historicalContext: paragraphs });
      }
      setMessage("AI draft applied for review — still not auto-published");
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI failed");
    } finally {
      setBusy(false);
    }
  }

  async function publishChanges() {
    if (!doc) return;
    if (missing.length) {
      setError(missing.join(". "));
      return;
    }
    setBusy(true);
    try {
      await patch({
        institutionalSummary: doc.institutionalSummary,
        historicalContext: fullDescription
          .split(/\n+/)
          .map((p) => p.trim())
          .filter(Boolean),
        status: doc.status === "coming-soon" ? "coming-soon" : "active",
        visibleInApothecary: true,
      });
      await publishProductDocument(client, doc._id);
      setMessage("Published");
      onNavigate({ kind: "home" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div style={s.shell}>
        <p style={s.help}>Loading product…</p>
      </div>
    );
  }

  if (!doc) {
    return (
      <div style={s.shell}>
        <p style={s.errorText}>{error || "Product not found"}</p>
        <button type="button" style={s.ghostBtn} onClick={() => onNavigate({ kind: "home" })}>
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div style={s.shell}>
      <button type="button" style={s.ghostBtn} onClick={() => onNavigate({ kind: "home" })}>
        ← Back to Seller Centre
      </button>
      <p style={{ ...s.eyebrow, marginTop: "1rem" }}>Quick Edit</p>
      <h1 style={s.title}>{doc.name || "Untitled product"}</h1>
      <p style={s.lede}>
        Change the fields you use most. Open Advanced Settings only when needed
      </p>

      {message ? <p style={{ ...s.help, color: "#3d5a3d" }}>{message}</p> : null}
      {error ? <p style={s.errorText}>{error}</p> : null}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", margin: "1rem 0" }}>
        <button
          type="button"
          style={s.secondaryBtn}
          onClick={() => {
            const next = window.prompt("New regular price", String(doc.price ?? ""));
            if (next == null || next === "") return;
            void patch({ price: Number(next) });
          }}
        >
          Change Price
        </button>
        <label style={s.secondaryBtn}>
          Replace Main Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => void replaceMainImage(e.target.files?.[0])}
          />
        </label>
        <label style={s.secondaryBtn}>
          Add Gallery Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => void addGalleryImage(e.target.files?.[0])}
          />
        </label>
        <button type="button" style={s.secondaryBtn} onClick={() => void addExternalVideo()}>
          Add Video
        </button>
        <button
          type="button"
          style={s.secondaryBtn}
          disabled={busy}
          onClick={() => void improveDescription()}
        >
          Generate or Improve Description
        </button>
        <button
          type="button"
          style={s.secondaryBtn}
          onClick={() => {
            const url = productPreviewUrl(doc);
            if (!url) return window.alert("Add a slug first");
            window.open(url, "_blank", "noopener,noreferrer");
          }}
        >
          Preview Draft
        </button>
        <button
          type="button"
          style={s.primaryBtn}
          disabled={busy || missing.length > 0}
          onClick={() => void publishChanges()}
        >
          Publish Changes
        </button>
      </div>

      <section style={s.card}>
        <label style={s.field}>
          <span style={s.label}>Product name</span>
          <input
            style={s.input}
            value={doc.name || ""}
            onChange={(e) => setDoc({ ...doc, name: e.target.value })}
            onBlur={() => void patch({ name: doc.name })}
          />
        </label>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={s.label}>Main image</p>
            {doc.mainImage?.asset?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={doc.mainImage.asset.url}
                alt={doc.mainImage.alt || ""}
                style={{ width: 140, height: 140, objectFit: "cover" }}
              />
            ) : (
              <div style={{ width: 140, height: 140, background: "#ece7de" }} />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <p style={s.label}>Gallery ({doc.gallery?.length || 0})</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(doc.gallery || []).map((g) =>
                g.asset?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={g._key || g.asset.url}
                    src={g.asset.url}
                    alt={g.alt || ""}
                    style={{ width: 64, height: 64, objectFit: "cover" }}
                  />
                ) : null,
              )}
            </div>
            <p style={{ ...s.help, marginTop: 8 }}>
              Videos: {doc.productVideos?.length || 0}
            </p>
          </div>
        </div>

        <label style={s.field}>
          <span style={s.label}>Price</span>
          <input
            style={s.input}
            type="number"
            value={doc.price ?? ""}
            onChange={(e) =>
              setDoc({
                ...doc,
                price: e.target.value === "" ? undefined : Number(e.target.value),
              })
            }
            onBlur={() => void patch({ price: doc.price })}
          />
          <span style={s.help}>
            Current {formatMoney(doc.price, doc.currency)}
            {typeof doc.salePrice === "number"
              ? ` · Sale ${formatMoney(doc.salePrice, doc.currency)}`
              : ""}
          </span>
        </label>

        <label style={s.field}>
          <span style={s.label}>Stock</span>
          <select
            style={s.input}
            value={doc.stockStatus || "in-stock"}
            onChange={(e) => {
              const stockStatus = e.target.value;
              setDoc({ ...doc, stockStatus });
              void patch({
                stockStatus,
                inStock: stockStatus === "in-stock" || stockStatus === "low-stock",
              });
            }}
          >
            <option value="in-stock">In stock</option>
            <option value="low-stock">Low stock</option>
            <option value="out-of-stock">Out of stock</option>
            <option value="backorder">Backorder</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </label>

        <label style={s.field}>
          <span style={s.label}>Short description</span>
          <textarea
            style={{ ...s.input, minHeight: 90 }}
            value={doc.institutionalSummary || ""}
            onChange={(e) =>
              setDoc({ ...doc, institutionalSummary: e.target.value })
            }
            onBlur={() =>
              void patch({ institutionalSummary: doc.institutionalSummary })
            }
          />
        </label>

        <label style={s.field}>
          <span style={s.label}>Full description</span>
          <textarea
            style={{ ...s.input, minHeight: 160 }}
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            onBlur={() =>
              void patch({
                historicalContext: fullDescription
                  .split(/\n+/)
                  .map((p) => p.trim())
                  .filter(Boolean),
              })
            }
          />
        </label>

        <label style={s.field}>
          <span style={s.label}>Status</span>
          <select
            style={s.input}
            value={doc.status || "draft"}
            onChange={(e) => {
              const status = e.target.value;
              setDoc({ ...doc, status });
              void patch({
                status,
                visibleInApothecary:
                  status === "active" || status === "coming-soon"
                    ? doc.visibleInApothecary !== false
                    : false,
              });
            }}
          >
            <option value="draft">Draft</option>
            <option value="active">Live</option>
            <option value="coming-soon">Coming soon</option>
            <option value="out-of-stock">Out of stock</option>
            <option value="archived">Archived</option>
          </select>
          <span style={s.help}>{statusLabel(doc.status as never)}</span>
        </label>
      </section>

      <section style={{ marginTop: "1.25rem" }}>
        <button
          type="button"
          style={s.secondaryBtn}
          onClick={() => setShowAdvanced((v) => !v)}
        >
          {showAdvanced ? "Hide Advanced Settings" : "Advanced Settings"}
        </button>
        {showAdvanced ? (
          <div style={{ ...s.card, marginTop: "0.75rem" }}>
            <p style={s.help}>
              Internal and specialist fields. Routine selling does not require these
            </p>
            <label style={s.field}>
              <span style={s.label}>Internal document ID</span>
              <input style={s.input} value={stripDraftId(doc._id)} readOnly />
            </label>
            <label style={s.field}>
              <span style={s.label}>SKU</span>
              <input
                style={s.input}
                value={doc.sku || ""}
                onChange={(e) => setDoc({ ...doc, sku: e.target.value })}
                onBlur={() => void patch({ sku: doc.sku })}
              />
            </label>
            <label style={s.field}>
              <span style={s.label}>Shopify product ID</span>
              <input
                style={s.input}
                value={doc.commerce?.shopifyProductId || ""}
                onChange={(e) =>
                  setDoc({
                    ...doc,
                    commerce: {
                      ...(doc.commerce || {}),
                      shopifyProductId: e.target.value,
                    },
                  })
                }
                onBlur={() =>
                  void patch({
                    commerce: {
                      ...(doc.commerce || {}),
                      shopifyProductId: doc.commerce?.shopifyProductId,
                    },
                  })
                }
              />
            </label>
            <label style={s.field}>
              <span style={s.label}>SEO title</span>
              <input
                style={s.input}
                value={doc.seo?.metaTitle || ""}
                onChange={(e) =>
                  setDoc({
                    ...doc,
                    seo: { ...(doc.seo || {}), metaTitle: e.target.value },
                  })
                }
                onBlur={() =>
                  void patch({
                    seo: { ...(doc.seo || {}), metaTitle: doc.seo?.metaTitle },
                  })
                }
              />
            </label>
            <label style={s.field}>
              <span style={s.label}>Meta description</span>
              <textarea
                style={{ ...s.input, minHeight: 80 }}
                value={doc.seo?.metaDescription || ""}
                onChange={(e) =>
                  setDoc({
                    ...doc,
                    seo: { ...(doc.seo || {}), metaDescription: e.target.value },
                  })
                }
                onBlur={() =>
                  void patch({
                    seo: {
                      ...(doc.seo || {}),
                      metaDescription: doc.seo?.metaDescription,
                    },
                  })
                }
              />
            </label>
            <label style={s.field}>
              <span style={s.label}>Custom canonical URL</span>
              <input
                style={s.input}
                value={doc.seo?.canonicalUrl || ""}
                onChange={(e) =>
                  setDoc({
                    ...doc,
                    seo: { ...(doc.seo || {}), canonicalUrl: e.target.value },
                  })
                }
                onBlur={() =>
                  void patch({
                    seo: {
                      ...(doc.seo || {}),
                      canonicalUrl: doc.seo?.canonicalUrl,
                    },
                  })
                }
              />
            </label>
            <label style={s.field}>
              <span style={s.label}>Visibility starts</span>
              <input
                style={s.input}
                type="datetime-local"
                value={toLocalInput(doc.visibilityStartsAt)}
                onChange={(e) => {
                  const visibilityStartsAt = fromLocalInput(e.target.value);
                  setDoc({ ...doc, visibilityStartsAt });
                  void patch({ visibilityStartsAt });
                }}
              />
            </label>
            <label style={s.field}>
              <span style={s.label}>Visibility ends</span>
              <input
                style={s.input}
                type="datetime-local"
                value={toLocalInput(doc.visibilityEndsAt)}
                onChange={(e) => {
                  const visibilityEndsAt = fromLocalInput(e.target.value);
                  setDoc({ ...doc, visibilityEndsAt });
                  void patch({ visibilityEndsAt });
                }}
              />
            </label>
            <label style={{ ...s.help, display: "flex", gap: 8 }}>
              <input
                type="checkbox"
                checked={Boolean(doc.allowBackorder)}
                onChange={(e) => {
                  setDoc({ ...doc, allowBackorder: e.target.checked });
                  void patch({ allowBackorder: e.target.checked });
                }}
              />
              Allow backorder
            </label>
            <label style={s.field}>
              <span style={s.label}>Low-stock threshold</span>
              <input
                style={s.input}
                type="number"
                value={doc.lowStockThreshold ?? 5}
                onChange={(e) =>
                  setDoc({
                    ...doc,
                    lowStockThreshold: Number(e.target.value),
                  })
                }
                onBlur={() =>
                  void patch({ lowStockThreshold: doc.lowStockThreshold })
                }
              />
            </label>
            <button
              type="button"
              style={{ ...s.secondaryBtn, marginTop: "0.75rem" }}
              onClick={() =>
                router.navigateIntent("edit", {
                  id: stripDraftId(doc._id),
                  type: "product",
                })
              }
            >
              Open full Advanced Editor
            </button>
          </div>
        ) : null}
      </section>

      {missing.length ? (
        <ul style={{ color: "#8b1e1e", marginTop: "1rem" }}>
          {missing.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function toLocalInput(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(value: string): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}
