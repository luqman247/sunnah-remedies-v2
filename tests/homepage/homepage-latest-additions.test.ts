/**
 * Homepage Latest additions — publication gate, ordering, locale, routing,
 * and zero-CMS-item behaviour tests.
 *
 * Run:
 *   npx tsx --test tests/homepage/homepage-latest-additions.test.ts
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import en from "../../src/messages/en.json";
import da from "../../src/messages/da.json";
import {
  HOMEPAGE_HIGHLIGHTS_MAX,
  isHomepageHighlightEligible,
  normalizeInternalPathname,
  selectHomepageHighlights,
  type HomepageHighlightCandidate,
} from "../../src/lib/homepage/highlights";
import { localeById } from "../../src/i18n/locales";
import { DUA_DHIKR_HIGHLIGHT_HREF } from "../../scripts/homepage-highlight-seed-data";

const REPO_ROOT = join(__dirname, "../..");
const NOW = new Date("2026-07-18T18:00:00.000Z");

function baseCandidate(
  overrides: Partial<HomepageHighlightCandidate> = {},
): HomepageHighlightCandidate {
  return {
    id: "highlight-1",
    enabled: true,
    eyebrow: "NEW IN THE KNOWLEDGE LIBRARY",
    title: "Duʿā & Dhikr",
    summary: "A carefully reviewed library of remembrances",
    imageUrl: "https://cdn.sanity.io/images/example.jpg",
    imageAlt: "Warm editorial still life for remembrance",
    pathname: "/knowledge-library/dua-dhikr",
    contentArea: "knowledge-library",
    publishedAt: "2026-07-18T12:00:00.000Z",
    pinned: false,
    priority: 50,
    showNewMarker: true,
    visualTheme: "none",
    ...overrides,
  };
}

describe("normalizeInternalPathname", () => {
  it("keeps unprefixed English paths and query/hash", () => {
    assert.equal(
      normalizeInternalPathname("/knowledge-library/dua-dhikr"),
      "/knowledge-library/dua-dhikr",
    );
    assert.equal(
      normalizeInternalPathname("/knowledge-library/dua-dhikr?ref=home#begin"),
      "/knowledge-library/dua-dhikr?ref=home#begin",
    );
  });

  it("rejects locale prefixes and absolute URLs", () => {
    assert.equal(normalizeInternalPathname("/en/knowledge-library"), null);
    assert.equal(normalizeInternalPathname("/dk/knowledge-library"), null);
    assert.equal(normalizeInternalPathname("/da/knowledge-library"), null);
    assert.equal(normalizeInternalPathname("https://example.com/x"), null);
    assert.equal(normalizeInternalPathname(""), null);
  });
});

describe("publication gate", () => {
  it("excludes disabled highlights", () => {
    assert.equal(
      selectHomepageHighlights([baseCandidate({ enabled: false })], {
        now: NOW,
      }).length,
      0,
    );
  });

  it("excludes draft ids", () => {
    assert.equal(
      selectHomepageHighlights([baseCandidate({ id: "drafts.highlight-1" })], {
        now: NOW,
      }).length,
      0,
    );
    assert.equal(
      isHomepageHighlightEligible(baseCandidate({ id: "drafts.x" }), NOW),
      false,
    );
  });

  it("excludes future displayFrom dates", () => {
    assert.equal(
      selectHomepageHighlights(
        [baseCandidate({ displayFrom: "2026-08-01T00:00:00.000Z" })],
        { now: NOW },
      ).length,
      0,
    );
  });

  it("excludes expired displayUntil dates", () => {
    assert.equal(
      selectHomepageHighlights(
        [baseCandidate({ displayUntil: "2026-07-01T00:00:00.000Z" })],
        { now: NOW },
      ).length,
      0,
    );
  });

  it("excludes incomplete locale copy and missing destinations", () => {
    assert.equal(
      selectHomepageHighlights([baseCandidate({ title: "" })], { now: NOW })
        .length,
      0,
    );
    assert.equal(
      selectHomepageHighlights([baseCandidate({ pathname: "/dk/foo" })], {
        now: NOW,
      }).length,
      0,
    );
    assert.equal(
      selectHomepageHighlights(
        [
          baseCandidate({
            imageUrl: "https://cdn.sanity.io/x.jpg",
            imageAlt: "",
          }),
        ],
        { now: NOW },
      ).length,
      0,
    );
    assert.equal(
      selectHomepageHighlights(
        [baseCandidate({ imageUrl: null, visualTheme: "none" })],
        {
          now: NOW,
        },
      ).length,
      0,
    );
  });

  it("allows brand-safe visual theme without photography", () => {
    const result = selectHomepageHighlights(
      [
        baseCandidate({
          imageUrl: null,
          imageAlt: "Motif for Duʿā & Dhikr",
          visualTheme: "dua-dhikr",
        }),
      ],
      { now: NOW },
    );
    assert.equal(result.length, 1);
    assert.equal(result[0].visualTheme, "dua-dhikr");
  });
});

describe("ordering and limits", () => {
  it("orders by pinned, then priority, then newest publishedAt", () => {
    const result = selectHomepageHighlights(
      [
        baseCandidate({
          id: "a",
          title: "Older high priority",
          pinned: false,
          priority: 90,
          publishedAt: "2026-01-01T00:00:00.000Z",
          pathname: "/a",
        }),
        baseCandidate({
          id: "b",
          title: "Pinned lower priority",
          pinned: true,
          priority: 10,
          publishedAt: "2026-02-01T00:00:00.000Z",
          pathname: "/b",
        }),
        baseCandidate({
          id: "c",
          title: "Newest unpinned",
          pinned: false,
          priority: 20,
          publishedAt: "2026-07-17T00:00:00.000Z",
          pathname: "/c",
        }),
      ],
      { now: NOW },
    );
    assert.deepEqual(
      result.map((item) => item.id),
      ["b", "a", "c"],
    );
  });

  it("caps at the maximum and removes duplicates", () => {
    const many = Array.from({ length: 10 }, (_, index) =>
      baseCandidate({
        id: `h-${index}`,
        title: `Title ${index}`,
        pathname: `/item-${index}`,
        priority: index,
        publishedAt: `2026-07-${String(index + 1).padStart(2, "0")}T00:00:00.000Z`,
      }),
    );
    many.push(
      baseCandidate({
        id: "dup",
        title: "Title 9",
        pathname: "/item-9",
        priority: 999,
      }),
    );
    const result = selectHomepageHighlights(many, { now: NOW });
    assert.equal(result.length, HOMEPAGE_HIGHLIGHTS_MAX);
    assert.equal(result.filter((item) => item.href === "/item-9").length, 1);
  });

  it("returns zero, one, and multiple item behaviours", () => {
    assert.equal(selectHomepageHighlights([], { now: NOW }).length, 0);
    assert.equal(
      selectHomepageHighlights([baseCandidate()], { now: NOW }).length,
      1,
    );
    assert.equal(
      selectHomepageHighlights(
        [
          baseCandidate({ id: "1", pathname: "/one" }),
          baseCandidate({ id: "2", title: "Two", pathname: "/two" }),
          baseCandidate({ id: "3", title: "Three", pathname: "/three" }),
        ],
        { now: NOW },
      ).length,
      3,
    );
  });
});

describe("zero CMS highlights omit the section", () => {
  it("returns an empty list when CMS candidates are empty — seed utilities must not restore content", () => {
    const selected = selectHomepageHighlights([], { now: NOW });
    assert.equal(selected.length, 0);

    const fetchSource = readFileSync(
      join(REPO_ROOT, "src/lib/homepage/get-homepage-highlights.ts"),
      "utf-8",
    );
    assert.equal(
      fetchSource.includes("getCuratedHomepageHighlightCandidates"),
      false,
    );
    assert.equal(fetchSource.includes("initial-highlights"), false);
    assert.equal(fetchSource.includes("getCurated"), false);
    assert.match(fetchSource, /selectHomepageHighlights\(/);
    assert.match(fetchSource, /await fetchCmsHighlightCandidates\(/);
    assert.equal(
      /getCurated|initial-highlights|seed-data/.test(fetchSource),
      false,
    );

    const page = readFileSync(
      join(REPO_ROOT, "src/app/[locale]/page.tsx"),
      "utf-8",
    );
    assert.equal(page.includes("getCuratedHomepageHighlightCandidates"), false);
    assert.equal(page.includes("initial-highlights"), false);

    const section = readFileSync(
      join(REPO_ROOT, "src/components/arrival/HomepageLatestAdditions.tsx"),
      "utf-8",
    );
    assert.match(section, /if \(highlights\.length === 0\) return null/);
  });

  it("keeps seed data outside the runtime src tree", () => {
    assert.equal(
      existsSync(join(REPO_ROOT, "src/lib/homepage/initial-highlights.ts")),
      false,
    );
    assert.equal(
      existsSync(join(REPO_ROOT, "scripts/homepage-highlight-seed-data.ts")),
      true,
    );
    assert.equal(
      existsSync(join(REPO_ROOT, "scripts/seed-homepage-highlights.ts")),
      true,
    );

    const seed = readFileSync(
      join(REPO_ROOT, "scripts/seed-homepage-highlights.ts"),
      "utf-8",
    );
    assert.match(seed, /CONFIRM_SANITY_DATASET/);
    assert.match(seed, /--dry-run/);
    assert.equal(seed.includes('from "../src/lib/homepage'), false);
    // Force overwrite must patch copy only — never wipe editorial photography.
    assert.match(seed, /image field left untouched/);
    assert.match(seed, /\.patch\(payload\.id\)\.set\(fields\)/);
    assert.equal(/\bimage:\s/.test(seed.split("const fields")[1] || ""), false);
  });

  it("delivers highlight images through Sanity urlFor with crop, not local paths", () => {
    const fetchSource = readFileSync(
      join(REPO_ROOT, "src/lib/homepage/get-homepage-highlights.ts"),
      "utf-8",
    );
    const section = readFileSync(
      join(REPO_ROOT, "src/components/arrival/HomepageLatestAdditions.tsx"),
      "utf-8",
    );
    assert.match(fetchSource, /resolveMediaUrl/);
    assert.match(fetchSource, /fit:\s*"crop"/);
    assert.match(fetchSource, /hotspotToObjectPosition/);
    assert.equal(fetchSource.includes("scripts/assets"), false);
    assert.equal(section.includes("scripts/assets"), false);
    assert.equal(section.includes("/photography/dua"), false);
    assert.match(section, /fetchPriority="low"/);
    assert.match(section, /loading="lazy"/);
  });
});

describe("Duʿā & Dhikr destination and seed constants", () => {
  it("resolves English without /en and Danish with one /dk", () => {
    const href = DUA_DHIKR_HIGHLIGHT_HREF;
    const enPath = `${localeById("en").prefix}${href}` || href;
    const daPath = `${localeById("da").prefix}${href}`;
    assert.equal(enPath, "/knowledge-library/dua-dhikr");
    assert.equal(daPath, "/dk/knowledge-library/dua-dhikr");
    assert.equal(enPath.includes("/en"), false);
    assert.equal((daPath.match(/\/dk/g) || []).length, 1);
  });
});

describe("localisation message parity", () => {
  it("keeps latestAdditions keys aligned in English and Danish", () => {
    const enKeys = Object.keys(en.homepage.latestAdditions).sort();
    const daKeys = Object.keys(da.homepage.latestAdditions).sort();
    assert.deepEqual(enKeys, daKeys);
    const enAreas = Object.keys(en.homepage.latestAdditions.contentArea).sort();
    const daAreas = Object.keys(da.homepage.latestAdditions.contentArea).sort();
    assert.deepEqual(enAreas, daAreas);
    assert.equal(
      en.homepage.latestAdditions.heading,
      "New from Sunnah Remedies",
    );
    assert.equal(
      da.homepage.latestAdditions.heading,
      "Nyt fra Sunnah Remedies",
    );
  });
});

describe("implementation safeguards", () => {
  it("does not implement autoplay and keeps accessible controls", () => {
    const railPath = join(
      REPO_ROOT,
      "src/components/arrival/LatestAdditionsRail.tsx",
    );
    const sectionPath = join(
      REPO_ROOT,
      "src/components/arrival/HomepageLatestAdditions.tsx",
    );
    const schemaPath = join(
      REPO_ROOT,
      "src/sanity/schemas/documents/pages/homepage-highlight.ts",
    );
    assert.equal(existsSync(railPath), true);
    assert.equal(existsSync(sectionPath), true);
    assert.equal(existsSync(schemaPath), true);

    const rail = readFileSync(railPath, "utf-8");
    const section = readFileSync(sectionPath, "utf-8");
    assert.equal(rail.includes("setInterval"), false);
    assert.equal(rail.includes("autoplay"), true);
    assert.equal(rail.includes('data-autoplay="false"'), true);
    assert.match(rail, /previousLabel/);
    assert.match(rail, /nextLabel/);
    assert.match(section, /aria-labelledby="latest-additions-heading"/);
    assert.match(section, /role="img"/);
    assert.match(section, /imageAlt/);
    // Title and CTA are sibling links — not nested inside one parent <a>
    assert.equal(
      section.includes("<a") && section.includes("latest-additions__card>"),
      false,
    );
    assert.match(section, /latest-additions__title-link/);
    assert.match(section, /latest-additions__cta/);
  });

  it("wires the homepage section immediately after the hero, before the threshold plate", () => {
    const page = readFileSync(
      join(REPO_ROOT, "src/app/[locale]/page.tsx"),
      "utf-8",
    );
    const heroIndex = page.indexOf("ARRIVAL / HERO");
    const latestIndex = page.indexOf("LATEST ADDITIONS");
    const thresholdIndex = page.indexOf("THRESHOLD PLATE");
    const departmentsIndex = page.indexOf('id="departments"');
    assert.ok(heroIndex > 0);
    assert.ok(latestIndex > heroIndex);
    assert.ok(thresholdIndex > latestIndex);
    assert.ok(departmentsIndex > thresholdIndex);
    assert.match(page, /HomepageLatestAdditions/);
  });
});
