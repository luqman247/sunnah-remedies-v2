import type { AcademyProgramme } from "./types";
import { hijamaDiploma } from "./hijama-diploma";

export const hijamaProgramme: AcademyProgramme = hijamaDiploma;

export const programmes: AcademyProgramme[] = [hijamaDiploma];

export function getHijamaDiploma(): AcademyProgramme {
  return hijamaDiploma;
}

export const academyCatalogue = [
  {
    slug: "foundations",
    name: "Foundations of Prophetic Medicine",
    tier: "Essential" as const,
    fee: "Free · provided as a community right",
    href: "/the-academy/foundations",
    description: "Terms, grades, and method for an essential introduction to Tibb al-Nabawī.",
  },
  {
    slug: "hijama",
    name: "The Hijāma Programme",
    tier: "Professional" as const,
    fee: "£2,400 · twelve weeks",
    href: "/the-academy/hijama-diploma",
    description: "Professional training in Prophetic cupping, taught with clinical supervision and clear sourcing.",
  },
  {
    slug: "materia-medica",
    name: "The Materia Medica",
    tier: "Advanced" as const,
    fee: "£480 · eight weeks",
    href: "/the-academy/materia-medica",
    description: "Study of remedies in the tradition, with grading and source tracing.",
  },
  {
    slug: "clinical-ethics",
    name: "Clinical Practice & Ethics",
    tier: "Licensed" as const,
    fee: "By application",
    href: "/the-academy/clinical-ethics",
    description: "Responsibilities of practice, including limits, consent, and clinical adab.",
  },
];

export function getProgrammeBySlug(slug: string): AcademyProgramme | undefined {
  return programmes.find((p) => p.slug === slug);
}

export function getAllProgrammeSlugs(): string[] {
  return programmes.map((p) => p.slug);
}
