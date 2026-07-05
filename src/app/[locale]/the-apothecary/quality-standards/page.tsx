import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { SectionPage } from "@/components/ui/SectionPage";
import { SectionLabel } from "@/components/ui/PageIntro";
import { apothecary } from "@/sanity/lib/fetch";
import { qualityStandards } from "@/lib/content/sections/apothecary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("theApothecary.qualityStandards", "/the-apothecary/quality-standards");
}

export default async function QualityStandardsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const standards = qualityStandards;
  return (
    <SectionPage
      department={apothecary}
      folio="v"
      title="Quality Standards"
      lede="Traceability is a condition of dispensation"
      currentHref="/the-apothecary/quality-standards"
      breadcrumb={[
        { label: "The Apothecary", href: "/the-apothecary" },
        { label: "Quality Standards" },
      ]}
    >
      {standards.map((block) => (
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
