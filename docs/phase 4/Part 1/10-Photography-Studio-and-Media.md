# Chapter 10 · The Photography Studio & Media Operations

> *Document control* — Version 1.0 · Custodian: Head of Media · Classification: Internal · Review: Annual
> *Companion:* Blueprint Doc 03 (photography pipeline) and Doc 04 (Media Library/DAM) govern the system. This chapter governs the **studio and the media desk** at HQ.

---

## 10.1 The studio standard

We photograph like the British Museum documents an artefact and Aesop styles a shelf: **truthful, restrained, reverent.** Three rules never bend:

1. **The image never lies** — colour, scale, and quantity shown are exactly what ships.
2. **Restraint over abundance** — single subject, negative space, disciplined light.
3. **Consistency is the identity** — one house grade across the whole institution.

## 10.2 Shoot-day SOP

Follows the nine-stage pipeline (Blueprint Doc 03). At the studio:

1. **Brief and shot list** in hand before setup — no shoot without them.
2. **Set up** to the brief: lighting, background, props; colour reference/grey card in the first frame of each setup.
3. **Approvals ready:** product-accuracy sign-off (Apothecary) for product shots; consent/release for any recognisable person; Scholarly Board sign-off for any tradition-sensitive imagery — confirmed **before** capture.
4. **Capture RAW**, always; dual-card or immediate offload — no capture ever exists as a single copy.
5. **Tick the shot list** as you go; capture required aspect ratios/crops.
6. **Ingest** to the working store with checksum and immediate backup (3-2-1).
7. **Cull** to selects against the shot list; retain rejects in the RAW archive.
8. **Edit and grade** to the house grade, non-destructively; truthfulness limit respected (retouch removes dust/distraction, never alters colour/scale/quantity).
9. **QC gate** (§10.3) → publish to Cloudinary → archive masters + RAW.

## 10.3 QC gate SOP (before publish)

- [ ] Matches the house grade (checked against reference)
- [ ] Truthful (colour, scale, quantity as delivered)
- [ ] Sharp, correctly exposed, white balance correct
- [ ] Retouch invisible and honest
- [ ] All required crops/aspects present
- [ ] Metadata complete (creator, copyright, licence, caption, keywords, **alt text**)
- [ ] Product-accuracy approval (Apothecary) obtained for product shots
- [ ] Release on file for any recognisable person/property; licences unexpired for third-party assets
- [ ] Scholarly sign-off for tradition-sensitive imagery

QC is performed by a named person, ideally not the editor. A fail returns to editing.

## 10.4 DAM discipline (the media desk)

Every asset follows the institution's DAM rules (Blueprint Doc 04):

- **Naming convention** applied universally (`SR_[class]_[pillar]_[subject]_[descriptor]_[version]_[variant].ext`).
- **Metadata mandatory at ingest** — an asset with incomplete metadata stays in `_Incoming` and is unusable.
- **Rights and releases recorded** per asset; licence expiries alert before lapse.
- **Immutable originals; nothing overwritten** — changes are new versions with a change log.
- **3-2-1 backup** with tested restores; deletion locked behind Standards + a legal reason.
- **Full traceability:** published image → Cloudinary version → master → grade version → RAW → brief.
- `_Incoming` cleared weekly; annual media audit finds no orphans, no expired licences under live content.

## 10.5 Equipment care SOP

- Cameras, lenses, lighting, and computers are institutional assets — cleaned, checked, safely stored, and serviced on schedule.
- **Electrical and lighting safety** in the studio (Chapter 04) — a studio risk assessment covers heat, cabling, and rigging.
- Faults reported and logged; nothing safety-critical used while faulty.
- Calibration: screens and colour workflow calibrated so the house grade is accurate.

## 10.6 Video, drone & other media

- Video and audio follow the same brief → capture → edit → QC → publish → archive discipline, versioned in the DAM.
- **Drone/aerial** additionally requires flight permissions/permits and location consents recorded against the asset (Blueprint Doc 04) — never flown without them.
- All classes carry complete rights and metadata.

## 10.7 Rights, copyright & consent (desk duty)

- Commissioned work is owned by the institution, secured in writing **before** the shoot.
- **No image publishes without** clear title, and — where relevant — a signed model/property release and valid, unexpired licence terms (enforced at QC).
- Third-party/licensed assets recorded with terms, permitted uses, territory, and expiry.

## 10.8 Acceptance criteria (Studio & Media)

- [ ] No shoot without a brief and shot list; everything shot RAW and backed up before edit.
- [ ] One house grade applied; images truthful; retouch never alters product reality.
- [ ] QC gate passed (grade, truthfulness, crops, metadata, approvals, releases) before Cloudinary.
- [ ] Every asset named, fully tagged, rights-recorded; originals immutable; 3-2-1 with tested restores.
- [ ] Full provenance traceable from published image to brief.
- [ ] Equipment maintained and studio safety assessed; drone assets carry permissions.

*Turn to Chapter 11.*
