import { Leaf } from "@/components/ui/Leaf";
import { Breadcrumb } from "@/components/apothecary/Breadcrumb";
import { DepartmentNav } from "@/components/ui/DepartmentNav";
import { PageIntro } from "@/components/ui/PageIntro";
import type { Department } from "@/lib/navigation/site-structure";

interface SectionPageProps {
  department: Department;
  folio: string;
  title: string;
  lede?: string;
  currentHref: string;
  breadcrumb: { label: string; href?: string }[];
  intro?: React.ReactNode;
  children: React.ReactNode;
}

export function SectionPage({
  department,
  folio,
  title,
  lede,
  currentHref,
  breadcrumb,
  intro,
  children,
}: SectionPageProps) {
  return (
    <>
      <Leaf>
        <div className="measure-wide section-page__header">
          <Breadcrumb items={breadcrumb} />
          <div className="section-page__layout">
            <aside className="section-page__nav">
              <DepartmentNav department={department} currentHref={currentHref} />
            </aside>
            <div className="section-page__intro">
              <PageIntro section={department.label} folio={folio} title={title} lede={lede}>
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

interface DepartmentHubProps {
  department: Department;
  folio: string;
  title: string;
  lede?: string;
  intro?: React.ReactNode;
  grave?: string;
}

export function DepartmentHub({
  department,
  folio,
  title,
  lede,
  intro,
  grave,
}: DepartmentHubProps) {
  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <PageIntro section={department.label} folio={folio} title={title} lede={lede}>
            {intro}
          </PageIntro>
        </div>
      </Leaf>

      {grave && (
        <Leaf variant="grave">
          <div className="measure grave-block">
            <p className="grave-block__qualifier" style={{ color: "var(--paper-dim)" }}>
              {grave}
            </p>
          </div>
        </Leaf>
      )}

      <Leaf variant="inset">
        <div className="measure-wide">
          <DepartmentNav department={department} />
        </div>
      </Leaf>
    </>
  );
}
