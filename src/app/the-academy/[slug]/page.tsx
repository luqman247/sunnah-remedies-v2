import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgrammeView } from "@/components/academy/ProgrammeView";
import { getProgrammeSlugs, getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getProgrammeSlugs();
  return slugs
    .filter((slug) => slug !== "hijama")
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const programme = await getProgrammeBySlug(slug);
  if (!programme) return { title: "Academy programme" };
  const adapted = programmeToAcademyProgramme(programme);
  return {
    title: adapted.name,
    description: adapted.subtitle,
  };
}

export default async function ProgrammePage({ params }: PageProps) {
  const { slug } = await params;
  const programme = await getProgrammeBySlug(slug);
  if (!programme) notFound();

  return <ProgrammeView programme={programmeToAcademyProgramme(programme)} />;
}
