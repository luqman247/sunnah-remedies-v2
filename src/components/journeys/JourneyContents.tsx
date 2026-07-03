const sections = [
  { id: "meaning", label: "Meaning" },
  { id: "preparation", label: "Preparation" },
  { id: "reading", label: "Reading" },
  { id: "packing", label: "Packing" },
  { id: "flights", label: "Flight guidance" },
  { id: "accommodation", label: "Accommodation" },
  { id: "learning", label: "Learning" },
  { id: "sessions", label: "Educational sessions" },
  { id: "itinerary", label: "Daily itinerary" },
  { id: "companionship", label: "Companionship" },
  { id: "guidance", label: "Guidance" },
  { id: "reflection", label: "Reflection journals" },
  { id: "health", label: "Health guidance" },
  { id: "safety", label: "Safety" },
  { id: "organisation", label: "Organisation" },
  { id: "scholars", label: "Scholars" },
  { id: "gallery", label: "Gallery" },
  { id: "faq", label: "Common questions" },
  { id: "policies", label: "Policies" },
  { id: "registration", label: "Registration" },
];

export function JourneyContents() {
  return (
    <nav className="monograph-contents" aria-label="Journey table of contents">
      <p className="type-eyebrow monograph-contents__label">Table of contents</p>
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
