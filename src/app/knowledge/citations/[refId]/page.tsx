import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { seoConfig } from "@/lib/seo/config";
import { client } from "@/sanity/lib/client";
import { composeGraph, organizationNode, websiteNode, breadcrumbList } from "@/lib/seo/schema";
import { citationSchemaNode, type CitationReference } from "@/lib/knowledge-graph/reference-resolver";

interface Props {
  params: Promise<{ refId: string }>;
}

async function getReference(refId: string) {
  return client.fetch<CitationReference & { referencedBy: { _type: string; title: string; slug: string }[] }>(
    `*[_type == "citation" && refId == $refId][0] {
      refId,
      "type": type,
      title,
      author,
      source,
      collection,
      number,
      doi,
      isbn,
      year,
      url,
      grading,
      notes,
      "referencedBy": *[references(^._id)] {
        _type,
        "title": coalesce(title, name),
        "slug": slug.current
      }
    }`,
    { refId }
  ).catch(() => null);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { refId } = await params;
  const ref = await getReference(refId);
  if (!ref) return {};

  return buildMetadata({
    path: `/knowledge/citations/${refId}`,
    type: "citation",
    document: {
      title: ref.title,
      description: `Citation reference: ${ref.title}${ref.source ? ` — ${ref.source}` : ""}`,
    },
  });
}

export default async function CitationPage({ params }: Props) {
  const { refId } = await params;
  const ref = await getReference(refId);
  if (!ref) notFound();

  const pageUrl = `${seoConfig.siteUrl}/knowledge/citations/${refId}`;

  const jsonLd = composeGraph(
    organizationNode(),
    websiteNode(),
    breadcrumbList([
      { name: "Home", url: seoConfig.siteUrl },
      { name: "Citations", url: `${seoConfig.siteUrl}/knowledge/citations` },
      { name: ref.title, url: pageUrl },
    ]),
    citationSchemaNode(ref)
  );

  const typeUrlMap: Record<string, string> = {
    ingredient: "/knowledge/ingredient",
    condition: "/knowledge/condition",
    product: "/the-apothecary",
    article: "/knowledge-library",
    programme: "/the-academy",
    journey: "/sacred-journeys",
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <section className="leaf" aria-labelledby="citation-heading">
        <div className="measure-wide" style={{ maxWidth: "var(--measure-reading)" }}>
          <p className="type-eyebrow" style={{ color: "var(--gilt-soft)", marginBottom: "var(--s4)" }}>
            CITATION · {ref.type?.toUpperCase()}
          </p>
          <h1 id="citation-heading" className="type-title" style={{ marginBottom: "var(--s5)" }}>
            {ref.title}
          </h1>

          <dl className="fact-block" style={{ marginBottom: "var(--s6)" }}>
            {ref.author && (
              <>
                <dt className="type-eyebrow">Author</dt>
                <dd className="type-body">{ref.author}</dd>
              </>
            )}
            {ref.source && (
              <>
                <dt className="type-eyebrow">Source</dt>
                <dd className="type-body">{ref.source}</dd>
              </>
            )}
            {ref.collection && ref.number && (
              <>
                <dt className="type-eyebrow">Reference</dt>
                <dd className="type-body">{ref.collection} {ref.number}</dd>
              </>
            )}
            {ref.year && (
              <>
                <dt className="type-eyebrow">Year</dt>
                <dd className="type-body">{ref.year}</dd>
              </>
            )}
            {ref.grading && (
              <>
                <dt className="type-eyebrow">Grading</dt>
                <dd className="type-body">{ref.grading}</dd>
              </>
            )}
            {ref.doi && (
              <>
                <dt className="type-eyebrow">DOI</dt>
                <dd className="type-body">
                  <a href={`https://doi.org/${ref.doi}`} className="quiet-link" rel="noopener noreferrer" target="_blank">
                    {ref.doi}
                  </a>
                </dd>
              </>
            )}
            {ref.isbn && (
              <>
                <dt className="type-eyebrow">ISBN</dt>
                <dd className="type-body">{ref.isbn}</dd>
              </>
            )}
            <dt className="type-eyebrow">Reference ID</dt>
            <dd className="type-body" style={{ fontFamily: "var(--font-utility)" }}>{ref.refId}</dd>
          </dl>

          {/* Back-links: what cites this reference */}
          {ref.referencedBy && ref.referencedBy.length > 0 && (
            <div style={{ borderTop: "1px solid var(--rule)", paddingTop: "var(--s5)" }}>
              <h2 className="type-eyebrow" style={{ marginBottom: "var(--s4)" }}>
                CITED BY
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--s3)" }}>
                {ref.referencedBy.map((item) => {
                  const basePath = typeUrlMap[item._type] || "/knowledge";
                  return (
                    <Link
                      key={item.slug}
                      href={`${basePath}/${item.slug}`}
                      className="quiet-link"
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
