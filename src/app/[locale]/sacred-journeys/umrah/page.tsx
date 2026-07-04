import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { JourneyView } from "@/components/journeys/JourneyView";
import { getJourneyBySlug } from "@/sanity/lib/fetch";
import { journeyToSacredJourney } from "@/sanity/lib/adapters";

export const metadata: Metadata = {
  title: "Umrah",
  description: "Educational pilgrimage in which rites are taught through sourced seminars and guided preparation.",
};

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
