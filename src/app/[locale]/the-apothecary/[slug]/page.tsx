import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { RemedyMonograph } from "@/components/apothecary/RemedyMonograph";
import { getProductBySlug, getProductSlugs } from "@/sanity/lib/fetch";
import { productToRemedy } from "@/sanity/lib/adapters";

interface PageProps {
  params: Promise<{ slug: string; locale: AppLocale }>;
}

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug, locale);
  if (!product) return { title: "Remedy monograph" };
  return {
    title: product.name,
    description: product.seo?.metaDescription || product.institutionalSummary,
  };
}

export default async function RemedyPage({ params }: PageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const product = await getProductBySlug(slug, locale);
  if (!product) notFound();

  const remedy = productToRemedy(product);
  return <RemedyMonograph remedy={remedy} />;
}
