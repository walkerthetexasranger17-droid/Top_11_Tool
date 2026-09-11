# Scanner v3 — Gemini Free Tier (v5.2.17)

Scanner v3 is still **100% OCR-free** in production. It does not use Tesseract, legacy digit templates or custom OCR. The player screenshot is sent directly to Gemini 3.8 Flash.

## One-image Gemini request
v5.2.17 deliberately sends only the current player screenshot to Gemini. Gemini reads:

- player name
- age
- OVR
- visible natural roles
- three group totals
- visible skill values

Gemini does **not** receive the 20 playstyle references, 4 playstyle-level references or 19 Special Ability references. Instead it returns tight 0..1000 bounding boxes for any visible playstyle badge and every visible Special Ability icon.

## Local visual matching
After Gemini returns, the browser compares those visible icon regions against the packaged finished assets:

- 20 playstyle identity PNGs
- 4 playstyle-level PNGs: Locked, Intermediate, Advanced, Master
- 19 Special Ability assets

Playstyle identity and level are independent. A playstyle is returned only when an actual badge was located and both local comparisons are confident enough. If a badge/icon is not visible or the local match is uncertain, the app leaves the field for manual review instead of inventing a value.

## Retry policy
Gemini 3.8 Flash remains the only model.

Each API attempt has a **20-second timeout**. Temporary busy/rate-limit/network/timeout failures may use at most three attempts total:

1. immediate attempt
2. retry after 3 seconds
3. retry after 8 seconds

After the third failed attempt, the queue item stops and shows **Retry Scan**. There is no repeat-until-success loop. Daily free-tier quota exhaustion also stops immediately for manual retry later. Authentication and malformed-request failures remain hard failures.

## Verification language
The existing group-total/OVR calculations remain useful as arithmetic consistency checks. They are not described as proof that Gemini read the screenshot correctly. The user can edit any parsed value before saving.
