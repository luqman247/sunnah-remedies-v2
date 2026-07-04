import { defineField, defineType } from "sanity";

/**
 * Hadith reference entity.
 */
export const hadith = defineType({
  name: "hadith",
  title: "Hadith",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title / Summary", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "arabicText", title: "Arabic Text", type: "text" }),
    defineField({ name: "translation", title: "English Translation", type: "text" }),
    defineField({ name: "collection", title: "Collection", type: "string", description: "e.g. Ṣaḥīḥ al-Bukhārī" }),
    defineField({ name: "number", title: "Hadith Number", type: "string" }),
    defineField({
      name: "authenticity",
      title: "Authenticity Grading",
      type: "string",
      options: { list: [
        { title: "Ṣaḥīḥ (authentic)", value: "sahih" },
        { title: "Ḥasan (good)", value: "hasan" },
        { title: "Ḍaʿīf (weak)", value: "daif" },
        { title: "Ṣaḥīḥ li-ghayrih", value: "sahih-li-ghayrih" },
        { title: "Ḥasan li-ghayrih", value: "hasan-li-ghayrih" },
        { title: "Mawḍūʿ (fabricated)", value: "mawdu" },
      ] },
    }),
    defineField({ name: "narrator", title: "Narrator (Companion)", type: "string" }),
    defineField({ name: "topic", title: "Topic", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "commentary", title: "Commentary", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "relationships", title: "Relationships", type: "array", of: [{ type: "relationship" }] }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "collection" },
  },
});

/**
 * Qur'anic reference entity.
 */
export const quranReferenceDoc = defineType({
  name: "quranReferenceDoc",
  title: "Qur'anic Reference",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "surah", title: "Surah Name", type: "string" }),
    defineField({ name: "surahNumber", title: "Surah Number", type: "number" }),
    defineField({ name: "ayahStart", title: "Ayah Start", type: "number" }),
    defineField({ name: "ayahEnd", title: "Ayah End", type: "number" }),
    defineField({ name: "arabicText", title: "Arabic Text", type: "text" }),
    defineField({ name: "translation", title: "English Translation", type: "text" }),
    defineField({ name: "topic", title: "Topic", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "tafsir", title: "Tafsir / Commentary", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "relationships", title: "Relationships", type: "array", of: [{ type: "relationship" }] }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "surah" },
  },
});

/**
 * Research paper entity.
 */
export const researchPaper = defineType({
  name: "researchPaper",
  title: "Research Paper",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "authors", title: "Authors", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "abstract", title: "Abstract", type: "text" }),
    defineField({ name: "publicationDate", title: "Publication Date", type: "date" }),
    defineField({ name: "journal", title: "Journal", type: "string" }),
    defineField({ name: "doi", title: "DOI", type: "string" }),
    defineField({
      name: "studyType",
      title: "Study Type",
      type: "string",
      options: { list: [
        { title: "Randomised Controlled Trial", value: "rct" },
        { title: "Systematic Review / Meta-analysis", value: "review" },
        { title: "Cohort Study", value: "cohort" },
        { title: "Case Study", value: "case" },
        { title: "Observational", value: "observational" },
        { title: "In vitro / Laboratory", value: "invitro" },
        { title: "Traditional knowledge review", value: "traditional" },
      ] },
    }),
    defineField({ name: "evidenceLevel", title: "Evidence Level", type: "string", options: { list: [
      { title: "Strong", value: "strong" },
      { title: "Moderate", value: "moderate" },
      { title: "Limited", value: "limited" },
    ] } }),
    defineField({ name: "summary", title: "Institutional Summary", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "relationships", title: "Relationships", type: "array", of: [{ type: "relationship" }] }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "journal" },
  },
});

/**
 * Scholar entity.
 */
export const scholar = defineType({
  name: "scholar",
  title: "Scholar",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "era", title: "Era / Period", type: "string" }),
    defineField({ name: "biography", title: "Biography", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "specialisation", title: "Specialisation", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "mainImage", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: "name", subtitle: "era" },
  },
});

/**
 * Bibliographic reference entity (for citation pages).
 */
export const reference = defineType({
  name: "reference",
  title: "Reference / Citation",
  type: "document",
  fields: [
    defineField({ name: "refId", title: "Reference ID", type: "string", validation: (r) => r.required(), description: "Stable, permanent identifier for this citation." }),
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "refId" }, validation: (r) => r.required() }),
    defineField({ name: "type", title: "Type", type: "string", options: { list: [
      { title: "Hadith", value: "hadith" },
      { title: "Qur'an", value: "quran" },
      { title: "Book", value: "book" },
      { title: "Research Paper", value: "paper" },
      { title: "Manuscript", value: "manuscript" },
      { title: "Online", value: "online" },
    ] } }),
    defineField({ name: "author", title: "Author(s)", type: "string" }),
    defineField({ name: "source", title: "Source / Publisher", type: "string" }),
    defineField({ name: "collection", title: "Collection", type: "string" }),
    defineField({ name: "number", title: "Number / Volume", type: "string" }),
    defineField({ name: "doi", title: "DOI", type: "string" }),
    defineField({ name: "isbn", title: "ISBN", type: "string" }),
    defineField({ name: "year", title: "Year", type: "string" }),
    defineField({ name: "url", title: "URL", type: "url" }),
    defineField({ name: "grading", title: "Grading (hadith)", type: "string" }),
    defineField({ name: "notes", title: "Notes", type: "text", rows: 3 }),
  ],
  preview: {
    select: { title: "title", subtitle: "refId" },
  },
});
