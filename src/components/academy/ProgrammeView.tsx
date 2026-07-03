import { RunningHead, GoLink } from "@/components/ui/Links";
import { SectionLabel } from "@/components/ui/PageIntro";
import { FaqSection } from "@/components/apothecary/MonographExtras";
import { Breadcrumb } from "@/components/apothecary/Breadcrumb";
import { ProgrammeContents } from "@/components/academy/ProgrammeContents";
import { ProgrammeLedger } from "@/components/academy/ProgrammeLedger";
import { FacilityGallery } from "@/components/academy/FacilityGallery";
import { EnrolmentForm } from "@/components/academy/EnrolmentForm";
import { EnrolmentJourney } from "@/components/academy/EnrolmentJourney";
import { Leaf } from "@/components/ui/Leaf";
import type { AcademyProgramme } from "@/lib/content/academy/types";

interface ProgrammeViewProps {
  programme: AcademyProgramme;
}

function PolicyBlocks({ items }: { items: { title: string; body: string[] }[] }) {
  return (
    <>
      {items.map((block) => (
        <article key={block.title} className="policy-block">
          <h3 className="type-title">{block.title}</h3>
          {block.body.map((p) => (
            <p key={p.slice(0, 48)} className="type-body">{p}</p>
          ))}
        </article>
      ))}
    </>
  );
}

