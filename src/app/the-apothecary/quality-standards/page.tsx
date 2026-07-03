// TODO: Migrate to Sanity when section content is published
import type { Metadata } from "next";
import { SectionPage } from "@/components/ui/SectionPage";
import { SectionLabel } from "@/components/ui/PageIntro";
import { apothecary } from "@/sanity/lib/fetch";
import { qualityStandards } from "@/lib/content/sections/apothecary";

export const metadata: Metadata = {
  title: "Quality Standards",
  description: "How the institution selects, stores, and dispenses remedies.",
};

export default function QualityStandardsPage() {
  return (
    <SectionPage
      department={apothecary}
      folio="v"
      title="Quality Standards"
      lede="Traceability is a condition of dispensation."
      currentHref="/the-apothecary/quality-standards"
      breadcrumb={[
        { label: "The Apothecary", href: "/the-apothecary" },
        { label: "Quality Standards" },
      ]}
    >
      {qualityStandards.map((block) => (
        <article key={block.title} className="policy-block">
          <SectionLabel>{block.title}</SectionLabel>
          {block.body.map((p) => (
            <p key={p.slice(0, 48)} className="type-body">{p}</p>
          ))}
        </article>
      ))}
    </SectionPage>
  );
}
