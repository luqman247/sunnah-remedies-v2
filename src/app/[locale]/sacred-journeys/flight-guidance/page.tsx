import type { Metadata } from "next";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { PolicyBlocks } from "@/components/journeys/JourneyInstitutionBlocks";
import { getJourneyBySlug } from "@/sanity/lib/fetch";
import { journeyInstitution } from "@/lib/content/journeys";

export const metadata: Metadata = {
  title: "Flight guidance",
  description: "Flight coordination guidance for programme arrivals and departures.",
};

export default async function FlightGuidancePage() {
  await getJourneyBySlug("umrah");
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
