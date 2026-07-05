import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { PolicyBlocks } from "@/components/journeys/JourneyInstitutionBlocks";
import { getJourneyBySlug } from "@/sanity/lib/fetch";
import { journeyInstitution } from "@/lib/content/journeys";
import type { PolicyItem } from "@/lib/content/journeys/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("sacredJourneys.policies", "/sacred-journeys/policies");
}

export default async function PoliciesPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const journey = await getJourneyBySlug("umrah", locale);
  const policies = journey?.policies?.length
    ? (journey.policies as PolicyItem[])
    : journeyInstitution.policies;

  return (
    <JourneySectionPage
      folio="xiv"
      title="Policies"
      lede="Stated plainly, with no hidden terms"
      currentHref="/sacred-journeys/policies"
      breadcrumbLabel="Policies"
      intro={
        <p>
          Journey-specific policies appear on each programme page. These are the
          institutional standards for all departures
        </p>
      }
    >
      <PolicyBlocks items={policies} />
    </JourneySectionPage>
  );
}
