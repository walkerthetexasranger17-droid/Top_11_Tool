# Top Eleven Tool v5.2.11 — Build 30527 Release Report

## Scanner change

v5.2.11 removes the Cloud Run / Cloud Vision / Vertex AI deployment introduced in v5.2.9 and replaces it with a direct Gemini Developer API free-tier path using `gemini-3.8-flash`.

The scanner sends the original Skills screenshot together with the recovered playstyle-level and special-ability reference sheets. The prompt forbids number repair/invention and requires every visible special ability to be returned, with no fixed maximum count.

## v5.2.11 capacity fallback

- Primary scan model remains `gemini-3.8-flash`.
- If Google returns a transient overload/capacity error (HTTP 5xx, or a high-demand 429), the exact same scan request is retried once with `gemini-3.7-flash`.
- Authentication, malformed requests, and genuine free-tier quota exhaustion are not hidden by the fallback.
- There is still no Cloud Run, Vertex AI, Cloud Vision, or paid-service fallback.
- The actual model used is saved in scanner provenance for each player.

## Cost / credential model

- No Google Cloud Billing account is required by the app architecture.
- No Cloud Run, Vision API or Vertex AI service is used.
- No API key is embedded in the package.
- The user's Gemini key is stored only in the current browser.
- HTTP 429 quota/rate-limit failures stop scanning; there is no paid fallback.
- If the user later upgrades the Gemini project to paid billing, Google pricing may apply; v5.2.11 assumes the project remains on Free Tier.

## Regression target

`tests/scanner-fixtures/david-andrews-multi-sa.jpg` remains the multi-special-ability acceptance fixture. Expected result includes Box-to-Box Standard and both `Defensive Wall` and `Dribbler`, plus all 15 exact outfield skills.

## Offline verification

Core logic, scanner contract, static integrity, PWA precache integrity and JavaScript syntax are tested locally. Live Gemini accuracy remains an environment-dependent acceptance test and requires the user's API key.
