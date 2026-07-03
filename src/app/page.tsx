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
            One institution for scholarship, care, and practice
          </p>
          <div className="measure threshold-house__body">
            <p className="type-body-l">
              Sunnah Remedies is the Institute of Prophetic Medicine. We work to
              preserve and transmit <em>Tibb al-Nabawī</em> through scholarship
              with clear citation, therapeutics with traceable provenance, and
              journeys ordered by study.
            </p>
            <p className="type-body">
              The institution is measured in trust, not revenue, and is shaped
              on the <em>waqf</em> model for continuity. Nothing is attributed
              without a traceable source. We offer means and state limits
              plainly.
            </p>
          </div>
        </div>
      </Leaf>

      {specimen && (
        <Leaf variant="inset">
          <div className="measure-wide threshold-specimen">
            <SectionLabel>How the institution speaks</SectionLabel>
            <p className="type-body measure" style={{ marginBottom: "var(--s5)" }}>
              Each claim carries a grade and a source before it is published in
              the institution&apos;s name. The same discipline governs the
              Academy, the Apothecary, and Sacred Journeys.
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
          <SectionLabel>Four departments · one house</SectionLabel>
          <p className="type-body measure threshold-pathway__intro">
            The institution works as one house: study in the Academy and
            Library, dispensation in the Apothecary, and embodied learning on
            Sacred Journeys. Each department opens below.
          </p>

          <DepartmentGateway
            numeral="I"
            name="The Apothecary"
            role="Provision · Hand"
            story="The material arm of the institution: a cabinet of simples and preparations, each documented in a monograph. Reading precedes dispensation."
            catalogueLabel="From the cabinet"
            href="/the-apothecary"
            linkLabel="Visit the Apothecary"
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
            story="The reading room of the tradition, with programmes named by teacher, chain, and assessment standard before enrolment."
            catalogueLabel="Programmes & subjects"
            href="/the-academy"
            linkLabel="Visit the Academy"
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
            story="Educational pilgrimage with meaning before logistics, scholars before schedule, and clear disclosure of difficulty before registration."
            catalogueLabel="Considered departures"
            href="/sacred-journeys"
            linkLabel="Visit Sacred Journeys"
            entries={journeyCatalogue.slice(0, 3).map((j) => ({
              title: j.name,
              subtitle: j.description,
              provenance: `${j.season} · ${j.duration}`,
              href: j.href,
            }))}
          />

          <DepartmentGateway
            numeral="IV"
            name="Knowledge Library"
            role="Open scholarship · Community"
            story="The open shelf for Prophetic Medicine, materia medica, research notes, and patient guides, published with citation and clear boundaries."
            catalogueLabel="Topics on the shelf"
            href="/knowledge-library"
            linkLabel="Visit the Knowledge Library"
            entries={[
              {
                title: "Prophetic Medicine",
                subtitle: "Terms, grades, and method",
                provenance: "Essential",
                href: "/knowledge-library/prophetic-medicine",
              },
              {
                title: "Black Seed",
                subtitle: "Nigella sativa in report and use",
                provenance: "Materia medica",
                href: "/knowledge-library/black-seed",
              },
              {
                title: "Patient Guides",
                subtitle: "Plain guidance before requesting means",
                provenance: "Clinical",
                href: "/knowledge-library/patient-guides",
              },
            ]}
          />
        </div>
      </Leaf>

      <Leaf variant="grave">
        <div className="grave-block">
          <p className="grave-block__line">Knowledge before commerce</p>
          <p className="grave-block__qualifier">
            Healing is from Allah; the remedy is a means. The person precedes
            protocol. Beauty is an obligation. The institution is built to be
            inherited.
          </p>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide">
          <SectionLabel>Beyond the departments</SectionLabel>
          <div className="measure threshold-beyond">
            <p className="type-body-l">
              Consultations are a cross-cutting clinical relationship in which
              the patient is received as a guest and limits are stated plainly.
              The Founding Charter sets out how the institution holds itself.
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
