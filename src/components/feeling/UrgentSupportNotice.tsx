"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import "./feeling.css";

/**
 * The permanent, calm safety/professional-support notice (SPEC §3.7, §5
 * #16, §8). Reused verbatim everywhere it appears — the landing page
 * footer, every feeling-detail page footer, and the mandatory note on
 * "heightened" safeguarding-level feeling pages — so the wording is never
 * subtly re-authored per page.
 */
export function UrgentSupportNotice() {
  const t = useTranslations("feeling.landing");
  return (
    <p className="feeling-landing__safety-text">
      {t("safetyNoticeBody")}{" "}
      <Link href="/i-am-feeling/urgent-support" className="feeling-landing__inline-link">
        {t("safetyNoticeUrgentLink")}
      </Link>{" "}
      {t("safetyNoticeSuffix")}
    </p>
  );
}
