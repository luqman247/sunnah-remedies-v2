/**
 * Data Bridge — Sanity-first with static fallback.
 *
 * Every function queries Sanity CMS. If Sanity returns null/empty
 * (content not yet published), it falls back to the existing static
 * data files. This allows progressive migration: as editors publish
 * content in Sanity, it takes precedence over the static files.
 */

import { client } from "./client";
import {
  homepageQuery,
  navigationQuery,
  footerQuery,
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

// Static fallback imports
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

async function safeFetch<T>(query: string, params?: Record<string, string>): Promise<T | null> {
  try {
    const result = params
      ? await client.fetch<T>(query, params)
      : await client.fetch<T>(query);
    return result;
  } catch {
    return null;
  }
}

/* ── Navigation ─────────────────────────────────────────────────── */

export interface NavigationData {
  items: { label: string; href: string; highlighted?: boolean; hidden?: boolean }[];
  announcement?: { active: boolean; message?: string; link?: string; linkLabel?: string };
}

export async function getNavigation(): Promise<NavigationData> {
  const sanity = await safeFetch<Navigation>(navigationQuery);
  if (sanity?.mainNavigation?.length) {
    return {
      items: sanity.mainNavigation.filter(i => !i.hidden),
      announcement: sanity.announcementBar,
    };
  }
  return {
    items: [
      ...departments.map(d => ({ label: d.label, href: d.href })),
      { label: "Clinical consultations", href: "/consultations", highlighted: true },
    ],
  };
}

/* ── Footer ─────────────────────────────────────────────────────── */

export interface FooterData {
  preFooterStatement: string;
  preFooterAction: { label: string; href: string };
  columns: { title: string; links: { label: string; href: string }[] }[];
  closingStatement: string;
  colophon: string;
}

export async function getFooter(): Promise<FooterData> {
  const sanity = await safeFetch<FooterSettings>(footerQuery);
  if (sanity?.columns?.length) {
    return {
      preFooterStatement: sanity.preFooterStatement || "Begin where you are. Whether you seek a remedy, wish to study, or are preparing for pilgrimage — the institution is open.",
      preFooterAction: sanity.preFooterAction || { label: "Request a consultation", href: "/consultations" },
      columns: sanity.columns,
      closingStatement: sanity.closingStatement || "Knowledge before commerce. Service before profit. Trust before growth.",
      colophon: sanity.colophon || "Sunnah Remedies · Est. MMXXV · Healing is from Allah · the remedy is a means",
    };
  }
  return {
    preFooterStatement: "Begin where you are. Whether you seek a remedy, wish to study, or are preparing for pilgrimage — the institution is open.",
    preFooterAction: { label: "Request a consultation", href: "/consultations" },
    columns: [
      { title: "The Pillars", links: [{ label: "The Apothecary", href: "/the-apothecary" }, { label: "The Academy", href: "/the-academy" }, { label: "Sacred Journeys", href: "/sacred-journeys" }, { label: "Knowledge Library", href: "/knowledge-library" }] },
      { title: "Institution", links: [{ label: "Founding Charter", href: "/charter" }, { label: "Quality Standards", href: "/the-apothecary/quality-standards" }, { label: "Consultations", href: "/consultations" }, { label: "The Register", href: "/the-register" }] },
      { title: "Connect", links: [{ label: "Correspondence", href: "/correspondence" }, { label: "Academy Enrolment", href: "/the-academy/enrolment" }, { label: "Journey Registration", href: "/sacred-journeys/registration" }] },
      { title: "Legal", links: [{ label: "Privacy", href: "/charter" }, { label: "Terms", href: "/charter" }, { label: "Accessibility", href: "/charter" }] },
    ],
    closingStatement: "Knowledge before commerce. Service before profit. Trust before growth.",
    colophon: "Sunnah Remedies · Est. MMXXV · Healing is from Allah · the remedy is a means",
  };
}

/* ── Homepage ───────────────────────────────────────────────────── */

export async function getHomepage(): Promise<HomepageData | null> {
  return safeFetch<HomepageData>(homepageQuery);
}

/* ── Global SEO ─────────────────────────────────────────────────── */

export async function getGlobalSeo() {
  return safeFetch(globalSeoQuery);
}

/* ── Apothecary ─────────────────────────────────────────────────── */

export async function getAllProducts(): Promise<Product[]> {
  const sanity = await safeFetch<Product[]>(allProductsQuery);
  if (sanity?.length) return sanity;
  return remedies.map(r => remedyToProduct(r));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const sanity = await safeFetch<Product>(productBySlugQuery, { slug });
  if (sanity) return sanity;
  const staticRemedy = getStaticRemedy(slug);
  return staticRemedy ? remedyToProduct(staticRemedy) : null;
}

export async function getProductSlugs(): Promise<string[]> {
  const sanity = await safeFetch<{ slug: { current: string } }[]>(
    `*[_type == "product" && !(_id in path("drafts.**"))]{ slug }`
  );
  if (sanity?.length) return sanity.map(p => p.slug.current);
  return getAllRemedySlugs();
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

export async function getAllProgrammes(): Promise<Programme[]> {
  const sanity = await safeFetch<Programme[]>(allProgrammesQuery);
  if (sanity?.length) return sanity;
  return staticProgrammes.map(p => programmeToSanity(p));
}

export async function getProgrammeBySlug(slug: string): Promise<Programme | null> {
  const sanity = await safeFetch<Programme>(programmeBySlugQuery, { slug });
  if (sanity) return sanity;
  if (slug === "hijama-diploma" || slug === "hijama") {
    return programmeToSanity(getHijamaDiploma());
  }
  return null;
}

export async function getProgrammeSlugs(): Promise<string[]> {
  const sanity = await safeFetch<{ slug: { current: string } }[]>(
    `*[_type == "programme" && !(_id in path("drafts.**"))]{ slug }`
  );
  if (sanity?.length) return sanity.map(p => p.slug.current);
  return getAllProgrammeSlugs();
}

export async function getAllFaculty(): Promise<Faculty[]> {
  const sanity = await safeFetch<Faculty[]>(allFacultyQuery);
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

export async function getAllJourneys(): Promise<Journey[]> {
  const sanity = await safeFetch<Journey[]>(allJourneysQuery);
  if (sanity?.length) return sanity;
  return staticJourneys.map(j => journeyToSanity(j));
}

export async function getJourneyBySlug(slug: string): Promise<Journey | null> {
  const sanity = await safeFetch<Journey>(journeyBySlugQuery, { slug });
  if (sanity) return sanity;
  const staticJ = getStaticJourney(slug);
  return staticJ ? journeyToSanity(staticJ) : null;
}

export async function getJourneySlugs(): Promise<string[]> {
  const sanity = await safeFetch<{ slug: { current: string } }[]>(
    `*[_type == "journey" && !(_id in path("drafts.**"))]{ slug }`
  );
  if (sanity?.length) return sanity.map(j => j.slug.current);
  return getAllJourneySlugs();
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

export async function getAllArticles(): Promise<Article[]> {
  const sanity = await safeFetch<Article[]>(allArticlesQuery);
  if (sanity?.length) return sanity;
  return [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const sanity = await safeFetch<Article>(articleBySlugQuery, { slug });
  if (sanity) return sanity;
  return null;
}

export { getAllKnowledgeSlugs, getKnowledgeTopic, knowledgeTopics };
export type { KnowledgeTopic };

/* ── Testimonials & FAQs ────────────────────────────────────────── */

export async function getTestimonials(department: string): Promise<Testimonial[]> {
  const sanity = await safeFetch<Testimonial[]>(testimonialsByDepartmentQuery, { department });
  return sanity ?? [];
}

export async function getFaqs(department: string): Promise<FaqItem[]> {
  const sanity = await safeFetch<FaqItem[]>(faqsByDepartmentQuery, { department });
  return sanity ?? [];
}

/* ── Clinical ───────────────────────────────────────────────────── */

export async function getConsultationsPage() {
  return safeFetch(consultationsPageQuery);
}

/* ── Institution ────────────────────────────────────────────────── */

export async function getCharter() {
  return safeFetch(charterQuery);
}

/* ── Department structure (for navigation components) ───────────── */

export { departments, apothecary, academy, sacredJourneys, knowledgeLibrary };
