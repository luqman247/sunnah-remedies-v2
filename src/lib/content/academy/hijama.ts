import type { AcademyProgramme } from "./types";

export const hijamaProgramme: AcademyProgramme = {
  slug: "hijama",
  name: "The Hijāma Programme",
  subtitle: "Professional training in Prophetic cupping — clinical, sourced, and supervised",
  folio: "ii",
  tier: "Professional",
  duration: "12 weeks · 240 contact hours",
  format: "In-person · The Academy, London",
  fee: "£2,400",
  feeNote: "Includes clinical materials, assessment, and certification. Instalments available on request.",
  nextCohort: "Autumn MMXXVI · applications close 31 August",

  whatItIs: [
    "A structured programme in ḥijāma — cupping — as practised within the Prophetic tradition and held to modern clinical safety standards. It is professional medical training, not a weekend workshop.",
    "The programme integrates transmission (graded Prophetic reports and classical texts), supervised clinical practice, and assessed competence. Graduates receive the institution's Certificate in Prophetic Cupping, issued upon successful completion of all modules.",
    "Teaching is in person. The Academy does not offer this programme as self-paced video content. Skill in ḥijāma is acquired by supervised practice, not by observation alone.",
  ],

  forWhom: [
    "Qualified healthcare professionals seeking to add ḥijāma within their scope of practice, with clear understanding of limits and referral.",
    "Practitioners of Prophetic Medicine who hold prior training in anatomy, infection control, and first response — or who complete the prerequisite module.",
    "Residents of the United Kingdom or those able to attend in person for the full twelve-week term.",
  ],

  whatItAsks: [
    "Attendance at all scheduled sessions. Absence beyond two excused days requires remediation before certification.",
    "Completion of pre-reading for each module — sources are assigned, not optional.",
    "Clinical practice under supervision, including a minimum of forty supervised cupping sessions on live models and consented volunteers.",
    "Passing written and practical assessments, and adherence to the Academy's clinical conduct policy.",
  ],

  learningOutcomes: [
    { outcome: "State the graded Prophetic reports on ḥijāma and distinguish Established from Reported narrations.", assessed: true },
    { outcome: "Describe anatomical sites used in the Prophetic tradition and contraindications recognised by the institution.", assessed: true },
    { outcome: "Perform dry and wet cupping to institutional standard under supervision.", assessed: true },
    { outcome: "Maintain sterility, informed consent, and documentation to clinical audit standard.", assessed: true },
    { outcome: "Identify when to refer to a physician and articulate honest limits to patients.", assessed: true },
    { outcome: "Situate ḥijāma within Tibb al-Nabawī without attributing cure — means, not miracle.", assessed: true },
  ],

  curriculum: [
    {
      number: "I",
      title: "Foundations of Ḥijāma in the Sunnah",
      hours: 24,
      description:
        "The Prophetic reports, their grading, and the classical commentators. Ibn al-Qayyim, al-Ṭibb al-Nabawī, and the institutional editorial standard.",
      sources: ["Ṣaḥīḥ al-Bukhārī · Kitāb al-Ṭibb", "Ibn al-Qayyim · al-Ṭibb al-Nabawī · Bab al-Ḥijāma"],
    },
    {
      number: "II",
      title: "Anatomy & Contraindications",
      hours: 32,
      description:
        "Surface anatomy, vascular and nervous consideration, skin integrity. Contraindications: bleeding disorders, anticoagulation, pregnancy, acute infection, and others — stated without compromise.",
      sources: ["Institution Clinical Protocol CP-001", "WHO Traditional Medicine Safety Guidelines (referenced)"],
    },
    {
      number: "III",
      title: "Infection Control & Clinical Environment",
      hours: 20,
      description:
        "Sterile technique, instrument processing, waste disposal, room preparation. Audit checklist used in all supervised sessions.",
      sources: ["Institution Infection Control Standard ICS-003"],
    },
    {
      number: "IV",
      title: "Technique — Dry Cupping",
      hours: 28,
      description:
        "Equipment, pressure, duration, sites. Supervised practice on models before live volunteers.",
      sources: ["Classical site maps · institutional technique manual TM-Ḥ1"],
    },
    {
      number: "V",
      title: "Technique — Wet Cupping (Ḥijāma)",
      hours: 48,
      description:
        "Incision depth, volume, aftercare. Extended supervised clinic hours. Each student is observed until competence is recorded.",
      sources: ["Institutional technique manual TM-Ḥ2", "Clinical log — minimum 40 sessions"],
    },
    {
      number: "VI",
      title: "Consent, Documentation & Ethics",
      hours: 16,
      description:
        "Informed consent as adab. Records, referral pathways, limits of practice. The patient received as a guest.",
      sources: ["Academy Clinical Ethics module", "Institution Consent Form CF-Ḥ1"],
    },
    {
      number: "VII",
      title: "Clinical Integration & Assessment",
      hours: 72,
      description:
        "Supervised clinic roster, case discussion, written examination, and practical OSCE before the certification board.",
      sources: ["OSCE rubric CR-Ḥ1", "Written paper WP-Ḥ1"],
    },
  ],

  faculty: [
    {
      name: "Dr. Yūsuf al-Karamī",
      title: "Programme Director · Clinical Lead",
      licence: "MBBS · MRCGP · Institution Ijāza in Ḥijāma",
      chain: "Studied under Shaykh ʿAbd al-Raḥmān al-Shaʿrāwī (Damascus) · licenced MMXX",
      biography: [
        "General practitioner with fifteen years in NHS primary care before dedicating to Prophetic Medicine within institutional bounds.",
        "Author of the institution's Clinical Protocol for Ḥijāma. Examiner for the certification board.",
      ],
    },
    {
      name: "Ustādh Nāṣir ibn Aḥmad",
      title: "Senior Lecturer · Isnād & Classical Texts",
      licence: "Ijāza in Ḥadīth · Academy Faculty since MMXXII",
      chain: "Sanad to Ibn al-Qayyim's tradition via Shaykh Muḥammad ʿAwwāma",
      biography: [
        "Teaches the graded Prophetic reports and classical commentary. Does not teach technique — transmission and text only.",
        "Responsible for Module I assessment and the sourcing discipline of all programme materials.",
      ],
    },
    {
      name: "Dr. Fāṭima Rahman",
      title: "Clinical Supervisor · Infection Control",
      licence: "MBBS · Diploma in Tropical Medicine · ICS Lead",
      chain: "NHS consultant microbiologist · institution clinical faculty",
      biography: [
        "Oversees sterility standards and clinical environment audits. No session proceeds without ICS sign-off for that day.",
      ],
    },
  ],

  certification: [
    "The Certificate in Prophetic Cupping is issued by Sunnah Remedies Academy upon successful completion of all seven modules, forty supervised clinical sessions, written examination, and practical OSCE.",
    "Certification attests to training completed to the institution's standard — it is not a government licence to practise medicine. Graduates must comply with local law and professional regulation.",
    "The certificate carries a unique number, cohort date, and the names of the Programme Director and examining board. Verification is available to employers and regulators on written request.",
    "Continuing practice requires adherence to the institution's clinical protocols. Graduates may audit refresher days; revision of technique is offered without marketing pressure.",
  ],

  entryRequirements: [
    "Minimum age twenty-one.",
    "Healthcare qualification (MBBS, nursing registration, physiotherapy, or equivalent) OR completion of the Academy's Foundations of Prophetic Medicine with distinction AND the Anatomy prerequisite short course.",
    "Current Enhanced DBS certificate (United Kingdom) or equivalent background check for international applicants.",
    "First Aid at Work certificate dated within three years.",
    "Written application (500 words) stating prior study, motivation, and understanding that ḥijāma is a means — not a cure. Applications are read by faculty, not algorithms.",
    "Interview with Programme Director. Not all applicants are accepted. Refusal is not appealable to marketing staff; it is a clinical and academic judgement.",
  ],

  assessment: [
    "Module I: written paper on graded reports and classical commentary (pass mark 70%).",
    "Modules II–III: practical checklist signed by supervisor — no mark, pass or remediate.",
    "Modules IV–V: clinical log of forty supervised sessions; each session signed. Quality review at session twenty and forty.",
    "Module VI: case study — consent and documentation exercise.",
    "Final OSCE: fifteen-minute supervised cupping on a consenting volunteer, observed by two examiners. Rubric published at enrolment.",
    "Failure: one remediation attempt per component. A second failure requires re-enrolment in the following cohort at the candidate's expense.",
  ],

  clinicalPractice: [
    "Supervised clinic operates twice weekly during term. Each student is assigned a supervisor and a clinical partner.",
    "Volunteers are recruited through the institution's correspondence channel — never paid for participation. Consent is documented per CF-Ḥ1.",
    "Students do not practise on one another without explicit consent and supervisor presence.",
    "Adverse events are reported immediately to the Programme Director and documented. The institution publishes an annual summary — including nil returns — as amāna.",
    "Referral pathways to NHS and private physicians are established before the first live session.",
  ],

  faq: [
    {
      question: "Is this programme recognised by the NHS?",
      answer:
        "The certificate is issued by the institution, not the NHS. Some graduates integrate ḥijāma within existing regulated roles; others practise independently within local law. We advise each applicant to seek their own regulatory advice.",
    },
    {
      question: "Can I practise after one weekend?",
      answer: "No. This programme is twelve weeks with forty supervised sessions. Shorter courses exist elsewhere; this is not one of them.",
    },
    {
      question: "Does the Prophetic report guarantee benefit?",
      answer:
        "The institution grades reports and teaches them honestly. We do not promise outcome to patients or students. Ḥijāma is taught as a means within bounds.",
    },
    {
      question: "Are instalments available?",
      answer:
        "Yes, on request and without interest. The full fee must be secured before the final OSCE. No surprise charges.",
    },
    {
      question: "What if I miss sessions?",
      answer:
        "Two excused absences may be remediated by arrangement. Beyond that, certification is deferred to the next cohort without refund of completed modules.",
    },
  ],

  testimonials: [
    {
      statement:
        "The sourcing discipline alone changed how I speak to patients. Technique was rigorous — I was not signed off until session forty-one because my supervisor insisted on depth.",
      name: "A.K.",
      context: "GP · Cohort Spring MMXXV",
      year: "MMXXV",
    },
    {
      statement:
        "I had taken a weekend course elsewhere. This programme showed me what I did not know. The OSCE was the fairest and most demanding assessment I have undergone.",
      name: "S.M.",
      context: "Registered nurse · Cohort Autumn MMXXIV",
      year: "MMXXIV",
    },
    {
      statement:
        "The faculty did not sell. They corrected my incisions in week six and expected improvement. That is what professional training should be.",
      name: "I.H.",
      context: "Physiotherapist · Cohort Spring MMXXIV",
      year: "MMXXIV",
    },
  ],

  facilities: [
    {
      name: "Clinical suite",
      description:
        "Six bay cupping suite with surgical-grade lighting, autoclave, and single-use instrument supply. Designed for observation and supervision.",
    },
    {
      name: "Reading room",
      description:
        "Manuscript facsimiles, reference editions of Ṣaḥīḥ al-Bukhārī and Ibn al-Qayyim, and the institution's annotated curriculum binders. Silence is the rule.",
    },
    {
      name: "Seminar hall",
      description:
        "Forty-seat hall for didactic sessions and case discussion. Not a lecture theatre — tables for notes and sources.",
    },
    {
      name: "Consultation room",
      description:
        "Private room for consent, history, and referral conversations — where clinical adab is practised before technique.",
    },
  ],

  gallery: [
    { id: "clinical-suite", caption: "Clinical suite — six supervised bays", alt: "Line study of the clinical cupping suite with six bays and central supervision desk." },
    { id: "reading-room", caption: "Reading room — reference editions and curriculum binders", alt: "Line study of shelves with bound texts and a single reading table." },
    { id: "seminar-hall", caption: "Seminar hall — case discussion", alt: "Line study of a seminar room with tables arranged for discussion, not rows." },
    { id: "instruments", caption: "Instrument preparation area", alt: "Line study of cupping instruments laid out for sterile processing." },
  ],

  policies: [
    {
      title: "Cancellation & deferral",
      body: [
        "Full refund if the institution cancels a cohort. If the applicant withdraws before the start date, tuition is refunded minus a £150 administration fee.",
        "After the start date, no refund. Deferral to the next cohort is permitted once, with a £200 transfer fee.",
      ],
    },
    {
      title: "Conduct",
      body: [
        "The Academy's clinical conduct policy applies from enrolment. Harassment, practising without supervision, or misrepresenting certification results in immediate dismissal without refund.",
      ],
    },
    {
      title: "Clinical responsibility",
      body: [
        "Students practise only under supervision until certified. Unsupervised practice during enrolment is grounds for dismissal and report to regulators where required.",
        "The institution carries clinical indemnity for supervised sessions only.",
      ],
    },
    {
      title: "Privacy",
      body: [
        "Application data is held under the institution's correspondence standard. Testimonials are published only with written consent; initials used unless the graduate requests otherwise.",
      ],
    },
  ],

  pathways: [
    { label: "Foundations of Prophetic Medicine", href: "/the-academy/foundations" },
    { label: "Clinical Practice & Ethics", href: "/the-academy/clinical-ethics" },
    { label: "The Apothecary — remedies used in aftercare", href: "/the-apothecary" },
  ],
};
