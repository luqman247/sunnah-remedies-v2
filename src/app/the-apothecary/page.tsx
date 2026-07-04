import type { Metadata } from "next";
import { Leaf } from "@/components/ui/Leaf";
import { DepartmentNav } from "@/components/ui/DepartmentNav";
import { PageIntro } from "@/components/ui/PageIntro";
import { GoLink } from "@/components/ui/Links";
import { apothecary, getAllProducts } from "@/sanity/lib/fetch";
import {
  CinematicHero,
  EditorialFeature,
  PullQuote,
  InstitutionalDivider,
} from "@/components/editorial/Editorial";

export const metadata: Metadata = {
  title: "The Apothecary",
  description:
    "A dispensary where each remedy carries a monograph: historical context, Prophetic reference, traditional use, stated limits, and provenance.",
};

export default async function ApothecaryPage() {
  const products = await getAllProducts();
  return (
    <>
      <CinematicHero
        src="/photography/apothecary-hero.jpg"
        alt="An apothecary dispensary: amber glass vessels of honey and oils arranged on aged wooden shelving beside dried medicinal herbs and a stone mortar"
        statement="The ordered cabinet"
        qualifier="A dispensary where each remedy carries a monograph — historical context, Prophetic reference where sound, traditional use, stated limits, and provenance. Reading precedes dispensation"
      />

      <Leaf>
        <div className="measure-wide">
          <PageIntro
            section="The Apothecary"
            folio="i"
            title="Provision by hand"
            lede="The material arm of the institute — a cabinet of simples and preparations, each documented to source"
          >
            <p>
              This is not a shop. It is a dispensary governed by the same
              principles of scholarship that govern the Academy and the Library
              Every remedy is documented in a monograph before it is offered:
              origin, harvest, laboratory analysis, Prophetic reference with
              grade, traditional scholarly commentary, contraindications, and
              clear limits. We dispense means and state what we do not know with
              the same care as what we do
            </p>
          </PageIntro>
        </div>
      </Leaf>

      <InstitutionalDivider />

      <Leaf>
        <div className="measure-wide">
          <EditorialFeature
            src="/photography/honey-editorial.jpg"
            alt="Golden honey being poured from a wooden dipper into a glass vessel, beside dried thyme and a handwritten provenance label"
          >
            <p className="type-eyebrow" style={{ color: "var(--gilt)" }}>
              From the cabinet
            </p>
            <h3 className="type-title" style={{ margin: 0 }}>
              Raw Sidr Honey
            </h3>
            <p className="type-body">
              Single-origin <em>Ziziphus spina-christi</em> honey from the
              Hadhrami highlands. Each batch is laboratory-verified and
              documented in a monograph that states origin, harvest, analysis,
              and scholarly basis
            </p>
            <div>
              <GoLink href="/the-apothecary/honey">Read the monograph</GoLink>
            </div>
          </EditorialFeature>

          <EditorialFeature
            src="/photography/black-seed-editorial.jpg"
            alt="A scholar's research desk with botanical journal on Nigella sativa, pressed specimens, and black seeds"
            reverse
          >
            <p className="type-eyebrow" style={{ color: "var(--gilt)" }}>
              From the cabinet
            </p>
            <h3 className="type-title" style={{ margin: 0 }}>
              Cold-Pressed Black Seed Oil
            </h3>
            <p className="type-body">
              <em>Nigella sativa</em> oil, cold-pressed from Ethiopian seeds.
              Independently analysed for thymoquinone content. The monograph
              records the full scholarly basis and states limits plainly
            </p>
            <div>
              <GoLink href="/the-apothecary/black-seed-oil">
                Read the monograph
              </GoLink>
            </div>
          </EditorialFeature>

          <EditorialFeature
            src="/photography/olive-oil-editorial.jpg"
            alt="Premium olive oil in a glass cruet beside ripe olives and olive leaves on weathered wood"
          >
            <p className="type-eyebrow" style={{ color: "var(--gilt)" }}>
              From the cabinet
            </p>
            <h3 className="type-title" style={{ margin: 0 }}>
              Extra Virgin Olive Oil
            </h3>
            <p className="type-body">
              Palestinian extra virgin olive oil from ancestral groves.
              Mentioned in the Qur&apos;an as &ldquo;a blessed tree&rdquo;
              and documented extensively in classical scholarship. Cold-pressed,
              laboratory-verified, traceable to grove
            </p>
            <div>
              <GoLink href="/the-apothecary/olive-oil">
                Read the monograph
              </GoLink>
            </div>
          </EditorialFeature>
        </div>
      </Leaf>

      <Leaf variant="grave">
        <div className="measure grave-block">
          <PullQuote
            text="Knowledge before measure. We dispense means and state limits plainly"
            dark
          />
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide">
          <DepartmentNav department={apothecary} />
        </div>
      </Leaf>
    </>
  );
}
