const sections = [
  { id: "overview", label: "Overview" },
  { id: "outcomes", label: "Learning outcomes" },
  { id: "curriculum", label: "Curriculum" },
  { id: "practical", label: "Practical sessions" },
  { id: "faculty", label: "Faculty" },
  { id: "facilities", label: "Facilities" },
  { id: "clinical-standards", label: "Clinical standards" },
  { id: "assessment", label: "Assessment" },
  { id: "certification", label: "Certification" },
  { id: "entry", label: "Entry requirements" },
  { id: "equipment", label: "Equipment" },
  { id: "handbook", label: "Course handbook" },
  { id: "guide", label: "Student guide" },
  { id: "gallery", label: "Gallery" },
  { id: "testimonials", label: "Graduate attestations" },
  { id: "pathways", label: "Graduate pathways" },
  { id: "faq", label: "Common questions" },
  { id: "policies", label: "Policies" },
  { id: "enrolment", label: "Send application" },
];

export function ProgrammeContents() {
  return (
    <nav className="monograph-contents programme-contents" aria-label="Programme table of contents">
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
