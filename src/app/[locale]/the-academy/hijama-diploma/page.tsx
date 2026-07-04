import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { ProgrammeView } from "@/components/academy/ProgrammeView";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const programme = await getProgrammeBySlug("hijama-diploma", locale);
  const diploma = programme ? programmeToAcademyProgramme(programme) : getHijamaDiploma();
  return {
    title: "Hijāma Diploma",
    description: diploma.subtitle,
  };
}

export default async function HijamaDiplomaPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const programme = await getProgrammeBySlug("hijama-diploma", locale);
  const diploma = programme ? programmeToAcademyProgramme(programme) : getHijamaDiploma();
  return <ProgrammeView programme={diploma} />;
}
