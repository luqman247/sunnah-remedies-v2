"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Department } from "@/lib/navigation/site-structure";
import { DEPARTMENT_ID_NAV_KEYS } from "@/lib/i18n/chrome-labels";
import {
  DEPARTMENT_SECTION_MESSAGE_KEYS,
  type DepartmentSectionMessageRef,
} from "@/lib/i18n/department-nav-labels";

interface DepartmentNavProps {
  department: Department;
  currentHref?: string;
}

export function DepartmentNav({ department, currentHref }: DepartmentNavProps) {
  const t = useTranslations("departmentNav");
  const tNav = useTranslations("nav");
  const tApothecary = useTranslations("apothecary");
  const tAcademy = useTranslations("academy");
  const tJourneys = useTranslations("journeys");
  const tDua = useTranslations("duaDhikr");
  const tInstitution = useTranslations("institutionNav");
  const tConsultations = useTranslations("consultations");

  const navKey = DEPARTMENT_ID_NAV_KEYS[department.id];
  const departmentLabel = navKey ? tNav(navKey as never) : department.label;

  function resolve(ref: DepartmentSectionMessageRef): string {
    switch (ref.namespace) {
      case "apothecary":
        return tApothecary(ref.key as never);
      case "academy":
        return tAcademy(ref.key as never);
      case "journeys":
        return tJourneys(ref.key as never);
      case "duaDhikr":
        return tDua(ref.key as never);
      case "institutionNav":
        return tInstitution(ref.key as never);
      case "nav":
        return tNav(ref.key as never);
      case "consultations":
        return tConsultations(ref.key as never);
      default:
        return ref.key;
    }
  }

  function sectionLabel(href: string, fallback: string): string {
    const mapped = DEPARTMENT_SECTION_MESSAGE_KEYS[href];
    if (!mapped) return fallback;
    try {
      return resolve(mapped);
    } catch {
      return fallback;
    }
  }

  return (
    <nav className="dept-nav" aria-label={t("sectionsAriaLabel", { department: departmentLabel })}>
      <p className="type-eyebrow dept-nav__label">{departmentLabel}</p>
      <ol className="dept-nav__list">
        {department.sections.map((section) => {
          const isCurrent = currentHref === section.href;
          return (
            <li key={section.href}>
              <Link
                href={section.href}
                className={`dept-nav__link ${isCurrent ? "dept-nav__link--current" : ""}`}
                aria-current={isCurrent ? "page" : undefined}
              >
                {sectionLabel(section.href, section.label)}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
