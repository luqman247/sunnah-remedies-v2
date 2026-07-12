/**
 * Listing Centre composer — single-page shell.
 * Milestone 1: identity, commerce, SEO, visibility + save / preview / publish.
 * Media and AI deferred.
 */

"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useClient } from "sanity";
import type { SanityClient } from "sanity";
import type { ListingComposerState, ListingView } from "./listing-types";
import { emptyComposerState } from "./listing-types";
import * as s from "./styles";
import {
  hydrateComposerFromSanity,
  publishProductDocument,
  saveComposerDraft,
} from "./document";
import {
  openProductPreview,
  publishRequirements,
  slugify,
  statusLabel,
} from "./utils";

interface ListingComposerProps {
  documentId?: string;
  onNavigate: (view: ListingView) => void;
}

const stickyBar: CSSProperties = {
  position: "sticky",
  bottom: 0,
  marginTop: "2rem",
  padding: "1rem 0",
  background: "linear-gradient(transparent, #f7f4ef 30%)",
  display: "flex",
  gap: "0.75rem",
  flexWrap: "wrap",
  alignItems: "center",
};

const sectionTitle: CSSProperties = {
  margin: "0 0 0.75rem",
  fontSize: "1.15rem",
  fontWeight: 400,
};

const sectionCard: CSSProperties = {
  ...s.card,
  marginTop: "1.25rem",
};

