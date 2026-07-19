import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { getPathname } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllArticles } from "@/sanity/lib/fetch";
import { getDuaDhikrCollectionsPublic } from "@/sanity/lib/dua-dhikr-public-fetch";
import { isDuaDhikrCollectionPublished } from "@/lib/dua-dhikr/publication-status";
import { DepartmentHero } from "@/components/department/DepartmentHero";
import { DepartmentStatement } from "@/components/department/DepartmentStatement";
import { DepartmentSection } from "@/components/department/DepartmentSection";
import {
  DepartmentFeature,
  DepartmentFeatureLink,
} from "@/components/department/DepartmentFeature";
import { DuaDhikrFeature } from "@/components/department/DuaDhikrFeature";
import { allocateKnowledgeLibraryNumerals } from "@/components/department/dua-dhikr-feature-utils";
import { RotatingDepartmentPullQuote } from "@/components/department/RotatingDepartmentPullQuote";
import { libraryDeclarations } from "@/lib/content/sections/library-declarations";
import { IsnadRule } from "@/components/arrival/IsnadRule";
import NextLink from "next/link";
import "@/components/department/department.css";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("knowledgeLibrary", "/knowledge-library");
}

export default async function KnowledgeLibraryPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const [articles, duaDhikrCollections] = await Promise.all([
    getAllArticles(locale),
    getDuaDhikrCollectionsPublic(),
  ]);
  const publishedDuaDhikrCollections = duaDhikrCollections.filter(
    isDuaDhikrCollectionPublished,
  );
  const departmentName = tNav("knowledgeLibrary");
  const hasRecentArticles = articles.length > 0;
  const section = allocateKnowledgeLibraryNumerals(hasRecentArticles);

  return (
    <div className="department-v2 knowledge-library-hub">
      <a
        href="#main-content"
        className="sr-only"
        style={{
          position: "absolute",
          insetInlineStart: "-9999px",
          insetBlockStart: "var(--space-2)",
          padding: "var(--space-2) var(--space-4)",
          background: "var(--sage)",
          color: "var(--paper-on-deep)",
          fontFamily: "var(--font-utility), monospace",
          fontSize: "0.75rem",
          zIndex: 9999,
        }}
      >
        {tNav("skipToContent")}
      </a>

      {/* ═══ § I · DEPARTMENT HERO ═══ */}
      <div id="main-content">
        <DepartmentHero
          numeral={section.hero}
          eyebrow={`DEPARTMENT I · ${departmentName.toUpperCase()}`}
          nameAr="مكتبة العلم"
          nameEn={departmentName}
          standfirst="The institution's publishing programme — monographs, research notes, and patient guides on Prophetic Medicine, published with citation, grading, and clear limits. Knowledge before commerce"
        />
      </div>

      {/* ═══ § II · DUʿĀ & DHIKR FEATURE ═══ */}
      <DuaDhikrFeature
        locale={locale}
        numeral={section.duaDhikr}
        publishedCollections={publishedDuaDhikrCollections}
      />

      {/* Restrained cross-link into "I am feeling…" (docs/i-am-feeling/SPEC.md
          §2) — a second way into the Duʿā & Dhikr library, by feeling
          instead of occasion. Deliberately not a new numbered department
          section, to avoid touching allocateKnowledgeLibraryNumerals. */}
      <p
        className="type-body-v2"
        style={{
          maxInlineSize: "60ch",
          margin: "0 auto",
          padding: "0 var(--margin-mobile) var(--space-8)",
          textAlign: "center",
          color: "var(--muted)",
        }}
      >
        Prefer to begin with how you feel, rather than an occasion?{" "}
        <NextLink
          href={getPathname({ locale, href: "/i-am-feeling" })}
          style={{ color: "var(--sage-deep)" }}
        >
          Try &ldquo;I am feeling…&rdquo;
        </NextLink>
      </p>

      {/* ═══ § III · ON THE OPEN SHELF ═══ */}
      <DepartmentStatement
        numeral={section.openShelf}
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

      {/* ═══ § IV · FEATURED PUBLICATIONS ═══ */}
      <DepartmentSection
        numeral={section.featured}
        label="FEATURED PUBLICATIONS"
      >
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
            to transmitting it responsibly. Terms are defined. Limits are
            stated. The difference between revelation, tradition, and cultural
            practice is made plain
          </p>
          <div>
            <DepartmentFeatureLink
              href="/knowledge-library/prophetic-medicine"
              locale={locale}
            >
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
            <em>Nigella sativa</em> in report and use — the hadith, the
            classical commentary, the contemporary research, and the
            institution&apos;s position. What the evidence supports, what it
            does not, and where honest uncertainty remains
          </p>
          <div>
            <DepartmentFeatureLink
              href="/knowledge-library/black-seed"
              locale={locale}
            >
              Read the article
            </DepartmentFeatureLink>
          </div>
        </DepartmentFeature>
      </DepartmentSection>

      {/* ═══ § V · SANITY ARTICLES (if published) ═══ */}
      {section.recent && (
        <DepartmentSection numeral={section.recent} label="RECENT PUBLICATIONS">
          <h2 className="sr-only">Recent publications</h2>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-6)",
            }}
          >
            {articles.map((article) => (
              <li key={article._id}>
                <NextLink
                  href={getPathname({
                    locale,
                    href: `/knowledge-library/${article.slug.current}`,
                  })}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span
                    className="type-eyebrow-v2"
                    style={{ color: "var(--brass)" }}
                  >
                    {article.contentType || "Article"}
                  </span>
                  <h3 className="type-dept-name" style={{ margin: 0 }}>
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="type-body-v2" style={{ margin: 0 }}>
                      {article.excerpt}
                    </p>
                  )}
                  {article.author && (
                    <span
                      className="type-folio-v2"
                      style={{ color: "var(--brass)" }}
                    >
                      {article.author.name}
                      {article.readingTime
                        ? ` · ${article.readingTime} min read`
                        : ""}
                    </span>
                  )}
                </NextLink>
              </li>
            ))}
          </ul>
        </DepartmentSection>
      )}

      {/* ═══ CLOSING ═══ */}
      <DepartmentSection numeral={section.closing} variant="deep">
        <div className="dept-measure">
          <RotatingDepartmentPullQuote
            statements={libraryDeclarations}
            interval={15000}
          />
        </div>
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
            Knowledge before commerce. Service before profit. Trust before
            growth. The institution exists for the next generation
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
