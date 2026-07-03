import { Leaf } from "@/components/ui/Leaf";
import { Breadcrumb } from "@/components/apothecary/Breadcrumb";
import { DepartmentNav } from "@/components/ui/DepartmentNav";
import { PageIntro } from "@/components/ui/PageIntro";
import { academy } from "@/lib/navigation/site-structure";

interface AcademySectionPageProps {
  folio: string;
  title: string;
  lede?: string;
  currentHref: string;
  breadcrumbLabel: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}

export function AcademySectionPage({
  folio,
  title,
  lede,
  currentHref,
  breadcrumbLabel,
  intro,
  children,
}: AcademySectionPageProps) {
  return (
    <>
      <Leaf>
        <div className="measure-wide section-page__header">
          <Breadcrumb
            items={[
              { label: "The Academy", href: "/the-academy" },
              { label: "Hijāma Diploma", href: "/the-academy/hijama-diploma" },
              { label: breadcrumbLabel },
            ]}
          />
          <div className="section-page__layout">
            <aside className="section-page__nav">
              <DepartmentNav department={academy} currentHref={currentHref} />
            </aside>
            <div className="section-page__intro">
              <PageIntro section="The Academy" folio={folio} title={title} lede={lede}>
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
