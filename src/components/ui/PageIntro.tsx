import { RunningHead } from "./Links";

interface PageIntroProps {
  section: string;
  folio: string;
  /** When omitted, children supply the hero (e.g. dual route navigation). */
  title?: string;
  lede?: string;
  children?: React.ReactNode;
}

export function PageIntro({ section, folio, title, lede, children }: PageIntroProps) {
  return (
    <>
      <RunningHead section={section} folio={folio} />
      <header className="page-intro">
        {title && <h1 className="page-intro__title">{title}</h1>}
        {lede && <p className="page-intro__lede">{lede}</p>}
        {children && <div className={title ? "page-intro__body" : undefined}>{children}</div>}
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
