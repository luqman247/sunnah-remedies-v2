export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface Department {
  id: string;
  label: string;
  href: string;
  sections: NavItem[];
}

export const institution: Department = {
  id: "institution",
  label: "The Institution",
  href: "/",
  sections: [
    {
      label: "The Threshold",
      href: "/",
      description: "The entrance: purpose, direction, and the four departments.",
    },
    {
      label: "The Institute",
      href: "/institute",
      description: "Vision, governance, and the endowment.",
    },
    {
      label: "The Founding Charter",
      href: "/charter",
      description: "The constitutional text of the institution.",
    },
    {
      label: "The Institutional Year",
      href: "/calendar",
      description: "Traditions, rituals, and the annual rhythm.",
    },
    {
      label: "Consultations",
      href: "/consultations",
      description: "Clinical reception: scope, limits, and how to write.",
    },
    {
      label: "Correspondence",
      href: "/correspondence",
      description: "Enquiries and practitioner correspondence.",
    },
    {
      label: "The Register",
      href: "/the-register",
      description: "Practitioners held to institutional standard.",
    },
  ],
};

export const apothecary: Department = {
  id: "apothecary",
  label: "The Apothecary",
  href: "/the-apothecary",
  sections: [
    {
      label: "Product Catalogue",
      href: "/the-apothecary/catalogue",
      description: "Remedies listed with provenance visible in each row.",
    },
    {
      label: "Product Monographs",
      href: "/the-apothecary/monographs",
      description: "Scholarly records: source before fee, limits before measure.",
    },
    {
      label: "Ingredient Library",
      href: "/the-apothecary/ingredients",
      description: "Botanical identity, nature, and traditional standing.",
    },
    {
      label: "Quality Standards",
      href: "/the-apothecary/quality-standards",
      description: "Selection, storage, and dispensation at the institution.",
    },
    {
      label: "Laboratory Verification",
      href: "/the-apothecary/laboratory-verification",
      description: "Independent analysis, batch records, and certificates.",
    },
    {
      label: "FAQs",
      href: "/the-apothecary/faqs",
      description: "Dispensation, provenance, and stated limits.",
    },
  ],
};

export const academy: Department = {
  id: "academy",
  label: "The Academy",
  href: "/the-academy",
  sections: [
    {
      label: "Hijāma Diploma",
      href: "/the-academy/hijama-diploma",
      description: "Twelve weeks, forty supervised clinical sessions.",
    },
    {
      label: "Curriculum",
      href: "/the-academy/curriculum",
      description: "Seven modules, sources, and practical work.",
    },
    {
      label: "Learning outcomes",
      href: "/the-academy/learning-outcomes",
      description: "Assessed competences, published before enrolment.",
    },
    {
      label: "Practical sessions",
      href: "/the-academy/practical-sessions",
      description: "Clinic timetable and supervision ratios.",
    },
    {
      label: "Course handbook",
      href: "/the-academy/course-handbook",
      description: "Term dates, attendance, fees, and conduct.",
    },
    {
      label: "Student guide",
      href: "/the-academy/student-guide",
      description: "From acceptance through certification.",
    },
    {
      label: "Faculty",
      href: "/the-academy/faculty",
      description: "Named teachers, grounding, and accountability.",
    },
    {
      label: "Facilities",
      href: "/the-academy/facilities",
      description: "Clinical suite, reading room, seminar hall.",
    },
    {
      label: "Clinical standards",
      href: "/the-academy/clinical-standards",
      description: "Contraindications, technique, infection control.",
    },
    {
      label: "Assessment",
      href: "/the-academy/assessment",
      description: "Written papers, clinical log, and OSCE.",
    },
    {
      label: "Certification",
      href: "/the-academy/certification",
      description: "What the certificate means, and what it does not.",
    },
    {
      label: "Entry requirements",
      href: "/the-academy/entry-requirements",
      description: "Qualifications, safeguarding, and interview.",
    },
    {
      label: "Equipment list",
      href: "/the-academy/equipment",
      description: "Items supplied by the student and by the Academy.",
    },
    {
      label: "Graduate pathways",
      href: "/the-academy/graduate-pathways",
      description: "After certification, without employment promises.",
    },
    {
      label: "Graduate attestations",
      href: "/the-academy/testimonials",
      description: "Published with consent; not marketing.",
    },
    {
      label: "Gallery",
      href: "/the-academy/gallery",
      description: "Line studies of teaching spaces.",
    },
    {
      label: "Policies",
      href: "/the-academy/policies",
      description: "Cancellation, conduct, clinical responsibility.",
    },
    {
      label: "Questions",
      href: "/the-academy/faqs",
      description: "Recognition, safety, attendance, fees.",
    },
    {
      label: "Enrolment",
      href: "/the-academy/enrolment",
      description: "Application steps and form.",
    },
  ],
};

