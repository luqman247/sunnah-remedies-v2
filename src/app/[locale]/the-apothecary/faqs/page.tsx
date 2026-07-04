import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { FaqSection } from "@/components/apothecary/MonographExtras";
import { SectionPage } from "@/components/ui/SectionPage";
import { apothecary, getFaqs } from "@/sanity/lib/fetch";
import { apothecaryFaqs } from "@/lib/content/sections/apothecary";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Questions on dispensation, provenance, and stated limits.",
};

export default async function ApothecaryFaqsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cmsFaqs = await getFaqs("apothecary", locale);
  const faqs =
    cmsFaqs.length > 0
      ? cmsFaqs.map((f) => ({ question: f.question, answer: f.answer }))
      : apothecaryFaqs;

  return (
    <SectionPage
      department={apothecary}
      folio="vii"
      title="Questions"
      lede="Questions on dispensation, provenance, and institutional scope"
      currentHref="/the-apothecary/faqs"
      breadcrumb={[
        { label: "The Apothecary", href: "/the-apothecary" },
        { label: "FAQs" },
      ]}
    >
      <FaqSection items={faqs} />
    </SectionPage>
  );
}
