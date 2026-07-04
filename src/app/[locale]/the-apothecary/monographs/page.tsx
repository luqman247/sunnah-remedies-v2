import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { ListingRow } from "@/components/ui/Attestation";
import { SectionPage } from "@/components/ui/SectionPage";
import { SectionLabel } from "@/components/ui/PageIntro";
import { apothecary } from "@/sanity/lib/fetch";
import { getAllProducts } from "@/sanity/lib/fetch";
import { productToRemedy } from "@/sanity/lib/adapters";
import { formatProvenance } from "@/lib/content/remedies";

export const metadata: Metadata = {
  title: "Product Monographs",
  description: "Scholarly remedy records with source before price and limits before measure.",
};

export default async function MonographsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const products = await getAllProducts(locale);
  const remedies = products.map(productToRemedy);

  return (
    <SectionPage
      department={apothecary}
      folio="iii"
      title="Product Monographs"
      lede="Each remedy is presented as a scholarly record"
      currentHref="/the-apothecary/monographs"
      breadcrumb={[
        { label: "The Apothecary", href: "/the-apothecary" },
        { label: "Product Monographs" },
      ]}
      intro={
        <p>
          Monographs include historical context, graded Prophetic references,
          traditional usage, evidence-informed notes, stated limits, and
          dispensation details
        </p>
      }
    >
      <SectionLabel>Monographs · {remedies.length} published</SectionLabel>
      {remedies.map((remedy) => (
        <ListingRow
          key={remedy.slug}
          title={remedy.name}
          subtitle={remedy.nature.slice(0, 120) + "…"}
          provenance={formatProvenance(remedy)}
          href={`/the-apothecary/${remedy.slug}`}
        />
      ))}
    </SectionPage>
  );
}
