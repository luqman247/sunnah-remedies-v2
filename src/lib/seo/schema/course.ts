/**
 * Course + CourseInstance JSON-LD builder.
 */

import { seoConfig } from "../config";
import { type JsonLdNode, orgRef } from "./index";

export interface CourseSchemaInput {
  name: string;
  slug: string;
  description: string;
  image?: string;
  courseMode?: "online" | "onsite" | "blended";
  courseWorkload?: string;
  level?: string;
  instances?: {
    startDate?: string;
    endDate?: string;
    location?: string;
    price?: number;
    priceCurrency?: string;
  }[];
}

export function courseSchema(input: CourseSchemaInput): JsonLdNode {
  const url = `${seoConfig.siteUrl}/the-academy/${input.slug}`;

  const node: JsonLdNode = {
    "@type": "Course",
    "@id": `${url}#course`,
    name: input.name,
    description: input.description,
    url,
    provider: orgRef(),
  };

  if (input.image) node.image = input.image;
  if (input.courseWorkload) node.courseWorkload = input.courseWorkload;
  if (input.level) node.educationalLevel = input.level;

  if (input.instances && input.instances.length > 0) {
    node.hasCourseInstance = input.instances.map((inst) => {
      const instance: JsonLdNode = {
        "@type": "CourseInstance",
        courseMode: input.courseMode || "blended",
      };
      if (inst.startDate) instance.startDate = inst.startDate;
      if (inst.endDate) instance.endDate = inst.endDate;
      if (inst.location) {
        instance.location = {
          "@type": "Place",
          name: inst.location,
        };
      }
      if (inst.price !== undefined) {
        instance.offers = {
          "@type": "Offer",
          price: inst.price,
          priceCurrency: inst.priceCurrency || "GBP",
          availability: "https://schema.org/InStock",
        };
      }
      return instance;
    });
  }

  return node;
}
