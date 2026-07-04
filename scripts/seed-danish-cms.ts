/**
 * Seed and publish Danish CMS documents in Sanity.
 *
 * Creates Danish counterparts for global singletons (navigation, footer,
 * global SEO, institution settings, homepage), tags existing English
 * documents with language=en, and links translations via translation.metadata.
 *
 * Usage:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=… \
 *   NEXT_PUBLIC_SANITY_DATASET=production \
 *   SANITY_API_TOKEN=… \
 *   npx tsx scripts/seed-danish-cms.ts
 */

import { createClient, type SanityClient } from "next-sanity";
import da from "../src/messages/da.json";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing Sanity credentials. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

type SingletonSpec = {
  type: string;
  enId: string;
  daId: string;
  buildDa: (enDoc: Record<string, unknown> | null) => Record<string, unknown>;
};

const SINGLETONS: SingletonSpec[] = [
  {
    type: "navigation",
    enId: "navigation",
    daId: "navigation-da",
    buildDa: () => ({
      _id: "navigation-da",
      _type: "navigation",
      language: "da",
      mainNavigation: [
        { label: da.nav.theApothecary, href: "/the-apothecary" },
        { label: da.nav.theAcademy, href: "/the-academy" },
        { label: da.nav.sacredJourneys, href: "/sacred-journeys" },
        { label: da.nav.knowledgeLibrary, href: "/knowledge-library" },
        {
          label: da.nav.consultations,
          href: "/consultations",
          highlighted: true,
        },
      ],
    }),
  },
  {
    type: "footerSettings",
    enId: "footerSettings",
    daId: "footerSettings-da",
    buildDa: () => ({
      _id: "footerSettings-da",
      _type: "footerSettings",
      language: "da",
      preFooterStatement:
        "Begynd hvor du er. Uanset om du søger et middel, ønsker at studere, eller forbereder dig på pilgrimsfærd — institutionen er åben",
      preFooterAction: {
        label: da.footer.requestConsultation,
        href: "/consultations",
      },
      columns: [
        {
          title: "Søjlerne",
          links: [
            { label: da.nav.theApothecary, href: "/the-apothecary" },
            { label: da.nav.theAcademy, href: "/the-academy" },
            { label: da.nav.sacredJourneys, href: "/sacred-journeys" },
            { label: da.nav.knowledgeLibrary, href: "/knowledge-library" },
          ],
        },
        {
          title: "Institutionen",
          links: [
            { label: "Institutionen", href: "/institute" },
            { label: da.nav.charter, href: "/charter" },
            { label: "Det institutionelle år", href: "/calendar" },
            { label: "Udstillinger", href: "/exhibitions" },
            { label: "Forskning", href: "/research" },
            { label: "Pressen", href: "/press" },
          ],
        },
        {
          title: "Kontakt",
          links: [
            { label: da.nav.correspondence, href: "/correspondence" },
            { label: "Akademiindskrivning", href: "/the-academy/enrolment" },
            { label: "Rejseregistrering", href: "/sacred-journeys/registration" },
          ],
        },
        {
          title: "Juridisk",
          links: [
            { label: "Privatliv", href: "/charter" },
            { label: "Vilkår", href: "/charter" },
            { label: "Tilgængelighed", href: "/charter" },
          ],
        },
      ],
      closingStatement: da.footer.closing,
      colophon: da.footer.colophon,
    }),
  },
  {
    type: "globalSeo",
    enId: "globalSeo",
    daId: "globalSeo-da",
    buildDa: () => ({
      _id: "globalSeo-da",
      _type: "globalSeo",
      language: "da",
      siteName: "Sunnah Remedies",
      siteDescription: da.metadata.defaultDescription,
      keywords: [
        "Profetisk medicin",
        "Tibb al-Nabawi",
        "Hijama",
        "Islamisk medicin",
      ],
    }),
  },
  {
    type: "institutionSettings",
    enId: "institutionSettings",
    daId: "institutionSettings-da",
    buildDa: () => ({
      _id: "institutionSettings-da",
      _type: "institutionSettings",
      language: "da",
      name: "Sunnah Remedies",
      descriptor: da.footer.tagline,
      tagline: da.footer.foundingStatement,
      foundingYear: "2025",
    }),
  },
  {
    type: "homepage",
    enId: "homepage",
    daId: "homepage-da",
    buildDa: (enDoc) => {
      const base = enDoc ? structuredClone(enDoc) : {};
      delete base._rev;
      delete base._createdAt;
      delete base._updatedAt;

      return {
        ...base,
        _id: "homepage-da",
        _type: "homepage",
        language: "da",
        eyebrow: "GRUNDLAGT MMXXV · INSTITUT FOR PROFETISK MEDICIN",
        arrivalEnglish:
          "Den profetiske traditions medicin, holdt levende",
        arrivalStandfirst:
          "En institution for bevarelse og ansvarlig formidling af profetisk medicin — forankret i primærkildesforskning, laboratoriebekræftelse, klinisk ansvarlighed og klare grænser",
        enterLabel: da.arrival.enter,
        institutionStatement: da.footer.closing,
        seo: {
          metaTitle: da.metadata.defaultTitle,
          metaDescription: da.metadata.defaultDescription,
        },
      };
    },
  },
];

async function fetchDoc(id: string): Promise<Record<string, unknown> | null> {
  return client.fetch(`*[_id == $id][0]`, { id });
}

async function ensureEnglishLanguage(
  client: SanityClient,
  spec: SingletonSpec,
): Promise<string> {
  const doc = await fetchDoc(spec.enId);
  if (!doc) {
    console.log(`  · No English ${spec.type} at ${spec.enId} — skipping EN tag`);
    return spec.enId;
  }

  if (doc.language !== "en") {
    await client.patch(spec.enId).set({ language: "en" }).commit();
    console.log(`  · Tagged ${spec.enId} with language=en`);
  }

  return spec.enId;
}

async function upsertTranslationMetadata(
  client: SanityClient,
  metaId: string,
  enId: string,
  daId: string,
  schemaType: string,
) {
  const weak = true;
  const metadata = {
    _id: metaId,
    _type: "translation.metadata",
    schemaTypes: [schemaType],
    translations: [
      {
        _key: "en",
        _type: "internationalizedArrayReferenceValue",
        language: "en",
        value: { _type: "reference", _ref: enId, _weak: weak },
      },
      {
        _key: "da",
        _type: "internationalizedArrayReferenceValue",
        language: "da",
        value: { _type: "reference", _ref: daId, _weak: weak },
      },
    ],
  };

  await client.createOrReplace(metadata);
}

async function seedSingleton(client: SanityClient, spec: SingletonSpec) {
  console.log(`\n→ ${spec.type}`);

  const enId = await ensureEnglishLanguage(client, spec);
  const enDoc = await fetchDoc(enId);
  const daDoc = spec.buildDa(enDoc);

  await client.createOrReplace(daDoc as { _id: string; _type: string });
  console.log(`  · Published ${spec.daId}`);

  await upsertTranslationMetadata(
    client,
    `translation.metadata.${spec.type}`,
    enId,
    spec.daId,
    spec.type,
  );
  console.log(`  · Linked translation.metadata.${spec.type}`);
}

async function main() {
  console.log(`Seeding Danish CMS content to ${projectId}/${dataset}`);

  for (const spec of SINGLETONS) {
    await seedSingleton(client, spec);
  }

  console.log("\nDone. Open /studio and verify Danish documents under each singleton.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
