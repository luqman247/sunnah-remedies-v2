# 03 — Photography & Art Direction Manual

## Philosophy

Photography at Sunnah Remedies serves scholarship, not aspiration. Every image earns its place by contributing to understanding. No image exists for decoration, mood, or manufactured desire.

The photographic language draws from:
- Museum catalogues
- Botanical archives
- Medical institution documentation
- University press publications
- Wellcome Collection editorial photography

---

## Photographic Principles

### 1. Documentary Over Aspirational

Photographs document real things: real ingredients, real spaces, real practice. They do not stage fantasy or imply luxury that does not exist.

### 2. Stillness Over Action

The camera observes. It does not dramatise. Subjects are presented with the patience of a still life or an archival record.

### 3. Natural Light

All photography uses natural or soft directional light. No flash. No neon. No dramatic studio lighting. Light enters as it would in a scholarly reading room or an apothecary with south-facing windows.

### 4. Material Truth

If a honey jar is shown, it is the actual honey jar. If an olive grove is shown, it is the actual grove of origin. Photography does not represent — it records.

### 5. Dignity of Subject

Every person, ingredient, and space is photographed with the same care and respect. Nothing is trivialised. Nothing is exoticised.

---

## Subject Categories

### Product Photography

- Ingredients and preparations presented as botanical specimens
- Glass vessels, aged wood, natural materials
- Handwritten labels and provenance tags visible
- Neutral backgrounds: linen, stone, aged timber
- No lifestyle staging (no hands holding products, no flat-lays)
- No brand packaging in hero images

### Institutional Spaces

- Reading rooms, clinical suites, dispensaries
- Natural light entering through windows
- Books, instruments, and materials in use
- Architecture: arches, tiles, woodwork
- No people in institutional space photography

### Clinical Practice

- Practitioners at work (consent obtained)
- Emphasis on precision, cleanliness, and care
- Equipment presented as instruments, not props
- No patient faces unless explicitly consented and contextualised

### Sacred Journeys

- Architecture and landscape of sacred sites
- Courtyards, minarets, marble, dawn light
- Groups in pilgrimage (no individual identification)
- Manuscript pages, scholarly objects in situ

### Portraits

- Faculty and scholars
- Natural light, plain or scholarly background
- Respectful framing: head and shoulders or three-quarter
- No dramatic poses
- Consistent treatment across all portraits

---

## Technical Standards

### Format & Resolution

- Hero images: minimum 2400px wide, served responsive
- Editorial features: minimum 1600px wide
- Portraits: minimum 800px wide
- Format: WebP preferred, JPEG fallback, PNG for documents
- Quality: 75-85% for web delivery

### Aspect Ratios

| Context | Ratio |
|---|---|
| Cinematic hero | 21:9 or wider |
| Editorial pillar | 4:5 (portrait) |
| Editorial feature | 3:2 (landscape) |
| Product | 1:1 or 4:5 |
| Portrait | 3:4 |
| Gallery | Varies — maintain original |

### Colour Treatment

- Warm, natural colour temperature
- No heavy colour grading
- No desaturation for "mood"
- No split toning
- Subtle warmth permitted to match ivory palette
- Black and white not used except for archival documents

---

## Alt Text Standards

Every image must carry meaningful alt text that:
- Describes what is visible, not what is meant
- Names specific objects, materials, and settings
- Serves someone who cannot see the image
- Does not begin with "Image of" or "Photo of"
- Does not use marketing language

### Examples

Good: "Amber glass vessels of honey and oils arranged on aged wooden shelving beside dried medicinal herbs and a stone mortar"

Bad: "Beautiful apothecary display"

Good: "A clinical practitioner in a professional treatment room carefully preparing sterile cupping equipment"

Bad: "Hijama treatment photo"

---

## Photography in the CMS

Every image stored in Sanity supports:

| Field | Purpose |
|---|---|
| `alt` | Accessibility description |
| `caption` | Visible editorial caption |
| `photographer` | Credit |
| `copyright` | Rights holder |
| `credits` | Additional credits |
| `category` | Classification for media library |
| `cloudinaryAssetId` | Future CDN delivery |

---

## What is Not Permitted

- Stock photography of any kind
- AI-generated imagery
- Heavily composited images
- Images that imply medical outcomes
- Images of faces without consent
- Images that exoticise Islamic culture
- Images that stage luxury or aspiration
- Decorative images without documentary purpose
- Watermarked images
- Low-resolution or pixelated images

---

## Future: Cloudinary Integration

When Cloudinary is integrated:
- All images will be served via Cloudinary CDN
- Responsive transforms will be applied at delivery
- Format negotiation (WebP/AVIF) handled automatically
- Focal point data from Sanity will inform Cloudinary crops
- Original high-resolution files stored in Cloudinary, referenced by asset ID in Sanity
