/**
 * Explicit editorial seed data for "I am feeling…" — feelingFamily and
 * feelingState documents, plus one homepageHighlight promotion.
 *
 * Used only by scripts/seed-i-am-feeling-content.ts. Never import this
 * module from runtime application code.
 *
 * Every `entry` reference below is a real, existing duaDhikrEntry _id,
 * confirmed present in the live dataset via a read-only query during this
 * implementation session (see the implementation report). None of it was
 * invented. Pairing is title-based only — matching an entry's title to a
 * feeling thematically — and has NOT been scholarly-reviewed for doctrinal
 * fit (SPEC §7.6 requires that before publish). Every feelingState below
 * ships with reviewStatus "sourced", never "published" — nothing here goes
 * live until a human editor completes the review workflow (writes real
 * introduction/reflection/practical-step copy, confirms the entry pairings
 * are sound, and — for "heightened" states — records a genuine clinical
 * board approval). States with no confident entry match are seeded with an
 * empty featuredEntries array and an internalTitle note flagging that gap.
 */

export type SeedLocale = "en" | "da";

export interface FeelingStateSeedEntry {
  entryId: string;
  entryTitle: string; // for editor readability only, not written to Sanity
  reflectionEn?: string;
  reflectionDa?: string;
}

export interface FeelingStateSeed {
  slug: string;
  family: string;
  featuredEntryIds: FeelingStateSeedEntry[];
  /**
   * Draft editorial copy — a genuine first pass in the compassionate,
   * descriptive-not-corrective register SPEC §7.2 requires, NOT a
   * scholarly-reviewed final text. reviewStatus stays "sourced" for every
   * seeded document regardless of how complete this copy is; nothing here
   * goes live until a human editor (and, for "heightened" states, a
   * clinical reviewer) has confirmed it — see SPEC §6, §7, §24.
   */
  introductionEn?: string;
  introductionDa?: string;
  practicalNextStepEn?: string;
  practicalNextStepDa?: string;
  professionalSupportNoteEn?: string;
  professionalSupportNoteDa?: string;
  editorNote?: string;
}

export const FEELING_FAMILY_SEEDS: { slug: string; order: number }[] = [
  { slug: "heart-feels-heavy", order: 1 },
  { slug: "mind-wont-settle", order: 2 },
  { slug: "emotions-feel-intense", order: 3 },
  { slug: "faith-feels-distant", order: 4 },
  { slug: "heart-feels-open", order: 5 },
  { slug: "facing-change-or-difficulty", order: 6 },
];

/**
 * Title-based entry pairings found via a read-only search of the live
 * duaDhikrEntry dataset (425 documents, all reachable only via the
 * "owner-approved-english-first" pathway — see the implementation report
 * for why zero are currently Danish-eligible). Entries are referenced, not
 * copied — no Arabic/translation text appears anywhere in this file.
 */
