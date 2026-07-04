import { Leaf } from "@/components/ui/Leaf";
import { Breadcrumb } from "@/components/apothecary/Breadcrumb";
import { DepartmentNav } from "@/components/ui/DepartmentNav";
import { PageIntro } from "@/components/ui/PageIntro";
import { studentPortal } from "@/lib/navigation/student-portal";

interface StudentSectionPageProps {
  folio: string;
  title: string;
  lede?: string;
  currentHref: string;
  breadcrumbLabel: string;
  breadcrumbItems?: { label: string; href?: string }[];
  intro?: React.ReactNode;
  children: React.ReactNode;
}

export function StudentSectionPage({
  folio,
  title,
  lede,
  currentHref,
  breadcrumbLabel,
  breadcrumbItems,
  intro,
  children,
}: StudentSectionPageProps) {
  const crumbs = breadcrumbItems ?? [
    { label: "Digital Campus", href: "/portal/student" },
    { label: breadcrumbLabel },
  ];

  return (
    <>
      <Leaf>
        <div className="measure-wide section-page__header">
          <Breadcrumb items={crumbs} />
          <div className="section-page__layout">
            <aside className="section-page__nav">
              <DepartmentNav department={studentPortal} currentHref={currentHref} />
            </aside>
            <div className="section-page__intro">
              <PageIntro section="Digital Campus" folio={folio} title={title} lede={lede}>
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
