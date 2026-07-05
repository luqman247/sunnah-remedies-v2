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
  return pageMetadata("sacredJourneys.accommodation", "/sacred-journeys/accommodation");
}

export default async function AccommodationPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getJourneyBySlug("umrah", locale);
  const accommodation = journeyInstitution.accommodationPhilosophy;

  return (
    <JourneySectionPage
      folio="viii"
      title="Accommodation philosophy"
      lede="Lodging is selected for suitability, not display"
      currentHref="/sacred-journeys/accommodation"
      breadcrumbLabel="Accommodation"
      intro={
        <p>
          The institution selects lodging for proximity to teaching sites,
          safety, and simplicity. Distance and facilities are stated before
          registration
        </p>
      }
    >
      <PolicyBlocks items={accommodation} />
    </JourneySectionPage>
  );
}
