import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operations",
};

/**
 * Operations index — links to operational forms.
 *
 * @see Phase 4, Chapter 14 — Master checklists
 */
export default function OpsIndexPage() {
  const forms = [
    {
      href: "/ops/daily-sign-off",
      title: "Daily Sign-Off",
      description: "Opening and closing confirmation.",
    },
    {
      href: "/ops/temperature-log",
      title: "Temperature Log",
      description: "Dispensary and storage temperature recording.",
    },
    {
      href: "/ops/goods-in",
      title: "Goods-In",
      description: "Record a batch receipt into stock.",
    },
  ];

  return (
    <article>
      <header className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-light text-[#0E3B2E] mb-2">
          Operational Forms
        </h1>
        <p className="font-[family-name:var(--font-body)] text-sm text-[#0E3B2E]/70 leading-relaxed">
          Record operational events. Each submission is timestamped and attributed
        </p>
      </header>

      <div className="space-y-2">
        {forms.map((form) => (
          <a
            key={form.href}
            href={form.href}
            className="block p-4 border border-[#0E3B2E]/10 hover:border-[#0E3B2E]/25 transition-colors"
          >
            <h2 className="font-[family-name:var(--font-utility)] text-sm font-medium text-[#0E3B2E]">
              {form.title}
            </h2>
            <p className="font-[family-name:var(--font-body)] text-xs text-[#0E3B2E]/60 mt-0.5">
              {form.description}
            </p>
          </a>
        ))}
      </div>
    </article>
  );
}
