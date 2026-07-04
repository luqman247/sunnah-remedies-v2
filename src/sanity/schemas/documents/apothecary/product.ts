import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "monograph", title: "Monograph", default: true },
    { name: "provenance", title: "Provenance & Quality" },
    { name: "usage", title: "Usage & Storage" },
    { name: "scholarship", title: "Scholarship" },
    { name: "clinical", title: "Clinical" },
    { name: "commerce", title: "Commerce" },
    { name: "media", title: "Media" },
    { name: "relations", title: "Relations" },
    { name: "connections", title: "Connections" },
    { name: "seo", title: "SEO" },
    { name: "editorial", title: "Editorial" },
    { name: "operations", title: "Operations" },
  ],
  fields: [
    // ── Identity ──
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      group: "monograph",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "monograph",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "transliteration",
      title: "Arabic Transliteration",
      type: "string",
      group: "monograph",
    }),
    defineField({
      name: "botanicalName",
      title: "Botanical Name",
      type: "string",
      group: "monograph",
      description: "Latin binomial, e.g. Nigella sativa",
    }),
    defineField({
      name: "nature",
      title: "Nature",
      type: "string",
      group: "monograph",
      description: "Short catalogue line describing the remedy.",
    }),
    defineField({
      name: "institutionalSummary",
      title: "Institutional Summary",
      type: "text",
      group: "monograph",
      rows: 3,
      description: "Museum-label summary in the institutional voice.",
    }),
    defineField({
      name: "folio",
      title: "Folio",
      type: "string",
      group: "monograph",
      description: "Catalogue reference number.",
    }),

    // ── Monograph Content ──
    defineField({
      name: "historicalContext",
      title: "Historical Context",
      type: "array",
      group: "monograph",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "propheticReferences",
      title: "Prophetic References",
      type: "array",
      group: "monograph",
      of: [{ type: "propheticReference" }],
    }),
    defineField({
      name: "traditionalScholarship",
      title: "Traditional Scholarship",
      type: "array",
      group: "monograph",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "traditionalUsage",
      title: "Traditional Usage",
      type: "array",
      group: "monograph",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "evidenceEstablished",
      title: "Evidence — Established",
      type: "array",
      group: "monograph",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "evidenceEmerging",
      title: "Evidence — Emerging",
      type: "array",
      group: "monograph",
      of: [{ type: "text" }],
    }),

    // ── Provenance & Quality ──
    defineField({
      name: "provenanceOrigin",
      title: "Origin",
      type: "array",
      group: "provenance",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "provenanceCultivation",
      title: "Cultivation",
      type: "array",
      group: "provenance",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "provenanceHarvesting",
      title: "Harvesting",
      type: "array",
      group: "provenance",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "laboratoryVerification",
      title: "Laboratory Verification",
      type: "array",
      group: "provenance",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "qualityAssurance",
      title: "Quality Assurance",
      type: "array",
      group: "provenance",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "certificates",
      title: "Certificates of Analysis",
      type: "array",
      group: "provenance",
      of: [{ type: "downloadFile" }],
    }),

    // ── Usage & Storage ──
    defineField({
      name: "suggestedUse",
      title: "Suggested Use",
      type: "array",
      group: "usage",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "preparation",
      title: "Preparation",
      type: "array",
      group: "usage",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "storage",
      title: "Storage Instructions",
      type: "array",
      group: "usage",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "contraindications",
      title: "Contraindications",
      type: "array",
      group: "usage",
      of: [{ type: "text" }],
    }),

    // ── Commerce ──
    defineField({
      name: "volume",
      title: "Volume / Size",
      type: "string",
      group: "commerce",
    }),
    defineField({
      name: "price",
      title: "Price (£)",
      type: "number",
      group: "commerce",
    }),
    defineField({
      name: "priceNote",
      title: "Price Note",
      type: "string",
      group: "commerce",
      description: "Context for the price, e.g. 'laboratory-verified · 250ml'",
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      group: "commerce",
      initialValue: true,
    }),
    defineField({
      name: "futureShopifyProductId",
      title: "Shopify Product ID",
      type: "string",
      group: "commerce",
      description: "Future: Shopify integration. Leave empty.",
      hidden: true,
    }),
    defineField({
      name: "futureShopifyVariantId",
      title: "Shopify Variant ID",
      type: "string",
      group: "commerce",
      hidden: true,
    }),
    defineField({
      name: "commerce",
      title: "Commerce Reference",
      type: "commerceReference",
      group: "commerce",
      description: "The join to Shopify. Required unless purchaseFraming is reference-only.",
    }),
    defineField({
      name: "purchaseFraming",
      title: "Purchase Framing",
      type: "string",
      group: "commerce",
      options: {
        list: [
          { title: "Standard", value: "standard" },
          { title: "Education First", value: "education-first" },
          { title: "Reference Only", value: "reference-only" },
        ],
      },
      initialValue: "standard",
      description: "Controls how prominent the purchase affordance is within the existing design.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shipping",
      title: "Shipping Information",
      type: "array",
      group: "commerce",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "returns",
      title: "Returns Policy",
      type: "array",
      group: "commerce",
      of: [{ type: "text" }],
    }),

    // ── Media ──
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
        defineField({ name: "cloudinaryAssetId", title: "Cloudinary Asset ID", type: "string", hidden: true }),
      ],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
            defineField({ name: "cloudinaryAssetId", title: "Cloudinary Asset ID", type: "string", hidden: true }),
          ],
        },
      ],
    }),
    defineField({
      name: "videos",
      title: "Videos",
      type: "array",
      group: "media",
      of: [{ type: "institutionalVideo" }],
    }),
    defineField({
      name: "downloads",
      title: "Downloads",
      type: "array",
      group: "media",
      of: [{ type: "downloadFile" }],
    }),

    // ── Relations ──
    defineField({
      name: "ingredients",
      title: "Ingredients",
      type: "array",
      group: "relations",
      of: [{ type: "reference", to: [{ type: "ingredient" }] }],
    }),
    defineField({
      name: "relatedProducts",
      title: "Related Products",
      type: "array",
      group: "relations",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "collection",
      title: "Collection",
      type: "reference",
      group: "relations",
      to: [{ type: "collection" }],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      group: "relations",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "academyLessons",
      title: "Academy Lessons",
      type: "array",
      group: "relations",
      of: [{ type: "internalLink" }],
    }),
    defineField({
      name: "knowledgeLibrary",
      title: "Knowledge Library",
      type: "array",
      group: "relations",
      of: [{ type: "internalLink" }],
    }),
    defineField({
      name: "pathways",
      title: "Pathways",
      type: "array",
      group: "relations",
      of: [{ type: "internalLink" }],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      group: "relations",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "question", title: "Question", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "answer", title: "Answer", type: "text", validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),

    // ── Scholarship (Phase 4 Commerce) ──
    defineField({
      name: "traditionLayers",
      title: "Tradition Layers",
      type: "traditionLayers",
      group: "scholarship",
      description: "The four-layer honesty framework for this product's tradition.",
    }),
    defineField({
      name: "sources",
      title: "Sources",
      type: "array",
      group: "scholarship",
      of: [{ type: "sourceReference" }],
      description: "Citations (hadith/Qur'an/research) backing claims.",
    }),

    // ── Clinical (Phase 4 Commerce) ──
    defineField({
      name: "clinicalNotes",
      title: "Clinical Notes",
      type: "array",
      group: "clinical",
      of: [{ type: "productClinicalNote" }],
      description: "Safety/therapeutic notes with review workflow.",
    }),

    // ── Connections (Phase 4 Commerce) ──
    defineField({
      name: "primaryIngredient",
      title: "Primary Ingredient",
      type: "reference",
      group: "connections",
      to: [{ type: "ingredient" }],
      description: "Links product to its ingredient hub.",
    }),
    defineField({
      name: "crossReferences",
      title: "Cross References",
      type: "array",
      group: "connections",
      of: [
        { type: "reference", to: [{ type: "article" }] },
        { type: "reference", to: [{ type: "ingredient" }] },
        { type: "reference", to: [{ type: "programme" }] },
        { type: "reference", to: [{ type: "journey" }] },
      ],
      description: "Connective tissue: learn-more links to related content.",
    }),
    defineField({
      name: "editorialProvenance",
      title: "Provenance",
      type: "provenanceNote",
      group: "connections",
      description: "Editorial provenance story (distinct from Shopify country-of-origin).",
    }),

    // ── SEO ──
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),

    // ── Editorial ──
    defineField({
      name: "editorial",
      title: "Editorial Workflow",
      type: "editorialWorkflow",
      group: "editorial",
    }),
    defineField({
      name: "orderRank",
      title: "Display Order",
      type: "number",
      group: "editorial",
    }),

    // ── Operations (Phase 4) ──
    defineField({
      name: "allergenData",
      title: "Allergen Information",
      type: "array",
      group: "operations",
      of: [{ type: "string" }],
      description: "Allergens present in or handled alongside this product. Required for food-safety compliance.",
    }),
    defineField({
      name: "batchRecords",
      title: "Batch Records",
      type: "array",
      group: "operations",
      of: [{ type: "reference", to: [{ type: "batchRecord" }] }],
      description: "Linked batch records for traceability. Enables recall readiness.",
    }),
    defineField({
      name: "storageRequirements",
      title: "Storage Requirements (Internal)",
      type: "string",
      group: "operations",
      description: "Internal storage conditions — temperature, light, humidity requirements for the dispensary.",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "botanicalName",
      media: "mainImage",
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderRankAsc",
      by: [{ field: "orderRank", direction: "asc" }],
    },
    {
      title: "Name",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
});
