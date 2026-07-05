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
  return pageMetadata("sacredJourneys.flightGuidance", "/sacred-journeys/flight-guidance");
}

export default async function FlightGuidancePage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getJourneyBySlug("umrah", locale);
  const flightGuidance = journeyInstitution.flightGuidance;

  return (
    <JourneySectionPage
      folio="vii"
      title="Flight guidance"
      lede="You arrange flights; the institution coordinates windows and meeting points"
      currentHref="/sacred-journeys/flight-guidance"
      breadcrumbLabel="Flight guidance"
      intro={
        <p>
          Sacred Journeys does not sell flights and does not earn airline
          commission. Each journey page states its meeting point and arrival
          window
        </p>
      }
    >
      <PolicyBlocks items={flightGuidance} />
    </JourneySectionPage>
  );
}
