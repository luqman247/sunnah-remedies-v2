const sections = [
  { id: "meaning", label: "Meaning" },
  { id: "preparation", label: "Preparation" },
  { id: "learning", label: "Learning" },
  { id: "companionship", label: "Companionship" },
  { id: "guidance", label: "Guidance" },
  { id: "spiritual", label: "Spiritual growth" },
  { id: "safety", label: "Safety" },
  { id: "organisation", label: "Organisation" },
  { id: "itinerary", label: "Itinerary" },
  { id: "scholars", label: "Scholars" },
  { id: "reflection", label: "Reflection" },
  { id: "reading", label: "Reading" },
  { id: "packing", label: "Packing" },
  { id: "gallery", label: "Gallery" },
  { id: "faq", label: "Questions" },
  { id: "policies", label: "Policies" },
  { id: "registration", label: "Registration" },
];

export function JourneyContents() {
  return (
    <nav className="monograph-contents" aria-label="Journey contents">
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
