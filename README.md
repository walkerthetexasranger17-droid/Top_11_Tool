# Top Eleven Tool v5.2.16 — Build 30527

Static GitHub Pages/PWA companion app. The canonical application contract remains `docs/TOP_ELEVEN_TOOL_BIBLE_BUILD_30527_v1.md`. v5.2.16 is a targeted mobile usability/navigation and Scanner v3 reliability release; training, tactics, formation, mentor and Build 30527 calculations are not redesigned.

## Mobile usability

- My Squad supports deliberate swipe-left-to-delete with a confirmation dialog. Normal vertical scrolling is gesture-locked away from delete; only one row can remain open.
- App navigation is written to browser history so Android/PWA Back follows actual navigation. Temporary delete/drawer overlays close before page navigation.
- Refresh/reload restores the current page plus key context such as player, Training tab/player and Squad filters, then shows a short success toast.
- More opens a left-side drawer generated from existing main application pages. Team Plan remains the existing page containing tactics; no fake standalone Tactics page was created.

## Scanner v3 reliability

The old Scanner v2 digit-template/value-repair engine remains outside the production path.

- The client uses the Gemini Developer API directly with the user's free-tier key.
- **Gemini 3.8 Flash is the only production scanner model.** There is no 3.5/3.6/3.7 model fallback and no paid fallback.
- Temporary busy/overload/rate-limit/network responses keep the queue item alive and retry Gemini 3.8 automatically until success or explicit user removal.
- Retry delay is 10s → 20s → 45s → 90s → 120s, then remains capped at roughly 120s, while respecting longer provider `Retry-After`/RetryInfo values.
- Daily free-tier quota exhaustion remains queued with a minimum 15-minute retry delay rather than switching to a paid service.
- Playstyle recognition is now split into **identity** and **level**. Identity uses the 20 exact user-supplied playstyle PNGs. Level uses the four exact approved False Nine references: Locked, Intermediate, Advanced and Master.
- The obsolete 80 generated playstyle/tier combinations and old playstyle workaround examples are removed from the package.
- Multiple Special Abilities remain fully supported.

Every successful result passes the same existing normalisation/review/validation path. Gemini values are never rewritten to force OVR/group totals to fit. Playstyle + level and every visible Special Ability remain editable before save.

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


## v5.2.16 scanner references
The production scanner loads `assets/scanner/reference-manifest.json` and sends 20 exact playstyle identity references, 4 exact playstyle-level references and 19 individual Special Ability references. Playstyle identity and level are separate visual decisions. The supplied playstyle/level assets are copied unchanged into the package; old generated combinations are absent.
