/**
 * Adapters — convert Sanity types back to the legacy component types.
 *
 * The frontend components expect the original TypeScript types (Remedy,
 * AcademyProgramme, SacredJourney). These adapters bridge the Sanity
 * data layer to the existing component interfaces, ensuring zero visual
 * changes while the data source migrates to CMS.
 */

import type { Product, Programme, Journey } from "./types";
import type { Remedy, PropheticReference } from "@/lib/content/types";
import type { AcademyProgramme } from "@/lib/content/academy/types";
import type { SacredJourney } from "@/lib/content/journeys/types";
import {
  resolveProductImage,
  resolveProductVideoUrl,
} from "@/lib/apothecary/media";

export function productToRemedy(p: Product): Remedy {
  const image = resolveProductImage(p);
  const displayPrice =
    typeof p.salePrice === "number" && p.salePrice > 0 ? p.salePrice : p.price || 0;

  return {
    slug: p.slug?.current || p._id,
    name: p.name,
    transliteration: p.transliteration || "",
    botanicalName: p.botanicalName || "",
    nature: p.nature || "",
    institutionalSummary: p.institutionalSummary || "",
    folio: p.folio || "",
    figure: inferFigure(p.slug?.current || ""),
    figureAlt: image.alt || p.mainImage?.alt || "",
    historicalContext: p.historicalContext || [],
    propheticReferences: (p.propheticReferences || []) as PropheticReference[],
    traditionalScholarship: p.traditionalScholarship || [],
    traditionalUsage: p.traditionalUsage || [],
    evidence: {
      established: p.evidenceEstablished || [],
      emerging: p.evidenceEmerging || [],
    },
    provenance: {
      origin: p.provenanceOrigin || [],
      cultivation: p.provenanceCultivation || [],
      harvesting: p.provenanceHarvesting || [],
    },
    laboratoryVerification: p.laboratoryVerification || [],
    qualityAssurance: p.qualityAssurance || [],
    storage: p.storage || [],
    preparation: p.preparation || [],
    suggestedUse: p.suggestedUse || [],
    contraindications: p.contraindications || [],
    photographyDirection: [],
    packaging: [],
    shipping: [],
    returns: [],
    customerSupport: [],
    faq: p.faq || [],
    relatedRemedies: (p.relatedProducts || [])
      .filter(
        (r) =>
          r.visibleInApothecary !== false &&
          r.status !== "draft" &&
          r.status !== "archived" &&
          r.status !== "discontinued",
      )
      .map((r) => r.slug?.current || r._id),
    academyLessons: (p.academyLessons || []).map((l) => ({
      title: l.label,
      href: l.href,
      note: "",
    })),
    knowledgeLibrary: (p.knowledgeLibrary || []).map((l) => ({
      title: l.label,
      href: l.href,
      note: "",
    })),
    pathways: (p.pathways || []).map((pw) => ({
      label: pw.label,
      href: pw.href,
      department: "Academy" as const,
    })),
    volume: p.volume || "",
    price: displayPrice,
    salePrice: p.salePrice,
    currency: p.currency || "GBP",
    priceNote: p.priceNote || "",
    inStock: p.inStock ?? true,
    imageSrc: image.src,
    imageAlt: image.alt,
    videoUrl: resolveProductVideoUrl(p),
    featured: Boolean(p.featured),
    featuredPriority: p.featuredPriority,
  };
}

function inferFigure(slug: string): Remedy["figure"] {
  if (slug.includes("honey")) return "honey";
  if (slug.includes("black-seed") || slug.includes("nigella")) return "black-seed";
  if (slug.includes("olive")) return "olive";
  if (slug.includes("senna")) return "senna";
  return "honey";
}

export function programmeToAcademyProgramme(p: Programme): AcademyProgramme {
  return {
    slug: p.slug?.current || p._id,
    name: p.name,
    subtitle: p.subtitle || "",
    folio: p.folio || "",
    tier: p.tier,
    duration: p.duration || "",
    format: p.format || "",
    fee: p.fee || "",
    feeNote: p.feeNote || "",
    nextCohort: p.nextCohort || "",
    whatItIs: p.whatItIs || [],
    forWhom: p.forWhom || [],
    whatItAsks: p.whatItAsks || [],
    learningOutcomes: (p.learningOutcomes || []).map(lo => ({
      outcome: lo.outcome,
      assessed: lo.assessed,
    })),
    curriculum: (p.curriculum || []).map(m => ({
      number: m.number || "",
      title: m.title,
      hours: m.hours || 0,
      description: m.description || "",
      sources: m.sources || [],
      practical: m.practical,
    })),
    faculty: (p.faculty || []).map(f => ({
      name: f.name,
      title: f.title || "",
      licence: f.licence || "",
      chain: f.chain || "",
      biography: f.biography || [],
    })),
    certification: p.certification || [],
    entryRequirements: p.entryRequirements || [],
    assessment: p.assessment || [],
    clinicalPractice: p.clinicalPractice || [],
    clinicalStandards: [],
    courseHandbook: [],
    studentGuide: [],
    practicalSessions: [],
    equipmentList: [],
    graduatePathways: [],
    enrolmentJourney: [],
    faq: p.faq || [],
    testimonials: (p.testimonials || []).map(t => ({
      statement: t.statement,
      name: t.name,
      context: t.context || "",
      year: t.year || "",
    })),
    facilities: [],
    gallery: [],
    policies: [],
    pathways: [],
  };
}

export function journeyToSacredJourney(j: Journey): SacredJourney {
  return {
    slug: j.slug?.current || j._id,
    name: j.name,
    subtitle: j.subtitle || "",
    folio: j.folio || "",
    meaning: j.meaning || [],
    season: j.season || "",
    duration: j.duration || "",
    location: j.location || "",
    groupSize: j.groupSize || "",
    fee: j.fee || "",
    feeNote: j.feeNote || "",
    nextDeparture: j.nextDeparture || "",
    forWhom: j.forWhom || [],
    whatItAsks: j.whatItAsks || [],
    preparation: j.preparation || [],
    flightGuidance: j.flightGuidance || [],
    accommodationPhilosophy: j.accommodationPhilosophy || [],
    learning: j.learning || [],
    educationalSessions: (j.educationalSessions || []).map(s => ({
      title: s.title,
      format: s.format || "",
      description: s.description || "",
    })),
    companionship: j.companionship || [],
    guidance: j.guidance || [],
    spiritualGrowth: j.spiritualGrowth || [],
    reflection: j.reflection || [],
    reflectionJournals: j.reflectionJournals || [],
    healthGuidance: j.healthGuidance || [],
    safety: j.safety || [],
    organisation: j.organisation || [],
    itinerary: (j.itinerary || []).map(d => ({
      day: d.day,
      title: d.title,
      focus: d.focus || "",
      activities: d.activities || [],
    })),
    scholars: (j.scholars || []).map(s => ({
      name: s.name,
      role: s.role || "",
      grounding: s.grounding || "",
      biography: s.biography || [],
    })),
    reading: (j.reading || []).map(r => ({ title: r.title, note: r.note || "" })),
    packing: j.packing || [],
    faq: j.faq || [],
    gallery: [],
    policies: (j.policies || []).map(p => ({ title: p.title, body: p.body || [] })),
    pathways: (j.pathways || []).map(p => ({ label: p.label, href: p.href })),
  };
}
