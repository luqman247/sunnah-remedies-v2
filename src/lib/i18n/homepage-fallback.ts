import type { AppLocale } from "@/i18n/locales";
import { getTranslations } from "next-intl/server";

export async function buildHomepageFallback(locale: AppLocale) {
  const t = await getTranslations({ locale, namespace: "homepage" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  const plateDefaults = {
    status: "final" as const,
    composition: "Wide shot, layered depth",
    lighting: "North window, diffused",
  };

  return {
    eyebrow: t("eyebrow"),
    arrivalArabic: "\u0637\u0650\u0628\u0651\u064F \u0671\u0644\u0646\u0651\u064E\u0628\u064E\u0648\u064A\u0651",
    arrivalEnglish: t("arrivalEnglish"),
    standfirst: t("standfirst"),
    enterLabel: t("enterLabel"),
    enterHref: t("enterHref"),
    tradition: {
      stamp: t("traditionStamp"),
      standfirst: t("traditionStandfirst"),
      body: [t("traditionBody0"), t("traditionBody1")],
      pullQuote: {
        text: t("pullQuoteText"),
        attribution: t("pullQuoteAttribution"),
        source: t("pullQuoteSource"),
      },
    },
    departments: [
      {
        order: 1,
        nameEn: nav("knowledgeLibrary"),
        nameAr: "\u0645\u0643\u062A\u0628\u0629 \u0627\u0644\u0639\u0644\u0645",
        standfirst: t("deptKnowledgeStandfirst"),
        href: "/knowledge-library",
        size: "standard" as const,
        plate: {
          ...plateDefaults,
          purpose: t("deptKnowledgePlatePurpose"),
          mood: "Contemplative",
          image: { url: "/photography/reading-room.jpg" },
          alt: t("deptKnowledgePlateAlt"),
        },
      },
      {
        order: 2,
        nameEn: nav("theAcademy"),
        nameAr: "\u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629",
        standfirst: t("deptAcademyStandfirst"),
        href: "/the-academy",
        size: "standard" as const,
        plate: {
          ...plateDefaults,
          purpose: t("deptAcademyPlatePurpose"),
          composition: "Medium shot, eye level",
          lighting: "Morning light, clinical",
          mood: "Disciplined",
          image: { url: "/photography/academy-learning.jpg" },
          alt: t("deptAcademyPlateAlt"),
        },
      },
      {
        order: 3,
        nameEn: nav("theApothecary"),
        nameAr: "\u0627\u0644\u0635\u064A\u062F\u0644\u064A\u0629",
        standfirst: t("deptApothecaryStandfirst"),
        href: "/the-apothecary",
        size: "standard" as const,
        plate: {
          status: "final" as const,
          purpose: t("deptApothecaryPlatePurpose"),
          composition: "Detail shot, shallow depth",
          lighting: "Warm side light",
          mood: "Craft",
          image: { url: "/photography/apothecary-hero.jpg" },
          alt: t("deptApothecaryPlateAlt"),
        },
      },
      {
        order: 4,
        nameEn: nav("sacredJourneys"),
        nameAr: "\u0627\u0644\u0631\u062D\u0644\u0627\u062A \u0627\u0644\u0645\u0642\u062F\u0633\u0629",
        standfirst: t("deptJourneysStandfirst"),
        href: "/sacred-journeys",
        size: "standard" as const,
        plate: {
          status: "final" as const,
          purpose: t("deptJourneysPlatePurpose"),
          composition: "Architectural detail, shallow depth",
          lighting: "Warm side light, golden hour",
          mood: "Reverent",
          image: { url: "/photography/sacred-journeys-editorial.jpg" },
          alt: t("deptJourneysPlateAlt"),
        },
      },
    ],
    authoritySignals: [
      { label: t("authorityYears"), value: null, note: undefined },
      { label: t("authorityStudents"), value: null, note: undefined },
      { label: t("authorityCountries"), value: null, note: undefined },
      { label: t("authorityPublications"), value: null, note: undefined },
    ],
    correspondence: {
      heading: t("correspondenceHeadingText"),
      body: t("correspondenceBody"),
      placeholder: t("correspondencePlaceholder"),
      consentText: t("correspondenceConsent"),
      successText: t("correspondenceSuccess"),
    },
    institutionStatement: t("institutionStatement"),
  };
}

export async function getHomepageUi(locale: AppLocale) {
  return getTranslations({ locale, namespace: "homepage" });
}
