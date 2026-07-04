import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { PolicyBlocks } from "@/components/journeys/JourneyInstitutionBlocks";
import { getJourneyBySlug } from "@/sanity/lib/fetch";
import { journeyInstitution } from "@/lib/content/journeys";

export const metadata: Metadata = {
  title: "Companionship",
  description: "Group size, adab, and disciplined travel in company.",
};

export default async function CompanionshipPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getJourneyBySlug("umrah", locale);
  const companionship = journeyInstitution.companionship;

  return (
    <JourneySectionPage
      folio="xi"
      title="Companionship"
      lede="Travellers observe shared discipline in movement, learning, and rest"
      currentHref="/sacred-journeys/companionship"
      breadcrumbLabel="Companionship"
      intro={
        <p>
          Companionship is part of the curriculum. Group size is capped to
          preserve teaching quality, safety, and trust
        </p>
      }
    >
      <PolicyBlocks items={companionship} />
    </JourneySectionPage>
  );
}
