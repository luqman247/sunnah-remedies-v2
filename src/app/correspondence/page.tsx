import type { Metadata } from "next";
import { Leaf } from "@/components/ui/Leaf";
import { RunningHead } from "@/components/ui/Links";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Correspondence",
};

export default function CorrespondencePage() {
  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <RunningHead section="Correspondence" folio="i" />
          <ScrollReveal>
            <h1 className="type-display-l" style={{ margin: "0 0 var(--s4)" }}>
              Write to us
            </h1>
            <p className="type-body-l measure" style={{ marginBottom: "var(--s6)" }}>
              The institution answers correspondence considered, and in time.
              For clinical matters, use Consultations. For scholarship, the Academy.
              For all else, write below.
            </p>
          </ScrollReveal>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure" style={{ margin: "0 auto" }}>
          <p className="type-body">
            <a href="mailto:correspondence@sunnahremedies.org" className="quiet-link">
              correspondence@sunnahremedies.org
            </a>
          </p>

          <section id="practitioners" style={{ marginTop: "var(--s6)" }}>
            <h2 className="type-title" style={{ marginBottom: "var(--s3)" }}>
              For Practitioners
            </h2>
            <p className="type-body">
              Licensed practitioners seeking collaboration or referral may write to{" "}
              <a href="mailto:practitioners@sunnahremedies.org" className="quiet-link">
                practitioners@sunnahremedies.org
              </a>
            </p>
          </section>
        </div>
      </Leaf>
    </>
  );
}
