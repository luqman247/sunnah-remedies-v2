import { getTranslations } from "next-intl/server";
import { RunningHead } from "@/components/ui/Links";
import { Specimen, SourceMark } from "@/components/ui/Attestation";
import { SectionLabel } from "@/components/ui/PageIntro";
import { BotanicalFigure } from "@/components/apothecary/BotanicalFigure";
import { Breadcrumb } from "@/components/apothecary/Breadcrumb";
import {
  MonographSection,
  MonographProse,
  MonographList,
} from "@/components/apothecary/MonographSection";
import { MonographContents } from "@/components/apothecary/MonographContents";
import { MonographLedger } from "@/components/apothecary/MonographLedger";
import { DispensationBlock } from "@/components/apothecary/DispensationBlock";
import { RelatedRemedies } from "@/components/apothecary/RelatedRemedies";
import {
  FaqSection,
  EvidenceSection,
  AcademyLessons,
  KnowledgeLibraryLinks,
  PathwaysPanel,
} from "@/components/apothecary/MonographExtras";
import { Leaf } from "@/components/ui/Leaf";
import { EditorialPhoto, PullQuote } from "@/components/editorial/Editorial";
import type { Remedy, PropheticReference } from "@/lib/content/types";
import { primaryReference } from "@/lib/content/remedies";
import { FALLBACK_PHOTOGRAPHY } from "@/lib/apothecary/media";

interface RemedyMonographProps {
  remedy: Remedy;
  related?: Remedy[];
}

