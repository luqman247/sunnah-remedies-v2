import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { SessionCards } from "@/components/journeys/JourneyInstitutionBlocks";
import { getJourneyBySlug } from "@/sanity/lib/fetch";
import { journeyInstitution } from "@/lib/content/journeys";

export const metadata: Metadata = {
  title: "Educational sessions",
  description: "Seminars, field study, and circles delivered to a published structure.",
};

export default async function EducationalSessionsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const journey = await getJourneyBySlug("umrah", locale);
  const sessions = journey?.educationalSessions?.length
    ? (journey.educationalSessions as { title: string; format: string; description: string }[])
    : journeyInstitution.educationalSessions;

  return (
    <JourneySectionPage
      folio="ix"
      title="Educational sessions"
      lede="Teaching precedes performance and is never improvised"
      currentHref="/sacred-journeys/educational-sessions"
      breadcrumbLabel="Educational sessions"
      intro={
        <p>
          Sessions are compulsory. Optional tourism is not offered. Each journey
          adapts these formats to its landscape — rites seminars for Umrah, grove
          field study for the olive retreat, riḥla circles in the desert
        </p>
      }
    >
      <SessionCards sessions={sessions} />
    </JourneySectionPage>
  );
}
