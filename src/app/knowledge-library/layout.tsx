import { ReadingModeSelector } from "@/components/ui/ReadingModeSelector";

export default function KnowledgeLibraryLayout({
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
