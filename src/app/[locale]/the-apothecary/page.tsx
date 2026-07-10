import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { Leaf } from "@/components/ui/Leaf";
import { DepartmentNav } from "@/components/ui/DepartmentNav";
import { PageIntro } from "@/components/ui/PageIntro";
import { GoLink } from "@/components/ui/Links";
import { apothecary } from "@/sanity/lib/fetch";
import {
  CinematicHero,
  EditorialFeature,
  InstitutionalDivider,
} from "@/components/editorial/Editorial";
import { RotatingPullQuote } from "@/components/editorial/RotatingPullQuote";
import { apothecaryDeclarations } from "@/lib/content/sections/apothecary-declarations";
import { listFeaturedRemedies } from "@/lib/apothecary/service";
import { FALLBACK_PHOTOGRAPHY } from "@/lib/apothecary/media";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("theApothecary", "/the-apothecary");
}

export default async function ApothecaryPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const featured = await listFeaturedRemedies(locale, 3);

  return (
    <>
      <CinematicHero
        src="/photography/apothecary-hero.jpg"
        alt="An apothecary dispensary: amber glass vessels of honey and oils arranged on aged wooden shelving beside dried medicinal herbs and a stone mortar"
        statement="The ordered cabinet"
        qualifier="A dispensary where each remedy carries a monograph — historical context, Prophetic reference where sound, traditional use, stated limits, and provenance. Reading precedes dispensation"
      />

      <Leaf>
        <div className="measure-wide">
          <PageIntro
            section="The Apothecary"
            folio="i"
            title="Provision by hand"
            lede="The material arm of the institute — a cabinet of simples and preparations, each documented to source"
          >
            <p>
              This is not a shop. It is a dispensary governed by the same
              principles of scholarship that govern the Academy and the Library
              Every remedy is documented in a monograph before it is offered:
              origin, harvest, laboratory analysis, Prophetic reference with
              grade, traditional scholarly commentary, contraindications, and
              clear limits. We dispense means and state what we do not know with
              the same care as what we do
            </p>
          </PageIntro>
        </div>
      </Leaf>

      <InstitutionalDivider />

      <Leaf>
        <div className="measure-wide">
          {featured.map((remedy, index) => {
            const photo =
              remedy.imageSrc ||
              FALLBACK_PHOTOGRAPHY[remedy.slug]?.src ||
              "/photography/apothecary-hero.jpg";
            const alt =
              remedy.imageAlt ||
              FALLBACK_PHOTOGRAPHY[remedy.slug]?.alt ||
              remedy.name;
            return (
              <EditorialFeature
                key={remedy.slug}
                src={photo}
                alt={alt}
                reverse={index % 2 === 1}
              >
                <p className="type-eyebrow" style={{ color: "var(--gilt)" }}>
                  From the cabinet
                </p>
                <h3 className="type-title" style={{ margin: 0 }}>
                  {remedy.name}
                </h3>
                <p className="type-body">
                  {remedy.institutionalSummary || remedy.nature}
                </p>
                <div>
                  <GoLink href={`/the-apothecary/${remedy.slug}`}>
                    Read the monograph
                  </GoLink>
                </div>
              </EditorialFeature>
            );
          })}
        </div>
      </Leaf>

      <Leaf variant="grave">
        <div className="measure grave-block">
          <RotatingPullQuote
            statements={apothecaryDeclarations}
            interval={15000}
            dark
          />
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide">
          <DepartmentNav department={apothecary} />
        </div>
      </Leaf>
    </>
  );
}
