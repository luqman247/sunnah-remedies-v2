import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { getHijamaDiploma } from "@/lib/content/academy";

const p = getHijamaDiploma();

export const metadata: Metadata = {
  title: "Policies",
  description: "Cancellation, conduct, and clinical responsibility policies.",
};

export default function PoliciesPage() {
  return (
    <AcademySectionPage
      folio="xiii"
      title="Policies"
      lede="Binding from offer letter through certification."
      currentHref="/the-academy/policies"
      breadcrumbLabel="Policies"
    >
      {p.policies.map((block) => (
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
