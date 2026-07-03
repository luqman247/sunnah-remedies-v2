import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JourneyView } from "@/components/journeys/JourneyView";
import { getJourneySlugs, getJourneyBySlug } from "@/sanity/lib/fetch";
import { journeyToSacredJourney } from "@/sanity/lib/adapters";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getJourneySlugs();
  return slugs
    .filter((slug) => slug !== "umrah")
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const journey = await getJourneyBySlug(slug);
  if (!journey) return { title: "Journey programme" };
  const adapted = journeyToSacredJourney(journey);
  return {
    title: adapted.name,
    description: adapted.subtitle,
  };
}

export default async function JourneyPage({ params }: PageProps) {
  const { slug } = await params;
  const journey = await getJourneyBySlug(slug);
  if (!journey) notFound();

  return <JourneyView journey={journeyToSacredJourney(journey)} />;
}
