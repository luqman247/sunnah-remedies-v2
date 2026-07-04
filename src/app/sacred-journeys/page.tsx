import type { Metadata } from "next";
import { Leaf } from "@/components/ui/Leaf";
import { DepartmentNav } from "@/components/ui/DepartmentNav";
import { PageIntro } from "@/components/ui/PageIntro";
import { GoLink } from "@/components/ui/Links";
import { SectionLabel } from "@/components/ui/PageIntro";
import { getAllJourneys, sacredJourneys } from "@/sanity/lib/fetch";
import {
  CinematicHero,
  EditorialPillar,
  PullQuote,
  InstitutionalDivider,
  EditorialPhoto,
} from "@/components/editorial/Editorial";

export const metadata: Metadata = {
  title: "Sacred Journeys",
  description:
    "Educational pilgrimage with preparation, reading, faculty companions, and clear guidance. We travel to learn, not to see.",
};

export default async function SacredJourneysPage() {
  await getAllJourneys();

  return (
    <>
      <CinematicHero
        src="/photography/sacred-journeys-hero.jpg"
        alt="Pilgrims walking across the marble courtyard of the Prophet's Mosque in Madinah at dawn"
        statement="Educational pilgrimage"
        qualifier="We travel to learn, not to see. Meaning precedes logistics. Preparation begins weeks before departure. A reading list and faculty companion accompany every group"
      />

      <Leaf>
        <div className="measure-wide">
          <PageIntro
            section="Sacred Journeys"
            folio="i"
            title="Embodiment through pilgrimage"
            lede="Educational travel ordered by purpose, not itinerary"
          >
            <p>
              Sacred Journeys is an educational pilgrimage institution — not a
              travel company. Every journey carries a purpose before it carries
              a route. Scholars are named before destinations. Reading lists are
              issued before packing guides. Difficulty and physical requirements
              are stated plainly before registration opens. The journey is
              inward before it is outward
            </p>
          </PageIntro>
        </div>
      </Leaf>

      <InstitutionalDivider />

      <Leaf>
        <div className="measure-wide">
          <EditorialPillar
            src="/photography/architecture-twilight.jpg"
            alt="Ancient Islamic architecture at twilight — a stone archway leading to a quiet courtyard with lanterns casting warm light"
            caption="The Holy Lands — architecture, reflection, and sacred history"
          >
            <SectionLabel>Featured journey</SectionLabel>
            <h2 className="type-display-l" style={{ margin: 0 }}>
              Umrah with the Institute
            </h2>
            <p className="type-body-l">
              An educational pilgrimage to the Holy Lands, structured around
              study, reflection, and companionship. Faculty companions lead
              daily sessions on the spiritual and scholarly dimensions of each
              site. Preparation begins six weeks before departure with guided
              reading and reflection
            </p>
            <div>
              <GoLink href="/sacred-journeys/umrah">
                Read the full programme
              </GoLink>
            </div>
          </EditorialPillar>
        </div>
      </Leaf>

      <EditorialPhoto
        src="/photography/sacred-journeys-hero.jpg"
        alt="Pilgrims approaching the Prophet's Mosque in Madinah at dawn"
        aspect="landscape"
        fullBleed
        caption="The Olive Grove Journey — walking through ancestral Palestinian olive groves"
      />

      <Leaf>
        <div className="measure-wide">
          <div className="editorial-two-col">
            <div>
              <SectionLabel>Considered departures</SectionLabel>
              <h2 className="type-display-l" style={{ margin: "0 0 var(--s4)" }}>
                Every journey begins with preparation
              </h2>
              <p className="type-body-l">
                Weeks before departure, participants receive a reading list,
                health guidance, and reflection journal. Faculty companions
                are named. Daily itineraries balance study, prayer, physical
                movement, and quiet reflection. Groups are small. The pace is
                deliberate
              </p>
            </div>
            <div>
              <PullQuote
                text="The journey is inward before it is outward. We prepare the mind before we prepare the luggage"
              />
              <div style={{ marginTop: "var(--s5)" }}>
                <GoLink href="/sacred-journeys/preparation">
                  Preparation and reading
                </GoLink>
              </div>
            </div>
          </div>
        </div>
      </Leaf>

      <Leaf variant="grave">
        <div className="measure grave-block">
          <PullQuote
            text="Register your interest. Placement follows interview and academic review"
            dark
          />
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide">
          <DepartmentNav department={sacredJourneys} />
        </div>
      </Leaf>
    </>
  );
}
