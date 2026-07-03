const sections = [
  { id: "historical-context", label: "Historical context" },
  { id: "prophetic-tradition", label: "Prophetic tradition" },
  { id: "traditional-usage", label: "Traditional usage" },
  { id: "evidence-informed", label: "Within the evidence" },
  { id: "sourcing", label: "Sourcing" },
  { id: "quality-assurance", label: "Quality assurance" },
  { id: "storage", label: "Storage" },
  { id: "preparation", label: "Preparation" },
  { id: "honest-limits", label: "Honest limits" },
  { id: "frequently-asked", label: "Questions" },
  { id: "related-remedies", label: "Related remedies" },
  { id: "suggested-reading", label: "Suggested reading" },
  { id: "pathways", label: "Further study" },
  { id: "dispensation", label: "Dispensation" },
];

export function MonographContents() {
  return (
    <nav className="monograph-contents" aria-label="Monograph contents">
      <p className="type-eyebrow monograph-contents__label">Contents</p>
      <ol className="monograph-contents__list">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a href={`#${id}`} className="monograph-contents__link">
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
