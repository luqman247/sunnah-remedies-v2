/**
 * Sanity Presentation locations for Apothecary products.
 */

import { defineLocations } from "sanity/presentation";
import { productPublicPath } from "./product-preview";

export const productPresentationLocations = defineLocations({
  select: {
    title: "name",
    slug: "slug.current",
    language: "language",
  },
  resolve: (doc) => {
    const path = productPublicPath({
      slug: doc?.slug,
      language: doc?.language,
    });
    if (!path) {
      return { locations: [] };
    }
    return {
      locations: [
        {
          title: doc?.title || "Product monograph",
          href: path,
        },
      ],
    };
  },
});
