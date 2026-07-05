"use client";

import { useTranslations } from "next-intl";

export function MonographContents() {
  const t = useTranslations("apothecary.monograph");
  const tCommon = useTranslations("common");
  const tToc = useTranslations("apothecary.monographToc");

  const sections = [
    { id: "institutional-summary", label: t("institutionalSummary") },
    { id: "historical-context", label: t("historicalUse") },
    { id: "prophetic-tradition", label: t("propheticTradition") },
    { id: "traditional-scholarship", label: t("traditionalScholarship") },
    { id: "traditional-usage", label: t("traditionalUsage") },
    { id: "evidence-informed", label: t("evidenceInformed") },
    { id: "provenance", label: t("provenance") },
    { id: "laboratory-verification", label: t("laboratoryVerification") },
    { id: "quality-assurance", label: t("qualityAssurance") },
    { id: "storage", label: t("storage") },
    { id: "preparation", label: t("preparation") },
    { id: "suggested-use", label: t("suggestedUse") },
    { id: "contraindications", label: t("contraindications") },
    { id: "photography", label: t("photographyGuidance") },
    { id: "packaging", label: t("packaging") },
    { id: "shipping", label: t("shipping") },
    { id: "returns", label: t("returns") },
    { id: "customer-support", label: t("customerSupport") },
    { id: "frequently-asked", label: t("frequentlyAsked") },
    { id: "related-remedies", label: t("relatedRemediesSection") },
    { id: "academy-lessons", label: t("academyLessons") },
    { id: "knowledge-library", label: t("knowledgeLibrarySection") },
    { id: "pathways", label: t("pathways") },
    { id: "dispensation", label: t("dispensationSection") },
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
