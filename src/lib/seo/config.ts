/**
 * SEO Configuration — Institutional defaults (Tier 1).
 *
 * The single source for site-wide metadata constants.
 * Never import brand/marketing values from elsewhere; they live here.
 */

export const seoConfig = {
  siteName: "Sunnah Remedies",
  siteUrl: "https://www.sunnahremedies.com",
  titleTemplate: "%s · Sunnah Remedies",
  defaultTitle: "Sunnah Remedies — Institute of Prophetic Medicine",
  defaultDescription:
    "An institute of Prophetic Medicine for scholarship, clinical care, and natural therapeutics under one house — grounded in primary-source scholarship, laboratory verification, and clinical accountability.",
  defaultOgImage: "/brand/og-default.jpg",
  locale: "en_GB",
  twitterHandle: "@sunnahremedies",
  organizationName: "Sunnah Remedies",
  foundingDate: "2025",
  logo: "/brand/logo-lockup-dark.svg",
  medicalSpecialty: "Prophetic Medicine (Ṭibb al-Nabawī)",
} as const;

export type RobotsDirective = "index" | "noindex" | "follow" | "nofollow";

/**
 * Per-type indexation and metadata defaults (Tier 2).
 */
export const typeDefaults: Record<
  string,
  {
    titlePattern: string;
    descriptionPattern?: string;
    robots: string;
    schemaType: string;
  }
> = {
  product: {
    titlePattern: "{name} — Natural Remedy | Sunnah Remedies",
    descriptionPattern: "{shortDescription} — sourced, verified, dispensed with care.",
    robots: "index, follow",
    schemaType: "Product",
  },
  ingredient: {
    titlePattern: "{name} — Benefits, Evidence & Prophetic Tradition | Sunnah Remedies",
    descriptionPattern: "{definition} — scholarly sourcing, laboratory verification, and honest evidence.",
    robots: "index, follow",
    schemaType: "MedicalWebPage",
  },
  condition: {
    titlePattern: "{name} — Prophetic Remedies & Evidence | Sunnah Remedies",
    descriptionPattern: "What the Prophetic tradition says about {name} — reviewed evidence, cited sources, stated limits.",
    robots: "index, follow",
    schemaType: "MedicalWebPage",
  },
  article: {
    titlePattern: "{title} | Sunnah Remedies",
    robots: "index, follow",
    schemaType: "Article",
  },
  course: {
    titlePattern: "{name} — Academy | Sunnah Remedies",
    descriptionPattern: "{shortDescription} — clinical education structured by isnād.",
    robots: "index, follow",
    schemaType: "Course",
  },
  hadith: {
    titlePattern: "{title} — Hadith Reference | Sunnah Remedies",
    robots: "index, follow",
    schemaType: "CreativeWork",
  },
  quranReference: {
    titlePattern: "{title} — Qur'anic Reference | Sunnah Remedies",
    robots: "index, follow",
    schemaType: "CreativeWork",
  },
  research: {
    titlePattern: "{title} — Research | Sunnah Remedies",
    robots: "index, follow",
    schemaType: "MedicalStudy",
  },
  faculty: {
    titlePattern: "{name} — Faculty | Sunnah Remedies",
    robots: "index, follow",
    schemaType: "Person",
  },
  journey: {
    titlePattern: "{name} — Sacred Journeys | Sunnah Remedies",
    robots: "index, follow",
    schemaType: "Event",
  },
  video: {
    titlePattern: "{title} — Video | Sunnah Remedies",
    robots: "index, follow",
    schemaType: "VideoObject",
  },
  faq: {
    titlePattern: "{question} | Sunnah Remedies",
    robots: "index, follow",
    schemaType: "FAQPage",
  },
  collection: {
    titlePattern: "{name} — Collection | Sunnah Remedies",
    robots: "index, follow",
    schemaType: "CollectionPage",
  },
  citation: {
    titlePattern: "{title} — Citation | Sunnah Remedies",
    robots: "index, follow",
    schemaType: "CreativeWork",
  },
  // Noindex types
  search: {
    titlePattern: "Search | Sunnah Remedies",
    robots: "noindex, follow",
    schemaType: "SearchResultsPage",
  },
  cart: {
    titlePattern: "Cart | Sunnah Remedies",
    robots: "noindex, nofollow",
    schemaType: "WebPage",
  },
};
