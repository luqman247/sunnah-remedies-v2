"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDepartmentByPath } from "@/lib/navigation/site-structure";

export function Breadcrumb() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const department = getDepartmentByPath(pathname);
  const segments = buildSegments(pathname, department?.label);

  if (segments.length === 0) return null;

  return (
    <nav className="breadcrumb" aria-label="You are here">
      <ol className="breadcrumb__list">
        <li className="breadcrumb__item">
          <Link href="/" className="breadcrumb__link">
            The Institution
          </Link>
        </li>
        {segments.map((segment, i) => {
          const isLast = i === segments.length - 1;
          return (
            <li key={segment.href} className="breadcrumb__item">
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

function buildSegments(pathname: string, departmentLabel?: string): Segment[] {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return [];

  const segments: Segment[] = [];

  if (departmentLabel && parts.length >= 1) {
    segments.push({
      label: departmentLabel,
      href: `/${parts[0]}`,
    });

    if (parts.length >= 2) {
      segments.push({
        label: formatSlug(parts[parts.length - 1]),
        href: pathname,
      });
    }
  } else {
    segments.push({
      label: formatSlug(parts[parts.length - 1]),
      href: pathname,
    });
  }

  return segments;
}

function formatSlug(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
