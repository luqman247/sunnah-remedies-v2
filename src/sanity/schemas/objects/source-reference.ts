/**
 * Source reference — citations with grading and verification.
 *
 * Encodes the scholarly standard: attribution + grading.
 * The "Ibn al-Qayyim rule": unverified attributions are marked as such.
 *
 * @see Phase 4 Part 2, Spec 09 §9.9
 */

import { defineField, defineType } from "sanity";

export const sourceReference = defineType({
  name: "sourceReference",
  title: "Source Reference",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Hadith", value: "hadith" },
          { title: "Qur'an", value: "quran" },
          { title: "Research", value: "research" },
          { title: "Book", value: "book" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "citation",
      title: "Citation",
      type: "string",
      description: "Human-readable citation text.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hadithCollection",
      title: "Hadith Collection",
      type: "string",
      hidden: ({ parent }) => parent?.type !== "hadith",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string } | undefined;
          if (parent?.type === "hadith" && !value) {
            return "Required for hadith references.";
          }
          return true;
        }),
    }),
    defineField({
      name: "hadithNumber",
      title: "Hadith Number",
      type: "string",
      hidden: ({ parent }) => parent?.type !== "hadith",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string } | undefined;
          if (parent?.type === "hadith" && !value) {
            return "Required for hadith references.";
          }
          return true;
        }),
    }),
    defineField({
      name: "hadithGrading",
      title: "Hadith Grading",
      type: "string",
      options: {
        list: [
          { title: "Sahih (Authentic)", value: "sahih" },
          { title: "Hasan (Good)", value: "hasan" },
          { title: "Da'if (Weak)", value: "daif" },
          { title: "Mawdu' (Fabricated)", value: "mawdu" },
          { title: "Other", value: "other" },
        ],
      },
      hidden: ({ parent }) => parent?.type !== "hadith",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string } | undefined;
          if (parent?.type === "hadith" && !value) {
            return "Required for hadith references. Weak/fabricated must be labelled.";
          }
          return true;
        }),
    }),
    defineField({
      name: "surah",
      title: "Surah",
      type: "string",
      hidden: ({ parent }) => parent?.type !== "quran",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string } | undefined;
          if (parent?.type === "quran" && !value) {
            return "Required for Qur'an references.";
          }
          return true;
        }),
    }),
    defineField({
      name: "ayah",
      title: "Ayah",
      type: "string",
      hidden: ({ parent }) => parent?.type !== "quran",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string } | undefined;
          if (parent?.type === "quran" && !value) {
            return "Required for Qur'an references.";
          }
          return true;
        }),
    }),
    defineField({
      name: "sourceUrl",
      title: "Source URL",
      type: "url",
      description: "Link to a verified source.",
    }),
    defineField({
      name: "verifiedStatus",
      title: "Verified Status",
      type: "string",
      options: {
        list: [
          { title: "Verified", value: "verified" },
          { title: "Unverified", value: "unverified" },
        ],
      },
      initialValue: "unverified",
      validation: (rule) => rule.required(),
      description:
        "The Ibn al-Qayyim rule: an attribution that cannot be traced is marked unverified.",
    }),
  ],
  preview: {
    select: { title: "citation", subtitle: "type" },
  },
});
