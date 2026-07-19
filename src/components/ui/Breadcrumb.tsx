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
  const tFeeling = useTranslations("feeling");
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
        case "feeling":
          return tFeeling(mapped.key as never);
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

  const segments = buildSegments(normalised, departmentLabel, department?.href, resolveHrefLabel);

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
  departmentHrefOverride: string | undefined,
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
    // Prefer the department's real href (site-structure.ts) over deriving
    // it from the URL's first segment. For every department today the two
    // already coincide — except "I am feeling…" (docs/i-am-feeling/SPEC.md
    // §2), a top-level route conceptually nested under Knowledge Library,
    // where parts[0] is "i-am-feeling" but the department link must still
    // point at /knowledge-library.
    const departmentHref = departmentHrefOverride ?? `/${parts[0]}`;
    segments.push({
      label: departmentLabel,
      href: departmentHref,
    });

    const fullLeafHref = `/${parts.join("/")}`;
    const hasSpecificLeafMapping =
      fullLeafHref !== departmentHref && !!DEPARTMENT_SECTION_MESSAGE_KEYS[fullLeafHref];

    // Depth ≥ 2 always gets a second segment (existing behaviour); depth 1
    // also gets one when a specific mapping exists for the full path itself
    // — the "I am feeling…" landing page case, where URL depth (1) is
    // shallower than conceptual depth (2: Knowledge Library → I am feeling…).
    if ((parts.length >= 2 || hasSpecificLeafMapping) && !leafIsNonPublicProduct && fullLeafHref !== departmentHref) {
      const mappedLabel = resolveHrefLabel(fullLeafHref, formatSlug(leaf));
      segments.push({
        label: mappedLabel,
        href: fullLeafHref,
      });
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
