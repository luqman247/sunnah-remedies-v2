# 28 — Arabic Typography Standard

Purpose: operationalises [09-arabic-content-presentation.md](09-arabic-content-presentation.md)'s *rendering* requirements into an *entry-side* standard for staff typing or pasting Arabic into the `arabicText` field. Rendering itself (right-to-left display, `lang="ar"`, typeface) is already implemented in the public template and is not re-specified here — this document is about what staff must ensure when the text is entered, so the existing rendering has correct source material to work with.

## Entry requirements

- Enter Arabic as real, selectable Unicode text directly into the `arabicText` field — never paste as an image, a screenshot, or pre-rendered/flattened text. An image cannot be verified, searched, or corrected the same way, and defeats the accessibility requirements already built into the public rendering.
- Include full diacritical marking (tashkeel) throughout. Accurate recitation depends on diacritics — do not enter undiacritized text with the intention of "adding diacritics later." An undiacritized draft should stay at `reviewStatus: sourced` rather than advance.
- Use standard logical-order Unicode input (normal Arabic keyboard or IME input order). Do not manually reorder characters to compensate for how something displays elsewhere — if a display issue appears, the fix belongs in rendering, not in altering the stored text order.
- Be careful with copy-pasted sources that silently substitute visually similar but different codepoints — for example Arabic-Indic digits versus Latin digits, or presentation-form ligatures instead of base letters. Where practical, re-select and inspect pasted text before saving, particularly when copying from a PDF or an image-based source.
- `transliteration` is a separate, Latin-script field — do not attempt to encode transliteration inside `arabicText` itself, and do not leave transliteration empty by pasting a rough Latin approximation into the Arabic field.

## Before saving

- Re-read the entered Arabic against the source once more before moving the item forward — a silent duplication, truncation, or paste error is easy to introduce and easy to miss, since the `arabicText` field has no built-in maximum-length check.
- If anything about the source material is ambiguous (unclear diacritics, an OCR-derived text, a source that itself contains a visible typographical error), note the ambiguity for the scholarly reviewer ([24-scholarly-review-form.md](24-scholarly-review-form.md)) rather than silently resolving it yourself.