export const FEELING_STATE_SEEDS: FeelingStateSeed[] = [
  {
    slug: "grieving-a-loss",
    family: "heart-feels-heavy",
    introductionEn:
      "Grief can feel like it rearranges everything, even the things that used to feel steady. Islam does not ask you to rush through it — it gives you words for the moment loss first lands, and for the days after.",
    introductionDa:
      "Sorg kan føles som om den flytter rundt på alt, selv de ting der plejede at føles faste. Islam beder dig ikke om at skynde dig igennem det — den giver dig ord for det øjeblik, tabet først rammer, og for dagene efter.",
    practicalNextStepEn: "Say this the next time grief catches you off guard this week, rather than waiting until you feel ready.",
    practicalNextStepDa: "Sig dette næste gang sorgen overrasker dig i denne uge, i stedet for at vente til du føler dig klar.",
    professionalSupportNoteEn:
      "Grief that stays heavy for a long time, or that starts to affect your sleep, eating, or ability to function, is worth speaking to a doctor or a grief counsellor about — alongside, not instead of, this remembrance.",
    professionalSupportNoteDa:
      "Sorg der forbliver tung i lang tid, eller som begynder at påvirke din søvn, dit spisemønster eller din evne til at fungere, er værd at tale med en læge eller en sorgrådgiver om — som et supplement til, ikke en erstatning for, denne ihukommelse.",
    featuredEntryIds: [
      {
        entryId: "duaDhikrEntry-lwa-336",
        entryTitle: "After Someone's Death #1",
        reflectionEn: "This is what was taught for the moment after someone has gone — a short, steadying return to what is true: that we belong to Allah, and to Him we return.",
        reflectionDa: "Dette blev lært til det øjeblik, hvor nogen er gået bort — en kort, stabiliserende tilbagevenden til det sande: at vi tilhører Allah, og til Ham vender vi tilbage.",
      },
      {
        entryId: "duaDhikrEntry-lwa-337",
        entryTitle: "After Someone's Death #2",
        reflectionEn: "A second remembrance for the days that follow, when grief doesn't leave all at once.",
        reflectionDa: "En anden ihukommelse til de dage der følger, når sorgen ikke forsvinder på én gang.",
      },
    ],
  },
  {
    slug: "feeling-alone",
    family: "heart-feels-heavy",
    featuredEntryIds: [],
    editorNote:
      "No confident match found even after widening the search beyond titleEn to whatItIsFor/occasion/searchAliases/explanationText/virtueText (\"lonely\"/\"isolated\" returned zero hits; \"alone\"/\"companionship\" returned only generic salah-context entries with no thematic connection to loneliness). This source material may simply not contain a duʿā framed around loneliness specifically — needs editorial sourcing, potentially from outside the currently-imported 425-entry set.",
  },
  {
    slug: "weighed-down-by-guilt",
    family: "heart-feels-heavy",
    introductionEn:
      "Guilt can sit heavily long after the moment itself has passed. Istighfar — turning back to Allah in honesty — is not about proving you deserve forgiveness. It's simply what's offered.",
    introductionDa:
      "Skyld kan ligge tungt længe efter selve øjeblikket er forbi. Istighfar — at vende tilbage til Allah i ærlighed — handler ikke om at bevise, at du fortjener tilgivelse. Det er blot det, der tilbydes.",
    practicalNextStepEn: "Say this once, slowly, before you sleep tonight — not as a task to finish, but as a door to walk through.",
    practicalNextStepDa: "Sig dette én gang, langsomt, før du sover i aften — ikke som en opgave der skal afsluttes, men som en dør du kan gå igennem.",
    featuredEntryIds: [
      {
        entryId: "duaDhikrEntry-lwa-177",
        entryTitle: "Sayyid al-Istighfar: The Best Way of Seeking Forgiveness",
        reflectionEn: "Known as the master of ways to seek forgiveness — a complete, honest acknowledgement, said as it is, not to earn relief but to receive it.",
        reflectionDa: "Kendt som mesteren blandt måder at søge tilgivelse på — en fuldstændig, ærlig anerkendelse, sagt som den er, ikke for at fortjene lettelse, men for at modtage den.",
      },
      {
        entryId: "duaDhikrEntry-lwa-179",
        entryTitle: "Comprehensive Forgiveness",
        reflectionEn: "A broader form of the same turning back, gathering forgiveness for what's known and unknown.",
        reflectionDa: "En bredere form for den samme tilbagevenden, der samler tilgivelse for det kendte og det ukendte.",
      },
    ],
  },
  {
    slug: "feeling-anxious",
    family: "mind-wont-settle",
    introductionEn: "Worry can sit in the chest long before it finds words. This is not about talking yourself out of it — it's somewhere to put it.",
    introductionDa: "Bekymring kan sidde i brystet længe før den finder ord. Det handler ikke om at tale dig selv ud af det — det er et sted at lægge det.",
    practicalNextStepEn: "Keep this close and say it the next time your thoughts start circling, rather than waiting for a quiet moment.",
    practicalNextStepDa: "Hold denne tæt på, og sig den næste gang dine tanker begynder at cirkle, i stedet for at vente på et roligt øjeblik.",
    professionalSupportNoteEn:
      "If anxiety is affecting your sleep, your ability to eat, or your daily life for more than a couple of weeks, speaking to a doctor is a sensible next step alongside this — not instead of it.",
    professionalSupportNoteDa:
      "Hvis angst påvirker din søvn, din evne til at spise eller dit daglige liv i mere end et par uger, er det en fornuftig idé at tale med en læge — som et supplement til dette, ikke i stedet for det.",
    featuredEntryIds: [
      {
        entryId: "duaDhikrEntry-lwa-215",
        entryTitle: "The Qur'an: the Banisher of Grief & Anxiety",
        reflectionEn: "A description of the Qurʾān itself as something that lifts grief and anxiety when it's read and held onto.",
        reflectionDa: "En beskrivelse af Qurʾānen selv som noget, der løfter sorg og angst, når den læses og holdes fast ved.",
      },
      {
        entryId: "duaDhikrEntry-lwa-378",
        entryTitle: "Grief & Anxiety #1",
        reflectionEn: "A short, direct remembrance for exactly this — carried by many, for a very long time.",
        reflectionDa: "En kort, direkte ihukommelse for netop dette — båret af mange, i meget lang tid.",
      },
    ],
  },
  {
    slug: "feeling-overwhelmed",
    family: "mind-wont-settle",
    introductionEn: "There's a particular kind of tired that comes from too much at once. This was said by people who felt exactly that.",
    introductionDa: "Der findes en bestemt slags træthed, der kommer af for meget på én gang. Dette blev sagt af mennesker, der følte netop det.",
    practicalNextStepEn: "Say this once, then do the smallest next thing on your list — not all of it.",
    practicalNextStepDa: "Sig dette én gang, og gør derefter den mindste næste ting på din liste — ikke det hele.",
    featuredEntryIds: [
      {
        entryId: "duaDhikrEntry-lwa-389",
        entryTitle: "When Overwhelmed With Difficulties",
        reflectionEn: "A direct remembrance for when difficulty stacks up faster than you can process it.",
        reflectionDa: "En direkte ihukommelse for når vanskeligheder hober sig op hurtigere, end du kan nå at forholde dig til dem.",
      },
      {
        entryId: "duaDhikrEntry-lwa-376",
        entryTitle: "When One is in a Difficult Situation",
        reflectionEn: "For the specific feeling of being caught in a hard situation with no clear way through yet.",
        reflectionDa: "For den specifikke følelse af at være fanget i en svær situation uden endnu at kunne se en klar vej igennem.",
      },
    ],
  },
  {
    slug: "restless-at-night",
    family: "mind-wont-settle",
    introductionEn: "Some nights the mind won't settle, or sleep brings something unsettling with it. There is a specific remembrance for exactly that.",
    introductionDa: "Nogle nætter vil sindet ikke falde til ro, eller søvnen bringer noget foruroligende med sig. Der findes en bestemt ihukommelse for netop det.",
    practicalNextStepEn: "Keep this by your bed and say it if a bad dream wakes you, rather than lying with it in silence.",
    practicalNextStepDa: "Hold denne ved din seng, og sig den, hvis en ond drøm vækker dig, i stedet for at ligge alene med den i stilhed.",
    featuredEntryIds: [
      {
        entryId: "duaDhikrEntry-lwa-276",
        entryTitle: "After a Nightmare",
        reflectionEn: "What was taught to say after a nightmare — a short way of putting it down rather than carrying it into the morning.",
        reflectionDa: "Det, der blev lært at sige efter et mareridt — en kort måde at lægge det fra sig på, i stedet for at bære det med ind i morgenen.",
      },
    ],
  },
  {
    slug: "feeling-weary",
    family: "mind-wont-settle",
    introductionEn: "Some tiredness isn't solved by sleep. This is for that kind.",
    introductionDa: "Nogle former for træthed løses ikke af søvn. Dette er til den slags.",
    practicalNextStepEn: "Say this before you rest today, even if rest itself doesn't feel like enough right now.",
    practicalNextStepDa: "Sig dette, før du hviler dig i dag, selv hvis hvile i sig selv ikke føles som nok lige nu.",
    editorNote: "Reuses the same entry as feeling-overwhelmed (SPEC §7.4 explicitly permits this) with a distinct reflection for this context.",
    featuredEntryIds: [
      {
        entryId: "duaDhikrEntry-lwa-389",
        entryTitle: "When Overwhelmed With Difficulties",
        reflectionEn: "The same remembrance that answers being overwhelmed also answers this — difficulty and depletion often arrive together.",
        reflectionDa: "Den samme ihukommelse, der svarer på at være overvældet, svarer også på dette — vanskeligheder og udmattelse følges ofte ad.",
      },
    ],
  },
  {
    slug: "feeling-angry",
    family: "emotions-feel-intense",
    introductionEn: "Anger is not something to be ashamed of — it's what you do with it that this remembrance gently interrupts.",
    introductionDa: "Vrede er ikke noget at skamme sig over — det er det, du gør med den, denne ihukommelse forsigtigt afbryder.",
    practicalNextStepEn: "Say this the next time anger rises, before you speak or act, not instead of feeling it.",
    practicalNextStepDa: "Sig dette næste gang vreden stiger, før du taler eller handler — ikke i stedet for at føle den.",
    featuredEntryIds: [
      {
        entryId: "duaDhikrEntry-lwa-181",
        entryTitle: "Forgiveness, Anger and Trials",
        reflectionEn: "A remembrance that names forgiveness, anger, and hardship together — not as unrelated things, but as often arriving in the same breath.",
        reflectionDa: "En ihukommelse, der nævner tilgivelse, vrede og modgang sammen — ikke som usammenhængende ting, men som noget der ofte kommer i samme åndedrag.",
      },
    ],
  },
  {
    slug: "struggling-with-envy",
    family: "emotions-feel-intense",
    featuredEntryIds: [],
    editorNote:
      "No confident match found. A wider field search (whatItIsFor/occasion/searchAliases/explanationText/virtueText, not just titleEn) surfaced duaDhikrEntry-lwa-080 (\"Muʿawwidhat: Best Words to Seek Allah's Protection\") against \"envy\"/\"envious\"/\"jealous\" — but that entry is classically about seeking protection FROM the evil of an envier's envy directed at you (Surah al-Falaq's \"min sharri hasidin idha hasad\"), not about a person's own envy of others, which is what this feeling state addresses. Direction mismatch — deliberately NOT added as a featured entry. Flagging for a scholar to confirm whether a genuinely direction-matched entry exists elsewhere in the source material, or whether new content needs sourcing.",
  },
  {
    slug: "feeling-distant-from-allah",
    family: "faith-feels-distant",
    introductionEn: "Worship can start to feel like a routine rather than a connection. That's not a sign you've failed — it's a sign to ask for the thing itself back.",
    introductionDa: "Tilbedelse kan begynde at føles som en rutine frem for en forbindelse. Det er ikke et tegn på, at du har fejlet — det er et tegn på at bede om selve forbindelsen tilbage.",
    practicalNextStepEn: "Say this once today, without expecting an immediate feeling — steadiness often returns quietly, not all at once.",
    practicalNextStepDa: "Sig dette én gang i dag, uden at forvente en øjeblikkelig følelse — fasthed vender ofte stille tilbage, ikke på én gang.",
    featuredEntryIds: [
      {
        entryId: "duaDhikrEntry-lwa-368",
        entryTitle: "For Firmness of the Heart",
        reflectionEn: "A remembrance asking directly for a firm heart — steadiness in faith is something to ask for, not something you're expected to already have secured.",
        reflectionDa: "En ihukommelse, der direkte beder om et fast hjerte — fasthed i troen er noget man beder om, ikke noget man forventes allerede at have sikret sig.",
      },
    ],
  },
  {
    slug: "struggling-with-sincerity",
    family: "faith-feels-distant",
    introductionEn: "Wondering whether your heart is really in what you're doing is, itself, often a sign of sincerity rather than its absence.",
    introductionDa: "At undre sig over, om ens hjerte virkelig er med i det, man gør, er i sig selv ofte et tegn på oprigtighed snarere end fraværet af den.",
    practicalNextStepEn: "Say this before your next prayer, as a quiet check-in rather than a test to pass.",
    practicalNextStepDa: "Sig dette før din næste bøn, som et stille tjek med dig selv snarere end en test, du skal bestå.",
    featuredEntryIds: [
      {
        entryId: "duaDhikrEntry-lwa-371",
        entryTitle: "When One Fears Shirk & Riya'",
        reflectionEn: "A remembrance that asks directly for protection from showing off and from associating anything with Allah in worship — a request, not an accusation.",
        reflectionDa: "En ihukommelse, der direkte beder om beskyttelse mod at vise sig frem og mod at sidestille noget med Allah i tilbedelsen — en bøn, ikke en anklage.",
      },
    ],
  },
  {
    slug: "troubled-by-doubts",
    family: "faith-feels-distant",
    introductionEn:
      "Questions about faith can feel unsettling to sit with, especially if it feels like they shouldn't be there at all. They are a known and named experience, not a verdict on your faith.",
    introductionDa:
      "Spørgsmål om troen kan føles svære at rumme, især hvis det føles som om de slet ikke burde være der. De er en kendt og navngivet oplevelse, ikke en dom over din tro.",
    practicalNextStepEn: "Say this the next time a doubt surfaces, rather than trying to reason your way out of it alone.",
    practicalNextStepDa: "Sig dette næste gang en tvivl dukker op, i stedet for at forsøge at tænke dig ud af den alene.",
    professionalSupportNoteEn:
      "If doubts are causing significant distress, speaking with a knowledgeable, trusted scholar or a mental-health professional — ideally both — is a strong, encouraged step.",
    professionalSupportNoteDa:
      "Hvis tvivl forårsager betydelig belastning, er det et stærkt og opmuntret skridt at tale med en kyndig, betroet lærd eller en fagperson inden for psykisk sundhed — allerhelst begge dele.",
    editorNote: "Deferred — launchStatus stays \"deferred\" regardless of this seed. Do not flip to launch without the dedicated scholarly working group SPEC §4 requires.",
    featuredEntryIds: [
      {
        entryId: "duaDhikrEntry-lwa-369",
        entryTitle: "When One Experiences Doubt in Faith #1",
        reflectionEn: "What was taught for exactly this experience — a direct, practical response rather than a demand to simply stop doubting.",
        reflectionDa: "Det, der blev lært til netop denne oplevelse — et direkte, praktisk svar frem for et krav om blot at holde op med at tvivle.",
      },
      {
        entryId: "duaDhikrEntry-lwa-370",
        entryTitle: "When One Experiences Doubt in Faith #2",
        reflectionEn: "A second remembrance for the same experience, for whichever words settle more easily.",
        reflectionDa: "En anden ihukommelse til den samme oplevelse, alt efter hvilke ord der falder lettest.",
      },
    ],
  },
  {
    slug: "feeling-grateful",
    family: "heart-feels-open",
    introductionEn: "Naming a blessing properly is its own small act of worship.",
    introductionDa: "At sætte ord på en velsignelse på rette vis er i sig selv en lille handling af tilbedelse.",
    practicalNextStepEn: "Say this today for the specific thing you're grateful for, naming it rather than leaving it general.",
    practicalNextStepDa: "Sig dette i dag for den specifikke ting, du er taknemmelig for — navngiv den frem for at lade den forblive generel.",
    featuredEntryIds: [
      {
        entryId: "duaDhikrEntry-lwa-164",
        entryTitle: "Duʿa of Prophet Sulayman for Gratitude to Allah & Doing Good Deeds",
        reflectionEn: "A prophet's own words of gratitude, paired with a request to keep doing good — thanks that moves outward, not just inward.",
        reflectionDa: "En profets egne ord af taknemmelighed, sammen med en bøn om at blive ved med at gøre godt — en tak, der bevæger sig udad, ikke kun indad.",
      },
      {
        entryId: "duaDhikrEntry-lwa-165",
        entryTitle: "Duʿa for Gratitude, Good Deeds & Pious Children",
        reflectionEn: "A fuller request for gratitude alongside good deeds and a good household.",
        reflectionDa: "En bredere bøn om taknemmelighed sammen med gode gerninger og et godt hjem.",
      },
    ],
  },
  {
    slug: "feeling-at-peace",
    family: "heart-feels-open",
    introductionEn: "When things feel settled, this is worth marking too — not just carried through hard moments.",
    introductionDa: "Når tingene føles i ro, er det værd at markere det også — ikke kun bære det med gennem svære øjeblikke.",
    practicalNextStepEn: "Say this once today simply because things feel settled, not only when you need it to.",
    practicalNextStepDa: "Sig dette én gang i dag, blot fordi tingene føles i ro — ikke kun når du har brug for, at de gør det.",
    featuredEntryIds: [
      {
        entryId: "duaDhikrEntry-lwa-245",
        entryTitle: "Contentment & Allah's Protection",
        reflectionEn: "A short remembrance of contentment held together with Allah's protection.",
        reflectionDa: "En kort ihukommelse af tilfredshed, holdt sammen med Allahs beskyttelse.",
      },
      {
        entryId: "duaDhikrEntry-lwa-156",
        entryTitle: "Duʿa of Prophet Musa for Inner Peace & Strength",
        reflectionEn: "A prophet's own request for inner peace and strength — asked for even in ease, so it has somewhere to return to later.",
        reflectionDa: "En profets egen bøn om indre ro og styrke — bedt om selv i lette tider, så den har et sted at vende tilbage til senere.",
      },
    ],
  },
  {
    slug: "feeling-hopeful",
    family: "heart-feels-open",
    introductionEn: "Looking forward to something is worth placing in Allah's hands from the start, not just when it's uncertain.",
    introductionDa: "At se frem til noget er værd at lægge i Allahs hænder fra begyndelsen, ikke kun når det er usikkert.",
    practicalNextStepEn: "Say this before the thing you're looking forward to, as a way of holding it with open hands.",
    practicalNextStepDa: "Sig dette før det, du ser frem til, som en måde at holde det med åbne hænder.",
    editorNote: "Imperfect thematic fit (tawakkul, not hope specifically) — confirm before publishing.",
    featuredEntryIds: [
      {
        entryId: "duaDhikrEntry-lwa-198",
        entryTitle: "Entrust All Your Matters to Allah",
        reflectionEn: "A short handing-over of your affairs to Allah — hope held loosely rather than gripped tightly.",
        reflectionDa: "En kort overgivelse af dine anliggender til Allah — håb holdt løst frem for grebet fast.",
      },
    ],
  },
  {
    slug: "facing-a-decision",
    family: "facing-change-or-difficulty",
    introductionEn: "Not knowing which way to go is exactly what this prayer was taught for.",
    introductionDa: "Ikke at vide, hvilken vej man skal gå, er netop det, denne bøn blev lært til.",
    practicalNextStepEn: "Pray Istikharah before you decide, and give yourself permission not to have an instant answer afterward.",
    practicalNextStepDa: "Bed Istikharah, før du beslutter dig, og giv dig selv lov til ikke at have et øjeblikkeligt svar bagefter.",
    featuredEntryIds: [
      {
        entryId: "duaDhikrEntry-lwa-298",
        entryTitle: "Istikharah (Seeking Allah's Help in Making a Decision)",
        reflectionEn: "Istikharah — asking Allah directly for what is good, when you genuinely don't know which path that is.",
        reflectionDa: "Istikharah — at bede Allah direkte om det, der er godt, når du oprigtigt ikke ved, hvilken vej det er.",
      },
    ],
  },
  {
    slug: "facing-illness",
    family: "facing-change-or-difficulty",
    introductionEn: "Sickness — your own or someone you love's — can be frightening to sit with. This is a companion for that, never a replacement for medical care.",
    introductionDa: "Sygdom — din egen eller en du elskers — kan være skræmmende at rumme. Dette er en følgesvend til det, aldrig en erstatning for lægehjælp.",
    practicalNextStepEn: "Say this today, and keep your medical appointments exactly as planned — both matter.",
    practicalNextStepDa: "Sig dette i dag, og hold dine lægeaftaler præcis som planlagt — begge dele betyder noget.",
    professionalSupportNoteEn: "Ruqyah and duʿā are a companion to medical treatment, never a substitute for it. Please continue to see a doctor for diagnosis and treatment.",
    professionalSupportNoteDa: "Ruqyah og duʿā er en følgesvend til lægebehandling, aldrig en erstatning for den. Fortsæt venligst med at gå til læge for diagnose og behandling.",
    featuredEntryIds: [
      {
        entryId: "duaDhikrEntry-lwa-092",
        entryTitle: "What The Sick Should Say & What Should Be Said For Them",
        reflectionEn: "What was taught to say, and to say for someone who is sick — words for both sides of the bed.",
        reflectionDa: "Det, der blev lært at sige, og at sige for en, der er syg — ord til begge sider af sengen.",
      },
      {
        entryId: "duaDhikrEntry-lwa-232",
        entryTitle: "Protection from Physical & Spiritual Illnesses",
        reflectionEn: "A broader request for protection from illness, physical and spiritual both.",
        reflectionDa: "En bredere bøn om beskyttelse mod sygdom, både fysisk og åndeligt.",
      },
    ],
  },
  {
    slug: "afraid-of-what-lies-ahead",
    family: "facing-change-or-difficulty",
    introductionEn: "The future can feel uncertain in a way that's hard to sit with. This is for handing that uncertainty somewhere.",
    introductionDa: "Fremtiden kan føles usikker på en måde, der er svær at rumme. Dette er til at lægge den usikkerhed et sted.",
    practicalNextStepEn: "Say this the next time your mind runs ahead to what might happen, and gently bring it back to today.",
    practicalNextStepDa: "Sig dette næste gang dine tanker løber i forvejen til det, der måske sker, og før dem forsigtigt tilbage til i dag.",
    editorNote: "Imperfect thematic fit — confirm before publishing.",
    featuredEntryIds: [
      {
        entryId: "duaDhikrEntry-lwa-198",
        entryTitle: "Entrust All Your Matters to Allah",
        reflectionEn: "The same handing-over of your affairs to Allah that answers hope also answers fear of what's ahead — the two are closer than they seem.",
        reflectionDa: "Den samme overgivelse af dine anliggender til Allah, der svarer på håb, svarer også på frygt for det, der venter — de to ligger tættere på hinanden, end det ser ud til.",
      },
    ],
  },
  {
    slug: "feeling-disappointed",
    family: "heart-feels-heavy",
    featuredEntryIds: [],
    editorNote: "Deferred — no content sourcing attempted yet.",
  },
  {
    slug: "feeling-impatient",
    family: "emotions-feel-intense",
    featuredEntryIds: [],
    editorNote: "Deferred — no content sourcing attempted yet.",
  },
];

