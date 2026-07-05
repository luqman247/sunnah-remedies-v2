import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { ListingRow } from "@/components/ui/Attestation";
import { SectionPage } from "@/components/ui/SectionPage";
import { SectionLabel } from "@/components/ui/PageIntro";
import { apothecary } from "@/sanity/lib/fetch";
import { ingredients, ingredientLibraryIntro } from "@/lib/content/sections/apothecary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("theApothecary.ingredients", "/the-apothecary/ingredients");
}

export default async function IngredientsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const staticIngredients = ingredients;
  const intro = ingredientLibraryIntro;
  return (
    <SectionPage
      department={apothecary}
      folio="iv"
      title="Ingredient Library"
      lede="Botanical identity is stated before product form"
      currentHref="/the-apothecary/ingredients"
      breadcrumb={[
        { label: "The Apothecary", href: "/the-apothecary" },
        { label: "Ingredient Library" },
      ]}
      intro={<p>{intro}</p>}
    >
      <SectionLabel>Simples within the cabinet</SectionLabel>
      {staticIngredients.map((item) => (
        <ListingRow
          key={item.href}
          title={item.name}
          subtitle={`${item.latin} · ${item.arabic} — ${item.note}`}
          provenance="Monograph available"
          href={item.href}
        />
      ))}
    </SectionPage>
  );
}