export async function RemedyMonograph({
  remedy,
  related = [],
}: RemedyMonographProps) {
  const t = await getTranslations("apothecary.monograph");
  const primary = primaryReference(remedy);

  const editorialSrc =
    remedy.imageSrc || FALLBACK_PHOTOGRAPHY[remedy.slug]?.src || null;
  const editorialAlt =
    remedy.imageAlt ||
    FALLBACK_PHOTOGRAPHY[remedy.slug]?.alt ||
    remedy.figureAlt ||
    remedy.name;

  function attributionPhrase(ref: PropheticReference): string {
    if (ref.attribution === "revelation") return t("attributionRevelation");
    if (ref.attribution === "hadith") return t("attributionHadith");
    return t("attributionClassical");
  }

  return (
    <>
      <Leaf>
        <div className="measure-wide monograph-header monograph-header--museum">
          <RunningHead section={t("section")} folio={remedy.folio} />
          <Breadcrumb
            items={[
              { label: t("section"), href: "/the-apothecary" },
              { label: t("remedyMonographs"), href: "/the-apothecary/monographs" },
              { label: remedy.name },
            ]}
          />
          <div className="monograph-header__grid">
            <div className="monograph-header__text">
              <p className="type-micro monograph-header__folio">
                {t("folioPrefix")} · {remedy.folio}
              </p>
              <h1 className="page-intro__title">{remedy.name}</h1>
              <p className="monograph-header__meta">
                <em>{remedy.transliteration}</em>
                <span aria-hidden="true"> · </span>
                <em>{remedy.botanicalName}</em>
              </p>
              <p className="monograph-header__nature type-body-l">{remedy.nature}</p>
            </div>
            <figure className="monograph-header__figure">
              <BotanicalFigure variant={remedy.figure} alt={remedy.figureAlt} />
              <figcaption className="type-small monograph-header__caption">
                {remedy.figureAlt}
              </figcaption>
            </figure>
          </div>
        </div>
      </Leaf>

      {editorialSrc && (
        <EditorialPhoto
          src={editorialSrc}
          alt={editorialAlt}
          aspect="landscape"
          fullBleed
          caption={`${remedy.name} — ${t("editorialPhotography")}`}
        />
      )}

      {remedy.videoUrl && (
        <Leaf>
          <div className="measure-wide">
            <video
              controls
              playsInline
              preload="metadata"
              src={remedy.videoUrl}
              style={{ width: "100%", maxHeight: "70vh", background: "var(--ink)" }}
              aria-label={`${remedy.name} video`}
            >
              <track kind="captions" />
            </video>
          </div>
        </Leaf>
      )}

      <Leaf variant="inset">
        <div className="measure-wide monograph-layout monograph-layout--ledger">
          <aside className="monograph-layout__nav">
            <MonographContents />
          </aside>

          <article className="monograph-layout__reading measure">
            <section
              id="institutional-summary"
              className="monograph-section monograph-plaque"
            >
              <SectionLabel>{t("institutionalSummary")}</SectionLabel>
              <p className="type-body-l monograph-plaque__text">
                {remedy.institutionalSummary}
              </p>
            </section>

            <MonographSection id="historical-context" title={t("historicalUse")}>
              <MonographProse paragraphs={remedy.historicalContext} />
            </MonographSection>

            <MonographSection id="prophetic-tradition" title={t("propheticTradition")}>
              {remedy.propheticReferences.map((ref) => (
                <blockquote key={ref.siglum} className="prophetic-quote">
                  <p className="type-body-l">
                    {attributionPhrase(ref)}: &ldquo;{ref.statement}&rdquo;
                    <SourceMark
                      siglum={ref.siglum}
                      source={`${ref.grade} · ${ref.source}`}
                    />
                  </p>
                  {ref.transliteration && (
                    <p className="type-body prophetic-quote__transliteration">
                      {ref.transliteration}
                    </p>
                  )}
                </blockquote>
              ))}
              {primary && (
                <Specimen
                  statement={primary.statement}
                  transliteration={primary.transliteration}
                  grade={primary.grade}
                  source={primary.source}
                  standing={primary.standing}
                />
              )}
            </MonographSection>

            <MonographSection
              id="traditional-scholarship"
              title={t("traditionalScholarship")}
            >
              <MonographProse paragraphs={remedy.traditionalScholarship} />
            </MonographSection>

            <MonographSection id="traditional-usage" title={t("traditionalUsage")}>
              <MonographList items={remedy.traditionalUsage} />
            </MonographSection>

            <EvidenceSection evidence={remedy.evidence} />

            <div className="monograph-section" style={{ marginBottom: "var(--s6)" }}>
              <PullQuote text={t("pullQuoteDocumentation")} />
            </div>

            <MonographSection id="provenance" title={t("provenance")}>
              <h3 className="programme-subheading">{t("origin")}</h3>
              <MonographList items={remedy.provenance.origin} />
              <h3 className="programme-subheading">{t("cultivation")}</h3>
              <MonographList items={remedy.provenance.cultivation} />
              <h3 className="programme-subheading">{t("harvesting")}</h3>
              <MonographList items={remedy.provenance.harvesting} />
            </MonographSection>

            <MonographSection
              id="laboratory-verification"
              title={t("laboratoryVerification")}
            >
              <MonographList items={remedy.laboratoryVerification} />
            </MonographSection>

            <MonographSection id="quality-assurance" title={t("qualityAssurance")}>
              <MonographList items={remedy.qualityAssurance} />
            </MonographSection>

            <MonographSection id="storage" title={t("storage")}>
              <MonographList items={remedy.storage} />
            </MonographSection>

            <MonographSection id="preparation" title={t("preparation")}>
              <MonographList items={remedy.preparation} />
            </MonographSection>

            <MonographSection id="suggested-use" title={t("suggestedUse")}>
              <p className="type-small evidence-section__intro">
                {t("suggestedUseIntro")}
              </p>
              <MonographList items={remedy.suggestedUse} />
            </MonographSection>

            <MonographSection id="contraindications" title={t("contraindications")}>
              <MonographList items={remedy.contraindications} />
            </MonographSection>

            <MonographSection id="photography" title={t("photographyGuidance")}>
              <MonographList items={remedy.photographyDirection} />
            </MonographSection>

            <MonographSection id="packaging" title={t("packaging")}>
              <MonographList items={remedy.packaging} />
            </MonographSection>

            <MonographSection id="shipping" title={t("shipping")}>
              <MonographList items={remedy.shipping} />
            </MonographSection>

            <MonographSection id="returns" title={t("returns")}>
              <MonographList items={remedy.returns} />
            </MonographSection>

            <MonographSection id="customer-support" title={t("customerSupport")}>
              <MonographList items={remedy.customerSupport} />
            </MonographSection>

            <FaqSection items={remedy.faq} />
            <RelatedRemedies remedies={related} />
            <AcademyLessons items={remedy.academyLessons} />
            <KnowledgeLibraryLinks items={remedy.knowledgeLibrary} />
            <PathwaysPanel pathways={remedy.pathways} />
            <DispensationBlock remedy={remedy} />
          </article>

          <MonographLedger remedy={remedy} />
        </div>
      </Leaf>
    </>
  );
}
