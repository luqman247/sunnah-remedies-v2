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
import type { Remedy, PropheticReference } from "@/lib/content/types";
import { getRelatedRemedies, primaryReference } from "@/lib/content/remedies";

interface RemedyMonographProps {
  remedy: Remedy;
}

function attributionPhrase(ref: PropheticReference): string {
  if (ref.attribution === "revelation") return "Allah says";
  if (ref.attribution === "hadith") return "The Prophet ﷺ said";
  return "Classical authorities record";
}

export function RemedyMonograph({ remedy }: RemedyMonographProps) {
  const related = getRelatedRemedies(remedy.slug);
  const primary = primaryReference(remedy);

  return (
    <>
      <Leaf>
        <div className="measure-wide monograph-header monograph-header--museum">
          <RunningHead section="The Apothecary" folio={remedy.folio} />
          <Breadcrumb
            items={[
              { label: "The Apothecary", href: "/the-apothecary" },
              { label: "Remedy Monographs", href: "/the-apothecary/monographs" },
              { label: remedy.name },
            ]}
          />
          <div className="monograph-header__grid">
            <div className="monograph-header__text">
              <p className="type-micro monograph-header__folio">Remedy monograph · {remedy.folio}</p>
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

      <Leaf variant="inset">
        <div className="measure-wide monograph-layout monograph-layout--ledger">
          <aside className="monograph-layout__nav">
            <MonographContents />
          </aside>

          <article className="monograph-layout__reading measure">
            <section id="institutional-summary" className="monograph-section monograph-plaque">
              <SectionLabel>Institutional summary</SectionLabel>
              <p className="type-body-l monograph-plaque__text">{remedy.institutionalSummary}</p>
            </section>

            <MonographSection id="historical-context" title="Historical use">
              <MonographProse paragraphs={remedy.historicalContext} />
            </MonographSection>

            <MonographSection id="prophetic-tradition" title="Prophetic tradition">
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

            <MonographSection id="traditional-scholarship" title="Traditional scholarship">
              <MonographProse paragraphs={remedy.traditionalScholarship} />
            </MonographSection>

            <MonographSection id="traditional-usage" title="Traditional usage">
              <MonographList items={remedy.traditionalUsage} />
            </MonographSection>

            <EvidenceSection evidence={remedy.evidence} />

            <MonographSection id="provenance" title="Origin, cultivation, and harvesting">
              <h3 className="programme-subheading">Origin</h3>
              <MonographList items={remedy.provenance.origin} />
              <h3 className="programme-subheading">Cultivation</h3>
              <MonographList items={remedy.provenance.cultivation} />
              <h3 className="programme-subheading">Harvesting</h3>
              <MonographList items={remedy.provenance.harvesting} />
            </MonographSection>

            <MonographSection id="laboratory-verification" title="Laboratory verification">
              <MonographList items={remedy.laboratoryVerification} />
            </MonographSection>

            <MonographSection id="quality-assurance" title="Quality assurance">
              <MonographList items={remedy.qualityAssurance} />
            </MonographSection>

            <MonographSection id="storage" title="Storage">
              <MonographList items={remedy.storage} />
            </MonographSection>

            <MonographSection id="preparation" title="Preparation">
              <MonographList items={remedy.preparation} />
            </MonographSection>

            <MonographSection id="suggested-use" title="Suggested use">
              <p className="type-small evidence-section__intro">
                Offered as a traditional dietary means and not as treatment for a
                diagnosed medical condition.
              </p>
              <MonographList items={remedy.suggestedUse} />
            </MonographSection>

            <MonographSection id="contraindications" title="Contraindications">
              <MonographList items={remedy.contraindications} />
            </MonographSection>

            <MonographSection id="photography" title="Photography guidance">
              <MonographList items={remedy.photographyDirection} />
            </MonographSection>

            <MonographSection id="packaging" title="Packaging">
              <MonographList items={remedy.packaging} />
            </MonographSection>

            <MonographSection id="shipping" title="Shipping">
              <MonographList items={remedy.shipping} />
            </MonographSection>

            <MonographSection id="returns" title="Returns">
              <MonographList items={remedy.returns} />
            </MonographSection>

            <MonographSection id="customer-support" title="Customer support">
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
