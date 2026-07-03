import type { Metadata } from "next";
import { Leaf } from "@/components/ui/Leaf";
import { RunningHead, SolidAction } from "@/components/ui/Links";
import { Specimen, SourceMark } from "@/components/ui/Attestation";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Black Seed Oil",
};

export default function BlackSeedMonographPage() {
  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <RunningHead section="The Apothecary" folio="ii" />
          <ScrollReveal>
            <p className="type-eyebrow" style={{ color: "var(--muted)", marginBottom: "var(--s3)" }}>
              The Apothecary / Black Seed Oil
            </p>
            <h1 className="type-display-l" style={{ margin: "0 0 var(--s2)" }}>
              Black Seed Oil
            </h1>
            <p className="type-body" style={{ fontStyle: "italic", color: "var(--muted)", margin: "0 0 var(--s5)" }}>
              <em>al-ḥabba al-sawdāʾ</em> · <em>Nigella sativa</em>
            </p>
            <p className="type-body-l measure" style={{ marginBottom: "var(--s6)" }}>
              A cold-pressed oil from the seeds of <em>Nigella sativa</em>, traditionally
              taken as a means within the Prophetic tradition.
            </p>
          </ScrollReveal>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide" style={{ display: "grid", gap: "var(--s6)", gridTemplateColumns: "1fr" }}>
          <div className="measure">
            <h2 className="type-title" style={{ marginBottom: "var(--s4)" }}>Basis</h2>
            <p className="type-body-l">
              The Prophet ﷺ said: &ldquo;In black seed is healing for every disease,
              except death.&rdquo;
              <SourceMark siglum="B1" source="Established · Ṣaḥīḥ al-Bukhārī · Kitāb al-Ṭibb" />
            </p>

            <h2 className="type-title" style={{ margin: "var(--s6) 0 var(--s4)" }}>Known uses</h2>
            <p className="type-body">
              Traditionally taken for general wellbeing. Within the evidence, used
              as a dietary supplement. The tradition associates it with support for
              respiratory and digestive comfort.
            </p>

            <h2 className="type-title" style={{ margin: "var(--s6) 0 var(--s4)" }}>Honest limits</h2>
            <p className="type-body">
              It is a means, not a cure. A remedy is not a substitute for a physician.
              Not advised in pregnancy without consultation. Store in a cool, dark place.
            </p>

            <h2 className="type-title" style={{ margin: "var(--s6) 0 var(--s4)" }}>Preparation &amp; source</h2>
            <p className="type-body">
              Cold-pressed from Ethiopian <em>Nigella sativa</em> seeds. Origin:
              Harar highlands. Bottled at source.
            </p>

            <div
              style={{
                marginTop: "var(--s6)",
                paddingTop: "var(--s5)",
                borderTop: "1px solid var(--rule)",
              }}
            >
              <p className="type-title" style={{ marginBottom: "var(--s2)" }}>
                £24
              </p>
              <p className="type-small" style={{ color: "var(--muted)", marginBottom: "var(--s4)" }}>
                100ml · incl. delivery within the United Kingdom
              </p>
              <SolidAction href="/the-apothecary/black-seed-oil/counter">
                Add to the counter
              </SolidAction>
            </div>
          </div>

          <Specimen
            statement="In black seed is healing for every disease, except death."
            transliteration="fī al-ḥabbati al-sawdāʾi shifāʾun min kulli dāʾin illā al-sam"
            grade="Established"
            source="Ṣaḥīḥ al-Bukhārī · Kitāb al-Ṭibb"
            standing="Canonical narration"
          />
        </div>
      </Leaf>

      <Leaf>
        <div className="measure">
          <p className="type-eyebrow" style={{ color: "var(--muted)", marginBottom: "var(--s3)" }}>
            See also
          </p>
          <p className="type-body">
            Taught in the Academy → Foundations of Prophetic Medicine · Used on the
            Olive Grove retreat →
          </p>
        </div>
      </Leaf>
    </>
  );
}
