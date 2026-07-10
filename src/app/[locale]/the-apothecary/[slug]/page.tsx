import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { RemedyMonograph } from "@/components/apothecary/RemedyMonograph";
import { getProductSlugs } from "@/sanity/lib/fetch";
import {
  getPublicRemedyBySlug,
  resolveRelatedRemedies,
} from "@/lib/apothecary/service";

interface PageProps {
  params: Promise<{ slug: string; locale: AppLocale }>;
}

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const remedy = await getPublicRemedyBySlug(slug, locale);
  if (!remedy) return { title: "Remedy monograph" };
  return {
    title: remedy.name,
    description: remedy.institutionalSummary || remedy.nature,
  };
}

export default async function RemedyPage({ params }: PageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const remedy = await getPublicRemedyBySlug(slug, locale);
  if (!remedy) notFound();

  const related = await resolveRelatedRemedies(remedy, locale);
  return <RemedyMonograph remedy={remedy} related={related} />;
}
