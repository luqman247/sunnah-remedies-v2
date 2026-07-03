import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RemedyMonograph } from "@/components/apothecary/RemedyMonograph";
import { getAllRemedySlugs, getRemedyBySlug } from "@/lib/content/remedies";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllRemedySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const remedy = getRemedyBySlug(slug);
  if (!remedy) return { title: "Remedy monograph" };
  return { title: remedy.name };
}

export default async function RemedyPage({ params }: PageProps) {
  const { slug } = await params;
  const remedy = getRemedyBySlug(slug);
  if (!remedy) notFound();

  return <RemedyMonograph remedy={remedy} />;
}
