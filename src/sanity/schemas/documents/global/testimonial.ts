import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "statement",
      title: "Statement",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "string",
      description: "e.g. 'Graduate, Hijama Diploma 2025' or 'Patient, clinical consultation'",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
    }),
    defineField({
      name: "department",
      title: "Department",
      type: "string",
      options: {
        list: [
          { title: "Apothecary", value: "apothecary" },
          { title: "Academy", value: "academy" },
          { title: "Sacred Journeys", value: "sacred-journeys" },
          { title: "Clinical", value: "clinical" },
          { title: "General", value: "general" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Show on homepage or department landing pages.",
    }),
    defineField({
      name: "consentObtained",
      title: "Consent Obtained",
      type: "boolean",
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "department" },
  },
});
