import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { JourneyView } from "@/components/journeys/JourneyView";
import { getJourneyBySlug } from "@/sanity/lib/fetch";
import { journeyToSacredJourney } from "@/sanity/lib/adapters";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("sacredJourneys.umrah", "/sacred-journeys/umrah");
}

export default async function UmrahPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const journey = await getJourneyBySlug("umrah", locale);
  if (!journey) return null;
  return <JourneyView journey={journeyToSacredJourney(journey)} />;
}
