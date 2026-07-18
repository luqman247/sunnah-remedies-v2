/**
 * Data Bridge — Sanity-first with static fallback, locale-aware.
 *
 * Every function queries Sanity CMS with a language parameter. If Sanity
 * returns null/empty (content not yet published), it falls back to existing
 * static data files. If a locale-specific document doesn't exist, it falls
 * back to the default locale (English).
 */

import { client } from "./client";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import {
  filterPublicCatalogueProducts,
  isPublicCatalogueProduct,
} from "@/lib/commerce/public-product-guard";
import {
  homepageQuery,
  navigationQuery,
  footerQuery,
  institutionSettingsQuery,
  allProductsQuery,
  productBySlugQuery,
  allProgrammesQuery,
  programmeBySlugQuery,
  allJourneysQuery,
  journeyBySlugQuery,
  allArticlesQuery,
  articleBySlugQuery,
  allFacultyQuery,
  testimonialsByDepartmentQuery,
  faqsByDepartmentQuery,
  consultationsPageQuery,
  charterQuery,
  globalSeoQuery,
} from "./queries";
import type {
  HomepageData,
  Navigation,
  FooterSettings,
  Product,
  Programme,
  Journey,
  Article,
  Faculty,
  Testimonial,
  FaqItem,
} from "./types";

import { remedies, getRemedyBySlug as getStaticRemedy, getAllRemedySlugs } from "@/lib/content/remedies";
import { getHijamaDiploma, programmes as staticProgrammes, getAllProgrammeSlugs } from "@/lib/content/academy";
import { journeys as staticJourneys, getJourneyBySlug as getStaticJourney, getAllJourneySlugs } from "@/lib/content/journeys";
import { knowledgeTopics, getAllKnowledgeSlugs, getKnowledgeTopic } from "@/lib/content/sections/knowledge-library";
import { departments, apothecary, academy, sacredJourneys, knowledgeLibrary } from "@/lib/navigation/site-structure";
import type { Remedy } from "@/lib/content/types";
import type { AcademyProgramme } from "@/lib/content/academy/types";
import type { SacredJourney } from "@/lib/content/journeys/types";
import type { KnowledgeTopic } from "@/lib/content/sections/knowledge-library";

/* ── Helpers ────────────────────────────────────────────────────── */

export async function safeFetch<T>(
  query: string,
  params?: Record<string, string>,
  locale: string = DEFAULT_LOCALE,
  fallbackToDefault: boolean = true,
): Promise<T | null> {
  try {
    const mergedParams = { ...params, language: locale };
    const result = await client.fetch<T>(query, mergedParams);
    if (result) return result;

    if (fallbackToDefault && locale !== DEFAULT_LOCALE) {
      const fallback = await client.fetch<T>(query, { ...params, language: DEFAULT_LOCALE });
      return fallback;
    }
    return null;
  } catch {
    return null;
  }
}

/* ── Navigation ─────────────────────────────────────────────────── */

export interface NavigationData {
  items: { label: string; href: string; highlighted?: boolean; hidden?: boolean }[];
  announcement?: { active: boolean; message?: string; link?: string; linkLabel?: string };
  /** True when labels come from a Sanity document for the requested locale */
  fromCms: boolean;
}

export async function getNavigation(locale: string = DEFAULT_LOCALE): Promise<NavigationData> {
  const sanity = await safeFetch<Navigation>(navigationQuery, {}, locale, false);
  if (sanity?.mainNavigation?.length) {
    return {
      items: sanity.mainNavigation.filter(i => !i.hidden),
      announcement: sanity.announcementBar,
      fromCms: true,
    };
  }
  return {
    items: [
      ...departments.map(d => ({ label: d.label, href: d.href })),
      { label: "Clinical consultations", href: "/consultations", highlighted: true },
    ],
    fromCms: false,
  };
}

/* ── Footer ─────────────────────────────────────────────────────── */

export interface FooterData {
  preFooterStatement: string;
  preFooterAction: { label: string; href: string };
  columns: { title: string; links: { label: string; href: string }[] }[];
  closingStatement: string;
  colophon: string;
  /** True when content comes from a Sanity document for the requested locale */
  fromCms: boolean;
}

