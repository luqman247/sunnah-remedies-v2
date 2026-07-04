/**
 * Guarded Schema Builders — scaffolded for future activation.
 *
 * NewsArticle, Physician, and Dataset are enabled with their
 * content types — no retrofit needed when they launch.
 */

import { seoConfig } from "../config";
import { type JsonLdNode, orgRef, imageObject, personNode } from "./index";

/* ── NewsArticle (guarded: enable when newsArticle type launches) ── */

export interface NewsArticleSchemaInput {
  headline: string;
  slug: string;
  description: string;
  image?: string;
  imageAlt?: string;
  publishedAt: string;
  updatedAt?: string;
  author?: { name: string; slug?: string };
  section?: string;
}

export function newsArticleSchema(input: NewsArticleSchemaInput): JsonLdNode {
  const url = `${seoConfig.siteUrl}/news/${input.slug}`;

  const node: JsonLdNode = {
    "@type": "NewsArticle",
    "@id": `${url}#article`,
    headline: input.headline,
    description: input.description,
    url,
    mainEntityOfPage: { "@id": url },
    publisher: orgRef(),
    datePublished: input.publishedAt,
  };

  if (input.updatedAt) node.dateModified = input.updatedAt;
  if (input.image) node.image = imageObject(input.image, input.imageAlt);
  if (input.section) node.articleSection = input.section;

  if (input.author) {
    const authorUrl = input.author.slug
      ? `${seoConfig.siteUrl}/faculty/${input.author.slug}`
      : undefined;
    node.author = personNode(input.author.name, authorUrl);
  }

  return node;
}

/* ── Physician (enable when practitioner directory launches) ────── */

export interface PhysicianSchemaInput {
  name: string;
  slug: string;
  jobTitle: string;
  description?: string;
  image?: string;
  qualifications?: string[];
  specialities?: string[];
  alumniOf?: string;
  sameAs?: string[];
}

export function physicianSchema(input: PhysicianSchemaInput): JsonLdNode {
  const url = `${seoConfig.siteUrl}/faculty/${input.slug}`;

  const node: JsonLdNode = {
    "@type": "Physician",
    "@id": `${url}#person`,
    name: input.name,
    url,
    jobTitle: input.jobTitle,
    affiliation: orgRef(),
  };

  if (input.description) node.description = input.description;
  if (input.image) node.image = imageObject(input.image);
  if (input.qualifications) node.knowsAbout = input.qualifications;
  if (input.specialities) node.medicalSpecialty = input.specialities;
  if (input.alumniOf) node.alumniOf = { "@type": "EducationalOrganization", name: input.alumniOf };
  if (input.sameAs) node.sameAs = input.sameAs;

  return node;
}

/* ── Dataset (enable when open research data launches) ──────────── */

export interface DatasetSchemaInput {
  name: string;
  slug: string;
  description: string;
  url?: string;
  license?: string;
  distribution?: {
    contentUrl: string;
    encodingFormat: string;
  };
  datePublished?: string;
  creator?: string;
}

export function datasetSchema(input: DatasetSchemaInput): JsonLdNode {
  const url = input.url || `${seoConfig.siteUrl}/research/data/${input.slug}`;

  const node: JsonLdNode = {
    "@type": "Dataset",
    "@id": `${url}#dataset`,
    name: input.name,
    description: input.description,
    url,
    creator: orgRef(),
  };

  if (input.license) node.license = input.license;
  if (input.datePublished) node.datePublished = input.datePublished;

  if (input.distribution) {
    node.distribution = {
      "@type": "DataDownload",
      contentUrl: input.distribution.contentUrl,
      encodingFormat: input.distribution.encodingFormat,
    };
  }

  return node;
}
