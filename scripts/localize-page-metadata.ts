#!/usr/bin/env npx tsx
/**
 * Merges pages.* metadata into en.json/da.json and patches static metadata exports.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const enPages = JSON.parse(
  fs.readFileSync(path.join(ROOT, "scripts/pages-metadata-en.json"), "utf8"),
) as Record<string, { title: string; description?: string }>;

// Danish page metadata — professional institutional register
const daPages: Record<string, { title: string; description?: string }> = {
  home: {
    title: "Sunnah Remedies — Institut for Profetisk Medicin",
    description:
      "Verdens førende institut for Profetisk Medicin — forskning, klinisk behandling og naturlig terapi under ét tag",
  },
  calendar: {
    title: "Det institutionelle år",
    description:
      "Instituttets årlige rytme — ceremonier, sæsoner, sammenkomster og havens gang",
  },
  charter: {
    title: "Grundlæggelsescharteren",
    description:
      "Institutionens forfatningstekst — syv artikler der regulerer Sunnah Remedies' virke",
  },
  consultations: {
    title: "Book en Hijama-session",
    description:
      "Book din Hijama-aftale (våd kopning) med en kvalificeret behandler på en af vores klinikker i London, Aarhus eller Riyadh",
  },
  correspondence: { title: "Korrespondance" },
  exhibitions: {
    title: "Udstillinger",
    description:
      "Det digitale museum — udstillinger om Profetisk Medicin og den store islamiske helbredelsestradition, præsenteret med faglig omhu og ærbødighed",
  },
  institute: {
    title: "Instituttet",
    description:
      "Sunnah Remedies Institut — et moderne bimāristān for bevarelse, studium, praksis, undervisning og ærlig afprøvning af Profetisk Medicin",
  },
  knowledgeLibrary: {
    title: "Vidensbiblioteket · Sunnah Remedies",
    description:
      "Institutionens udgivelsesprogram — monografier, forskningsnoter og patientvejledninger om Profetisk Medicin, udgivet med citation, gradering og klare grænser",
  },
  "membership.accessDenied": { title: "Adgang ikke givet" },
  "membership.signIn": { title: "Medlemslogin" },
  "portal.practitioner": {
    title: "Behandlerportal",
    description: "Kliniske protokoller, efteruddannelse, credentials og praksisressourcer",
  },
  "portal.practitioner.certificates": {
    title: "Certifikater",
    description: "Kursus- og begivenhedscredentials",
  },
  "portal.practitioner.credentials": {
    title: "Digitale credentials",
    description: "Verificerbare badges og behandlerverifikationsstatus",
  },
  "portal.practitioner.cpd": {
    title: "Efteruddannelseslog",
    description: "Registrering af løbende faglig udvikling",
  },
  "portal.practitioner.downloads": {
    title: "Downloads",
    description: "Skabeloner, patientressourcer og behandlingsvejledninger",
  },
  "portal.practitioner.layout": { title: "Behandlerportal" },
  "portal.practitioner.profile": {
    title: "Professionel profil",
    description: "Praksisomfang og registreringsoplysninger",
  },
  "portal.practitioner.protocols": {
    title: "Kliniske protokoller",
    description: "Fakultetsgennemgåede kliniske protokoller for verificerede behandlere",
  },
  "portal.practitioner.research": {
    title: "Forskningsbibliotek",
    description: "Publikationer og institutionelle forskningsbriefinger",
  },
  "portal.practitioner.saved": {
    title: "Gemte ressourcer",
    description: "Private bogmærker i behandlerportalen",
  },
  "portal.practitioner.updates": {
    title: "Praksisopdateringer",
    description: "Kliniske meddelelser og fakultetsnoter til behandlere",
  },
  "portal.student": {
    title: "Digitalt campus",
    description: "Dit faglige arbejdsrum under studiet",
  },
  "portal.student.assignments": { title: "Opgaver" },
  "portal.student.calendar": { title: "Kalender" },
  "portal.student.certificates": { title: "Certifikater" },
  "portal.student.courses": { title: "Mine kurser" },
  "portal.student.layout": { title: "Digitalt campus" },
  "portal.student.revision": { title: "Repetition" },
  "portal.student.saved": { title: "Gemte ressourcer" },
  "portal.student.tutor": { title: "AI-vejleder" },
  press: {
    title: "Forlaget",
    description:
      "Instituttets forlag — faglige udgaver, patientvejledninger og fine artefakter, udgivet langsomt og varigt frem for hurtigt og engangs",
  },
  research: {
    title: "Forskningscenter",
    description:
      "Instituttets bro til moderne medicin — afprøvning af Profetisk Medicin ærligt mod den bedste tilgængelige evidens, hverken smigrende eller forræderisk",
  },
  sacredJourneys: {
    title: "Hellige Rejser",
    description:
      "Uddannelsespilgrimsrejse med forberedelse, læsning, fakultetsledsagelse og klar vejledning. Vi rejser for at lære, ikke for at se",
  },
  "sacredJourneys.accommodation": {
    title: "Indkvartering",
    description: "Logi valgt for nærhed, sikkerhed og praktisk egnethed",
  },
  "sacredJourneys.companionship": {
    title: "Ledsagelse",
    description: "Gruppestørrelse, adab og disciplineret rejse i fællesskab",
  },
  "sacredJourneys.educationalSessions": {
    title: "Uddannelsessessioner",
    description: "Seminarer, feltstudier og kredse leveret efter en offentliggjort struktur",
  },
  "sacredJourneys.faqs": {
    title: "Ofte stillede spørgsmål",
    description: "Registrering, sikkerhed, udsættelse og institutionelle grænser",
  },
  "sacredJourneys.flightGuidance": {
    title: "Flyvejledning",
    description: "Flykoordinationsvejledning for programankomster og afgange",
  },
  "sacredJourneys.gallery": {
    title: "Galleri",
    description: "Fotografi af steder, stier og arkitektur mødt på programmet",
  },
  "sacredJourneys.healthGuidance": {
    title: "Sundhedsvejledning",
    description: "Oplysning, fitness, miljøeksponering og kriterier for udsættelse af rejse",
  },
  "sacredJourneys.itineraries": {
    title: "Rejseplaner",
    description: "Dag-for-dag uddannelsesplaner offentliggjort før afrejse",
  },
  "sacredJourneys.packing": {
    title: "Pakkevejledning",
    description: "Programpakkevejledning der dækker klima, adab og institutionelle forsyninger",
  },
  "sacredJourneys.policies": {
    title: "Politikker",
    description: "Afbestilling, adfærd og forsikringsstandarder angivet tydeligt",
  },
  "sacredJourneys.preparation": {
    title: "Forberedelse",
    description: "Læsning, sundhedsforberedelse, dokumenter og tidslinje før rejse",
  },
  "sacredJourneys.reading": {
    title: "Læseliste",
    description: "Tildelte tekster der skal gennemføres før afrejse",
  },
  "sacredJourneys.reflectionJournals": {
    title: "Refleksionsjournaler",
    description: "Tildelte refleksionsprompts knyttet til seminarer og læsning",
  },
  "sacredJourneys.registration": {
    title: "Registrering",
    description: "Tilmeld din interesse. Placering følger samtale og læsegennemgang",
  },
  "sacredJourneys.umrah": {
    title: "Umrah",
    description:
      "Uddannelsespilgrimsrejse hvor ritualer undervises gennem kildebaserede seminarer og vejledt forberedelse",
  },
  theAcademy: {
    title: "Akademiet",
    description:
      "Klinisk uddannelse i Profetisk Medicin og Hijama-diplomet — med citation, supervision og uafhængig vurdering",
  },
  "theAcademy.assessment": {
    title: "Vurdering",
    description: "Skriftlige opgaver, klinisk logbog og OSCE-vurdering",
  },
  "theAcademy.certification": {
    title: "Certificering",
    description: "Certificeringens omfang og angivne grænser",
  },
  "theAcademy.clinicalEthics": { title: "Klinisk praksis og etik" },
  "theAcademy.clinicalStandards": {
    title: "Kliniske standarder",
    description: "Kontraindikationer, teknikstandarder og infektionskontrol",
  },
  "theAcademy.courseHandbook": {
    title: "Kurshåndbog",
    description: "Semesterdatoer, fremmødekrav, adfærd og gebyrer",
  },
  "theAcademy.curriculum": {
    title: "Pensum",
    description: "Pensummoduler med kilder og praktiske komponenter",
  },
  "theAcademy.enrolment": {
    title: "Indskrivning",
    description: "Ansøgningsforløb og formular til Hijāma-diplomet",
  },
  "theAcademy.entryRequirements": {
    title: "Optagelseskrav",
    description: "Optagelseskvalifikationer, sikkerhedstjek og samtaleproces",
  },
  "theAcademy.equipment": {
    title: "Udstyrsliste",
    description: "Udstyrsansvar for studerende og akademiets forsyning",
  },
  "theAcademy.facilities": {
    title: "Faciliteter",
    description: "Klinisk lokale, læsesal og seminarundervisningsrum",
  },
  "theAcademy.faculty": {
    title: "Fakultet",
    description: "Navngivet fakultet, undervisningslinje og akademisk ansvarlighed",
  },
  "theAcademy.faqs": {
    title: "Spørgsmål",
    description: "Spørgsmål om anerkendelse, sikkerhed, fremmøde og gebyrer",
  },
  "theAcademy.foundations": { title: "Grundlaget for Profetisk Medicin" },
  "theAcademy.gallery": {
    title: "Galleri",
    description: "Fotografi af undervisnings-, kliniske og faglige rum",
  },
  "theAcademy.graduatePathways": {
    title: "Kandidatforløb",
    description: "Forløb efter certificering beskrevet uden karrieregarantier",
  },
  "theAcademy.learningOutcomes": {
    title: "Læringsmål",
    description: "Vurderede kompetencer for Hijāma-diplomet",
  },
  "theAcademy.materiaMedica": { title: "Materia Medica" },
  "theAcademy.policies": {
    title: "Politikker",
    description: "Afbestillings-, adfærds- og klinisk ansvarspolitikker",
  },
  "theAcademy.practicalSessions": {
    title: "Praktiske sessioner",
    description: "Superviseret klinisk tidsplan for Hijāma-diplomet",
  },
  "theAcademy.studentGuide": {
    title: "Studentervejledning",
    description: "Vejledning fra indskrivning til certificering",
  },
  "theAcademy.testimonials": {
    title: "Kandidatattestationer",
    description: "Kandidatattestationer offentliggjort med samtykke",
  },
  theApothecary: {
    title: "Apoteket",
    description:
      "En udlevering hvor hvert middel bærer en monografi: historisk kontekst, profetisk reference, traditionel brug, angivne grænser og oprindelse",
  },
  "theApothecary.catalogue": {
    title: "Produktkatalog",
    description: "Det ordnede skab med midler sporet til kilde",
  },
  "theApothecary.counter": { title: "Disken" },
  "theApothecary.faqs": {
    title: "Ofte stillede spørgsmål",
    description: "Spørgsmål om udlevering, oprindelse og angivne grænser",
  },
  "theApothecary.ingredients": {
    title: "Ingrediensbibliotek",
    description: "Simple midler og præparater med botanisk identitet og traditionel status",
  },
  "theApothecary.laboratoryVerification": {
    title: "Laboratoriebekræftelse",
    description: "Uafhængig analyse med batchregistreringer og certifikater",
  },
  "theApothecary.monographs": {
    title: "Produktmonografier",
    description: "Faglige middelregistreringer med kilde før pris og grænser før mål",
  },
  "theApothecary.orderConfirmation": { title: "Ordre bekræftet — Sunnah Remedies" },
  "theApothecary.qualityStandards": {
    title: "Kvalitetsstandarder",
    description: "Hvordan institutionen vælger, opbevarer og udleverer midler",
  },
  theRegister: {
    title: "Registeret",
    description: "Tekster, midler og kilder indekseret efter grad og afdeling",
  },
  search: {
    title: "Søg",
    description:
      "Find midler, tilstande, forskning, kurser, hadith og faglige artikler på tværs af hele institutionen",
  },
};

function setNested(obj: Record<string, unknown>, keyPath: string, value: unknown) {
  const parts = keyPath.split(".");
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]] || typeof cur[parts[i]] !== "object") {
      cur[parts[i]] = {};
    }
    cur = cur[parts[i]] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
}

function mergePages(locale: "en" | "da", pages: Record<string, { title: string; description?: string }>) {
  const file = path.join(ROOT, "src/messages", `${locale}.json`);
  const messages = JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, unknown>;
  const nested: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(pages)) {
    setNested(nested, key, val);
  }
  messages.pages = nested;
  fs.writeFileSync(file, JSON.stringify(messages, null, 2) + "\n");
}

/** Map file path → { pageKey, routePath } */
const FILE_MAP: Record<string, { key: string; path: string }> = {
  "src/app/[locale]/page.tsx": { key: "home", path: "/" },
  "src/app/[locale]/calendar/page.tsx": { key: "calendar", path: "/calendar" },
  "src/app/[locale]/charter/page.tsx": { key: "charter", path: "/charter" },
  "src/app/[locale]/consultations/layout.tsx": { key: "consultations", path: "/consultations" },
  "src/app/[locale]/correspondence/page.tsx": { key: "correspondence", path: "/correspondence" },
  "src/app/[locale]/exhibitions/page.tsx": { key: "exhibitions", path: "/exhibitions" },
  "src/app/[locale]/institute/page.tsx": { key: "institute", path: "/institute" },
  "src/app/[locale]/knowledge-library/page.tsx": { key: "knowledgeLibrary", path: "/knowledge-library" },
  "src/app/[locale]/membership/access-denied/page.tsx": { key: "membership.accessDenied", path: "/membership/access-denied" },
  "src/app/[locale]/membership/sign-in/page.tsx": { key: "membership.signIn", path: "/membership/sign-in" },
  "src/app/[locale]/portal/practitioner/page.tsx": { key: "portal.practitioner", path: "/portal/practitioner" },
  "src/app/[locale]/portal/practitioner/certificates/page.tsx": { key: "portal.practitioner.certificates", path: "/portal/practitioner/certificates" },
  "src/app/[locale]/portal/practitioner/credentials/page.tsx": { key: "portal.practitioner.credentials", path: "/portal/practitioner/credentials" },
  "src/app/[locale]/portal/practitioner/cpd/page.tsx": { key: "portal.practitioner.cpd", path: "/portal/practitioner/cpd" },
  "src/app/[locale]/portal/practitioner/downloads/page.tsx": { key: "portal.practitioner.downloads", path: "/portal/practitioner/downloads" },
  "src/app/[locale]/portal/practitioner/layout.tsx": { key: "portal.practitioner.layout", path: "/portal/practitioner" },
  "src/app/[locale]/portal/practitioner/profile/page.tsx": { key: "portal.practitioner.profile", path: "/portal/practitioner/profile" },
  "src/app/[locale]/portal/practitioner/protocols/page.tsx": { key: "portal.practitioner.protocols", path: "/portal/practitioner/protocols" },
  "src/app/[locale]/portal/practitioner/research/page.tsx": { key: "portal.practitioner.research", path: "/portal/practitioner/research" },
  "src/app/[locale]/portal/practitioner/saved/page.tsx": { key: "portal.practitioner.saved", path: "/portal/practitioner/saved" },
  "src/app/[locale]/portal/practitioner/updates/page.tsx": { key: "portal.practitioner.updates", path: "/portal/practitioner/updates" },
  "src/app/[locale]/portal/student/page.tsx": { key: "portal.student", path: "/portal/student" },
  "src/app/[locale]/portal/student/assignments/page.tsx": { key: "portal.student.assignments", path: "/portal/student/assignments" },
  "src/app/[locale]/portal/student/calendar/page.tsx": { key: "portal.student.calendar", path: "/portal/student/calendar" },
  "src/app/[locale]/portal/student/certificates/page.tsx": { key: "portal.student.certificates", path: "/portal/student/certificates" },
  "src/app/[locale]/portal/student/courses/page.tsx": { key: "portal.student.courses", path: "/portal/student/courses" },
  "src/app/[locale]/portal/student/layout.tsx": { key: "portal.student.layout", path: "/portal/student" },
  "src/app/[locale]/portal/student/revision/page.tsx": { key: "portal.student.revision", path: "/portal/student/revision" },
  "src/app/[locale]/portal/student/saved/page.tsx": { key: "portal.student.saved", path: "/portal/student/saved" },
  "src/app/[locale]/portal/student/tutor/page.tsx": { key: "portal.student.tutor", path: "/portal/student/tutor" },
  "src/app/[locale]/press/page.tsx": { key: "press", path: "/press" },
  "src/app/[locale]/research/page.tsx": { key: "research", path: "/research" },
  "src/app/[locale]/sacred-journeys/page.tsx": { key: "sacredJourneys", path: "/sacred-journeys" },
  "src/app/[locale]/sacred-journeys/accommodation/page.tsx": { key: "sacredJourneys.accommodation", path: "/sacred-journeys/accommodation" },
  "src/app/[locale]/sacred-journeys/companionship/page.tsx": { key: "sacredJourneys.companionship", path: "/sacred-journeys/companionship" },
  "src/app/[locale]/sacred-journeys/educational-sessions/page.tsx": { key: "sacredJourneys.educationalSessions", path: "/sacred-journeys/educational-sessions" },
  "src/app/[locale]/sacred-journeys/faqs/page.tsx": { key: "sacredJourneys.faqs", path: "/sacred-journeys/faqs" },
  "src/app/[locale]/sacred-journeys/flight-guidance/page.tsx": { key: "sacredJourneys.flightGuidance", path: "/sacred-journeys/flight-guidance" },
  "src/app/[locale]/sacred-journeys/gallery/page.tsx": { key: "sacredJourneys.gallery", path: "/sacred-journeys/gallery" },
  "src/app/[locale]/sacred-journeys/health-guidance/page.tsx": { key: "sacredJourneys.healthGuidance", path: "/sacred-journeys/health-guidance" },
  "src/app/[locale]/sacred-journeys/itineraries/page.tsx": { key: "sacredJourneys.itineraries", path: "/sacred-journeys/itineraries" },
  "src/app/[locale]/sacred-journeys/packing/page.tsx": { key: "sacredJourneys.packing", path: "/sacred-journeys/packing" },
  "src/app/[locale]/sacred-journeys/policies/page.tsx": { key: "sacredJourneys.policies", path: "/sacred-journeys/policies" },
  "src/app/[locale]/sacred-journeys/preparation/page.tsx": { key: "sacredJourneys.preparation", path: "/sacred-journeys/preparation" },
  "src/app/[locale]/sacred-journeys/reading/page.tsx": { key: "sacredJourneys.reading", path: "/sacred-journeys/reading" },
  "src/app/[locale]/sacred-journeys/reflection-journals/page.tsx": { key: "sacredJourneys.reflectionJournals", path: "/sacred-journeys/reflection-journals" },
  "src/app/[locale]/sacred-journeys/registration/page.tsx": { key: "sacredJourneys.registration", path: "/sacred-journeys/registration" },
  "src/app/[locale]/sacred-journeys/umrah/page.tsx": { key: "sacredJourneys.umrah", path: "/sacred-journeys/umrah" },
  "src/app/[locale]/the-academy/page.tsx": { key: "theAcademy", path: "/the-academy" },
  "src/app/[locale]/the-academy/assessment/page.tsx": { key: "theAcademy.assessment", path: "/the-academy/assessment" },
  "src/app/[locale]/the-academy/certification/page.tsx": { key: "theAcademy.certification", path: "/the-academy/certification" },
  "src/app/[locale]/the-academy/clinical-ethics/page.tsx": { key: "theAcademy.clinicalEthics", path: "/the-academy/clinical-ethics" },
  "src/app/[locale]/the-academy/clinical-standards/page.tsx": { key: "theAcademy.clinicalStandards", path: "/the-academy/clinical-standards" },
  "src/app/[locale]/the-academy/course-handbook/page.tsx": { key: "theAcademy.courseHandbook", path: "/the-academy/course-handbook" },
  "src/app/[locale]/the-academy/curriculum/page.tsx": { key: "theAcademy.curriculum", path: "/the-academy/curriculum" },
  "src/app/[locale]/the-academy/enrolment/page.tsx": { key: "theAcademy.enrolment", path: "/the-academy/enrolment" },
  "src/app/[locale]/the-academy/entry-requirements/page.tsx": { key: "theAcademy.entryRequirements", path: "/the-academy/entry-requirements" },
  "src/app/[locale]/the-academy/equipment/page.tsx": { key: "theAcademy.equipment", path: "/the-academy/equipment" },
  "src/app/[locale]/the-academy/facilities/page.tsx": { key: "theAcademy.facilities", path: "/the-academy/facilities" },
  "src/app/[locale]/the-academy/faculty/page.tsx": { key: "theAcademy.faculty", path: "/the-academy/faculty" },
  "src/app/[locale]/the-academy/faqs/page.tsx": { key: "theAcademy.faqs", path: "/the-academy/faqs" },
  "src/app/[locale]/the-academy/foundations/page.tsx": { key: "theAcademy.foundations", path: "/the-academy/foundations" },
  "src/app/[locale]/the-academy/gallery/page.tsx": { key: "theAcademy.gallery", path: "/the-academy/gallery" },
  "src/app/[locale]/the-academy/graduate-pathways/page.tsx": { key: "theAcademy.graduatePathways", path: "/the-academy/graduate-pathways" },
  "src/app/[locale]/the-academy/learning-outcomes/page.tsx": { key: "theAcademy.learningOutcomes", path: "/the-academy/learning-outcomes" },
  "src/app/[locale]/the-academy/materia-medica/page.tsx": { key: "theAcademy.materiaMedica", path: "/the-academy/materia-medica" },
  "src/app/[locale]/the-academy/policies/page.tsx": { key: "theAcademy.policies", path: "/the-academy/policies" },
  "src/app/[locale]/the-academy/practical-sessions/page.tsx": { key: "theAcademy.practicalSessions", path: "/the-academy/practical-sessions" },
  "src/app/[locale]/the-academy/student-guide/page.tsx": { key: "theAcademy.studentGuide", path: "/the-academy/student-guide" },
  "src/app/[locale]/the-academy/testimonials/page.tsx": { key: "theAcademy.testimonials", path: "/the-academy/testimonials" },
  "src/app/[locale]/the-apothecary/page.tsx": { key: "theApothecary", path: "/the-apothecary" },
  "src/app/[locale]/the-apothecary/catalogue/page.tsx": { key: "theApothecary.catalogue", path: "/the-apothecary/catalogue" },
  "src/app/[locale]/the-apothecary/counter/layout.tsx": { key: "theApothecary.counter", path: "/the-apothecary/counter" },
  "src/app/[locale]/the-apothecary/faqs/page.tsx": { key: "theApothecary.faqs", path: "/the-apothecary/faqs" },
  "src/app/[locale]/the-apothecary/ingredients/page.tsx": { key: "theApothecary.ingredients", path: "/the-apothecary/ingredients" },
  "src/app/[locale]/the-apothecary/laboratory-verification/page.tsx": { key: "theApothecary.laboratoryVerification", path: "/the-apothecary/laboratory-verification" },
  "src/app/[locale]/the-apothecary/monographs/page.tsx": { key: "theApothecary.monographs", path: "/the-apothecary/monographs" },
  "src/app/[locale]/the-apothecary/order-confirmation/page.tsx": { key: "theApothecary.orderConfirmation", path: "/the-apothecary/order-confirmation" },
  "src/app/[locale]/the-apothecary/quality-standards/page.tsx": { key: "theApothecary.qualityStandards", path: "/the-apothecary/quality-standards" },
  "src/app/[locale]/the-register/page.tsx": { key: "theRegister", path: "/the-register" },
  "src/app/[locale]/the-register/layout.tsx": { key: "theRegister", path: "/the-register" },
};