export async function getFooter(locale: string = DEFAULT_LOCALE): Promise<FooterData> {
  const sanity = await safeFetch<FooterSettings>(footerQuery, {}, locale, false);
  if (sanity?.columns?.length) {
    return {
      preFooterStatement: sanity.preFooterStatement || "Begin where you are. Whether you seek a remedy, wish to study, or are preparing for pilgrimage — the institution is open.",
      preFooterAction: sanity.preFooterAction || { label: "Request a consultation", href: "/consultations" },
      columns: sanity.columns,
      closingStatement: sanity.closingStatement || "Knowledge before commerce. Service before profit. Trust before growth.",
      colophon: sanity.colophon || "Sunnah Remedies · Est. MMXXV · Healing is from Allah · the remedy is a means",
      fromCms: true,
    };
  }
  return {
    preFooterStatement: "Begin where you are. Whether you seek a remedy, wish to study, or are preparing for pilgrimage — the institution is open.",
    preFooterAction: { label: "Request a consultation", href: "/consultations" },
    columns: [
      { title: "The Pillars", links: [{ label: "The Apothecary", href: "/the-apothecary" }, { label: "The Academy", href: "/the-academy" }, { label: "Sacred Journeys", href: "/sacred-journeys" }, { label: "Knowledge Library", href: "/knowledge-library" }] },
      { title: "Institution", links: [{ label: "The Institute", href: "/institute" }, { label: "Founding Charter", href: "/charter" }, { label: "The Institutional Year", href: "/calendar" }, { label: "Exhibitions", href: "/exhibitions" }, { label: "Research", href: "/research" }, { label: "The Press", href: "/press" }] },
      { title: "Connect", links: [{ label: "Correspondence", href: "/correspondence" }, { label: "Academy Enrolment", href: "/the-academy/enrolment" }, { label: "Journey Registration", href: "/sacred-journeys/registration" }] },
      { title: "Legal", links: [{ label: "Privacy", href: "/charter" }, { label: "Terms", href: "/charter" }, { label: "Accessibility", href: "/charter" }] },
    ],
    closingStatement: "Knowledge before commerce. Service before profit. Trust before growth.",
    colophon: "Sunnah Remedies · Est. MMXXV · Healing is from Allah · the remedy is a means",
    fromCms: false,
  };
}

/* ── Institution Settings ──────────────────────────────────────── */

export interface InstitutionSettingsData {
  name: string;
  descriptor?: string;
  tagline?: string;
  foundingYear?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialLinks?: { platform: string; url: string }[];
}

export async function getInstitutionSettings(locale: string = DEFAULT_LOCALE): Promise<InstitutionSettingsData> {
  const sanity = await safeFetch<InstitutionSettingsData>(institutionSettingsQuery, {}, locale);
  if (sanity?.name) return sanity;
  return {
    name: "Sunnah Remedies",
    descriptor: "Institute of Prophetic Medicine",
    foundingYear: "2025",
  };
}

/* ── Homepage ───────────────────────────────────────────────────── */

export async function getHomepage(locale: string = DEFAULT_LOCALE): Promise<HomepageData | null> {
  return safeFetch<HomepageData>(homepageQuery, {}, locale);
}

/* ── Global SEO ─────────────────────────────────────────────────── */

export interface GlobalSeoData {
  siteName?: string;
  siteDescription?: string;
  defaultOgImage?: { asset?: { url?: string } };
  twitterHandle?: string;
  keywords?: string[];
}

export async function getGlobalSeo(locale: string = DEFAULT_LOCALE): Promise<GlobalSeoData | null> {
  return safeFetch<GlobalSeoData>(globalSeoQuery, {}, locale);
}

/* ── Apothecary ─────────────────────────────────────────────────── */

export async function getAllProducts(locale: string = DEFAULT_LOCALE): Promise<Product[]> {
  const sanity = await safeFetch<Product[]>(allProductsQuery, {}, locale, false);
  if (sanity?.length) return filterPublicCatalogueProducts(sanity);
  if (locale !== DEFAULT_LOCALE) {
    const fallback = await safeFetch<Product[]>(allProductsQuery, {}, DEFAULT_LOCALE, false);
    if (fallback?.length) return filterPublicCatalogueProducts(fallback);
  }
  return filterPublicCatalogueProducts(remedies.map(r => remedyToProduct(r)));
}

