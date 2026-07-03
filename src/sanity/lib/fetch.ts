import { client } from "./client";
import {
  homepageQuery,
  navigationQuery,
  footerQuery,
  allProductsQuery,
  productBySlugQuery,
  allProgrammesQuery,
  programmeBySlugQuery,
  allJourneysQuery,
  journeyBySlugQuery,
  allArticlesQuery,
  articleBySlugQuery,
  allFacultyQuery,
  testimonialsByDepartmentQuery,
  faqsByDepartmentQuery,
  consultationsPageQuery,
  charterQuery,
  globalSeoQuery,
} from "./queries";
import type {
  HomepageData,
  Navigation,
  FooterSettings,
  Product,
  Programme,
  Journey,
  Article,
  Faculty,
  Testimonial,
  FaqItem,
} from "./types";

/* ── Global ─────────────────────────────────────────────────────── */

export async function getNavigation(): Promise<Navigation | null> {
  return client.fetch(navigationQuery);
}

export async function getFooter(): Promise<FooterSettings | null> {
  return client.fetch(footerQuery);
}

export async function getGlobalSeo() {
  return client.fetch(globalSeoQuery);
}

/* ── Homepage ───────────────────────────────────────────────────── */

export async function getHomepage(): Promise<HomepageData | null> {
  return client.fetch(homepageQuery);
}

/* ── Apothecary ─────────────────────────────────────────────────── */

export async function getAllProducts(): Promise<Product[]> {
  return client.fetch(allProductsQuery) ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return client.fetch(productBySlugQuery, { slug });
}

/* ── Academy ────────────────────────────────────────────────────── */

export async function getAllProgrammes(): Promise<Programme[]> {
  return client.fetch(allProgrammesQuery) ?? [];
}

export async function getProgrammeBySlug(slug: string): Promise<Programme | null> {
  return client.fetch(programmeBySlugQuery, { slug });
}

export async function getAllFaculty(): Promise<Faculty[]> {
  return client.fetch(allFacultyQuery) ?? [];
}

/* ── Sacred Journeys ────────────────────────────────────────────── */

export async function getAllJourneys(): Promise<Journey[]> {
  return client.fetch(allJourneysQuery) ?? [];
}

export async function getJourneyBySlug(slug: string): Promise<Journey | null> {
  return client.fetch(journeyBySlugQuery, { slug });
}

/* ── Knowledge Library ──────────────────────────────────────────── */

export async function getAllArticles(): Promise<Article[]> {
  return client.fetch(allArticlesQuery) ?? [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return client.fetch(articleBySlugQuery, { slug });
}

/* ── Testimonials & FAQs ────────────────────────────────────────── */

export async function getTestimonials(department: string): Promise<Testimonial[]> {
  return client.fetch(testimonialsByDepartmentQuery, { department }) ?? [];
}

export async function getFaqs(department: string): Promise<FaqItem[]> {
  return client.fetch(faqsByDepartmentQuery, { department }) ?? [];
}

/* ── Clinical ───────────────────────────────────────────────────── */

export async function getConsultationsPage() {
  return client.fetch(consultationsPageQuery);
}

/* ── Institution ────────────────────────────────────────────────── */

export async function getCharter() {
  return client.fetch(charterQuery);
}
