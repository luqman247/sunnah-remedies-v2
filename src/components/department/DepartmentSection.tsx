import { type ReactNode } from "react";
import { SectionStamp } from "@/components/arrival/SectionStamp";

interface DepartmentSectionProps {
  numeral: string;
  label?: string;
  id?: string;
  ariaLabelledBy?: string;
  variant?: "default" | "deep" | "nav";
  children: ReactNode;
}

export function DepartmentSection({
  numeral,
  label,
  id,
  ariaLabelledBy,
  variant = "default",
  children,
}: DepartmentSectionProps) {
  const sectionClasses = [
    "dept-section",
    variant === "deep" ? "dept-band-deep" : "",
    variant === "nav" ? "dept-nav-section" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={sectionClasses}
      id={id}
      aria-labelledby={ariaLabelledBy}
    >
      <div className="dept-container">
        <div className="dept-grid">
          <div className="dept-rail">
            <SectionStamp numeral={numeral} />
          </div>
          <div>
            <div
              className="section-stamp-mobile"
              style={{ marginBlockEnd: "var(--space-6)" }}
            >
              <SectionStamp numeral={numeral} label={label} />
            </div>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
