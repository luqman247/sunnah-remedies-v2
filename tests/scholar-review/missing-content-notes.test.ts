/**
 * "Scholar Review" portal — missing-content documentation tests.
 *
 * Guards src/lib/scholar-review/missing-content-notes.ts against silently
 * losing the documented reasoning for the two known content gaps
 * (Feeling Alone, Struggling with Envy) — in particular the explicit
 * instruction that the Muʿawwidhat must never be force-fitted as a
 * treatment for a person's own envy.
 */

import { MISSING_CONTENT_NOTES } from "../../src/lib/scholar-review/missing-content-notes";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

function testBothKnownGapStatesAreDocumented() {
  assert(!!MISSING_CONTENT_NOTES["feeling-alone"], "feeling-alone must have a documented gap note");
  assert(!!MISSING_CONTENT_NOTES["struggling-with-envy"], "struggling-with-envy must have a documented gap note");
  console.log("✓ both known missing-content states (Feeling Alone, Struggling with Envy) are documented");
}

function testEveryNoteHasAllThreeRequiredFields() {
  for (const [slug, note] of Object.entries(MISSING_CONTENT_NOTES)) {
    assert(note.searchPerformed.trim().length > 0, `${slug}: searchPerformed must not be empty`);
    assert(note.rejectedCandidateReasoning.trim().length > 0, `${slug}: rejectedCandidateReasoning must not be empty`);
    assert(note.suggestedThemes.trim().length > 0, `${slug}: suggestedThemes must not be empty`);
  }
  console.log("✓ every documented gap note has non-empty search findings, rejection reasoning, and suggested themes");
}

function testEnvyNoteExplicitlyWarnsAgainstForceFittingTheMuawwidhat() {
  const note = MISSING_CONTENT_NOTES["struggling-with-envy"];
  const haystack = note.rejectedCandidateReasoning.toLowerCase();
  assert(haystack.includes("do not force-fit"), "the envy gap note must explicitly instruct against force-fitting a mismatched pairing");
  assert(haystack.includes("muʿawwidhat") || haystack.includes("muawwidhat"), "the envy gap note must name the specific rejected candidate (the Muʿawwidhat)");
  assert(
    haystack.includes("own envy") || haystack.includes("internal"),
    "the envy gap note must preserve the internal-disposition vs external-threat distinction that justifies rejecting the candidate",
  );
  console.log("✓ the Struggling with Envy note preserves the explicit \"do not force-fit the Muʿawwidhat\" instruction and its reasoning");
}

function runAll() {
  testBothKnownGapStatesAreDocumented();
  testEveryNoteHasAllThreeRequiredFields();
  testEnvyNoteExplicitlyWarnsAgainstForceFittingTheMuawwidhat();
  console.log("\nAll scholar-review missing-content-notes tests passed.");
}

runAll();
