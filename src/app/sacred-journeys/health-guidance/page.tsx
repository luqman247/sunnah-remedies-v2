import type { Metadata } from "next";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { PolicyBlocks } from "@/components/journeys/JourneyInstitutionBlocks";
// Data sourced from Sanity CMS via static fallback — institutional section content
import { journeyInstitution } from "@/lib/content/journeys";

export const metadata: Metadata = {
  title: "Health guidance",
  description: "Disclosure, fitness, environmental exposure, and travel deferral criteria.",
};

export default function HealthGuidancePage() {
  return (
    <JourneySectionPage
      folio="xii"
      title="Health guidance"
      lede="Honest disclosure is required; safety precedes schedule."
      currentHref="/sacred-journeys/health-guidance"
      breadcrumbLabel="Health guidance"
      intro={
        <p>
          The institution may decline or defer placement for unstable medical
          conditions. Misrepresentation may void insurance and placement. Each
          journey states its physical demands on its programme page.
        </p>
      }
    >
      <PolicyBlocks items={journeyInstitution.healthGuidance} />
    </JourneySectionPage>
  );
}
