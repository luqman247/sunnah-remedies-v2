"use client";

import Link from "next/link";
import type { AcademyProgramme } from "@/lib/content/academy/types";
import { EnrolmentForm } from "./EnrolmentForm";

interface ProgrammeLedgerProps {
  programme: AcademyProgramme;
}

export function ProgrammeLedger({ programme }: ProgrammeLedgerProps) {
  return (
    <aside className="monograph-ledger programme-ledger" aria-label="Programme enrolment summary">
      <div className="monograph-ledger__inner">
        <p className="type-eyebrow monograph-ledger__label">Hijāma Diploma</p>
        <p className="type-title monograph-ledger__name">{programme.duration}</p>
        <p className="type-micro monograph-ledger__measure">{programme.nextCohort}</p>
        <p className="monograph-ledger__fee">{programme.fee}</p>
        <p className="type-small monograph-ledger__delivery">{programme.feeNote.split(".")[0]}</p>
        <Link href="/the-academy/enrolment#application" className="solid-action programme-ledger__cta">
          Send application
        </Link>
        <p className="type-small monograph-ledger__note">
          <Link href="#enrolment" className="quiet-link">
            Review the programme first
          </Link>
        </p>
      </div>
    </aside>
  );
}
