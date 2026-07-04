import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { IsnadRule } from "@/components/arrival/IsnadRule";
import { WayForward } from "@/components/ui/WayForward";
import { getInstitutionSettings } from "@/sanity/lib/fetch";

export const metadata: Metadata = {
  title: "The Institute",
  description:
    "The Sunnah Remedies Institute — a modern bimāristān for the preservation, study, practice, teaching, and honest testing of Prophetic Medicine.",
  openGraph: {
    title: "The Institute · Sunnah Remedies",
    description:
      "A bimāristān reborn — healing, scholarship, and hospitality under one endowment.",
    type: "website",
    siteName: "Sunnah Remedies",
  },
};

export default async function InstitutePage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getInstitutionSettings(locale);
  return (
    <article>
      {/* ═══ Hero ═══ */}
      <section className="leaf leaf--grave" aria-labelledby="institute-heading">
        <div className="measure-wide">
          <p className="type-eyebrow" style={{ color: "var(--gilt-soft)", marginBottom: "var(--s4)" }}>
            THE INSTITUTE
          </p>
          <h1 id="institute-heading" className="type-display-l grave-block__line">
            A bimāristān reborn for the present age
          </h1>
          <p className="type-lede grave-block__qualifier" style={{ maxWidth: "var(--measure-reading)", margin: "var(--s5) auto 0" }}>
            A single institution where the tradition of Prophetic Medicine is preserved, studied, practised, taught, tested against the best modern evidence, and given a home worthy of its dignity
          </p>
        </div>
      </section>

      <IsnadRule variant="divider" nodePosition={0.5} />

      {/* ═══ The Mandate ═══ */}
      <section className="leaf" aria-labelledby="mandate-heading">
        <div className="measure-wide">
          <p className="section-label">THE MANDATE</p>
          <h2 id="mandate-heading" className="type-title" style={{ marginBottom: "var(--s4)" }}>
            Two Ledgers, One Standard
          </h2>
          <div style={{ maxWidth: "var(--measure-reading)" }}>
            <p className="type-body-l" style={{ marginBottom: "var(--s4)" }}>
              The Institute keeps two ledgers — the Commercial and the Integrity — and where they conflict the Integrity Ledger wins, always, without appeal, regardless of cost
            </p>
            <p className="type-body" style={{ color: "var(--muted)", marginBottom: "var(--s4)" }}>
              This is written into the founding deed of the waqf itself, placing the supremacy of integrity beyond the reach of any future director, donor, downturn, or acquirer. No one who comes after will be able to quietly sell the conscience of this place
            </p>
            <p className="type-body" style={{ color: "var(--muted)" }}>
              The endowment is not a budget. It is an amānah — a trust placed in our hands to build something that ought to have existed for a thousand years and did not
            </p>
          </div>
        </div>
      </section>

      {/* ═══ The Six Functions ═══ */}
      <section className="leaf leaf--inset" aria-labelledby="functions-heading">
        <div className="measure-wide">
          <p className="section-label">THE MISSION</p>
          <h2 id="functions-heading" className="type-title" style={{ marginBottom: "var(--s5)" }}>
            Six functions no existing institution performs together
          </h2>
          <div className="trust-grid">
            {[
              { numeral: "I", title: "Preserve", text: "The textual and material heritage of Prophetic Medicine — the Library and the Archive" },
              { numeral: "II", title: "Heal", text: "According to the tradition, safely, within proper clinical governance — the Clinic and Apothecary" },
              { numeral: "III", title: "Teach", text: "The next generation of practitioners and scholars — the Academy and its living halaqa" },
              { numeral: "IV", title: "Test", text: "The tradition honestly against modern evidence, neither flattering nor betraying it — the Research Centre" },
              { numeral: "V", title: "Cultivate", text: "The living plants and craft the tradition depends on — the Gardens and the Physic Garden" },
              { numeral: "VI", title: "Publish", text: "What the Institute learns, to the world — the Press and its scholarly imprint" },
            ].map((item) => (
              <div key={item.numeral} className="trust-grid__item">
                <p className="trust-grid__numeral">{item.numeral}</p>
                <h3 className="trust-grid__title type-title">{item.title}</h3>
                <p className="trust-grid__text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ The Campus — Threshold, Corridors, Pathways ═══ */}
      <section className="leaf" aria-labelledby="campus-heading">
        <div className="measure-wide">
          <p className="section-label">THE CAMPUS</p>
          <h2 id="campus-heading" className="type-title" style={{ marginBottom: "var(--s5)" }}>
            Threshold, Corridors, Pathways — in stone
          </h2>
          <div style={{ maxWidth: "var(--measure-reading)", marginBottom: "var(--s6)" }}>
            <p className="type-body-l" style={{ marginBottom: "var(--s4)" }}>
              The master plan is a sequence of courtyards, in the manner of the great madrasas and mosque-complexes, arranged along a gentle inward progression and bound by shaded arcades
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div className="dept-row" style={{ textDecoration: "none" }}>
              <span className="dept-row__numeral">I</span>
              <div className="dept-row__content">
                <h3 className="type-title">The Threshold — the Outer Court</h3>
                <p className="type-body dept-row__role">
                  From the street, a visitor passes through a modest, dignified gate — marked by a public fountain that offers clean water freely. The Outer Court is where the world is set down: reception, the museum entrance, the Apothecary shop. Nothing is sold under pressure here; people are received
                </p>
              </div>
            </div>
            <div className="dept-row" style={{ textDecoration: "none" }}>
              <span className="dept-row__numeral">II</span>
              <div className="dept-row__content">
                <h3 className="type-title">The Corridors — the Arcades and the Water Axis</h3>
                <p className="type-body dept-row__role">
                  Shaded arcades and a central water channel lead inward. The corridors are calm, legible, and generous — they always show the way forward and the way back; they never abandon anyone. Light falls through latticed screens; water runs quietly alongside; the pace slows
                </p>
              </div>
            </div>
            <div className="dept-row" style={{ textDecoration: "none" }}>
              <span className="dept-row__numeral">III</span>
              <div className="dept-row__content">
                <h3 className="type-title">The Pathways — the Inner Courts and the Still Centre</h3>
                <p className="type-body dept-row__role">
                  Deeper in lie the committed spaces: the Great Library, the Academy's teaching cloisters, the Clinic, the Research Centre, and at the heart, the Great Garden and the prayer hall. Access deepens with relationship — a passing visitor sees the garden; a student lives in the cloisters; a scholar is admitted to the manuscript vault
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ The Great Garden ═══ */}
      <section className="leaf leaf--grave" aria-labelledby="garden-heading">
        <div className="measure-wide">
          <p className="section-label" style={{ color: "var(--gilt-soft)" }}>THE HEART</p>
          <h2 id="garden-heading" className="type-display-l grave-block__line" style={{ marginBottom: "var(--s4)" }}>
            The Great Garden and the Prayer Hall
          </h2>
          <p className="type-body-l" style={{ color: "var(--paper-dim)", maxWidth: "var(--measure-reading)" }}>
            At the physical and spiritual centre of the campus: a walled garden in the chahār bāgh form — the four-fold paradise garden — oriented toward the qibla, with water running along its axis, the Physic Garden as its productive quarter, and the prayer hall at its head. The garden is never ornamental; it is the Institute's working pharmacy, its contemplative space, and its most profound teacher
          </p>
        </div>
      </section>

      {/* ═══ The Three Pillars ═══ */}
      <section className="leaf" aria-labelledby="pillars-heading">
        <div className="measure-wide">
          <p className="section-label">THE THREE PILLARS</p>
          <h2 id="pillars-heading" className="type-title" style={{ marginBottom: "var(--s5)" }}>
            The departments — made physical, made digital
          </h2>
          <div className="trust-grid" style={{ gridTemplateColumns: "1fr" }}>
            {[
              {
                numeral: "I",
                title: "The Apothecary",
                text: "A cabinet of preparations, each documented to source before dispensation. On the campus: the dispensary, the compounding laboratory, and the quality-control laboratory",
                href: "/the-apothecary",
              },
              {
                numeral: "II",
                title: "The Academy",
                text: "Clinical education in Hijāma and Prophetic therapeutics, structured by isnād. On the campus: the teaching cloisters, the clinical suites, the library seminar halls",
                href: "/the-academy",
              },
              {
                numeral: "III",
                title: "Sacred Journeys",
                text: "Educational pilgrimage to the Holy Lands — preparation precedes departure, purpose before itinerary. On the campus: the travel office, the reading room, the preparation programme",
                href: "/sacred-journeys",
              },
            ].map((item) => (
              <div key={item.numeral} className="trust-grid__item">
                <p className="trust-grid__numeral">{item.numeral}</p>
                <h3 className="trust-grid__title type-title">{item.title}</h3>
                <p className="trust-grid__text">{item.text}</p>
                <Link href={item.href} className="go-link" style={{ marginTop: "var(--s3)" }}>
                  Enter {item.title.toLowerCase()} <span aria-hidden="true">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ What Greatness Means ═══ */}
      <section className="leaf leaf--inset" aria-labelledby="greatness-heading">
        <div className="measure-wide">
          <p className="section-label">DEFINITION OF GREATNESS</p>
          <h2 id="greatness-heading" className="type-title" style={{ marginBottom: "var(--s5)" }}>
            Not the largest, nor the most expensive
          </h2>
          <div style={{ maxWidth: "var(--measure-reading)" }}>
            <p className="type-body" style={{ color: "var(--muted)", marginBottom: "var(--s5)" }}>
              Measured on the Integrity Ledger, greatness means four things:
            </p>
            <ol className="charter-list" style={{ marginBottom: "var(--s5)" }}>
              <li className="type-body"><strong>The most trustworthy</strong> — no institution holds the tradition to a higher standard of sourcing, honesty, and isnād</li>
              <li className="type-body"><strong>The most beautiful</strong> — the finest knowledge deserves the finest setting, because beauty is a form of respect</li>
              <li className="type-body"><strong>The most humane</strong> — every person received as a guest and left more settled than they arrived</li>
              <li className="type-body"><strong>The most enduring</strong> — built, endowed, and governed to stand for a century and beyond</li>
            </ol>
          </div>
        </div>
      </section>

      {/* ═══ Governance ═══ */}
      <section className="leaf" aria-labelledby="governance-heading">
        <div className="measure-wide">
          <p className="section-label">GOVERNANCE</p>
          <h2 id="governance-heading" className="type-title" style={{ marginBottom: "var(--s4)" }}>
            The Waqf — structural permanence
          </h2>
          <div style={{ maxWidth: "var(--measure-reading)" }}>
            <p className="type-body" style={{ marginBottom: "var(--s4)" }}>
              The Institute is constituted as an inalienable waqf — a perpetual endowment in the tradition's own great institutional form — so that it cannot be sold, asset-stripped, or repurposed by any future party
            </p>
            <p className="type-body" style={{ color: "var(--muted)", marginBottom: "var(--s4)" }}>
              The supremacy of the Integrity Ledger over the Commercial Ledger is written into the founding deed as a permanent, unamendable condition. The Keeper of the Integrity Ledger holds a formal veto over any decision that would compromise the Institute's honesty
            </p>
            <p className="type-body" style={{ color: "var(--muted)" }}>
              An endowed institution can afford to be honest forever. That single structural decision is the most important thing the endowment buys
            </p>
          </div>
        </div>
      </section>

      {/* ═══ The Digital Twin ═══ */}
      <section className="leaf leaf--inset" aria-labelledby="twin-heading">
        <div className="measure-wide">
          <p className="section-label">THE DIGITAL TWIN</p>
          <h2 id="twin-heading" className="type-title" style={{ marginBottom: "var(--s4)" }}>
            The same house, entered through a screen
          </h2>
          <div style={{ maxWidth: "var(--measure-reading)" }}>
            <p className="type-body-l" style={{ marginBottom: "var(--s4)" }}>
              This digital estate is not a map of the Institute — it is the Institute, rendered in a second medium
            </p>
            <p className="type-body" style={{ color: "var(--muted)", marginBottom: "var(--s4)" }}>
              A person who experiences only this digital estate, and a person who experiences only the physical campus, should come away having met the same house — equally received, equally trusted, equally changed
            </p>
            <p className="type-body" style={{ color: "var(--muted)", marginBottom: "var(--s5)" }}>
              The twin is faithful, not literal. It mirrors the experience and the meaning of each physical space in the medium native to the screen — the same registers, the same materials translated to type and colour and light, the same rhythm, the same honesty
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--s3)", paddingTop: "var(--s4)", borderTop: "1px solid var(--rule)" }}>
              <p className="type-eyebrow" style={{ marginBottom: "var(--s2)" }}>THE MAPPING</p>
              {[
                { physical: "The Outer Court", digital: "The public estate — exhibitions, apothecary, correspondence", href: "/exhibitions" },
                { physical: "The Arcades", digital: "Navigation and transitions — calm, legible, never abandoning", href: null },
                { physical: "The Great Library", digital: "The Knowledge Library — reading modes, collections, series", href: "/knowledge-library" },
                { physical: "The Research Centre", digital: "Evidence summaries, honest grading, laboratory findings", href: "/research" },
                { physical: "The Press", digital: "The publishing house — editions, patient guides, fine artefacts", href: "/press" },
                { physical: "The Museum", digital: "Digital exhibitions — the tradition told through objects", href: "/exhibitions" },
              ].map((row) => (
                <div key={row.physical} className="ruled-row" style={{ padding: "var(--s3) 0" }}>
                  <span className="type-body" style={{ fontWeight: 500 }}>{row.physical}</span>
                  <span className="type-small ruled-row__provenance">{row.digital}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <IsnadRule variant="footer" nodePosition={0.5} />

      {/* ═══ Closing ═══ */}
      <section className="leaf" aria-label="Closing statement">
        <div className="editorial-invitation">
          <p className="editorial-invitation__title type-title">
            The measure of success
          </p>
          <p className="editorial-invitation__body">
            Is it the most trustworthy institution of its kind? Is it beautiful enough to honour the tradition? Is every person received as a guest? And is it built to hand all of this, intact, to people not yet born?
          </p>
          <div className="editorial-invitation__actions">
            <Link href="/charter" className="quiet-link">
              Read the founding charter
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Way Forward ═══ */}
      <WayForward
        back={{ label: "The Threshold", href: "/" }}
        forward={[
          { label: "The Institutional Year", href: "/calendar", description: "Traditions, rituals, and the annual rhythm" },
          { label: "The Founding Charter", href: "/charter", description: "The constitutional text of the institution" },
        ]}
      />
    </article>
  );
}
