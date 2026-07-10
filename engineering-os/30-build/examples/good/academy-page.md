# Good Example — Academy Page

## Purpose

Demonstrates a well-structured Academy landing page that composes existing design-system primitives, pulls all content from the CMS, and renders quickly with correct SEO and accessibility.

This is the reference for any content-driven marketing or catalogue page.

---

# Why This Is a Good Example

- Every word of copy, every course, and every testimonial comes from Sanity.
- The page composes existing components; it introduces no new primitives.
- Server components fetch data; client components handle only interactivity.
- Structured data (schema.org `Course`) is emitted for search and answer engines.
- The page has a single, clear responsibility: present the Academy.

---

# Page Composition

AcademyPage (server component)

↓

Hero (existing primitive) — heading + intro from CMS

↓

CourseGrid — maps CMS courses to existing CourseCard

↓

InstructorList — maps CMS instructors to existing PersonCard

↓

TestimonialCarousel (client component) — CMS testimonials

↓

CTASection (existing primitive) — CMS call to action

No component here is new. Each is reused from the design system.

---

# Data Fetching (server-side)

```tsx
// app/academy/page.tsx (illustrative)
export default async function AcademyPage() {
  const data = await sanityFetch<AcademyPageData>({ query: academyPageQuery });
  return (
    <>
      <Hero title={data.hero.title} intro={data.hero.intro} />
      <CourseGrid courses={data.courses} />
      <InstructorList people={data.instructors} />
      <TestimonialCarousel items={data.testimonials} />
      <CTASection {...data.cta} />
    </>
  );
}
```

Data is fetched once, server-side. The client ships only the carousel's interactivity.

---

# SEO and Answer-Engine Optimisation

```tsx
export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityFetch<AcademyMeta>({ query: academyMetaQuery });
  return {
    title: data.seoTitle,
    description: data.seoDescription,
    openGraph: { images: [data.ogImage] },
  };
}
```

Each course additionally emits `schema.org/Course` structured data so it can be surfaced by search and answer engines.

---

# Acceptance Criteria

- [ ] All copy, courses, instructors, and testimonials are CMS-editable without deployment.
- [ ] No new component primitives are introduced; the page composes existing ones.
- [ ] Data is fetched in a server component; only interactivity ships to the client.
- [ ] Metadata and `schema.org/Course` structured data are present and valid.
- [ ] The page passes accessibility checks (headings, landmarks, alt text).
- [ ] Largest Contentful Paint stays within the performance budget.

---

# Related Anti-pattern

See `examples/bad/hardcoded-products.md` and `examples/bad/large-component.md`.

→ **Do this instead:** compose small existing primitives and drive every value from the CMS.

---

# Related Documents

- Sanity Workflow
- SEO and AEO Standards
- Performance Checklist
- Accessibility Checklist

---

## Document Metadata

**Document Type:** Example (Good)
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Annual
