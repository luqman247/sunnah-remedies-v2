import type { AcademyProgramme } from "./types";
import { hijamaProgramme } from "./hijama";

export const programmes: AcademyProgramme[] = [hijamaProgramme];

export const academyCatalogue = [
  {
    slug: "foundations",
    name: "Foundations of Prophetic Medicine",
    tier: "Essential" as const,
    fee: "Free · a right of the community",
    href: "/the-academy/foundations",
    description: "Terms, grades, and method — the essential introduction to Tibb al-Nabawī.",
  },
  {
    slug: "hijama",
    name: "The Hijāma Programme",
    tier: "Professional" as const,
    fee: "£2,400 · twelve weeks",
    href: "/the-academy/hijama",
    description: "Professional training in Prophetic cupping — clinical, sourced, and supervised.",
  },
  {
    slug: "materia-medica",
    name: "The Materia Medica",
    tier: "Advanced" as const,
    fee: "£480 · eight weeks",
    href: "/the-academy/materia-medica",
    description: "The remedies of the tradition, graded and traced to their sources.",
  },
  {
    slug: "clinical-ethics",
    name: "Clinical Practice & Ethics",
    tier: "Licensed" as const,
    fee: "By application",
    href: "/the-academy/clinical-ethics",
    description: "The responsibilities of the practitioner — limits, consent, and clinical adab.",
  },
];

export function getProgrammeBySlug(slug: string): AcademyProgramme | undefined {
  return programmes.find((p) => p.slug === slug);
}

export function getAllProgrammeSlugs(): string[] {
  return programmes.map((p) => p.slug);
}
