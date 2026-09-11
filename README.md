# Top Eleven Tool v5.2.17 — Build 30527

Static GitHub Pages/PWA companion app. The canonical application contract remains `docs/TOP_ELEVEN_TOOL_BIBLE_BUILD_30527_v1.md`. v5.2.17 is a targeted Scanner v3 speed/accuracy release; training, tactics, formation, mentor and Build 30527 calculations are not redesigned.

## Mobile usability

- My Squad supports deliberate swipe-left-to-delete with a confirmation dialog. Normal vertical scrolling is gesture-locked away from delete; only one row can remain open.
- App navigation is written to browser history so Android/PWA Back follows actual navigation. Temporary delete/drawer overlays close before page navigation.
- Refresh/reload restores the current page plus key context such as player, Training tab/player and Squad filters, then shows a short success toast.
- More opens a left-side drawer generated from existing main application pages. Team Plan remains the existing page containing tactics; no fake standalone Tactics page was created.

## Scanner v3 reliability

The old Scanner v2 OCR/digit-template engine remains outside the production path.

- The client uses the Gemini Developer API directly with the user's free-tier key.
- **Gemini 3.8 Flash is the only production scanner model.** There is no 3.5/3.6/3.7 model fallback and no paid fallback.
- A normal scan sends **one image only** to Gemini: the player's screenshot. The 20 playstyle images, 4 level images and 19 Special Ability images are no longer uploaded to Gemini on every scan.
- Gemini reads player text/numbers and returns only tight bounding boxes for any visible playstyle badge and Special Ability icons.
- Playstyle identity, playstyle level and Special Ability identity are then matched **locally in the browser** against the finished asset pack.
- A Gemini request has a **20-second timeout**. Temporary failure is retried at most twice more after short 3s and 8s waits. After three failed attempts, the queue stops that item and shows **Retry Scan** instead of retrying forever.
- Rescan/retry/remove cancel any in-flight request for that queue item.
- A playstyle is not returned when no actual playstyle badge is visible.
- Multiple Special Abilities remain fully supported.
- Arithmetic checks are labelled as arithmetic consistency checks; they are no longer presented as proof that Gemini visually read every value correctly.

Gemini values are never rewritten merely to force OVR/group totals to fit. All parsed values, playstyle fields and Special Abilities remain editable before save.

## Queue persistence

Scanner metadata is persisted in existing local storage and screenshot payloads are persisted in IndexedDB. Navigating away does not destroy the queue. Reload restores queued/review results. An in-flight request interrupted by a full reload is marked for manual retry so the app does not silently submit a duplicate request.

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

## v5.2.17 scanner references
The production scanner keeps the exact finished reference library under `assets/scanner/references/`, but those images are used locally rather than attached to the Gemini request. The packaged playstyle/level assets are unchanged from the user-supplied asset pack; old generated combinations remain absent.
