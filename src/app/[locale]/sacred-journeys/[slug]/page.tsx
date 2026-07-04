import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { JourneyView } from "@/components/journeys/JourneyView";
import { getJourneySlugs, getJourneyBySlug } from "@/sanity/lib/fetch";
import { journeyToSacredJourney } from "@/sanity/lib/adapters";

interface PageProps {
  params: Promise<{ slug: string; locale: AppLocale }>;
}

export async function generateStaticParams() {
  const slugs = await getJourneySlugs();
  return slugs
    .filter((s) => s.slug !== "umrah")
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const journey = await getJourneyBySlug(slug, locale);
  if (!journey) return { title: "Journey programme" };
  const adapted = journeyToSacredJourney(journey);
  return {
    title: adapted.name,
    description: adapted.subtitle,
  };
}

export default async function JourneyPage({ params }: PageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const journey = await getJourneyBySlug(slug, locale);
  if (!journey) notFound();

  return <JourneyView journey={journeyToSacredJourney(journey)} />;
}
