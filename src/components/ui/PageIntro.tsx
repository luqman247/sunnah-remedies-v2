import { RunningHead } from "./Links";

interface PageIntroProps {
  section: string;
  folio: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
}

export function PageIntro({ section, folio, title, lede, children }: PageIntroProps) {
  return (
    <>
      <RunningHead section={section} folio={folio} />
      <header className="page-intro">
        <h1 className="page-intro__title">{title}</h1>
        {lede && <p className="page-intro__lede">{lede}</p>}
        {children && <div className="page-intro__body">{children}</div>}
      </header>
    </>
  );
}

interface SectionLabelProps {
  children: React.ReactNode;
}

export function SectionLabel({ children }: SectionLabelProps) {
  return <p className="section-label">{children}</p>;
}
