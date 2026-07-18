/**
 * Duʿa & Dhikr — collection publication-status source of truth.
 *
 * Run: node --import tsx tests/dua-dhikr/dua-dhikr-publication-status.test.ts
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  isDuaDhikrCollectionPublished,
  resolveDuaDhikrCollectionPublicationState,
} from "../../src/lib/dua-dhikr/publication-status";

assert.equal(resolveDuaDhikrCollectionPublicationState(0), "in-preparation");
assert.equal(resolveDuaDhikrCollectionPublicationState(1), "published");
assert.equal(resolveDuaDhikrCollectionPublicationState(12), "published");

assert.equal(
  isDuaDhikrCollectionPublished({ publicationState: "published" }),
  true,
);
assert.equal(
  isDuaDhikrCollectionPublished({ publicationState: "in-preparation" }),
  false,
);

const fetchSource = readFileSync(
  join(__dirname, "../../src/sanity/lib/dua-dhikr-public-fetch.ts"),
  "utf-8",
);
assert.match(
  fetchSource,
  /getMorningDhikrItemsPublic/,
  "Morning Dhikr gate must feed morning-dhikr collection status",
);
assert.match(
  fetchSource,
  /getEveningDhikrItemsPublic/,
  "Evening Dhikr gate must feed evening-dhikr collection status",
);
assert.match(
  fetchSource,
  /publicationState/,
  "collections must expose publicationState from the shared resolver",
);

const landingSource = readFileSync(
  join(
    __dirname,
    "../../src/app/[locale]/knowledge-library/dua-dhikr/page.tsx",
  ),
  "utf-8",
);
assert.match(
  landingSource,
  /assurance/,
  "landing must retain a restrained editorial assurance note",
);
assert.doesNotMatch(
  landingSource,
  /forthcomingCollections|forcePreparing/,
  "landing must not expose unpublished collections as a preparation card grid",
);
assert.match(
  landingSource,
  /publishedCollections/,
  "primary navigation must use published collections only",
);
assert.doesNotMatch(
  landingSource,
  /always renders — collections are structural/,
  "landing must not treat empty taxonomy as primary navigation",
);

console.log("dua-dhikr-publication-status.test.ts: ok");
