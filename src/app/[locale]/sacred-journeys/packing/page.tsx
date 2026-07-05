import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { PackingCategories } from "@/components/journeys/JourneyInstitutionBlocks";
import { getJourneyBySlug } from "@/sanity/lib/fetch";
import { journeyInstitution } from "@/lib/content/journeys";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("sacredJourneys.packing", "/sacred-journeys/packing");
}

export default async function PackingPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getJourneyBySlug("umrah", locale);
  const categories = journeyInstitution.packingGuide;

  return (
    <JourneySectionPage
      folio="vi"
      title="Packing guide"
      lede="Pack to programme requirements issued at registration"
      currentHref="/sacred-journeys/packing"
      breadcrumbLabel="Packing guide"
      intro={
        <p>
          This is the institutional baseline. Each journey publishes additional
          items on its programme page — iḥrām for Umrah, sleeping bag for the
          desert, walking boots for the grove
        </p>
      }
    >
      <PackingCategories categories={categories} />
    </JourneySectionPage>
  );
}
