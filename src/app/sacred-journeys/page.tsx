import type { Metadata } from "next";
import { Leaf } from "@/components/ui/Leaf";
import { RunningHead } from "@/components/ui/Links";
import { ListingRow } from "@/components/ui/Attestation";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Sacred Journeys",
};

const journeys = [
  {
    title: "The Olive Grove Retreat",
    provenance: "Mediterranean · Spring",
    href: "/sacred-journeys/olive-grove",
  },
  {
    title: "The Desert Way",
    provenance: "Arabian Peninsula · Autumn",
    href: "/sacred-journeys/desert-way",
  },
];

export default function SacredJourneysPage() {
  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <RunningHead section="Sacred Journeys" folio="i" />
          <ScrollReveal>
            <h1 className="type-display-l" style={{ margin: "0 0 var(--s4)" }}>
              The few considered journeys
            </h1>
            <p className="type-lede measure" style={{ color: "var(--muted)", fontStyle: "italic", margin: "0 0 var(--s6)" }}>
              A journey, not a holiday. Meaning before logistics.
            </p>
            <p className="type-body-l measure" style={{ marginBottom: "var(--s6)" }}>
              Sacred Journeys embody the lived practice of Prophetic wellbeing.
              Each journey names its meaning, its demands, and its honest reality —
              including cost and difficulty — before any enquiry.
            </p>
          </ScrollReveal>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide">
          <p className="type-eyebrow" style={{ color: "var(--muted)", marginBottom: "var(--s4)" }}>
            Journeys
          </p>
          {journeys.map((journey) => (
            <ListingRow key={journey.href} {...journey} />
          ))}
        </div>
      </Leaf>
    </>
  );
}
