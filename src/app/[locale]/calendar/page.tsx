import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { IsnadRule } from "@/components/arrival/IsnadRule";
import { WayForward } from "@/components/ui/WayForward";
import {
  INSTITUTIONAL_YEAR,
  getCurrentSeason,
  getHijriYear,
} from "@/lib/calendar/seasons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("calendar", "/calendar");
}

const HIJRI_MONTHS: Record<number, string> = {
  1: "Muḥarram",
  2: "Ṣafar",
  3: "Rabīʿ al-Awwal",
  4: "Rabīʿ al-Thānī",
  5: "Jumādā al-Ūlā",
  6: "Jumādā al-Thāniyah",
  7: "Rajab",
  8: "Shaʿbān",
  9: "Ramaḍān",
  10: "Shawwāl",
  11: "Dhūl Qaʿdah",
  12: "Dhūl Ḥijjah",
};

const CATEGORY_LABELS: Record<string, string> = {
  ceremony: "Ceremony",
  gathering: "Gathering",
  season: "Sacred Season",
  garden: "The Gardens",
};

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { season: currentSeason } = getCurrentSeason();
  const hijriYear = getHijriYear();

  return (
    <article>
      {/* ═══ Hero ═══ */}
      <section className="leaf leaf--grave" aria-labelledby="calendar-heading">
        <div className="measure-wide">
          <p className="type-eyebrow" style={{ color: "var(--gilt-soft)", marginBottom: "var(--s4)" }}>
            THE INSTITUTIONAL YEAR
          </p>
          <h1 id="calendar-heading" className="type-display-l grave-block__line">
            Traditions, rituals, and the turning of the year
          </h1>
          <p className="type-lede grave-block__qualifier" style={{ maxWidth: "var(--measure-reading)", margin: "var(--s5) auto 0" }}>
            A hundred-year institution is held together not only by governance but by tradition — the recurring ceremonies and rhythms that give a community its identity and let each generation feel part of something older than itself
          </p>
          {hijriYear > 0 && (
            <p className="type-folio" style={{ color: "var(--gilt-soft)", marginTop: "var(--s4)" }}>
              {hijriYear} AH
            </p>
          )}
        </div>
      </section>

      <IsnadRule variant="divider" nodePosition={0.5} />

      {/* ═══ The Daily Rhythm ═══ */}
      <section className="leaf" aria-labelledby="daily-heading">
        <div className="measure-wide">
          <p className="section-label">THE DAILY RHYTHM</p>
          <h2 id="daily-heading" className="type-title" style={{ marginBottom: "var(--s4)" }}>
            Five prayers structure the day
          </h2>
          <div style={{ maxWidth: "var(--measure-reading)" }}>
            <p className="type-body" style={{ color: "var(--muted)" }}>
              The working rhythm of the Institution — clinic, classroom, laboratory, library, and garden — bends around the five daily prayers. This is not an interruption but the deepest organising principle: the whole campus turns toward the same point five times a day, and the pace between is shaped by what comes next
            </p>
          </div>
        </div>
      </section>

      {/* ═══ The Annual Cycle ═══ */}
      <section className="leaf leaf--inset" aria-labelledby="annual-heading">
        <div className="measure-wide">
          <p className="section-label">THE ANNUAL CYCLE</p>
          <h2 id="annual-heading" className="type-title" style={{ marginBottom: "var(--s5)" }}>
            The year moves through nine fixed points
          </h2>
          <p className="type-body" style={{ color: "var(--muted)", maxWidth: "var(--measure-reading)", marginBottom: "var(--s6)" }}>
            Each is designed from the founding, so that by the Institution's centenary they are ancient. A community that knows the Institution's rhythm trusts it the way one trusts the turning of familiar seasons
          </p>

          <div className="calendar-year">
            {INSTITUTIONAL_YEAR.map((event) => {
              const isCurrent = event.season !== "standard" && event.season === currentSeason;
              return (
                <div
                  key={event.id}
                  className="calendar-event"
                  style={isCurrent ? { borderLeftColor: "var(--brass)", borderLeftWidth: "2px", borderLeftStyle: "solid", paddingLeft: "var(--s4)" } : undefined}
                >
                  <div className="calendar-event__month type-eyebrow">
                    {HIJRI_MONTHS[event.hijriMonth]}
                  </div>
                  <div className="calendar-event__body">
                    <h3 className="calendar-event__title type-title">{event.title}</h3>
                    <p className="calendar-event__description type-body">{event.description}</p>
                    <span className={`calendar-event__badge calendar-event__badge--${event.category}`}>
                      {CATEGORY_LABELS[event.category]}
                    </span>
                    {isCurrent && (
                      <span className="type-small" style={{ color: "var(--brass)", fontStyle: "italic" }}>
                        Currently observed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ The Rhythms of the Garden ═══ */}
      <section className="leaf" aria-labelledby="garden-rhythm-heading">
        <div className="measure-wide">
          <p className="section-label">THE GARDEN'S RHYTHM</p>
          <h2 id="garden-rhythm-heading" className="type-title" style={{ marginBottom: "var(--s4)" }}>
            Planting, tending, harvest — the living calendar
          </h2>
          <div style={{ maxWidth: "var(--measure-reading)" }}>
            <p className="type-body" style={{ marginBottom: "var(--s4)" }}>
              The Gardens give the Institution its deepest seasonal rhythm. Planting, tending, and harvest mark the year alongside the sacred calendar, and the harvest of the medicinal beds is itself an annual event — the community gathers to bring in the materia medica
            </p>
            <p className="type-body" style={{ color: "var(--muted)" }}>
              The Gardens ensure that the Institution is never merely an institution of books and buildings, but a living thing that grows, is tended, and yields. The digital estate mirrors this — breathing with the same seasons, acknowledging the same turning
            </p>
          </div>
        </div>
      </section>

      {/* ═══ The Sacred Seasons ═══ */}
      <section className="leaf leaf--grave" aria-labelledby="sacred-heading">
        <div className="measure-wide">
          <p className="section-label" style={{ color: "var(--gilt-soft)" }}>THE SACRED SEASONS</p>
          <h2 id="sacred-heading" className="type-display-l grave-block__line" style={{ marginBottom: "var(--s5)" }}>
            Four seasons that deepen the register
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--s5)", maxWidth: "var(--measure-reading)" }}>
            <div>
              <h3 className="type-title" style={{ color: "var(--paper)", marginBottom: "var(--s2)" }}>Ramaḍān</h3>
              <p className="type-body" style={{ color: "var(--paper-dim)" }}>
                The Institution's most reverent season. The whole register deepens: reflective gatherings, adhkār and reading prepared for the month, charitable care extended, and commerce set aside so that the sacred comes forward. Ramaḍān is never a season of offers — it is the Institution at its most devotional
              </p>
            </div>
            <div>
              <h3 className="type-title" style={{ color: "var(--paper)", marginBottom: "var(--s2)" }}>Dhūl Ḥijjah and the Days of Ḥajj</h3>
              <p className="type-body" style={{ color: "var(--paper-dim)" }}>
                The Sacred Journeys community gathers — preparation, reading, and the duty of care. Those departing are sent with purpose; those returning are welcomed into the lifelong companionship the programme promises
              </p>
            </div>
            <div>
              <h3 className="type-title" style={{ color: "var(--paper)", marginBottom: "var(--s2)" }}>Rabīʿ al-Awwal</h3>
              <p className="type-body" style={{ color: "var(--paper-dim)" }}>
                The Prophetic month — readings and reflection on the biography and the tradition of mercy. The Institution's very subject is the legacy of a single life; this month acknowledges that origin with reverence
              </p>
            </div>
            <div>
              <h3 className="type-title" style={{ color: "var(--paper)", marginBottom: "var(--s2)" }}>Muḥarram</h3>
              <p className="type-body" style={{ color: "var(--paper-dim)" }}>
                A new Hijrī year — the Institution renews its covenant with knowledge and service. The turning of the year is marked with quiet reflection on what was built and what lies ahead
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ The Gatherings ═══ */}
      <section className="leaf" aria-labelledby="gatherings-heading">
        <div className="measure-wide">
          <p className="section-label">THE GATHERINGS</p>
          <h2 id="gatherings-heading" className="type-title" style={{ marginBottom: "var(--s5)" }}>
            Fixed points that reward return
          </h2>
          <div className="trust-grid">
            {[
              { numeral: "I", title: "The Annual Lecture", text: "A great public lecture by a leading scholar or physician — the Institution's principal act of public teaching and one of the fixed points of its year" },
              { numeral: "II", title: "The Annual Conference", text: "The gathering of scholars, physicians, and researchers of Prophetic Medicine — building the field and the Institution's standing in it" },
              { numeral: "III", title: "The Ijāzah Ceremony", text: "The annual conferral of licences in the Great Majlis — graduates named, honoured, and sent out as links in the chain of teaching" },
              { numeral: "IV", title: "Exhibition Openings", text: "The unveiling of the Museum's temporary exhibitions — occasions that reward the community's return and open the tradition to the public" },
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

      <IsnadRule variant="footer" nodePosition={0.5} />

      {/* ═══ Closing ═══ */}
      <section className="leaf" aria-label="Closing statement">
        <div className="editorial-invitation">
          <p className="editorial-invitation__title type-title">
            The strategic function of the institutional year
          </p>
          <p className="editorial-invitation__body">
            It lets the Institution plan and act with excellence rather than react. It lets the community anticipate and belong to a shared rhythm. And it keeps the Institution breathing with the sacred year, so that a century from now it is still, recognisably, a house of the tradition
          </p>
        </div>
      </section>

      {/* ═══ Way Forward ═══ */}
      <WayForward
        back={{ label: "The Institute", href: "/institute" }}
        forward={[
          { label: "The Founding Charter", href: "/charter", description: "The constitutional text of the institution" },
        ]}
      />
    </article>
  );
}
