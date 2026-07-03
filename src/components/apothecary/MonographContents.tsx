export const monographSections = [
  { id: "institutional-summary", label: "Institutional summary" },
  { id: "historical-context", label: "Historical use" },
  { id: "prophetic-tradition", label: "Prophetic tradition" },
  { id: "traditional-scholarship", label: "Traditional scholarship" },
  { id: "traditional-usage", label: "Traditional usage" },
  { id: "evidence-informed", label: "Evidence-informed" },
  { id: "provenance", label: "Origin and harvesting" },
  { id: "laboratory-verification", label: "Laboratory verification" },
  { id: "quality-assurance", label: "Quality assurance" },
  { id: "storage", label: "Storage" },
  { id: "preparation", label: "Preparation" },
  { id: "suggested-use", label: "Suggested use" },
  { id: "contraindications", label: "Contraindications" },
  { id: "photography", label: "Photography" },
  { id: "packaging", label: "Packaging" },
  { id: "shipping", label: "Shipping" },
  { id: "returns", label: "Returns" },
  { id: "customer-support", label: "Customer support" },
  { id: "frequently-asked", label: "Common questions" },
  { id: "related-remedies", label: "Related remedies" },
  { id: "academy-lessons", label: "Academy lessons" },
  { id: "knowledge-library", label: "Knowledge Library" },
  { id: "pathways", label: "Further study and practice" },
  { id: "dispensation", label: "Dispensation" },
];

export function MonographContents() {
  return (
    <nav className="monograph-contents" aria-label="Monograph table of contents">
      <p className="type-eyebrow monograph-contents__label">Table of contents</p>
      <ol className="monograph-contents__list">
        {monographSections.map(({ id, label }) => (
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
