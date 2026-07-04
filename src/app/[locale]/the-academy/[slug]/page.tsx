import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { ProgrammeView } from "@/components/academy/ProgrammeView";
import { getProgrammeSlugs, getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

interface PageProps {
  params: Promise<{ slug: string; locale: AppLocale }>;
}

export async function generateStaticParams() {
  const slugs = await getProgrammeSlugs();
  return slugs
    .filter((s) => s.slug !== "hijama")
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const programme = await getProgrammeBySlug(slug, locale);
  if (!programme) return { title: "Academy programme" };
  const adapted = programmeToAcademyProgramme(programme);
  return {
    title: adapted.name,
    description: adapted.subtitle,
  };
}

export default async function ProgrammePage({ params }: PageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const programme = await getProgrammeBySlug(slug, locale);
  if (!programme) notFound();

  return <ProgrammeView programme={programmeToAcademyProgramme(programme)} />;
}
