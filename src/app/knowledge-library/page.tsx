import type { Metadata } from "next";
import { Leaf } from "@/components/ui/Leaf";
import { DepartmentNav } from "@/components/ui/DepartmentNav";
import { PageIntro } from "@/components/ui/PageIntro";
import { GoLink } from "@/components/ui/Links";
import { SectionLabel } from "@/components/ui/PageIntro";
import { knowledgeLibrary } from "@/sanity/lib/fetch";
import {
  CinematicHero,
  EditorialFeature,
  PullQuote,
  InstitutionalDivider,
} from "@/components/editorial/Editorial";

export const metadata: Metadata = {
  title: "Knowledge Library",
  description:
    "Prophetic Medicine, materia medica, research, and patient guidance published as open scholarship with citation and clear limits.",
};

export default function KnowledgeLibraryPage() {
  return (
    <>
      <CinematicHero
        src="/photography/black-seed-editorial.jpg"
        alt="A scholar's research desk with botanical journal, pressed specimens, black seeds in a ceramic dish, and amber oil"
        statement="The open shelf"
        qualifier="Institutional notes on Prophetic Medicine, materia medica, and clinical guidance — published with citation, grading, and clear limits. Knowledge before commerce."
      />

      <Leaf>
        <div className="measure-wide">
          <PageIntro
            section="Knowledge Library"
            folio="i"
            title="A publishing programme, not a blog"
            lede="Knowledge before commerce — a right of the community."
          >
            <p>
              The Knowledge Library publishes the institution&apos;s research,
              commentary, and patient guidance as open scholarship. Each article
              states its standing, cites primary sources, names its author, and
              links to related monographs and Academy lessons where available.
              We share what we know, name what we do not, and invite correction.
            </p>
          </PageIntro>
        </div>
      </Leaf>

      <InstitutionalDivider />

      <Leaf>
        <div className="measure-wide">
          <SectionLabel>Featured publications</SectionLabel>

          <EditorialFeature
            src="/photography/institution-hero.jpg"
            alt="Scholarly hands examining an illuminated manuscript of Prophetic medicine beside glass vessels of amber oil"
          >
            <p className="type-eyebrow" style={{ color: "var(--gilt)" }}>
              Essential reading
            </p>
            <h3 className="type-title" style={{ margin: 0 }}>
              Prophetic Medicine
            </h3>
            <p className="type-body">
              A foundational guide to <em>Tibb al-Nabawi</em>: its sources,
              methodology, scholarly grades, and the institution&apos;s
              approach to transmitting it responsibly. Terms are defined.
              Limits are stated. The difference between revelation, tradition,
              and cultural practice is made plain.
            </p>
            <div>
              <GoLink href="/knowledge-library/prophetic-medicine">
                Read the article
              </GoLink>
            </div>
          </EditorialFeature>

          <EditorialFeature
            src="/photography/honey-editorial.jpg"
            alt="Golden honey in a glass vessel beside dried herbs"
            reverse
          >
            <p className="type-eyebrow" style={{ color: "var(--gilt)" }}>
              Materia medica
            </p>
            <h3 className="type-title" style={{ margin: 0 }}>
              Black Seed
            </h3>
            <p className="type-body">
              <em>Nigella sativa</em> in report and use — the hadith, the
              classical commentary, the contemporary research, and the
              institution&apos;s position. What the evidence supports, what
              it does not, and where honest uncertainty remains.
            </p>
            <div>
              <GoLink href="/knowledge-library/black-seed">
                Read the article
              </GoLink>
            </div>
          </EditorialFeature>
        </div>
      </Leaf>

      <Leaf variant="grave">
        <div className="measure grave-block">
          <PullQuote
            text="Nothing is attributed without traceable evidence. Means, not miracle."
            dark
          />
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide">
          <DepartmentNav department={knowledgeLibrary} />
        </div>
      </Leaf>
    </>
  );
}
