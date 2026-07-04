import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { seoConfig } from "@/lib/seo/config";
import { client } from "@/sanity/lib/client";
import { composeGraph, organizationNode, websiteNode, breadcrumbList } from "@/lib/seo/schema";
import { medicalPageSchema } from "@/lib/seo/schema/medical";

interface Props {
  params: Promise<{ type: string; slug: string }>;
}

const VALID_TYPES = ["ingredient", "condition", "bodySystem", "hadith", "quranReference", "scholar", "research", "video", "faq"];

async function getEntity(type: string, slug: string) {
  const query = `*[_type == "${type}" && slug.current == "${slug}"][0] {
    _id,
    _type,
    "title": coalesce(title, name),
    "name": coalesce(name, title),
    "slug": slug.current,
    description,
    definition,
    "shortDescription": coalesce(definition, description),
    body,
    mainImage { asset->{ url } },
    evidenceLevel,
    aliases,
    activeIngredient,
    symptoms,
    featuredSnippetAnswer,
    faqs[] { question, answer },
    relationships[] {
      "target": target->{ _id, _type, "title": coalesce(title, name), "slug": slug.current },
      relationType,
      strength
    },
    author->{ name, "slug": slug.current, jobTitle },
    reviewer->{ name, "slug": slug.current, jobTitle },
    reviewDate,
    seo
  }`;
  return client.fetch(query).catch(() => null);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, slug } = await params;
  if (!VALID_TYPES.includes(type)) return {};

  const entity = await getEntity(type, slug);
  if (!entity) return {};

  return buildMetadata({
    path: `/knowledge/${type}/${slug}`,
    type,
    document: {
      title: entity.title || entity.name,
      name: entity.name,
      description: entity.shortDescription,
      definition: entity.definition,
      slug: entity.slug,
      image: entity.mainImage?.asset?.url,
    },
    overrides: entity.seo ? {
      seoTitle: entity.seo.metaTitle,
      seoDescription: entity.seo.metaDescription,
      canonicalUrl: entity.seo.canonicalUrl,
      noIndex: entity.seo.noIndex,
      keywords: entity.seo.keywords,
    } : undefined,
  });
}

