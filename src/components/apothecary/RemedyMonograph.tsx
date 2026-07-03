import { RunningHead } from "@/components/ui/Links";
import { Specimen, SourceMark } from "@/components/ui/Attestation";
import { BotanicalFigure } from "@/components/apothecary/BotanicalFigure";
import { Breadcrumb } from "@/components/apothecary/Breadcrumb";
import { MonographSection, MonographProse, MonographList } from "@/components/apothecary/MonographSection";
import { MonographContents } from "@/components/apothecary/MonographContents";
import { DispensationBlock } from "@/components/apothecary/DispensationBlock";
import { RelatedRemedies } from "@/components/apothecary/RelatedRemedies";
import { FaqSection, ReadingList, PathwaysPanel } from "@/components/apothecary/MonographExtras";
import { Leaf } from "@/components/ui/Leaf";
import type { Remedy, PropheticReference } from "@/lib/content/types";
import { getRelatedRemedies, primaryReference } from "@/lib/content/remedies";

interface RemedyMonographProps {
  remedy: Remedy;
}

function attributionPhrase(ref: PropheticReference): string {
  if (ref.attribution === "revelation") return "Allah says";
  if (ref.attribution === "hadith") return "The Prophet ﷺ said";
  return "The classical authors record";
}

export function RemedyMonograph({ remedy }: RemedyMonographProps) {
  const related = getRelatedRemedies(remedy.slug);
  const primary = primaryReference(remedy);

  return (
    <>
      <Leaf>
        <div className="measure-wide monograph-header">
          <RunningHead section="The Apothecary" folio={remedy.folio} />
          <Breadcrumb
            items={[
              { label: "The Apothecary", href: "/the-apothecary" },
              { label: remedy.name },
            ]}
          />
          <div className="monograph-header__grid">
            <div className="monograph-header__text">
              <h1 className="page-intro__title">{remedy.name}</h1>
              <p className="monograph-header__meta">
                <em>{remedy.transliteration}</em>
                <span aria-hidden="true"> · </span>
                <em>{remedy.botanicalName}</em>
              </p>
              <p className="page-intro__body">{remedy.nature}</p>
            </div>
            <BotanicalFigure variant={remedy.figure} alt={remedy.figureAlt} />
          </div>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide monograph-layout">
          <aside className="monograph-layout__nav">
            <MonographContents />
          </aside>

          <article className="monograph-layout__reading measure">
            <MonographSection id="historical-context" title="Historical context">
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

            <MonographSection id="traditional-usage" title="Traditional usage">
              <MonographList items={remedy.traditionalUsage} />
            </MonographSection>

            <MonographSection id="evidence-informed" title="Within the evidence">
              <MonographProse paragraphs={remedy.evidenceInformed} />
            </MonographSection>

            <MonographSection id="sourcing" title="Sourcing">
              <MonographList items={remedy.sourcing} />
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

            <MonographSection id="honest-limits" title="Honest limits">
              <MonographList items={remedy.honestLimits} />
            </MonographSection>

            <FaqSection items={remedy.faq} />
            <RelatedRemedies remedies={related} />
            <ReadingList items={remedy.suggestedReading} />
            <PathwaysPanel pathways={remedy.pathways} />
            <DispensationBlock remedy={remedy} />
          </article>
        </div>
      </Leaf>
    </>
  );
}
