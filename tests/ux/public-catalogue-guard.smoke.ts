/**
 * Public catalogue product guard — run with:
 * node --import tsx tests/ux/public-catalogue-guard.smoke.ts
 */
import assert from "node:assert/strict";
import {
  filterPublicCatalogueProducts,
  isPublicCatalogueProduct,
} from "../../src/lib/commerce/public-product-guard";

assert.equal(
  isPublicCatalogueProduct({
    slug: "apothecary-verification-product",
    name: "Apothecary Verification Product — Do Not Buy",
  }),
  false,
);

assert.equal(
  isPublicCatalogueProduct({
    slug: "black-seed-oil",
    name: "Black Seed Oil",
  }),
  true,
);

const filtered = filterPublicCatalogueProducts([
  { slug: "honey", name: "Honey" },
  { slug: "apothecary-verification-product", name: "Do Not Buy" },
  { slug: "olive-oil", name: "Olive Oil" },
]);

assert.deepEqual(
  filtered.map((p) => p.slug),
  ["honey", "olive-oil"],
);

console.log("public-catalogue-guard.smoke.ts: ok");
