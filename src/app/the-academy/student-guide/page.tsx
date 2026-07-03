import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { getHijamaDiploma } from "@/lib/content/academy";

const p = getHijamaDiploma();

export const metadata: Metadata = {
  title: "Student guide",
  description: "Guidance from induction through certification.",
};

export default function StudentGuidePage() {
  return (
    <AcademySectionPage
      folio="vi"
      title="Student guide"
      lede="What to expect week by week."
      currentHref="/the-academy/student-guide"
      breadcrumbLabel="Student guide"
    >
      {p.studentGuide.map((block) => (
        <article key={block.title} className="policy-block">
          <h2 className="type-title">{block.title}</h2>
          {block.body.map((para) => (
            <p key={para.slice(0, 48)} className="type-body">{para}</p>
          ))}
        </article>
      ))}
    </AcademySectionPage>
  );
}
