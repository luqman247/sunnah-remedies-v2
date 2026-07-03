import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgrammeView } from "@/components/academy/ProgrammeView";
import { getAllProgrammeSlugs, getProgrammeBySlug } from "@/lib/content/academy";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProgrammeSlugs()
    .filter((slug) => slug !== "hijama")
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const programme = getProgrammeBySlug(slug);
  if (!programme) return { title: "Academy programme" };
  return {
    title: programme.name,
    description: programme.subtitle,
  };
}

export default async function ProgrammePage({ params }: PageProps) {
  const { slug } = await params;
  const programme = getProgrammeBySlug(slug);
  if (!programme) notFound();

  return <ProgrammeView programme={programme} />;
}
