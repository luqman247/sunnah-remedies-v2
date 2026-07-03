import { defineField, defineType } from "sanity";

export const programme = defineType({
  name: "programme",
  title: "Programme",
  type: "document",
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "curriculum", title: "Curriculum" },
    { name: "assessment", title: "Assessment & Certification" },
    { name: "practical", title: "Practical" },
    { name: "policies", title: "Policies & Handbook" },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO" },
    { name: "editorial", title: "Editorial" },
  ],
  fields: [
    // ── Overview ──
    defineField({
      name: "name",
      title: "Programme Name",
      type: "string",
      group: "overview",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "overview",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      group: "overview",
    }),
    defineField({
      name: "folio",
      title: "Folio",
      type: "string",
      group: "overview",
    }),
    defineField({
      name: "tier",
      title: "Tier",
      type: "string",
      group: "overview",
      options: {
        list: [
          { title: "Essential", value: "Essential" },
          { title: "Professional", value: "Professional" },
          { title: "Advanced", value: "Advanced" },
          { title: "Licensed", value: "Licensed" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      group: "overview",
    }),
    defineField({
      name: "format",
      title: "Format",
      type: "string",
      group: "overview",
    }),
    defineField({
      name: "fee",
      title: "Fee",
      type: "string",
      group: "overview",
    }),
    defineField({
      name: "feeNote",
      title: "Fee Note",
      type: "string",
      group: "overview",
    }),
    defineField({
      name: "nextCohort",
      title: "Next Cohort",
      type: "string",
      group: "overview",
    }),
    defineField({
      name: "whatItIs",
      title: "What It Is",
      type: "array",
      group: "overview",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "forWhom",
      title: "For Whom",
      type: "array",
      group: "overview",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "whatItAsks",
      title: "What It Asks",
      type: "array",
      group: "overview",
      of: [{ type: "text" }],
    }),

    // ── Curriculum ──
    defineField({
      name: "curriculum",
      title: "Curriculum Modules",
      type: "array",
      group: "curriculum",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "number", title: "Module Number", type: "string" }),
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "hours", title: "Hours", type: "number" }),
            defineField({ name: "description", title: "Description", type: "text" }),
            defineField({ name: "sources", title: "Sources", type: "array", of: [{ type: "string" }] }),
            defineField({ name: "practical", title: "Practical Component", type: "string" }),
          ],
          preview: {
            select: { title: "title", subtitle: "number" },
            prepare: ({ title, subtitle }) => ({
              title: `${subtitle ? `Module ${subtitle}: ` : ""}${title}`,
            }),
          },
        },
      ],
    }),
    defineField({
      name: "faculty",
      title: "Faculty",
      type: "array",
      group: "curriculum",
      of: [{ type: "reference", to: [{ type: "faculty" }] }],
    }),
    defineField({
      name: "learningOutcomes",
      title: "Learning Outcomes",
      type: "array",
      group: "curriculum",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "outcome", title: "Outcome", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "assessed", title: "Assessed", type: "boolean", initialValue: true }),
          ],
          preview: { select: { title: "outcome" } },
        },
      ],
    }),

    // ── Assessment & Certification ──
    defineField({
      name: "assessment",
      title: "Assessment Methods",
      type: "array",
      group: "assessment",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "certification",
      title: "Certification",
      type: "array",
      group: "assessment",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "entryRequirements",
      title: "Entry Requirements",
      type: "array",
      group: "assessment",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "graduatePathways",
      title: "Graduate Pathways",
      type: "array",
      group: "assessment",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "body", title: "Body", type: "array", of: [{ type: "text" }] }),
            defineField({ name: "href", title: "Link", type: "string" }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),

    // ── Practical ──
    defineField({
      name: "clinicalPractice",
      title: "Clinical Practice",
      type: "array",
      group: "practical",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "clinicalStandards",
      title: "Clinical Standards",
      type: "array",
      group: "practical",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "body", title: "Body", type: "array", of: [{ type: "text" }] }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
    defineField({
      name: "practicalSessions",
      title: "Practical Sessions",
      type: "array",
      group: "practical",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "schedule", title: "Schedule", type: "string" }),
            defineField({ name: "hours", title: "Hours", type: "number" }),
            defineField({ name: "description", title: "Description", type: "text" }),
            defineField({ name: "supervision", title: "Supervision", type: "string" }),
          ],
          preview: { select: { title: "title", subtitle: "schedule" } },
        },
      ],
    }),
    defineField({
      name: "equipmentList",
      title: "Equipment List",
      type: "array",
      group: "practical",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "item", title: "Item", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "specification", title: "Specification", type: "string" }),
            defineField({
              name: "supplied",
              title: "Supplied By",
              type: "string",
              options: { list: ["Academy", "Student", "Shared"] },
            }),
          ],
          preview: { select: { title: "item", subtitle: "supplied" } },
        },
      ],
    }),

    // ── Policies & Handbook ──
    defineField({
      name: "courseHandbook",
      title: "Course Handbook",
      type: "array",
      group: "policies",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "body", title: "Body", type: "array", of: [{ type: "text" }] }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
    defineField({
      name: "studentGuide",
      title: "Student Guide",
      type: "array",
      group: "policies",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "body", title: "Body", type: "array", of: [{ type: "text" }] }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
    defineField({
      name: "policies",
      title: "Policies",
      type: "array",
      group: "policies",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "body", title: "Body", type: "array", of: [{ type: "text" }] }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
    defineField({
      name: "enrolmentJourney",
      title: "Enrolment Journey",
      type: "array",
      group: "policies",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "step", title: "Step", type: "string" }),
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", title: "Description", type: "text" }),
            defineField({ name: "duration", title: "Duration", type: "string" }),
          ],
          preview: {
            select: { title: "title", subtitle: "step" },
            prepare: ({ title, subtitle }) => ({ title: `${subtitle ? `Step ${subtitle}: ` : ""}${title}` }),
          },
        },
      ],
    }),

    // ── Media ──
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
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
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
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

    // ── Testimonials & FAQ ──
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      group: "overview",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "statement", title: "Statement", type: "text", validation: (rule) => rule.required() }),
            defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "context", title: "Context", type: "string" }),
            defineField({ name: "year", title: "Year", type: "string" }),
          ],
          preview: { select: { title: "name", subtitle: "context" } },
        },
      ],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      group: "overview",
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
    defineField({
      name: "facilities",
      title: "Facilities",
      type: "array",
      group: "practical",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", title: "Description", type: "text" }),
          ],
          preview: { select: { title: "name" } },
        },
      ],
    }),

    // ── SEO & Editorial ──
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
    defineField({ name: "editorial", title: "Editorial Workflow", type: "editorialWorkflow", group: "editorial" }),
    defineField({ name: "orderRank", title: "Display Order", type: "number", group: "editorial" }),
  ],
  preview: {
    select: { title: "name", subtitle: "tier", media: "heroImage" },
  },
  orderings: [
    { title: "Display Order", name: "orderRankAsc", by: [{ field: "orderRank", direction: "asc" }] },
  ],
});
