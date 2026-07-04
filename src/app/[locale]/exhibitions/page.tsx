import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { IsnadRule } from "@/components/arrival/IsnadRule";
import { HospitableEmpty } from "@/components/ui/HospitableEmpty";
import { WayForward } from "@/components/ui/WayForward";
import { getInstitutionSettings } from "@/sanity/lib/fetch";

export const metadata: Metadata = {
  title: "Exhibitions",
  description:
    "The digital museum — exhibitions on Prophetic Medicine and the great Islamic tradition of healing, presented with scholarly care and reverence.",
  openGraph: {
    title: "Exhibitions · Sunnah Remedies",
    description:
      "The tradition of healing told through objects, manuscripts, and honest scholarship.",
    type: "website",
    siteName: "Sunnah Remedies",
  },
};

const permanentExhibition = {
  title: "The Tradition of Healing",
  subtitle: "A permanent exhibition",
  description:
    "The story of Prophetic Medicine and the great Islamic tradition of healing — from the Prophetic foundation through the golden age of the bimāristāns to the present day",
  galleries: [
    {
      numeral: "I",
      title: "The Prophetic Foundation",
      description:
        "The place of medicine and wellbeing within the Prophetic tradition, presented with scholarly care and correct sourcing",
    },
    {
      numeral: "II",
      title: "The Great Physicians and the Bimāristāns",
      description:
        "Ibn Sīnā, al-Rāzī, Ibn al-Nafīs, al-Zahrāwī — the hospitals of Baghdad, Damascus, and Cairo — the very institutional lineage the Institute revives",
    },
    {
      numeral: "III",
      title: "The Materia Medica",
      description:
        "The plants, minerals, and preparations of the tradition: honey, black seed, saffron, senna, oud — the instruments of the apothecary and the cupper",
    },
    {
      numeral: "IV",
      title: "The Manuscripts",
      description:
        "A rotating display of the tradition's texts, drawn from the archive, showing the beauty and the isnād of the written heritage",
    },
    {
      numeral: "V",
      title: "The Tradition and Modern Evidence",
      description:
        "An honest gallery on where tradition and contemporary science meet, agree, and diverge — the visitor leaves informed rather than merely impressed",
    },
  ],
};

export default async function ExhibitionsPage({
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
      <section className="leaf leaf--grave" aria-labelledby="exhibitions-heading">
        <div className="measure-wide">
          <p className="type-eyebrow" style={{ color: "var(--gilt-soft)", marginBottom: "var(--s4)" }}>
            THE MUSEUM
          </p>
          <h1 id="exhibitions-heading" className="type-display-l grave-block__line">
            Exhibitions
          </h1>
          <p className="type-lede grave-block__qualifier" style={{ maxWidth: "var(--measure-reading)", margin: "var(--s5) auto 0" }}>
            The Institute's most public act of teaching — objects beautifully lit, honestly sourced, reverently displayed
          </p>
        </div>
      </section>

      <IsnadRule variant="divider" nodePosition={0.5} />

      {/* ═══ Permanent Exhibition ═══ */}
      <section className="leaf" aria-labelledby="permanent-heading">
        <div className="measure-wide">
          <p className="section-label">PERMANENT EXHIBITION</p>
          <h2 id="permanent-heading" className="type-display-l" style={{ marginBottom: "var(--s3)" }}>
            {permanentExhibition.title}
          </h2>
          <p className="type-lede" style={{ color: "var(--muted)", marginBottom: "var(--s6)", maxWidth: "var(--measure-reading)" }}>
            {permanentExhibition.description}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {permanentExhibition.galleries.map((gallery) => (
              <div key={gallery.numeral} className="dept-row" style={{ textDecoration: "none" }}>
                <span className="dept-row__numeral">{gallery.numeral}</span>
                <div className="dept-row__content">
                  <h3 className="type-title">{gallery.title}</h3>
                  <p className="type-body dept-row__role">{gallery.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Temporary Exhibitions ═══ */}
      <section className="leaf leaf--inset" aria-labelledby="temporary-heading">
        <div className="measure-wide">
          <p className="section-label">TEMPORARY EXHIBITIONS</p>
          <h2 id="temporary-heading" className="type-title" style={{ marginBottom: "var(--s4)" }}>
            The annual programme
          </h2>
          <div style={{ maxWidth: "var(--measure-reading)" }}>
            <p className="type-body" style={{ color: "var(--muted)", marginBottom: "var(--s5)" }}>
              A gallery reserved for temporary exhibitions — a single manuscript studied in depth, a theme, a visiting collection, the work of the Research Centre — refreshed on the annual calendar so that the Museum rewards return
            </p>
          </div>

          <HospitableEmpty
            heading="Exhibitions forthcoming"
            message="The first temporary exhibition is being prepared — it will open when it meets the curatorial standard the tradition deserves"
          />
        </div>
      </section>

      {/* ═══ Curatorial Standard ═══ */}
      <section className="leaf" aria-labelledby="standard-heading">
        <div className="measure-wide">
          <p className="section-label">CURATORIAL STANDARD</p>
          <h2 id="standard-heading" className="type-title" style={{ marginBottom: "var(--s4)" }}>
            Nothing shown that the Institute cannot defend before a scholar
          </h2>
          <div style={{ maxWidth: "var(--measure-reading)" }}>
            <p className="type-body" style={{ marginBottom: "var(--s4)" }}>
              Every object is real, honestly labelled, correctly sourced, and reverently displayed
            </p>
            <p className="type-body" style={{ color: "var(--muted)", marginBottom: "var(--s4)" }}>
              The Museum never uses spectacle in place of substance, never presents folklore as established fact, and never sensationalises the sacred
            </p>
            <p className="type-body" style={{ color: "var(--muted)" }}>
              Its register is the Library's standard made visible to the public — calm, generous space, honest and sourced captions, no screens shouting
            </p>
          </div>
        </div>
      </section>

      <IsnadRule variant="footer" nodePosition={0.5} />

      {/* ═══ Closing ═══ */}
      <section className="leaf" aria-label="Closing">
        <div className="editorial-invitation">
          <p className="editorial-invitation__title type-title">
            The Museum as threshold
          </p>
          <p className="editorial-invitation__body">
            A person may visit the Museum, drink from the fountain, and leave having encountered the tradition — without ever needing to seek treatment or enrol
          </p>
          <div className="editorial-invitation__actions">
            <Link href="/knowledge-library" className="quiet-link">
              Enter the Knowledge Library
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Way Forward ═══ */}
      <WayForward
        back={{ label: "The Institute", href: "/institute" }}
        forward={[
          { label: "The Knowledge Library", href: "/knowledge-library", description: "Open scholarship on Prophetic Medicine" },
        ]}
      />
    </article>
  );
}
