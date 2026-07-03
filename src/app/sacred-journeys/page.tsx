import type { Metadata } from "next";
import { DepartmentHub } from "@/components/ui/SectionPage";
import { sacredJourneys } from "@/lib/navigation/site-structure";

export const metadata: Metadata = {
  title: "Sacred Journeys",
  description:
    "Educational pilgrimage with preparation, reading, itineraries, registration, and clear guidance.",
};

export default function SacredJourneysPage() {
  return (
    <DepartmentHub
      department={sacredJourneys}
      folio="i"
      title="Educational pilgrimage"
      lede="Embodiment · Soul — educational travel ordered by study."
      intro={
        <p>
          Sacred Journeys is an educational pilgrimage institution. Meaning
          precedes logistics. Each programme names its scholars, reading, and
          limits before registration. Navigate by section below.
        </p>
      }
      grave="Register your interest. Placement follows interview and academic review."
    />
  );
}
