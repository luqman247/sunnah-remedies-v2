import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { PreFooter, Footer } from "./Footer";
import { SeasonalMark } from "@/components/institutional/SeasonalMark";

type FooterTranslator = Awaited<ReturnType<typeof getTranslations<"footer">>>;
type NavTranslator = Awaited<ReturnType<typeof getTranslations<"nav">>>;

function buildLocalisedFooterColumns(t: FooterTranslator, tNav: NavTranslator) {
  return [
    {
      title: t("columnPillars"),
      links: [
        { label: tNav("theApothecary"), href: "/the-apothecary" },
        { label: tNav("theAcademy"), href: "/the-academy" },
        { label: tNav("sacredJourneys"), href: "/sacred-journeys" },
        { label: tNav("knowledgeLibrary"), href: "/knowledge-library" },
      ],
    },
    {
      title: t("columnInstitution"),
      links: [
        { label: t("linkInstitute"), href: "/institute" },
        { label: t("linkCharter"), href: "/charter" },
        { label: t("linkCalendar"), href: "/calendar" },
        { label: t("linkExhibitions"), href: "/exhibitions" },
        { label: t("linkResearch"), href: "/research" },
        { label: t("linkPress"), href: "/press" },
      ],
    },
    {
      title: t("columnConnect"),
      links: [
        { label: tNav("correspondence"), href: "/correspondence" },
        { label: t("linkAcademyEnrolment"), href: "/the-academy/enrolment" },
        { label: t("linkJourneyRegistration"), href: "/sacred-journeys/registration" },
      ],
    },
    {
      title: t("columnLegal"),
      links: [
        { label: t("linkPrivacy"), href: "/charter" },
        { label: t("linkTerms"), href: "/charter" },
        { label: t("linkAccessibility"), href: "/charter" },
      ],
    },
  ];
}

/**
 * Global footer chrome — visitor-facing labels always from message catalogs
 * for the layout locale. Brand name "Sunnah Remedies" remains English.
 */
export async function FooterServer({ locale }: { locale: AppLocale }) {
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "footer" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  const columns = buildLocalisedFooterColumns(t, tNav);

  return (
    <>
      <PreFooter action={{ label: t("requestConsultation"), href: "/consultations" }} />
      <Footer
        columns={columns}
        closingStatement={t("closing")}
        colophon={t("colophon")}
        tagline={t("tagline")}
        foundingStatement={t("foundingStatement")}
      />
      <SeasonalMark />
    </>
  );
}
