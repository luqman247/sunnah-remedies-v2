"use client";

import { useTranslations } from "next-intl";
import { Leaf } from "@/components/ui/Leaf";
import { Breadcrumb } from "@/components/apothecary/Breadcrumb";
import { DepartmentNav } from "@/components/ui/DepartmentNav";
import { PageIntro } from "@/components/ui/PageIntro";
import { sacredJourneys } from "@/lib/navigation/site-structure";

interface JourneySectionPageProps {
  folio: string;
  title: string;
  lede?: string;
  currentHref: string;
  breadcrumbLabel: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}

export function JourneySectionPage({
  folio,
  title,
  lede,
  currentHref,
  breadcrumbLabel,
  intro,
  children,
}: JourneySectionPageProps) {
  const t = useTranslations("journeys");

  return (
    <>
      <Leaf>
        <div className="measure-wide section-page__header">
          <Breadcrumb
            items={[
              { label: t("title"), href: "/sacred-journeys" },
              { label: breadcrumbLabel },
            ]}
          />
          <div className="section-page__layout">
            <aside className="section-page__nav">
              <DepartmentNav department={sacredJourneys} currentHref={currentHref} />
            </aside>
            <div className="section-page__intro">
              <PageIntro section={t("title")} folio={folio} title={title} lede={lede}>
                {intro}
              </PageIntro>
            </div>
          </div>
        </div>
      </Leaf>
      <Leaf variant="inset">
        <div className="measure-wide section-page__body">{children}</div>
      </Leaf>
    </>
  );
}