export const I_AM_FEELING_HOMEPAGE_HIGHLIGHT_HREF = "/i-am-feeling";

const HOMEPAGE_HIGHLIGHT_COPY: Record<
  SeedLocale,
  { eyebrow: string; title: string; summary: string; ctaLabel: string; contentAreaLabel: string }
> = {
  en: {
    eyebrow: "NEW IN THE KNOWLEDGE LIBRARY",
    title: "How are you feeling?",
    summary:
      "Find remembrance and reflection that meets you where you are — a second way into the Duʿā & Dhikr library, organised by feeling instead of occasion.",
    ctaLabel: "Begin here",
    contentAreaLabel: "Knowledge Library",
  },
  da: {
    eyebrow: "NYT I VIDENSBIBLIOTEKET",
    title: "Hvordan har du det?",
    summary:
      "Find ihukommelse og refleksion, der møder dig, hvor du er — en ny vej ind i Duʿā & Dhikr-biblioteket, ordnet efter følelse frem for lejlighed.",
    ctaLabel: "Begynd her",
    contentAreaLabel: "Vidensbiblioteket",
  },
};

export function getIAmFeelingHomepageHighlightSeedPayload(locale: SeedLocale) {
  const copy = HOMEPAGE_HIGHLIGHT_COPY[locale];
  return {
    id: locale === "en" ? "homepageHighlight-i-am-feeling" : "homepageHighlight-i-am-feeling-da",
    language: locale,
    internalName: locale === "en" ? "I am feeling… — Knowledge Library" : "Jeg føler… — Vidensbiblioteket",
    // Disabled by default — an editor enables this once the launch content
    // (feelingState documents) is genuinely review-complete (SPEC §11, §24).
    enabled: false,
    eyebrow: copy.eyebrow,
    title: copy.title,
    summary: copy.summary,
    contentArea: "knowledge-library" as const,
    contentAreaLabel: copy.contentAreaLabel,
    destinationType: "pathname" as const,
    pathname: I_AM_FEELING_HOMEPAGE_HIGHLIGHT_HREF,
    ctaLabel: copy.ctaLabel,
    publishedAt: "2026-07-19T12:00:00.000Z",
    pinned: false,
    priority: 60,
    showNewMarker: true,
    visualTheme: "knowledge-library" as const,
  };
}
