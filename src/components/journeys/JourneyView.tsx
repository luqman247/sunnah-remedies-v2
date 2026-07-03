import { RunningHead, GoLink } from "@/components/ui/Links";
import { SectionLabel } from "@/components/ui/PageIntro";
import { FaqSection } from "@/components/apothecary/MonographExtras";
import { Breadcrumb } from "@/components/apothecary/Breadcrumb";
import { JourneyContents } from "@/components/journeys/JourneyContents";
import { JourneyGallery } from "@/components/journeys/JourneyGallery";
import { JourneyRegistrationLedger } from "@/components/journeys/JourneyRegistrationLedger";
import { RegistrationForm } from "@/components/journeys/RegistrationForm";
import { Leaf } from "@/components/ui/Leaf";
import { EditorialPhoto, PullQuote } from "@/components/editorial/Editorial";
import type { SacredJourney } from "@/lib/content/journeys/types";

const journeyPhotography: Record<string, { src: string; alt: string }> = {
  umrah: {
    src: "/photography/architecture-twilight.jpg",
    alt: "Ancient Islamic architecture at twilight — a stone archway with lanterns casting warm light",
  },
  "olive-grove": {
    src: "/photography/sacred-journeys-hero.jpg",
    alt: "Pilgrims approaching the Prophet's Mosque in Madinah at dawn",
  },
  "desert-way": {
    src: "/photography/sacred-journeys-hero.jpg",
    alt: "Pilgrims walking across the marble courtyard toward the green dome at dawn",
  },
};

interface JourneyViewProps {
  journey: SacredJourney;
}

function ProseList({ items }: { items: string[] }) {
  return (
    <ul className="monograph-list">
      {items.map((item) => (
        <li key={item.slice(0, 48)}>{item}</li>
      ))}
    </ul>
  );
}

