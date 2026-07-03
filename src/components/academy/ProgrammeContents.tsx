const sections = [
  { id: "overview", label: "Overview" },
  { id: "outcomes", label: "Learning outcomes" },
  { id: "curriculum", label: "Curriculum" },
  { id: "faculty", label: "Faculty" },
  { id: "certification", label: "Certification" },
  { id: "entry", label: "Entry requirements" },
  { id: "assessment", label: "Assessment" },
  { id: "clinical", label: "Clinical practice" },
  { id: "facilities", label: "Facilities" },
  { id: "gallery", label: "Gallery" },
  { id: "testimonials", label: "Graduate attestations" },
  { id: "faq", label: "Questions" },
  { id: "policies", label: "Policies" },
  { id: "enrolment", label: "Enrolment" },
];

export function ProgrammeContents() {
  return (
    <nav className="monograph-contents programme-contents" aria-label="Programme contents">
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
