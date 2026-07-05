import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { PolicyBlocks } from "@/components/journeys/JourneyInstitutionBlocks";
import { getJourneyBySlug } from "@/sanity/lib/fetch";
import { journeyInstitution } from "@/lib/content/journeys";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("sacredJourneys.reflectionJournals", "/sacred-journeys/reflection-journals");
}

export default async function ReflectionJournalsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getJourneyBySlug("umrah", locale);
  const reflectionJournals = journeyInstitution.reflectionJournals;

  return (
    <JourneySectionPage
      folio="x"
      title="Reflection journals"
      lede="The journal is assigned as part of study discipline"
      currentHref="/sacred-journeys/reflection-journals"
      breadcrumbLabel="Reflection journals"
      intro={
        <p>
          Journals link directly to reading and seminar work
          Programme-specific prompts appear on each journey page
        </p>
      }
    >
      <PolicyBlocks items={reflectionJournals} />
    </JourneySectionPage>
  );
}
