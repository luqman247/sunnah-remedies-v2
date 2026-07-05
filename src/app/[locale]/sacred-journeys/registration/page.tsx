import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { RegistrationJourney } from "@/components/journeys/RegistrationJourney";
import { RegistrationForm } from "@/components/journeys/RegistrationForm";
import { SectionLabel } from "@/components/ui/PageIntro";
import { getJourneyBySlug } from "@/sanity/lib/fetch";
import { journeyInstitution } from "@/lib/content/journeys";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("sacredJourneys.registration", "/sacred-journeys/registration");
}

export default async function RegistrationPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getJourneyBySlug("umrah", locale);
  const registrationSteps = journeyInstitution.registrationSteps;

  return (
    <JourneySectionPage
      folio="xiii"
      title="Registration"
      lede="Register your interest. This is not a booking"
      currentHref="/sacred-journeys/registration"
      breadcrumbLabel="Registration"
      intro={
        <p>
          Placement is confirmed after reading review, interview, and fitness
          where applicable. Scholarship and suitability are reviewed before fee
          correspondence
        </p>
      }
    >
      <SectionLabel>Registration journey</SectionLabel>
      <RegistrationJourney steps={registrationSteps} />

      <section className="dispensation-block enrolment-block" style={{ marginTop: "var(--s7)" }}>
        <SectionLabel>Register your interest</SectionLabel>
        <p className="type-body" style={{ marginBottom: "var(--s5)" }}>
          Select a programme on the form if known. The institution responds within
          ten working days
        </p>
        <RegistrationForm />
      </section>
    </JourneySectionPage>
  );
}
