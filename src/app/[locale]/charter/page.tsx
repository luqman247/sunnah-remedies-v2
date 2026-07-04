import type { Metadata } from "next";
import { Leaf } from "@/components/ui/Leaf";
import { PageIntro } from "@/components/ui/PageIntro";
import {
  CinematicHero,
  PullQuote,
  InstitutionalDivider,
} from "@/components/editorial/Editorial";
import { PortableText } from "@portabletext/react";
import { getCharter } from "@/sanity/lib/fetch";

export const metadata: Metadata = {
  title: "The Founding Charter",
  description:
    "The constitutional text of the institution — seven articles governing how Sunnah Remedies conducts itself.",
};

export default async function CharterPage() {
  const charter = await getCharter() as { body?: any[]; seo?: { metaTitle?: string; metaDescription?: string } } | null;

  return (
    <>
      <CinematicHero
        src="/photography/charter-document.jpg"
        alt="An aged leather-bound charter document with Arabic calligraphy, brass seal, and candlelight"
        statement="The Founding Charter"
        qualifier="The constitutional text of the institution. Seven articles governing how the house conducts itself — decided deliberately and not changed lightly"
      />

      <Leaf>
        <div className="measure-wide">
          <PageIntro
            section="The Institution"
            folio="i"
            title="A covenant, not a mission statement"
          >
            <p>
              Sunnah Remedies exists to preserve and transmit the tradition of
              Prophetic Medicine through scholarship, clinical care, education,
              and carefully selected natural therapeutics, with integrity and
              evidence-informed practice
            </p>
          </PageIntro>
        </div>
      </Leaf>

      <InstitutionalDivider mark="§" />

      {charter?.body && charter.body.length > 0 ? (
        <Leaf>
          <article className="measure" style={{ margin: "0 auto" }}>
            <div className="type-body portable-text-body">
              <PortableText value={charter.body} />
            </div>
          </article>
        </Leaf>
      ) : (
        <>
          <Leaf>
            <article className="measure" style={{ margin: "0 auto" }}>
              <section id="covenant" className="charter-section">
                <PullQuote text="Knowledge before products, service before profit, trust before growth" />
              </section>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--s6)", marginTop: "var(--s6)" }}>
                <p className="type-display-l" style={{ margin: 0, lineHeight: 1.2 }}>
                  Healing is from Allah; the remedy is a means
                </p>
                <p className="type-display-l" style={{ margin: 0, lineHeight: 1.2 }}>
                  Nothing is attributed that cannot be traced
                </p>
                <p className="type-display-l" style={{ margin: 0, lineHeight: 1.2 }}>
                  We do not trade in fear
                </p>
                <p className="type-display-l" style={{ margin: 0, lineHeight: 1.2 }}>
                  Beauty is an obligation, not an ornament
                </p>
                <p className="type-display-l" style={{ margin: 0, lineHeight: 1.2 }}>
                  The person precedes the protocol; the human precedes the sale
                </p>
                <p className="type-display-l" style={{ margin: 0, lineHeight: 1.2 }}>
                  Permanence is protected by restraint
                </p>
              </div>
            </article>
          </Leaf>

          <InstitutionalDivider />

          <Leaf variant="inset">
            <article className="measure" style={{ margin: "0 auto" }}>
              <section id="authenticity" className="charter-section">
                <h2 className="type-title charter-section__title">On Authenticity</h2>
                <p className="type-body">
                  Every claim about the tradition is assigned one of three grades:
                  Established, Reported, or Tried. A claim with no traceable source
                  is not published. The institution corrects without contempt and
                  cites its sources openly
                </p>
              </section>

              <section id="sources" className="charter-section">
                <h2 className="type-title charter-section__title">Sources</h2>
                <p className="type-body">
                  The institution draws upon the Qur&apos;an, the sahih collections,
                  the Sunan works, and the classical texts of{" "}
                  <em>Tibb al-Nabawi</em>, graded and cited according to the
                  editorial standard
                </p>
              </section>
            </article>
          </Leaf>
        </>
      )}

      <Leaf variant="grave">
        <div className="grave-block">
          <p className="grave-block__line">Built to be inherited</p>
        </div>
      </Leaf>
    </>
  );
}
