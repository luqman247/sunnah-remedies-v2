import type { Metadata } from "next";
import { ProgrammeView } from "@/components/academy/ProgrammeView";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

export async function generateMetadata(): Promise<Metadata> {
  const programme = await getProgrammeBySlug("hijama-diploma");
  const diploma = programme ? programmeToAcademyProgramme(programme) : getHijamaDiploma();
  return {
    title: "Hijāma Diploma",
    description: diploma.subtitle,
  };
}

export default async function HijamaDiplomaPage() {
  const programme = await getProgrammeBySlug("hijama-diploma");
  const diploma = programme ? programmeToAcademyProgramme(programme) : getHijamaDiploma();
  return <ProgrammeView programme={diploma} />;
}
