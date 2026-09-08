# Top Eleven Tool v5 Beta 2 — Build 30527

Focused Beta 2 maintenance release based on the known-good v5 Beta 1 build. The authoritative build-30527 training optimiser, current visual system, player model, tactics and Scanner v2 architecture are retained.

## Beta 2 focus
1. Scanner v2 now performs a targeted OVR re-read when the detected OVR conflicts with the reconciled attribute average.
2. Automatic correction is only allowed when an alternate value was actually produced by the existing digit recogniser and resolves the discrepancy; no attribute or OVR value is invented.
3. Any remaining aggregate/OVR mismatch locks Save/Update so a known-bad scan cannot silently enter My Squad.
4. Parsed skill values are editable in the review screen, allowing the user to correct an unresolved field directly from the screenshot before saving.
5. Editing the OVR or a parsed skill immediately re-runs scanner reconciliation checks and unlocks Save only when the numeric checks pass.
6. Product/display name is now consistently **Top Eleven Tool** while retaining the existing icon and visual theme.

## Test priority
- Re-test a normal outfield scan, multi-role scan and GK scan.
- Confirm a clean scan still saves normally.
- Confirm an intentionally mismatched OVR/attribute set shows a warning and Save remains disabled until corrected.
- Confirm the installed PWA displays **Top Eleven Tool**.

The authoritative training files remain under `data/build_30527/` and are unchanged from Beta 1.

## Scanner deep-read patch

Real-device testing with Richard Kilroy (OVR 136) exposed two separate issues in the Beta 2 numeric reconciliation path: the OVR template library did not yet contain an OVR-font `6`, and aggregate reconciliation could replace already-correct individual attributes simply because an alternative combination sat closer to the rounded category total.

This patch keeps Scanner v2 but makes the numeric pass deliberately more thorough:
- every numeric cell is compared across multiple local threshold passes;
- stable direct reads are protected when the displayed category total is already within tolerance;
- aggregate totals validate/resolve genuinely ambiguous reads rather than forcing a cosmetically closer average;
- unresolved OVR gets a targeted secondary local digit-OCR check;
- the Richard Kilroy screenshot is now a permanent regression fixture.

Regression set: **12 screenshots / 204 numeric fields**.