export default async function KnowledgeEntityPage({ params }: Props) {
  const { type, slug } = await params;
  if (!VALID_TYPES.includes(type)) notFound();

  const entity = await getEntity(type, slug);
  if (!entity) notFound();

  const pageUrl = `${seoConfig.siteUrl}/knowledge/${type}/${slug}`;

  // Compose JSON-LD graph
  const schemaNodes = [
    organizationNode(),
    websiteNode(),
    breadcrumbList([
      { name: "Home", url: seoConfig.siteUrl },
      { name: type.charAt(0).toUpperCase() + type.slice(1), url: `${seoConfig.siteUrl}/knowledge/${type}` },
      { name: entity.title || entity.name, url: pageUrl },
    ]),
  ];

  if (type === "ingredient" || type === "condition") {
    schemaNodes.push(
      medicalPageSchema({
        name: entity.name || entity.title,
        slug: entity.slug,
        type: type as "ingredient" | "condition",
        description: entity.shortDescription || entity.description || "",
        image: entity.mainImage?.asset?.url,
        reviewedBy: entity.reviewer,
        lastReviewed: entity.reviewDate,
      })
    );
  }

  // FAQ schema if FAQs exist
  if (entity.faqs && entity.faqs.length > 0) {
    const { faqPageSchema } = await import("@/lib/seo/schema/content");
    schemaNodes.push(faqPageSchema(entity.faqs, pageUrl));
  }

  const jsonLd = composeGraph(...schemaNodes);

  // Group relationships by type for related-* modules
  const relatedByType: Record<string, { title: string; slug: string; type: string }[]> = {};
  if (entity.relationships) {
    for (const rel of entity.relationships) {
      if (!rel.target) continue;
      const key = rel.relationType;
      if (!relatedByType[key]) relatedByType[key] = [];
      relatedByType[key].push({
        title: rel.target.title,
        slug: rel.target.slug,
        type: rel.target._type,
      });
    }
  }

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      {/* ═══ Entity Hero ═══ */}
      <section className="leaf leaf--grave" aria-labelledby="entity-heading">
        <div className="measure-wide">
          <p className="type-eyebrow" style={{ color: "var(--gilt-soft)", marginBottom: "var(--s4)" }}>
            {type.toUpperCase().replace(/([A-Z])/g, " $1").trim()}
          </p>
          <h1 id="entity-heading" className="type-display-l grave-block__line">
            {entity.name || entity.title}
          </h1>
          {entity.definition && (
            <p className="type-lede grave-block__qualifier" style={{ maxWidth: "var(--measure-reading)", margin: "var(--s5) auto 0" }}>
              {entity.definition}
            </p>
          )}
        </div>
      </section>

      {/* ═══ Machine-readable fact block ═══ */}
      {entity.featuredSnippetAnswer && (
        <section className="leaf" aria-label="Quick answer">
          <div className="measure-wide" style={{ maxWidth: "var(--measure-reading)" }}>
            <dl className="fact-block">
              <dt className="type-eyebrow">Summary</dt>
              <dd className="type-body">{entity.featuredSnippetAnswer}</dd>
              {entity.evidenceLevel && (
                <>
                  <dt className="type-eyebrow">Evidence Level</dt>
                  <dd className="type-body">{entity.evidenceLevel}</dd>
                </>
              )}
              {entity.aliases && entity.aliases.length > 0 && (
                <>
                  <dt className="type-eyebrow">Also known as</dt>
                  <dd className="type-body">{entity.aliases.join(", ")}</dd>
                </>
              )}
            </dl>
          </div>
        </section>
      )}

      {/* ═══ Main Content ═══ */}
      {entity.description && (
        <section className="leaf" aria-labelledby="description-heading">
          <div className="measure-wide" style={{ maxWidth: "var(--measure-reading)" }}>
            <h2 id="description-heading" className="type-title" style={{ marginBottom: "var(--s4)" }}>
              Overview
            </h2>
            <p className="type-body">{entity.description}</p>
          </div>
        </section>
      )}

      {/* ═══ FAQs ═══ */}
      {entity.faqs && entity.faqs.length > 0 && (
        <section className="leaf leaf--inset" aria-labelledby="faq-heading">
          <div className="measure-wide" style={{ maxWidth: "var(--measure-reading)" }}>
            <h2 id="faq-heading" className="type-title" style={{ marginBottom: "var(--s5)" }}>
              Questions & Answers
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--s5)" }}>
              {entity.faqs.map((faq: { question: string; answer: string }, i: number) => (
                <div key={i}>
                  <h3 className="type-body" style={{ fontWeight: 600, marginBottom: "var(--s2)" }}>
                    {faq.question}
                  </h3>
                  <p className="type-body" style={{ color: "var(--muted)" }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ Related Entities (internal linking from graph) ═══ */}
      {Object.keys(relatedByType).length > 0 && (
        <section className="leaf" aria-labelledby="related-heading">
          <div className="measure-wide">
            <h2 id="related-heading" className="type-title" style={{ marginBottom: "var(--s5)" }}>
              Related
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--s4)" }}>
              {Object.entries(relatedByType).map(([relType, items]) => (
                <div key={relType}>
                  <h3 className="type-eyebrow" style={{ marginBottom: "var(--s3)" }}>
                    {relType.replace(/([A-Z])/g, " $1").trim()}
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s3)" }}>
                    {items.map((item) => (
                      <a
                        key={item.slug}
                        href={`/knowledge/${item.type}/${item.slug}`}
                        className="quiet-link"
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ Reviewer attribution (E-E-A-T / isnād) ═══ */}
      {entity.reviewer && (
        <footer className="leaf" style={{ borderTop: "1px solid var(--rule)" }}>
          <div className="measure-wide" style={{ maxWidth: "var(--measure-reading)" }}>
            <p className="type-small" style={{ color: "var(--muted)" }}>
              Reviewed by <strong>{entity.reviewer.name}</strong>
              {entity.reviewer.jobTitle && `, ${entity.reviewer.jobTitle}`}
              {entity.reviewDate && ` · ${entity.reviewDate}`}
            </p>
          </div>
        </footer>
      )}
    </article>
  );
}
