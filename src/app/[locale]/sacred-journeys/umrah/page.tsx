import type { Metadata } from "next";
import { JourneyView } from "@/components/journeys/JourneyView";
import { getJourneyBySlug } from "@/sanity/lib/fetch";
import { journeyToSacredJourney } from "@/sanity/lib/adapters";

export const metadata: Metadata = {
  title: "Umrah",
  description: "Educational pilgrimage in which rites are taught through sourced seminars and guided preparation.",
};

export default async function UmrahPage() {
  const journey = await getJourneyBySlug("umrah");
  if (!journey) return null;
  return <JourneyView journey={journeyToSacredJourney(journey)} />;
}
