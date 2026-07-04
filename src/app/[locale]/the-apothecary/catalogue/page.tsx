import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { ListingRow } from "@/components/ui/Attestation";
import { SectionPage } from "@/components/ui/SectionPage";
import { QuietLink } from "@/components/ui/Links";
import { SectionLabel } from "@/components/ui/PageIntro";
import { apothecary } from "@/sanity/lib/fetch";
import { getAllProducts } from "@/sanity/lib/fetch";
import { productToRemedy } from "@/sanity/lib/adapters";
import { formatProvenance } from "@/lib/content/remedies";

export const metadata: Metadata = {
  title: "Product Catalogue",
  description: "The ordered cabinet with remedies traced to source.",
};

export default async function CataloguePage({
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
      folio="ii"
      title="Product Catalogue"
      lede="Each entry states provenance before the monograph"
      currentHref="/the-apothecary/catalogue"
      breadcrumb={[
        { label: "The Apothecary", href: "/the-apothecary" },
        { label: "Product Catalogue" },
      ]}
      intro={
        <p>
          Each entry opens a monograph: a scholarly record with provenance,
          graded references, and stated limits. The catalogue indexes records
          for reading before dispensation
        </p>
      }
    >
      <SectionLabel>The cabinet · {remedies.length} remedies</SectionLabel>
      {remedies.map((remedy) => (
        <ListingRow
          key={remedy.slug}
          title={remedy.name}
          subtitle={`${remedy.transliteration} · ${remedy.botanicalName}`}
          provenance={formatProvenance(remedy)}
          href={`/the-apothecary/${remedy.slug}`}
        />
      ))}
      <p className="type-body" style={{ marginTop: "var(--s5)" }}>
        <QuietLink href="/the-apothecary/counter">Proceed to the counter</QuietLink>
      </p>
    </SectionPage>
  );
}
