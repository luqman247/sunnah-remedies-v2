import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildHomepageFallback } from "@/lib/i18n/homepage-fallback";
import { getHomepage } from "@/sanity/lib/fetch";
import { getCurrentSeason, getHijriDate } from "@/lib/calendar/seasons";
import { IsnadRule } from "@/components/arrival/IsnadRule";
import { SectionStamp } from "@/components/arrival/SectionStamp";
import { ArrivalPullQuote } from "@/components/arrival/ArrivalPullQuote";
import { AuthorityBand } from "@/components/arrival/AuthorityBand";
import { DepartmentCard } from "@/components/arrival/DepartmentCard";
import { CorrespondenceForm } from "@/components/arrival/CorrespondenceForm";
import { Reveal } from "@/components/arrival/Reveal";
import { TaskPathways } from "@/components/arrival/TaskPathways";
import { HomepageLatestAdditions } from "@/components/arrival/HomepageLatestAdditions";
import { FoundingCovenant } from "@/components/arrival/FoundingCovenant";
import { CinematicHero } from "@/components/editorial/Editorial";
import "@/components/arrival/arrival.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("home", "/", locale);
}

function JsonLd({ description }: { description: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "EducationalOrganization"],
    name: "Sunnah Remedies",
    description,
    url: "https://www.sunnahremedies.co.uk",
    foundingDate: "2025",
    areaServed: "Worldwide",
    knowsAbout: [
      "Prophetic Medicine",
      "Tibb al-Nabawi",
      "Hijama",
      "Islamic Medicine",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function ArrivalPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ui = await getTranslations({ locale, namespace: "homepage" });
  const seasonal = await getTranslations({ locale, namespace: "seasonal" });
  const fallback = await buildHomepageFallback(locale);
  const cms = await getHomepage(locale);
  const { season } = getCurrentSeason();
  const hijriDate = getHijriDate(locale);
  const seasonLabel =
    season !== "standard"
      ? seasonal(`seasons.${season}.label` as "seasons.ramadan.label")
      : "";
  const seasonGreeting =
    season !== "standard"
      ? seasonal(`seasons.${season}.greeting` as "seasons.ramadan.greeting")
      : undefined;

  const tradition = cms?.tradition || fallback.tradition;
  const rawDepartments = cms?.departmentCards?.length
    ? cms.departmentCards.map((card) => ({
        order: card.order,
        nameEn: card.nameEn,
        nameAr: card.nameAr,
        standfirst: card.standfirst,
        href: card.href,
        size: card.size,
        plate: card.plate
          ? {
              status: card.plate.status,
              purpose: card.plate.purpose,
              composition: card.plate.composition,
              lens: card.plate.lens,
              lighting: card.plate.lighting,
              mood: card.plate.mood,
              image: card.plate.image?.asset?.url
                ? { url: card.plate.image.asset.url }
                : undefined,
              alt: card.plate.alt,
            }
          : {
              status: "brief" as const,
              purpose: card.standfirst,
              composition: "",
              lighting: "",
              mood: "",
            },
      }))
    : fallback.departments;
  const homepageDepartmentOrder = [
    "/the-apothecary",
    "/the-academy",
    "/sacred-journeys",
    "/knowledge-library",
  ] as const;
  const homepageDepartments = homepageDepartmentOrder
    .map((href) => {
      const dept = rawDepartments.find((d) => d.href === href);
      if (!dept) return undefined;
      if (href === "/sacred-journeys") {
        const journeysFallback = fallback.departments.find(
          (d) => d.href === "/sacred-journeys",
        )!;
        return {
          ...dept,
          size: "standard" as const,
          standfirst: journeysFallback.standfirst,
          plate: journeysFallback.plate,
        };
      }
      return { ...dept, size: "standard" as const };
    })
    .filter((dept): dept is NonNullable<typeof dept> => dept !== undefined);
  const departments = homepageDepartments;
  const authoritySignals = cms?.authoritySignals?.length
    ? cms.authoritySignals
    : fallback.authoritySignals;
  const correspondence = cms?.correspondence || fallback.correspondence;
  const institutionStatement =
    cms?.institutionStatement || fallback.institutionStatement;

  return (
    <div className="arrival-v2">
      <JsonLd description={ui("jsonLdDescription")} />
      <a href="#main-content" className="skip-link">
        {ui("skipToContent")}
      </a>

      {/* ═══ § 1 · THRESHOLD CINEMATIC HERO ═══ */}
      <CinematicHero
        id="main-content"
        src="/photography/institution-hero.jpg"
        alt={ui("thresholdAlt")}
        statement={ui("thresholdStatement")}
        qualifier={ui("thresholdQualifier")}
      />

      {/* ═══ LATEST ADDITIONS — early editorial cue after threshold ═══ */}
      <Reveal>
        <HomepageLatestAdditions locale={locale} />
      </Reveal>

      {/* ═══ SEASONAL AWARENESS — appears only during sacred seasons ═══ */}
      {season !== "standard" && (
        <Reveal>
          <section
            className="arrival-section"
            aria-label={seasonal("currentSeason", { label: seasonLabel })}
            style={{ paddingBlock: "var(--space-8)", textAlign: "center" }}
          >
            <div className="arrival-container">
              <p
                className="type-eyebrow-v2"
                style={{
                  color: "var(--brass)",
                  marginBlockEnd: "var(--space-4)",
                }}
              >
                {seasonLabel}
              </p>
              {seasonGreeting && (
                <p
                  className="type-standfirst"
                  style={{
                    maxInlineSize: "50ch",
                    marginInline: "auto",
                    fontStyle: "italic",
                  }}
                >
                  {seasonGreeting}
                </p>
              )}
              {hijriDate && (
                <p
                  className="type-folio"
                  style={{
                    color: "var(--muted)",
                    marginBlockStart: "var(--space-4)",
                  }}
                >
                  {hijriDate}
                </p>
              )}
            </div>
          </section>
        </Reveal>
      )}

      {/* ═══ § 3 · MISSION & VISION ═══ */}
      <Reveal>
        <section
          id="institutional-purpose"
          className="arrival-section institutional-purpose"
          aria-labelledby="institutional-purpose-heading"
        >
          <div className="arrival-container">
            <div className="arrival-grid">
              <div className="arrival-rail">
                <SectionStamp numeral="III" />
              </div>
              <div className="institutional-purpose__inner">
                <div className="section-stamp-mobile institutional-purpose__stamp">
                  <SectionStamp numeral="III" />
                </div>

                <h2 id="institutional-purpose-heading" className="sr-only">
                  {ui("foundingCovenant.missionLabel")}
                  {" · "}
                  {ui("foundingCovenant.visionLabel")}
                </h2>

                <div className="founding-covenant__mission-vision">
                  <article
                    className="founding-covenant__column"
                    aria-labelledby="founding-mission-heading"
                  >
                    <h3
                      id="founding-mission-heading"
                      className="type-eyebrow-v2 founding-covenant__column-label"
                    >
                      {ui("foundingCovenant.missionLabel")}
                    </h3>
                    <p className="type-body-v2 founding-covenant__column-body">
                      {ui("foundingCovenant.mission")}
                    </p>
                  </article>

                  <article
                    className="founding-covenant__column"
                    aria-labelledby="founding-vision-heading"
                  >
                    <h3
                      id="founding-vision-heading"
                      className="type-eyebrow-v2 founding-covenant__column-label"
                    >
                      {ui("foundingCovenant.visionLabel")}
                    </h3>
                    <p className="type-body-v2 founding-covenant__column-body">
                      {ui("foundingCovenant.vision")}
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ § 4 · ON THE TRADITION (Ch. 9.4) ═══ */}
      <Reveal>
        <section
          className="arrival-section arrival-band-deep arrival-tradition"
          aria-labelledby="tradition-heading"
        >
          <div className="arrival-container">
            <div className="arrival-grid">
              <div className="arrival-rail">
                <SectionStamp numeral="IV" />
              </div>
              <div className="arrival-measure">
                <div className="section-stamp-mobile arrival-tradition__stamp">
                  <SectionStamp numeral="IV" label={tradition.stamp} />
                </div>

                <h2
                  id="tradition-heading"
                  className="type-eyebrow-v2 arrival-tradition__heading"
                >
                  {tradition.stamp}
                </h2>

                <p className="type-standfirst arrival-tradition__standfirst">
                  {tradition.standfirst}
                </p>

                {tradition.body.map((paragraph: string, i: number) => (
                  <p
                    key={i}
                    className="type-body-v2 arrival-tradition__paragraph"
                  >
                    {paragraph}
                  </p>
                ))}

                <div className="arrival-tradition__quote">
                  <ArrivalPullQuote
                    text={tradition.pullQuote.text}
                    attribution={tradition.pullQuote.attribution}
                    source={tradition.pullQuote.source}
                    dark
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ TASK PATHWAYS — intention before department architecture ═══ */}
      <Reveal>
        <TaskPathways locale={locale} />
      </Reveal>

      {/* ═══ § 5 · THE DEPARTMENTS (Ch. 9.5) ═══ */}
      <Reveal>
        <section
          className="arrival-section"
          aria-labelledby="departments-heading"
          id="departments"
        >
          <div className="arrival-container">
            <div className="arrival-grid">
              <div className="arrival-rail">
                <SectionStamp numeral="V" />
              </div>
              <div>
                <div
                  className="section-stamp-mobile"
                  style={{ marginBlockEnd: "var(--space-6)" }}
                >
                  <SectionStamp numeral="V" label={ui("departmentsStamp")} />
                </div>

                <h2 id="departments-heading" className="sr-only">
                  {ui("departmentsHeading")}
                </h2>

                <div className="dept-grid">
                  {homepageDepartments.map((dept, i) => (
                    <Reveal key={dept.href} delay={i * 80}>
                      <DepartmentCard
                        order={dept.order}
                        nameEn={dept.nameEn}
                        nameAr={dept.nameAr}
                        standfirst={dept.standfirst}
                        href={dept.href}
                        plate={dept.plate}
                        size={dept.size}
                        locale={locale}
                      />
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ FOUNDING COVENANT — institutional philosophy before credentials ═══ */}
      <FoundingCovenant locale={locale} />

      {/* ═══ § 6 · AUTHORITY SIGNALS (Ch. 9.6) ═══ */}
      <AuthorityBand items={authoritySignals} />

      {/* ═══ § 7 · CORRESPONDENCE (Ch. 9.7) ═══ */}
      <Reveal>
        <section
          className="arrival-section"
          aria-labelledby="correspondence-heading"
        >
          <div className="arrival-container">
            <div className="arrival-grid">
              <div className="arrival-rail">
                <SectionStamp numeral="VII" />
              </div>
              <div>
                <div
                  className="section-stamp-mobile"
                  style={{ marginBlockEnd: "var(--space-6)" }}
                >
                  <SectionStamp
                    numeral="VII"
                    label={ui("correspondenceStamp")}
                  />
                </div>
                <h2 id="correspondence-heading" className="sr-only">
                  {ui("correspondenceHeading")}
                </h2>
                <CorrespondenceForm content={correspondence} />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ § 7 · FOOTER ISNĀD (Ch. 9.8) ═══ */}
      <footer className="arrival-section arrival-band-deep" role="contentinfo">
        <div className="arrival-container">
          <IsnadRule variant="footer" nodePosition={0.5} />

          <p
            className="type-body-v2"
            style={{
              marginBlockStart: "var(--space-8)",
              maxInlineSize: "60ch",
              color: "var(--paper-on-deep)",
            }}
          >
            {institutionStatement}
          </p>

          <nav
            style={{ marginBlockStart: "var(--space-10)" }}
            aria-label={ui("departmentsNavAria")}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-6)",
              }}
            >
              {departments.map((dept) => (
                <Link
                  key={dept.href}
                  href={dept.href}
                  className="arrival-link"
                  style={{ color: "var(--paper-on-deep)" }}
                >
                  <span
                    className="type-folio-v2"
                    style={{ color: "var(--brass)", marginInlineEnd: "0.5em" }}
                  >
                    {["I", "II", "III", "IV"][dept.order - 1]}
                  </span>
                  <span
                    className="type-caption"
                    style={{ color: "var(--paper-on-deep)" }}
                  >
                    {dept.nameEn}
                  </span>
                </Link>
              ))}
            </div>
          </nav>

          <div
            style={{
              marginBlockStart: "var(--space-10)",
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-6)",
            }}
          >
            <Link
              href="/charter"
              className="arrival-link type-caption"
              style={{ color: "var(--paper-on-deep)" }}
            >
              {ui("about")}
            </Link>
            <Link
              href="/correspondence"
              className="arrival-link type-caption"
              style={{ color: "var(--paper-on-deep)" }}
            >
              {ui("contact")}
            </Link>
          </div>

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
            {hijriDate && <> · {hijriDate}</>}
            {" · "}
            {ui("footerColophon")}
          </p>
        </div>
      </footer>
    </div>
  );
}