export async function getProductBySlug(slug: string, locale: string = DEFAULT_LOCALE): Promise<Product | null> {
  if (!isPublicCatalogueProduct({ slug })) return null;

  const sanitize = (product: Product): Product | null => {
    if (!isPublicCatalogueProduct(product)) return null;
    return {
      ...product,
      relatedProducts: product.relatedProducts
        ? filterPublicCatalogueProducts(product.relatedProducts)
        : product.relatedProducts,
    };
  };

  const sanity = await safeFetch<Product>(productBySlugQuery, { slug }, locale, false);
  if (sanity) {
    return sanitize(sanity);
  }
  if (locale !== DEFAULT_LOCALE) {
    const fallback = await safeFetch<Product>(productBySlugQuery, { slug }, DEFAULT_LOCALE, false);
    if (fallback) {
      return sanitize(fallback);
    }
  }
  const staticRemedy = getStaticRemedy(slug);
  if (!staticRemedy) return null;
  return sanitize(remedyToProduct(staticRemedy));
}

export async function getProductSlugs(): Promise<{ slug: string; language: string }[]> {
  const sanity = await safeFetch<{ slug: { current: string }; language: string }[]>(
    `*[_type == "product" && !(_id in path("drafts.**"))
      && !(slug.current match "*verification*")
      && !(slug.current match "*do-not-buy*")
      && !(slug.current match "*fixture*")
      && !(name match "*Do Not Buy*")
    ]{ slug, language }`,
    {},
    DEFAULT_LOCALE,
    false,
  );
  if (sanity?.length) {
    return sanity
      .map(p => ({ slug: p.slug.current, language: p.language || DEFAULT_LOCALE }))
      .filter(p => isPublicCatalogueProduct({ slug: p.slug }));
  }
  return getAllRemedySlugs()
    .filter(s => isPublicCatalogueProduct({ slug: s }))
    .map(s => ({ slug: s, language: DEFAULT_LOCALE }));
}

function remedyToProduct(r: Remedy): Product {
  return {
    _id: r.slug,
    _type: "product",
    _createdAt: "",
    _updatedAt: "",
    _rev: "",
    name: r.name,
    slug: { _type: "slug", current: r.slug },
    transliteration: r.transliteration,
    botanicalName: r.botanicalName,
    nature: r.nature,
    institutionalSummary: r.institutionalSummary,
    folio: r.folio,
    historicalContext: r.historicalContext,
    propheticReferences: r.propheticReferences,
    traditionalScholarship: r.traditionalScholarship,
    traditionalUsage: r.traditionalUsage,
    evidenceEstablished: r.evidence.established,
    evidenceEmerging: r.evidence.emerging,
    provenanceOrigin: r.provenance.origin,
    provenanceCultivation: r.provenance.cultivation,
    provenanceHarvesting: r.provenance.harvesting,
    laboratoryVerification: r.laboratoryVerification,
    qualityAssurance: r.qualityAssurance,
    suggestedUse: r.suggestedUse,
    preparation: r.preparation,
    storage: r.storage,
    contraindications: r.contraindications,
    volume: r.volume,
    price: r.price,
    priceNote: r.priceNote,
    inStock: r.inStock,
    faq: r.faq,
    academyLessons: r.academyLessons.map(l => ({ label: l.title, href: l.href })),
    knowledgeLibrary: r.knowledgeLibrary.map(l => ({ label: l.title, href: l.href })),
    pathways: r.pathways.map(p => ({ label: p.label, href: p.href })),
    relatedProducts: r.relatedRemedies.map(slug => ({
      _id: slug,
      _type: "product" as const,
      _createdAt: "",
      _updatedAt: "",
      _rev: "",
      name: getStaticRemedy(slug)?.name || slug,
      slug: { _type: "slug" as const, current: slug },
    })).filter(p => p.name !== p._id) as Product[],
  };
}

/* ── Academy ────────────────────────────────────────────────────── */

