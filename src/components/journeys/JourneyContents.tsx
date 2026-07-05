"use client";

import { useTranslations } from "next-intl";

export function JourneyContents() {
  const t = useTranslations("journeys.view");
  const tCommon = useTranslations("common");
  const tToc = useTranslations("journeys.journeyToc");
  const tMonograph = useTranslations("apothecary.monograph");

  const sections = [
    { id: "meaning", label: t("meaning") },
    { id: "preparation", label: t("preparation") },
    { id: "reading", label: t("reading") },
    { id: "packing", label: t("packing") },
    { id: "flights", label: t("flightGuidance") },
    { id: "accommodation", label: t("accommodation") },
    { id: "learning", label: t("learning") },
    { id: "sessions", label: t("educationalSessions") },
    { id: "itinerary", label: t("dailyItinerary") },
    { id: "companionship", label: t("companionship") },
    { id: "guidance", label: t("guidance") },
    { id: "reflection", label: t("reflectionJournals") },
    { id: "health", label: t("healthGuidance") },
    { id: "safety", label: t("safety") },
    { id: "organisation", label: t("organisation") },
    { id: "scholars", label: t("scholarsAndGuides") },
    { id: "gallery", label: t("gallery") },
    { id: "faq", label: tMonograph("frequentlyAsked") },
    { id: "policies", label: t("policies") },
    { id: "registration", label: t("registration") },
  ];

  return (
    <nav className="monograph-contents" aria-label={tToc("ariaLabel")}>
      <p className="type-eyebrow monograph-contents__label">{tCommon("tableOfContents")}</p>
      <ol className="monograph-contents__list">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a href={`#${id}`} className="monograph-contents__link">
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
