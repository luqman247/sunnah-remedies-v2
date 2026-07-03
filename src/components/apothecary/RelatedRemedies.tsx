import Link from "next/link";
import type { Remedy } from "@/lib/content/types";
import { formatProvenance } from "@/lib/content/remedies";
import { SectionLabel } from "@/components/ui/PageIntro";

interface RelatedRemediesProps {
  remedies: Remedy[];
}

export function RelatedRemedies({ remedies }: RelatedRemediesProps) {
  if (remedies.length === 0) return null;

  return (
    <section id="related-remedies" className="monograph-section" aria-labelledby="related-remedies-heading">
      <SectionLabel>Related remedies</SectionLabel>
      <h2 id="related-remedies-heading" className="sr-only">
        Related remedy monographs
      </h2>
      {remedies.map((r) => (
        <Link key={r.slug} href={`/the-apothecary/${r.slug}`} className="ruled-row">
          <span>
            <span className="type-title ruled-row__title">{r.name}</span>
            <span className="type-small" style={{ display: "block", color: "var(--muted)", marginTop: "var(--s1)" }}>
              {r.transliteration}
            </span>
          </span>
          <span className="type-micro ruled-row__provenance">{formatProvenance(r)}</span>
        </Link>
      ))}
    </section>
  );
}