const METADATA_BLOCK = /export const metadata: Metadata = \{[\s\S]*?\};\n\n/;

const GENERATED = (key: string, route: string) => `export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("${key}", "${route}");
}

`;

function patchFile(relPath: string, key: string, route: string) {
  const abs = path.join(ROOT, relPath);
  let src = fs.readFileSync(abs, "utf8");
  if (!METADATA_BLOCK.test(src)) {
    console.warn("skip (no static metadata):", relPath);
    return;
  }
  if (src.includes("pageMetadata(")) {
    console.log("already patched:", relPath);
    return;
  }

  src = src.replace(METADATA_BLOCK, GENERATED(key, route));

  if (!src.includes("pageMetadata")) {
    src = src.replace(
      /import type \{ Metadata \} from "next";/,
      'import type { Metadata } from "next";\nimport { pageMetadata } from "@/lib/i18n/page-metadata";',
    );
  }
  if (!src.includes("AppLocale")) {
    src = src.replace(
      /import type \{ Metadata \} from "next";/,
      'import type { Metadata } from "next";\nimport type { AppLocale } from "@/i18n/locales";',
    );
  }

  fs.writeFileSync(abs, src);
  console.log("patched:", relPath);
}

mergePages("en", enPages);
mergePages("da", daPages);

for (const [rel, { key, path: route }] of Object.entries(FILE_MAP)) {
  patchFile(rel, key, route);
}

console.log("Done.");
