import { getTranslations } from "next-intl/server";
import { RunningHead, GoLink } from "@/components/ui/Links";
import { SectionLabel } from "@/components/ui/PageIntro";
import { FaqSection } from "@/components/apothecary/MonographExtras";
import { Breadcrumb } from "@/components/apothecary/Breadcrumb";
import { ProgrammeContents } from "@/components/academy/ProgrammeContents";
import { ProgrammeLedger } from "@/components/academy/ProgrammeLedger";
import { FacilityGallery } from "@/components/academy/FacilityGallery";
import { EnrolmentForm } from "@/components/academy/EnrolmentForm";
import { EnrolmentJourney } from "@/components/academy/EnrolmentJourney";
import Image from "next/image";
import { Leaf } from "@/components/ui/Leaf";
import { EditorialPhoto, PullQuote } from "@/components/editorial/Editorial";
import type { AcademyProgramme } from "@/lib/content/academy/types";

const facultyPortraits: Record<number, { src: string; alt: string }> = {
  0: {
    src: "/photography/faculty-portrait-1.jpg",
    alt: "Faculty member — senior practitioner and scholar",
  },
  1: {
    src: "/photography/faculty-portrait-2.jpg",
    alt: "Faculty member — clinical practitioner",
  },
};

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

export async function ProgrammeView({ programme }: ProgrammeViewProps) {
  const t = await getTranslations("academy.programmeView");

  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <RunningHead section={t("section")} folio={programme.folio} />
          <Breadcrumb
            items={[
              { label: t("section"), href: "/the-academy" },
              { label: programme.name },
            ]}
          />
          <header className="programme-header programme-header--executive">
            <p className="type-micro programme-header__tier">{programme.tier} · {t("professionalFormation")}</p>
            <h1 className="page-intro__title">{programme.name}</h1>
            <p className="page-intro__lede">{programme.subtitle}</p>
            <dl className="programme-header__meta">
              <div>
                <dt className="type-micro">{t("metaDuration")}</dt>
                <dd className="type-body">{programme.duration}</dd>
              </div>
              <div>
                <dt className="type-micro">{t("metaFormat")}</dt>
                <dd className="type-body">{programme.format}</dd>
              </div>
              <div>
                <dt className="type-micro">{t("metaFee")}</dt>
                <dd className="type-body">{programme.fee}</dd>
              </div>
              <div>
                <dt className="type-micro">{t("metaIntake")}</dt>
                <dd className="type-body">{programme.nextCohort}</dd>
              </div>
            </dl>
          </header>
        </div>
      </Leaf>

      <EditorialPhoto
        src="/photography/clinical-practice.jpg"
        alt="A clinical practitioner preparing sterile cupping equipment in a professional treatment room"
        aspect="landscape"
        fullBleed
        caption={t("editorialCaption")}
      />

      <Leaf variant="grave">
        <div className="measure grave-block">
          <PullQuote
            text="This is not an abbreviated online course. It is a supervised programme with published assessment criteria and faculty sign-off only after demonstrated competency"
            dark
          />
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide monograph-layout monograph-layout--ledger">
          <aside className="monograph-layout__nav">
            <ProgrammeContents />
          </aside>

          <article className="monograph-layout__reading measure">
            <section id="overview" className="monograph-section">
              <SectionLabel>{t("overviewLabel")}</SectionLabel>
              <h2 className="monograph-section__title">{t("overview")}</h2>
              <h3 className="programme-subheading">{t("programmeScope")}</h3>
              <ul className="monograph-list">
                {programme.whatItIs.map((p) => (
                  <li key={p.slice(0, 40)}>{p}</li>
                ))}
              </ul>
              <h3 className="programme-subheading">{t("intendedCohort")}</h3>
              <ul className="monograph-list">
                {programme.forWhom.map((p) => (
                  <li key={p.slice(0, 40)}>{p}</li>
                ))}
              </ul>
              <h3 className="programme-subheading">{t("commitments")}</h3>
              <ul className="monograph-list">
                {programme.whatItAsks.map((p) => (
                  <li key={p.slice(0, 40)}>{p}</li>
                ))}
              </ul>
            </section>

            <section id="outcomes" className="monograph-section">
              <SectionLabel>{t("outcomesLabel")}</SectionLabel>
              <h2 className="monograph-section__title">{t("outcomes")}</h2>
              <p className="type-small evidence-section__intro">
                {t("outcomesIntro")}
              </p>
              <ul className="outcome-list">
                {programme.learningOutcomes.map((o) => (
                  <li key={o.outcome} className="outcome-list__item">
                    <span className="type-body">{o.outcome}</span>
                    {o.assessed && (
                      <span className="type-micro outcome-list__badge">{t("assessed")}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <section id="curriculum" className="monograph-section">
              <SectionLabel>{t("curriculum")} · {programme.curriculum.length} {t("modules")}</SectionLabel>
              <h2 className="monograph-section__title">{t("curriculum")}</h2>
              {programme.curriculum.map((mod) => (
                <article key={mod.number} className="curriculum-module">
                  <header className="curriculum-module__header">
                    <span className="curriculum-module__numeral">{mod.number}</span>
                    <div>
                      <h3 className="type-title curriculum-module__title">{mod.title}</h3>
                      <p className="type-micro curriculum-module__hours">{mod.hours} {t("guidedHours")}</p>
                    </div>
                  </header>
                  <p className="type-body">{mod.description}</p>
                  {mod.practical && (
                    <p className="type-small" style={{ color: "var(--muted)" }}>
                      {t("practicalComponent")}: {mod.practical}
                    </p>
                  )}
                  <p className="type-micro curriculum-module__sources">
                    {t("primarySources")}: {mod.sources.join(" · ")}
                  </p>
                </article>
              ))}
            </section>

            <div className="monograph-section" style={{ marginBottom: "var(--s6)" }}>
              <PullQuote
                text="The teacher is named before the subject. The chain is stated before the curriculum. Assessment criteria are published before enrolment opens"
              />
            </div>

            <section id="practical" className="monograph-section">
              <SectionLabel>{t("practicalLabel")}</SectionLabel>
              <h2 className="monograph-section__title">{t("supervisedPractice")}</h2>
              {programme.practicalSessions.map((session) => (
                <article key={session.title} className="curriculum-module">
                  <h3 className="type-title">{session.title}</h3>
                  <p className="type-micro curriculum-module__hours">
                    {session.schedule} · {session.hours} {t("hours")}
                  </p>
                  <p className="type-body">{session.description}</p>
                  <p className="type-small" style={{ color: "var(--muted)" }}>
                    {t("supervision")}: {session.supervision}
                  </p>
                </article>
              ))}
            </section>

            <section id="faculty" className="monograph-section">
              <SectionLabel>{t("faculty")}</SectionLabel>
              <h2 className="monograph-section__title">{t("faculty")}</h2>
              {programme.faculty.map((member, i) => {
                const portrait = facultyPortraits[i];
                return (
                  <article key={member.name} className="faculty-card">
                    {portrait && (
                      <div className="faculty-card__portrait">
                        <Image
                          src={portrait.src}
                          alt={portrait.alt}
                          width={280}
                          height={373}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="type-title faculty-card__name">{member.name}</h3>
                      <p className="type-micro faculty-card__title">{member.title}</p>
                      <p className="type-small faculty-card__licence">{member.licence}</p>
                      <p className="type-small faculty-card__chain">{member.chain}</p>
                      {member.biography.map((para) => (
                        <p key={para.slice(0, 40)} className="type-body faculty-card__bio">{para}</p>
                      ))}
                    </div>
                  </article>
                );
              })}
            </section>

            <section id="facilities" className="monograph-section">
              <SectionLabel>{t("facilities")}</SectionLabel>
              <h2 className="monograph-section__title">{t("facilities")}</h2>
              {programme.facilities.map((f) => (
                <article key={f.name} className="facility-card">
                  <h3 className="type-title">{f.name}</h3>
                  <p className="type-body">{f.description}</p>
                </article>
              ))}
            </section>

            <section id="clinical-standards" className="monograph-section">
              <SectionLabel>{t("clinicalStandards")}</SectionLabel>
              <h2 className="monograph-section__title">{t("clinicalStandards")}</h2>
              <PolicyBlocks items={programme.clinicalStandards} />
            </section>

            <section id="assessment" className="monograph-section">
              <SectionLabel>{t("assessment")}</SectionLabel>
              <h2 className="monograph-section__title">{t("assessment")}</h2>
              <ul className="monograph-list">
                {programme.assessment.map((p) => (
                  <li key={p.slice(0, 40)}>{p}</li>
                ))}
              </ul>
              <p className="type-body" style={{ marginTop: "var(--s4)" }}>
                {t("clinicalPracticeLabel")}:
              </p>
              <ul className="monograph-list">
                {programme.clinicalPractice.map((p) => (
                  <li key={p.slice(0, 40)}>{p}</li>
                ))}
              </ul>
            </section>

            <section id="certification" className="monograph-section">
              <SectionLabel>{t("certification")}</SectionLabel>
              <h2 className="monograph-section__title">{t("certification")}</h2>
              <ul className="monograph-list">
                {programme.certification.map((p) => (
                  <li key={p.slice(0, 40)}>{p}</li>
                ))}
              </ul>
            </section>

            <section id="entry" className="monograph-section">
              <SectionLabel>{t("entryRequirements")}</SectionLabel>
              <h2 className="monograph-section__title">{t("entryRequirements")}</h2>
              <ul className="monograph-list">
                {programme.entryRequirements.map((p) => (
                  <li key={p.slice(0, 40)}>{p}</li>
                ))}
              </ul>
            </section>

            <section id="equipment" className="monograph-section">
              <SectionLabel>{t("equipmentLabel")}</SectionLabel>
              <h2 className="monograph-section__title">{t("equipment")}</h2>
              <table className="equipment-table">
                <thead>
                  <tr>
                    <th className="type-micro">{t("tableItem")}</th>
                    <th className="type-micro">{t("tableSpecification")}</th>
                    <th className="type-micro">{t("tableSupplied")}</th>
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
              <SectionLabel>{t("courseHandbook")}</SectionLabel>
              <h2 className="monograph-section__title">{t("courseHandbook")}</h2>
              <PolicyBlocks items={programme.courseHandbook} />
            </section>

            <section id="guide" className="monograph-section">
              <SectionLabel>{t("studentGuide")}</SectionLabel>
              <h2 className="monograph-section__title">{t("studentGuide")}</h2>
              <PolicyBlocks items={programme.studentGuide} />
            </section>

            <section id="gallery" className="monograph-section">
              <SectionLabel>{t("gallery")}</SectionLabel>
              <h2 className="monograph-section__title">{t("gallery")}</h2>
              <FacilityGallery items={programme.gallery} />
            </section>

            <section id="testimonials" className="monograph-section">
              <SectionLabel>{t("graduateAttestations")}</SectionLabel>
              <h2 className="monograph-section__title">{t("graduateAttestations")}</h2>
              <p className="type-small" style={{ color: "var(--muted)", marginBottom: "var(--s5)" }}>
                {t("testimonialsNote")}
              </p>
              {programme.testimonials.map((item) => (
                <blockquote key={item.name + item.year} className="testimonial">
                  <p className="type-body-l testimonial__statement">&ldquo;{item.statement}&rdquo;</p>
                  <footer className="type-small testimonial__footer">
                    {item.name} · {item.context} · {item.year}
                  </footer>
                </blockquote>
              ))}
            </section>

            <section id="pathways" className="monograph-section">
              <SectionLabel>{t("graduatePathways")}</SectionLabel>
              <h2 className="monograph-section__title">{t("afterCertification")}</h2>
              {programme.graduatePathways.map((path) => (
                <article key={path.title} className="policy-block">
                  <h3 className="type-title">{path.title}</h3>
                  {path.body.map((p) => (
                    <p key={p.slice(0, 48)} className="type-body">{p}</p>
                  ))}
                  {path.href && (
                    <p className="type-body">
                      <GoLink href={path.href}>{t("readPathwayDetails")}</GoLink>
                    </p>
                  )}
                </article>
              ))}
            </section>

            <FaqSection items={programme.faq} />

            <section id="policies" className="monograph-section">
              <SectionLabel>{t("policies")}</SectionLabel>
              <h2 className="monograph-section__title">{t("policies")}</h2>
              <PolicyBlocks items={programme.policies} />
            </section>

            {programme.pathways.length > 0 && (
              <section className="monograph-section">
                <SectionLabel>{t("relatedProgrammes")}</SectionLabel>
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
              <SectionLabel>{t("application")}</SectionLabel>
              <h2 className="monograph-section__title">{t("enrolment")}</h2>
              <p className="type-body" style={{ marginBottom: "var(--s5)" }}>
                {programme.feeNote} {t("enrolmentIntro")}
              </p>
              <SectionLabel>{t("sendApplication")}</SectionLabel>
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
