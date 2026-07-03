import type { SacredJourney } from "./types";

export const desertWay: SacredJourney = {
  slug: "desert-way",
  name: "The Desert Way",
  subtitle: "Walking discipline in the Arabian landscape — provision, patience, and Prophetic travel",
  folio: "iii",
  meaning: [
    "The desert in the Sunnah is not scenery — it is teacher. Travel for knowledge, hijra, and the refinement of dependence on Allah marks the Prophetic biography and the lives of the Companions.",
    "This journey is a structured walking retreat with educational sessions — not a luxury desert camp. You sleep simply, walk daily, and study the fiqh and adab of travel with scholars who have walked the route before.",
    "Honest difficulty is part of the design. Heat, distance, and sparse comfort are named in advance. Those who need softness should choose another journey.",
  ],

  season: "Autumn · after the harshest heat",
  duration: "10 days · 9 nights",
  location: "Hadramawt region, Yemen · institution-arranged camps",
  groupSize: "Maximum eight travellers · two scholars · two guides",
  fee: "£2,200",
  feeNote: "Includes camp provision, guides, permits, and materials. Excludes international flights and visa fees.",
  nextDeparture: "November MMXXVI · registration closes eight weeks before departure",

  forWhom: [
    "Experienced walkers aged twenty-one or above with prior retreat or camping experience.",
    "Graduates of Foundations or equivalent; Hijāma or Materia Medica graduates welcomed.",
    "Those medically cleared for heat exposure and consecutive days of walking up to four hours.",
  ],

  whatItAsks: [
    "Physical preparation programme issued on registration — eight weeks minimum.",
    "Acceptance of basic camp conditions: shared tents, limited washing, early sleep.",
    "Obedience to guide decisions on route and pace — safety overrides preference.",
    "No independent exploration outside the group.",
  ],

  preparation: [
    "Twelve weeks: visa and permit process begun through institution correspondence.",
    "Eight weeks: physical conditioning — prescribed walking schedule with log submitted.",
    "Six weeks: complete desert reader and Modules IV–V of Foundations.",
    "Four weeks: heat-acclimatisation guidance for those from cool climates.",
    "Two weeks: gear inspection via video call with guide; failures must be remediated before departure.",
  ],

  learning: [
    "Morning seminars on travel in the Sunnah — fiqh of journey, intention, and trust.",
    "Study of black seed and honey in Prophetic report — linked to Apothecary monographs carried on route.",
    "Evening circles: readings from Ibn Battuta and classical riḥla literature — travel as knowledge, not consumption.",
    "Navigation by star and landmark — taught as skill and as reflection on ayāt.",
  ],

  companionship: [
    "Eight travellers maximum. The desert does not tolerate large groups.",
    "Tent pairs assigned by the guide; gender separation at rest.",
    "Walking order rotates daily so no one always leads or always follows.",
    "Conflict is addressed by the scholar — the retreat cannot carry persistent disruption.",
  ],

  guidance: [
    "Two scholars and two local guides — one guide leads, one sweeps.",
    "Satellite communication for emergencies; check-in schedule with institution coordinator.",
    "Medical kit and evacuation plan established with local clinic before departure.",
  ],

  spiritualGrowth: [
    "The journey is designed to reduce distraction, not to guarantee spiritual states.",
    "Optional night prayer in camp — led, not required.",
    "Silence on walk blocks; conversation at camp after maghrib.",
    "Reflection on dependence — rizq, water, shade — is explicit in teaching.",
  ],

  safety: [
    "Route assessed seasonally; abandoned if temperature exceeds institution threshold.",
    "Water points mapped; minimum three litres carried per person on walk days.",
    "Heat illness briefing mandatory; guide authorised to halt the day.",
    "Political conditions monitored; postponement with refund if travel inadvisable.",
  ],

  organisation: [
    "Camp moved by support team where possible; travellers carry day packs only.",
    "Food: simple, high-energy, halal; dates and water always available.",
    "Sleeping: institutional tents; sleeping mat provided; sleeping bag on packing list.",
    "Washing: limited; wet wipes on list; honesty about conditions.",
  ],

  itinerary: [
    {
      day: "I",
      title: "Arrival & camp establishment",
      focus: "Adab of intention · settling in heat",
      activities: [
        "Meet in agreed town · transfer to first camp",
        "Orientation: heat, water, route overview",
        "Seminar: travel in the Sunnah — intention",
      ],
    },
    {
      day: "II",
      title: "First walk — short",
      focus: "Pace · hydration · silence",
      activities: [
        "Two-hour walk at dawn",
        "Rest through midday heat",
        "Seminar: provision and trust",
        "Evening reading: riḥla literature",
      ],
    },
    {
      day: "III",
      title: "The wadi",
      focus: "Landscape · black seed in tradition",
      activities: [
        "Walk through wadi — three hours",
        "Apothecary session: black seed monograph",
        "Camp discussion: means carried on journey",
      ],
    },
    {
      day: "IV",
      title: "Long walk",
      focus: "Endurance · companionship",
      activities: [
        "Four-hour walk with rest stops",
        "Silent block enforced",
        "Afternoon rest mandatory",
        "Evening: optional night prayer",
      ],
    },
    {
      day: "V",
      title: "Honey & hospitality",
      focus: "Sunnah of guest · local host",
      activities: [
        "Shorter walk to host community",
        "Seminar on honey — Apothecary link",
        "Hosted meal — adab of guest",
      ],
    },
    {
      day: "VI",
      title: "Stars & navigation",
      focus: "Skill · ayāt in creation",
      activities: [
        "Rest morning",
        "Afternoon navigation teaching",
        "Night walk under stars — short, optional",
      ],
    },
    {
      day: "VII",
      title: "Silence extended",
      focus: "Reflection · journaling",
      activities: [
        "Walk in silence — full morning",
        "Private reflection until maghrib",
        "Group check-in on safety and wellbeing",
      ],
    },
    {
      day: "VIII",
      title: "Return walk",
      focus: "Integration · fatigue management",
      activities: [
        "Moderate walk toward exit route",
        "Seminar: what you carry home",
        "Letters to self — sealed, mailed later",
      ],
    },
    {
      day: "IX",
      title: "Closing camp",
      focus: "Gratitude · departure preparation",
      activities: [
        "Short walk · pack down",
        "Final circle — voluntary speech",
        "Rest",
      ],
    },
    {
      day: "X",
      title: "Departure",
      focus: "Transfer · follow-up",
      activities: [
        "Transfer to departure point",
        "Institution correspondence within two weeks",
      ],
    },
  ],

  scholars: [
    {
      name: "Shaykh ʿAbd al-Salām al-Hadramī",
      role: "Journey Scholar · Fiqh & travel",
      grounding: "Resident scholar · Hadramawt · sanad in Shāfiʿī fiqh",
      biography: [
        "Teaches fiqh of journey and leads evening seminars. Walks with the group on alternate days.",
      ],
    },
    {
      name: "Dr. Yūsuf al-Karamī",
      role: "Institution Physician · Safety",
      grounding: "Academy clinical faculty · travel medicine",
      biography: [
        "Reviews medical clearance and travels with the group. Authority to halt for health.",
      ],
    },
  ],

  reflection: [
    "Daily journal — three lines minimum: provision seen, difficulty met, gratitude stated.",
    "Day VII extended silence — no speech from dawn to maghrib except emergency.",
    "Letter to self sealed on Day VIII — posted by institution six months later.",
  ],

  reading: [
    { title: "Foundations — Modules IV–V (travel & trust)", note: "Required before departure" },
    { title: "Apothecary monographs — Black Seed & Honey", note: "Carried on route" },
    { title: "Desert reader — institution press (provided)", note: "Riḥla selections and Prophetic travel reports" },
    { title: "Ibn al-Qayyim — on travel and reliance (extracts)", note: "Distributed at registration" },
  ],

  packing: [
    "Broken-in walking boots and camp sandals.",
    "Lightweight long trousers and breathable long sleeves — sun and modesty.",
    "Head covering with neck shade — required.",
    "Sleeping bag rated for cool desert night.",
    "Three-litre hydration capacity minimum.",
    "Head torch, spare batteries.",
    "Personal first aid; blister care essential.",
    "Sufficient medications plus copy of prescription.",
    "No alcohol, no drones, no music speakers.",
  ],

  faq: [
    {
      question: "Is Yemen safe for travel?",
      answer:
        "The institution monitors conditions continuously and uses routes and hosts assessed for the current season. If official guidance advises against travel, we postpone with full refund. We do not romanticise risk.",
    },
    {
      question: "How hard is the walking?",
      answer:
        "Up to four hours on the longest day, in heat. The preparation programme is mandatory. Misrepresentation of fitness may result in removal for everyone's safety.",
    },
    {
      question: "Can I book a private room?",
      answer: "No. Camp conditions are shared. This journey is not designed for comfort tourism.",
    },
    {
      question: "Why only eight travellers?",
      answer: "Safety, pace, and the quality of teaching. Larger groups are not responsible in this terrain.",
    },
  ],

  gallery: [
    { id: "desert-walk", caption: "Dawn walk — wadi path", alt: "Line study of travellers on a desert wadi path at dawn." },
    { id: "camp", caption: "Evening camp — seminar circle", alt: "Line study of low tents and a seated circle." },
    { id: "stars", caption: "Navigation under stars", alt: "Line study of star field above desert horizon." },
    { id: "host", caption: "Hosted meal — guest adab", alt: "Line study of simple communal meal setting." },
  ],

  policies: [
    {
      title: "Registration",
      body: [
        "Register your interest below. Interview and fitness review required before confirmation.",
        "Deposit £500 on acceptance; balance due eight weeks before departure.",
      ],
    },
    {
      title: "Postponement & cancellation",
      body: [
        "Institution may postpone for safety — full refund or transfer offered.",
        "Traveller cancellation within eight weeks: deposit retained.",
      ],
    },
    {
      title: "Conduct & removal",
      body: [
        "Disregard of guide safety decisions results in immediate removal at traveller's cost.",
        "The institution's conduct policy applies throughout.",
      ],
    },
  ],

  pathways: [
    { label: "Black Seed Oil — Apothecary", href: "/the-apothecary/black-seed-oil" },
    { label: "Honey — Apothecary", href: "/the-apothecary/honey" },
    { label: "The Materia Medica", href: "/the-academy/materia-medica" },
  ],
};
