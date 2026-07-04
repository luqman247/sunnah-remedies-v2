import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { SectionPage } from "@/components/ui/SectionPage";
import { SectionLabel } from "@/components/ui/PageIntro";
import { GoLink } from "@/components/ui/Links";
import { knowledgeLibrary } from "@/sanity/lib/fetch";
import { EditorialPhoto, PullQuote } from "@/components/editorial/Editorial";
import { getAllKnowledgeSlugs, getKnowledgeTopic, getAllArticles, getArticleBySlug } from "@/sanity/lib/fetch";
import { PortableText } from "@portabletext/react";

interface PageProps {
  params: Promise<{ slug: string; locale: AppLocale }>;
}

const topicPhotography: Record<string, { src: string; alt: string }> = {
  "prophetic-medicine": {
    src: "/photography/institution-hero.jpg",
    alt: "Scholarly hands examining an illuminated manuscript of Prophetic medicine",
  },
  "black-seed": {
    src: "/photography/black-seed-editorial.jpg",
    alt: "A scholar's research desk with botanical journal on Nigella sativa and pressed specimens",
  },
  hijama: {
    src: "/photography/clinical-practice.jpg",
    alt: "A clinical practitioner preparing sterile cupping equipment",
  },
  honey: {
    src: "/photography/honey-editorial.jpg",
    alt: "Golden honey being poured from a wooden dipper into a glass vessel",
  },
  "olive-oil": {
    src: "/photography/olive-oil-editorial.jpg",
    alt: "Premium olive oil in a glass cruet beside ripe olives",
  },
};

export async function generateStaticParams() {
  const staticSlugs = getAllKnowledgeSlugs().map((slug) => ({ slug }));
  const articles = await getAllArticles();
  const sanitySlugs = articles.map((a) => ({ slug: a.slug.current }));
  const seen = new Set(staticSlugs.map((s) => s.slug));
  for (const s of sanitySlugs) {
    if (!seen.has(s.slug)) staticSlugs.push(s);
  }
  return staticSlugs;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const article = await getArticleBySlug(slug, locale);
  if (article) {
    return {
      title: article.seo?.metaTitle || article.title,
      description: article.seo?.metaDescription || article.excerpt,
    };
  }
  const topic = getKnowledgeTopic(slug);
  if (!topic) return { title: "Knowledge Library" };
  return { title: topic.title, description: topic.lede };
}

export default async function KnowledgeTopicPage({ params }: PageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const article = await getArticleBySlug(slug, locale);

  if (article) {
    return (
      <>
        {article.mainImage?.asset && (
          <EditorialPhoto
            src={article.mainImage.asset._ref || article.mainImage.asset.url || ""}
            alt={article.mainImage.alt || article.title}
            aspect="landscape"
            fullBleed
            caption={article.mainImage.caption || `${article.title} — editorial photography`}
          />
        )}

        <SectionPage
          department={knowledgeLibrary}
          folio="ii"
          title={article.title}
          lede={article.excerpt || ""}
          currentHref={`/knowledge-library/${slug}`}
          breadcrumb={[
            { label: "Knowledge Library", href: "/knowledge-library" },
            { label: article.title },
          ]}
        >
          {article.author && (
            <p className="type-folio-v2" style={{ color: "var(--brass)" }}>
              {article.author.name}
              {article.author.title ? ` · ${article.author.title}` : ""}
              {article.publishedAt
                ? ` · ${new Date(article.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`
                : ""}
              {article.readingTime ? ` · ${article.readingTime} min read` : ""}
            </p>
          )}

          {article.body && article.body.length > 0 && (
            <div className="type-body portable-text-body">
              <PortableText value={article.body} />
            </div>
          )}

          {article.topics && article.topics.length > 0 && (
            <>
              <SectionLabel>Topics</SectionLabel>
              <ul className="pathway-group__list">
                {article.topics.map((topic) => (
                  <li key={topic._id}>
                    <GoLink href={`/knowledge-library/${topic.slug.current}`}>{topic.title}</GoLink>
                  </li>
                ))}
              </ul>
            </>
          )}

          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <>
              <SectionLabel>Related entries</SectionLabel>
              <ul className="pathway-group__list">
                {article.relatedArticles.map((rel) => (
                  <li key={rel._id}>
                    <GoLink href={`/knowledge-library/${rel.slug.current}`}>{rel.title}</GoLink>
                  </li>
                ))}
              </ul>
            </>
          )}
        </SectionPage>
      </>
    );
  }

  const topic = getKnowledgeTopic(slug);
  if (!topic) notFound();

  const photo = topicPhotography[slug];

  return (
    <>
      {photo && (
        <EditorialPhoto
          src={photo.src}
          alt={photo.alt}
          aspect="landscape"
          fullBleed
          caption={`${topic.title} — editorial photography`}
        />
      )}

      <SectionPage
        department={knowledgeLibrary}
        folio="ii"
        title={topic.title}
        lede={topic.lede}
        currentHref={`/knowledge-library/${slug}`}
        breadcrumb={[
          { label: "Knowledge Library", href: "/knowledge-library" },
          { label: topic.title },
        ]}
      >
        {topic.sections.map((block, i) => (
          <article key={block.title} className="policy-block">
            <SectionLabel>{block.title}</SectionLabel>
            {block.body.map((p) => (
              <p key={p.slice(0, 48)} className="type-body">
                {p}
              </p>
            ))}
            {i === 0 && topic.sections.length > 2 && (
              <PullQuote
                text={topic.lede}
              />
            )}
          </article>
        ))}

        {topic.related.length > 0 && (
          <>
            <SectionLabel>Related entries</SectionLabel>
            <ul className="pathway-group__list">
              {topic.related.map((link) => (
                <li key={link.href}>
                  <GoLink href={link.href}>{link.label}</GoLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </SectionPage>
    </>
  );
}
