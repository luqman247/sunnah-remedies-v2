import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import {
  FOUNDING_COVENANT_COMMITMENT_IDS,
  FOUNDING_COVENANT_TRIAD,
} from "../../src/lib/content/founding-covenant";
import en from "../../src/messages/en.json";
import da from "../../src/messages/da.json";

describe("founding covenant homepage content", () => {
  it("exposes five charter commitments in stable order", () => {
    assert.deepEqual([...FOUNDING_COVENANT_COMMITMENT_IDS], [
      "healing",
      "foundation",
      "fear",
      "person",
      "trust",
    ]);
  });

  it("keeps the institutional triad wording", () => {
    assert.deepEqual([...FOUNDING_COVENANT_TRIAD], [
      "Knowledge before products",
      "Service before profit",
      "Trust before growth",
    ]);
  });

  it("keeps the approved Mission and Vision wording unchanged", () => {
    assert.equal(
      en.homepage.foundingCovenant.mission,
      "To make authentic Prophetic Medicine accessible through responsible scholarship, compassionate clinical care, professional education and carefully governed natural therapeutics — delivered with integrity, clarity and respect for every individual",
    );
    assert.equal(
      en.homepage.foundingCovenant.vision,
      "To become a trusted international institution for Prophetic Medicine: preserving its authentic tradition, raising standards of practice and building an enduring body of clinical care, education and knowledge that can serve generations",
    );
  });

  it("places Mission and Vision before Tradition without duplicating either block", () => {
    const page = readFileSync(
      resolve("src/app/[locale]/page.tsx"),
      "utf8",
    );
    const covenant = readFileSync(
      resolve("src/components/arrival/FoundingCovenant.tsx"),
      "utf8",
    );
    const missionIndex = page.indexOf("institutional-purpose");
    const traditionIndex = page.indexOf("arrival-tradition");
    const tasksIndex = page.indexOf("<TaskPathways");

    assert.ok(missionIndex > 0);
    assert.ok(traditionIndex > missionIndex);
    assert.ok(tasksIndex > traditionIndex);
    assert.equal(page.match(/foundingCovenant\.mission"\)/g)?.length, 1);
    assert.equal(page.match(/aria-labelledby="tradition-heading"/g)?.length, 1);
    assert.doesNotMatch(covenant, /t\("mission"\)|t\("vision"\)/);
  });

  it("provides matching EN/DA message keys for the homepage section", () => {
    const enC = en.homepage.foundingCovenant;
    const daC = da.homepage.foundingCovenant;

    assert.equal(enC.eyebrow, "THE FOUNDING COVENANT");
    assert.equal(enC.cta, "Read the complete Founding Charter");
    assert.ok(enC.mission.includes("Prophetic Medicine"));
    assert.ok(enC.vision.includes("trusted international institution"));
    assert.equal(enC.commitments.healing.title, "Healing belongs to Allah");
    assert.equal(
      enC.commitments.fear.title,
      "We do not trade in fear",
    );

    for (const id of FOUNDING_COVENANT_COMMITMENT_IDS) {
      assert.ok(enC.commitments[id].title.length > 0);
      assert.ok(enC.commitments[id].body.length > 0);
      assert.ok(daC.commitments[id].title.length > 0);
      assert.ok(daC.commitments[id].body.length > 0);
    }

    assert.equal(enC.triad0, FOUNDING_COVENANT_TRIAD[0]);
    assert.equal(enC.triad1, FOUNDING_COVENANT_TRIAD[1]);
    assert.equal(enC.triad2, FOUNDING_COVENANT_TRIAD[2]);
  });

  it("does not end visible copy with a trailing full stop", () => {
    const enC = en.homepage.foundingCovenant;
    const strings: string[] = [
      enC.eyebrow,
      enC.heading,
      enC.introHeading,
      enC.intro0,
      enC.intro1,
      enC.introLead,
      enC.triad0,
      enC.triad1,
      enC.triad2,
      enC.mission,
      enC.vision,
      enC.closing,
      enC.cta,
      ...FOUNDING_COVENANT_COMMITMENT_IDS.flatMap((id) => [
        enC.commitments[id].title,
        enC.commitments[id].body,
      ]),
    ];

    for (const value of strings) {
      assert.notEqual(value.slice(-1), ".", `trailing period in: ${value}`);
    }
  });
});
