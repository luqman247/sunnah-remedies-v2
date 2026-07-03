import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionPage } from "@/components/ui/SectionPage";
import { SectionLabel } from "@/components/ui/PageIntro";
import { GoLink } from "@/components/ui/Links";
import { knowledgeLibrary } from "@/lib/navigation/site-structure";
import { getAllKnowledgeSlugs, getKnowledgeTopic } from "@/lib/content/sections/knowledge-library";

interface PageProps {
  params: Promise<{ slug: string }>;
}

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

  const section = knowledgeLibrary.sections.find((s) => s.href === `/knowledge-library/${slug}`);

  return (
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
      {topic.sections.map((block) => (
        <article key={block.title} className="policy-block">
          <SectionLabel>{block.title}</SectionLabel>
          {block.body.map((p) => (
            <p key={p.slice(0, 48)} className="type-body">{p}</p>
          ))}
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

      {section?.description && (
        <p className="type-small" style={{ color: "var(--muted)", marginTop: "var(--s5)" }}>
          {section.description}
        </p>
      )}
    </SectionPage>
  );
}
