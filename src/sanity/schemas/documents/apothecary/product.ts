/**
 * Product — canonical Apothecary Product Manager document.
 *
 * Sanity is the single source of truth for editable product information
 * (identity, content, media, pricing, inventory, publication).
 * Optional Shopify commerce join remains for checkout fulfilment.
 *
 * Localisation: document internationalisation (en / da) — structural fields
 * (price, stock, SKU, media, status) should be kept aligned across languages.
 *
 * Public UI is not wired in this phase.
 */

import { defineField, defineType } from "sanity";

type ProductDoc = {
  purchaseFraming?: string;
  commerce?: { shopifyProductId?: string };
  price?: number;
  salePrice?: number;
  compareAtPrice?: number;
  status?: string;
  stockStatus?: string;
  inStock?: boolean;
};

function statusLabel(value?: string): string {
  switch (value) {
    case "draft":
      return "Draft";
    case "active":
      return "Active";
    case "coming-soon":
      return "Coming soon";
    case "out-of-stock":
      return "Out of stock";
    case "discontinued":
      return "Discontinued";
    case "archived":
      return "Archived";
    default:
      return "Status unset";
  }
}

function formatMoney(amount?: number, currency?: string): string | null {
  if (typeof amount !== "number") return null;
  const code = currency === "DKK" ? "DKK" : "GBP";
  const symbol = code === "DKK" ? "kr" : "£";
  return `${symbol}${amount.toFixed(2)}`;
}

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "essentials", title: "Essentials", default: true },
    { name: "media", title: "Media" },
    { name: "content", title: "Content" },
    { name: "scholarship", title: "Scholarship" },
    { name: "clinical", title: "Clinical" },
    { name: "pricing", title: "Pricing & Variants" },
    { name: "inventory", title: "Inventory" },
    { name: "relationships", title: "Relationships" },
    { name: "search", title: "Search Visibility" },
    { name: "publishing", title: "Publishing" },
    { name: "ai", title: "AI Assistant" },
    { name: "operations", title: "Operations" },
  ],
  fieldsets: [
    {
      name: "identityDetails",
      title: "Identity details",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "pricingAdvanced",
      title: "Advanced pricing",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "inventoryAdvanced",
      title: "Inventory details",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "visibilityWindow",
      title: "Visibility window",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "shopifyJoin",
      title: "Shopify checkout join",
      options: { collapsible: true, collapsed: true },
    },
  ],
  initialValue: {
    status: "draft",
    purchaseFraming: "standard",
    currency: "GBP",
    taxBehaviour: "inclusive",
    stockStatus: "in-stock",
    inStock: true,
    visibleInApothecary: false,
    featured: false,
    allowBackorder: false,
    lowStockThreshold: 5,
  },
  fields: [
    // ── Essentials ──
    defineField({
      name: "name",
      title: "Title",
      type: "string",
      group: "essentials",
      description: "Public product title.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "essentials",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      group: "essentials",
    }),
    defineField({
      name: "nature",
      title: "Nature / Catalogue Line",
      type: "string",
      group: "essentials",
      description: "Short catalogue line describing the remedy.",
    }),
    defineField({
      name: "institutionalSummary",
      title: "Short Description",
      type: "text",
      group: "essentials",
      rows: 3,
      description: "Museum-label summary in the institutional voice.",
    }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
      group: "essentials",
      fieldset: "identityDetails",
    }),
    defineField({
      name: "barcode",
      title: "Barcode / EAN / UPC",
      type: "string",
      group: "essentials",
      fieldset: "identityDetails",
    }),
    defineField({
      name: "productType",
      title: "Product Type",
      type: "string",
      group: "essentials",
      fieldset: "identityDetails",
      options: {
        list: [
          { title: "Remedy", value: "remedy" },
          { title: "Oil", value: "oil" },
          { title: "Honey", value: "honey" },
          { title: "Herb", value: "herb" },
          { title: "Supplement", value: "supplement" },
          { title: "Book", value: "book" },
          { title: "Equipment", value: "equipment" },
          { title: "Gift", value: "gift" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      group: "essentials",
      fieldset: "identityDetails",
      to: [{ type: "brand" }],
    }),
    defineField({
      name: "internalName",
      title: "Internal Product Name",
      type: "string",
      group: "essentials",
      fieldset: "identityDetails",
      description: "Staff-facing name if different from the public title.",
    }),
    defineField({
      name: "folio",
      title: "Folio",
      type: "string",
      group: "essentials",
      fieldset: "identityDetails",
      description: "Catalogue reference number.",
    }),
    defineField({
      name: "botanicalName",
      title: "Botanical Name",
      type: "string",
      group: "essentials",
      fieldset: "identityDetails",
      description: "Latin binomial, e.g. Nigella sativa",
    }),
    defineField({
      name: "transliteration",
      title: "Arabic Transliteration",
      type: "string",
      group: "essentials",
      fieldset: "identityDetails",
    }),
    defineField({
      name: "purchaseFraming",
      title: "Purchase Framing",
      type: "string",
      group: "essentials",
      options: {
        list: [
          { title: "Standard", value: "standard" },
          { title: "Education First", value: "education-first" },
          { title: "Reference Only", value: "reference-only" },
        ],
        layout: "radio",
      },
      initialValue: "standard",
      description:
        "How prominent the buy affordance is. Reference-only = documented, not for sale.",
      validation: (rule) => rule.required(),
    }),

    // ── Media ──
    defineField({
      name: "mainImage",
      title: "Primary Image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      description: "Inline primary image. Prefer Media Gallery with a library asset when possible.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
        defineField({ name: "credit", title: "Credit", type: "string" }),
        defineField({
          name: "cloudinaryAssetId",
          title: "Cloudinary Asset ID",
          type: "string",
          hidden: true,
        }),
      ],
    }),
    defineField({
      name: "primaryLibraryImage",
      title: "Primary Image (Media Library)",
      type: "reference",
      group: "media",
      to: [{ type: "mediaAsset" }],
      description:
        "Preferred primary image from the central library. Overrides inline primary when set for future composition.",
      options: {
        filter: 'status in ["interim", "final"] && assetClass in ["product", "photography", "editorial"]',
      },
    }),
    defineField({
      name: "gallery",
      title: "Image Gallery (legacy)",
      type: "array",
      group: "media",
      description: "Retained for existing documents. Prefer Media Gallery below for role metadata.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
            defineField({ name: "credit", title: "Credit", type: "string" }),
            defineField({
              name: "cloudinaryAssetId",
              title: "Cloudinary Asset ID",
              type: "string",
              hidden: true,
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "mediaGallery",
      title: "Media Gallery",
      type: "array",
      group: "media",
      of: [{ type: "productImage" }],
      description:
        "Role-tagged images. Select from the Media Library whenever the asset already exists.",
    }),
    defineField({
      name: "productVideos",
      title: "Product Videos",
      type: "array",
      group: "media",
      of: [{ type: "productVideo" }],
      description: "Prefer Media Library videos. Never autoplay with sound.",
    }),
    defineField({
      name: "libraryVideos",
      title: "Library Videos (quick attach)",
      type: "array",
      group: "media",
      of: [{ type: "reference", to: [{ type: "videoAsset" }] }],
      description: "Quick multi-select from the video library. Detailed roles live in Product Videos.",
    }),
    defineField({
      name: "videos",
      title: "Videos (legacy)",
      type: "array",
      group: "media",
      hidden: true,
      of: [{ type: "institutionalVideo" }],
      deprecated: {
        reason: "Use Product Videos (productVideos) instead.",
      },
    }),
    defineField({
      name: "downloads",
      title: "Downloads",
      type: "array",
      group: "media",
      of: [{ type: "downloadFile" }],
    }),

    // ── Content ──
    defineField({
      name: "fullDescription",
      title: "Full Description",
      type: "array",
      group: "content",
      of: [{ type: "block" }],
      description: "Portable Text product narrative.",
    }),
    defineField({
      name: "keyQualities",
      title: "Key Qualities",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "productStory",
      title: "Product Story",
      type: "array",
      group: "content",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "historicalContext",
      title: "Historical Context",
      type: "array",
      group: "content",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "propheticReferences",
      title: "Prophetic References",
      type: "array",
      group: "content",
      of: [{ type: "propheticReference" }],
    }),
    defineField({
      name: "traditionalScholarship",
      title: "Traditional Scholarship",
      type: "array",
      group: "content",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "traditionalUsage",
      title: "Traditional Usage",
      type: "array",
      group: "content",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "evidenceEstablished",
      title: "Evidence — Established",
      type: "array",
      group: "content",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "evidenceEmerging",
      title: "Evidence — Emerging",
      type: "array",
      group: "content",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "provenanceOrigin",
      title: "Origin",
      type: "array",
      group: "content",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "provenanceCultivation",
      title: "Cultivation",
      type: "array",
      group: "content",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "provenanceHarvesting",
      title: "Harvesting",
      type: "array",
      group: "content",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "sourcingInformation",
      title: "Sourcing Information",
      type: "array",
      group: "content",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "preparationMethod",
      title: "Preparation / Production Method",
      type: "array",
      group: "content",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "laboratoryVerification",
      title: "Laboratory Verification",
      type: "array",
      group: "content",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "qualityAssurance",
      title: "Quality Assurance",
      type: "array",
      group: "content",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "certificates",
      title: "Certificates of Analysis",
      type: "array",
      group: "content",
      of: [{ type: "downloadFile" }],
    }),
    defineField({
      name: "suggestedUse",
      title: "How to Use",
      type: "array",
      group: "content",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "preparation",
      title: "Preparation",
      type: "array",
      group: "content",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "storage",
      title: "Storage Instructions",
      type: "array",
      group: "content",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "ingredientList",
      title: "Ingredients (text)",
      type: "array",
      group: "content",
      of: [{ type: "text" }],
      description: "Plain-language ingredient listing for the label.",
    }),
    defineField({
      name: "suitableFor",
      title: "Suitable For",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "contraindications",
      title: "Warnings / Contraindications",
      type: "array",
      group: "content",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "disclaimer",
      title: "Disclaimer",
      type: "text",
      group: "content",
      rows: 3,
      description: "Not a substitute for medical advice — state limits plainly.",
    }),
    defineField({
      name: "faq",
      title: "Frequently Asked Questions",
      type: "array",
      group: "content",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),
    defineField({
      name: "provenance",
      title: "Provenance Note",
      type: "provenanceNote",
      group: "content",
    }),
    defineField({
      name: "editorialProvenance",
      title: "Provenance (legacy)",
      type: "provenanceNote",
      group: "content",
      hidden: true,
      deprecated: {
        reason: "Use provenance.",
      },
    }),
    defineField({
      name: "shipping",
      title: "Shipping Information",
      type: "array",
      group: "content",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "returns",
      title: "Returns Policy",
      type: "array",
      group: "content",
      of: [{ type: "text" }],
    }),

    // ── Scholarship ──
    defineField({
      name: "traditionLayers",
      title: "Tradition Layers",
      type: "traditionLayers",
      group: "scholarship",
    }),
    defineField({
      name: "sources",
      title: "Sources",
      type: "array",
      group: "scholarship",
      of: [{ type: "sourceReference" }],
    }),

    // ── Clinical ──
    defineField({
      name: "clinicalNotes",
      title: "Clinical Notes",
      type: "array",
      group: "clinical",
      of: [{ type: "productClinicalNote" }],
    }),

    // ── Pricing & Variants (Sanity SoT) ──
    defineField({
      name: "volume",
      title: "Pack Size / Volume Label",
      type: "string",
      group: "pricing",
      description: "e.g. 250ml, 500g",
    }),
    defineField({
      name: "price",
      title: "Regular Price",
      type: "number",
      group: "pricing",
      description: "Canonical display price in Sanity. Keep aligned across language documents.",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "salePrice",
      title: "Sale Price",
      type: "number",
      group: "pricing",
      validation: (rule) =>
        rule.min(0).custom((salePrice, context) => {
          const doc = context.document as ProductDoc | undefined;
          if (
            typeof salePrice === "number" &&
            typeof doc?.price === "number" &&
            salePrice >= doc.price
          ) {
            return "Sale price must be lower than the regular price.";
          }
          return true;
        }),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare-at Price",
      type: "number",
      group: "pricing",
      fieldset: "pricingAdvanced",
      description: "Honest prior price only — never fabricate urgency.",
      validation: (rule) =>
        rule.min(0).custom((compareAt, context) => {
          const doc = context.document as ProductDoc | undefined;
          if (
            typeof compareAt === "number" &&
            typeof doc?.price === "number" &&
            compareAt < doc.price
          ) {
            return "Compare-at price should be equal to or higher than the regular price.";
          }
          return true;
        }),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      group: "pricing",
      options: {
        list: [
          { title: "GBP (£)", value: "GBP" },
          { title: "DKK (kr)", value: "DKK" },
        ],
      },
      initialValue: "GBP",
    }),
    defineField({
      name: "taxBehaviour",
      title: "Tax Behaviour",
      type: "string",
      group: "pricing",
      fieldset: "pricingAdvanced",
      options: {
        list: [
          { title: "Inclusive", value: "inclusive" },
          { title: "Exclusive", value: "exclusive" },
          { title: "Exempt", value: "exempt" },
        ],
      },
      initialValue: "inclusive",
    }),
    defineField({
      name: "unitPricing",
      title: "Unit Pricing",
      type: "string",
      group: "pricing",
      fieldset: "pricingAdvanced",
      description: "e.g. £0.12 per ml",
    }),
    defineField({
      name: "priceNote",
      title: "Pricing Note",
      type: "string",
      group: "pricing",
      description: "e.g. laboratory-verified · includes UK delivery",
    }),
    defineField({
      name: "priceValidUntil",
      title: "Price Valid Until",
      type: "date",
      group: "pricing",
      fieldset: "pricingAdvanced",
    }),
    defineField({
      name: "variants",
      title: "Variants",
      type: "array",
      group: "pricing",
      of: [{ type: "productVariant" }],
      description: "Optional. Leave empty for single-SKU products.",
    }),
    defineField({
      name: "commerce",
      title: "Shopify Commerce Join",
      type: "commerceReference",
      group: "pricing",
      fieldset: "shopifyJoin",
      description:
        "Optional checkout join. Sanity remains SoT for editable price and stock; Shopify fulfils cart when linked.",
      hidden: ({ document }) => document?.purchaseFraming === "reference-only",
    }),
    defineField({
      name: "futureShopifyProductId",
      title: "Legacy Shopify Product ID",
      type: "string",
      group: "pricing",
      hidden: true,
      deprecated: { reason: "Use commerce.shopifyProductId." },
    }),
    defineField({
      name: "futureShopifyVariantId",
      title: "Legacy Shopify Variant ID",
      type: "string",
      group: "pricing",
      hidden: true,
      deprecated: { reason: "Use variants[].shopifyVariantId or commerce.variantMap." },
    }),

    // ── Inventory ──
    defineField({
      name: "stockStatus",
      title: "Stock Status",
      type: "string",
      group: "inventory",
      options: {
        list: [
          { title: "In Stock", value: "in-stock" },
          { title: "Low Stock", value: "low-stock" },
          { title: "Out of Stock", value: "out-of-stock" },
          { title: "Backorder", value: "backorder" },
          { title: "Unavailable", value: "unavailable" },
        ],
      },
      initialValue: "in-stock",
    }),
    defineField({
      name: "inStock",
      title: "In Stock (legacy boolean)",
      type: "boolean",
      group: "inventory",
      initialValue: true,
      description: "Kept for existing public UI. Prefer Stock Status.",
    }),
    defineField({
      name: "stockQuantity",
      title: "Stock Quantity",
      type: "number",
      group: "inventory",
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: "lowStockThreshold",
      title: "Low-stock Threshold",
      type: "number",
      group: "inventory",
      fieldset: "inventoryAdvanced",
      validation: (rule) => rule.integer().min(0),
      initialValue: 5,
    }),
    defineField({
      name: "allowBackorder",
      title: "Allow Backorder",
      type: "boolean",
      group: "inventory",
      fieldset: "inventoryAdvanced",
      initialValue: false,
    }),
    defineField({
      name: "estimatedDispatchTime",
      title: "Estimated Dispatch Time",
      type: "string",
      group: "inventory",
      fieldset: "inventoryAdvanced",
      description: "Honest expectation, e.g. Dispatches within 2 working days",
    }),
    defineField({
      name: "availabilityMessage",
      title: "Availability Message",
      type: "string",
      group: "inventory",
      fieldset: "inventoryAdvanced",
    }),

    // ── Relationships ──
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      group: "relationships",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "collection",
      title: "Primary Collection",
      type: "reference",
      group: "relationships",
      to: [{ type: "collection" }],
    }),
    defineField({
      name: "collections",
      title: "Collections",
      type: "array",
      group: "relationships",
      of: [{ type: "reference", to: [{ type: "collection" }] }],
    }),
    defineField({
      name: "ingredients",
      title: "Ingredients",
      type: "array",
      group: "relationships",
      of: [{ type: "reference", to: [{ type: "ingredient" }] }],
    }),
    defineField({
      name: "primaryIngredient",
      title: "Primary Ingredient",
      type: "reference",
      group: "relationships",
      to: [{ type: "ingredient" }],
    }),
    defineField({
      name: "certifications",
      title: "Certifications",
      type: "array",
      group: "relationships",
      of: [{ type: "reference", to: [{ type: "certification" }] }],
    }),
    defineField({
      name: "researchReferences",
      title: "Research References",
      type: "array",
      group: "relationships",
      of: [{ type: "reference", to: [{ type: "researchPaper" }, { type: "article" }] }],
    }),
    defineField({
      name: "relatedProducts",
      title: "Related Products",
      type: "array",
      group: "relationships",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      validation: (rule) =>
        rule.max(6).warning("Keep related products to six or fewer."),
    }),
    defineField({
      name: "crossReferences",
      title: "Cross References",
      type: "array",
      group: "relationships",
      of: [
        { type: "reference", name: "articleRef", to: [{ type: "article" }] },
        { type: "reference", name: "ingredientRef", to: [{ type: "ingredient" }] },
        { type: "reference", name: "programmeRef", to: [{ type: "programme" }] },
        { type: "reference", name: "journeyRef", to: [{ type: "journey" }] },
      ],
    }),
    defineField({
      name: "academyLessons",
      title: "Academy Lessons",
      type: "array",
      group: "relationships",
      of: [{ type: "internalLink" }],
    }),
    defineField({
      name: "knowledgeLibrary",
      title: "Knowledge Library",
      type: "array",
      group: "relationships",
      of: [{ type: "internalLink" }],
    }),
    defineField({
      name: "pathways",
      title: "Pathways",
      type: "array",
      group: "relationships",
      of: [{ type: "internalLink" }],
    }),

    // ── Search Visibility ──
    defineField({
      name: "seo",
      title: "SEO & Social",
      type: "seo",
      group: "search",
    }),
    defineField({
      name: "aiSummary",
      title: "AI Summary",
      type: "text",
      group: "search",
      rows: 3,
      description: "Editor-approved short summary for search and AI retrieval. Not auto-published from drafts.",
    }),
    defineField({
      name: "searchKeywords",
      title: "Search Keywords",
      type: "array",
      group: "search",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    // ── Publishing ──
    defineField({
      name: "status",
      title: "Publication Status",
      type: "string",
      group: "publishing",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Active", value: "active" },
          { title: "Coming Soon", value: "coming-soon" },
          { title: "Out of Stock", value: "out-of-stock" },
          { title: "Discontinued", value: "discontinued" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      group: "publishing",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "publishing",
      initialValue: false,
    }),
    defineField({
      name: "featuredPriority",
      title: "Featured Priority",
      type: "number",
      group: "publishing",
      description: "Lower numbers appear first among featured products.",
      hidden: ({ document }) => !document?.featured,
    }),
    defineField({
      name: "orderRank",
      title: "Display Order",
      type: "number",
      group: "publishing",
    }),
    defineField({
      name: "visibleInApothecary",
      title: "Visible in Apothecary",
      type: "boolean",
      group: "publishing",
      initialValue: true,
      description: "When false, the product is withheld from public Apothecary listings.",
    }),
    defineField({
      name: "visibilityStartsAt",
      title: "Visibility Starts",
      type: "datetime",
      group: "publishing",
      fieldset: "visibilityWindow",
    }),
    defineField({
      name: "visibilityEndsAt",
      title: "Visibility Ends",
      type: "datetime",
      group: "publishing",
      fieldset: "visibilityWindow",
    }),
    defineField({
      name: "editorial",
      title: "Editorial Workflow",
      type: "editorialWorkflow",
      group: "publishing",
    }),

    // ── AI Assistant ──
    defineField({
      name: "aiDraft",
      title: "AI Draft Content",
      type: "object",
      group: "ai",
      description:
        "Use document action “Generate AI description”. Drafts require human review and Approve before Publish. Never auto-published.",
      fields: [
        defineField({
          name: "reviewStatus",
          title: "Review Status",
          type: "string",
          options: {
            list: [
              { title: "None", value: "none" },
              { title: "AI generated — review required", value: "review-required" },
              { title: "Approved", value: "approved" },
              { title: "Rejected", value: "rejected" },
            ],
          },
          initialValue: "none",
        }),
        defineField({
          name: "shortDescription",
          title: "Draft Short Description",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "fullDescription",
          title: "Draft Full Description",
          type: "array",
          of: [{ type: "block" }],
        }),
        defineField({
          name: "generatedAt",
          title: "Generated At",
          type: "datetime",
          readOnly: true,
        }),
        defineField({
          name: "provider",
          title: "Provider / Model",
          type: "string",
          readOnly: true,
        }),
        defineField({
          name: "notes",
          title: "Editor Notes",
          type: "text",
          rows: 2,
        }),
      ],
    }),

    // ── Operations ──
    defineField({
      name: "allergenData",
      title: "Allergen Information",
      type: "array",
      group: "operations",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "batchRecords",
      title: "Batch Records",
      type: "array",
      group: "operations",
      of: [{ type: "reference", to: [{ type: "batchRecord" }] }],
    }),
    defineField({
      name: "storageRequirements",
      title: "Storage Requirements (Internal)",
      type: "string",
      group: "operations",
    }),
  ],
  validation: (rule) =>
    rule.custom((doc) => {
      const product = doc as ProductDoc | undefined;
      if (!product) return true;

      if (
        product.status === "active" &&
        product.purchaseFraming !== "reference-only" &&
        typeof product.price !== "number"
      ) {
        return "Active shoppable products should have a regular price.";
      }

      if (
        product.stockStatus === "out-of-stock" ||
        product.status === "out-of-stock"
      ) {
        // Informational alignment — no hard fail
      }

      return true;
    }),
  preview: {
    select: {
      title: "name",
      status: "status",
      price: "price",
      salePrice: "salePrice",
      currency: "currency",
      stockStatus: "stockStatus",
      featured: "featured",
      language: "language",
      media: "mainImage",
    },
    prepare({
      title,
      status,
      price,
      salePrice,
      currency,
      stockStatus,
      featured,
      language,
      media,
    }) {
      const money =
        typeof salePrice === "number"
          ? `${formatMoney(salePrice, currency)} (sale)`
          : formatMoney(price, currency);
      const parts = [
        statusLabel(typeof status === "string" ? status : undefined),
        money,
        typeof stockStatus === "string" ? stockStatus : null,
        featured ? "Featured" : null,
        typeof language === "string" ? language.toUpperCase() : null,
      ].filter(Boolean);
      return {
        title: title || "Untitled product",
        subtitle: parts.join(" · "),
        media,
      };
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderRankAsc",
      by: [{ field: "orderRank", direction: "asc" }],
    },
    {
      title: "Featured Priority",
      name: "featuredPriorityAsc",
      by: [
        { field: "featuredPriority", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
    {
      title: "Name",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Status",
      name: "statusAsc",
      by: [{ field: "status", direction: "asc" }],
    },
    {
      title: "Price",
      name: "priceAsc",
      by: [{ field: "price", direction: "asc" }],
    },
  ],
});
