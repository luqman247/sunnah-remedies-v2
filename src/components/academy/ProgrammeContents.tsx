"use client";

import { useTranslations } from "next-intl";

export function ProgrammeContents() {
  const t = useTranslations("academy.programmeView");
  const tCommon = useTranslations("common");
  const tContents = useTranslations("academy.programmeContents");
  const tMonograph = useTranslations("apothecary.monograph");

  const sections = [
    { id: "overview", label: t("overview") },
    { id: "outcomes", label: t("outcomesLabel") },
    { id: "curriculum", label: t("curriculum") },
    { id: "practical", label: t("practicalLabel") },
    { id: "faculty", label: t("faculty") },
    { id: "facilities", label: t("facilities") },
    { id: "clinical-standards", label: t("clinicalStandards") },
    { id: "assessment", label: t("assessment") },
    { id: "certification", label: t("certification") },
    { id: "entry", label: t("entryRequirements") },
    { id: "equipment", label: t("equipment") },
    { id: "handbook", label: t("courseHandbook") },
    { id: "guide", label: t("studentGuide") },
    { id: "gallery", label: t("gallery") },
    { id: "testimonials", label: t("graduateAttestations") },
    { id: "pathways", label: t("graduatePathways") },
    { id: "faq", label: tMonograph("frequentlyAsked") },
    { id: "policies", label: t("policies") },
    { id: "enrolment", label: t("sendApplication") },
  ];

  return (
    <nav className="monograph-contents programme-contents" aria-label={tContents("ariaLabel")}>
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
