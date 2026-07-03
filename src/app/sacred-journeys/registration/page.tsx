import type { Metadata } from "next";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { RegistrationJourney } from "@/components/journeys/RegistrationJourney";
import { RegistrationForm } from "@/components/journeys/RegistrationForm";
import { SectionLabel } from "@/components/ui/PageIntro";
import { journeyInstitution } from "@/lib/content/journeys";

export const metadata: Metadata = {
  title: "Registration",
  description: "Register your interest. Placement follows interview and reading review.",
};

export default function RegistrationPage() {
  return (
    <JourneySectionPage
      folio="xiii"
      title="Registration"
      lede="Register your interest. This is not a booking."
      currentHref="/sacred-journeys/registration"
      breadcrumbLabel="Registration"
      intro={
        <p>
          Placement is confirmed after reading review, interview, and fitness
          where applicable. Scholarship and suitability are reviewed before fee
          correspondence.
        </p>
      }
    >
      <SectionLabel>Registration journey</SectionLabel>
      <RegistrationJourney steps={journeyInstitution.registrationSteps} />

      <section className="dispensation-block enrolment-block" style={{ marginTop: "var(--s7)" }}>
        <SectionLabel>Register your interest</SectionLabel>
        <p className="type-body" style={{ marginBottom: "var(--s5)" }}>
          Select a programme on the form if known. The institution responds within
          ten working days.
        </p>
        <RegistrationForm />
      </section>
    </JourneySectionPage>
  );
}
