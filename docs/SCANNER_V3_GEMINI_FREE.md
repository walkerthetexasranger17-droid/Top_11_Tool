# Scanner v3 — Gemini Free API — v5.2.18

## Scope
The scanner reads only core player data from one Top Eleven player screenshot:

- player name
- age
- OVR
- natural positions/roles
- visible group totals
- all 15 visible skill values

Playstyle, playstyle level and Special Abilities are deliberately **not scanned**. They remain manual fields in Review.

## Recognition path
The browser sends the original screenshot directly to `gemini-3.6-flash` through the Gemini Developer API. There is no Tesseract, digit-template OCR, Cloud Vision, Cloud Run, Vertex AI, playstyle matching or Special Ability matching in the production scanner.

## Retry behaviour
Each request has a 20-second timeout. Temporary API errors, rate limits, network errors, timeouts, malformed responses, missing required core fields, missing skill values, or arithmetic-inconsistent results are rejected and retried automatically. Backoff grows through 2s, 4s, 8s, 12s and then 15s between subsequent attempts. The retry loop continues until a valid result is returned or the user cancels/removes the queued scan.

Authentication errors, invalid image input, unavailable model errors and exhausted daily free-tier quota stop immediately because retrying cannot repair them.

## Validation
A scan is accepted only when it contains a valid name, age, OVR, at least one natural role, every required skill value, required group totals, and the returned numbers satisfy the app's existing whole-number arithmetic checks. The scanner never alters numbers to make those checks pass.

## Manual visual fields
Review continues to expose the normal playstyle, level and Special Ability controls. The user selects those manually before saving.