export function ProgrammeView({ programme }: ProgrammeViewProps) {
  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <RunningHead section="The Academy" folio={programme.folio} />
          <Breadcrumb
            items={[
              { label: "The Academy", href: "/the-academy" },
              { label: programme.name },
            ]}
          />
          <header className="programme-header programme-header--executive">
            <p className="type-micro programme-header__tier">{programme.tier} · Professional formation</p>
            <h1 className="page-intro__title">{programme.name}</h1>
            <p className="page-intro__lede">{programme.subtitle}</p>
            <dl className="programme-header__meta">
              <div>
                <dt className="type-micro">Programme duration</dt>
                <dd className="type-body">{programme.duration}</dd>
              </div>
              <div>
                <dt className="type-micro">Delivery format</dt>
                <dd className="type-body">{programme.format}</dd>
              </div>
              <div>
                <dt className="type-micro">Programme fee</dt>
                <dd className="type-body">{programme.fee}</dd>
              </div>
              <div>
                <dt className="type-micro">Next intake</dt>
                <dd className="type-body">{programme.nextCohort}</dd>
              </div>
            </dl>
          </header>
        </div>
      </Leaf>

      <Leaf variant="grave">
        <div className="measure grave-block">
          <p className="grave-block__qualifier" style={{ color: "var(--paper-dim)" }}>
            This is not an abbreviated online course. It is a supervised
            programme with published assessment criteria and faculty sign-off
            only after demonstrated competency.
          </p>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide monograph-layout monograph-layout--ledger">
          <aside className="monograph-layout__nav">
            <ProgrammeContents />
          </aside>

          <article className="monograph-layout__reading measure">
            <section id="overview" className="monograph-section">
              <SectionLabel>Scope · Intended cohort · Commitments</SectionLabel>
              <h2 className="monograph-section__title">Overview</h2>
              <h3 className="programme-subheading">Programme scope</h3>
              <ul className="monograph-list">
                {programme.whatItIs.map((p) => (
                  <li key={p.slice(0, 40)}>{p}</li>
                ))}
              </ul>
              <h3 className="programme-subheading">Intended cohort</h3>
              <ul className="monograph-list">
                {programme.forWhom.map((p) => (
                  <li key={p.slice(0, 40)}>{p}</li>
                ))}
              </ul>
              <h3 className="programme-subheading">Commitments</h3>
              <ul className="monograph-list">
                {programme.whatItAsks.map((p) => (
                  <li key={p.slice(0, 40)}>{p}</li>
                ))}
              </ul>
            </section>

            <section id="outcomes" className="monograph-section">
              <SectionLabel>Learning outcomes</SectionLabel>
              <h2 className="monograph-section__title">Outcomes</h2>
              <p className="type-small evidence-section__intro">
                Assessed outcomes are published before enrolment and reviewed
                prior to examination.
              </p>
              <ul className="outcome-list">
                {programme.learningOutcomes.map((o) => (
                  <li key={o.outcome} className="outcome-list__item">
                    <span className="type-body">{o.outcome}</span>
                    {o.assessed && (
                      <span className="type-micro outcome-list__badge">Assessed</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <section id="curriculum" className="monograph-section">
              <SectionLabel>Curriculum · {programme.curriculum.length} modules</SectionLabel>
              <h2 className="monograph-section__title">Curriculum</h2>
              {programme.curriculum.map((mod) => (
                <article key={mod.number} className="curriculum-module">
                  <header className="curriculum-module__header">
                    <span className="curriculum-module__numeral">{mod.number}</span>
                    <div>
                      <h3 className="type-title curriculum-module__title">{mod.title}</h3>
                      <p className="type-micro curriculum-module__hours">{mod.hours} guided hours</p>
                    </div>
                  </header>
                  <p className="type-body">{mod.description}</p>
                  {mod.practical && (
                    <p className="type-small" style={{ color: "var(--muted)" }}>
                      Practical component: {mod.practical}
                    </p>
                  )}
                  <p className="type-micro curriculum-module__sources">
                    Primary sources: {mod.sources.join(" · ")}
                  </p>
                </article>
              ))}
            </section>

            <section id="practical" className="monograph-section">
              <SectionLabel>Practical sessions</SectionLabel>
              <h2 className="monograph-section__title">Supervised practice</h2>
              {programme.practicalSessions.map((session) => (
                <article key={session.title} className="curriculum-module">
                  <h3 className="type-title">{session.title}</h3>
                  <p className="type-micro curriculum-module__hours">
                    {session.schedule} · {session.hours} hours
                  </p>
                  <p className="type-body">{session.description}</p>
                  <p className="type-small" style={{ color: "var(--muted)" }}>
                    Supervision: {session.supervision}
                  </p>
                </article>
              ))}
            </section>

            <section id="faculty" className="monograph-section">
              <SectionLabel>Faculty</SectionLabel>
              <h2 className="monograph-section__title">Faculty</h2>
              {programme.faculty.map((member) => (
                <article key={member.name} className="faculty-card">
                  <h3 className="type-title faculty-card__name">{member.name}</h3>
                  <p className="type-micro faculty-card__title">{member.title}</p>
                  <p className="type-small faculty-card__licence">{member.licence}</p>
                  <p className="type-small faculty-card__chain">{member.chain}</p>
                  {member.biography.map((para) => (
                    <p key={para.slice(0, 40)} className="type-body faculty-card__bio">{para}</p>
                  ))}
                </article>
              ))}
            </section>

            <section id="facilities" className="monograph-section">
              <SectionLabel>Facilities</SectionLabel>
              <h2 className="monograph-section__title">Facilities</h2>
              {programme.facilities.map((f) => (
                <article key={f.name} className="facility-card">
                  <h3 className="type-title">{f.name}</h3>
                  <p className="type-body">{f.description}</p>
                </article>
              ))}
            </section>

            <section id="clinical-standards" className="monograph-section">
              <SectionLabel>Clinical standards</SectionLabel>
              <h2 className="monograph-section__title">Clinical standards</h2>
              <PolicyBlocks items={programme.clinicalStandards} />
            </section>

            <section id="assessment" className="monograph-section">
              <SectionLabel>Assessment</SectionLabel>
              <h2 className="monograph-section__title">Assessment</h2>
              <ul className="monograph-list">
                {programme.assessment.map((p) => (
                  <li key={p.slice(0, 40)}>{p}</li>
                ))}
              </ul>
              <p className="type-body" style={{ marginTop: "var(--s4)" }}>
                Clinical practice standards during term:
              </p>
              <ul className="monograph-list">
                {programme.clinicalPractice.map((p) => (
                  <li key={p.slice(0, 40)}>{p}</li>
                ))}
              </ul>
            </section>

            <section id="certification" className="monograph-section">
              <SectionLabel>Certification</SectionLabel>
              <h2 className="monograph-section__title">Certification</h2>
              <ul className="monograph-list">
                {programme.certification.map((p) => (
                  <li key={p.slice(0, 40)}>{p}</li>
                ))}
              </ul>
            </section>

            <section id="entry" className="monograph-section">
              <SectionLabel>Entry requirements</SectionLabel>
              <h2 className="monograph-section__title">Entry requirements</h2>
              <ul className="monograph-list">
                {programme.entryRequirements.map((p) => (
                  <li key={p.slice(0, 40)}>{p}</li>
                ))}
              </ul>
            </section>

            <section id="equipment" className="monograph-section">
              <SectionLabel>Equipment list</SectionLabel>
              <h2 className="monograph-section__title">Equipment</h2>
              <table className="equipment-table">
                <thead>
                  <tr>
                    <th className="type-micro">Item</th>
                    <th className="type-micro">Specification</th>
                    <th className="type-micro">Supplied by</th>
                  </tr>
                </thead>
                <tbody>
                  {programme.equipmentList.map((row) => (
                    <tr key={row.item}>
                      <td className="type-body">{row.item}</td>
                      <td className="type-small">{row.specification}</td>
                      <td className="type-micro">{row.supplied}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section id="handbook" className="monograph-section">
              <SectionLabel>Course handbook</SectionLabel>
              <h2 className="monograph-section__title">Course handbook</h2>
              <PolicyBlocks items={programme.courseHandbook} />
            </section>

            <section id="guide" className="monograph-section">
              <SectionLabel>Student guide</SectionLabel>
              <h2 className="monograph-section__title">Student guide</h2>
              <PolicyBlocks items={programme.studentGuide} />
            </section>

            <section id="gallery" className="monograph-section">
              <SectionLabel>Gallery</SectionLabel>
              <h2 className="monograph-section__title">Gallery</h2>
              <FacilityGallery items={programme.gallery} />
            </section>

            <section id="testimonials" className="monograph-section">
              <SectionLabel>Graduate attestations</SectionLabel>
              <h2 className="monograph-section__title">Graduate attestations</h2>
              <p className="type-small" style={{ color: "var(--muted)", marginBottom: "var(--s5)" }}>
                Published with explicit consent. Initials are used unless full
                attribution is requested by the graduate. Statements are
                attestation records, not promotional copy.
              </p>
              {programme.testimonials.map((t) => (
                <blockquote key={t.name + t.year} className="testimonial">
                  <p className="type-body-l testimonial__statement">&ldquo;{t.statement}&rdquo;</p>
                  <footer className="type-small testimonial__footer">
                    {t.name} · {t.context} · {t.year}
                  </footer>
                </blockquote>
              ))}
            </section>

            <section id="pathways" className="monograph-section">
              <SectionLabel>Graduate pathways</SectionLabel>
              <h2 className="monograph-section__title">After certification</h2>
              {programme.graduatePathways.map((path) => (
                <article key={path.title} className="policy-block">
                  <h3 className="type-title">{path.title}</h3>
                  {path.body.map((p) => (
                    <p key={p.slice(0, 48)} className="type-body">{p}</p>
                  ))}
                  {path.href && (
                    <p className="type-body">
                      <GoLink href={path.href}>Read pathway details</GoLink>
                    </p>
                  )}
                </article>
              ))}
            </section>

            <FaqSection items={programme.faq} />

            <section id="policies" className="monograph-section">
              <SectionLabel>Policies</SectionLabel>
              <h2 className="monograph-section__title">Policies</h2>
              <PolicyBlocks items={programme.policies} />
            </section>

            {programme.pathways.length > 0 && (
              <section className="monograph-section">
                <SectionLabel>Related programmes</SectionLabel>
                <ul className="pathway-group__list">
                  {programme.pathways.map((p) => (
                    <li key={p.href}>
                      <GoLink href={p.href}>{p.label}</GoLink>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section id="enrolment" className="dispensation-block enrolment-block">
              <SectionLabel>Application</SectionLabel>
              <h2 className="monograph-section__title">Enrolment</h2>
              <p className="type-body" style={{ marginBottom: "var(--s5)" }}>
                {programme.feeNote} Review the full programme before
                submission. Each application is evaluated on academic readiness
                and clinical suitability.
              </p>
              <SectionLabel>Send application</SectionLabel>
              <EnrolmentJourney steps={programme.enrolmentJourney} />
              <div id="application" style={{ marginTop: "var(--s6)" }}>
                <EnrolmentForm programmeName={programme.name} />
              </div>
            </section>
          </article>

          <ProgrammeLedger programme={programme} />
        </div>
      </Leaf>
    </>
  );
}