export function JourneyView({ journey }: JourneyViewProps) {
  const photo = journeyPhotography[journey.slug];

  return (
    <>
      {photo && (
        <EditorialPhoto
          src={photo.src}
          alt={photo.alt}
          aspect="landscape"
          fullBleed
          priority
        />
      )}

      <Leaf>
        <div className="measure-wide">
          <RunningHead section="Sacred Journeys" folio={journey.folio} />
          <Breadcrumb
            items={[
              { label: "Sacred Journeys", href: "/sacred-journeys" },
              { label: journey.name },
            ]}
          />
          <header className="programme-header">
            <p className="type-micro programme-header__tier">Guided educational journey</p>
            <h1 className="page-intro__title">{journey.name}</h1>
            <p className="page-intro__lede">{journey.subtitle}</p>
            <dl className="programme-header__meta">
              <div>
                <dt className="type-micro">Travel season</dt>
                <dd className="type-body">{journey.season}</dd>
              </div>
              <div>
                <dt className="type-micro">Journey duration</dt>
                <dd className="type-body">{journey.duration}</dd>
              </div>
              <div>
                <dt className="type-micro">Primary location</dt>
                <dd className="type-body">{journey.location}</dd>
              </div>
              <div>
                <dt className="type-micro">Group size</dt>
                <dd className="type-body">{journey.groupSize}</dd>
              </div>
              <div>
                <dt className="type-micro">Journey fee</dt>
                <dd className="type-body">{journey.fee}</dd>
              </div>
              <div>
                <dt className="type-micro">Next departure window</dt>
                <dd className="type-body">{journey.nextDeparture}</dd>
              </div>
            </dl>
          </header>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide monograph-layout">
          <aside className="monograph-layout__nav">
            <JourneyContents />
          </aside>

          <article className="monograph-layout__reading measure">
            <section id="meaning" className="monograph-section">
              <SectionLabel>Purpose · Intended participants · Commitments</SectionLabel>
              <h2 className="monograph-section__title">Meaning</h2>
              <ProseList items={journey.meaning} />
              <h3 className="programme-subheading">Intended participants</h3>
              <ProseList items={journey.forWhom} />
              <h3 className="programme-subheading">Commitments</h3>
              <ProseList items={journey.whatItAsks} />
            </section>

            <section id="preparation" className="monograph-section">
              <SectionLabel>Preparation</SectionLabel>
              <h2 className="monograph-section__title">Preparation</h2>
              <ProseList items={journey.preparation} />
              <p className="type-small" style={{ marginTop: "var(--s4)" }}>
                <GoLink href="/sacred-journeys/preparation">View preparation timeline</GoLink>
              </p>
            </section>

            <section id="reading" className="monograph-section">
              <SectionLabel>Reading list</SectionLabel>
              <h2 className="monograph-section__title">Reading</h2>
              <ul className="reading-list">
                {journey.reading.map((r) => (
                  <li key={r.title} className="reading-list__item">
                    <p className="type-body" style={{ margin: 0 }}>{r.title}</p>
                    <p className="type-small reading-list__note">{r.note}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section id="packing" className="monograph-section">
              <SectionLabel>Packing guide</SectionLabel>
              <h2 className="monograph-section__title">Packing</h2>
              <ProseList items={journey.packing} />
            </section>

            <section id="flights" className="monograph-section">
              <SectionLabel>Flight guidance</SectionLabel>
              <h2 className="monograph-section__title">Flight planning and coordination</h2>
              <ProseList items={journey.flightGuidance} />
            </section>

            <section id="accommodation" className="monograph-section">
              <SectionLabel>Accommodation philosophy</SectionLabel>
              <h2 className="monograph-section__title">Accommodation</h2>
              <ProseList items={journey.accommodationPhilosophy} />
            </section>

            <section id="learning" className="monograph-section">
              <SectionLabel>Learning</SectionLabel>
              <h2 className="monograph-section__title">Learning</h2>
              <ProseList items={journey.learning} />
            </section>

            <div className="monograph-section" style={{ marginBottom: "var(--s6)" }}>
              <PullQuote
                text="We travel to learn, not to see. The journey is inward before it is outward."
              />
            </div>

            <section id="sessions" className="monograph-section">
              <SectionLabel>Educational sessions</SectionLabel>
              <h2 className="monograph-section__title">Sessions</h2>
              {journey.educationalSessions.map((session) => (
                <article key={session.title} className="curriculum-module">
                  <header className="curriculum-module__header">
                    <div>
                      <h3 className="type-title curriculum-module__title">{session.title}</h3>
                      <p className="type-micro curriculum-module__hours">{session.format}</p>
                    </div>
                  </header>
                  <p className="type-body">{session.description}</p>
                </article>
              ))}
            </section>

            <section id="itinerary" className="monograph-section">
              <SectionLabel>Daily itinerary</SectionLabel>
              <h2 className="monograph-section__title">Itinerary</h2>
              {journey.itinerary.map((day) => (
                <article key={day.day} className="curriculum-module itinerary-day">
                  <header className="curriculum-module__header">
                    <span className="curriculum-module__numeral">{day.day}</span>
                    <div>
                      <h3 className="type-title curriculum-module__title">{day.title}</h3>
                      <p className="type-micro curriculum-module__hours">Focus: {day.focus}</p>
                    </div>
                  </header>
                  <ul className="monograph-list">
                    {day.activities.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </section>

            <section id="companionship" className="monograph-section">
              <SectionLabel>Companionship</SectionLabel>
              <h2 className="monograph-section__title">Companionship</h2>
              <ProseList items={journey.companionship} />
            </section>

            <section id="guidance" className="monograph-section">
              <SectionLabel>Guidance</SectionLabel>
              <h2 className="monograph-section__title">Scholars and guides on route</h2>
              <ProseList items={journey.guidance} />
            </section>

            <div className="monograph-section" style={{ marginBottom: "var(--s6)" }}>
              <PullQuote
                text="Preparation begins weeks before departure. The mind is prepared before the luggage."
              />
            </div>

            <section id="reflection" className="monograph-section">
              <SectionLabel>Reflection journals</SectionLabel>
              <h2 className="monograph-section__title">Reflection</h2>
              <ProseList items={journey.reflection} />
              <h3 className="programme-subheading">Journal practice</h3>
              <ProseList items={journey.reflectionJournals} />
            </section>

            <section id="health" className="monograph-section">
              <SectionLabel>Health guidance</SectionLabel>
              <h2 className="monograph-section__title">Health</h2>
              <ProseList items={journey.healthGuidance} />
            </section>

            <section id="safety" className="monograph-section">
              <SectionLabel>Safety</SectionLabel>
              <h2 className="monograph-section__title">Safety</h2>
              <ProseList items={journey.safety} />
            </section>

            <section id="organisation" className="monograph-section">
              <SectionLabel>Organisation</SectionLabel>
              <h2 className="monograph-section__title">Organisation</h2>
              <p className="type-body" style={{ marginBottom: "var(--s4)", color: "var(--muted)" }}>
                {journey.feeNote}
              </p>
              <ProseList items={journey.organisation} />
            </section>

            <section id="scholars" className="monograph-section">
              <SectionLabel>Scholars &amp; guides</SectionLabel>
              <h2 className="monograph-section__title">Scholars and guides</h2>
              {journey.scholars.map((s) => (
                <article key={s.name} className="faculty-card">
                  <h3 className="type-title faculty-card__name">{s.name}</h3>
                  <p className="type-micro faculty-card__title">{s.role}</p>
                  <p className="type-small faculty-card__chain">{s.grounding}</p>
                  {s.biography.map((p) => (
                    <p key={p.slice(0, 40)} className="type-body faculty-card__bio">{p}</p>
                  ))}
                </article>
              ))}
            </section>

            <section id="gallery" className="monograph-section">
              <SectionLabel>Gallery</SectionLabel>
              <h2 className="monograph-section__title">Gallery</h2>
              <JourneyGallery items={journey.gallery} />
            </section>

            <FaqSection items={journey.faq} />

            <section id="policies" className="monograph-section">
              <SectionLabel>Policies</SectionLabel>
              <h2 className="monograph-section__title">Policies</h2>
              {journey.policies.map((policy) => (
                <article key={policy.title} className="policy-block">
                  <h3 className="type-title">{policy.title}</h3>
                  {policy.body.map((p) => (
                    <p key={p.slice(0, 40)} className="type-body">{p}</p>
                  ))}
                </article>
              ))}
            </section>

            {journey.pathways.length > 0 && (
              <section className="monograph-section">
                <SectionLabel>Related learning</SectionLabel>
                <ul className="pathway-group__list">
                  {journey.pathways.map((p) => (
                    <li key={p.href}>
                      <GoLink href={p.href}>{p.label}</GoLink>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section id="registration" className="dispensation-block enrolment-block">
              <SectionLabel>Registration</SectionLabel>
              <h2 className="monograph-section__title">Register your interest</h2>
              <p className="type-body" style={{ marginBottom: "var(--s5)" }}>
                This is not a booking. Each registration is reviewed through
                reading, interview, and suitability checks where applicable
                before placement is confirmed.{" "}
                <GoLink href="/sacred-journeys/registration">Review registration pathway</GoLink>
              </p>
              <RegistrationForm journeyName={journey.name} />
            </section>
          </article>

          <JourneyRegistrationLedger journey={journey} />
        </div>
      </Leaf>
    </>
  );
}
