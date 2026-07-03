import type { Metadata } from "next";
import { Leaf } from "@/components/ui/Leaf";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata: Metadata = {
  title: "The Founding Charter",
};

export default function CharterPage() {
  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <PageIntro
            section="The Institution"
            folio="i"
            title="The Founding Charter"
            lede="The constitutional text of the institution."
          />
        </div>
      </Leaf>

      <Leaf variant="inset">
        <article className="measure" style={{ margin: "0 auto" }}>
          <p className="type-body-l" style={{ marginBottom: "var(--s5)" }}>
            Sunnah Remedies exists to preserve and transmit the tradition of
            Prophetic Medicine through scholarship, clinical care, education, and
            carefully selected natural therapeutics, with integrity and
            evidence-informed practice.
          </p>

          <hr className="hairline" style={{ margin: "var(--s6) 0" }} />

          <section id="covenant" className="charter-section">
            <h2 className="type-title charter-section__title">The covenant</h2>
            <ul className="type-body charter-list">
              <li>Knowledge before products, service before profit, trust before growth.</li>
              <li>Healing is from Allah; the remedy is a means.</li>
              <li>Nothing is attributed that cannot be traced.</li>
              <li>We do not trade in fear.</li>
              <li>Beauty is an obligation, not an ornament.</li>
              <li>The person precedes the protocol; the human precedes the sale.</li>
              <li>Permanence is protected by restraint.</li>
            </ul>
          </section>

          <section id="authenticity" className="charter-section">
            <h2 className="type-title charter-section__title">On Authenticity</h2>
            <p className="type-body">
              Every claim about the tradition is assigned one of three grades:
              Established, Reported, or Tried. A claim with no traceable source is
              not published. The institution corrects without contempt and cites its
              sources openly.
            </p>
          </section>

          <section id="sources" className="charter-section">
            <h2 className="type-title charter-section__title">Sources</h2>
            <p className="type-body">
              The institution draws upon the Qurʾan, the ṣaḥīḥ collections, the Sunan
              works, and the classical texts of <em>Tibb al-Nabawī</em>, graded and
              cited according to the editorial standard.
            </p>
          </section>
        </article>
      </Leaf>

      <Leaf variant="grave">
        <div className="grave-block">
          <p className="grave-block__line">Built to be inherited</p>
          <p className="grave-block__qualifier">
            The institution is measured not in revenue but in trust.
          </p>
        </div>
      </Leaf>
    </>
  );
}
