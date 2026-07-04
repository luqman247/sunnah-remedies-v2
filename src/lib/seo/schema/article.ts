/**
 * Article JSON-LD builder.
 */

import { seoConfig } from "../config";
import { type JsonLdNode, orgRef, imageObject, personNode } from "./index";

export interface ArticleSchemaInput {
  title: string;
  slug: string;
  description: string;
  image?: string;
  imageAlt?: string;
  publishedAt: string;
  updatedAt?: string;
  author?: { name: string; slug?: string; jobTitle?: string };
  section?: string;
  wordCount?: number;
  tags?: string[];
}

export function articleSchema(input: ArticleSchemaInput): JsonLdNode {
  const url = `${seoConfig.siteUrl}/knowledge-library/${input.slug}`;

  const node: JsonLdNode = {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: input.title,
    description: input.description,
    url,
    mainEntityOfPage: { "@id": url },
    publisher: orgRef(),
    datePublished: input.publishedAt,
  };

  if (input.updatedAt) node.dateModified = input.updatedAt;
  if (input.image) node.image = imageObject(input.image, input.imageAlt);
  if (input.wordCount) node.wordCount = input.wordCount;
  if (input.section) node.articleSection = input.section;
  if (input.tags) node.keywords = input.tags.join(", ");

  if (input.author) {
    const authorUrl = input.author.slug
      ? `${seoConfig.siteUrl}/faculty/${input.author.slug}`
      : undefined;
    node.author = personNode(input.author.name, authorUrl, input.author.jobTitle);
  }

  return node;
}
