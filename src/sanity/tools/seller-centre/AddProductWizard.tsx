/**
 * Guided five-step Add Product workflow.
 */

"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useClient } from "sanity";
import { useRouter } from "sanity/router";
import type { SanityClient } from "sanity";
import type {
  AcceptedContent,
  AiProposal,
  RefOption,
  SellerView,
  WizardDetails,
  WizardMediaImage,
  WizardPricing,
  WizardVideo,
} from "./types";
import * as s from "./styles";
import {
  buildProductId,
  hydrateWizardFromSanity,
  publishProductDocument,
  saveWizardDraft,
  uploadImageAsset,
  wizardToDocumentFields,
} from "./document";
import {
  callProductAi,
  emptyAcceptedContent,
  generateSku,
  newKey,
  productPreviewUrl,
  publishRequirements,
  slugify,
  stockLabel,
  stripDraftId,
} from "./utils";
import {
  clearWizardPersistence,
  loadWizardPersistence,
  saveWizardPersistence,
} from "./persistence";

interface AddProductWizardProps {
  onNavigate: (view: SellerView) => void;
  initialStep?: number;
  resumeDraftId?: string;
}

const STEPS = [
  "Details",
  "Media",
  "Generate Content",
  "Price",
  "Preview",
] as const;

const PRODUCT_TYPES = [
  { value: "remedy", label: "Remedy" },
  { value: "oil", label: "Oil" },
  { value: "honey", label: "Honey" },
  { value: "herb", label: "Herb" },
  { value: "supplement", label: "Supplement" },
  { value: "book", label: "Book" },
  { value: "equipment", label: "Equipment" },
  { value: "gift", label: "Gift" },
  { value: "other", label: "Other" },
];

const emptyDetails = (): WizardDetails => ({
  name: "",
  slug: "",
  categoryId: "",
  productType: "remedy",
  volume: "",
  origin: "",
  ingredientsText: "",
  intendedUse: "",
  brandId: "",
  sku: "",
});

const emptyPricing = (): WizardPricing => ({
  price: "",
  salePrice: "",
  currency: "GBP",
  stockStatus: "in-stock",
  stockQuantity: "",
  lowStockThreshold: 5,
  comingSoon: false,
  allowBackorder: false,
  estimatedDispatchTime: "",
  visibleInApothecary: false,
  featured: false,
});

