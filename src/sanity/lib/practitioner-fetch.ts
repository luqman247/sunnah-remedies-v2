/**
 * Phase 9 — Practitioner Portal Content Fetch
 */

import { safeFetch } from "./fetch";
import {
  clinicalProtocolsQuery,
  clinicalProtocolBySlugQuery,
  practitionerResourcesQuery,
  researchPublicationsQuery,
  practitionerAnnouncementsQuery,
} from "./queries";
import type {
  ClinicalProtocolSummary,
  ClinicalProtocolDetail,
  PractitionerResource,
  ResearchPublication,
  PractitionerAnnouncement,
} from "./practitioner-types";
import { getHijamaDiploma } from "@/lib/content/academy";

const STATIC_PROTOCOLS: ClinicalProtocolSummary[] = [
  {
    _id: "static-contraindications",
    title: "Contraindications and cautions",
    slug: "contraindications",
    version: "1.0",
    category: "contraindications",
    summary: "Institutional protocol aligned with Hijāma Diploma clinical standards",
    reviewedByName: "Faculty Clinical Board",
  },
  {
    _id: "static-infection-control",
    title: "Infection control and sterile technique",
    slug: "infection-control",
    version: "1.0",
    category: "infection-control",
    summary: "Single-use equipment, surface decontamination, and waste handling",
    reviewedByName: "Faculty Clinical Board",
  },
  {
    _id: "static-patient-assessment",
    title: "Patient assessment before treatment",
    slug: "patient-assessment",
    version: "1.0",
    category: "patient-assessment",
    summary: "History, consent, and scope-of-practice limits",
    reviewedByName: "Faculty Clinical Board",
  },
];

export async function getClinicalProtocols(
  locale: string
): Promise<ClinicalProtocolSummary[]> {
  const results = await safeFetch<ClinicalProtocolSummary[]>(
    clinicalProtocolsQuery,
    {},
    locale
  );
  return results?.length ? results : STATIC_PROTOCOLS;
}

export async function getClinicalProtocolBySlug(
  slug: string,
  locale: string
): Promise<ClinicalProtocolDetail | null> {
  const result = await safeFetch<ClinicalProtocolDetail>(
    clinicalProtocolBySlugQuery,
    { slug },
    locale
  );

  if (result) return result;

  const diploma = getHijamaDiploma();
  const block = diploma.clinicalStandards.find((b) => {
    const title = b.title.toLowerCase();
    if (slug === "contraindications") return title.includes("contraindication");
    if (slug === "infection-control") return title.includes("infection");
    if (slug === "patient-assessment") return title.includes("assessment");
    return title.includes(slug.replace(/-/g, " "));
  });

  if (!block) return null;

  return {
    _id: `static-${slug}`,
    title: block.title,
    slug,
    version: "1.0",
    summary: block.body[0],
    body: block.body.map((p) => ({
      _type: "block",
      children: [{ _type: "span", text: p }],
    })),
    reviewedByName: "Faculty Clinical Board",
  };
}

export async function getPractitionerResources(
  locale: string
): Promise<PractitionerResource[]> {
  return (
    (await safeFetch<PractitionerResource[]>(
      practitionerResourcesQuery,
      {},
      locale
    )) ?? []
  );
}

export async function getResearchPublications(
  locale: string
): Promise<ResearchPublication[]> {
  return (
    (await safeFetch<ResearchPublication[]>(
      researchPublicationsQuery,
      {},
      locale
    )) ?? []
  );
}

export async function getPractitionerAnnouncements(): Promise<
  PractitionerAnnouncement[]
> {
  return (
    (await safeFetch<PractitionerAnnouncement[]>(
      practitionerAnnouncementsQuery,
      {},
      "en"
    )) ?? []
  );
}
