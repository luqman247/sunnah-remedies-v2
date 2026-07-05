"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Department } from "@/lib/navigation/site-structure";

interface DepartmentNavProps {
  department: Department;
  currentHref?: string;
}

export function DepartmentNav({ department, currentHref }: DepartmentNavProps) {
  const t = useTranslations("departmentNav");

  return (
    <nav className="dept-nav" aria-label={t("sectionsAriaLabel", { department: department.label })}>
      <p className="type-eyebrow dept-nav__label">{department.label}</p>
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
                {section.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
