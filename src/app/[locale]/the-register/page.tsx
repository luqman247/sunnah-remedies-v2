import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { getAllProducts } from "@/sanity/lib/fetch";
import { productToRemedy } from "@/sanity/lib/adapters";
import { RegisterClient } from "./RegisterClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("theRegister", "/the-register");
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const products = await getAllProducts(locale);
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
