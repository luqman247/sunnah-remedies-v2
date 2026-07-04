/**
 * Reference/Citation Resolver.
 *
 * Every bibliographic reference has a canonical citation page
 * with a stable refId, full bibliographic metadata, and back-links.
 */

import { seoConfig } from "../seo/config";

export interface CitationReference {
  refId: string;
  type: "hadith" | "quran" | "book" | "paper" | "manuscript" | "online";
  title: string;
  author?: string;
  source?: string;
  collection?: string;
  number?: string;
  doi?: string;
  isbn?: string;
  year?: string;
  url?: string;
  grading?: string;
}

/**
 * Build the canonical URL for a citation page.
 */
export function citationUrl(refId: string): string {
  return `${seoConfig.siteUrl}/knowledge/citations/${refId}`;
}

/**
 * Format a citation for display.
 */
export function formatCitation(ref: CitationReference): string {
  const parts: string[] = [];

  if (ref.author) parts.push(ref.author);
  if (ref.title) parts.push(`"${ref.title}"`);
  if (ref.source) parts.push(ref.source);
  if (ref.collection && ref.number) parts.push(`${ref.collection} ${ref.number}`);
  if (ref.year) parts.push(`(${ref.year})`);
  if (ref.grading) parts.push(`[${ref.grading}]`);

  return parts.join(", ");
}

/**
 * Format a citation as a schema.org CreativeWork node.
 */
export function citationSchemaNode(ref: CitationReference): Record<string, unknown> {
  const node: Record<string, unknown> = {
    "@type": "CreativeWork",
    "@id": citationUrl(ref.refId),
    name: ref.title,
  };

  if (ref.author) node.author = { "@type": "Person", name: ref.author };
  if (ref.year) node.datePublished = ref.year;
  if (ref.source) node.isPartOf = { "@type": "CreativeWork", name: ref.source };
  if (ref.doi) node.identifier = { "@type": "PropertyValue", propertyID: "DOI", value: ref.doi };
  if (ref.isbn) node.isbn = ref.isbn;
  if (ref.url) node.url = ref.url;

  return node;
}

/**
 * GROQ projection for fetching citation references.
 */
export const CITATIONS_PROJECTION = `
  citations[] {
    "refId": refId,
    "type": type,
    "title": title,
    "author": author,
    "source": source,
    "collection": collection,
    "number": number,
    "doi": doi,
    "isbn": isbn,
    "year": year,
    "url": url,
    "grading": grading
  }
`;
