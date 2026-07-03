import type { Metadata } from "next";
import { Leaf } from "@/components/ui/Leaf";
import { PageIntro } from "@/components/ui/PageIntro";
import { QuietLink } from "@/components/ui/Links";

export const metadata: Metadata = {
  title: "Correspondence",
};

export default function CorrespondencePage() {
  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <PageIntro
            section="Correspondence"
            folio="i"
            title="Write to us"
            lede="The institution responds with care and in due course."
          >
            <p>
              For clinical matters, use Consultations. For programme questions,
              use the Academy. For all other matters, write below.
            </p>
          </PageIntro>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure" style={{ margin: "0 auto" }}>
          <p className="type-body">
            <QuietLink href="mailto:correspondence@sunnahremedies.org">
              correspondence@sunnahremedies.org
            </QuietLink>
          </p>

          <section id="practitioners" className="charter-section">
            <h2 className="type-title charter-section__title">Practitioner correspondence</h2>
            <p className="type-body">
              Licensed practitioners seeking collaboration or referral may write to{" "}
              <QuietLink href="mailto:practitioners@sunnahremedies.org">
                practitioners@sunnahremedies.org
              </QuietLink>
            </p>
          </section>
        </div>
      </Leaf>
    </>
  );
}
