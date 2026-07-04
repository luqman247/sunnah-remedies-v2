import { defineField, defineType } from "sanity";

/**
 * Batch Record — Product batch traceability for the Dispensary.
 *
 * Architectural decision: batch records live in Sanity alongside products
 * because they share the same access patterns and editorial lifecycle.
 * This enables recall readiness (Ch 05) and honest stock management (Ch 11)
 * without introducing a second data store.
 *
 * @see Phase 4, Chapter 05 — The Dispensary & Apothecary
 * @see Phase 4, Chapter 14 — Goods-in checklist
 */
export const batchRecord = defineType({
  name: "batchRecord",
  title: "Batch Record",
  type: "document",
  fields: [
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      description: "Link to the catalogue product. Can be assigned after receipt if unknown at goods-in.",
    }),
    defineField({
      name: "batchNumber",
      title: "Batch / Lot Number",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "supplier",
      title: "Supplier",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "receivedDate",
      title: "Date Received",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "quantity",
      title: "Quantity Received",
      type: "number",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "expiryDate",
      title: "Expiry Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "storageLocation",
      title: "Storage Location",
      type: "string",
    }),
    defineField({
      name: "verificationStatus",
      title: "Verification Status",
      type: "string",
      options: {
        list: [
          { title: "Awaiting Verification", value: "awaiting" },
          { title: "Verified — Passed", value: "verified" },
          { title: "Verified — Failed", value: "failed" },
          { title: "Quarantined", value: "quarantined" },
        ],
        layout: "radio",
      },
      initialValue: "awaiting",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "verificationRef",
      title: "Verification Reference",
      type: "string",
      description: "Lab report or certificate reference number.",
    }),
    defineField({
      name: "provenanceDocumentation",
      title: "Provenance Documentation Present",
      type: "boolean",
      description: "Origin, supplier certification, and batch documentation confirmed on receipt.",
      initialValue: false,
    }),
    defineField({
      name: "receivedBy",
      title: "Received By",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "conditionOnReceipt",
      title: "Condition on Receipt",
      type: "string",
      options: {
        list: [
          { title: "Good — no issues", value: "good" },
          { title: "Minor issue — noted", value: "minor-issue" },
          { title: "Rejected — quarantined", value: "rejected" },
        ],
      },
      initialValue: "good",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: "batchNumber",
      product: "product.name",
      date: "receivedDate",
      status: "verificationStatus",
    },
    prepare({ title, product, date, status }) {
      const statusLabel =
        status === "verified" ? "Verified" :
        status === "failed" ? "FAILED" :
        status === "quarantined" ? "Quarantined" :
        "Awaiting";
      return {
        title: `${product || "Unknown"} — ${title}`,
        subtitle: `${date || "No date"} · ${statusLabel}`,
      };
    },
  },
  orderings: [
    {
      title: "Received (Newest)",
      name: "receivedDesc",
      by: [{ field: "receivedDate", direction: "desc" }],
    },
    {
      title: "Expiry (Soonest)",
      name: "expiryAsc",
      by: [{ field: "expiryDate", direction: "asc" }],
    },
  ],
});
