/**
 * CollectionPage + Speakable + Book JSON-LD builders.
 */

import { seoConfig } from "../config";
import { type JsonLdNode, orgRef } from "./index";

/* ── CollectionPage ─────────────────────────────────────────────── */

export interface CollectionPageSchemaInput {
  name: string;
  slug: string;
  description: string;
  basePath: string;
  members?: { name: string; url: string }[];
}

export function collectionPageSchema(input: CollectionPageSchemaInput): JsonLdNode {
  const url = `${seoConfig.siteUrl}${input.basePath}/${input.slug}`;

  const node: JsonLdNode = {
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    name: input.name,
    description: input.description,
    url,
    isPartOf: { "@id": `${seoConfig.siteUrl}/#website` },
  };

  if (input.members && input.members.length > 0) {
    node.hasPart = input.members.map((m) => ({
      "@type": "CreativeWork",
      name: m.name,
      url: m.url,
    }));
  }

  return node;
}

/* ── Speakable ──────────────────────────────────────────────────── */

export function speakableSchema(pageUrl: string, selectors: string[]): JsonLdNode {
  return {
    "@type": "WebPage",
    "@id": pageUrl,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: selectors,
    },
  };
}

/* ── Book ───────────────────────────────────────────────────────── */

export interface BookSchemaInput {
  name: string;
  slug: string;
  author: string;
  isbn?: string;
  description?: string;
  about?: string[];
  datePublished?: string;
}

export function bookSchema(input: BookSchemaInput): JsonLdNode {
  const url = `${seoConfig.siteUrl}/press/${input.slug}`;

  const node: JsonLdNode = {
    "@type": "Book",
    "@id": `${url}#book`,
    name: input.name,
    url,
    author: { "@type": "Person", name: input.author },
    publisher: orgRef(),
  };

  if (input.isbn) node.isbn = input.isbn;
  if (input.description) node.description = input.description;
  if (input.datePublished) node.datePublished = input.datePublished;
  if (input.about) {
    node.about = input.about.map((topic) => ({
      "@type": "Thing",
      name: topic,
    }));
  }

  return node;
}
