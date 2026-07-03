import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionPage } from "@/components/ui/SectionPage";
import { SectionLabel } from "@/components/ui/PageIntro";
import { GoLink } from "@/components/ui/Links";
import { knowledgeLibrary } from "@/sanity/lib/fetch";
import { EditorialPhoto, PullQuote } from "@/components/editorial/Editorial";
import { getAllKnowledgeSlugs, getKnowledgeTopic } from "@/sanity/lib/fetch";

interface PageProps {
  params: Promise<{ slug: string }>;
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
  return getAllKnowledgeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getKnowledgeTopic(slug);
  if (!topic) return { title: "Knowledge Library" };
  return { title: topic.title, description: topic.lede };
}

export default async function KnowledgeTopicPage({ params }: PageProps) {
  const { slug } = await params;
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
