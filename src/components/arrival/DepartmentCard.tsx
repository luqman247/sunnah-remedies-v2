/**
 * DepartmentCard — dignified doorway to each department (Ch. 9.5).
 *
 * Each card: Roman numeral, department name (En + Ar), standfirst,
 * a Plate, and a text link. Variants: standard | feature.
 */

import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Plate } from "./Plate";
import { IsnadRule } from "./IsnadRule";

interface DepartmentPlate {
  status: "brief" | "interim" | "final";
  purpose: string;
  composition: string;
  lens?: string;
  lighting: string;
  grade?: string;
  mood: string;
  image?: { url: string };
  alt?: string;
  caption?: string;
  decorative?: boolean;
  credit?: string;
}

interface DepartmentCardProps {
  order: number;
  nameEn: string;
  nameAr: string;
  standfirst: string;
  href: string;
  plate: DepartmentPlate;
  size: "standard" | "feature";
}

const numerals = ["I", "II", "III", "IV"];

export async function DepartmentCard({
  order,
  nameEn,
  nameAr,
  standfirst,
  href,
  plate,
  size,
}: DepartmentCardProps) {
  const t = await getTranslations("arrival");
  const aspect = size === "feature" ? "16/7" : "4/3";

  return (
    <article className={`dept-card ${size === "feature" ? "dept-card--feature" : ""}`}>
      <Link href={href} className="arrival-link" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
        <span className="type-folio-v2" style={{ color: "var(--brass)" }}>
          {numerals[order - 1] || order}
        </span>

        <h3 className="type-dept-name" style={{ marginBlockStart: "var(--space-3)", marginBlockEnd: 0 }}>
          {nameEn}
        </h3>
        <span
          lang="ar"
          dir="rtl"
          className="type-arabic-body"
          style={{ display: "block", fontSize: "1rem", color: "var(--ink-soft)", marginBlockStart: "var(--space-2)" }}
        >
          {nameAr}
        </span>

        <p className="type-standfirst" style={{ marginBlock: "var(--space-4)" }}>
          {standfirst}
        </p>

        <Plate
          asset={plate}
          aspect={aspect}
          variant={size}
        />

        <span
          className="arrival-enter"
          style={{ marginBlockStart: "var(--space-5)", display: "inline-flex" }}
        >
          {t("enter")} <span className="arrow" aria-hidden="true">⟶</span>
        </span>
      </Link>
    </article>
  );
}

export function DepartmentDivider() {
  return <IsnadRule variant="divider" nodePosition={0.5} />;
}
