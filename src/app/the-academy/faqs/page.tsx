import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { FaqSection } from "@/components/apothecary/MonographExtras";
import { getHijamaDiploma } from "@/lib/content/academy";

const p = getHijamaDiploma();

export const metadata: Metadata = {
  title: "Questions",
  description: "Questions on recognition, safety, attendance, and fees.",
};

export default function AcademyFaqsPage() {
  return (
    <AcademySectionPage
      folio="xiv"
      title="Questions"
      lede="Concise answers on policy, safety, and standards."
      currentHref="/the-academy/faqs"
      breadcrumbLabel="Questions"
    >
      <FaqSection items={p.faq} />
    </AcademySectionPage>
  );
}
