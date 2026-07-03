import type { Metadata } from "next";
import { JourneyView } from "@/components/journeys/JourneyView";
import { getJourneyBySlug } from "@/lib/content/journeys";

export const metadata: Metadata = {
  title: "Umrah",
  description: "Educational pilgrimage in which rites are taught through sourced seminars and guided preparation.",
};

export default function UmrahPage() {
  const journey = getJourneyBySlug("umrah");
  if (!journey) return null;
  return <JourneyView journey={journey} />;
}
