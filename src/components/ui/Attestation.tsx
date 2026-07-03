"use client";

import { useId, useState } from "react";

interface SourceMarkProps {
  siglum: string;
  source: string;
}

export function SourceMark({ siglum, source }: SourceMarkProps) {
  const [open, setOpen] = useState(false);
  const noteId = useId();

  return (
    <span className="source-mark">
      <button
        type="button"
        className="source-mark__siglum type-micro"
        aria-expanded={open}
        aria-controls={noteId}
        onClick={() => setOpen((v) => !v)}
      >
        {siglum}
      </button>
      {open && (
        <span id={noteId} className="source-mark__note" role="note">
          {source}
        </span>
      )}
    </span>
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
    <aside className="specimen" aria-label="Attestation record specimen">
      <span className="specimen__tab">Record specimen</span>
      <p className="type-title specimen__statement">{statement}</p>
      {transliteration && (
        <p className="type-body specimen__transliteration">{transliteration}</p>
      )}
      <hr className="hairline" />
      <dl className="specimen__dl">
        <div>
          <dt className="type-micro specimen__dt">Hadith grade</dt>
          <dd className="type-body specimen__dd">
            <span className="specimen__grade-dot" aria-hidden="true" />
            {grade}
          </dd>
        </div>
        <div>
          <dt className="type-micro specimen__dt">Primary source</dt>
          <dd className="type-body specimen__dd">{source}</dd>
        </div>
        {standing && (
          <div>
            <dt className="type-micro specimen__dt">Scholarly standing</dt>
            <dd className="type-body specimen__dd">{standing}</dd>
          </div>
        )}
      </dl>
    </aside>
  );
}

interface ListingRowProps {
  title: string;
  provenance: string;
  href: string;
  subtitle?: string;
}

export function ListingRow({ title, provenance, href, subtitle }: ListingRowProps) {
  return (
    <a href={href} className="ruled-row">
      <span>
        <span className="type-title ruled-row__title">{title}</span>
        {subtitle && (
          <span className="type-small" style={{ display: "block", color: "var(--muted)", marginTop: "var(--s1)" }}>
            {subtitle}
          </span>
        )}
      </span>
      <span className="type-micro ruled-row__provenance">{provenance}</span>
    </a>
  );
}

interface DepartmentRowProps {
  numeral: string;
  name: string;
  role: string;
  description: string;
  href: string;
  linkLabel: string;
}

export function DepartmentRow({
  numeral,
  name,
  role,
  description,
  href,
  linkLabel,
}: DepartmentRowProps) {
  return (
    <article className="dept-row">
      <span className="dept-row__numeral">{numeral}</span>
      <div className="dept-row__content">
        <h2 className="type-title">{name}</h2>
        <p className="type-micro dept-row__role">{role}</p>
        <p className="type-body">{description}</p>
        <a href={href} className="go-link dept-row__link">
          {linkLabel}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
