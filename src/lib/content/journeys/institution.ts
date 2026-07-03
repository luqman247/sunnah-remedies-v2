import type { FaqItem } from "../types";
import type { PolicyItem } from "./types";

export interface JourneyReadingItem {
  title: string;
  note: string;
  href: string;
  required: boolean;
}

export interface EducationalSession {
  title: string;
  format: string;
  description: string;
}

export interface RegistrationStep {
  step: string;
  title: string;
  description: string;
  duration?: string;
}

export interface JourneyInstitution {
  preparationTimeline: { phase: string; items: string[] }[];
  readingList: JourneyReadingItem[];
  packingGuide: { category: string; items: string[] }[];
  flightGuidance: PolicyItem[];
  accommodationPhilosophy: PolicyItem[];
  educationalSessions: EducationalSession[];
  reflectionJournals: PolicyItem[];
  companionship: PolicyItem[];
  healthGuidance: PolicyItem[];
  registrationSteps: RegistrationStep[];
  policies: PolicyItem[];
  faq: FaqItem[];
}

export const journeyInstitution: JourneyInstitution = {
  preparationTimeline: [
    {
      phase: "Eight weeks before travel",
      items: [
        "Confirm passport validity (usually at least six months).",
        "Begin Module I of the assigned reading and register your interest if needed.",
        "Provide written health disclosures to the coordinator.",
        "Review visa or permit requirements on the programme page.",
      ],
    },
    {
      phase: "Six weeks before travel",
      items: [
        "Complete Modules I-II and submit the written intention reflection.",
        "Submit travel insurance details, including medical evacuation where required.",
        "Complete the interview with a scholar or coordinator if outstanding.",
      ],
    },
    {
      phase: "Four weeks before travel",
      items: [
        "Confirm medical fitness for walking, heat, or altitude as relevant.",
        "Confirm flights and share the itinerary with the coordinator.",
        "Complete Modules III-IV; the journey reader is issued after placement confirmation.",
      ],
    },
    {
      phase: "Two weeks before travel",
      items: [
        "Review packing with your guide using the programme kit list.",
        "Return emergency contact and next-of-kin forms.",
        "Confirm final dietary and accessibility requirements.",
      ],
    },
    {
      phase: "One week before travel",
      items: [
        "Attend online orientation covering meeting points, adab, phone policy, and health reminders.",
        "Pack copies of documents separately from originals.",
        "Prioritise rest before departure.",
      ],
    },
  ],

  readingList: [
    {
      title: "Foundations of Prophetic Medicine",
      href: "/the-academy/foundations",
      note: "Required for all journeys: terminology, grading, and method.",
      required: true,
    },
    {
      title: "Prophetic Medicine — Knowledge Library",
      href: "/knowledge-library/prophetic-medicine",
      note: "Institutional guidance on citation and limits of evidence.",
      required: true,
    },
    {
      title: "Ibn al-Qayyim · al-Ṭibb al-Nabawī (selected chapters)",
      href: "/knowledge-library/prophetic-medicine",
      note: "Translation provided by the institution after placement.",
      required: true,
    },
    {
      title: "Journey-specific reader",
      href: "/sacred-journeys/itineraries",
      note: "Issued at placement confirmation; modules vary by programme.",
      required: true,
    },
    {
      title: "Travel adab & health — institution briefing paper",
      href: "/sacred-journeys/health-guidance",
      note: "Distributed four weeks before departure.",
      required: true,
    },
  ],

  packingGuide: [
    {
      category: "Documents",
      items: [
        "Passport, visa, and insurance certificate with originals and copies stored separately.",
        "Placement confirmation, emergency contacts, and prescriber letters for medications.",
      ],
    },
    {
      category: "Clothing & adab",
      items: [
        "Modest dress suitable for teaching and rites; follow programme guidance.",
        "Broken-in walking footwear, blister care supplies, and weather-appropriate layers.",
        "Iḥram garments where applicable (two sets) and unscented soap where required.",
      ],
    },
    {
      category: "Health & comfort",
      items: [
        "Personal medications in original packaging with a copy of repeat prescriptions.",
        "Reusable water bottle and electrolytes where heat is expected.",
        "Small first-aid kit: plasters, antiseptic, and personal analgesic where used.",
      ],
    },
    {
      category: "Study & reflection",
      items: [
        "Assigned reading; paper copies are preferred on device-limited days.",
        "Institution journal or a plain notebook of similar size.",
        "Use pen and paper in seminars unless alternative arrangements are approved.",
      ],
    },
    {
      category: "What the institution provides",
      items: [
        "Each journey page states what is included (for example bedding, meals, or local transport).",
        "Avoid packing duplicate comfort items that are already provided.",
      ],
    },
  ],

  flightGuidance: [
    {
      title: "Your flights — our coordination",
      body: [
        "Sacred Journeys is an educational institution, not a travel agency.",
        "Travellers arrange their own international flights (or overland travel) to the stated meeting point.",
        "Share flight numbers and arrival times by four weeks so ground coordination can be arranged.",
      ],
    },
    {
      title: "Meeting points",
      body: [
        "Each journey sets one arrival window and one meeting location.",
        "If delayed, correspond in advance; the group may not be able to wait beyond the stated window.",
        "Where included in the fee, departure transfer is organised for the cohort rather than individual bespoke transfers.",
      ],
    },
    {
      title: "Baggage & connections",
      body: [
        "Keep essentials in carry-on: documents, medications, and one change of clothing.",
        "Allow practical connection margins; missed onward flights due to airline disruption remain the traveller's responsibility.",
        "Follow the programme kit list and avoid unnecessary excess baggage.",
      ],
    },
  ],

  accommodationPhilosophy: [
    {
      title: "Lodging policy",
      body: [
        "Lodging is selected for proximity to teaching sites, safety, and practical simplicity.",
        "Distance to key locations is stated in metres and walking minutes without embellishment.",
        "Shared rooms are standard unless a programme states otherwise; upgrades are not sold.",
      ],
    },
    {
      title: "What you should expect",
      body: [
        "Rooms are clean, secure, and modest, with bathroom arrangements stated before registration.",
        "Meal count, timing, and dietary accommodation are declared in the fee note.",
        "Silence hours and adab are posted on arrival.",
      ],
    },
    {
      title: "Limits of provision",
      body: [
        "No guarantee is made for haram-view rooms, five-star service, or private villas.",
        "Programmes are educational pilgrimages and do not follow resort-style hospitality models.",
        "Concerns about inaccurate description are treated seriously; requests for luxury upgrades are outside scope.",
      ],
    },
  ],

  educationalSessions: [
    {
      title: "Seminar",
      format: "Scholar-led · sourced",
      description:
        "Graded texts and Prophetic reports are taught with references; written questions may be requested.",
    },
    {
      title: "Field study",
      format: "Guide-led · on site",
      description:
        "On-site sessions in groves, routes, or historical locations linked to relevant monographs and library readings.",
    },
    {
      title: "Evening circle",
      format: "Reflection · moderated",
      description:
        "Moderated reflection using assigned prompts; private sharing remains optional.",
    },
    {
      title: "Practical instruction",
      format: "Rites or skills · supervised",
      description:
        "Rites or route skills are taught before practice and delivered at a measured pace.",
    },
    {
      title: "Q&A",
      format: "Written submission preferred",
      description:
        "Scholars respond within session limits; the format is instructional rather than polemical.",
    },
  ],

  reflectionJournals: [
    {
      title: "Purpose",
      body: [
        "The journal is an assigned part of study and reflection.",
        "Prompts are tied to the reading and daily seminar, with one minimum entry on appointed evenings.",
      ],
    },
    {
      title: "Format",
      body: [
        "Use the institution journal issued on arrival or a plain notebook of similar size.",
        "Entries are handwritten on device-limited evenings unless accessibility adjustments are agreed in advance.",
        "Submit a final reflection before departure; it is not graded but may be required for completion certification.",
      ],
    },
    {
      title: "Privacy",
      body: [
        "Journals remain private unless you choose to share excerpts in circle.",
        "Scholars do not read interim entries without consent; only the final reflection is submitted.",
      ],
    },
  ],

  companionship: [
    {
      title: "Group size & composition",
      body: [
        "Cohorts are capped (typically twelve to twenty) to preserve teaching quality, safety, and companionship.",
        "Room assignments may mix backgrounds where appropriate; nationality-based separation is used only where law requires.",
      ],
    },
    {
      title: "Adab",
      body: [
        "Travellers eat together, walk together, and observe scheduled silence together.",
        "Punctuality is a core expectation; delays should be communicated in advance.",
        "Disruptive conduct, intoxication, or disregard for modest dress may lead to removal without refund.",
      ],
    },
    {
      title: "Devices",
      body: [
        "Each journey states its phone policy, often restricting use to appointed times.",
        "Photography during teaching sessions is restricted in order to preserve focus and respect.",
      ],
    },
  ],

  healthGuidance: [
    {
      title: "Before travel",
      body: [
        "Disclose chronic conditions, pregnancy, mobility limits, and medications to the coordinator.",
        "Consult your physician if you have cardiovascular disease, heat sensitivity, or recent surgery.",
        "Follow UK travel health guidance for vaccinations; journey-specific requirements are stated by the institution.",
      ],
    },
    {
      title: "During the journey",
      body: [
        "Hydration and heat management are mandatory, especially on desert and Umrah programmes.",
        "Foot care is addressed early, and walking limits are adjusted by guides where needed.",
        "Report illness promptly to the retreat physician or coordinator; local hospital details are provided at orientation.",
      ],
    },
    {
      title: "When not to travel",
      body: [
        "Placement may be declined or deferred for unstable medical conditions.",
        "Pregnancy is assessed individually; some journeys are not suitable.",
        "If FCDO advises against travel, departure is postponed with a full refund.",
      ],
    },
  ],

  registrationSteps: [
    {
      step: "I",
      title: "Review the programme",
      description:
        "Read the full programme page, including preparation, health, policy, and difficulty notes.",
      duration: "At your pace",
    },
    {
      step: "II",
      title: "Register your interest",
      description:
        "This is not a booking. Submit correspondence with health disclosures and prior study details.",
      duration: "One sitting",
    },
    {
      step: "III",
      title: "Complete reading review",
      description:
        "The coordinator confirms Module I (or equivalent) and assigns remaining reading.",
      duration: "1–2 weeks",
    },
    {
      step: "IV",
      title: "Interview",
      description:
        "Interview with a scholar or coordinator to confirm motivation, fitness, and understanding of programme expectations.",
      duration: "30 minutes",
    },
    {
      step: "V",
      title: "Placement confirmation",
      description:
        "Receive a written letter setting out fee schedule, meeting point, kit list, and flight window.",
      duration: "As stated",
    },
    {
      step: "VI",
      title: "Prepare & travel",
      description:
        "Follow the preparation timeline and attend the orientation call one week before departure.",
      duration: "Eight weeks to departure",
    },
  ],

  policies: [
    {
      title: "Registration & cancellation",
      body: [
        "Register your interest; placement is confirmed after interview and reading review.",
        "If you cancel more than twelve weeks before departure, a refund is made minus the administrative fee stated in correspondence.",
        "Later cancellation follows the fee terms stated in correspondence.",
        "If the institution postpones for safety or advisories, a full refund or transfer is offered.",
      ],
    },
    {
      title: "Conduct",
      body: [
        "Modest dress, punctuality, and adherence to group protocol are conditions of participation.",
        "Removal for conduct does not include a refund; return travel remains the traveller's responsibility.",
      ],
    },
    {
      title: "Health & fitness",
      body: [
        "Honest health disclosure is required; misrepresentation may affect insurance and placement.",
        "The retreat physician may advise non-participation in specific activities on clinical grounds.",
      ],
    },
    {
      title: "Insurance",
      body: [
        "Comprehensive travel insurance including medical evacuation is required, with certificate submission by four weeks.",
        "Institution liability covers organised activities only and does not extend to personal travel arrangements.",
      ],
    },
  ],

  faq: [
    {
      question: "Is Sacred Journeys a travel agency?",
      answer:
        "No. Sacred Journeys is an educational pilgrimage institution. Travellers arrange their own flights; the institution provides scholarship, curriculum, lodging policy, and programme coordination.",
    },
    {
      question: "How do I register?",
      answer:
        "Begin by registering your interest. Reading review, interview, and fitness confirmation take place before placement is confirmed.",
    },
    {
      question: "What if travel is inadvisable?",
      answer:
        "If official advisories recommend against travel, departure is postponed and a full refund is offered.",
    },
    {
      question: "Are flights included?",
      answer:
        "International flights are excluded unless explicitly stated in the fee note. Ground coordination is included where specified.",
    },
    {
      question: "Will I have a luxury room?",
      answer:
        "Lodging is modest and clearly described in advance, including distance and bathroom arrangement. Upgrades are not sold.",
    },
    {
      question: "Can I skip seminars?",
      answer:
        "No. Scheduled sessions are compulsory, and optional sightseeing is not part of the programme.",
    },
    {
      question: "Is this suitable for children?",
      answer:
        "Each programme states its minimum age. Umrah and walking journeys usually require adult participants; correspondence confirms the details.",
    },
  ],
};
