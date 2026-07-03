import type { Metadata } from "next";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { PackingCategories } from "@/components/journeys/JourneyInstitutionBlocks";
import { journeyInstitution } from "@/lib/content/journeys";

export const metadata: Metadata = {
  title: "Packing guide",
  description: "Programme packing guidance covering climate, adab, and institutional provisions.",
};

export default function PackingPage() {
  return (
    <JourneySectionPage
      folio="vi"
      title="Packing guide"
      lede="Pack to programme requirements issued at registration."
      currentHref="/sacred-journeys/packing"
      breadcrumbLabel="Packing guide"
      intro={
        <p>
          This is the institutional baseline. Each journey publishes additional
          items on its programme page — iḥrām for Umrah, sleeping bag for the
          desert, walking boots for the grove.
        </p>
      }
    >
      <PackingCategories categories={journeyInstitution.packingGuide} />
    </JourneySectionPage>
  );
}