export async function getAllProgrammes(locale: string = DEFAULT_LOCALE): Promise<Programme[]> {
  const sanity = await safeFetch<Programme[]>(allProgrammesQuery, {}, locale, false);
  if (sanity?.length) return sanity;
  if (locale !== DEFAULT_LOCALE) {
    const fallback = await safeFetch<Programme[]>(allProgrammesQuery, {}, DEFAULT_LOCALE, false);
    if (fallback?.length) return fallback;
  }
  return staticProgrammes.map(p => programmeToSanity(p));
}

export async function getProgrammeBySlug(slug: string, locale: string = DEFAULT_LOCALE): Promise<Programme | null> {
  const sanity = await safeFetch<Programme>(programmeBySlugQuery, { slug }, locale, false);
  if (sanity) return sanity;
  if (locale !== DEFAULT_LOCALE) {
    const fallback = await safeFetch<Programme>(programmeBySlugQuery, { slug }, DEFAULT_LOCALE, false);
    if (fallback) return fallback;
  }
  if (slug === "hijama-diploma" || slug === "hijama") {
    return programmeToSanity(getHijamaDiploma());
  }
  return null;
}

export async function getProgrammeSlugs(): Promise<{ slug: string; language: string }[]> {
  const sanity = await safeFetch<{ slug: { current: string }; language: string }[]>(
    `*[_type == "programme" && !(_id in path("drafts.**"))]{ slug, language }`,
    {},
    DEFAULT_LOCALE,
    false,
  );
  if (sanity?.length) return sanity.map(p => ({ slug: p.slug.current, language: p.language || DEFAULT_LOCALE }));
  return getAllProgrammeSlugs().map(s => ({ slug: s, language: DEFAULT_LOCALE }));
}

export async function getAllFaculty(locale: string = DEFAULT_LOCALE): Promise<Faculty[]> {
  const sanity = await safeFetch<Faculty[]>(allFacultyQuery, {}, locale);
  if (sanity?.length) return sanity;
  const diploma = getHijamaDiploma();
  return diploma.faculty.map(f => ({
    _id: f.name,
    _type: "faculty",
    _createdAt: "",
    _updatedAt: "",
    _rev: "",
    name: f.name,
    slug: { _type: "slug", current: f.name.toLowerCase().replace(/\s+/g, "-") },
    title: f.title,
    licence: f.licence,
    chain: f.chain,
    biography: f.biography,
  }));
}

function programmeToSanity(p: AcademyProgramme): Programme {
  return {
    _id: p.slug,
    _type: "programme",
    _createdAt: "",
    _updatedAt: "",
    _rev: "",
    name: p.name,
    slug: { _type: "slug", current: p.slug },
    subtitle: p.subtitle,
    folio: p.folio,
    tier: p.tier,
    duration: p.duration,
    format: p.format,
    fee: p.fee,
    feeNote: p.feeNote,
    nextCohort: p.nextCohort,
    whatItIs: p.whatItIs,
    forWhom: p.forWhom,
    whatItAsks: p.whatItAsks,
    curriculum: p.curriculum,
    learningOutcomes: p.learningOutcomes,
    assessment: p.assessment,
    certification: p.certification,
    entryRequirements: p.entryRequirements,
    clinicalPractice: p.clinicalPractice,
    faq: p.faq,
    testimonials: p.testimonials,
  };
}

/* ── Sacred Journeys ────────────────────────────────────────────── */

export async function getAllJourneys(locale: string = DEFAULT_LOCALE): Promise<Journey[]> {
  const sanity = await safeFetch<Journey[]>(allJourneysQuery, {}, locale, false);
  if (sanity?.length) return sanity;
  if (locale !== DEFAULT_LOCALE) {
    const fallback = await safeFetch<Journey[]>(allJourneysQuery, {}, DEFAULT_LOCALE, false);
    if (fallback?.length) return fallback;
  }
  return staticJourneys.map(j => journeyToSanity(j));
}

export async function getJourneyBySlug(slug: string, locale: string = DEFAULT_LOCALE): Promise<Journey | null> {
  const sanity = await safeFetch<Journey>(journeyBySlugQuery, { slug }, locale, false);
  if (sanity) return sanity;
  if (locale !== DEFAULT_LOCALE) {
    const fallback = await safeFetch<Journey>(journeyBySlugQuery, { slug }, DEFAULT_LOCALE, false);
    if (fallback) return fallback;
  }
  const staticJ = getStaticJourney(slug);
  return staticJ ? journeyToSanity(staticJ) : null;
}

