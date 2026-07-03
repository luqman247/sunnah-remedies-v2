import type { Metadata } from "next";
import { Leaf } from "@/components/ui/Leaf";
import { ListingRow } from "@/components/ui/Attestation";
import { PageIntro, SectionLabel } from "@/components/ui/PageIntro";
import { GoLink } from "@/components/ui/Links";
import { academyCatalogue } from "@/lib/content/academy";

export const metadata: Metadata = {
  title: "The Academy",
  description:
    "Transmission of Prophetic Medicine — executive education, professional programmes, and essential study.",
};

export default function AcademyPage() {
  const flagship = academyCatalogue.find((c) => c.slug === "hijama");
  const others = academyCatalogue.filter((c) => c.slug !== "hijama");

  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <PageIntro
            section="The Academy"
            folio="i"
            title="The reading room"
            lede="Executive education in Prophetic Medicine — not an online course platform."
          >
            <p>
              The Academy transmits the tradition with patience, citation, and supervised
              practice. Programmes are in person where clinical competence is required;
              essential study is offered as a right of the community. Every course names
              its teacher, chain, and assessment standard before enrolment.
            </p>
          </PageIntro>
        </div>
      </Leaf>

      <Leaf variant="grave">
        <div className="measure grave-block">
          <p className="grave-block__qualifier" style={{ color: "var(--paper-dim)" }}>
            Held to the standard of scholarship — never the standard of the marketplace.
            There is no need to decide today. The tradition keeps.
          </p>
        </div>
      </Leaf>

      {flagship && (
        <Leaf variant="inset">
          <div className="measure-wide">
            <SectionLabel>Professional programme</SectionLabel>
            <article className="programme-feature">
              <p className="type-micro programme-feature__tier">{flagship.tier}</p>
              <h2 className="type-display-l programme-feature__title">{flagship.name}</h2>
              <p className="type-body-l programme-feature__desc">{flagship.description}</p>
              <p className="type-small" style={{ color: "var(--muted)", marginBottom: "var(--s4)" }}>
                {flagship.fee}
              </p>
              <GoLink href={flagship.href}>Read the full programme</GoLink>
            </article>
          </div>
        </Leaf>
      )}

      <Leaf>
        <div className="measure-wide">
          <SectionLabel>Programmes &amp; subjects</SectionLabel>
          {others.map((item) => (
            <ListingRow
              key={item.slug}
              title={item.name}
              subtitle={item.description}
              provenance={`${item.tier} · ${item.fee}`}
              href={item.href}
            />
          ))}
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure">
          <SectionLabel>How the Academy differs</SectionLabel>
          <ul className="monograph-list">
            <li>Faculty named with ijāza and chain — not anonymous instructors.</li>
            <li>Curriculum sourced module by module; grades stated where claims appear.</li>
            <li>Clinical programmes require supervised hours and assessed competence.</li>
            <li>Certification attests to training completed — not a promise of outcome.</li>
            <li>Essential foundations remain free — a right of the community.</li>
          </ul>
        </div>
      </Leaf>
    </>
  );
}
