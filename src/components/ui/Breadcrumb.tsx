"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { getDepartmentByPath } from "@/lib/navigation/site-structure";
import { isPublicCatalogueProduct } from "@/lib/commerce/public-product-guard";
import {
  DEPARTMENT_ID_NAV_KEYS,
  LOCALE_PATH_SEGMENTS,
  stripLocalePrefixFromPath,
} from "@/lib/i18n/chrome-labels";
import { DEPARTMENT_SECTION_MESSAGE_KEYS } from "@/lib/i18n/department-nav-labels";

export function Breadcrumb() {
  const t = useTranslations("breadcrumbs");
  const tNav = useTranslations("nav");
  const tApothecary = useTranslations("apothecary");
  const tAcademy = useTranslations("academy");
  const tJourneys = useTranslations("journeys");
  const tDua = useTranslations("duaDhikr");
  const tInstitution = useTranslations("institutionNav");
  const pathname = usePathname();
  const normalised = stripLocalePrefixFromPath(pathname);

  if (normalised === "/") return null;

  const department = getDepartmentByPath(normalised);
  const departmentLabel = department
    ? (() => {
        const key = DEPARTMENT_ID_NAV_KEYS[department.id];
        if (key) return tNav(key as never);
        if (department.id === "institution") return t("theInstitution");
        return department.label;
      })()
    : undefined;

  const resolveHrefLabel = (href: string, fallback: string): string => {
    const mapped = DEPARTMENT_SECTION_MESSAGE_KEYS[href];
    if (!mapped) return fallback;
    try {
      switch (mapped.namespace) {
        case "apothecary":
          return tApothecary(mapped.key as never);
        case "academy":
          return tAcademy(mapped.key as never);
        case "journeys":
          return tJourneys(mapped.key as never);
        case "duaDhikr":
          return tDua(mapped.key as never);
        case "institutionNav":
          return tInstitution(mapped.key as never);
        case "nav":
          return tNav(mapped.key as never);
        default:
          return fallback;
      }
    } catch {
      return fallback;
    }
  };

  const segments = buildSegments(normalised, departmentLabel, resolveHrefLabel);

  if (segments.length === 0) return null;

  return (
    <nav className="breadcrumb" aria-label={t("ariaLabelNav")}>
      <ol className="breadcrumb__list">
        <li className="breadcrumb__item">
          <Link href="/" className="breadcrumb__link">
            {t("home")}
          </Link>
        </li>
        {segments.map((segment, i) => {
          const isLast = i === segments.length - 1;
          return (
            <li key={`${segment.href}-${i}`} className="breadcrumb__item">
              <span className="breadcrumb__sep" aria-hidden="true">
                /
              </span>
              {isLast ? (
                <span className="breadcrumb__current" aria-current="page">
                  {segment.label}
                </span>
              ) : (
                <Link href={segment.href} className="breadcrumb__link">
                  {segment.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface Segment {
  label: string;
  href: string;
}

function buildSegments(
  pathname: string,
  departmentLabel: string | undefined,
  resolveHrefLabel: (href: string, fallback: string) => string,
): Segment[] {
  const parts = pathname
    .split("/")
    .filter(Boolean)
    .filter((p) => !LOCALE_PATH_SEGMENTS.has(p.toLowerCase()));
  if (parts.length === 0) return [];

  const segments: Segment[] = [];
  const leaf = parts[parts.length - 1];
  const underApothecary = parts[0] === "the-apothecary";
  const leafIsNonPublicProduct =
    underApothecary &&
    parts.length >= 2 &&
    !isPublicCatalogueProduct({ slug: leaf });

  if (departmentLabel && parts.length >= 1) {
    const departmentHref = `/${parts[0]}`;
    segments.push({
      label: departmentLabel,
      href: departmentHref,
    });

    if (parts.length >= 2 && !leafIsNonPublicProduct) {
      const leafHref = `/${parts.slice(0, parts.length).join("/")}`;
      const mappedLabel = resolveHrefLabel(leafHref, formatSlug(leaf));
      // Avoid redundant self-link: current page is rendered as text by caller.
      // Also skip if leaf equals department (should not happen for depth ≥ 2).
      if (leafHref !== departmentHref) {
        segments.push({
          label: mappedLabel,
          href: leafHref,
        });
      }
    }
  } else if (!leafIsNonPublicProduct) {
    const leafHref = `/${parts.join("/")}`;
    const mappedLabel = resolveHrefLabel(leafHref, "");
    // Unknown routes must not invent Title-Case slug breadcrumbs (e.g. 404 paths).
    if (!mappedLabel) {
      return [];
    }
    segments.push({
      label: mappedLabel,
      href: leafHref,
    });
  }

  return segments;
}

function formatSlug(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
