import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

export const metadata: Metadata = {
  title: "Equipment list",
  description: "Equipment responsibilities for students and Academy supply.",
};

export default async function EquipmentPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const programme = await getProgrammeBySlug("hijama-diploma", locale);
  const p = programme ? programmeToAcademyProgramme(programme) : getHijamaDiploma();
  return (
    <AcademySectionPage
      folio="x"
      title="Equipment list"
      lede="Purchase required items before term; clinic consumables are supplied by the Academy"
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
