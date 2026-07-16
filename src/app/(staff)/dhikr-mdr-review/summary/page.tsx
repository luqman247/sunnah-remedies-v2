import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/config";
import { MORNING_DHIKR_SOURCE_REGISTER } from "@/lib/dhikr-research/morning-dhikr-register";
import { loadAllDrafts } from "../actions";
import { summariseDrafts } from "../draft-logic";

export const metadata: Metadata = {
  title: "Dhikr — MDR Review Summary",
  robots: { index: false, follow: false },
};

/**
 * MDR review summary — staff-only, read-only. Counts are derived purely
 * from `dhikrMdrReviewDraft` documents (see ../actions.ts); this page never
 * reads or infers anything from the live register's own scholarlyDecision
 * field, and never changes anything.
 */
export default async function DhikrMdrReviewSummaryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const drafts = await loadAllDrafts();
  const allMdrIds = MORNING_DHIKR_SOURCE_REGISTER.map((r) => r.internalId);
  const summary = summariseDrafts(allMdrIds, drafts);
  const counts = summary;
  const incomplete = summary.incomplete;
  const stillRequiringAttention = summary.stillRequiringAttention;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8 border border-[#8A5A2B] bg-[#8A5A2B]/5 px-4 py-3" role="note">
        <p className="font-[family-name:var(--font-utility)] text-xs font-medium uppercase tracking-widest text-[#8A5A2B]">
          Internal — not indexed
        </p>
        <p className="font-[family-name:var(--font-body)] text-sm text-[#0E3B2E]/80 mt-1 leading-relaxed">
          Read-only summary of submitted review drafts. Nothing here reflects the live register's
          approval state — see the workbench for individual records.
        </p>
      </div>

      <header className="mb-8 flex items-baseline justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-light text-[#0E3B2E]">
          MDR Review Summary
        </h1>
        <a href="/dhikr-mdr-review" className="font-[family-name:var(--font-utility)] text-xs uppercase tracking-widest text-[#0E3B2E] underline underline-offset-4">
          ← Back to workbench
        </a>
      </header>

      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          ["Approved", counts.approved],
          ["Approved with corrections", counts.approvedWithCorrections],
          ["Deferred", counts.deferred],
          ["Rejected", counts.rejected],
          ["Incomplete", incomplete],
          ["Total records", MORNING_DHIKR_SOURCE_REGISTER.length],
        ].map(([label, value]) => (
          <div key={label as string} className="border border-[#0E3B2E]/20 p-4">
            <dt className="font-[family-name:var(--font-utility)] text-xs uppercase tracking-widest text-[#0E3B2E]/60">{label}</dt>
            <dd className="font-[family-name:var(--font-display)] text-3xl text-[#0E3B2E] mt-1">{value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="attention-heading">
        <h2 id="attention-heading" className="font-[family-name:var(--font-utility)] text-xs uppercase tracking-widest text-[#0E3B2E]/60 mb-3">
          Records still requiring attention ({stillRequiringAttention.length})
        </h2>
        <ul className="flex flex-wrap gap-2">
          {stillRequiringAttention.map((id) => (
            <li key={id}>
              <a href="/dhikr-mdr-review" className="text-xs font-[family-name:var(--font-utility)] border border-[#0E3B2E]/20 px-2 py-1 text-[#0E3B2E]">
                {id}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
