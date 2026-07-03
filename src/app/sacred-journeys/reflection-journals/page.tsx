import type { Metadata } from "next";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { PolicyBlocks } from "@/components/journeys/JourneyInstitutionBlocks";
// Data sourced from Sanity CMS via static fallback — institutional section content
import { journeyInstitution } from "@/lib/content/journeys";

export const metadata: Metadata = {
  title: "Reflection journals",
  description: "Assigned reflection prompts linked to seminars and readings.",
};

export default function ReflectionJournalsPage() {
  return (
    <JourneySectionPage
      folio="x"
      title="Reflection journals"
      lede="The journal is assigned as part of study discipline."
      currentHref="/sacred-journeys/reflection-journals"
      breadcrumbLabel="Reflection journals"
      intro={
        <p>
          Journals link directly to reading and seminar work.
          Programme-specific prompts appear on each journey page.
        </p>
      }
    >
      <PolicyBlocks items={journeyInstitution.reflectionJournals} />
    </JourneySectionPage>
  );
}
