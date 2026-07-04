"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { AcademyProgramme } from "@/lib/content/academy/types";
import { EnrolmentForm } from "./EnrolmentForm";

interface ProgrammeLedgerProps {
  programme: AcademyProgramme;
}

export function ProgrammeLedger({ programme }: ProgrammeLedgerProps) {
  const t = useTranslations("academy.programmeLedger");

  return (
    <aside className="monograph-ledger programme-ledger" aria-label={t("ariaLabel")}>
      <div className="monograph-ledger__inner">
        <p className="type-eyebrow monograph-ledger__label">{t("diploma")}</p>
        <p className="type-title monograph-ledger__name">{programme.duration}</p>
        <p className="type-micro monograph-ledger__measure">{programme.nextCohort}</p>
        <p className="monograph-ledger__fee">{programme.fee}</p>
        <p className="type-small monograph-ledger__delivery">{programme.feeNote.split(".")[0]}</p>
        <Link href="/the-academy/enrolment#application" className="solid-action programme-ledger__cta">
          {t("sendApplication")}
        </Link>
        <p className="type-small monograph-ledger__note">
          <Link href="#enrolment" className="quiet-link">
            {t("reviewFirst")}
          </Link>
        </p>
      </div>
    </aside>
  );
}