export async function getJourneySlugs(): Promise<{ slug: string; language: string }[]> {
  const sanity = await safeFetch<{ slug: { current: string }; language: string }[]>(
    `*[_type == "journey" && !(_id in path("drafts.**"))]{ slug, language }`,
    {},
    DEFAULT_LOCALE,
    false,
  );
  if (sanity?.length) return sanity.map(j => ({ slug: j.slug.current, language: j.language || DEFAULT_LOCALE }));
  return getAllJourneySlugs().map(s => ({ slug: s, language: DEFAULT_LOCALE }));
}

function journeyToSanity(j: SacredJourney): Journey {
  return {
    _id: j.slug,
    _type: "journey",
    _createdAt: "",
    _updatedAt: "",
    _rev: "",
    name: j.name,
    slug: { _type: "slug", current: j.slug },
    subtitle: j.subtitle,
    folio: j.folio,
    meaning: j.meaning,
    season: j.season,
    duration: j.duration,
    location: j.location,
    groupSize: j.groupSize,
    fee: j.fee,
    feeNote: j.feeNote,
    nextDeparture: j.nextDeparture,
    forWhom: j.forWhom,
    whatItAsks: j.whatItAsks,
    preparation: j.preparation,
    flightGuidance: j.flightGuidance,
    accommodationPhilosophy: j.accommodationPhilosophy,
    learning: j.learning,
    educationalSessions: j.educationalSessions,
    companionship: j.companionship,
    guidance: j.guidance,
    spiritualGrowth: j.spiritualGrowth,
    reflection: j.reflection,
    reflectionJournals: j.reflectionJournals,
    healthGuidance: j.healthGuidance,
    safety: j.safety,
    organisation: j.organisation,
    itinerary: j.itinerary,
    scholars: j.scholars,
    reading: j.reading,
    packing: j.packing,
    faq: j.faq,
    gallery: j.gallery.map(g => ({ _type: "image" as const, asset: { _ref: g.id, _type: "reference" as const }, alt: g.alt, caption: g.caption })),
    policies: j.policies,
    pathways: j.pathways.map(p => ({ label: p.label, href: p.href })),
  };
}

/* ── Knowledge Library ──────────────────────────────────────────── */

export async function getAllArticles(locale: string = DEFAULT_LOCALE): Promise<Article[]> {
  const sanity = await safeFetch<Article[]>(allArticlesQuery, {}, locale);
  if (sanity?.length) return sanity;
  return [];
}

export async function getArticleBySlug(slug: string, locale: string = DEFAULT_LOCALE): Promise<Article | null> {
  const sanity = await safeFetch<Article>(articleBySlugQuery, { slug }, locale, false);
  if (sanity) return sanity;
  return null;
}

export { getAllKnowledgeSlugs, getKnowledgeTopic, knowledgeTopics };
export type { KnowledgeTopic };

/* ── Testimonials & FAQs ────────────────────────────────────────── */

export async function getTestimonials(department: string, locale: string = DEFAULT_LOCALE): Promise<Testimonial[]> {
  const sanity = await safeFetch<Testimonial[]>(testimonialsByDepartmentQuery, { department }, locale);
  return sanity ?? [];
}

export async function getFaqs(department: string, locale: string = DEFAULT_LOCALE): Promise<FaqItem[]> {
  const sanity = await safeFetch<FaqItem[]>(faqsByDepartmentQuery, { department }, locale);
  return sanity ?? [];
}

/* ── Clinical ───────────────────────────────────────────────────── */

export async function getConsultationsPage(locale: string = DEFAULT_LOCALE) {
  return safeFetch(consultationsPageQuery, {}, locale);
}

/* ── Institution ────────────────────────────────────────────────── */

export async function getCharter(locale: string = DEFAULT_LOCALE) {
  return safeFetch(charterQuery, {}, locale);
}

/* ── Department structure (for navigation components) ───────────── */

export { departments, apothecary, academy, sacredJourneys, knowledgeLibrary };
