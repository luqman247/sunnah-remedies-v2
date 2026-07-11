/**
 * Map Seller Centre wizard / quick-edit state onto Sanity product documents.
 */

import type { SanityClient } from "sanity";
import type {
  AcceptedContent,
  WizardDetails,
  WizardMediaImage,
  WizardPricing,
  WizardVideo,
} from "./types";
import { newKey, stripDraftId, toDraftId } from "./utils";

export function buildProductId(slug: string): string {
  const safe = slug.replace(/[^a-z0-9-]/gi, "").toLowerCase() || "item";
  return `product-${safe}-${Date.now().toString(36)}`;
}

export function imageRef(assetId: string, alt: string) {
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: assetId },
    alt: alt || "Product image",
  };
}

export function wizardToDocumentFields(input: {
  details: WizardDetails;
  images: WizardMediaImage[];
  videos: WizardVideo[];
  content: AcceptedContent;
  pricing: WizardPricing;
  language?: "en" | "da";
}) {
  const { details, images, videos, content, pricing } = input;
  const primary = images.find((i) => i.isPrimary) || images[0];
  const gallery = images
    .filter((i) => primary && i._key !== primary._key)
    .map((i) => ({
      _key: i._key,
      ...imageRef(i.assetId, i.alt),
    }));

  const historicalContext = [
    content.fullDescription,
    content.sourcingParagraph,
  ]
    .map((p) => p.trim())
    .filter(Boolean);

  const status = pricing.comingSoon
    ? ("coming-soon" as const)
    : pricing.stockStatus === "out-of-stock"
      ? ("out-of-stock" as const)
      : ("draft" as const);

  return {
    _type: "product" as const,
    language: input.language || "en",
    name: details.name.trim(),
    slug: { _type: "slug" as const, current: details.slug.trim() },
    subtitle: content.subtitle || undefined,
    nature: details.intendedUse.trim() || undefined,
    institutionalSummary: content.shortDescription.trim() || undefined,
    volume: details.volume.trim() || undefined,
    sku: details.sku.trim() || undefined,
    productType: details.productType || undefined,
    provenanceOrigin: details.origin.trim() ? [details.origin.trim()] : undefined,
    traditionalUsage: details.ingredientsText.trim()
      ? [details.ingredientsText.trim()]
      : undefined,
    keyQualities: content.keyQualities.length ? content.keyQualities : undefined,
    suggestedUse: content.howToUse ? [content.howToUse] : undefined,
    storage: content.storageGuidance ? [content.storageGuidance] : undefined,
    historicalContext: historicalContext.length ? historicalContext : undefined,
    faq: content.faqs.length
      ? content.faqs.map((f) => ({
          _key: newKey("faq"),
          question: f.question,
          answer: f.answer,
        }))
      : undefined,
    seo: {
      metaTitle: content.seoTitle || undefined,
      metaDescription: content.metaDescription || undefined,
    },
    mainImage: primary ? imageRef(primary.assetId, primary.alt) : undefined,
    gallery: gallery.length ? gallery : undefined,
    productVideos: videos.length
      ? videos.map((v) => ({
          _key: v._key,
          title: v.title,
          caption: v.caption,
          externalUrl: v.externalUrl || undefined,
          libraryVideo: v.libraryVideoId
            ? { _type: "reference", _ref: v.libraryVideoId }
            : undefined,
          poster: v.posterAssetId
            ? imageRef(v.posterAssetId, v.title || "Video poster")
            : undefined,
          autoplay: false,
          muted: true,
          controls: true,
          role: "product-demonstration",
        }))
      : undefined,
    brand: details.brandId
      ? { _type: "reference" as const, _ref: details.brandId }
      : undefined,
    category: details.categoryId
      ? { _type: "reference" as const, _ref: details.categoryId }
      : undefined,
    price: pricing.price === "" ? undefined : Number(pricing.price),
    salePrice: pricing.salePrice === "" ? undefined : Number(pricing.salePrice),
    currency: pricing.currency,
    stockStatus: pricing.stockStatus,
    stockQuantity:
      pricing.stockQuantity === "" ? undefined : Number(pricing.stockQuantity),
    lowStockThreshold:
      pricing.lowStockThreshold === ""
        ? 5
        : Number(pricing.lowStockThreshold),
    allowBackorder: pricing.allowBackorder,
    estimatedDispatchTime: pricing.estimatedDispatchTime.trim() || undefined,
    inStock: pricing.stockStatus === "in-stock" || pricing.stockStatus === "low-stock",
    status,
    visibleInApothecary: false,
    featured: pricing.featured,
    purchaseFraming: "standard" as const,
    taxBehaviour: "inclusive" as const,
  };
}

export async function saveWizardDraft(
  client: SanityClient,
  publishedId: string,
  fields: ReturnType<typeof wizardToDocumentFields>,
): Promise<string> {
  const draftId = toDraftId(publishedId);
  await client.createOrReplace({
    _id: draftId,
    ...fields,
    status: fields.status === "coming-soon" ? "coming-soon" : "draft",
    visibleInApothecary: false,
  });
  return draftId;
}

export async function publishProductDocument(
  client: SanityClient,
  documentId: string,
): Promise<void> {
  const id = stripDraftId(documentId);
  const draftId = toDraftId(id);
  const draft = await client.fetch(`*[_id == $id][0]`, { id: draftId });
  const published = await client.fetch(`*[_id == $id][0]`, { id });
  const source = draft || published;
  if (!source) throw new Error("Product not found");

  const next = {
    ...source,
    _id: id,
    status:
      source.status === "coming-soon"
        ? "coming-soon"
        : source.stockStatus === "out-of-stock"
          ? "out-of-stock"
          : "active",
    visibleInApothecary: true,
    publishedAt: new Date().toISOString(),
  };
  delete (next as { _rev?: string })._rev;

  await client.createOrReplace(next);
  if (draft) {
    try {
      await client.delete(draftId);
    } catch {
      // Draft may already be gone after createOrReplace in some setups
    }
  }
}

export async function uploadImageAsset(
  client: SanityClient,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<{ assetId: string; url: string }> {
  onProgress?.(10);
  const asset = await client.assets.upload("image", file, {
    filename: file.name,
  });
  onProgress?.(100);
  return {
    assetId: asset._id,
    url: asset.url || "",
  };
}
