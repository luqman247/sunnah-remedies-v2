import { defineField, defineType } from "sanity";

export const journey = defineType({
  name: "journey",
  title: "Journey",
  type: "document",
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "preparation", title: "Preparation" },
    { name: "itinerary", title: "Itinerary" },
    { name: "education", title: "Education" },
    { name: "logistics", title: "Logistics" },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO" },
    { name: "editorial", title: "Editorial" },
  ],
  fields: [
    // ── Overview ──
    defineField({ name: "name", title: "Journey Name", type: "string", group: "overview", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", group: "overview", options: { source: "name", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "subtitle", title: "Subtitle", type: "string", group: "overview" }),
    defineField({ name: "folio", title: "Folio", type: "string", group: "overview" }),
    defineField({ name: "meaning", title: "Meaning & Purpose", type: "array", group: "overview", of: [{ type: "text" }] }),
    defineField({ name: "season", title: "Season", type: "string", group: "overview" }),
    defineField({ name: "duration", title: "Duration", type: "string", group: "overview" }),
    defineField({ name: "location", title: "Location", type: "string", group: "overview" }),
    defineField({ name: "groupSize", title: "Group Size", type: "string", group: "overview" }),
    defineField({ name: "fee", title: "Fee", type: "string", group: "overview" }),
    defineField({ name: "feeNote", title: "Fee Note", type: "string", group: "overview" }),
    defineField({ name: "nextDeparture", title: "Next Departure", type: "string", group: "overview" }),
    defineField({ name: "forWhom", title: "For Whom", type: "array", group: "overview", of: [{ type: "text" }] }),
    defineField({ name: "whatItAsks", title: "What It Asks", type: "array", group: "overview", of: [{ type: "text" }] }),

    // ── Preparation ──
    defineField({ name: "preparation", title: "Preparation", type: "array", group: "preparation", of: [{ type: "text" }] }),
    defineField({ name: "reading", title: "Reading List", type: "array", group: "preparation", of: [{ type: "object", fields: [defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }), defineField({ name: "note", title: "Note", type: "string" })], preview: { select: { title: "title" } } }] }),
    defineField({ name: "packing", title: "Packing List", type: "array", group: "preparation", of: [{ type: "text" }] }),
    defineField({ name: "healthGuidance", title: "Health Guidance", type: "array", group: "preparation", of: [{ type: "text" }] }),

    // ── Itinerary ──
    defineField({
      name: "itinerary",
      title: "Itinerary",
      type: "array",
      group: "itinerary",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "day", title: "Day", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "focus", title: "Focus", type: "string" }),
          defineField({ name: "activities", title: "Activities", type: "array", of: [{ type: "string" }] }),
        ],
        preview: { select: { title: "title", subtitle: "day" }, prepare: ({ title, subtitle }) => ({ title: `${subtitle}: ${title}` }) },
      }],
    }),
    defineField({
      name: "scholars",
      title: "Accompanying Scholars",
      type: "array",
      group: "itinerary",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "role", title: "Role", type: "string" }),
          defineField({ name: "grounding", title: "Grounding", type: "string" }),
          defineField({ name: "biography", title: "Biography", type: "array", of: [{ type: "text" }] }),
        ],
        preview: { select: { title: "name", subtitle: "role" } },
      }],
    }),

    // ── Education ──
    defineField({
      name: "educationalSessions",
      title: "Educational Sessions",
      type: "array",
      group: "education",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "format", title: "Format", type: "string" }),
          defineField({ name: "description", title: "Description", type: "text" }),
        ],
        preview: { select: { title: "title", subtitle: "format" } },
      }],
    }),
    defineField({ name: "learning", title: "Learning Framework", type: "array", group: "education", of: [{ type: "text" }] }),
    defineField({ name: "reflection", title: "Reflection Practice", type: "array", group: "education", of: [{ type: "text" }] }),
    defineField({ name: "reflectionJournals", title: "Reflection Journals", type: "array", group: "education", of: [{ type: "text" }] }),
    defineField({ name: "spiritualGrowth", title: "Spiritual Growth", type: "array", group: "education", of: [{ type: "text" }] }),

    // ── Logistics ──
    defineField({ name: "flightGuidance", title: "Flight Guidance", type: "array", group: "logistics", of: [{ type: "text" }] }),
    defineField({ name: "accommodationPhilosophy", title: "Accommodation", type: "array", group: "logistics", of: [{ type: "text" }] }),
    defineField({ name: "companionship", title: "Companionship", type: "array", group: "logistics", of: [{ type: "text" }] }),
    defineField({ name: "guidance", title: "Guidance", type: "array", group: "logistics", of: [{ type: "text" }] }),
    defineField({ name: "safety", title: "Safety", type: "array", group: "logistics", of: [{ type: "text" }] }),
    defineField({ name: "organisation", title: "Organisation", type: "array", group: "logistics", of: [{ type: "text" }] }),
    defineField({
      name: "policies",
      title: "Policies",
      type: "array",
      group: "logistics",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "body", title: "Body", type: "array", of: [{ type: "text" }] }),
        ],
        preview: { select: { title: "title" } },
      }],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      group: "logistics",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "question", title: "Question", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "answer", title: "Answer", type: "text", validation: (rule) => rule.required() }),
        ],
        preview: { select: { title: "question" } },
      }],
    }),
    defineField({ name: "pathways", title: "Pathways", type: "array", group: "logistics", of: [{ type: "internalLink" }] }),

    // ── Media ──
    defineField({ name: "heroImage", title: "Hero Image", type: "image", group: "media", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alt Text", type: "string" }), defineField({ name: "cloudinaryAssetId", title: "Cloudinary Asset ID", type: "string", hidden: true })] }),
    defineField({ name: "gallery", title: "Gallery", type: "array", group: "media", of: [{ type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alt Text", type: "string" }), defineField({ name: "caption", title: "Caption", type: "string" })] }] }),
    defineField({ name: "videos", title: "Videos", type: "array", group: "media", of: [{ type: "institutionalVideo" }] }),
    defineField({ name: "downloads", title: "Downloads", type: "array", group: "media", of: [{ type: "downloadFile" }] }),

    // ── SEO & Editorial ──
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
    defineField({ name: "editorial", title: "Editorial Workflow", type: "editorialWorkflow", group: "editorial" }),
    defineField({ name: "orderRank", title: "Display Order", type: "number", group: "editorial" }),
  ],
  preview: {
    select: { title: "name", subtitle: "nextDeparture", media: "heroImage" },
  },
});
