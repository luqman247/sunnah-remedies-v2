import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { getHomepage } from "@/sanity/lib/fetch";
import { getCurrentSeason, getHijriDate } from "@/lib/calendar/seasons";
import { IsnadRule } from "@/components/arrival/IsnadRule";
import { Plate } from "@/components/arrival/Plate";
import { SectionStamp } from "@/components/arrival/SectionStamp";
import { Eyebrow } from "@/components/arrival/Eyebrow";
import { ArrivalPullQuote } from "@/components/arrival/ArrivalPullQuote";
import { AuthorityBand } from "@/components/arrival/AuthorityBand";
import { DepartmentCard, DepartmentDivider } from "@/components/arrival/DepartmentCard";
import { CorrespondenceForm } from "@/components/arrival/CorrespondenceForm";
import { Reveal } from "@/components/arrival/Reveal";
import "@/components/arrival/arrival.css";

export const metadata: Metadata = {
  title: "Sunnah Remedies — Institute of Prophetic Medicine",
  description:
    "The world's leading institute of Prophetic Medicine — scholarship, clinical care, and natural therapeutics under one house.",
  openGraph: {
    title: "Sunnah Remedies — Institute of Prophetic Medicine",
    description: "Scholarship, clinical care, and natural therapeutics under one house.",
    type: "website",
    siteName: "Sunnah Remedies",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunnah Remedies — Institute of Prophetic Medicine",
    description: "Scholarship, clinical care, and natural therapeutics under one house.",
  },
  alternates: {
    canonical: "/",
  },
};

