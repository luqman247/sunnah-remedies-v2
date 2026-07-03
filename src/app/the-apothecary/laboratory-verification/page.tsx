// TODO: Migrate to Sanity when section content is published
import type { Metadata } from "next";
import { SectionPage } from "@/components/ui/SectionPage";
import { SectionLabel } from "@/components/ui/PageIntro";
import { apothecary } from "@/sanity/lib/fetch";
import { laboratoryVerification } from "@/lib/content/sections/apothecary";

export const metadata: Metadata = {
  title: "Laboratory Verification",
  description: "Independent analysis with batch records and certificates.",
};

export default function LaboratoryVerificationPage() {
  return (
    <SectionPage
      department={apothecary}
      folio="vi"
      title="Laboratory Verification"
      lede="Laboratory analysis supplements sourcing and does not replace it."
      currentHref="/the-apothecary/laboratory-verification"
      breadcrumb={[
        { label: "The Apothecary", href: "/the-apothecary" },
        { label: "Laboratory Verification" },
      ]}
    >
      {laboratoryVerification.map((block) => (
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
