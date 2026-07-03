import type { Metadata } from "next";
import { Leaf } from "@/components/ui/Leaf";
import { RunningHead } from "@/components/ui/Links";
import { ListingRow } from "@/components/ui/Attestation";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "The Apothecary",
};

const remedies = [
  {
    title: "Black Seed Oil",
    provenance: "Established · Ṣaḥīḥ al-Bukhārī · Kitāb al-Ṭibb",
    href: "/the-apothecary/black-seed-oil",
  },
  {
    title: "Senna",
    provenance: "Reported · Sunan Abī Dāwūd · Kitāb al-Ṭibb",
    href: "/the-apothecary/senna",
  },
  {
    title: "Honey",
    provenance: "Established · Qurʾan · Sūrat al-Naḥl",
    href: "/the-apothecary/honey",
  },
  {
    title: "Olive Oil",
    provenance: "Established · Ṣaḥīḥ al-Bukhārī · Kitāb al-Ṭibb",
    href: "/the-apothecary/olive-oil",
  },
];

export default function ApothecaryPage() {
  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <RunningHead section="The Apothecary" folio="i" />
          <ScrollReveal>
            <h1 className="type-display-l" style={{ margin: "0 0 var(--s4)" }}>
              The ordered cabinet
            </h1>
            <p className="type-lede measure" style={{ color: "var(--muted)", fontStyle: "italic", margin: "0 0 var(--s6)" }}>
              Remedies, traced to their source. Sourced, graded, and offered in trust.
            </p>
            <p className="type-body-l measure" style={{ marginBottom: "var(--s6)" }}>
              Each remedy in this cabinet carries its provenance before you open it.
              We describe what the tradition associates with each means, state honest
              limits, and offer nothing that cannot be traced.
            </p>
          </ScrollReveal>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide">
          <p className="type-eyebrow" style={{ color: "var(--muted)", marginBottom: "var(--s4)" }}>
            The cabinet
          </p>
          {remedies.map((remedy) => (
            <ListingRow key={remedy.href} {...remedy} />
          ))}
        </div>
      </Leaf>
    </>
  );
}
