import type { Metadata } from "next";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { PreparationTimeline } from "@/components/journeys/JourneyInstitutionBlocks";
import { getJourneyBySlug } from "@/sanity/lib/fetch";
import { journeyInstitution } from "@/lib/content/journeys";

export const metadata: Metadata = {
  title: "Preparation",
  description: "Reading, health preparation, documents, and timeline before travel.",
};

export default async function PreparationPage() {
  await getJourneyBySlug("umrah");
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
