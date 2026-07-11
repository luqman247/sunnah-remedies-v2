import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { RemedyMonograph } from "@/components/apothecary/RemedyMonograph";
import { getProductSlugs } from "@/sanity/lib/fetch";
import {
  getRemedyForPage,
  resolveRelatedRemedies,
} from "@/lib/apothecary/service";

interface PageProps {
  params: Promise<{ slug: string; locale: AppLocale }>;
  searchParams: Promise<{ previewId?: string }>;
}

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const result = await getRemedyForPage(slug, locale);
  if (!result) return { title: "Remedy monograph" };
  return {
    title: result.isPreview
      ? `${result.remedy.name} (Preview)`
      : result.remedy.name,
    description: result.remedy.institutionalSummary || result.remedy.nature,
    robots: result.isPreview ? { index: false, follow: false } : undefined,
  };
}

export default async function RemedyPage({ params, searchParams }: PageProps) {
  const { slug, locale } = await params;
  const { previewId } = await searchParams;
  setRequestLocale(locale);

  const result = await getRemedyForPage(slug, locale, {
    documentId: previewId,
  });
  if (!result) notFound();

  const related = await resolveRelatedRemedies(result.remedy, locale);
  return <RemedyMonograph remedy={result.remedy} related={related} />;
}
