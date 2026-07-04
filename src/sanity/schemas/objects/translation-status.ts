import { defineType, defineField } from "sanity";

export const translationStatus = defineType({
  name: "translationStatus",
  title: "Translation status",
  type: "object",
  fields: [
    defineField({
      name: "state",
      type: "string",
      title: "Status",
      options: {
        list: [
          { title: "Up to date", value: "upToDate" },
          { title: "AI draft — needs review", value: "aiDraft" },
          { title: "Needs translation", value: "needsTranslation" },
        ],
        layout: "radio",
      },
      initialValue: "needsTranslation",
    }),
    defineField({
      name: "sourceVersion",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "lastReviewedAt",
      type: "datetime",
      readOnly: true,
    }),
  ],
});
