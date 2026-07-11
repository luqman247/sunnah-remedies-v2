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

/**
 * Soft unpublish — keep the document, hide from the public catalogue.
 * Prefer Archive when the product should leave the working list.
 */
export async function unpublishProductDocument(
  client: SanityClient,
  documentId: string,
): Promise<void> {
  const id = stripDraftId(documentId);
  const draftId = toDraftId(id);
  const published = await client.fetch<Record<string, unknown> | null>(
    `*[_id == $id][0]`,
    { id },
  );
  const existingDraft = await client.fetch<Record<string, unknown> | null>(
    `*[_id == $id][0]`,
    { id: draftId },
  );

  const source = existingDraft || published;
  if (!source) throw new Error("Product not found");

  const next = {
    ...source,
    _id: draftId,
    _type: "product",
    status: "draft",
    visibleInApothecary: false,
    featured: false,
  };
  delete (next as { _rev?: string })._rev;

  await client.createOrReplace(next as { _id: string; _type: string });
  if (published) {
    // Remove the published document so public queries cannot see it
    try {
      await client.delete(id);
    } catch {
      // If delete fails, published doc may already be gone
    }
  }
}

export type HydratedWizardState = {
  details: WizardDetails;
  images: WizardMediaImage[];
  videos: WizardVideo[];
  content: AcceptedContent;
  pricing: WizardPricing;
  publishedId: string;
};

/** Load a Sanity product into wizard form state (draft preferred). */
export async function hydrateWizardFromSanity(
  client: SanityClient,
  documentId: string,
): Promise<HydratedWizardState | null> {
  const id = stripDraftId(documentId);
  const doc = await client.fetch<{
    _id: string;
    name?: string;
    slug?: { current?: string };
    nature?: string;
    volume?: string;
    sku?: string;
    productType?: string;
    provenanceOrigin?: string[];
    traditionalUsage?: string[];
    subtitle?: string;
    institutionalSummary?: string;
    historicalContext?: string[];
    keyQualities?: string[];
    suggestedUse?: string[];
    storage?: string[];
    faq?: { question?: string; answer?: string }[];
    seo?: { metaTitle?: string; metaDescription?: string };
    price?: number;
    salePrice?: number;
    currency?: string;
    stockStatus?: WizardPricing["stockStatus"];
    stockQuantity?: number;
    lowStockThreshold?: number;
    allowBackorder?: boolean;
    estimatedDispatchTime?: string;
    featured?: boolean;
    status?: string;
    brand?: { _ref?: string };
    category?: { _ref?: string };
    mainImage?: { alt?: string; asset?: { _id?: string; url?: string } };
    gallery?: Array<{
      _key?: string;
      alt?: string;
      asset?: { _id?: string; url?: string };
    }>;
    productVideos?: Array<{
      _key?: string;
      title?: string;
      caption?: string;
      externalUrl?: string;
      libraryVideo?: { _id?: string };
      poster?: { asset?: { _id?: string; url?: string } };
    }>;
  } | null>(
    `*[_id in [$id, $draft]]|order(_updatedAt desc)[0]{
      ...,
      mainImage{alt, asset->{_id, url}},
      gallery[]{_key, alt, asset->{_id, url}},
      productVideos[]{
        _key, title, caption, externalUrl,
        "libraryVideo": libraryVideo->{_id},
        poster{asset->{_id, url}}
      },
      brand{_ref},
      category{_ref}
    }`,
    { id, draft: toDraftId(id) },
  );

  if (!doc) return null;

  const images: WizardMediaImage[] = [];
  if (doc.mainImage?.asset?._id) {
    images.push({
      _key: newKey("img"),
      assetId: doc.mainImage.asset._id,
      url: doc.mainImage.asset.url || "",
      alt: doc.mainImage.alt || "",
      isPrimary: true,
    });
  }
  for (const g of doc.gallery || []) {
    if (!g.asset?._id) continue;
    images.push({
      _key: g._key || newKey("img"),
      assetId: g.asset._id,
      url: g.asset.url || "",
      alt: g.alt || "",
      isPrimary: images.length === 0,
    });
  }

  const videos: WizardVideo[] = (doc.productVideos || []).map((v) => ({
    _key: v._key || newKey("vid"),
    title: v.title || "Product video",
    caption: v.caption || "",
    externalUrl: v.externalUrl,
    libraryVideoId: v.libraryVideo?._id,
    posterAssetId: v.poster?.asset?._id,
    posterUrl: v.poster?.asset?.url,
    autoplay: false as const,
    controls: true as const,
  }));

  const fullDescription = (doc.historicalContext || []).join("\n\n");
  const sourcing =
    (doc.historicalContext || []).length > 1
      ? (doc.historicalContext || []).slice(1).join("\n\n")
      : "";

  return {
    publishedId: id,
    details: {
      name: doc.name || "",
      slug: doc.slug?.current || "",
      categoryId: doc.category?._ref || "",
      productType: doc.productType || "remedy",
      volume: doc.volume || "",
      origin: (doc.provenanceOrigin || [])[0] || "",
      ingredientsText: (doc.traditionalUsage || [])[0] || "",
      intendedUse: doc.nature || "",
      brandId: doc.brand?._ref || "",
      sku: doc.sku || "",
    },
    images,
    videos,
    content: {
      subtitle: doc.subtitle || "",
      shortDescription: doc.institutionalSummary || "",
      fullDescription,
      keyQualities: doc.keyQualities || [],
      sourcingParagraph: sourcing,
      howToUse: (doc.suggestedUse || [])[0] || "",
      storageGuidance: (doc.storage || [])[0] || "",
      faqs: (doc.faq || [])
        .filter((f) => f.question && f.answer)
        .map((f) => ({ question: f.question!, answer: f.answer! })),
      seoTitle: doc.seo?.metaTitle || "",
      metaDescription: doc.seo?.metaDescription || "",
    },
    pricing: {
      price: typeof doc.price === "number" ? doc.price : "",
      salePrice: typeof doc.salePrice === "number" ? doc.salePrice : "",
      currency: doc.currency === "DKK" ? "DKK" : "GBP",
      stockStatus: doc.stockStatus || "in-stock",
      stockQuantity:
        typeof doc.stockQuantity === "number" ? doc.stockQuantity : "",
      lowStockThreshold:
        typeof doc.lowStockThreshold === "number" ? doc.lowStockThreshold : 5,
      comingSoon: doc.status === "coming-soon",
      allowBackorder: Boolean(doc.allowBackorder),
      estimatedDispatchTime: doc.estimatedDispatchTime || "",
      visibleInApothecary: false,
      featured: Boolean(doc.featured),
    },
  };
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
