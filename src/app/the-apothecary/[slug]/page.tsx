import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RemedyMonograph } from "@/components/apothecary/RemedyMonograph";
import { getProductBySlug, getProductSlugs } from "@/sanity/lib/fetch";
import { productToRemedy } from "@/sanity/lib/adapters";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Remedy monograph" };
  return {
    title: product.name,
    description: product.seo?.metaDescription || product.institutionalSummary,
  };
}

export default async function RemedyPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const remedy = productToRemedy(product);
  return <RemedyMonograph remedy={remedy} />;
}
