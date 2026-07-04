import { Leaf } from "@/components/ui/Leaf";
import { Breadcrumb } from "@/components/apothecary/Breadcrumb";
import { DepartmentNav } from "@/components/ui/DepartmentNav";
import { PageIntro } from "@/components/ui/PageIntro";
import { practitionerPortal } from "@/lib/navigation/practitioner-portal";

interface PractitionerSectionPageProps {
  folio: string;
  title: string;
  lede?: string;
  currentHref: string;
  breadcrumbLabel: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}

export function PractitionerSectionPage({
  folio,
  title,
  lede,
  currentHref,
  breadcrumbLabel,
  intro,
  children,
}: PractitionerSectionPageProps) {
  return (
    <>
      <Leaf>
        <div className="measure-wide section-page__header">
          <Breadcrumb
            items={[
              { label: "Practitioner Portal", href: "/portal/practitioner" },
              { label: breadcrumbLabel },
            ]}
          />
          <div className="section-page__layout">
            <aside className="section-page__nav">
              <DepartmentNav
                department={practitionerPortal}
                currentHref={currentHref}
              />
            </aside>
            <div className="section-page__intro">
              <PageIntro
                section="Practitioner Portal"
                folio={folio}
                title={title}
                lede={lede}
              >
                {intro}
              </PageIntro>
            </div>
          </div>
        </div>
      </Leaf>
      <Leaf variant="inset">
        <div className="measure-wide section-page__body">{children}</div>
      </Leaf>
    </>
  );
}
