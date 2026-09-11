# Top Eleven Tool v5.2.13 — Build 30527

Static GitHub Pages/PWA companion app. The canonical application contract remains `docs/TOP_ELEVEN_TOOL_BIBLE_BUILD_30527_v1.md`. v5.2.13 is a targeted mobile usability/navigation and Scanner v3 reliability release; training, tactics, formation, mentor and Build 30527 calculations are not redesigned.

## Mobile usability

- My Squad supports deliberate swipe-left-to-delete with a confirmation dialog. Normal vertical scrolling is gesture-locked away from delete; only one row can remain open.
- App navigation is written to browser history so Android/PWA Back follows actual navigation. Temporary delete/drawer overlays close before page navigation.
- Refresh/reload restores the current page plus key context such as player, Training tab/player and Squad filters, then shows a short success toast.
- More opens a left-side drawer generated from existing main application pages. Team Plan remains the existing page containing tactics; no fake standalone Tactics page was created.

## Scanner v3 reliability

The old Scanner v2 digit-template/value-repair engine remains outside the production path.

- The client uses the Gemini Developer API directly with the user's free-tier key.
- It calls `models.list` and filters to the documented stable, image-capable full Flash models used by this build: `gemini-3.5-flash`, `gemini-3.6-flash`, `gemini-3.7-flash`, and `gemini-3.8-flash`.
- `gemini-3.4-flash` is not used because it is not a documented supported endpoint.
- Flash-Lite models are deliberately excluded from automatic fallback because accuracy remains more important than squeezing in another lower-capability fallback.
- Base preference is 3.7 → 3.6 → 3.5 → 3.8. Last-success history and short cooldowns after transient failures adapt that order to real responses seen on the device.
- Temporary `429`/`408`/`5xx` availability conditions trigger fast model failover. A valid response immediately stops further model calls.
- Whole-pool temporary unavailability schedules bounded automatic retries with backoff, rather than immediately turning every batch item into NEEDS RETRY.
- Daily/free-quota exhaustion, authentication problems, malformed API responses and genuine scan failures are separated from temporary congestion.
- No paid API/service fallback exists.

Every successful model result passes the same existing normalisation/review/validation path. Gemini values are never rewritten to force OVR/group totals to fit. Playstyle + tier and every visible Special Ability remain editable before save.

## Queue persistence

Scanner metadata is persisted in existing local storage and screenshot payloads are persisted in IndexedDB. Navigating away does not destroy the queue. Reload restores queued/waiting/review results. An in-flight request interrupted by a full reload is marked for manual retry so the app does not silently submit a duplicate request.

## Tests

Run from the project root:

```bash
node tests/core-tests.js
python tests/scanner_regression.py
node tests/scanner_failover_tests.js
python tests/navigation_queue_contract.py
python tests/static_checks.py
python tests/package_integrity.py
```

A live Gemini acceptance test remains optional (`tests/gemini_scanner_live.py`) and requires `GEMINI_API_KEY`.
