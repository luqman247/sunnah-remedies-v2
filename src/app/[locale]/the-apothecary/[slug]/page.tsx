import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
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

/**
 * Allow unknown slugs (so missing / hidden products can 404) while still
 * prebuilding known public catalogue entries via generateStaticParams.
 */
export const dynamicParams = true;

/** Per-request evaluation so Draft Mode is never served from a stale static shell. */
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const { previewId } = await searchParams;
  const result = await getRemedyForPage(slug, locale, {
    documentId: previewId,
  });
  if (!result) {
    return { title: "Remedy monograph", robots: { index: false, follow: false } };
  }
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

  // Touch Draft Mode so the request is never treated as a static public shell
  // when an editor is previewing.
  await draftMode();

  const result = await getRemedyForPage(slug, locale, {
    documentId: previewId,
  });
  if (!result) notFound();

  const related = await resolveRelatedRemedies(result.remedy, locale);
  return <RemedyMonograph remedy={result.remedy} related={related} />;
}
