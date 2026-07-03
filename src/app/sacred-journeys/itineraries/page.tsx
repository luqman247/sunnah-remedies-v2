import type { Metadata } from "next";
import { ListingRow } from "@/components/ui/Attestation";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { SectionLabel } from "@/components/ui/PageIntro";
import { journeyCatalogue } from "@/lib/content/journeys";

export const metadata: Metadata = {
  title: "Itineraries",
  description: "Day-by-day educational itineraries published before departure.",
};

export default function ItinerariesPage() {
  return (
    <JourneySectionPage
      folio="iii"
      title="Daily itineraries"
      lede="Each journey publishes its educational itinerary before registration."
      currentHref="/sacred-journeys/itineraries"
      breadcrumbLabel="Itineraries"
      intro={
        <p>
          Open a journey to read the day-by-day programme: scholars, learning
          focus, sessions, and practical organisation. Comfort and limitations
          are stated plainly.
        </p>
      }
    >
      <SectionLabel>Considered departures · {journeyCatalogue.length} programmes</SectionLabel>
      {journeyCatalogue.map((j) => (
        <ListingRow
          key={j.slug}
          title={j.name}
          subtitle={j.description}
          provenance={`${j.season} · ${j.duration}`}
          href={j.href}
        />
      ))}
    </JourneySectionPage>
  );
}
