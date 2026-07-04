import type { Metadata } from "next";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { PolicyBlocks } from "@/components/journeys/JourneyInstitutionBlocks";
import { getJourneyBySlug } from "@/sanity/lib/fetch";
import { journeyInstitution } from "@/lib/content/journeys";
import type { PolicyItem } from "@/lib/content/journeys/types";

export const metadata: Metadata = {
  title: "Policies",
  description: "Cancellation, conduct, and insurance standards stated plainly.",
};

export default async function PoliciesPage() {
  const journey = await getJourneyBySlug("umrah");
  const policies = journey?.policies?.length
    ? (journey.policies as PolicyItem[])
    : journeyInstitution.policies;

  return (
    <JourneySectionPage
      folio="xiv"
      title="Policies"
      lede="Stated plainly, with no hidden terms"
      currentHref="/sacred-journeys/policies"
      breadcrumbLabel="Policies"
      intro={
        <p>
          Journey-specific policies appear on each programme page. These are the
          institutional standards for all departures
        </p>
      }
    >
      <PolicyBlocks items={policies} />
    </JourneySectionPage>
  );
}
