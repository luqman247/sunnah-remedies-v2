import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { PreparationTimeline } from "@/components/journeys/JourneyInstitutionBlocks";
import { getJourneyBySlug } from "@/sanity/lib/fetch";
import { journeyInstitution } from "@/lib/content/journeys";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("sacredJourneys.preparation", "/sacred-journeys/preparation");
}

export default async function PreparationPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getJourneyBySlug("umrah", locale);
  const preparation = journeyInstitution.preparationTimeline;

  return (
    <JourneySectionPage
      folio="iv"
      title="Preparation"
      lede="Preparation is assigned and reviewed before departure"
      currentHref="/sacred-journeys/preparation"
      breadcrumbLabel="Preparation"
      intro={
        <p>
          All journeys follow a shared preparation timeline. Programme-specific
          requirements appear on each journey page. Travellers must complete
          assigned reading and health disclosure before departure
        </p>
      }
    >
      <PreparationTimeline timeline={preparation} />
    </JourneySectionPage>
  );
}
