import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { FaqSection } from "@/components/apothecary/MonographExtras";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { getJourneyBySlug } from "@/sanity/lib/fetch";
import { journeyInstitution } from "@/lib/content/journeys";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Registration, safety, postponement, and institutional boundaries.",
};

export default async function JourneysFaqsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const journey = await getJourneyBySlug("umrah", locale);
  const faq = journey?.faq?.length ? journey.faq : journeyInstitution.faq;

  return (
    <JourneySectionPage
      folio="xv"
      title="Questions"
      lede="Registration, safety, and institutional limits"
      currentHref="/sacred-journeys/faqs"
      breadcrumbLabel="FAQs"
      intro={
        <p>
          These answers apply to all programmes unless a journey page states
          otherwise
        </p>
      }
    >
      <FaqSection items={faq} />
    </JourneySectionPage>
  );
}
