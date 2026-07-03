import type { Metadata } from "next";
import { DepartmentHub } from "@/components/ui/SectionPage";
import { knowledgeLibrary } from "@/lib/navigation/site-structure";

export const metadata: Metadata = {
  title: "Knowledge Library",
  description:
    "Prophetic Medicine, materia medica, research, and patient guidance published as open scholarship.",
};

export default function KnowledgeLibraryPage() {
  return (
    <DepartmentHub
      department={knowledgeLibrary}
      folio="i"
      title="The open shelf"
      lede="Knowledge before commerce — a right of the community."
      intro={
        <p>
          The Knowledge Library publishes institutional notes on Prophetic
          Medicine, simples, and clinical guidance. Each article states its
          standing and links to primary records where available.
        </p>
      }
      grave="Nothing is attributed without traceable evidence. Means, not miracle."
    />
  );
}
