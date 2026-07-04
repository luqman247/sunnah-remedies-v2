import type { Metadata } from "next";
import { getAllProducts } from "@/sanity/lib/fetch";
import { productToRemedy } from "@/sanity/lib/adapters";
import { RegisterClient } from "./RegisterClient";

export const metadata: Metadata = {
  title: "The Register",
  description: "Texts, remedies, and sources indexed by grade and department.",
};

export default async function RegisterPage() {
  const products = await getAllProducts();
  const remedies = products.map(productToRemedy);

  const corpus = [
    ...remedies.map((r) => {
      const ref = r.propheticReferences[0];
      return {
        title: `${r.name} — ${r.transliteration}`,
        provenance: `Apothecary · ${ref?.grade ?? "Classical"}`,
        href: `/the-apothecary/${r.slug}`,
        subtitle: r.nature,
      };
    }),
    {
      title: "Foundations of Prophetic Medicine",
      provenance: "Academy · Essential",
      href: "/the-academy/foundations",
      subtitle: "Essential terms and texts in Tibb al-Nabawī.",
    },
    {
      title: "Ṣaḥīḥ al-Bukhārī — Kitāb al-Ṭibb",
      provenance: "Source · Canonical",
      href: "/the-academy/materia-medica",
      subtitle: "The medicine chapter in the canonical collection.",
    },
  ];

  return <RegisterClient corpus={corpus} />;
}
