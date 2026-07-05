import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { SectionPage } from "@/components/ui/SectionPage";
import { SectionLabel } from "@/components/ui/PageIntro";
import { apothecary } from "@/sanity/lib/fetch";
import { laboratoryVerification } from "@/lib/content/sections/apothecary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("theApothecary.laboratoryVerification", "/the-apothecary/laboratory-verification");
}

export default async function LaboratoryVerificationPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const verification = laboratoryVerification;
  return (
    <SectionPage
      department={apothecary}
      folio="vi"
      title="Laboratory Verification"
      lede="Laboratory analysis supplements sourcing and does not replace it"
      currentHref="/the-apothecary/laboratory-verification"
      breadcrumb={[
        { label: "The Apothecary", href: "/the-apothecary" },
        { label: "Laboratory Verification" },
      ]}
    >
      {verification.map((block) => (
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