function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "EducationalOrganization"],
    name: "Sunnah Remedies",
    description: "An institute of Prophetic Medicine for scholarship, clinical care, and natural therapeutics.",
    url: "https://sunnahremedies.com",
    foundingDate: "2025",
    areaServed: "Worldwide",
    knowsAbout: ["Prophetic Medicine", "Tibb al-Nabawi", "Hijama", "Islamic Medicine"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

const fallback = {
  eyebrow: "EST. ——— · INSTITUTE OF PROPHETIC MEDICINE",
  arrivalArabic: "\u0637\u0650\u0628\u0651\u064F \u0671\u0644\u0646\u0651\u064E\u0628\u064E\u0648\u0650\u064A\u0651",
  arrivalEnglish: "The medicine of the prophetic tradition, kept living",
  standfirst: "An institution for the preservation and responsible transmission of prophetic medicine — grounded in primary-source scholarship, laboratory verification, clinical accountability, and plain limits",
  enterLabel: "Enter the institution",
  enterHref: "#departments",
  tradition: {
    stamp: "ON THE TRADITION",
    standfirst: "What is this discipline, and why does it require an institution?",
    body: [
      "Prophetic Medicine is not folk remedy, not alternative wellness, not a brand opportunity. It is a received body of knowledge — transmitted through authenticated chains, tested against observable evidence, and constrained by the limits its own sources declare",
      "This institution exists because the discipline deserves the same rigour as any established medical tradition: verifiable scholarship, clinical governance, transparent provenance, and patient dignity at every encounter",
    ],
    pullQuote: {
      text: "Healing is from Allah; the remedy is a means",
      attribution: "Prophetic teaching",
      source: "Ṣaḥīḥ al-Bukhārī",
    },
  },
  departments: [
    {
      order: 1,
      nameEn: "Knowledge Library",
      nameAr: "\u0645\u0643\u062A\u0628\u0629 \u0627\u0644\u0639\u0644\u0645",
      standfirst: "The open shelf — monographs, research notes, and patient guides, all graded and cited",
      href: "/knowledge-library",
      size: "standard" as const,
      plate: { status: "final" as const, purpose: "Reading room with scholarly texts", composition: "Wide shot, layered depth", lighting: "North window, diffused", mood: "Contemplative", image: { url: "/photography/reading-room.jpg" }, alt: "A scholarly reading room with open manuscripts and natural light" },
    },
    {
      order: 2,
      nameEn: "The Academy",
      nameAr: "\u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629",
      standfirst: "Clinical education in Hijama and Prophetic therapeutics, structured by isnād",
      href: "/the-academy",
      size: "standard" as const,
      plate: { status: "final" as const, purpose: "Tutorial room with faculty and students", composition: "Medium shot, eye level", lighting: "Morning light, clinical", mood: "Disciplined", image: { url: "/photography/academy-learning.jpg" }, alt: "Students in a scholarly classroom studying anatomical charts and medical texts under natural light" },
    },
    {
      order: 3,
      nameEn: "The Apothecary",
      nameAr: "\u0627\u0644\u0635\u064A\u062F\u0644\u064A\u0629",
      standfirst: "A cabinet of preparations, each documented to source before dispensation",
      href: "/the-apothecary",
      size: "standard" as const,
      plate: { status: "final" as const, purpose: "Dispensary shelves with amber vessels", composition: "Detail shot, shallow depth", lighting: "Warm side light", mood: "Craft", image: { url: "/photography/apothecary-hero.jpg" }, alt: "An apothecary dispensary with amber glass vessels of honey and oils arranged on aged wooden shelving" },
    },
    {
      order: 4,
      nameEn: "Sacred Journeys",
      nameAr: "\u0627\u0644\u0631\u062D\u0644\u0627\u062A \u0627\u0644\u0645\u0642\u062F\u0633\u0629",
      standfirst: "Educational pilgrimage to the Holy Lands — preparation precedes departure, purpose before itinerary. Every journey carries a reading list, a faculty companion, and a clear statement of difficulty",
      href: "/sacred-journeys",
      size: "standard" as const,
      plate: { status: "final" as const, purpose: "Masjid an-Nabawi at golden hour — quiet courtyard and green dome", composition: "Architectural detail, shallow depth", lighting: "Warm side light, golden hour", mood: "Reverent", image: { url: "/photography/sacred-journeys-editorial.jpg" }, alt: "Masjid an-Nabawi at golden hour — warm marble courtyard, green dome, and distant pilgrims in quiet reflection" },
    },
  ],
  authoritySignals: [
    { label: "Years of practice", value: null, note: undefined },
    { label: "Students trained", value: null, note: undefined },
    { label: "Countries served", value: null, note: undefined },
    { label: "Publications", value: null, note: undefined },
  ],
  correspondence: {
    heading: "Receive the institution\u2019s writing",
    body: "Occasional correspondence on scholarship, new monographs, and programme announcements. No frequency promise; no promotional content",
    placeholder: "your@email.address",
    consentText: "You will receive institutional correspondence by email. Unsubscribe at any time by replying or using the link provided",
    successText: "Requested — correspondence will follow",
  },
  institutionStatement: "Knowledge before commerce. Service before profit. Trust before growth. The institution exists for the next generation",
};

export default async function ArrivalPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cms = await getHomepage(locale);
  const { season, label, greeting } = getCurrentSeason();
  const hijriDate = getHijriDate();

  const eyebrow = cms?.eyebrow || fallback.eyebrow;
  const arrivalArabic = cms?.arrivalArabic || fallback.arrivalArabic;
  const arrivalEnglish = cms?.arrivalEnglish || fallback.arrivalEnglish;
  const standfirst = cms?.standfirst || fallback.standfirst;
  const enterLabel = cms?.enterLabel || fallback.enterLabel;
  const enterHref = cms?.enterHref || fallback.enterHref;
  const tradition = cms?.tradition || fallback.tradition;
  const rawDepartments = cms?.departmentCards?.length
    ? cms.departmentCards.map(card => ({
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
              image: card.plate.image?.asset?.url ? { url: card.plate.image.asset.url } : undefined,
              alt: card.plate.alt,
            }
          : { status: "brief" as const, purpose: card.standfirst, composition: "", lighting: "", mood: "" },
      }))
    : fallback.departments;
  const departments = rawDepartments.map((dept) =>
    dept.href === "/sacred-journeys"
      ? {
          ...dept,
          size: "standard" as const,
          plate: fallback.departments.find((d) => d.href === "/sacred-journeys")!.plate,
        }
      : dept,
  );
  const authoritySignals = cms?.authoritySignals?.length ? cms.authoritySignals : fallback.authoritySignals;
  const correspondence = cms?.correspondence || fallback.correspondence;
  const institutionStatement = cms?.institutionStatement || fallback.institutionStatement;

  return (
    <div className="arrival-v2">
      <JsonLd />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* ═══ § 1 · ARRIVAL / HERO (Ch. 9.2) ═══ */}
      <section className="arrival-section" aria-labelledby="arrival-heading" id="main-content">
        <div className="arrival-container">
          <div className="arrival-grid">
            <div className="arrival-rail">
              <SectionStamp numeral="I" />
            </div>
            <div>
              {/* Inline stamp for mobile */}
              <div className="section-stamp-mobile" style={{ marginBlockEnd: "var(--space-6)" }}>
                <SectionStamp numeral="I" />
              </div>

              <div className="choreo-eyebrow">
                <Eyebrow>{eyebrow}</Eyebrow>
              </div>

              <h1 id="arrival-heading" style={{ margin: 0 }}>
                <span className="sr-only">{arrivalEnglish}</span>

                <span className="choreo-arabic" aria-hidden="true" style={{ display: "block", marginBlockStart: "var(--space-8)" }}>
                  <span
                    className="type-arabic-hero"
                    lang="ar"
                    dir="rtl"
                    style={{ display: "block" }}
                  >
                    {arrivalArabic}
                  </span>
                </span>

                <IsnadRule variant="arrival" nodePosition={0.5} animated />

                <span
                  className="type-hero choreo-english"
                  aria-hidden="true"
                  style={{ display: "block" }}
                >
                  {arrivalEnglish}
                </span>
              </h1>

              <p className="type-standfirst choreo-standfirst" style={{ marginBlockStart: "var(--space-6)", maxInlineSize: "60ch" }}>
                {standfirst}
              </p>

              <div className="choreo-standfirst" style={{ marginBlockStart: "var(--space-6)" }}>
                <Link href={enterHref} className="arrival-enter">
                  {enterLabel} <span className="arrow" aria-hidden="true">⟶</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ § 2 · THRESHOLD PLATE (Ch. 9.3) ═══ */}
      <Reveal>
        <section className="arrival-section" style={{ paddingBlockStart: 0 }}>
          <div className="arrival-container">
            <Plate
              asset={{
                status: "final",
                purpose: "The threshold — crossing into the institution",
                composition: "Wide establishing shot, strong architecture, human presence suggested not centred",
                lens: "35mm, deep focus",
                lighting: "Late afternoon, directional warmth",
                mood: "Gravitas",
                image: { url: "/photography/institution-hero.jpg" },
                alt: "Scholarly hands examining an illuminated manuscript of Prophetic medicine beside glass vessels of amber oil and black seed",
              }}
              aspect="16/7"
              priority
            />
          </div>
        </section>
      </Reveal>

      {/* ═══ SEASONAL AWARENESS — appears only during sacred seasons ═══ */}
      {season !== "standard" && (
        <Reveal>
          <section
            className="arrival-section"
            aria-label={`Current season: ${label}`}
            style={{ paddingBlock: "var(--space-8)", textAlign: "center" }}
          >
            <div className="arrival-container">
              <p className="type-eyebrow-v2" style={{ color: "var(--brass)", marginBlockEnd: "var(--space-4)" }}>
                {label}
              </p>
              {greeting && (
                <p className="type-standfirst" style={{ maxInlineSize: "50ch", marginInline: "auto", fontStyle: "italic" }}>
                  {greeting}
                </p>
              )}
              {hijriDate && (
                <p className="type-folio" style={{ color: "var(--muted)", marginBlockStart: "var(--space-4)" }}>
                  {hijriDate}
                </p>
              )}
            </div>
          </section>
        </Reveal>
      )}

      {/* ═══ § 3 · ON THE TRADITION (Ch. 9.4) ═══ */}
      <Reveal>
        <section className="arrival-section arrival-band-deep" aria-labelledby="tradition-heading">
          <div className="arrival-container">
            <div className="arrival-grid">
              <div className="arrival-rail">
                <SectionStamp numeral="II" />
              </div>
              <div className="arrival-measure">
                <div className="section-stamp-mobile" style={{ marginBlockEnd: "var(--space-6)" }}>
                  <SectionStamp numeral="II" label={tradition.stamp} />
                </div>

                <h2 id="tradition-heading" className="type-eyebrow-v2" style={{ color: "var(--paper-on-deep)", marginBlockEnd: "var(--space-8)" }}>
                  {tradition.stamp}
                </h2>

                <p className="type-standfirst" style={{ marginBlockEnd: "var(--space-8)" }}>
                  {tradition.standfirst}
                </p>

                {tradition.body.map((paragraph: string, i: number) => (
                  <p key={i} className="type-body-v2" style={{ marginBlockEnd: "var(--space-5)" }}>
                    {paragraph}
                  </p>
                ))}

                <div style={{ marginBlockStart: "var(--space-10)" }}>
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

      {/* ═══ § 4 · THE DEPARTMENTS (Ch. 9.5) ═══ */}
      <Reveal>
        <section className="arrival-section" aria-labelledby="departments-heading" id="departments">
          <div className="arrival-container">
            <div className="arrival-grid">
              <div className="arrival-rail">
                <SectionStamp numeral="III" />
              </div>
              <div>
                <div className="section-stamp-mobile" style={{ marginBlockEnd: "var(--space-6)" }}>
                  <SectionStamp numeral="III" label="THE DEPARTMENTS" />
                </div>

                <h2 id="departments-heading" className="sr-only">The Departments</h2>

                <div className="dept-grid">
                  {departments.filter(d => d.size === "standard" && d.href !== "/the-apothecary").map((dept, i) => (
                    <Reveal key={dept.href} delay={i * 80}>
                      <DepartmentCard
                        order={dept.order}
                        nameEn={dept.nameEn}
                        nameAr={dept.nameAr}
                        standfirst={dept.standfirst}
                        href={dept.href}
                        plate={dept.plate}
                        size={dept.size}
                      />
                    </Reveal>
                  ))}
                </div>

                <DepartmentDivider />

                <div className="dept-spread">
                  {departments.filter(d => d.href === "/the-apothecary").map((dept) => (
                    <Reveal key={dept.href} delay={160}>
                      <DepartmentCard
                        order={dept.order}
                        nameEn={dept.nameEn}
                        nameAr={dept.nameAr}
                        standfirst={dept.standfirst}
                        href={dept.href}
                        plate={dept.plate}
                        size={dept.size}
                      />
                    </Reveal>
                  ))}
                  {departments.filter(d => d.href === "/sacred-journeys").map((dept) => (
                    <Reveal key={dept.href} delay={240}>
                      <DepartmentCard
                        order={dept.order}
                        nameEn={dept.nameEn}
                        nameAr={dept.nameAr}
                        standfirst={dept.standfirst}
                        href={dept.href}
                        plate={dept.plate}
                        size={dept.size}
                      />
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ § 5 · AUTHORITY SIGNALS (Ch. 9.6) ═══ */}
      <AuthorityBand items={authoritySignals} />

      {/* ═══ § 6 · CORRESPONDENCE (Ch. 9.7) ═══ */}
      <Reveal>
        <section className="arrival-section" aria-labelledby="correspondence-heading">
          <div className="arrival-container">
            <div className="arrival-grid">
              <div className="arrival-rail">
                <SectionStamp numeral="V" />
              </div>
              <div>
                <div className="section-stamp-mobile" style={{ marginBlockEnd: "var(--space-6)" }}>
                  <SectionStamp numeral="V" label="CORRESPONDENCE" />
                </div>
                <h2 id="correspondence-heading" className="sr-only">Correspondence</h2>
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

          <p className="type-body-v2" style={{ marginBlockStart: "var(--space-8)", maxInlineSize: "60ch", color: "var(--paper-on-deep)" }}>
            {institutionStatement}
          </p>

          <nav style={{ marginBlockStart: "var(--space-10)" }} aria-label="Departments">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6)" }}>
              {departments.map((dept) => (
                <Link
                  key={dept.href}
                  href={dept.href}
                  className="arrival-link"
                  style={{ color: "var(--paper-on-deep)" }}
                >
                  <span className="type-folio-v2" style={{ color: "var(--brass)", marginInlineEnd: "0.5em" }}>
                    {["I", "II", "III", "IV"][dept.order - 1]}
                  </span>
                  <span className="type-caption" style={{ color: "var(--paper-on-deep)" }}>
                    {dept.nameEn}
                  </span>
                </Link>
              ))}
            </div>
          </nav>

          <div style={{ marginBlockStart: "var(--space-10)", display: "flex", flexWrap: "wrap", gap: "var(--space-6)" }}>
            <Link href="/charter" className="arrival-link type-caption" style={{ color: "var(--paper-on-deep)" }}>About</Link>
            <Link href="/correspondence" className="arrival-link type-caption" style={{ color: "var(--paper-on-deep)" }}>Contact</Link>
          </div>

          <p className="type-folio-v2" style={{ marginBlockStart: "var(--space-10)", color: "var(--brass)" }}>
            <time dateTime={new Date().toISOString().split("T")[0]}>
              {new Date().getFullYear()} CE
            </time>
            {hijriDate && <> · {hijriDate}</>}
            {" · "}Sunnah Remedies · Institute of Prophetic Medicine
          </p>
        </div>
      </footer>
    </div>
  );
}
