import type { Metadata } from "next";
import { DashboardContent } from "./content";

export const metadata: Metadata = {
  title: "Institutional Dashboard — Operations",
};

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <article>
      <header className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-light text-[#0E3B2E] mb-2">
          Institutional Dashboard
        </h1>
        <p className="font-[family-name:var(--font-body)] text-sm text-[#0E3B2E]/70 leading-relaxed">
          Real-time overview of the institution
        </p>
      </header>

      <DashboardContent />
    </article>
  );
}