export function AddProductWizard({
  onNavigate,
  initialStep = 1,
  resumeDraftId,
}: AddProductWizardProps) {
  const client = useClient({ apiVersion: "2024-01-01" }) as SanityClient;
  const router = useRouter();
  const restored = typeof window !== "undefined" ? loadWizardPersistence() : null;
  const [step, setStep] = useState(restored?.step || initialStep);
  const [details, setDetails] = useState<WizardDetails>(
    restored?.details || emptyDetails,
  );
  const [slugTouched, setSlugTouched] = useState(restored?.slugTouched || false);
  const [images, setImages] = useState<WizardMediaImage[]>(restored?.images || []);
  const [videos, setVideos] = useState<WizardVideo[]>(restored?.videos || []);
  const [libraryVideos, setLibraryVideos] = useState<RefOption[]>([]);
  const [categories, setCategories] = useState<RefOption[]>([]);
  const [brands, setBrands] = useState<RefOption[]>([]);
  const [content, setContent] = useState<AcceptedContent>(
    restored?.content || emptyAcceptedContent,
  );
  const [proposal, setProposal] = useState<AiProposal | null>(null);
  const [pricing, setPricing] = useState<WizardPricing>(
    restored?.pricing || emptyPricing,
  );
  const [showVariants, setShowVariants] = useState(false);
  const [showRefine, setShowRefine] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [variantNote, setVariantNote] = useState(restored?.variantNote || "");
  const [publishedId, setPublishedId] = useState<string | null>(
    resumeDraftId || restored?.publishedId || null,
  );
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [hydrating, setHydrating] = useState(Boolean(resumeDraftId));
  const [dirty, setDirty] = useState(Boolean(restored?.details.name));
  const [message, setMessage] = useState<string | null>(
    restored?.details.name && !resumeDraftId
      ? "Recovered your previous draft from this browser"
      : null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const [cats, brs, vids] = await Promise.all([
        client.fetch<{ _id: string; name?: string }[]>(
          `*[_type == "category"]|order(name asc){_id,name}`,
        ),
        client.fetch<{ _id: string; name?: string }[]>(
          `*[_type == "brand"]|order(name asc){_id,name}`,
        ),
        client.fetch<{ _id: string; title?: string }[]>(
          `*[_type == "videoAsset"]|order(title asc){_id,title}`,
        ),
      ]);
      setCategories((cats || []).map((c) => ({ _id: c._id, title: c.name || c._id })));
      setBrands((brs || []).map((b) => ({ _id: b._id, title: b.name || b._id })));
      setLibraryVideos(
        (vids || []).map((v) => ({ _id: v._id, title: v.title || v._id })),
      );
    })();
  }, [client]);

  // Prefer Sanity draft when resuming a known product id
  useEffect(() => {
    if (!resumeDraftId) return;
    let cancelled = false;
    void (async () => {
      try {
        const hydrated = await hydrateWizardFromSanity(client, resumeDraftId);
        if (cancelled || !hydrated) return;
        setPublishedId(hydrated.publishedId);
        setDetails(hydrated.details);
        setImages(hydrated.images);
        setVideos(hydrated.videos);
        setContent(hydrated.content);
        setPricing(hydrated.pricing);
        setSlugTouched(true);
        setStep(initialStep);
        setDirty(true);
        setMessage("Loaded draft from Sanity");
        clearWizardPersistence();
      } catch {
        // Keep localStorage recovery if Sanity hydrate fails
      } finally {
        if (!cancelled) setHydrating(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [client, resumeDraftId, initialStep]);

  useEffect(() => {
    if (!dirty && !details.name.trim()) return;
    saveWizardPersistence({
      publishedId,
      step,
      details,
      slugTouched,
      images,
      videos,
      content,
      pricing,
      variantNote,
    });
  }, [
    dirty,
    publishedId,
    step,
    details,
    slugTouched,
    images,
    videos,
    content,
    pricing,
    variantNote,
  ]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty || busy) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty, busy]);

  const missing = useMemo(
    () =>
      publishRequirements({
        name: details.name,
        slug: details.slug,
        price: pricing.price,
        shortDescription: content.shortDescription,
        hasPrimaryImage: images.some((i) => i.isPrimary) || images.length > 0,
        comingSoon: pricing.comingSoon,
      }),
    [details, pricing, content, images],
  );

  function markDirty() {
    setDirty(true);
  }

  function updateName(name: string) {
    markDirty();
    setDetails((d) => ({
      ...d,
      name,
      slug: slugTouched ? d.slug : slugify(name),
      sku: d.sku || (name.trim() ? generateSku(name) : ""),
    }));
  }

  function requestLeave(next: SellerView) {
    if (
      dirty &&
      !window.confirm(
        "Leave this product workflow? Your progress is kept in this browser and any Sanity draft already saved",
      )
    ) {
      return;
    }
    onNavigate(next);
  }

  async function goToStep(next: number) {
    setStep(next);
    markDirty();
    if (details.name.trim() && details.slug.trim()) {
      try {
        const id = publishedId || buildProductId(details.slug);
        setPublishedId(id);
        const fields = wizardToDocumentFields({
          details,
          images,
          videos,
          content,
          pricing: { ...pricing, visibleInApothecary: false },
        });
        await saveWizardDraft(client, id, fields);
        setMessage("Progress saved as draft");
      } catch {
        // Local persistence still holds the step state
      }
    }
  }

  async function handleImageFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setError(null);
    markDirty();
    for (const file of Array.from(fileList)) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files can be uploaded here");
        continue;
      }
      try {
        setUploadPct(0);
        const uploaded = await uploadImageAsset(client, file, setUploadPct);
        setImages((prev) => {
          const next: WizardMediaImage = {
            _key: newKey("img"),
            assetId: uploaded.assetId,
            url: uploaded.url,
            alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
            isPrimary: prev.length === 0,
          };
          return [...prev, next];
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Image upload failed");
      } finally {
        setUploadPct(null);
      }
    }
  }

  function reorderImage(index: number, direction: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      const tmp = next[index];
      next[index] = next[target];
      next[target] = tmp;
      return next;
    });
  }

  async function generateAi(
    action:
      | "generate_description"
      | "make_shorter"
      | "make_detailed"
      | "make_editorial"
      | "make_clinical"
      | "translate_da"
      | "improve_seo"
      | "generate_faqs"
      | "generate_alt_text" = "generate_description",
  ) {
    if (!details.name.trim()) {
      setError("Enter a product name before generating content");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const categoryTitle = categories.find((c) => c._id === details.categoryId)?.title;
      const result = await callProductAi({
        name: details.name,
        category: categoryTitle,
        ingredients: details.ingredientsText
          ? details.ingredientsText.split(",").map((x) => x.trim()).filter(Boolean)
          : undefined,
        origin: details.origin || undefined,
        formatOrSize: details.volume || undefined,
        intendedUse: details.intendedUse || undefined,
        existingShortDescription: content.shortDescription || undefined,
        existingFullDescription: content.fullDescription || undefined,
        action,
        language: action === "translate_da" ? "da" : "en",
        tone:
          action === "make_editorial"
            ? "premium editorial"
            : action === "make_clinical"
              ? "educational clinical"
              : undefined,
      });
      const draft = (result.draft || {}) as AiProposal & {
        shortDescription?: string;
        fullDescription?: string;
        productStory?: string;
        howToUse?: string;
        warnings?: string[];
      };
      setProposal({
        subtitle: draft.subtitle,
        shortDescription: draft.shortDescription,
        fullDescription:
          draft.fullDescription ||
          [draft.productStory, draft.sourcingParagraph, draft.howToUse]
            .filter(Boolean)
            .join("\n\n"),
        keyQualities: draft.keyQualities,
        sourcingParagraph: draft.sourcingParagraph,
        howToUse: draft.howToUse,
        storageGuidance: draft.storageGuidance,
        faqs: draft.faqs,
        seoTitle: draft.seoTitle,
        metaDescription: draft.metaDescription,
        altTextSuggestions: draft.altTextSuggestions,
        danishDraft:
          action === "translate_da"
            ? draft.fullDescription || draft.shortDescription
            : draft.danishDraft,
        warnings: draft.warnings,
      });
      setMessage("AI draft — review required");
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI generation failed");
    } finally {
      setBusy(false);
    }
  }

  function acceptAllProposal() {
    if (!proposal) return;
    setContent({
      subtitle: proposal.subtitle || content.subtitle,
      shortDescription: proposal.shortDescription || content.shortDescription,
      fullDescription: proposal.fullDescription || content.fullDescription,
      keyQualities: proposal.keyQualities || content.keyQualities,
      sourcingParagraph: proposal.sourcingParagraph || content.sourcingParagraph,
      howToUse: proposal.howToUse || content.howToUse,
      storageGuidance: proposal.storageGuidance || content.storageGuidance,
      faqs: proposal.faqs || content.faqs,
      seoTitle: proposal.seoTitle || content.seoTitle,
      metaDescription: proposal.metaDescription || content.metaDescription,
    });
    if (proposal.altTextSuggestions?.[0] && images[0]) {
      setImages((prev) =>
        prev.map((img, i) =>
          i === 0 ? { ...img, alt: proposal.altTextSuggestions![0] } : img,
        ),
      );
    }
    setMessage("Accepted AI sections into the draft. Still not published");
  }

  function acceptSection(key: keyof AcceptedContent) {
    if (!proposal) return;
    setContent((prev) => {
      const next = { ...prev };
      const value = proposal[key as keyof AiProposal];
      if (typeof value === "string") (next as Record<string, unknown>)[key] = value;
      if (Array.isArray(value)) (next as Record<string, unknown>)[key] = value;
      return next;
    });
  }

  async function persist(mode: "draft" | "publish") {
    if (busy) return;
    if (!details.name.trim() || !details.slug.trim()) {
      setError("Name and slug are required to save");
      return;
    }
    if (mode === "publish" && missing.length) {
      setError(missing.join(". "));
      return;
    }
    if (
      mode === "publish" &&
      !window.confirm(
        "Publish this product to the public Apothecary? It will become visible to visitors",
      )
    ) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const id = publishedId || buildProductId(details.slug);
      setPublishedId(id);
      const fields = wizardToDocumentFields({
        details,
        images,
        videos,
        content,
        pricing: {
          ...pricing,
          // Keep hidden until explicit publish
          visibleInApothecary: false,
        },
      });
      if (variantNote.trim()) {
        (fields as { availabilityMessage?: string }).availabilityMessage =
          `Options: ${variantNote.trim()}`;
      }
      const draftId = await saveWizardDraft(client, id, fields);
      if (mode === "publish") {
        await publishProductDocument(client, draftId);
        clearWizardPersistence();
        setDirty(false);
        setMessage("Product published to the Apothecary");
        onNavigate({ kind: "home" });
      } else {
        setMessage("Draft saved. Not visible publicly");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  function previewDraft() {
    const url = productPreviewUrl({
      _id: publishedId || undefined,
      slug: { current: details.slug },
      language: "en",
    });
    if (!url) {
      setError("Add a slug before previewing");
      return;
    }
    void persist("draft").then(() => {
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  return (
    <div style={s.shell}>
      <button type="button" style={s.ghostBtn} onClick={() => requestLeave({ kind: "home" })}>
        ← Back to Seller Centre
      </button>
      <p style={{ ...s.eyebrow, marginTop: "1rem" }}>Add Product</p>
      <h1 style={s.title}>Add Product</h1>
      <p style={s.lede}>
        Details → Media → Generate Content → Price → Preview. Nothing is public
        until you publish
      </p>

      {hydrating ? <p style={s.help}>Loading your Sanity draft…</p> : null}
      {message ? <p style={{ ...s.help, color: "#3d5a3d" }}>{message}</p> : null}
      {error ? <p style={s.errorText}>{error}</p> : null}

      <div style={s.stepRail} aria-label="Workflow steps">
        {STEPS.map((label, index) => {
          const n = index + 1;
          const active = step === n;
          return (
            <button
              key={label}
              type="button"
              onClick={() => void goToStep(n)}
              style={{
                ...s.secondaryBtn,
                background: active ? "#1a1814" : "transparent",
                color: active ? "#f7f4ef" : "#1a1814",
                padding: "0.45rem 0.7rem",
              }}
            >
              {n}. {label}
            </button>
          );
        })}
      </div>

      {step === 1 ? (
        <section style={s.card}>
          <Field label="Product name">
            <input
              style={s.input}
              value={details.name}
              onChange={(e) => updateName(e.target.value)}
            />
          </Field>
          <Field label="Slug" help="Used in the public URL. Editable before first publication">
            <input
              style={s.input}
              value={details.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setDetails((d) => ({ ...d, slug: slugify(e.target.value) }));
              }}
            />
          </Field>
          <Field label="Category">
            <select
              style={s.input}
              value={details.categoryId}
              onChange={(e) => setDetails((d) => ({ ...d, categoryId: e.target.value }))}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Product type">
            <select
              style={s.input}
              value={details.productType}
              onChange={(e) => setDetails((d) => ({ ...d, productType: e.target.value }))}
            >
              {PRODUCT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Size, weight or volume">
            <input
              style={s.input}
              value={details.volume}
              onChange={(e) => setDetails((d) => ({ ...d, volume: e.target.value }))}
              placeholder="e.g. 250 ml"
            />
          </Field>
          <Field label="Origin" help="Only enter a country or region you can verify">
            <input
              style={s.input}
              value={details.origin}
              onChange={(e) => setDetails((d) => ({ ...d, origin: e.target.value }))}
            />
          </Field>
          <Field
            label="Ingredient or ingredients"
            help="Comma-separated factual names. Stored as usage notes until you link Ingredient records in the Advanced Editor"
          >
            <input
              style={s.input}
              value={details.ingredientsText}
              onChange={(e) =>
                setDetails((d) => ({ ...d, ingredientsText: e.target.value }))
              }
            />
          </Field>
          <Field label="Intended use" help="Editorial framing, not a medical claim">
            <textarea
              style={{ ...s.input, minHeight: 80 }}
              value={details.intendedUse}
              onChange={(e) => setDetails((d) => ({ ...d, intendedUse: e.target.value }))}
            />
          </Field>
          <Field label="Brand">
            <select
              style={s.input}
              value={details.brandId}
              onChange={(e) => setDetails((d) => ({ ...d, brandId: e.target.value }))}
            >
              <option value="">None</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="SKU">
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                style={{ ...s.input, flex: 1 }}
                value={details.sku}
                onChange={(e) => setDetails((d) => ({ ...d, sku: e.target.value }))}
              />
              <button
                type="button"
                style={s.secondaryBtn}
                onClick={() =>
                  setDetails((d) => ({ ...d, sku: generateSku(d.name || "ITEM") }))
                }
              >
                Generate
              </button>
            </div>
          </Field>
        </section>
      ) : null}

      {step === 2 ? (
        <section style={s.card}>
          <p style={s.help}>Primary image is required before publishing</p>
          <label style={s.dropzone}>
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => void handleImageFiles(e.target.files)}
            />
            Drag images here or click to upload
          </label>
          {uploadPct !== null ? (
            <p style={s.help}>Uploading… {uploadPct}%</p>
          ) : null}
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
            {images.map((img, index) => (
              <div
                key={img._key}
                style={{
                  display: "grid",
                  gridTemplateColumns: "72px 1fr auto",
                  gap: "0.75rem",
                  alignItems: "center",
                  border: "1px solid #ece7de",
                  padding: "0.5rem",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt}
                  style={{ width: 72, height: 72, objectFit: "cover" }}
                />
                <div>
                  <input
                    style={s.input}
                    value={img.alt}
                    onChange={(e) =>
                      setImages((prev) =>
                        prev.map((x) =>
                          x._key === img._key ? { ...x, alt: e.target.value } : x,
                        ),
                      )
                    }
                    placeholder="Alt text"
                  />
                  <label style={{ ...s.help, display: "flex", gap: 8, marginTop: 6 }}>
                    <input
                      type="radio"
                      checked={img.isPrimary}
                      onChange={() =>
                        setImages((prev) =>
                          prev.map((x) => ({
                            ...x,
                            isPrimary: x._key === img._key,
                          })),
                        )
                      }
                    />
                    Primary image
                  </label>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <button type="button" style={s.secondaryBtn} onClick={() => reorderImage(index, -1)}>
                    Up
                  </button>
                  <button type="button" style={s.secondaryBtn} onClick={() => reorderImage(index, 1)}>
                    Down
                  </button>
                  <button
                    type="button"
                    style={s.ghostBtn}
                    onClick={() =>
                      setImages((prev) => {
                        const next = prev.filter((x) => x._key !== img._key);
                        if (!next.some((x) => x.isPrimary) && next[0]) {
                          next[0] = { ...next[0], isPrimary: true };
                        }
                        return next;
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: "1.75rem", fontWeight: 400 }}>Video</h3>
          <p style={s.help}>
            Autoplay stays off. Sound autoplay is prohibited. Controls remain on
          </p>
          <Field label="Add from Media Library">
            <select
              style={s.input}
              defaultValue=""
              onChange={(e) => {
                const id = e.target.value;
                if (!id) return;
                const title =
                  libraryVideos.find((v) => v._id === id)?.title || "Library video";
                setVideos((prev) => [
                  ...prev,
                  {
                    _key: newKey("vid"),
                    title,
                    caption: "",
                    libraryVideoId: id,
                    autoplay: false,
                    controls: true,
                  },
                ]);
                e.target.value = "";
              }}
            >
              <option value="">Select library video</option>
              {libraryVideos.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Or approved external URL">
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                id="external-video-url"
                style={{ ...s.input, flex: 1 }}
                placeholder="https://"
              />
              <button
                type="button"
                style={s.secondaryBtn}
                onClick={() => {
                  const el = document.getElementById(
                    "external-video-url",
                  ) as HTMLInputElement | null;
                  const url = el?.value.trim();
                  if (!url) return;
                  setVideos((prev) => [
                    ...prev,
                    {
                      _key: newKey("vid"),
                      title: "Product video",
                      caption: "",
                      externalUrl: url,
                      autoplay: false,
                      controls: true,
                    },
                  ]);
                  if (el) el.value = "";
                }}
              >
                Add URL
              </button>
            </div>
          </Field>
          {videos.map((video) => (
            <div key={video._key} style={{ ...s.card, marginTop: "0.75rem" }}>
              <Field label="Title">
                <input
                  style={s.input}
                  value={video.title}
                  onChange={(e) =>
                    setVideos((prev) =>
                      prev.map((v) =>
                        v._key === video._key ? { ...v, title: e.target.value } : v,
                      ),
                    )
                  }
                />
              </Field>
              <Field label="Caption">
                <input
                  style={s.input}
                  value={video.caption}
                  onChange={(e) =>
                    setVideos((prev) =>
                      prev.map((v) =>
                        v._key === video._key ? { ...v, caption: e.target.value } : v,
                      ),
                    )
                  }
                />
              </Field>
              <Field label="Poster image" help="Strongly recommended">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    void uploadImageAsset(client, file).then((uploaded) => {
                      setVideos((prev) =>
                        prev.map((v) =>
                          v._key === video._key
                            ? {
                                ...v,
                                posterAssetId: uploaded.assetId,
                                posterUrl: uploaded.url,
                              }
                            : v,
                        ),
                      );
                    });
                  }}
                />
                {video.posterUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={video.posterUrl}
                    alt=""
                    style={{ width: 120, marginTop: 8, objectFit: "cover" }}
                  />
                ) : null}
              </Field>
              <button
                type="button"
                style={s.ghostBtn}
                onClick={() =>
                  setVideos((prev) => prev.filter((v) => v._key !== video._key))
                }
              >
                Remove video
              </button>
            </div>
          ))}
        </section>
      ) : null}

      {step === 3 ? (
        <section style={s.card}>
          <p style={{ ...s.eyebrow, marginBottom: "0.75rem" }}>Facts entered</p>
          <ul style={{ marginTop: 0, color: "#6b6560", lineHeight: 1.6 }}>
            <li>{details.name || "Untitled"}</li>
            <li>{details.volume || "No size set"}</li>
            <li>{details.origin || "No origin set"}</li>
            <li>{details.ingredientsText || "No ingredients listed"}</li>
            <li>{details.intendedUse || "No intended use set"}</li>
          </ul>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button
              type="button"
              style={s.primaryBtn}
              disabled={busy}
              onClick={() => void generateAi("generate_description")}
            >
              Generate Product Content
            </button>
            <button
              type="button"
              style={s.secondaryBtn}
              disabled={busy || !proposal}
              onClick={() => setShowRefine((v) => !v)}
            >
              {showRefine ? "Hide refinements" : "Refine draft"}
            </button>
            <button type="button" style={s.secondaryBtn} disabled={!proposal} onClick={acceptAllProposal}>
              Accept all
            </button>
            <button type="button" style={s.ghostBtn} disabled={!proposal} onClick={() => setProposal(null)}>
              Reject
            </button>
          </div>
          {showRefine ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
              <button type="button" style={s.secondaryBtn} disabled={busy || !proposal} onClick={() => void generateAi("make_shorter")}>
                Make shorter
              </button>
              <button type="button" style={s.secondaryBtn} disabled={busy || !proposal} onClick={() => void generateAi("make_detailed")}>
                Make more detailed
              </button>
              <button type="button" style={s.secondaryBtn} disabled={busy || !proposal} onClick={() => void generateAi("make_editorial")}>
                Make more premium
              </button>
              <button type="button" style={s.secondaryBtn} disabled={busy || !proposal} onClick={() => void generateAi("make_clinical")}>
                Make more educational
              </button>
              <button type="button" style={s.secondaryBtn} disabled={busy || !proposal} onClick={() => void generateAi("translate_da")}>
                Translate to Danish
              </button>
              <button type="button" style={s.secondaryBtn} disabled={busy} onClick={() => void generateAi("improve_seo")}>
                Improve SEO
              </button>
              <button type="button" style={s.secondaryBtn} disabled={busy} onClick={() => void generateAi("generate_faqs")}>
                Generate FAQs
              </button>
              <button type="button" style={s.secondaryBtn} disabled={busy} onClick={() => void generateAi("generate_alt_text")}>
                Suggest image alt text
              </button>
            </div>
          ) : null}
          <p style={{ ...s.help, marginTop: "0.75rem" }}>
            AI draft — review required. Never invents medical claims, certifications,
            hadith, or provenance
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <div>
              <h3 style={{ fontWeight: 400 }}>Current draft</h3>
              <Field label="Subtitle">
                <input
                  style={s.input}
                  value={content.subtitle}
                  onChange={(e) => setContent((c) => ({ ...c, subtitle: e.target.value }))}
                />
              </Field>
              <Field label="Short description">
                <textarea
                  style={{ ...s.input, minHeight: 90 }}
                  value={content.shortDescription}
                  onChange={(e) =>
                    setContent((c) => ({ ...c, shortDescription: e.target.value }))
                  }
                />
              </Field>
              <Field label="Full description">
                <textarea
                  style={{ ...s.input, minHeight: 160 }}
                  value={content.fullDescription}
                  onChange={(e) =>
                    setContent((c) => ({ ...c, fullDescription: e.target.value }))
                  }
                />
              </Field>
              <Field label="Key qualities">
                <textarea
                  style={{ ...s.input, minHeight: 80 }}
                  value={content.keyQualities.join("\n")}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      keyQualities: e.target.value
                        .split("\n")
                        .map((x) => x.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder="One quality per line"
                />
              </Field>
              <Field label="Sourcing">
                <textarea
                  style={{ ...s.input, minHeight: 80 }}
                  value={content.sourcingParagraph}
                  onChange={(e) =>
                    setContent((c) => ({ ...c, sourcingParagraph: e.target.value }))
                  }
                />
              </Field>
              <Field label="How to use">
                <textarea
                  style={{ ...s.input, minHeight: 80 }}
                  value={content.howToUse}
                  onChange={(e) =>
                    setContent((c) => ({ ...c, howToUse: e.target.value }))
                  }
                />
              </Field>
              <Field label="Storage guidance">
                <textarea
                  style={{ ...s.input, minHeight: 70 }}
                  value={content.storageGuidance}
                  onChange={(e) =>
                    setContent((c) => ({ ...c, storageGuidance: e.target.value }))
                  }
                />
              </Field>
            </div>
            <div>
              <h3 style={{ fontWeight: 400 }}>AI proposal</h3>
              {!proposal ? (
                <p style={s.help}>Generate to compare a proposal beside your draft</p>
              ) : (
                <>
                  <ProposalBlock
                    label="Short description"
                    value={proposal.shortDescription}
                    onAccept={() => acceptSection("shortDescription")}
                  />
                  <ProposalBlock
                    label="Full description"
                    value={proposal.fullDescription}
                    onAccept={() => acceptSection("fullDescription")}
                  />
                  <ProposalBlock
                    label="Key qualities"
                    value={proposal.keyQualities?.join("\n")}
                    onAccept={() => acceptSection("keyQualities")}
                  />
                  <ProposalBlock
                    label="Sourcing"
                    value={proposal.sourcingParagraph}
                    onAccept={() => acceptSection("sourcingParagraph")}
                  />
                  <ProposalBlock
                    label="How to use"
                    value={proposal.howToUse}
                    onAccept={() => acceptSection("howToUse")}
                  />
                  <ProposalBlock
                    label="Storage guidance"
                    value={proposal.storageGuidance}
                    onAccept={() => acceptSection("storageGuidance")}
                  />
                  <ProposalBlock
                    label="SEO title"
                    value={proposal.seoTitle}
                    onAccept={() => acceptSection("seoTitle")}
                  />
                  <ProposalBlock
                    label="Meta description"
                    value={proposal.metaDescription}
                    onAccept={() => acceptSection("metaDescription")}
                  />
                  {proposal.faqs?.length ? (
                    <ProposalBlock
                      label="FAQs"
                      value={proposal.faqs
                        .map((f) => `${f.question}\n${f.answer}`)
                        .join("\n\n")}
                      onAccept={() => acceptSection("faqs")}
                    />
                  ) : null}
                  {proposal.altTextSuggestions?.length ? (
                    <ProposalBlock
                      label="Alt-text suggestions"
                      value={proposal.altTextSuggestions.join("\n")}
                      onAccept={() => {
                        if (proposal.altTextSuggestions?.[0] && images[0]) {
                          setImages((prev) =>
                            prev.map((img, i) =>
                              i === 0
                                ? { ...img, alt: proposal.altTextSuggestions![0] }
                                : img,
                            ),
                          );
                          setMessage("Applied first alt-text suggestion to primary image");
                        }
                      }}
                    />
                  ) : null}
                  {proposal.danishDraft ? (
                    <ProposalBlock label="Danish draft" value={proposal.danishDraft} />
                  ) : null}
                  {proposal.warnings?.length ? (
                    <p style={s.errorText}>{proposal.warnings.join(" · ")}</p>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section style={s.card}>
          <Field label="Regular price">
            <input
              style={s.input}
              type="number"
              min={0}
              step="0.01"
              value={pricing.price}
              onChange={(e) =>
                setPricing((p) => ({
                  ...p,
                  price: e.target.value === "" ? "" : Number(e.target.value),
                }))
              }
            />
          </Field>
          <Field label="Sale price">
            <input
              style={s.input}
              type="number"
              min={0}
              step="0.01"
              value={pricing.salePrice}
              onChange={(e) =>
                setPricing((p) => ({
                  ...p,
                  salePrice: e.target.value === "" ? "" : Number(e.target.value),
                }))
              }
            />
          </Field>
          <Field label="Currency">
            <select
              style={s.input}
              value={pricing.currency}
              onChange={(e) =>
                setPricing((p) => ({
                  ...p,
                  currency: e.target.value as "GBP" | "DKK",
                }))
              }
            >
              <option value="GBP">GBP</option>
              <option value="DKK">DKK</option>
            </select>
          </Field>
          <Field label="Stock status">
            <select
              style={s.input}
              value={pricing.stockStatus}
              onChange={(e) =>
                setPricing((p) => ({
                  ...p,
                  stockStatus: e.target.value as WizardPricing["stockStatus"],
                }))
              }
            >
              <option value="in-stock">In stock</option>
              <option value="low-stock">Low stock</option>
              <option value="out-of-stock">Out of stock</option>
              <option value="backorder">Backorder</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </Field>
          <Field label="Quantity">
            <input
              style={s.input}
              type="number"
              min={0}
              value={pricing.stockQuantity}
              onChange={(e) =>
                setPricing((p) => ({
                  ...p,
                  stockQuantity: e.target.value === "" ? "" : Number(e.target.value),
                }))
              }
            />
          </Field>
          <Field label="Low-stock threshold">
            <input
              style={s.input}
              type="number"
              min={0}
              value={pricing.lowStockThreshold}
              onChange={(e) =>
                setPricing((p) => ({
                  ...p,
                  lowStockThreshold:
                    e.target.value === "" ? "" : Number(e.target.value),
                }))
              }
            />
          </Field>
          <label style={{ ...s.help, display: "flex", gap: 8 }}>
            <input
              type="checkbox"
              checked={pricing.comingSoon}
              onChange={(e) =>
                setPricing((p) => ({ ...p, comingSoon: e.target.checked }))
              }
            />
            Coming soon
          </label>
          <label style={{ ...s.help, display: "flex", gap: 8, marginTop: 8 }}>
            <input
              type="checkbox"
              checked={pricing.allowBackorder}
              onChange={(e) =>
                setPricing((p) => ({ ...p, allowBackorder: e.target.checked }))
              }
            />
            Allow backorder
          </label>
          <label style={{ ...s.help, display: "flex", gap: 8, marginTop: 8 }}>
            <input
              type="checkbox"
              checked={pricing.featured}
              onChange={(e) =>
                setPricing((p) => ({ ...p, featured: e.target.checked }))
              }
            />
            Featured product
          </label>
          <Field label="Dispatch estimate">
            <input
              style={s.input}
              value={pricing.estimatedDispatchTime}
              onChange={(e) =>
                setPricing((p) => ({
                  ...p,
                  estimatedDispatchTime: e.target.value,
                }))
              }
              placeholder="Dispatches within 2 working days"
            />
          </Field>
          <p style={{ ...s.help, marginTop: "0.75rem" }}>
            Visibility stays off until you publish from the final step
          </p>
          <button
            type="button"
            style={{ ...s.secondaryBtn, marginTop: "1rem" }}
            onClick={() => setShowVariants((v) => !v)}
          >
            {showVariants ? "Hide product options" : "Add product options"}
          </button>
          {showVariants ? (
            <Field
              label="Sizes, weights or formats"
              help="Note options here. Detailed variant records remain in Advanced Settings"
            >
              <textarea
                style={{ ...s.input, minHeight: 90 }}
                value={variantNote}
                onChange={(e) => setVariantNote(e.target.value)}
                placeholder="e.g. 100 ml · 250 ml · 500 ml"
              />
            </Field>
          ) : null}
        </section>
      ) : null}

      {step === 5 ? (
        <section style={s.card}>
          <p style={{ ...s.eyebrow, marginBottom: "0.75rem" }}>Preview</p>
          <p style={{ ...s.help, marginTop: 0 }}>
            Check the monograph privately. Publish only when you are satisfied
          </p>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            {images[0]?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={(images.find((i) => i.isPrimary) || images[0]).url}
                alt=""
                style={{ width: 120, height: 120, objectFit: "cover" }}
              />
            ) : (
              <div style={{ width: 120, height: 120, background: "#ece7de" }} />
            )}
            <div>
              <h2 style={{ margin: 0, fontWeight: 400 }}>{details.name || "Untitled"}</h2>
              <p style={s.help}>{content.shortDescription || "No short description yet"}</p>
              <p style={s.help}>
                Gallery {images.length} · Video {videos.length} ·{" "}
                {pricing.currency} {pricing.price === "" ? "—" : pricing.price} ·{" "}
                {stockLabel(pricing.stockStatus)}
              </p>
              <p style={s.help}>
                Category{" "}
                {categories.find((c) => c._id === details.categoryId)?.title || "—"}
              </p>
              <p style={s.help}>English {content.shortDescription ? "ready" : "incomplete"}</p>
            </div>
          </div>
          {missing.length ? (
            <div style={{ marginTop: "1rem" }}>
              <p style={s.errorText}>Before publishing:</p>
              <ul style={{ color: "#8b1e1e" }}>
                {missing.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p style={{ ...s.help, marginTop: "1rem", color: "#3d5a3d" }}>
              Ready to preview. Publish remains optional
            </p>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "1.25rem" }}>
            <button
              type="button"
              style={s.primaryBtn}
              disabled={busy || !details.slug.trim()}
              onClick={previewDraft}
            >
              Preview Draft
            </button>
            <button
              type="button"
              style={s.secondaryBtn}
              disabled={busy}
              onClick={() => void persist("draft")}
            >
              Save Draft
            </button>
            <button
              type="button"
              style={s.secondaryBtn}
              disabled={busy || missing.length > 0}
              onClick={() => void persist("publish")}
            >
              Publish Product
            </button>
            <button type="button" style={s.ghostBtn} onClick={() => void goToStep(4)}>
              Back
            </button>
            <button
              type="button"
              style={s.ghostBtn}
              onClick={() => {
                if (!publishedId) {
                  window.alert("Save a draft first to open the Advanced Editor");
                  return;
                }
                router.navigateIntent("edit", {
                  id: stripDraftId(publishedId),
                  type: "product",
                });
              }}
            >
              Open Advanced Editor
            </button>
          </div>
          <div style={{ marginTop: "1.25rem" }}>
            <button
              type="button"
              style={s.secondaryBtn}
              onClick={() => setShowAdvanced((v) => !v)}
            >
              {showAdvanced ? "Hide Advanced Settings" : "Advanced Settings"}
            </button>
            {showAdvanced ? (
              <div style={{ marginTop: "0.75rem" }}>
                <p style={s.help}>
                  SKU, SEO and specialist fields. Routine selling does not require these —
                  open the full Advanced Editor for scholarship and ingredient links
                </p>
                <Field label="SKU">
                  <input
                    style={s.input}
                    value={details.sku}
                    onChange={(e) => {
                      markDirty();
                      setDetails((d) => ({ ...d, sku: e.target.value }));
                    }}
                  />
                </Field>
                <Field label="SEO title">
                  <input
                    style={s.input}
                    value={content.seoTitle}
                    onChange={(e) => {
                      markDirty();
                      setContent((c) => ({ ...c, seoTitle: e.target.value }));
                    }}
                  />
                </Field>
                <Field label="Meta description">
                  <textarea
                    style={{ ...s.input, minHeight: 80 }}
                    value={content.metaDescription}
                    onChange={(e) => {
                      markDirty();
                      setContent((c) => ({ ...c, metaDescription: e.target.value }));
                    }}
                  />
                </Field>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1.25rem",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          style={s.secondaryBtn}
          disabled={step <= 1 || busy}
          onClick={() => void goToStep(Math.max(1, step - 1))}
        >
          Back
        </button>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          {step < 5 ? (
            <button
              type="button"
              style={s.secondaryBtn}
              disabled={busy || !details.name.trim()}
              onClick={() => void persist("draft")}
            >
              Save Draft
            </button>
          ) : null}
          {step < 5 ? (
            <button
              type="button"
              style={s.primaryBtn}
              disabled={busy || hydrating}
              onClick={() => void goToStep(Math.min(5, step + 1))}
            >
              Continue to {STEPS[step]}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <label style={s.field}>
      <span style={s.label}>{label}</span>
      {children}
      {help ? <span style={s.help}>{help}</span> : null}
    </label>
  );
}

function ProposalBlock({
  label,
  value,
  onAccept,
}: {
  label: string;
  value?: string;
  onAccept?: () => void;
}) {
  if (!value) return null;
  return (
    <div style={{ marginBottom: "0.85rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <strong style={{ fontWeight: 500 }}>{label}</strong>
        {onAccept ? (
          <button type="button" style={s.ghostBtn} onClick={onAccept}>
            Accept section
          </button>
        ) : null}
      </div>
      <p style={{ ...s.help, whiteSpace: "pre-wrap" }}>{value}</p>
    </div>
  );
}
