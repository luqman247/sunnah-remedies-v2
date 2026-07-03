import { RunningHead, GoLink } from "@/components/ui/Links";
import { SectionLabel } from "@/components/ui/PageIntro";
import { FaqSection } from "@/components/apothecary/MonographExtras";
import { Breadcrumb } from "@/components/apothecary/Breadcrumb";
import { JourneyContents } from "@/components/journeys/JourneyContents";
import { JourneyGallery } from "@/components/journeys/JourneyGallery";
import { RegistrationForm } from "@/components/journeys/RegistrationForm";
import { Leaf } from "@/components/ui/Leaf";
import type { SacredJourney } from "@/lib/content/journeys/types";

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
  return (
    <>
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
            <p className="type-micro programme-header__tier">Educational pilgrimage</p>
            <h1 className="page-intro__title">{journey.name}</h1>
            <p className="page-intro__lede">{journey.subtitle}</p>
            <dl className="programme-header__meta">
              <div>
                <dt className="type-micro">Season</dt>
                <dd className="type-body">{journey.season}</dd>
              </div>
              <div>
                <dt className="type-micro">Duration</dt>
                <dd className="type-body">{journey.duration}</dd>
              </div>
              <div>
                <dt className="type-micro">Location</dt>
                <dd className="type-body">{journey.location}</dd>
              </div>
              <div>
                <dt className="type-micro">Group</dt>
                <dd className="type-body">{journey.groupSize}</dd>
              </div>
              <div>
                <dt className="type-micro">Fee</dt>
                <dd className="type-body">{journey.fee}</dd>
              </div>
              <div>
                <dt className="type-micro">Next departure</dt>
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
              <SectionLabel>Meaning · For whom · What it asks</SectionLabel>
              <h2 className="monograph-section__title">Meaning</h2>
              <ProseList items={journey.meaning} />
              <h3 className="programme-subheading">For whom</h3>
              <ProseList items={journey.forWhom} />
              <h3 className="programme-subheading">What it asks</h3>
              <ProseList items={journey.whatItAsks} />
            </section>

            <section id="preparation" className="monograph-section">
              <SectionLabel>Preparation</SectionLabel>
              <h2 className="monograph-section__title">Preparation</h2>
              <ProseList items={journey.preparation} />
            </section>

            <section id="learning" className="monograph-section">
              <SectionLabel>Learning</SectionLabel>
              <h2 className="monograph-section__title">Learning</h2>
              <ProseList items={journey.learning} />
            </section>

            <section id="companionship" className="monograph-section">
              <SectionLabel>Companionship</SectionLabel>
              <h2 className="monograph-section__title">Companionship</h2>
              <ProseList items={journey.companionship} />
            </section>

            <section id="guidance" className="monograph-section">
              <SectionLabel>Guidance</SectionLabel>
              <h2 className="monograph-section__title">Guidance</h2>
              <ProseList items={journey.guidance} />
            </section>

            <section id="spiritual" className="monograph-section">
              <SectionLabel>Spiritual growth</SectionLabel>
              <h2 className="monograph-section__title">Spiritual growth</h2>
              <ProseList items={journey.spiritualGrowth} />
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

            <section id="itinerary" className="monograph-section">
              <SectionLabel>Educational itinerary</SectionLabel>
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

            <section id="scholars" className="monograph-section">
              <SectionLabel>Scholars &amp; guides</SectionLabel>
              <h2 className="monograph-section__title">Scholars</h2>
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

            <section id="reflection" className="monograph-section">
              <SectionLabel>Reflection</SectionLabel>
              <h2 className="monograph-section__title">Reflection</h2>
              <ProseList items={journey.reflection} />
            </section>

            <section id="reading" className="monograph-section">
              <SectionLabel>Reading</SectionLabel>
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
              <SectionLabel>Packing</SectionLabel>
              <h2 className="monograph-section__title">Packing</h2>
              <ProseList items={journey.packing} />
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
                <SectionLabel>Related study</SectionLabel>
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
                This is not a booking. The institution reviews each registration — reading,
                interview, and fitness where applicable — before confirming placement.
              </p>
              <RegistrationForm journeyName={journey.name} />
            </section>
          </article>
        </div>
      </Leaf>
    </>
  );
}
