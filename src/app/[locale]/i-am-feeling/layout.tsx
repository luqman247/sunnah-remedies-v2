import { ReadingModeSelector } from "@/components/ui/ReadingModeSelector";

/**
 * "I am feeling…" is a top-level route (docs/i-am-feeling/SPEC.md §2), so
 * it does not inherit knowledge-library/layout.tsx automatically — this
 * mirrors that layout exactly (same reading-mode toolbar) so the reading
 * experience is identical to the rest of the Knowledge Library.
 */
export default function IAmFeelingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-reading-mode="standard">
      <div
        className="reading-toolbar"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "var(--s2) var(--margin-mobile)",
          borderBottom: "1px solid var(--rule)",
        }}
      >
        <ReadingModeSelector />
      </div>
      <div className="reading-body">{children}</div>
    </div>
  );
}
