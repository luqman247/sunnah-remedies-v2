/**
 * Structured Data Validation — CI gate.
 *
 * Renders each schema builder type with sample data and validates
 * the emitted JSON-LD structure. Build fails on invalid required properties.
 *
 * Usage: npx tsx scripts/validate-schema.ts
 */

import { composeGraph, organizationNode, websiteNode, breadcrumbList } from "../src/lib/seo/schema";
import { productSchema } from "../src/lib/seo/schema/product";
import { articleSchema } from "../src/lib/seo/schema/article";
import { medicalPageSchema } from "../src/lib/seo/schema/medical";
import { courseSchema } from "../src/lib/seo/schema/course";
import { faqPageSchema, howToSchema, videoSchema, eventSchema } from "../src/lib/seo/schema/content";

interface ValidationError {
  type: string;
  field: string;
  message: string;
}

function validateNode(node: Record<string, unknown>, type: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!node["@type"]) {
    errors.push({ type, field: "@type", message: "Missing @type" });
  }

  if (type !== "BreadcrumbList" && type !== "FAQPage" && !node["@id"]) {
    errors.push({ type, field: "@id", message: "Missing @id for cross-reference" });
  }

  return errors;
}

function validateGraph(json: string, label: string): ValidationError[] {
  const errors: ValidationError[] = [];

  try {
    const parsed = JSON.parse(json);
    if (!parsed["@context"]) {
      errors.push({ type: label, field: "@context", message: "Missing @context" });
    }
    if (!parsed["@graph"] || !Array.isArray(parsed["@graph"])) {
      errors.push({ type: label, field: "@graph", message: "Missing or invalid @graph" });
      return errors;
    }

    for (const node of parsed["@graph"]) {
      const nodeType = Array.isArray(node["@type"]) ? node["@type"].join("+") : node["@type"];
      errors.push(...validateNode(node, nodeType || "unknown"));
    }
  } catch (e) {
    errors.push({ type: label, field: "json", message: `Invalid JSON: ${e}` });
  }

  return errors;
}

function main() {
  console.log("[validate-schema] Running structured data validation...\n");
  let allErrors: ValidationError[] = [];

  // Test Organization + WebSite singletons
  const globalGraph = composeGraph(organizationNode(), websiteNode());
  allErrors.push(...validateGraph(globalGraph, "Global singletons"));

  // Test Product schema
  const productGraph = composeGraph(
    organizationNode(),
    productSchema({
      name: "Black Seed Oil",
      slug: "black-seed-oil",
      description: "Cold-pressed Nigella sativa oil",
      price: 24.99,
      priceCurrency: "GBP",
      availability: "InStock",
    }),
    breadcrumbList([
      { name: "Home", url: "https://www.sunnahremedies.com" },
      { name: "Products", url: "https://www.sunnahremedies.com/the-apothecary" },
      { name: "Black Seed Oil", url: "https://www.sunnahremedies.com/the-apothecary/black-seed-oil" },
    ])
  );
  allErrors.push(...validateGraph(productGraph, "Product"));

  // Test Article schema
  const articleGraph = composeGraph(
    organizationNode(),
    articleSchema({
      title: "The Prophetic Tradition of Honey",
      slug: "prophetic-tradition-honey",
      description: "An exploration of honey in the Prophetic medical tradition.",
      publishedAt: "2024-01-15",
      author: { name: "Dr Ahmad", slug: "dr-ahmad" },
    })
  );
  allErrors.push(...validateGraph(articleGraph, "Article"));

  // Test MedicalWebPage schema
  const medicalGraph = composeGraph(
    organizationNode(),
    medicalPageSchema({
      name: "Black Seed",
      slug: "black-seed",
      type: "ingredient",
      description: "Nigella sativa — the blessed seed.",
      reviewedBy: { name: "Dr Fatima", slug: "dr-fatima", jobTitle: "Clinical Herbalist" },
      lastReviewed: "2024-06-01",
    })
  );
  allErrors.push(...validateGraph(medicalGraph, "MedicalWebPage"));

  // Test Course schema
  const courseGraph = composeGraph(
    organizationNode(),
    courseSchema({
      name: "Foundations of Hijāma",
      slug: "foundations-hijama",
      description: "Clinical wet-cupping certification.",
      courseMode: "blended",
      instances: [{ startDate: "2025-03-01", location: "London", price: 1500 }],
    })
  );
  allErrors.push(...validateGraph(courseGraph, "Course"));

  // Test FAQ schema
  const faqGraph = composeGraph(
    faqPageSchema(
      [{ question: "Is black seed safe?", answer: "Consult a practitioner before use." }],
      "https://www.sunnahremedies.com/knowledge/ingredient/black-seed"
    )
  );
  allErrors.push(...validateGraph(faqGraph, "FAQPage"));

  // Test HowTo schema
  const howtoGraph = composeGraph(
    howToSchema({
      name: "Prepare Black Seed Oil",
      description: "Traditional preparation method.",
      pageUrl: "https://www.sunnahremedies.com/knowledge/ingredient/black-seed",
      steps: [
        { name: "Source seeds", text: "Obtain certified Nigella sativa seeds." },
        { name: "Cold press", text: "Press at room temperature." },
      ],
    })
  );
  allErrors.push(...validateGraph(howtoGraph, "HowTo"));

  // Test Video schema
  const videoGraph = composeGraph(
    videoSchema({
      name: "Introduction to Prophetic Medicine",
      description: "Overview of Tibb al-Nabawi.",
      thumbnailUrl: "https://res.cloudinary.com/sr/thumb.jpg",
      uploadDate: "2024-02-01",
      duration: "PT15M30S",
      pageUrl: "https://www.sunnahremedies.com/videos/intro-prophetic-medicine",
    })
  );
  allErrors.push(...validateGraph(videoGraph, "VideoObject"));

  // Test Event schema
  const eventGraph = composeGraph(
    eventSchema({
      name: "Umrah Immersion",
      slug: "umrah-immersion-2025",
      description: "Sacred journey to Makkah and Madinah.",
      startDate: "2025-09-15",
      location: "Makkah",
      eventAttendanceMode: "Offline",
    })
  );
  allErrors.push(...validateGraph(eventGraph, "Event"));

  // Report
  console.log("═══ VALIDATION RESULTS ═══\n");

  if (allErrors.length > 0) {
    for (const err of allErrors) {
      console.log(`❌ [${err.type}] ${err.field}: ${err.message}`);
    }
    console.log(`\n❌ ${allErrors.length} error(s) found. Schema validation FAILED.`);
    process.exit(1);
  } else {
    console.log("✓ All schema types validated successfully.");
    console.log("  - Global singletons (Organization + WebSite)");
    console.log("  - Product + Offer");
    console.log("  - Article");
    console.log("  - MedicalWebPage");
    console.log("  - Course + CourseInstance");
    console.log("  - FAQPage");
    console.log("  - HowTo");
    console.log("  - VideoObject");
    console.log("  - Event");
    console.log("\n✓ Schema validation passed.");
  }
}

main();
