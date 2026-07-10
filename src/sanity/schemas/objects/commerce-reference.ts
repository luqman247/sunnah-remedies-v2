/**
 * Commerce reference — the join key between Sanity editorial and Shopify commerce.
 *
 * Price, availability, and stock are NEVER stored here — only the join key.
 *
 * @see Phase 4 Part 2, Spec 09 §9.4
 */

import { defineField, defineType } from "sanity";
import { ShopifyProductIdInput } from "@/sanity/components/ShopifyProductIdInput";

export const commerceReference = defineType({
  name: "commerceReference",
  title: "Commerce Reference",
  type: "object",
  fields: [
    defineField({
      name: "shopifyProductId",
      title: "Shopify Product ID",
      type: "string",
      description:
        "Authoritative Shopify Global ID (GID). Selected or pasted from Admin — never invented.",
      components: { input: ShopifyProductIdInput },
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true;
          if (!/^gid:\/\/shopify\/Product\/\d+$/.test(value)) {
            return "Must be a valid Shopify Product GID (gid://shopify/Product/{digits}).";
          }
          return true;
        }),
    }),
    defineField({
      name: "shopifyHandle",
      title: "Shopify Handle",
      type: "string",
      description:
        "Convenience handle for URL lookup. Mutable — never the sole join key. ID is authoritative.",
    }),
    defineField({
      name: "variantMap",
      title: "Variant Map",
      type: "array",
      of: [{ type: "variantReference" }],
      description:
        "Maps editorially known variants to Shopify variant GIDs. Price and stock stay in Shopify.",
    }),
    defineField({
      name: "status",
      title: "Shopify Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Draft", value: "draft" },
          { title: "Archived", value: "archived" },
        ],
      },
      readOnly: true,
      description: "Synced from Shopify by webhook. Never set manually.",
    }),
    defineField({
      name: "lastSyncedAt",
      title: "Last Synced",
      type: "datetime",
      readOnly: true,
      description: "Diagnostic — set by webhook sync.",
    }),
  ],
  preview: {
    select: {
      title: "shopifyHandle",
      id: "shopifyProductId",
      status: "status",
    },
    prepare({ title, id, status }) {
      const linked = typeof id === "string" && id.length > 0;
      return {
        title: title || (linked ? "Shopify product" : "No Shopify link"),
        subtitle: [
          linked ? "Linked" : "Unlinked",
          status ? String(status) : null,
          linked ? String(id) : null,
        ]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});
