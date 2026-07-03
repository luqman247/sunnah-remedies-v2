import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JourneyView } from "@/components/journeys/JourneyView";
import { getAllJourneySlugs, getJourneyBySlug } from "@/lib/content/journeys";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllJourneySlugs()
    .filter((slug) => slug !== "umrah")
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const journey = getJourneyBySlug(slug);
  if (!journey) return { title: "Journey programme" };
  return {
    title: journey.name,
    description: journey.subtitle,
  };
}

export default async function JourneyPage({ params }: PageProps) {
  const { slug } = await params;
  const journey = getJourneyBySlug(slug);
  if (!journey) notFound();

  return <JourneyView journey={journey} />;
}
