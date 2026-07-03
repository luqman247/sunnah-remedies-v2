import type { Metadata } from "next";
import { DepartmentHub } from "@/components/ui/SectionPage";
import { apothecary } from "@/lib/navigation/site-structure";

export const metadata: Metadata = {
  title: "The Apothecary",
  description:
    "Catalogue, monographs, ingredient records, quality standards, and laboratory verification.",
};

export default function ApothecaryPage() {
  return (
    <DepartmentHub
      department={apothecary}
      folio="i"
      title="The ordered cabinet"
      lede="Provision · Hand — the material arm of the institute."
      intro={
        <p>
          This is a dispensary where each remedy carries a monograph:
          historical context, Prophetic reference where sound, traditional use,
          stated limits, and provenance. Navigate by section below.
        </p>
      }
      grave="Knowledge before measure. We dispense means and state limits plainly."
    />
  );
}
