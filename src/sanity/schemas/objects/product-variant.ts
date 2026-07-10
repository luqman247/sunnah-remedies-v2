/**
 * Optional product variant — size, volume, price, stock.
 * Not required for single-SKU products.
 */

import { defineField, defineType } from "sanity";

export const productVariant = defineType({
  name: "productVariant",
  title: "Product Variant",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "e.g. 250ml, 500g, Grade A",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
    }),
    defineField({
      name: "weight",
      title: "Weight",
      type: "string",
    }),
    defineField({
      name: "volume",
      title: "Volume",
      type: "string",
    }),
    defineField({
      name: "colour",
      title: "Colour",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "salePrice",
      title: "Sale Price",
      type: "number",
      validation: (rule) =>
        rule.min(0).custom((salePrice, context) => {
          const parent = context.parent as { price?: number } | undefined;
          if (
            typeof salePrice === "number" &&
            typeof parent?.price === "number" &&
            salePrice >= parent.price
          ) {
            return "Sale price must be lower than the regular price.";
          }
          return true;
        }),
    }),
    defineField({
      name: "stockQuantity",
      title: "Stock Quantity",
      type: "number",
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: "availability",
      title: "Availability",
      type: "string",
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
      name: "image",
      title: "Variant Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "shopifyVariantId",
      title: "Shopify Variant GID",
      type: "string",
      description: "Optional join when checkout is fulfilled via Shopify.",
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true;
          if (!/^gid:\/\/shopify\/ProductVariant\/\d+$/.test(value)) {
            return "Must be a valid Shopify Variant GID.";
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      title: "label",
      sku: "sku",
      price: "price",
      availability: "availability",
      media: "image",
    },
    prepare({ title, sku, price, availability, media }) {
      const priceText =
        typeof price === "number" ? `£${price.toFixed(2)}` : null;
      return {
        title: title || "Untitled variant",
        subtitle: [sku, priceText, availability].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
