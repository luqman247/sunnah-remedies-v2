// TODO: Migrate to Sanity when section content is published
import type { Metadata } from "next";
import { FaqSection } from "@/components/apothecary/MonographExtras";
import { SectionPage } from "@/components/ui/SectionPage";
import { apothecary } from "@/sanity/lib/fetch";
import { apothecaryFaqs } from "@/lib/content/sections/apothecary";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Questions on dispensation, provenance, and stated limits.",
};

export default function ApothecaryFaqsPage() {
  return (
    <SectionPage
      department={apothecary}
      folio="vii"
      title="Questions"
      lede="Questions on dispensation, provenance, and institutional scope."
      currentHref="/the-apothecary/faqs"
      breadcrumb={[
        { label: "The Apothecary", href: "/the-apothecary" },
        { label: "FAQs" },
      ]}
    >
      <FaqSection items={apothecaryFaqs} />
    </SectionPage>
  );
}
