import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import { knowledgeLibrary, getAllArticles, knowledgeTopics } from "@/sanity/lib/fetch";
import { DepartmentHero } from "@/components/department/DepartmentHero";
import { DepartmentStatement } from "@/components/department/DepartmentStatement";
import { DepartmentSection } from "@/components/department/DepartmentSection";
import {
  DepartmentFeature,
  DepartmentFeatureLink,
  DepartmentPullQuote,
} from "@/components/department/DepartmentFeature";
import { IsnadRule } from "@/components/arrival/IsnadRule";
import { Reveal } from "@/components/arrival/Reveal";
import { DepartmentNav } from "@/components/ui/DepartmentNav";
import "@/components/department/department.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("knowledgeLibrary", "/knowledge-library");
}

export default async function KnowledgeLibraryPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const articles = await getAllArticles(locale);
  return (
    <div className="department-v2">
      <a href="#main-content" className="sr-only" style={{
        position: "absolute",
        insetInlineStart: "-9999px",
        insetBlockStart: "var(--space-2)",
        padding: "var(--space-2) var(--space-4)",
        background: "var(--sage)",
        color: "var(--paper-on-deep)",
        fontFamily: "var(--font-utility), monospace",
        fontSize: "0.75rem",
        zIndex: 9999,
      }}>
        Skip to content
      </a>

      {/* ═══ § I · DEPARTMENT HERO ═══ */}
      <div id="main-content">
        <DepartmentHero
          numeral="I"
          eyebrow="DEPARTMENT I · KNOWLEDGE LIBRARY"
          nameAr="مكتبة العلم"
          nameEn="Knowledge Library"
          standfirst="The institution's publishing programme — monographs, research notes, and patient guides on Prophetic Medicine, published with citation, grading, and clear limits. Knowledge before commerce"
        />
      </div>

      {/* ═══ § II · ON THE OPEN SHELF ═══ */}
      <Reveal>
        <DepartmentStatement
          numeral="II"
          stamp="ON THE OPEN SHELF"
          standfirst="What does it mean for an institution to publish?"
          body={[
            "The Knowledge Library is not a blog, not a content strategy, not a marketing channel. It is a publishing programme governed by the same principles of citation and accountability that govern the Academy and the Dispensary. Every article states its standing, cites primary sources, names its author, and links to related monographs and Academy lessons where available",
            "The institution shares what it knows, names what it does not, and invites correction. Nothing is attributed without traceable evidence. Nothing is published without editorial review. The shelf is open because scholarship that is hidden serves no one",
          ]}
          pullQuote={{
            text: "Nothing is attributed without traceable evidence. Means, not miracle",
            attribution: "Institutional principle",
          }}
        />
      </Reveal>

      {/* ═══ § III · FEATURED PUBLICATIONS ═══ */}
      <Reveal>
        <DepartmentSection numeral="III" label="FEATURED PUBLICATIONS">
          <h2 className="sr-only">Featured publications</h2>

          <DepartmentFeature
            src="/photography/institution-hero.jpg"
            alt="Scholarly hands examining an illuminated manuscript of Prophetic medicine beside glass vessels of amber oil"
          >
            <span className="type-eyebrow-v2" style={{ color: "var(--brass)" }}>
              Essential reading
            </span>
            <h3 className="type-dept-name" style={{ margin: 0 }}>
              Prophetic Medicine
            </h3>
            <p className="type-body-v2" style={{ margin: 0 }}>
              A foundational guide to <em>Tibb al-Nabawi</em>: its sources,
              methodology, scholarly grades, and the institution&apos;s approach
              to transmitting it responsibly. Terms are defined. Limits are stated.
              The difference between revelation, tradition, and cultural practice
              is made plain
            </p>
            <div>
              <DepartmentFeatureLink href="/knowledge-library/prophetic-medicine">
                Read the article
              </DepartmentFeatureLink>
            </div>
          </DepartmentFeature>

          <IsnadRule variant="divider" nodePosition={0.3} />

          <DepartmentFeature
            src="/photography/honey-editorial.jpg"
            alt="Golden honey in a glass vessel beside dried herbs"
            reverse
          >
            <span className="type-eyebrow-v2" style={{ color: "var(--brass)" }}>
              Materia medica
            </span>
            <h3 className="type-dept-name" style={{ margin: 0 }}>
              Black Seed
            </h3>
            <p className="type-body-v2" style={{ margin: 0 }}>
              <em>Nigella sativa</em> in report and use — the hadith, the classical
              commentary, the contemporary research, and the institution&apos;s position.
              What the evidence supports, what it does not, and where honest
              uncertainty remains
            </p>
            <div>
              <DepartmentFeatureLink href="/knowledge-library/black-seed">
                Read the article
              </DepartmentFeatureLink>
            </div>
          </DepartmentFeature>
        </DepartmentSection>
      </Reveal>

      {/* ═══ § IV · SANITY ARTICLES (if published) ═══ */}
      {articles.length > 0 && (
        <Reveal>
          <DepartmentSection numeral="IV" label="RECENT PUBLICATIONS">
            <h2 className="sr-only">Recent publications</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
              {articles.map((article) => (
                <li key={article._id}>
                  <Link href={`/knowledge-library/${article.slug.current}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <span className="type-eyebrow-v2" style={{ color: "var(--brass)" }}>
                      {article.contentType || "Article"}
                    </span>
                    <h3 className="type-dept-name" style={{ margin: 0 }}>{article.title}</h3>
                    {article.excerpt && (
                      <p className="type-body-v2" style={{ margin: 0 }}>{article.excerpt}</p>
                    )}
                    {article.author && (
                      <span className="type-folio-v2" style={{ color: "var(--brass)" }}>
                        {article.author.name}
                        {article.readingTime ? ` · ${article.readingTime} min read` : ""}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </DepartmentSection>
        </Reveal>
      )}

      {/* ═══ § V · CLOSING ═══ */}
      <Reveal>
        <DepartmentSection numeral={articles.length > 0 ? "V" : "IV"} variant="deep">
          <div className="dept-measure">
            <DepartmentPullQuote
              text="The shelf is open because scholarship that is hidden serves no one"
            />
          </div>
        </DepartmentSection>
      </Reveal>

      {/* ═══ § VI · DEPARTMENT NAVIGATION ═══ */}
      <DepartmentSection numeral={articles.length > 0 ? "VI" : "V"} label="SECTIONS" variant="nav">
        <DepartmentNav department={knowledgeLibrary} />
      </DepartmentSection>

      {/* ═══ FOOTER ═══ */}
      <footer className="dept-section dept-band-deep" role="contentinfo">
        <div className="dept-container">
          <IsnadRule variant="footer" nodePosition={0.5} />
          <p
            className="type-body-v2"
            style={{
              marginBlockStart: "var(--space-8)",
              maxInlineSize: "60ch",
              color: "var(--paper-on-deep)",
            }}
          >
            Knowledge before commerce. Service before profit. Trust before growth.
            The institution exists for the next generation
          </p>
          <p
            className="type-folio-v2"
            style={{
              marginBlockStart: "var(--space-10)",
              color: "var(--brass)",
            }}
          >
            <time dateTime={new Date().toISOString().split("T")[0]}>
              {new Date().getFullYear()} CE
            </time>
            {" · "}Sunnah Remedies · Institute of Prophetic Medicine
          </p>
        </div>
      </footer>
    </div>
  );
}
