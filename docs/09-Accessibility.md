# 09 — Accessibility

## Commitment

Sunnah Remedies is committed to making its digital platform accessible to all people, regardless of ability. Accessibility is not an afterthought — it is an institutional obligation consistent with the principle that the person precedes protocol.

The platform targets WCAG 2.2 Level AA conformance.

---

## Standards

| Standard | Level | Status |
|---|---|---|
| WCAG 2.2 | AA | Target |
| Section 508 | Compliant | Target |
| EN 301 549 | Compliant | Target |

---

## Perceivable

### Text Alternatives

- Every image has meaningful alt text (see Photography Manual § Alt Text Standards)
- Decorative images use `aria-hidden="true"` or empty `alt=""`
- Complex images (charts, diagrams) include long descriptions
- Icon-only elements have `aria-label`

### Time-Based Media

- Videos will include captions when video content is added
- No auto-playing media
- No content that flashes more than three times per second

### Adaptable

- Content structure conveyed through semantic HTML
- Heading hierarchy maintained (h1 → h2 → h3)
- Lists marked up as `<ul>`, `<ol>`, `<dl>` appropriately
- Tables include proper `<th>` and scope attributes
- Reading order matches visual order

### Distinguishable

- Text contrast ratio minimum 4.5:1 (body text)
- Large text contrast ratio minimum 3:1
- No information conveyed by colour alone
- Text resizable to 200% without loss of content
- No horizontal scrolling at 320px viewport width

#### Colour Contrast Verification

| Combination | Ratio | Pass |
|---|---|---|
| Ink on Ivory (`#1a1a1a` on `#F6F3EE`) | 15.2:1 | AA |
| Deep Emerald on Ivory (`#0E3B2E` on `#F6F3EE`) | 11.8:1 | AA |
| Ivory on Deep Emerald (`#F6F3EE` on `#0E3B2E`) | 11.8:1 | AA |
| Gold on Ivory (`#C7A25A` on `#F6F3EE`) | 2.8:1 | Decorative only |
| Gold on Emerald (`#C7A25A` on `#0E3B2E`) | 4.2:1 | Large text only |

Note: Antique Gold is used only for decorative labels and eyebrows at large size, never for essential information at body text size.

---

## Operable

### Keyboard

- All interactive elements reachable by keyboard
- Visible focus indicators on all focusable elements
- No keyboard traps
- Skip-to-content link provided
- Mobile navigation panel: focus trapped when open, Escape to close
- Tab order follows logical reading order

### Timing

- No time limits on content reading
- No auto-advancing content
- No session timeouts on public pages

### Navigation

- Multiple ways to find content (navigation, search future, sitemap)
- Consistent navigation across pages
- Descriptive link text (no "click here" or "read more" without context)
- Current page indicated in navigation

### Motion

- No animation that cannot be paused
- Respects `prefers-reduced-motion` media query
- Existing motion (hover transitions) is minimal and non-essential

---

## Understandable

### Readable

- Page language declared: `lang="en"`
- Arabic text marked with `lang="ar"` and `dir="rtl"`
- Abbreviations expanded on first use
- Reading level appropriate for educated general audience

### Predictable

- Navigation consistent across all pages
- No unexpected context changes
- Form submission only on explicit user action
- No automatic page redirects

### Input Assistance

- Form fields have visible labels
- Required fields clearly indicated
- Error messages specific and helpful
- Errors associated with their fields via `aria-describedby`

---

## Robust

### Compatibility

- Valid, semantic HTML5
- ARIA used only when native HTML is insufficient
- Custom components tested with screen readers
- No reliance on JavaScript for content access
- Progressive enhancement: content readable without JS

### ARIA Usage

| Pattern | Implementation |
|---|---|
| Navigation | `<nav aria-label="Primary">` |
| Mobile menu | `role="dialog"`, `aria-modal="true"` |
| Menu button | `aria-expanded`, `aria-controls` |
| Decorative dividers | `aria-hidden="true"` |
| Section labels | Semantic headings, not ARIA labels |

---

## Implementation Checklist

### Page-Level

- [ ] One `<h1>` per page
- [ ] Logical heading hierarchy
- [ ] Language attribute on `<html>`
- [ ] Page title unique and descriptive
- [ ] Skip-to-content link
- [ ] Landmark regions (`<main>`, `<nav>`, `<footer>`)

### Images

- [ ] All images have alt text
- [ ] Decorative images hidden from assistive technology
- [ ] Complex images have extended descriptions
- [ ] No text baked into images

### Links & Buttons

- [ ] All links have descriptive text
- [ ] All buttons have accessible names
- [ ] Focus visible on all interactive elements
- [ ] Touch targets minimum 44×44px
- [ ] No links that open in new window without warning

### Forms (Future)

- [ ] All inputs have associated labels
- [ ] Required fields marked and announced
- [ ] Error messages programmatically associated
- [ ] Form submission confirmations announced

### Dynamic Content

- [ ] Mobile navigation: focus management correct
- [ ] State changes announced to screen readers
- [ ] No content hidden from assistive technology that is visible on screen

---

## Testing Protocol

### Automated

- axe-core in development
- Lighthouse accessibility audit > 90
- HTML validation (no errors)

### Manual

- Keyboard-only navigation test (full site)
- Screen reader testing (VoiceOver on macOS)
- Zoom to 200% — no content loss
- High contrast mode — content readable
- Reduced motion — no essential animation

### Assistive Technology

| Tool | Platform |
|---|---|
| VoiceOver | macOS / iOS |
| NVDA | Windows (future) |
| JAWS | Windows (future) |

---

## Ongoing Responsibility

- Accessibility checked with every content update
- New components tested before deployment
- User feedback on accessibility issues addressed promptly
- Annual accessibility audit recommended
- CMS editors trained on alt text and heading hierarchy
