import type { Metadata } from "next";
import { Leaf } from "@/components/ui/Leaf";
import { ListingRow } from "@/components/ui/Attestation";
import { PageIntro, SectionLabel } from "@/components/ui/PageIntro";
import { GoLink } from "@/components/ui/Links";
import { journeyCatalogue } from "@/lib/content/journeys";

export const metadata: Metadata = {
  title: "Sacred Journeys",
  description:
    "Educational pilgrimage — meaning before logistics, scholars, preparation, and honest difficulty.",
};

export default function SacredJourneysPage() {
  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <PageIntro
            section="Sacred Journeys"
            folio="i"
            title="The few considered journeys"
            lede="An educational pilgrimage institution — not a travel agency."
          >
            <p>
              Sacred Journeys embody the lived practice of Prophetic wellbeing.
              Each journey names its meaning before its logistics, its scholars
              before its schedule, and its honest difficulty before any registration.
              You are expected to read, prepare, and reflect — not to consume a holiday.
            </p>
          </PageIntro>
        </div>
      </Leaf>

      <Leaf variant="grave">
        <div className="measure grave-block">
          <p className="grave-block__qualifier" style={{ color: "var(--paper-dim)" }}>
            A journey, not a holiday. Register your interest — never a booking without
            interview. There is no need to decide today. The tradition keeps.
          </p>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide">
          <SectionLabel>Journeys · {journeyCatalogue.length} departures</SectionLabel>
          {journeyCatalogue.map((j) => (
            <ListingRow
              key={j.slug}
              title={j.name}
              subtitle={j.description}
              provenance={`${j.season} · ${j.duration}`}
              href={j.href}
            />
          ))}
        </div>
      </Leaf>

      <Leaf>
        <div className="measure-wide">
          <div className="measure">
            <SectionLabel>What every journey includes</SectionLabel>
            <ul className="monograph-list">
              <li>Named scholars and guides with stated grounding — not anonymous tour leaders.</li>
              <li>Educational itinerary with sourced seminars — not optional excursions.</li>
              <li>Pre-retreat reading and preparation timeline — assigned, not suggested.</li>
              <li>Safety assessment, insurance requirements, and postponement if travel is inadvisable.</li>
              <li>Honest organisation — lodging, meals, and difficulty named before the fee.</li>
              <li>Registration by interest and interview — placement is not automatic.</li>
            </ul>
          </div>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure">
          <SectionLabel>The three departments</SectionLabel>
          <p className="type-body" style={{ marginBottom: "var(--s4)" }}>
            Journeys draw on the Academy for texts and the Apothecary for materia medica
            studied on route. One institution — knowledge, means, embodiment.
          </p>
          <p className="type-body">
            <GoLink href="/the-academy">The Academy</GoLink>
          </p>
          <p className="type-body" style={{ marginTop: "var(--s3)" }}>
            <GoLink href="/the-apothecary">The Apothecary</GoLink>
          </p>
        </div>
      </Leaf>
    </>
  );
}