export const sacredJourneys: Department = {
  id: "sacred-journeys",
  label: "Sacred Journeys",
  href: "/sacred-journeys",
  sections: [
    {
      label: "Umrah",
      href: "/sacred-journeys/umrah",
      description: "Educational pilgrimage: rites, scholars, preparation.",
    },
    {
      label: "Itineraries",
      href: "/sacred-journeys/itineraries",
      description: "Day-by-day programmes, educational first.",
    },
    {
      label: "Preparation",
      href: "/sacred-journeys/preparation",
      description: "Reading, fitness, documents, and timeline.",
    },
    {
      label: "Reading list",
      href: "/sacred-journeys/reading",
      description: "Assigned texts before departure.",
    },
    {
      label: "Packing guide",
      href: "/sacred-journeys/packing",
      description: "Kit lists and what the institution provides.",
    },
    {
      label: "Flight guidance",
      href: "/sacred-journeys/flight-guidance",
      description: "Your flights; our coordination on the ground.",
    },
    {
      label: "Accommodation",
      href: "/sacred-journeys/accommodation",
      description: "Lodging stated honestly: proximity and safety.",
    },
    {
      label: "Educational sessions",
      href: "/sacred-journeys/educational-sessions",
      description: "Seminars, field study, and circles.",
    },
    {
      label: "Reflection journals",
      href: "/sacred-journeys/reflection-journals",
      description: "Assigned prompts and private practice.",
    },
    {
      label: "Companionship",
      href: "/sacred-journeys/companionship",
      description: "Group size, adab, and travel together.",
    },
    {
      label: "Health guidance",
      href: "/sacred-journeys/health-guidance",
      description: "Disclosure, fitness, and when not to travel.",
    },
    {
      label: "Gallery",
      href: "/sacred-journeys/gallery",
      description: "Places and paths: line studies.",
    },
    {
      label: "Registration",
      href: "/sacred-journeys/registration",
      description: "Interest, interview, reading, then placement.",
    },
    {
      label: "Policies",
      href: "/sacred-journeys/policies",
      description: "Cancellation, conduct, insurance.",
    },
    {
      label: "FAQs",
      href: "/sacred-journeys/faqs",
      description: "Registration, safety, postponement.",
    },
  ],
};

export const knowledgeLibrary: Department = {
  id: "knowledge-library",
  label: "Knowledge Library",
  href: "/knowledge-library",
  // Public department nav lists only the topics ready for readers.
  // Other Knowledge Library topic routes remain available by direct URL
  // and will return to this list when their editorial presentation is ready.
  sections: [
    {
      label: "Duʿa & Dhikr",
      href: "/knowledge-library/dua-dhikr",
      description: "Morning and evening remembrance, and the wider Sunnah collections of duʿa and dhikr.",
    },
  ],
};

export const departments = [
  apothecary,
  academy,
  sacredJourneys,
  knowledgeLibrary,
];

export function getDepartmentById(id: string): Department | undefined {
  return departments.find((d) => d.id === id);
}

export function getDepartmentByPath(path: string): Department | undefined {
  if (path.startsWith("/the-apothecary")) return apothecary;
  if (path.startsWith("/the-academy")) return academy;
  if (path.startsWith("/sacred-journeys")) return sacredJourneys;
  if (path.startsWith("/knowledge-library") || path.startsWith("/knowledge/dhikr")) {
    return knowledgeLibrary;
  }
  if (path.startsWith("/institute")) return institution;
  if (path.startsWith("/charter")) return institution;
  if (path.startsWith("/calendar")) return institution;
  if (path.startsWith("/consultations")) return institution;
  if (path.startsWith("/correspondence")) return institution;
  if (path.startsWith("/exhibitions")) return institution;
  if (path.startsWith("/research")) return institution;
  if (path.startsWith("/press")) return institution;
  return undefined;
}
