import type { Metadata } from "next";
import { ThresholdHero } from "@/components/threshold/ThresholdHero";
import { DepartmentGateway } from "@/components/threshold/DepartmentGateway";
import { Leaf } from "@/components/ui/Leaf";
import { Specimen } from "@/components/ui/Attestation";
import { QuietLink } from "@/components/ui/Links";
import { SectionLabel } from "@/components/ui/PageIntro";
import { remedies, formatProvenance } from "@/lib/content/remedies";
import { academyCatalogue } from "@/lib/content/academy";
import { journeyCatalogue } from "@/lib/content/journeys";
import { primaryReference } from "@/lib/content/remedies";

export const metadata: Metadata = {
  title: "The Threshold",
  description:
    "The world's leading institute of Prophetic Medicine — scholarship, clinical care, and natural therapeutics under one house.",
};

export default function ThresholdPage() {
  const specimen = primaryReference(remedies[0]);

  return (
    <>
      <ThresholdHero />

      <Leaf>
        <div className="measure-wide">
          <SectionLabel>The house · Est. MMXXV</SectionLabel>
          <p className="type-display-l threshold-house__title">
            One institution — not a shop, a course platform, or a travel agency
          </p>
          <div className="measure threshold-house__body">
            <p className="type-body-l">
              Sunnah Remedies is the Institute of Prophetic Medicine. We exist
              to revive, preserve, and advance <em>Tibb al-Nabawī</em> through
              scholarship that cites its sources, therapeutics traced to their
              provenance, and journeys that embody what the texts teach.
            </p>
            <p className="type-body">
              The institution is measured not in revenue but in trust — built on
              the <em>waqf</em> model to be inherited whole. Nothing is
              attributed that cannot be traced. We offer means, and never sell a
              miracle.
            </p>
          </div>
        </div>
      </Leaf>

      {specimen && (
        <Leaf variant="inset">
          <div className="measure-wide threshold-specimen">
            <SectionLabel>How the institution speaks</SectionLabel>
            <p className="type-body measure" style={{ marginBottom: "var(--s5)" }}>
              Every claim carries a grade and a source before it enters the
              institution&apos;s name. This is the apparatus — the same discipline
              applied in the Academy, the Apothecary, and on every journey.
            </p>
            <Specimen
              statement={specimen.statement}
              transliteration={specimen.transliteration}
              grade={specimen.grade}
              source={specimen.source}
              standing={specimen.standing}
            />
          </div>
        </Leaf>
      )}

      <Leaf>
        <div className="measure-wide">
          <SectionLabel>Three departments · one house</SectionLabel>
          <p className="type-body measure threshold-pathway__intro">
            The mission moves in one direction: knowledge in the Academy, means in
            the Apothecary, embodiment on Sacred Journeys. Each department opens
            here — with a sentence of purpose and a glimpse of what awaits inside.
          </p>

          <DepartmentGateway
            numeral="I"
            name="The Apothecary"
            role="Provision · Hand"
            story="The material arm of the institution — a cabinet of simples and preparations, each with a monograph. You are expected to read before you request dispensation."
            catalogueLabel="From the cabinet"
            href="/the-apothecary"
            linkLabel="Enter the Apothecary"
            entries={remedies.slice(0, 3).map((r) => ({
              title: r.name,
              subtitle: `${r.transliteration} · ${r.botanicalName}`,
              provenance: formatProvenance(r),
              href: `/the-apothecary/${r.slug}`,
            }))}
          />

          <DepartmentGateway
            numeral="II"
            name="The Academy"
            role="Transmission · Mind"
            story="The reading room of the tradition — programmes named by teacher, chain, and assessment standard before enrolment. Held to scholarship, never the standard of the marketplace."
            catalogueLabel="Programmes & subjects"
            href="/the-academy"
            linkLabel="Begin in the Academy"
            entries={academyCatalogue.slice(0, 3).map((p) => ({
              title: p.name,
              subtitle: p.description,
              provenance: `${p.tier} · ${p.fee}`,
              href: p.href,
            }))}
          />

          <DepartmentGateway
            numeral="III"
            name="Sacred Journeys"
            role="Embodiment · Soul"
            story="Educational pilgrimage — meaning before logistics, scholars before schedule, honest difficulty before registration. A journey, not a holiday."
            catalogueLabel="Considered departures"
            href="/sacred-journeys"
            linkLabel="Read on Sacred Journeys"
            entries={journeyCatalogue.map((j) => ({
              title: j.name,
              subtitle: j.description,
              provenance: `${j.season} · ${j.duration}`,
              href: j.href,
            }))}
          />
        </div>
      </Leaf>

      <Leaf variant="grave">
        <div className="grave-block">
          <p className="grave-block__line">Knowledge before commerce</p>
          <p className="grave-block__qualifier">
            Healing is from Allah; the remedy is a means. We do not trade in fear.
            Beauty is an obligation. The person precedes the protocol. Built to be
            inherited.
          </p>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide">
          <SectionLabel>Beyond the three departments</SectionLabel>
          <div className="measure threshold-beyond">
            <p className="type-body-l">
              Consultations are a cross-cutting clinical relationship — the patient
              received as a guest, with limits stated up front. The Founding Charter
              is the constitution, readable by anyone who wishes to know how the
              institution holds itself.
            </p>
            <p className="type-body">
              <QuietLink href="/consultations">Request a consultation</QuietLink>
            </p>
            <p className="type-body" style={{ marginTop: "var(--s3)" }}>
              <QuietLink href="/charter">Read the Founding Charter</QuietLink>
            </p>
          </div>
        </div>
      </Leaf>
    </>
  );
}
