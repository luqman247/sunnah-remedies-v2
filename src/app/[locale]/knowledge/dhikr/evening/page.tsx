import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { SectionPage } from "@/components/ui/SectionPage";
import { DhikrTimeNavigation } from "@/components/dhikr/DhikrTimeNavigation";
import { knowledgeLibrary } from "@/sanity/lib/fetch";
import "./evening-dhikr.css";

/**
 * Evening Dhikr — public route shell.
 *
 * The Evening collection has not yet completed editorial or scholarly review.
 * This page publishes an honest empty shell only: shared Morning/Evening
 * navigation, a clear heading, a review-status notice, and a refined empty
 * state. It never fabricates duas, copies Morning entries, or claims that
 * content is verified or approved.
 *
 * When Evening content is ready, it must enter through the same public-safe
 * publication chokepoints used by Morning Dhikr — never via staff fetch
 * modules or the Morning research register.
 */

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("dhikrEvening", "/knowledge/dhikr/evening");
}

export default async function EveningDhikrPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dhikrEvening");
  const tNav = await getTranslations("nav");

  return (
    <SectionPage
      department={knowledgeLibrary}
      folio="iv"
      currentHref="/knowledge/dhikr/evening"
      breadcrumb={[
        { label: tNav("knowledgeLibrary"), href: "/knowledge-library" },
        { label: t("breadcrumb") },
      ]}
      intro={<DhikrTimeNavigation activeTime="evening" />}
    >
      <section
        aria-labelledby="evening-dhikr-review-heading"
        className="evening-dhikr-review-notice"
      >
        <h2 id="evening-dhikr-review-heading" className="section-label">
          {t("reviewStatusHeading")}
        </h2>
        <p className="type-body">{t("reviewStatusNotice")}</p>
      </section>

      <section
        aria-labelledby="evening-dhikr-empty-heading"
        className="evening-dhikr-empty-state"
      >
        <h2 id="evening-dhikr-empty-heading" className="evening-dhikr-empty-state__heading">
          {t("emptyState.heading")}
        </h2>
        <p className="type-body">{t("emptyState.body")}</p>
      </section>
    </SectionPage>
  );
}
