# Apothecary Seller Centre — Editor Guide

A calm, guided way to manage Apothecary products without opening the full Sanity form for routine work.

Sanity remains the single source of truth. The Seller Centre writes to the same Product documents as the Advanced Editor.

**Studio route:** `/studio/apothecary-manager`

---

## How to add a product

1. Open **Apothecary Seller Centre** (first tool in Studio).
2. Press **Add Product**.
3. Follow the journey:
   1. **Details** — name, category, type, size, origin, ingredients, intended use, brand, SKU
   2. **Media** — primary image, gallery, video and poster
   3. **Generate Content** — optional AI draft; always review and accept sections
   4. **Price** — price, stock, availability
   5. **Preview** — private Draft Mode preview (publish remains optional)
4. Press **Save Draft** at any time. Progress is also kept in this browser if you refresh.

The normal path ends at **Preview Draft**. Publish only when you are ready for the public catalogue.

The slug is generated from the product name. Edit it before first publication.

---

## How to resume a draft

From the product list: **Actions → Resume Draft**.

This reopens the guided workflow on the same Sanity Product document (hydrated from the draft), starting at Images and video so you can continue media and content work without starting over.

**Edit** opens Quick Edit for routine field changes. **Resume Draft** continues the five-step wizard.

---

## How to upload images

On step 2 (or Quick Edit):

- Drop or choose a **primary image**
- Add further images to the **gallery**
- Reorder with the move controls
- Set one image as primary
- Add **alt text** for accessibility
- Replace or remove images as needed

Upload progress and validation errors appear in plain English.

---

## How to add video

On step 2:

- Choose a video from the **Media Library**, or
- Paste an approved **external video URL**
- Add a **poster image** (strongly recommended)
- Set title and caption
- Autoplay stays off; controls stay on

---

## How to generate content

On step 3:

1. Confirm the factual fields from step 1.
2. Press **Generate Product Content**.
3. Review the proposal beside your draft.
4. Use **Accept all**, **Accept section** on a single field, or **Reject**.
5. Optional refinements: shorter, more detailed, more premium, more educational, SEO, FAQs, alt text, Danish translation.

AI drafts are labelled **AI draft — review required**. They never publish automatically and must not invent medical claims, certifications, hadith, or provenance.

Requires `AI_ADMIN_TOKEN` / `SANITY_STUDIO_AI_ADMIN_TOKEN` and a configured model key in the environment.

---

## How to preview a draft

Use **Preview Draft** from:

- Wizard step 5
- Seller Centre row actions
- Quick Edit
- The Product document action menu

This opens a private Draft Mode preview. Unpublished and Hidden products can be previewed without publishing. Visitors without Draft Mode still see a normal 404 or the public catalogue rules.

---

## How to change a price

1. From the product list, open **Actions → Edit**.
2. Change the price field.
3. Press **Save price** (or leave the field — blur also saves).
4. Press **Publish Changes** when ready (or leave as draft).

---

## How to replace an image

1. Open **Quick Edit**.
2. Press **Replace Main Image** or **Add Gallery Image**.
3. Save / publish as needed.

---

## How to publish

Publish is available when required fields are complete:

- Product name
- Slug
- Primary image
- Short description
- Regular price (or Coming soon)

Missing items are listed in plain English. Confirm before publishing.

---

## How to unpublish

From the product list: **Actions → Unpublish**. Confirm the prompt. The product leaves the public catalogue and returns to draft / hidden.

---

## How to archive

From the product list: **Actions → Archive**. Confirm the prompt. Products are not permanently deleted from the Seller Centre. Use **Restore** on archived products to return them to draft.

---

## How to access the Advanced Editor

- Seller Centre: **Actions → Open Advanced Editor**
- Quick Edit: open **Advanced Settings**, then **Open full Advanced Editor**
- Product document action: **Open in Seller Centre** returns you to the simplified workflow

Use the Advanced Editor for scholarship fields, research links, complex references, and specialist metadata. It opens the same canonical Product document (`product-{slug}` / draft twin).

---

## Summary cards and filters

Cards on the home screen filter the table (Live, Draft, Hidden, Out of Stock, Needs Attention). Use search and the status / stock / category / collection / language filters for finer control.

---

## Safety notes

- Sanity is the only product database
- AI never auto-publishes
- Preview never requires temporary publication
- Public catalogue queries stay strict (published + visible only)
- Prefer Archive over delete
