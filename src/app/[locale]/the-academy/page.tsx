import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { Leaf } from "@/components/ui/Leaf";
import { DepartmentNav } from "@/components/ui/DepartmentNav";
import { PageIntro } from "@/components/ui/PageIntro";
import { GoLink } from "@/components/ui/Links";
import { SectionLabel } from "@/components/ui/PageIntro";
import { academy } from "@/sanity/lib/fetch";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";
import {
  CinematicHero,
  EditorialPillar,
  PullQuote,
  TrustGridItem,
  InstitutionalDivider,
  EditorialPhoto,
} from "@/components/editorial/Editorial";

export const metadata: Metadata = {
  title: "The Academy",
  description:
    "Clinical education in Prophetic Medicine and the Hijama Diploma — delivered with citation, supervision, and independent assessment.",
};

export default async function AcademyPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const programme = await getProgrammeBySlug("hijama-diploma", locale);
  const diploma = programme ? programmeToAcademyProgramme(programme) : getHijamaDiploma();
  return (
    <>
      <CinematicHero
        src="/photography/academy-learning.jpg"
        alt="Students in a scholarly classroom studying anatomical charts and medical texts under natural light"
        statement="The reading room"
        qualifier="Clinical education in Prophetic Medicine, structured by chain of transmission, faculty qualification, and independent assessment. The teacher is named before the subject"
      />

      <Leaf>
        <div className="measure-wide">
          <PageIntro
            section="The Academy"
            folio="i"
            title="Transmission through study"
            lede="In-person education with citation, supervision, and clear standards"
          >
            <p>
              The Academy transmits <em>Tibb al-Nabawi</em> through close
              reading, citation, and supervised clinical practice. Faculty are
              listed by qualification and <em>isnad</em>. Programmes state
              assessment criteria, fee structure, and clinical hours before
              enrolment opens — never after. Graduates are entered on the
              Register and held to continuing professional standards
            </p>
          </PageIntro>
        </div>
      </Leaf>

      <InstitutionalDivider />

      <Leaf variant="inset">
        <div className="measure-wide">
          <EditorialPillar
            src="/photography/clinical-practice.jpg"
            alt="A clinical practitioner preparing sterile cupping equipment in a professional treatment room"
            caption="Clinical practice — sterile technique and supervised patient care"
          >
            <SectionLabel>Flagship programme</SectionLabel>
            <p className="type-micro" style={{ color: "var(--gilt)" }}>
              {diploma.tier}
            </p>
            <h2 className="type-display-l" style={{ margin: 0 }}>
              {diploma.name}
            </h2>
            <p className="type-body-l">{diploma.subtitle}</p>
            <p
              className="type-small"
              style={{ color: "var(--muted)" }}
            >
              {diploma.fee} · {diploma.nextCohort}
            </p>
            <div>
              <GoLink href="/the-academy/hijama-diploma">
                Read the full programme
              </GoLink>
            </div>
          </EditorialPillar>
        </div>
      </Leaf>

      <Leaf>
        <div className="measure-wide">
          <PullQuote
            text="The teacher is named before the subject. The chain is stated before the curriculum. Assessment criteria are published before enrolment opens"
          />
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide">
          <SectionLabel>What the Academy provides</SectionLabel>
          <div className="trust-grid">
            <TrustGridItem
              numeral="01"
              title="Faculty with isnad"
              text="Every instructor is listed by qualification, chain of transmission, and clinical licence. The teacher is accountable before the student arrives"
            />
            <TrustGridItem
              numeral="02"
              title="Published assessment"
              text="Examination standards, clinical hours, and competency thresholds are stated before enrolment. There are no surprises after commitment"
            />
            <TrustGridItem
              numeral="03"
              title="Supervised clinical hours"
              text="Forty supervised sessions in the flagship Hijama Diploma. Students do not practise independently until assessed and registered"
            />
            <TrustGridItem
              numeral="04"
              title="The Register"
              text="Graduates are entered on the public Register and held to continuing professional standards. The institution stands behind every listed practitioner"
            />
          </div>
        </div>
      </Leaf>

      <Leaf variant="grave">
        <div className="measure grave-block">
          <PullQuote
            text="Held to the standard of scholarship and clinical responsibility"
            dark
          />
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide">
          <DepartmentNav department={academy} />
        </div>
      </Leaf>
    </>
  );
}
