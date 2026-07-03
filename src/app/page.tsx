import type { Metadata } from "next";
import Image from "next/image";
import { Leaf } from "@/components/ui/Leaf";
import { SectionLabel } from "@/components/ui/PageIntro";
import { GoLink, QuietLink } from "@/components/ui/Links";
import { brandContext, brandAlt } from "@/lib/brand";
import {
  CinematicHero,
  EditorialPillar,
  EditorialPhoto,
  EditorialFeature,
  PullQuote,
  TrustGridItem,
  SectionNumeral,
  InstitutionalDivider,
  EditorialInvitation,
} from "@/components/editorial/Editorial";

export const metadata: Metadata = {
  title: "Sunnah Remedies — Institute of Prophetic Medicine",
  description:
    "The world's leading institute of Prophetic Medicine — scholarship, clinical care, and natural therapeutics under one house.",
};

export default function ThresholdPage() {
  return (
    <>
      {/* ———————————————————————————————————
          § 1  CINEMATIC HERO
          A single powerful photograph. Minimal text.
          ——————————————————————————————————— */}
      <CinematicHero
        src="/photography/institution-hero.jpg"
        alt="Scholarly hands examining an illuminated manuscript of Prophetic medicine beside glass vessels of amber oil and black seed"
        statement="The world's leading institute of Prophetic Medicine"
        qualifier="Scholarship, clinical practice, and natural therapeutics under one house. Built for careful study, patient service, and long stewardship."
      >
        <div style={{ display: "flex", justifyContent: "center", marginTop: "var(--s4)" }}>
          <Image
            src={brandContext.homepageHero}
            alt={brandAlt}
            width={674}
            height={374}
            priority
            style={{
              width: "clamp(140px, 20vw, 220px)",
              height: "auto",
              display: "block",
              opacity: 0.85,
            }}
          />
        </div>
      </CinematicHero>

      {/* ———————————————————————————————————
          § 2  THE INSTITUTION
          Who we are. Why we exist.
          ——————————————————————————————————— */}
      <Leaf>
        <div className="measure-wide">
          <SectionNumeral>I</SectionNumeral>
          <div className="founding-statement">
            <h2 className="type-display-l founding-statement__title">
              An institute, not a brand
            </h2>
            <div className="type-body-l founding-statement__body">
              <p>
                Sunnah Remedies is an institute for the preservation and
                responsible transmission of <em>Tibb al-Nabawi</em> — Prophetic
                Medicine. We do not sell wellness. We practise a discipline:
                one that insists on primary-source scholarship, laboratory
                verification, clinical accountability, and institutional
                transparency.
              </p>
              <p>
                Founded on the <em>waqf</em> model for continuity, the
                institution exists to serve, not to exit. Nothing is
                attributed without a traceable source. Limits are stated
                plainly. The person always precedes the protocol.
              </p>
            </div>
          </div>
        </div>
      </Leaf>

      <InstitutionalDivider />

      {/* ———————————————————————————————————
          § 3  ONE INSTITUTION · THREE PILLARS
          Large photography. Short editorial. One action.
          ——————————————————————————————————— */}
      <Leaf>
        <div className="measure-wide">
          <SectionNumeral>II</SectionNumeral>
          <SectionLabel>One institution · Three pillars</SectionLabel>

          <EditorialPillar
            src="/photography/apothecary-hero.jpg"
            alt="An apothecary dispensary: amber glass vessels of honey and oils arranged on aged wooden shelving beside dried medicinal herbs"
            caption="The dispensary — glass vessels, dried herbs, and preparations documented to source"
          >
            <p className="type-eyebrow" style={{ color: "var(--gilt)" }}>
              The Apothecary
            </p>
            <h3 className="type-display-l" style={{ margin: 0 }}>
              Provision by hand
            </h3>
            <p className="type-body-l">
              A cabinet of simples and preparations, each documented in a
              monograph that states origin, harvest, laboratory verification,
              and scholarly basis before the remedy is dispensed. Reading
              precedes purchase. Always.
            </p>
            <div>
              <GoLink href="/the-apothecary">Visit the Apothecary</GoLink>
            </div>
          </EditorialPillar>
        </div>
      </Leaf>

      <Leaf>
        <div className="measure-wide">
          <EditorialPillar
            src="/photography/academy-learning.jpg"
            alt="Students in a scholarly classroom studying anatomical charts and medical texts under natural light"
            caption="The Academy — a tutorial room where transmission follows chain and assessment"
            reverse
          >
            <p className="type-eyebrow" style={{ color: "var(--gilt)" }}>
              The Academy
            </p>
            <h3 className="type-display-l" style={{ margin: 0 }}>
              Transmission through study
            </h3>
            <p className="type-body-l">
              Clinical education in Hijama and Prophetic therapeutics, structured
              by <em>isnad</em>, faculty qualification, and independent
              assessment. Programmes are named by teacher, chain, and outcome
              standard — before enrolment, never after.
            </p>
            <div>
              <GoLink href="/the-academy">Visit the Academy</GoLink>
            </div>
          </EditorialPillar>
        </div>
      </Leaf>

      <Leaf>
        <div className="measure-wide">
          <EditorialPillar
            src="/photography/sacred-journeys-hero.jpg"
            alt="Pilgrims walking across the marble courtyard of the Prophet's Mosque in Madinah at dawn"
            caption="Sacred Journeys — educational pilgrimage with study before departure"
          >
            <p className="type-eyebrow" style={{ color: "var(--gilt)" }}>
              Sacred Journeys
            </p>
            <h3 className="type-display-l" style={{ margin: 0 }}>
              Embodiment through pilgrimage
            </h3>
            <p className="type-body-l">
              Educational travel ordered by purpose rather than itinerary.
              Preparation precedes departure. Every journey carries a reading
              list, a faculty companion, and a clear statement of difficulty
              before registration opens.
            </p>
            <div>
              <GoLink href="/sacred-journeys">Visit Sacred Journeys</GoLink>
            </div>
          </EditorialPillar>
        </div>
      </Leaf>

      {/* ———————————————————————————————————
          § 4  WHY TRUST SUNNAH REMEDIES
          Clinical standards. Scholarship. Quality.
          ——————————————————————————————————— */}
      <Leaf variant="inset">
        <div className="measure-wide">
          <SectionNumeral>III</SectionNumeral>
          <SectionLabel>Why trust Sunnah Remedies</SectionLabel>
          <h2
            className="type-display-l"
            style={{ textAlign: "center", margin: "0 auto var(--s6)", maxWidth: "var(--measure-reading)" }}
          >
            Every claim carries a grade and a source before it is published in
            the institution&apos;s name
          </h2>

          <div className="trust-grid">
            <TrustGridItem
              numeral="01"
              title="Primary-source scholarship"
              text="Every prophetic reference is graded, cited, and attributed to its scholarly chain. We publish the source — not a paraphrase."
            />
            <TrustGridItem
              numeral="02"
              title="Laboratory verification"
              text="All remedies undergo independent laboratory analysis. Certificates of analysis are available on request before dispensation."
            />
            <TrustGridItem
              numeral="03"
              title="Clinical governance"
              text="Practitioners are trained, assessed, and listed on the Register. Clinical protocols follow established safety standards."
            />
            <TrustGridItem
              numeral="04"
              title="Institutional transparency"
              text="Fees, limits, and conflicts of interest are stated plainly. The Founding Charter is publicly available for inspection."
            />
            <TrustGridItem
              numeral="05"
              title="Waqf model"
              text="The institution is structured for continuity — not exit. Revenue serves the mission. The house exists for the next generation, not this quarter."
            />
            <TrustGridItem
              numeral="06"
              title="Plain limits"
              text="We state what we do not know with the same care as what we do. Prophetic Medicine is a means — healing is from Allah alone."
            />
          </div>
        </div>
      </Leaf>

      {/* ———————————————————————————————————
          § 5  FEATURED REMEDIES
          Presented editorially. Not product cards.
          ——————————————————————————————————— */}
      <Leaf>
        <div className="measure-wide">
          <SectionNumeral>IV</SectionNumeral>
          <SectionLabel>From the Apothecary</SectionLabel>

          <EditorialFeature
            src="/photography/honey-editorial.jpg"
            alt="Golden honey being poured from a wooden dipper into a glass vessel, beside dried thyme and a handwritten provenance label"
          >
            <p className="type-eyebrow" style={{ color: "var(--gilt)" }}>
              Monograph
            </p>
            <h3 className="type-title" style={{ margin: 0 }}>
              Raw Sidr Honey
            </h3>
            <p className="type-body">
              Single-origin <em>Ziziphus spina-christi</em> honey, harvested
              from the Hadhrami highlands and verified to source. The Prophet
              ﷺ recommended honey as a remedy. We document origin, harvest
              season, laboratory analysis, and scholarly basis in every
              monograph — before dispensation.
            </p>
            <div>
              <GoLink href="/the-apothecary/honey">Read the monograph</GoLink>
            </div>
          </EditorialFeature>

          <EditorialFeature
            src="/photography/black-seed-editorial.jpg"
            alt="A scholar's research desk with an open botanical journal on Nigella sativa, pressed specimens, black seeds in a ceramic dish, and amber oil"
            reverse
          >
            <p className="type-eyebrow" style={{ color: "var(--gilt)" }}>
              Monograph
            </p>
            <h3 className="type-title" style={{ margin: 0 }}>
              Cold-Pressed Black Seed Oil
            </h3>
            <p className="type-body">
              <em>Nigella sativa</em> oil, cold-pressed from Ethiopian seeds
              and independently analysed for thymoquinone content. Described
              in <em>Sahih al-Bukhari</em> as &ldquo;a cure for everything
              except death.&rdquo; The monograph states what this means — and
              what it does not.
            </p>
            <div>
              <GoLink href="/the-apothecary/black-seed-oil">
                Read the monograph
              </GoLink>
            </div>
          </EditorialFeature>
        </div>
      </Leaf>

      {/* ———————————————————————————————————
          § 6  THE ACADEMY
          Show learning. Not selling.
          ——————————————————————————————————— */}
      <EditorialPhoto
        src="/photography/clinical-practice.jpg"
        alt="A clinical practitioner in a professional treatment room carefully preparing sterile cupping equipment"
        aspect="landscape"
        fullBleed
        caption="Clinical practice — a practitioner preparing sterile Hijama equipment in the treatment room"
      />

      <Leaf>
        <div className="measure-wide">
          <SectionNumeral>V</SectionNumeral>
          <SectionLabel>The Academy</SectionLabel>

          <div className="editorial-two-col">
            <div>
              <h2 className="type-display-l" style={{ margin: "0 0 var(--s4)" }}>
                Clinical education in Hijama and Prophetic therapeutics
              </h2>
              <p className="type-body-l">
                The Academy trains practitioners through structured clinical
                programmes assessed by independent examination. Faculty are
                listed by qualification and <em>isnad</em>. Graduates are
                entered on the Register and held to continuing professional
                standards.
              </p>
            </div>
            <div>
              <PullQuote
                text="The teacher is named before the subject. The chain is stated before the curriculum."
              />
              <div style={{ marginTop: "var(--s5)" }}>
                <GoLink href="/the-academy">Explore the Academy</GoLink>
              </div>
            </div>
          </div>
        </div>
      </Leaf>

      {/* ———————————————————————————————————
          § 7  KNOWLEDGE LIBRARY
          Featured publications.
          ——————————————————————————————————— */}
      <Leaf variant="inset">
        <div className="measure-wide">
          <SectionNumeral>VI</SectionNumeral>
          <SectionLabel>Knowledge Library</SectionLabel>
          <h2 className="type-display-l" style={{ margin: "0 0 var(--s4)" }}>
            The open shelf
          </h2>
          <p className="type-body-l measure" style={{ marginBottom: "var(--s5)" }}>
            The Knowledge Library is our publishing programme: monographs,
            research notes, patient guides, and materia medica — all graded,
            cited, and freely available. We share what we know, name what we
            do not, and invite correction.
          </p>
          <div>
            <GoLink href="/knowledge-library">
              Enter the Knowledge Library
            </GoLink>
          </div>
        </div>
      </Leaf>

      {/* ———————————————————————————————————
          § 8  SACRED JOURNEYS
          Beautiful imagery. Reflection. Brotherhood.
          ——————————————————————————————————— */}
      <EditorialPhoto
        src="/photography/sacred-journeys-hero.jpg"
        alt="Pilgrims approaching the Prophet's Mosque in Madinah at dawn, the green dome visible against an amber sky"
        aspect="landscape"
        fullBleed
        caption="Sacred Journeys — educational pilgrimage to the Holy Lands"
      />

      <Leaf>
        <div className="measure-wide">
          <SectionNumeral>VII</SectionNumeral>
          <SectionLabel>Sacred Journeys</SectionLabel>
          <div className="editorial-two-col">
            <div>
              <h2 className="type-display-l" style={{ margin: "0 0 var(--s4)" }}>
                Educational pilgrimage with purpose before itinerary
              </h2>
              <p className="type-body-l">
                Journeys to the Holy Lands, the olive groves of Palestine,
                and sites of scholarly heritage — each structured around
                study, reflection, and companionship rather than tourism.
                Preparation begins weeks before departure. A reading list
                and faculty companion accompany every group.
              </p>
            </div>
            <div>
              <PullQuote
                text="We travel to learn, not to see. The journey is inward before it is outward."
              />
              <div style={{ marginTop: "var(--s5)" }}>
                <GoLink href="/sacred-journeys">View departures</GoLink>
              </div>
            </div>
          </div>
        </div>
      </Leaf>

      {/* ———————————————————————————————————
          § 9  FOUNDING STATEMENT
          Mission. Vision. Values.
          ——————————————————————————————————— */}
      <Leaf variant="grave">
        <div className="measure-wide">
          <SectionNumeral>VIII</SectionNumeral>
          <div className="founding-statement">
            <p className="type-eyebrow" style={{ color: "var(--gilt-soft)", marginBottom: "var(--s4)" }}>
              Founding statement
            </p>
            <h2 className="type-display-l founding-statement__title" style={{ color: "var(--paper)" }}>
              Knowledge before commerce
            </h2>
            <div className="type-body-l founding-statement__body" style={{ color: "var(--paper-dim)" }}>
              <p>
                Healing is from Allah; the remedy is a means. The person
                precedes protocol. Beauty is an obligation. The institution
                exists to serve the next generation.
              </p>
              <p>
                We believe Prophetic Medicine deserves the same institutional
                rigour as any established medical discipline: verifiable
                scholarship, clinical accountability, transparent governance,
                and patient dignity at every encounter.
              </p>
            </div>
            <div style={{ marginTop: "var(--s5)" }}>
              <QuietLink href="/charter" dark>
                Read the Founding Charter
              </QuietLink>
            </div>
          </div>
        </div>
      </Leaf>

      {/* ———————————————————————————————————
          § 10  INVITATION
          ——————————————————————————————————— */}
      <Leaf>
        <div className="measure-wide">
          <SectionNumeral>IX</SectionNumeral>
          <EditorialInvitation
            title="Begin where you are"
            body="Whether you seek a remedy, wish to study, or are preparing for pilgrimage — the institution is open. Enter through any department and read before you act."
            actions={[
              { href: "/the-apothecary", label: "The Apothecary", primary: true },
              { href: "/the-academy", label: "The Academy" },
              { href: "/sacred-journeys", label: "Sacred Journeys" },
              { href: "/knowledge-library", label: "Knowledge Library" },
              { href: "/consultations", label: "Request a consultation" },
            ]}
          />
        </div>
      </Leaf>
    </>
  );
}
