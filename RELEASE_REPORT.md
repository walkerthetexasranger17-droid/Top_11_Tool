# Top Eleven Tool v5.2.17 — Build 30527 Release Report

## Scope
Targeted Scanner v3 speed/accuracy architecture change only. Training, tactics, formation, squad, navigation, storage and Build 30527 calculation logic are retained.

## What changed
- Gemini 3.8 Flash now receives only the player screenshot rather than 44 images.
- Gemini reads player text/numbers and locates visual icon regions; it no longer decides playstyle or Special Ability identity from the giant reference prompt.
- The exact packaged playstyle, playstyle-level and Special Ability assets are matched locally in the browser.
- A playstyle is not produced when no actual badge is visible.
- Each Gemini request times out after 20 seconds.
- Temporary failures use at most three attempts total with 3s/8s retry waits.
- After three failures the item stops and exposes Retry Scan; no infinite background retry remains.
- Retry/rescan/remove cancel an in-flight request for that queue item.
- The review badge now says **Arithmetic checks passed** instead of **Numerical checks verified**.

## Assets
The final scanner assets are unchanged from v5.2.16 and remain the exact user-approved asset pack:
- 20 playstyle identity PNGs
- 4 playstyle-level PNGs: Locked / Intermediate / Advanced / Master
- 19 Special Ability assets

No scanner artwork is generated, redrawn, recoloured or cropped during this release build.

## Evidence boundary
Gemini still performs visual reading of the screenshot directly. No OCR engine or digit-template fallback has been reintroduced.
