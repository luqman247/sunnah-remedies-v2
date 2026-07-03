import type { Metadata } from "next";
import { ProgrammeView } from "@/components/academy/ProgrammeView";
import { getHijamaDiploma } from "@/lib/content/academy";

export const metadata: Metadata = {
  title: "Hijāma Diploma",
  description: getHijamaDiploma().subtitle,
};

export default function HijamaDiplomaPage() {
  return <ProgrammeView programme={getHijamaDiploma()} />;
}
