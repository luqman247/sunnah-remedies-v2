import type { Metadata } from "next";
import { Leaf } from "@/components/ui/Leaf";
import { PageIntro, SectionLabel } from "@/components/ui/PageIntro";
import { GoLink } from "@/components/ui/Links";
import { Breadcrumb } from "@/components/apothecary/Breadcrumb";

export const metadata: Metadata = {
  title: "Clinical Practice & Ethics",
};

export default function ClinicalEthicsPage() {
  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <Breadcrumb
            items={[
              { label: "The Academy", href: "/the-academy" },
              { label: "Clinical Practice & Ethics" },
            ]}
          />
          <PageIntro
            section="The Academy"
            folio="v"
            title="Clinical Practice & Ethics"
            lede="The responsibilities of the practitioner — limits, consent, and clinical adab."
          >
            <p>
              By application · licensed practitioners and Hijāma graduates. Case-based
              seminars on referral, documentation, consent, and the institution's clinical
              conduct policy. Required for independent clinic privileges under the
              institution's name.
            </p>
          </PageIntro>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <article className="measure" style={{ margin: "0 auto" }}>
          <SectionLabel>Seminar series</SectionLabel>
          <ul className="monograph-list">
            <li>The patient received as a guest — adab in clinical encounter</li>
            <li>Informed consent beyond the form</li>
            <li>Referral pathways and the duty to defer</li>
            <li>Documentation and audit — amāna in the record</li>
            <li>Adverse events — report, review, revise</li>
            <li>Speaking within the evidence — what may and may not be said</li>
          </ul>
          <p className="type-body" style={{ marginTop: "var(--s5)" }}>
            <GoLink href="/the-academy/hijama">The Hijāma Programme</GoLink>
          </p>
          <p className="type-body" style={{ marginTop: "var(--s3)" }}>
            <GoLink href="/consultations">Request a consultation</GoLink>
          </p>
        </article>
      </Leaf>
    </>
  );
}
