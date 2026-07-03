import type { Metadata } from "next";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { PreparationTimeline } from "@/components/journeys/JourneyInstitutionBlocks";
// Data sourced from Sanity CMS via static fallback — institutional section content
import { journeyInstitution } from "@/lib/content/journeys";

export const metadata: Metadata = {
  title: "Preparation",
  description: "Reading, health preparation, documents, and timeline before travel.",
};

export default function PreparationPage() {
  return (
    <JourneySectionPage
      folio="iv"
      title="Preparation"
      lede="Preparation is assigned and reviewed before departure."
      currentHref="/sacred-journeys/preparation"
      breadcrumbLabel="Preparation"
      intro={
        <p>
          All journeys follow a shared preparation timeline. Programme-specific
          requirements appear on each journey page. Travellers must complete
          assigned reading and health disclosure before departure.
        </p>
      }
    >
      <PreparationTimeline timeline={journeyInstitution.preparationTimeline} />
    </JourneySectionPage>
  );
}
