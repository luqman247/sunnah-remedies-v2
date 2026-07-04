/**
 * Variant reference — maps editorial variant labels to Shopify variant GIDs.
 *
 * Price and stock live in Shopify, resolved at runtime by variant GID.
 * This object only provides the stable editorial-to-commerce mapping.
 *
 * @see Phase 4 Part 2, Spec 09 §9.5
 */

import { defineField, defineType } from "sanity";

export const variantReference = defineType({
  name: "variantReference",
  title: "Variant Reference",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Human label editors recognise (e.g. '50g', 'Grade A').",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sanityKey",
      title: "Sanity Key",
      type: "string",
      description: "Stable internal key for referencing this variant in editorial content.",
      validation: (rule) =>
        rule
          .required()
          .regex(/^[a-z0-9-]+$/, { name: "slug format" })
          .error("Use lowercase letters, numbers, and hyphens only."),
    }),
    defineField({
      name: "shopifyVariantId",
      title: "Shopify Variant ID",
      type: "string",
      description: "Shopify variant GID.",
      validation: (rule) =>
        rule
          .required()
          .custom((value) => {
            if (!value) return true;
            if (!/^gid:\/\/shopify\/ProductVariant\/\d+$/.test(value)) {
              return "Must be a valid Shopify Variant GID (gid://shopify/ProductVariant/{digits}).";
            }
            return true;
          }),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "sanityKey" },
  },
});
