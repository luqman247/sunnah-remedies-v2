import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { FaqSection } from "@/components/apothecary/MonographExtras";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

export const metadata: Metadata = {
  title: "Questions",
  description: "Questions on recognition, safety, attendance, and fees.",
};

export default async function AcademyFaqsPage() {
  const programme = await getProgrammeBySlug("hijama-diploma");
  const p = programme ? programmeToAcademyProgramme(programme) : getHijamaDiploma();
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
