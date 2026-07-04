import type { Metadata } from "next";
import { ListingRow } from "@/components/ui/Attestation";
import { SectionPage } from "@/components/ui/SectionPage";
import { SectionLabel } from "@/components/ui/PageIntro";
import { apothecary } from "@/sanity/lib/fetch";
import { ingredients, ingredientLibraryIntro } from "@/lib/content/sections/apothecary";

export const metadata: Metadata = {
  title: "Ingredient Library",
  description: "Simples and preparations with botanical identity and traditional standing.",
};

export default async function IngredientsPage() {
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
