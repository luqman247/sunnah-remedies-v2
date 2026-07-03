import { defineField, defineType } from "sanity";

export const globalSeo = defineType({
  name: "globalSeo",
  title: "Global SEO",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      initialValue: "Sunnah Remedies",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "siteDescription",
      title: "Site Description",
      type: "text",
      rows: 3,
      initialValue: "An institute of Prophetic Medicine for scholarship, clinical care, and natural therapeutics under one house.",
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default Social Sharing Image",
      type: "image",
      description: "Used when individual pages don't have a social image. Recommended: 1200x630px.",
      options: { hotspot: true },
    }),
    defineField({
      name: "twitterHandle",
      title: "Twitter Handle",
      type: "string",
      description: "Without the @ symbol.",
    }),
    defineField({
      name: "keywords",
      title: "Default Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "googleVerification",
      title: "Google Site Verification",
      type: "string",
      description: "Google Search Console verification meta tag content.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Global SEO" }),
  },
});
