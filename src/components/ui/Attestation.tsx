interface DepartmentCardProps {
  numeral: string;
  name: string;
  role: string;
  description: string;
  href: string;
  linkLabel: string;
}

export function DepartmentCard({
  numeral,
  name,
  role,
  description,
  href,
  linkLabel,
}: DepartmentCardProps) {
  return (
    <article className="dept-card">
      <span className="dept-card__numeral">{numeral}</span>
      <h3 className="type-title">{name}</h3>
      <p className="type-micro" style={{ color: "var(--muted)" }}>
        {role}
      </p>
      <p className="type-body" style={{ flex: 1 }}>
        {description}
      </p>
      <a href={href} className="go-link">
        {linkLabel}
        <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}

interface ListingRowProps {
  title: string;
  provenance: string;
  href: string;
}

export function ListingRow({ title, provenance, href }: ListingRowProps) {
  return (
    <a href={href} className="ruled-row">
      <span className="type-title ruled-row__title">{title}</span>
      <span className="type-micro" style={{ color: "var(--muted)", textAlign: "right" }}>
        {provenance}
      </span>
    </a>
  );
}

interface SpecimenProps {
  statement: string;
  transliteration?: string;
  grade: string;
  source: string;
  standing?: string;
}

export function Specimen({
  statement,
  transliteration,
  grade,
  source,
  standing,
}: SpecimenProps) {
  return (
    <aside className="specimen" aria-label="Attestation specimen">
      <span className="specimen__tab">Specimen</span>
      <p className="type-title" style={{ marginTop: "var(--s3)" }}>
        {statement}
      </p>
      {transliteration && (
        <p className="type-body" style={{ fontStyle: "italic", color: "var(--muted)" }}>
          {transliteration}
        </p>
      )}
      <hr className="hairline" style={{ margin: "var(--s4) 0" }} />
      <dl style={{ margin: 0, display: "grid", gap: "var(--s2)" }}>
        <div>
          <dt className="type-micro" style={{ color: "var(--muted)" }}>Grade</dt>
          <dd className="type-body" style={{ margin: "var(--s1) 0 0" }}>
            <span className="specimen__grade-dot" aria-hidden="true" />
            {grade}
          </dd>
        </div>
        <div>
          <dt className="type-micro" style={{ color: "var(--muted)" }}>Source</dt>
          <dd className="type-body" style={{ margin: "var(--s1) 0 0" }}>{source}</dd>
        </div>
        {standing && (
          <div>
            <dt className="type-micro" style={{ color: "var(--muted)" }}>Standing</dt>
            <dd className="type-body" style={{ margin: "var(--s1) 0 0" }}>{standing}</dd>
          </div>
        )}
      </dl>
    </aside>
  );
}

interface SourceMarkProps {
  siglum: string;
  source: string;
}

export function SourceMark({ siglum, source }: SourceMarkProps) {
  return (
    <sup
      className="type-micro"
      style={{ color: "var(--gilt)", cursor: "help" }}
      title={source}
      tabIndex={0}
      role="note"
      aria-label={`Source: ${source}`}
    >
      {siglum}
    </sup>
  );
}
