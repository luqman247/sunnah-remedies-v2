/**
 * Product clinical note — clinical/safety notes with review workflow.
 *
 * Distinct from the inline `clinicalNote` annotation in rich-content.
 * This carries a full review lifecycle for publish-gating.
 *
 * @see Phase 4 Part 2, Spec 09 §9.8
 */

import { defineField, defineType } from "sanity";

export const productClinicalNote = defineType({
  name: "productClinicalNote",
  title: "Clinical Note",
  type: "object",
  fields: [
    defineField({
      name: "note",
      title: "Note",
      type: "array",
      of: [{ type: "block" }],
      description:
        "Clinical/safety content: contraindications, intake guidance, cautions.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "reviewStatus",
      title: "Review Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "In Clinical Review", value: "in-clinical-review" },
          { title: "Approved", value: "approved" },
        ],
      },
      initialValue: "draft",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "reviewedBy",
      title: "Reviewed By",
      type: "reference",
      to: [{ type: "faculty" }, { type: "author" }],
      hidden: ({ parent }) => parent?.reviewStatus !== "approved",
    }),
    defineField({
      name: "reviewedAt",
      title: "Reviewed At",
      type: "datetime",
      hidden: ({ parent }) => parent?.reviewStatus !== "approved",
    }),
    defineField({
      name: "medicalAdviceLinePresent",
      title: "Medical Advice Disclaimer Present",
      type: "boolean",
      description:
        "Confirms the 'not a substitute for medical advice' line is placed at the point of decision.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { subtitle: "reviewStatus" },
    prepare({ subtitle }) {
      return {
        title: "Clinical Note",
        subtitle: subtitle ?? "draft",
      };
    },
  },
});
