import type { Metadata } from "next";
import { Leaf } from "@/components/ui/Leaf";
import { ListingRow } from "@/components/ui/Attestation";
import { PageIntro, SectionLabel } from "@/components/ui/PageIntro";
import { QuietLink } from "@/components/ui/Links";
import { remedies, formatProvenance } from "@/lib/content/remedies";

export const metadata: Metadata = {
  title: "The Apothecary",
  description:
    "The ordered cabinet of Prophetic Medicine — remedies traced to their source, dispensed with scholarship before measure.",
};

export default function ApothecaryPage() {
  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <PageIntro
            section="The Apothecary"
            folio="i"
            title="The ordered cabinet"
            lede="A historic dispensary — remedies curated, traced, and dispensed in trust."
          >
            <p>
              This is not a shop. It is the material arm of the institution: a cabinet
              of simples and preparations, each with a monograph — historical context,
              Prophetic reference where sound, traditional usage, honest limits, and
              provenance. You are expected to read before you request dispensation.
            </p>
          </PageIntro>
        </div>
      </Leaf>

      <Leaf variant="grave">
        <div className="measure grave-block">
          <p className="grave-block__qualifier" style={{ color: "var(--paper-dim)" }}>
            Knowledge before the measure. The person reaches the fee only after
            tradition, benefit, honest limits, and sourcing. We dispense means — we
            do not sell miracles.
          </p>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide">
          <SectionLabel>The cabinet · {remedies.length} remedies</SectionLabel>
          {remedies.map((remedy) => (
            <ListingRow
              key={remedy.slug}
              title={remedy.name}
              subtitle={`${remedy.transliteration} · ${remedy.botanicalName}`}
              provenance={formatProvenance(remedy)}
              href={`/the-apothecary/${remedy.slug}`}
            />
          ))}
        </div>
      </Leaf>

      <Leaf>
        <div className="measure-wide">
          <div className="measure">
            <SectionLabel>How dispensation works</SectionLabel>
            <ol className="monograph-list">
              <li>Read the monograph in full — every section, including honest limits.</li>
              <li>Add to the counter when you have understood what you request.</li>
              <li>Review your selection, provide correspondence details, and confirm.</li>
              <li>The institution prepares and dispatches — considered, and in time.</li>
            </ol>
          </div>
        </div>
      </Leaf>

      <Leaf>
        <div className="measure">
          <SectionLabel>The counter</SectionLabel>
          <p className="type-body" style={{ marginBottom: "var(--s4)" }}>
            Your selection awaits at the counter. Guest dispensation is honoured — no
            account is required.
          </p>
          <QuietLink href="/the-apothecary/counter">Review the counter</QuietLink>
        </div>
      </Leaf>
    </>
  );
}
