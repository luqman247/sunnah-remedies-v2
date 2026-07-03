import type { AcademyProgramme } from "./types";

/** Canonical Hijāma Diploma — single source for all Academy section pages. */
export const hijamaDiploma: AcademyProgramme = {
  slug: "hijama",
  name: "The Hijāma Diploma",
  subtitle:
    "Professional training in Prophetic cupping, delivered over twelve weeks, two hundred and forty contact hours, and forty supervised clinical sessions",
  folio: "ii",
  tier: "Professional",
  duration: "12 weeks · 240 contact hours",
  format: "In-person · The Academy, London",
  fee: "£2,400",
  feeNote:
    "Fee includes clinical materials, assessment, certification, and supervised clinic access. Instalments are available on request with no interest.",
  nextCohort: "Autumn MMXXVI · applications close 31 August",

  whatItIs: [
    "The Hijāma Diploma is a structured programme in ḥijāma, taught within the Prophetic tradition and aligned with contemporary clinical safety standards. It is a formal course of professional training, not a short workshop or remote class.",
    "The curriculum combines transmission (graded Prophetic reports and classical texts), supervised clinical practice, and assessed competence. Graduates receive the institution's Certificate in Prophetic Cupping after successful completion of all modules.",
    "Teaching is delivered in person. Competence is developed through supervised practice on consenting volunteers, not through video learning or unsupervised observation.",
    "The Academy teaches dry cupping (vacuum without incision) and wet cupping (ḥijāma, controlled bloodletting after puncture). Both are taught with the classical CPC sequence and institutional infection control standards.",
  ],

  forWhom: [
    "Qualified healthcare professionals, including physicians, nurses, physiotherapists, and allied roles, who wish to include ḥijāma within scope of practice with clear limits and referral pathways.",
    "Practitioners of Prophetic Medicine with prior training in anatomy, infection control, and first response, or those who complete the prerequisite pathway.",
    "Residents of the United Kingdom, or applicants who can attend in London for the full twelve-week term without exception.",
    "Applicants who understand that evidence for cupping in many conditions remains mixed, and who do not promise cure.",
  ],

  whatItAsks: [
    "Attend all scheduled sessions. Absence beyond two excused days requires remediation before certification.",
    "Completion of pre-reading for each module. Assigned sources are required.",
    "Complete forty supervised cupping sessions on live models and consenting volunteers, with signed logs.",
    "Pass written and practical assessments, and follow the Academy clinical conduct policy throughout enrolment.",
    "Maintain professional dress, punctuality, and audit-standard documentation from the first clinic hour.",
  ],

  learningOutcomes: [
    {
      outcome:
        "State the graded Prophetic reports on ḥijāma and distinguish Established from Reported narrations without conflation.",
      assessed: true,
    },
    {
      outcome:
        "Describe surface anatomy, classical sites, and contraindications recognised by the institution, including bleeding disorders, anticoagulation, pregnancy, acute infection, and cardiovascular risk.",
      assessed: true,
    },
    {
      outcome:
        "Perform dry cupping and wet cupping (CPC sequence) to institutional standard under direct supervision.",
      assessed: true,
    },
    {
      outcome:
        "Maintain sterility, informed consent, instrument processing, and clinical records to ICS-003 audit standard.",
      assessed: true,
    },
    {
      outcome:
        "Identify when to refer to a physician, articulate limits clearly, and avoid attributing cure.",
      assessed: true,
    },
    {
      outcome:
        "Recognise expected local effects (erythema, circular marks) versus complications requiring referral (infection, burns, vasovagal syncope).",
      assessed: true,
    },
    {
      outcome:
        "Situate ḥijāma within Tibb al-Nabawī and contemporary complementary practice without overstatement.",
      assessed: true,
    },
  ],

  curriculum: [
    {
      number: "I",
      title: "Foundations of Ḥijāma in the Sunnah",
      hours: 24,
      description:
        "Study of graded Prophetic reports, classical commentators, and the institutional editorial standard. Students learn to cite before making claims and to communicate with the same care in consultation.",
      sources: ["Ṣaḥīḥ al-Bukhārī · Kitāb al-Ṭibb", "Ibn al-Qayyim · al-Ṭibb al-Nabawī · Bab al-Ḥijāma"],
      practical: "Seminar discussion and graded-source examination preparation.",
    },
    {
      number: "II",
      title: "Anatomy, Physiology & Contraindications",
      hours: 32,
      description:
        "Surface anatomy, skin integrity, and vascular and neural considerations. Contraindications are taught without concession, aligned with institutional protocol and mainstream clinical guidance on who should not receive cupping.",
      sources: ["Institution Clinical Protocol CP-001", "StatPearls · Cupping Therapy (referenced)"],
      practical: "Palpation and marking exercises on models; contraindication case scenarios.",
    },
    {
      number: "III",
      title: "Infection Control & Clinical Environment",
      hours: 20,
      description:
        "Sterile technique, autoclave cycle, single-use instruments where required, waste disposal, and room preparation. No session proceeds without daily ICS sign-off.",
      sources: ["Institution Infection Control Standard ICS-003"],
      practical: "Instrument processing drill; audit checklist completion under supervision.",
    },
    {
      number: "IV",
      title: "Dry Cupping: Technique & Supervision",
      hours: 28,
      description:
        "Vacuum methods (manual pump and modern suction), including static and sliding application. Duration, pressure, and cup count are adjusted to site and patient context, typically three to seven cups per region in teaching clinic.",
      sources: ["Institutional technique manual TM-Ḥ1"],
      practical: "Supervised practice on models, then volunteers from session ten onward.",
    },
    {
      number: "V",
      title: "Wet Cupping (Ḥijāma): CPC Sequence",
      hours: 48,
      description:
        "The cupping-puncturing-cupping method: demarcation, sterilisation, dry cupping, superficial puncture, second cupping, and final sterilisation. Incision depth, volume, and aftercare are recorded. Each student is observed until competence is formally recorded.",
      sources: ["Institutional technique manual TM-Ḥ2", "Clinical log · minimum 40 sessions"],
      practical: "Twice-weekly supervised clinic, with quality review at sessions 20 and 40.",
    },
    {
      number: "VI",
      title: "Consent, Documentation & Clinical Ethics",
      hours: 16,
      description:
        "Informed consent as adab, with clear records, referral pathways, and limits of practice. Patients are received with dignity, not treated as transactions.",
      sources: ["Academy Clinical Ethics", "Institution Consent Form CF-Ḥ1"],
      practical: "Consent role-play in consultation room; documentation audit exercise.",
    },
    {
      number: "VII",
      title: "Clinical Integration, Assessment & Certification Board",
      hours: 72,
      description:
        "Supervised clinic roster, case conference, written examination, and a fifteen-minute OSCE before two examiners. The remediation pathway is published at enrolment.",
      sources: ["OSCE rubric CR-Ḥ1", "Written paper WP-Ḥ1"],
      practical: "Full clinical integration until certification board.",
    },
  ],

  faculty: [
    {
      name: "Dr. Yūsuf al-Karamī",
      title: "Programme Director · Clinical Lead",
      licence: "MBBS · MRCGP · Institution Ijāza in Ḥijāma",
      chain: "Studied under Shaykh ʿAbd al-Raḥmān al-Shaʿrāwī (Damascus) · licenced MMXX",
      biography: [
        "General practitioner with fifteen years in NHS primary care, now focused on Prophetic Medicine within institutional limits.",
        "Author of Clinical Protocol CP-001 for ḥijāma and examiner for the certification board. Teaches cupping as complementary care, not a replacement for physician care.",
      ],
    },
    {
      name: "Ustādh Nāṣir ibn Aḥmad",
      title: "Senior Lecturer · Isnād & Classical Texts",
      licence: "Ijāza in Ḥadīth · Academy Faculty since MMXXII",
      chain: "Sanad to Ibn al-Qayyim's tradition via Shaykh Muḥammad ʿAwwāma",
      biography: [
        "Teaches graded Prophetic reports and classical commentary. Instruction is limited to transmission and text, not clinical technique.",
        "Responsible for Module I assessment and sourcing discipline of all programme materials.",
      ],
    },
    {
      name: "Dr. Fāṭima Rahman",
      title: "Clinical Supervisor · Infection Control",
      licence: "MBBS · Diploma in Tropical Medicine · ICS Lead",
      chain: "NHS consultant microbiologist · institution clinical faculty",
      biography: [
        "Oversees sterility standards and clinical environment audits. No session proceeds without daily sign-off.",
        "Publishes an annual adverse-event summary, including nil returns, as amāna.",
      ],
    },
    {
      name: "Hannah Okonkwo",
      title: "Clinical Instructor · Practical Technique",
      licence: "MCSP · Institution Certificate in Prophetic Cupping · MMXXIV graduate",
      chain: "Physiotherapy · NHS musculoskeletal practice",
      biography: [
        "Teaches dry and sliding cupping within musculoskeletal assessment, without claims that exceed the evidence.",
        "Supervisor for Module IV practical sessions.",
      ],
    },
  ],

  certification: [
    "The Certificate in Prophetic Cupping is issued after successful completion of all seven modules, forty supervised clinical sessions, written examination (pass 70%), and practical OSCE.",
    "Certification confirms training completed to the institution's standard. It is not an NHS licence, not GMC registration, and not permission to practise medicine independently where law prohibits.",
    "The certificate carries a unique number, cohort date, and examining board names. Verification is available to employers and regulators on written request.",
    "Graduates must comply with local law and professional regulation. Continued adherence to institutional clinical protocols is expected. Refresher days are available.",
  ],

  entryRequirements: [
    "Minimum age is twenty-one.",
    "Healthcare qualification (MBBS, nursing registration, physiotherapy, or equivalent), OR Foundations of Prophetic Medicine with distinction and the Anatomy prerequisite short course.",
    "Current Enhanced DBS certificate (United Kingdom), or equivalent background check for international applicants.",
    "First Aid at Work certificate dated within the last three years.",
    "Written application (~500 words): prior study, motivation, and understanding that ḥijāma is a means, not a cure. Applications are reviewed by faculty.",
    "Interview with the Programme Director. Not all applicants are accepted. Decisions are made on clinical and academic grounds.",
    "Ability to attend the full term in London without partial remote attendance.",
  ],

  assessment: [
    "Module I: written paper on graded reports and classical commentary. Pass mark is 70%. One remediation attempt is allowed.",
    "Modules II-III: practical checklist signed by supervisor. Candidate must pass or remediate before live volunteers.",
    "Modules IV–V: clinical log of forty supervised sessions; each signed. Quality review at sessions 20 and 40.",
    "Module VI: consent and documentation case study. Candidate must pass or remediate.",
    "Final written paper WP-Ḥ1: anatomy, contraindications, and ethics. Pass mark is 70%.",
    "Final OSCE CR-Ḥ1: fifteen-minute supervised wet cupping on consenting volunteer, two examiners, rubric published at enrolment.",
    "Second failure on any component requires re-enrolment in the following cohort at the candidate's expense.",
  ],

  clinicalPractice: [
    "Supervised clinic operates twice weekly during term: Tuesday evening and Saturday morning.",
    "Volunteers are recruited through institutional correspondence and are never paid for participation. Consent is documented per CF-Ḥ1.",
    "Students do not practise on one another without explicit consent and supervisor presence.",
    "Expected local marks (circular erythema) are explained to volunteers before treatment.",
    "Adverse events reported immediately to Programme Director; vasovagal response protocol posted in every bay.",
    "Referral pathways to NHS and private physicians established before first live session.",
    "The institution carries clinical indemnity for supervised sessions only, not for unsupervised graduate practice.",
  ],

  clinicalStandards: [
    {
      title: "Scope & limits",
      body: [
        "Ḥijāma is taught as a complementary means within Tibb al-Nabawī, not as a standalone treatment for serious disease. The institution follows mainstream clinical guidance that cupping is generally low risk for suitable patients but should not replace physician care.",
        "Students and graduates must not claim cure, guaranteed benefit, or detoxification. Language should remain bounded: offered as a means, traditionally used for, and within the evidence.",
      ],
    },
    {
      title: "Contraindications: absolute",
      body: [
        "Pregnancy: cupping is not performed on patients who are pregnant.",
        "Bleeding disorders, haemophilia, therapeutic anticoagulation, or clotting dysfunction.",
        "History of deep vein thrombosis, stroke, or uncontrolled cardiovascular disease.",
        "Pacemaker or implanted device at treatment site.",
        "Active skin infection, eczema or psoriasis at site, open wounds, or acute systemic infection.",
        "Epilepsy or history of vasovagal syncope with needle procedures, assessed individually.",
        "Anaemia: haemoglobin is checked where clinical history indicates.",
      ],
    },
    {
      title: "Infection control",
      body: [
        "Single-patient use blades for puncture; sterile cups processed per ICS-003.",
        "Hand hygiene, gloves, field preparation, and waste segregation without exception.",
        "Post-treatment site care is explained to each volunteer. Signs of infection require physician referral.",
      ],
    },
    {
      title: "Technique standards",
      body: [
        "Dry cupping: typical application 10–15 minutes per static cup; pressure adjusted to tolerance; fewer cups when learning.",
        "Wet cupping: CPC sequence - demarcate, sterilise, cup, puncture superficially, cup again, sterilise. Volume and depth are recorded in the log.",
        "Burns from heated cups are forbidden in clinic. Modern pump suction only.",
      ],
    },
    {
      title: "Evidence-informed teaching",
      body: [
        "Established: cupping causes local capillary disruption and marks; contraindications above are taught as standard clinical caution.",
        "Emerging: literature on pain, inflammation, and rheumatic conditions reports mixed outcomes. Cupping may be adjunctive, not replacement therapy (see Knowledge Library · Research).",
        "The Academy cites PMC8802202 and institutional sources. Students are examined on clinical limits and accurate communication.",
      ],
    },
  ],

  courseHandbook: [
    {
      title: "Term dates & timetable",
      body: [
        "Twelve-week term: didactic sessions Monday and Wednesday; supervised clinic Tuesday and Saturday.",
        "Reading week is in week eight. No clinic is held and written assignments are due.",
        "Full timetable is issued on enrolment confirmation.",
      ],
    },
    {
      title: "Attendance & punctuality",
      body: [
        "Register is signed on arrival. Two excused absences may be remediated; further absence defers certification.",
        "Late arrival beyond fifteen minutes counts as half absence.",
      ],
    },
    {
      title: "Dress & conduct",
      body: [
        "Clinical attire includes closed shoes, tied hair, no jewellery below the elbow in clinic, and an institution name badge.",
        "Mobile devices are silenced in teaching rooms and clinic. Photography is not permitted in clinic without consent.",
      ],
    },
    {
      title: "Academic integrity",
      body: [
        "Plagiarism or falsified clinical hours result in dismissal. Clinical logs are audited.",
      ],
    },
    {
      title: "Fees & instalments",
      body: [
        "Fee must be secured before the final OSCE. Instalments are available by written agreement with no interest or hidden charges.",
      ],
    },
  ],

  studentGuide: [
    {
      title: "Before your first day",
      body: [
        "Complete Module I pre-reading and submit reflection.",
        "Obtain DBS and First Aid certificates if not already held.",
        "Purchase student equipment (see Equipment list). The Academy supplies clinic consumables.",
        "Read clinical standards and contraindications. You will be assessed on them before live volunteer sessions.",
      ],
    },
    {
      title: "Your first week",
      body: [
        "Orientation includes facilities tour, ICS drill, and consent training. No live cupping in this period.",
        "Meet your supervisor and clinical partner. Pairing remains fixed for the term unless faculty reassigns you.",
        "Receive clinical logbook and technique manuals TM-Ḥ1 and TM-Ḥ2.",
      ],
    },
    {
      title: "During clinic",
      body: [
        "Every procedure requires supervisor sign-off until certification.",
        "Ask when uncertain. Correction is expected as part of training.",
        "Volunteers are received as guests. Explain marks, aftercare, and referral pathways plainly.",
      ],
    },
    {
      title: "Assessment weeks",
      body: [
        "Written papers are announced at term start. OSCE schedule is published in week ten.",
        "One remediation appointment is offered per failed component.",
      ],
    },
    {
      title: "After certification",
      body: [
        "Verification letters are available on request. Graduate pathways are published without career guarantees.",
        "Refresher days are open to graduates for technique revision.",
      ],
    },
  ],

  practicalSessions: [
    {
      title: "Orientation & infection control drill",
      schedule: "Week 1 · Monday",
      hours: 6,
      description: "Facilities induction, ICS-003, and instrument processing, with no patient contact.",
      supervision: "Dr. Fāṭima Rahman · full faculty present",
    },
    {
      title: "Dry cupping: models",
      schedule: "Weeks 2–3 · Tuesday clinics",
      hours: 12,
      description: "Vacuum application, static and sliding technique on training models.",
      supervision: "Hannah Okonkwo · one supervisor per four students",
    },
    {
      title: "Dry cupping: volunteers",
      schedule: "Weeks 4–5 · Tuesday & Saturday",
      hours: 16,
      description: "Consent, assessment, and dry cupping on consenting volunteers.",
      supervision: "Clinical instructor with Programme Director oversight",
    },
    {
      title: "Wet cupping: CPC introduction",
      schedule: "Week 6 · Saturday intensive",
      hours: 8,
      description: "Step-by-step CPC on models, with puncture-depth exercise on synthetic skin.",
      supervision: "Dr. Yūsuf al-Karamī · Dr. Fāṭima Rahman",
    },
    {
      title: "Supervised wet cupping clinic",
      schedule: "Weeks 7–12 · twice weekly",
      hours: 48,
      description: "Live CPC on volunteers, with each session logged and reviewed at 20 and 40.",
      supervision: "Named supervisor per student · no solo practice",
    },
    {
      title: "Case conference & OSCE preparation",
      schedule: "Weeks 11–12",
      hours: 8,
      description: "Adverse-event scenarios, referral drills, and mock OSCE.",
      supervision: "Full faculty",
    },
  ],

  equipmentList: [
    { item: "Stethoscope", specification: "Standard clinical", supplied: "Student" },
    { item: "Clinical tunic or scrubs", specification: "Plain and washable", supplied: "Student" },
    { item: "Closed clinical shoes", specification: "Non-slip", supplied: "Student" },
    { item: "Notebook & clinical log", specification: "Institution logbook is issued", supplied: "Academy" },
    { item: "Cupping cups ( silicone set )", specification: "For home practice on models only, not volunteers", supplied: "Student" },
    { item: "Manual suction pump", specification: "Compatible with student set", supplied: "Student" },
    { item: "Technique manuals TM-Ḥ1 & TM-Ḥ2", specification: "Current edition", supplied: "Academy" },
    { item: "Sterile single-use lancets", specification: "Clinic use only", supplied: "Academy" },
    { item: "Autoclave-processed glass cups", specification: "Six-bay clinic sets", supplied: "Academy" },
    { item: "PPE · gloves, aprons, sharps disposal", specification: "Per ICS-003", supplied: "Academy" },
  ],

  graduatePathways: [
    {
      title: "Within regulated healthcare",
      body: [
        "Graduates in NHS roles may integrate ḥijāma within existing scope, subject to employer policy and indemnity. The institution advises written regulatory correspondence before advertising services.",
      ],
      href: "/the-academy/clinical-standards",
    },
    {
      title: "Independent Prophetic Medicine practice",
      body: [
        "Some graduates establish clinics under local law. The certificate verifies training and is not a licence. Clinical indemnity and premises standards remain the graduate's responsibility.",
      ],
      href: "/consultations",
    },
    {
      title: "Further Academy study",
      body: [
        "Materia Medica, Clinical Practice & Ethics, and Sacred Journeys programmes are open to graduates by application.",
      ],
      href: "/the-academy/materia-medica",
    },
    {
      title: "Teaching & supervision",
      body: [
        "Graduates with three years of documented practice may apply for the Clinical Instructor pathway. Interview and observed teaching are required.",
      ],
    },
    {
      title: "The Register",
      body: [
        "Graduates may apply for listing on the institution Register, subject to certificate verification and adherence to clinical protocols.",
      ],
      href: "/the-register",
    },
  ],

  enrolmentJourney: [
    {
      step: "I",
      title: "Read programme details",
      description:
        "Read the curriculum, clinical standards, assessment method, and policies in full before applying.",
      duration: "At your pace",
    },
    {
      step: "II",
      title: "Confirm prerequisites",
      description:
        "Prepare DBS, First Aid, and either healthcare qualification evidence or Foundations pathway evidence before application.",
      duration: "1–2 weeks",
    },
    {
      step: "III",
      title: "Send application",
      description:
        "Complete the online application with correspondence details, qualifications, a 500-word statement, and prerequisite uploads.",
      duration: "One sitting",
    },
    {
      step: "IV",
      title: "Faculty review",
      description:
        "Applications are reviewed by the Programme Director and clinical lead. There is no automated acceptance.",
      duration: "Up to 14 days",
    },
    {
      step: "V",
      title: "Interview",
      description:
        "Thirty-minute interview covering clinical judgement, motivation, and understanding of limits. A short viva on contraindications may be included.",
      duration: "30 minutes",
    },
    {
      step: "VI",
      title: "Offer and enrolment",
      description:
        "Written offer includes term dates, fee schedule, and handbook. Place is secured by deposit, with balance due before OSCE.",
      duration: "As stated in offer",
    },
    {
      step: "VII",
      title: "Prepare for term",
      description:
        "Complete Module I reading, purchase equipment, and review the orientation pack. No live cupping on the first day.",
      duration: "Before cohort start",
    },
  ],

  faq: [
    {
      question: "Is this programme recognised by NHS services?",
      answer:
        "The certificate is issued by the institution, not by the NHS. Some graduates integrate ḥijāma within regulated roles, while others practise independently within local law. We advise applicants to seek individual regulatory advice.",
    },
    {
      question: "Can I practise after a weekend course?",
      answer:
        "No. The programme requires twelve weeks, forty supervised sessions, a written examination, and an OSCE.",
    },
    {
      question: "Do Prophetic reports guarantee benefit?",
      answer:
        "The institution grades reports and teaches them with clear sourcing. We do not promise outcomes. Ḥijāma is presented as a means within defined limits.",
    },
    {
      question: "What marks may volunteers observe?",
      answer:
        "Circular erythema from suction is expected and usually fades within one to two weeks. This is explained before consent and is not treated as injury when technique is appropriate.",
    },
    {
      question: "Are instalments available?",
      answer: "Yes. Instalments are available on request without interest. Full fee is secured before the final OSCE.",
    },
    {
      question: "What happens if I miss sessions?",
      answer:
        "Two excused absences may be remediated. Beyond that threshold, certification is deferred to the next cohort and completed modules are not refunded.",
    },
    {
      question: "Is wet cupping considered safe?",
      answer:
        "Risk is generally low when contraindications are respected, sterility is maintained, and supervision is followed. Serious complications are uncommon but taught explicitly, including infection, syncope, and burns from incorrect technique.",
    },
  ],

  testimonials: [
    {
      statement:
        "The sourcing discipline changed how I speak to patients. Technique standards were strict, and sign-off came only when the required depth was demonstrated.",
      name: "A.K.",
      context: "GP · Cohort Spring MMXXV",
      year: "MMXXV",
    },
    {
      statement:
        "I had completed a weekend course elsewhere. This programme clarified what I still needed to learn. The OSCE was fair and demanding.",
      name: "S.M.",
      context: "Registered nurse · Cohort Autumn MMXXIV",
      year: "MMXXIV",
    },
    {
      statement:
        "The faculty did not use sales language. They corrected my incision technique in week six and required improvement. That is what professional training should involve.",
      name: "I.H.",
      context: "Physiotherapist · Cohort Spring MMXXIV",
      year: "MMXXIV",
    },
    {
      statement:
        "Contraindications were central to training and assessed before any volunteer contact. I trust the certificate because of the standard required to earn it.",
      name: "R.P.",
      context: "Allied health · Cohort Autumn MMXXIII",
      year: "MMXXIII",
    },
  ],

  facilities: [
    {
      name: "Clinical suite",
      description:
        "Six supervised bays with surgical-grade lighting, pump suction, autoclave, and sharps disposal. A central supervision desk keeps all stations in view.",
    },
    {
      name: "Consultation room",
      description:
        "Private room for history, consent, and contraindication screening before any procedure.",
    },
    {
      name: "Reading room",
      description:
        "Reference editions and curriculum binders are available in a quiet room reserved for study.",
    },
    {
      name: "Seminar hall",
      description:
        "Forty table seats support source reading, note-taking, and case discussion.",
    },
    {
      name: "Instrument preparation",
      description:
        "Dedicated processing area, visible from clinic, where students observe the sterilisation cycle as part of training.",
    },
  ],

  gallery: [
    { id: "clinical-suite", caption: "Clinical suite with six supervised bays", alt: "Line study of the clinical cupping suite with six bays and a central supervision desk." },
    { id: "reading-room", caption: "Reading room with reference editions and curriculum binders", alt: "Line study of shelves with bound texts and one reading table." },
    { id: "seminar-hall", caption: "Seminar hall for case discussion", alt: "Line study of a seminar room with tables arranged for discussion." },
    { id: "instruments", caption: "Instrument preparation area", alt: "Line study of cupping instruments laid out for sterile processing." },
  ],

  policies: [
    {
      title: "Cancellation and deferral",
      body: [
        "Full refund if the institution cancels a cohort.",
        "Withdrawal before start: tuition is refunded minus a £150 administration fee.",
        "After start: no refund. One deferral to the next cohort is available with a £200 transfer fee.",
      ],
    },
    {
      title: "Conduct",
      body: [
        "Clinical conduct policy applies from enrolment. Harassment, unsupervised practice, or misrepresentation of certification results in dismissal without refund.",
      ],
    },
    {
      title: "Clinical responsibility",
      body: [
        "Students practise only under supervision until certified. Unsupervised practice during enrolment is grounds for dismissal and regulator report where required.",
        "Indemnity covers supervised sessions only.",
      ],
    },
    {
      title: "Privacy and attestations",
      body: [
        "Application data is held under correspondence standards. Testimonials are published only with written consent.",
      ],
    },
  ],

  pathways: [
    { label: "Foundations of Prophetic Medicine", href: "/the-academy/foundations" },
    { label: "Clinical Standards", href: "/the-academy/clinical-standards" },
    { label: "Knowledge Library · Hijama", href: "/knowledge-library/hijama" },
    { label: "The Apothecary · aftercare", href: "/the-apothecary" },
  ],
};
