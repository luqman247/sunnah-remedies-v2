/**
 * JSON-LD Schema Builders — composable structured data.
 *
 * Architecture: typed builder functions that take a resolved entity
 * and return a JSON-LD object. Pages compose into a single @graph.
 * No JSON-LD is hand-written in templates.
 *
 * Every node carries a stable @id (canonical URL + fragment) so the
 * same entity referenced across pages is one identity in the graph.
 */

import { seoConfig } from "../config";

export type JsonLdNode = Record<string, unknown>;

/**
 * Compose multiple JSON-LD nodes into a connected @graph.
 */
export function composeGraph(...nodes: (JsonLdNode | null | undefined)[]): string {
  const validNodes = nodes.filter(Boolean) as JsonLdNode[];
  if (validNodes.length === 0) return "";

  const graph = {
    "@context": "https://schema.org",
    "@graph": validNodes,
  };

  return JSON.stringify(graph);
}

/* ── Global singletons (emitted site-wide) ─────────────────────── */

export function organizationNode(): JsonLdNode {
  return {
    "@type": ["MedicalOrganization", "EducationalOrganization"],
    "@id": `${seoConfig.siteUrl}/#organization`,
    name: seoConfig.organizationName,
    url: seoConfig.siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${seoConfig.siteUrl}${seoConfig.logo}`,
    },
    foundingDate: seoConfig.foundingDate,
    medicalSpecialty: seoConfig.medicalSpecialty,
    description: seoConfig.defaultDescription,
    sameAs: [
      // Social profiles added as they become available
    ],
  };
}

export function websiteNode(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": `${seoConfig.siteUrl}/#website`,
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    publisher: { "@id": `${seoConfig.siteUrl}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${seoConfig.siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/* ── Reusable sub-builders ──────────────────────────────────────── */

export function orgRef(): JsonLdNode {
  return { "@id": `${seoConfig.siteUrl}/#organization` };
}

export function websiteRef(): JsonLdNode {
  return { "@id": `${seoConfig.siteUrl}/#website` };
}

export function imageObject(url: string, alt?: string, caption?: string): JsonLdNode {
  const node: JsonLdNode = {
    "@type": "ImageObject",
    url,
  };
  if (alt) node.name = alt;
  if (caption) node.caption = caption;
  return node;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbList(items: BreadcrumbItem[]): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function personNode(name: string, url?: string, jobTitle?: string): JsonLdNode {
  const node: JsonLdNode = {
    "@type": "Person",
    name,
  };
  if (url) {
    node["@id"] = url;
    node.url = url;
  }
  if (jobTitle) node.jobTitle = jobTitle;
  node.affiliation = orgRef();
  return node;
}
