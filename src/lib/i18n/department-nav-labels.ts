/**
 * Department secondary-nav label resolution from message catalogs.
 * site-structure.ts remains the structural source of hrefs/order only.
 *
 * Intentionally retained (not auto-translated):
 * - Hijāma / Hijāma Diploma (transliteration)
 * - Umrah (rite name)
 * - Duʿa & Dhikr (collection name)
 */

export type DepartmentSectionMessageRef = {
  namespace:
    | "apothecary"
    | "academy"
    | "journeys"
    | "duaDhikr"
    | "feeling"
    | "institutionNav"
    | "nav"
    | "consultations";
  /** Dot path within the namespace (e.g. programmeView.curriculum). */
  key: string;
};

export const DEPARTMENT_SECTION_MESSAGE_KEYS: Record<
  string,
  DepartmentSectionMessageRef
> = {
  /* Apothecary */
  "/the-apothecary/catalogue": { namespace: "apothecary", key: "catalogue" },
  "/the-apothecary/monographs": { namespace: "apothecary", key: "monographs" },
  "/the-apothecary/ingredients": { namespace: "apothecary", key: "ingredients" },
  "/the-apothecary/quality-standards": { namespace: "apothecary", key: "qualityStandards" },
  "/the-apothecary/laboratory-verification": {
    namespace: "apothecary",
    key: "laboratoryVerification",
  },
  "/the-apothecary/faqs": { namespace: "apothecary", key: "faqs" },

  /* Academy — Hijāma retained in transliteration */
  "/the-academy/hijama-diploma": { namespace: "academy", key: "hijamaDiploma" },
  "/the-academy/curriculum": { namespace: "academy", key: "curriculum" },
  "/the-academy/learning-outcomes": { namespace: "academy", key: "learningOutcomes" },
  "/the-academy/practical-sessions": {
    namespace: "academy",
    key: "programmeView.practicalLabel",
  },
  "/the-academy/course-handbook": {
    namespace: "academy",
    key: "programmeView.courseHandbook",
  },
  "/the-academy/student-guide": {
    namespace: "academy",
    key: "programmeView.studentGuide",
  },
  "/the-academy/faculty": { namespace: "academy", key: "faculty" },
  "/the-academy/facilities": { namespace: "academy", key: "programmeView.facilities" },
  "/the-academy/clinical-standards": {
    namespace: "academy",
    key: "programmeView.clinicalStandards",
  },
  "/the-academy/assessment": { namespace: "academy", key: "programmeView.assessment" },
  "/the-academy/certification": {
    namespace: "academy",
    key: "programmeView.certification",
  },
  "/the-academy/entry-requirements": {
    namespace: "academy",
    key: "programmeView.entryRequirements",
  },
  "/the-academy/equipment": {
    namespace: "academy",
    key: "programmeView.equipmentLabel",
  },
  "/the-academy/graduate-pathways": {
    namespace: "academy",
    key: "programmeView.graduatePathways",
  },
  "/the-academy/testimonials": {
    namespace: "academy",
    key: "programmeView.graduateAttestations",
  },
  "/the-academy/gallery": { namespace: "academy", key: "programmeView.gallery" },
  "/the-academy/policies": { namespace: "academy", key: "programmeView.policies" },
  "/the-academy/faqs": { namespace: "academy", key: "questions" },
  "/the-academy/enrolment": { namespace: "academy", key: "enrolment" },

  /* Sacred Journeys — Umrah retained */
  "/sacred-journeys/umrah": { namespace: "journeys", key: "umrah" },
  "/sacred-journeys/itineraries": { namespace: "journeys", key: "itineraries" },
  "/sacred-journeys/preparation": { namespace: "journeys", key: "preparation" },
  "/sacred-journeys/reading": { namespace: "journeys", key: "reading" },
  "/sacred-journeys/packing": { namespace: "journeys", key: "packing" },
  "/sacred-journeys/flight-guidance": { namespace: "journeys", key: "flightGuidance" },
  "/sacred-journeys/accommodation": { namespace: "journeys", key: "accommodation" },
  "/sacred-journeys/educational-sessions": {
    namespace: "journeys",
    key: "educationalSessions",
  },
  "/sacred-journeys/reflection-journals": {
    namespace: "journeys",
    key: "reflectionJournals",
  },
  "/sacred-journeys/companionship": { namespace: "journeys", key: "companionship" },
  "/sacred-journeys/health-guidance": { namespace: "journeys", key: "healthGuidance" },
  "/sacred-journeys/gallery": { namespace: "journeys", key: "gallery" },
  "/sacred-journeys/registration": { namespace: "journeys", key: "registration" },
  "/sacred-journeys/policies": { namespace: "journeys", key: "policies" },
  "/sacred-journeys/faqs": { namespace: "journeys", key: "faqs" },

  /* Knowledge Library — Duʿa & Dhikr retained */
  "/knowledge-library/dua-dhikr": { namespace: "duaDhikr", key: "breadcrumb" },
  /* "I am feeling…" — top-level route, conceptually Knowledge Library (docs/i-am-feeling/SPEC.md §2) */
  "/i-am-feeling": { namespace: "feeling", key: "breadcrumb" },

  /* Institution */
  "/": { namespace: "institutionNav", key: "threshold" },
  "/institute": { namespace: "institutionNav", key: "theInstitute" },
  "/charter": { namespace: "institutionNav", key: "foundingCharter" },
  "/calendar": { namespace: "institutionNav", key: "institutionalYear" },
  "/consultations": { namespace: "institutionNav", key: "consultations" },
  "/correspondence": { namespace: "institutionNav", key: "correspondence" },
  "/the-register": { namespace: "institutionNav", key: "theRegister" },
};

/** Resolve a path (with or without trailing segments) to a section label key. */
export function getSectionMessageRef(
  href: string,
): DepartmentSectionMessageRef | undefined {
  if (DEPARTMENT_SECTION_MESSAGE_KEYS[href]) {
    return DEPARTMENT_SECTION_MESSAGE_KEYS[href];
  }
  return undefined;
}