export function ListingComposer({
  documentId,
  onNavigate,
}: ListingComposerProps) {
  const client = useClient({ apiVersion: "2024-01-01" }) as SanityClient;
  const [state, setState] = useState<ListingComposerState>(emptyComposerState);
  const [loading, setLoading] = useState(Boolean(documentId));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(Boolean(documentId));

  useEffect(() => {
    if (!documentId) return;
    let cancelled = false;
    setLoading(true);
    void hydrateComposerFromSanity(client, documentId)
      .then((next) => {
        if (!cancelled) {
          setState(next);
          setSlugTouched(true);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load product");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [client, documentId]);

  const missing = useMemo(
    () =>
      publishRequirements({
        name: state.name,
        slug: state.slug,
        hasPrimaryImage: state.hasPrimaryImage,
        shortDescription: state.institutionalSummary,
        price: state.price === "" ? "" : Number(state.price),
        comingSoon: false,
      }),
    [state],
  );

  function patch(partial: Partial<ListingComposerState>) {
    setState((prev) => ({ ...prev, ...partial }));
    setMessage(null);
  }

  async function saveDraft() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const id = await saveComposerDraft(client, state);
      setState((prev) => ({
        ...prev,
        documentId: id,
        status: "draft",
        visibleInApothecary: false,
      }));
      setMessage("Draft saved. Not visible on the public Apothecary.");
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("edit", id);
        url.searchParams.delete("add");
        window.history.replaceState({}, "", url.toString());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function preview() {
    setBusy(true);
    setError(null);
    try {
      const id = await saveComposerDraft(client, state);
      setState((prev) => ({
        ...prev,
        documentId: id,
        status: "draft",
        visibleInApothecary: false,
      }));
      await openProductPreview(
        {
          _id: id,
          slug: { current: state.slug },
          language: state.language,
        },
        client.config().token || "",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview failed");
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (missing.length) {
      setError(missing.join(" · "));
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const id = state.documentId || (await saveComposerDraft(client, state));
      await saveComposerDraft(client, { ...state, documentId: id });
      await publishProductDocument(client, id);
      const refreshed = await hydrateComposerFromSanity(client, id);
      setState(refreshed);
      setMessage("Published. Visible in the Apothecary when status allows.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div style={s.shell}>
        <p style={s.help}>Loading listing…</p>
      </div>
    );
  }

  return (
    <div style={s.shell}>
      <button
        type="button"
        style={s.ghostBtn}
        onClick={() => onNavigate({ kind: "home" })}
      >
        ← Back to Listing Centre
      </button>

      <p style={{ ...s.eyebrow, marginTop: "1.25rem" }}>Listing composer</p>
      <h1 style={s.title}>
        {state.documentId ? state.name || "Edit listing" : "New listing"}
      </h1>
      <p style={s.lede}>
        Single-page shell. Media upload and AI generation are deferred. Save
        drafts privately, preview securely, then publish when ready.
      </p>

      {error ? <p style={s.errorText}>{error}</p> : null}
      {message ? <p style={{ ...s.help, color: "#1a1814" }}>{message}</p> : null}

      <section style={sectionCard} aria-labelledby="identity-heading">
        <h2 id="identity-heading" style={sectionTitle}>
          Identity
        </h2>
        <div style={s.field}>
          <label style={s.label} htmlFor="lc-name">
            Product name
          </label>
          <input
            id="lc-name"
            style={s.input}
            value={state.name}
            onChange={(e) => {
              const name = e.target.value;
              patch({
                name,
                ...(slugTouched ? {} : { slug: slugify(name) }),
              });
            }}
          />
        </div>
        <div style={s.field}>
          <label style={s.label} htmlFor="lc-slug">
            Slug
          </label>
          <input
            id="lc-slug"
            style={s.input}
            value={state.slug}
            onChange={(e) => {
              setSlugTouched(true);
              patch({ slug: slugify(e.target.value) });
            }}
          />
        </div>
        <div style={s.field}>
          <label style={s.label} htmlFor="lc-subtitle">
            Subtitle
          </label>
          <input
            id="lc-subtitle"
            style={s.input}
            value={state.subtitle}
            onChange={(e) => patch({ subtitle: e.target.value })}
          />
        </div>
        <div style={s.field}>
          <label style={s.label} htmlFor="lc-summary">
            Short description
          </label>
          <textarea
            id="lc-summary"
            style={{ ...s.input, minHeight: "5rem", resize: "vertical" }}
            value={state.institutionalSummary}
            onChange={(e) => patch({ institutionalSummary: e.target.value })}
            maxLength={600}
          />
          <p style={s.help}>Maps to institutionalSummary.</p>
        </div>
      </section>

      <section style={sectionCard} aria-labelledby="media-heading">
        <h2 id="media-heading" style={sectionTitle}>
          Media
        </h2>
        <p style={s.help}>
          Image and video upload is deferred. Public image source of truth
          remains mainImage / primaryLibraryImage. Do not publish catalogue
          products until a primary image exists
          {state.hasPrimaryImage ? " — this listing already has one." : "."}
        </p>
      </section>

      <section style={sectionCard} aria-labelledby="commerce-heading">
        <h2 id="commerce-heading" style={sectionTitle}>
          Commerce
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
            gap: "0.75rem",
          }}
        >
          <div style={s.field}>
            <label style={s.label} htmlFor="lc-price">
              Regular price
            </label>
            <input
              id="lc-price"
              style={s.input}
              inputMode="decimal"
              value={state.price}
              onChange={(e) => patch({ price: e.target.value })}
            />
          </div>
          <div style={s.field}>
            <label style={s.label} htmlFor="lc-sale">
              Sale price
            </label>
            <input
              id="lc-sale"
              style={s.input}
              inputMode="decimal"
              value={state.salePrice}
              onChange={(e) => patch({ salePrice: e.target.value })}
            />
          </div>
          <div style={s.field}>
            <label style={s.label} htmlFor="lc-currency">
              Currency
            </label>
            <select
              id="lc-currency"
              style={s.input}
              value={state.currency}
              onChange={(e) =>
                patch({ currency: e.target.value === "DKK" ? "DKK" : "GBP" })
              }
            >
              <option value="GBP">GBP</option>
              <option value="DKK">DKK</option>
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label} htmlFor="lc-volume">
              Volume
            </label>
            <input
              id="lc-volume"
              style={s.input}
              value={state.volume}
              onChange={(e) => patch({ volume: e.target.value })}
              placeholder="e.g. 250ml"
            />
          </div>
          <div style={s.field}>
            <label style={s.label} htmlFor="lc-stock">
              Stock status
            </label>
            <select
              id="lc-stock"
              style={s.input}
              value={state.stockStatus}
              onChange={(e) =>
                patch({
                  stockStatus: e.target
                    .value as ListingComposerState["stockStatus"],
                })
              }
            >
              <option value="in-stock">In stock</option>
              <option value="low-stock">Low stock</option>
              <option value="out-of-stock">Out of stock</option>
              <option value="backorder">Backorder</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label} htmlFor="lc-dispatch">
              Dispatch estimate
            </label>
            <input
              id="lc-dispatch"
              style={s.input}
              value={state.estimatedDispatchTime}
              onChange={(e) => patch({ estimatedDispatchTime: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section style={sectionCard} aria-labelledby="seo-heading">
        <h2 id="seo-heading" style={sectionTitle}>
          SEO
        </h2>
        <div style={s.field}>
          <label style={s.label} htmlFor="lc-seo-title">
            Meta title
          </label>
          <input
            id="lc-seo-title"
            style={s.input}
            value={state.seoTitle}
            onChange={(e) => patch({ seoTitle: e.target.value })}
            maxLength={70}
          />
        </div>
        <div style={s.field}>
          <label style={s.label} htmlFor="lc-seo-desc">
            Meta description
          </label>
          <textarea
            id="lc-seo-desc"
            style={{ ...s.input, minHeight: "4rem", resize: "vertical" }}
            value={state.seoDescription}
            onChange={(e) => patch({ seoDescription: e.target.value })}
            maxLength={160}
          />
        </div>
        <div style={s.field}>
          <label style={s.label} htmlFor="lc-seo-kw">
            Keywords
          </label>
          <input
            id="lc-seo-kw"
            style={s.input}
            value={state.seoKeywords}
            onChange={(e) => patch({ seoKeywords: e.target.value })}
            placeholder="Comma-separated"
          />
        </div>
      </section>

      <section style={sectionCard} aria-labelledby="visibility-heading">
        <h2 id="visibility-heading" style={sectionTitle}>
          Visibility
        </h2>
        <p style={s.help}>
          Status: <strong>{statusLabel(state.status)}</strong>
          {state.documentId ? ` · ${state.documentId}` : ""}
        </p>
        <label
          style={{
            ...s.help,
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            marginTop: "0.75rem",
            color: "#1a1814",
          }}
        >
          <input
            type="checkbox"
            checked={state.featured}
            onChange={(e) => patch({ featured: e.target.checked })}
          />
          Featured (applied on next publish / save cycle)
        </label>
        <p style={{ ...s.help, marginTop: "0.75rem" }}>
          Save Draft always keeps the listing private. Publish sets status
          active and visibleInApothecary.
        </p>
      </section>

      <div style={stickyBar}>
        <button
          type="button"
          style={s.secondaryBtn}
          disabled={busy}
          onClick={() => void saveDraft()}
        >
          Save draft
        </button>
        <button
          type="button"
          style={s.secondaryBtn}
          disabled={busy || !state.slug.trim()}
          onClick={() => void preview()}
        >
          Preview
        </button>
        <button
          type="button"
          style={s.primaryBtn}
          disabled={busy}
          onClick={() => void publish()}
          title={
            missing.length
              ? missing.join(" · ")
              : "Publish to the public Apothecary"
          }
        >
          Publish
        </button>
        {missing.length ? (
          <span style={s.help}>Publish needs: {missing.join(" · ")}</span>
        ) : null}
      </div>
    </div>
  );
}
