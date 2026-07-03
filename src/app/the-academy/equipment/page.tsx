import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { getHijamaDiploma } from "@/lib/content/academy";

const p = getHijamaDiploma();

export const metadata: Metadata = {
  title: "Equipment list",
  description: "Equipment responsibilities for students and Academy supply.",
};

export default function EquipmentPage() {
  return (
    <AcademySectionPage
      folio="x"
      title="Equipment list"
      lede="Purchase required items before term; clinic consumables are supplied by the Academy."
      currentHref="/the-academy/equipment"
      breadcrumbLabel="Equipment list"
    >
      <table className="equipment-table">
        <thead>
          <tr>
            <th className="type-micro">Item</th>
            <th className="type-micro">Specification</th>
            <th className="type-micro">Supplied by</th>
          </tr>
        </thead>
        <tbody>
          {p.equipmentList.map((row) => (
            <tr key={row.item}>
              <td className="type-body">{row.item}</td>
              <td className="type-small">{row.specification}</td>
              <td className="type-micro">{row.supplied}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AcademySectionPage>
  );
}
