# Top Eleven Tool v5.2.13 — Build 30527 Release Report

## Files changed

- `index.html` — existing page metadata for drawer generation, left drawer/confirm-dialog markup, v5.2.13 label and scanner copy.
- `css/app.css` — swipe-delete rail, drawer/dialog styles and expanded scanner queue status styles.
- `js/app.js` — route/history handling, refresh state, swipe-delete, drawer, queue persistence/retry orchestration and scanner status UX.
- `js/scanner-engine.js` — confirmed model pool, runtime `models.list` discovery, error classification, adaptive failover and per-model cooldowns.
- `sw.js` — v5.2.13 cache version only; runtime asset list remains complete.
- release/setup/test documentation and targeted scanner/navigation tests.

No training, tactics, formation, mentor, player-calculation or Build 30527 Bible formulas were changed.

## Navigation changes

Navigation continues to use the existing `.page[data-page]` architecture. `go()` now writes genuine browser history entries and `popstate` restores page/player/training context. This gives Android-installed PWA Back normal page-history behaviour without creating a second router. Player Profile remains contextual and is not a main drawer item.

The existing bottom navigation remains Home / Squad / Team Plan / Training / More.

## Swipe-delete implementation

My Squad player rows are wrapped in a horizontal swipe container. Pointer movement is direction-locked: vertical movement wins when scrolling, while only a deliberate horizontal left gesture exposes an 82px Delete rail. Only one row remains open. Tapping elsewhere closes it. Delete opens an explicit confirmation dialog; only confirmation calls the existing `Players.remove()` path. Existing Profile → Edit → Delete remains unchanged.

## Refresh-state fix

Current page plus key context (selected player/training player/tab, Squad search and filters, Team Plan approach/drain state) is persisted in session state. On a reload, the app restores that route/context instead of defaulting to Home and shows `✓ Successfully refreshed` above the bottom navigation.

Scanner queue metadata is persisted separately. Queued screenshot payloads are stored in IndexedDB so refresh/navigation does not discard the batch.

## Android Back-button fix

Browser history is now authoritative. Back closes, in order, the delete confirmation or navigation drawer (both use transient overlay history states), then returns through actual pages. Example: Home → Squad → Player → Back → Squad → Back → Home. At the true Home root there is no fake sentinel history entry, so normal browser/PWA exit behaviour is retained.

## Navigation drawer implementation

More now opens a left-side drawer. The drawer menu is generated from existing pages marked with `data-nav-label`; the Training page exposes its existing Individual and Team tabs as separate drawer entries. Team Plan is labelled `Team Plan · Tactics` because tactics already live inside that page; no standalone Tactics page was invented. Outside tap, close button, left-swipe and Android Back close the drawer.

## Scanner models actually confirmed as available

Provider documentation confirms these stable full Flash model IDs and image input support:

- `gemini-3.5-flash`
- `gemini-3.6-flash`
- `gemini-3.7-flash`
- `gemini-3.8-flash`

`gemini-3.4-flash` is **not** used because it is not a documented supported model ID. Flash-Lite models are real, but are deliberately excluded from automatic scanning because the existing scanner accuracy requirement takes priority over adding a lower-capability fallback.

At runtime the app calls Gemini `models.list` and uses only documented pool members that the current API key actually reports with `generateContent` support.

## Scanner fallback order / strategy

Base preference: **3.7 → 3.6 → 3.5 → 3.8**.

This is not a claim that 3.7 is universally less busy. It reflects the user's observed successful 3.7 fallback after repeated 3.8 congestion, while retaining all confirmed full Flash models. The order then adapts locally: the most recently successful model is preferred, and models that return transient overload/rate-limit responses enter a temporary cooldown. Gemini's model metadata does not expose a real-time provider load score, so no fake load metric is invented.

The first valid response stops further model requests. Every model result enters the exact same existing normalisation, playstyle/Special Ability, numerical cross-check and save-validation path.

## Busy / rate-limit handling

The REST client distinguishes temporary availability from actual request/scan failures:

- Temporary/failover: HTTP 408; 500/502/503/504; short-window 429/rate limits; overload/high-demand/capacity/unavailable responses.
- Non-short-retry conditions: daily quota exhaustion.
- Actual/configuration problems: authentication/permission, malformed requests, invalid response/schema and unreadable/non-player scans.

`Retry-After`, Google `RetryInfo.retryDelay`, and textual `retry in Xs` hints are parsed when present.

## Automatic retry/backoff behaviour

A temporary model error immediately tries the next ready compatible model. If every compatible free model is temporarily unavailable, that player becomes **RETRYING AUTOMATICALLY** instead of immediately becoming NEEDS RETRY. Automatic retries are bounded to three queue attempts total, with delayed backoff and a small per-item spread. No infinite retry loop or paid fallback exists. Once the limit is exhausted, the item becomes **NEEDS RETRY** for manual action.

## Queue behaviour

The batch remains sequential to avoid uncontrolled concurrency. One player's temporary scanner issue does not abort the rest of the queue. Live statuses include QUEUED, SCANNING, MODEL BUSY — TRYING FALLBACK, RETRYING AUTOMATICALLY, READY TO REVIEW, SAVED, NEEDS RETRY and SCAN FAILED.

Navigation away from Scanner does not destroy the queue. Reload restores queue/waiting/review state. An API request that was genuinely in-flight when the app was reloaded is deliberately marked NEEDS RETRY instead of automatically duplicating an uncertain request; other queued items can continue.

## Tests performed

- `node tests/core-tests.js` — deterministic Build 30527/core scanner safeguards.
- `python tests/scanner_regression.py` — stable model-pool contract, no invented 3.4, reference assets and David Andrews multi-SA fixture.
- `node tests/scanner_failover_tests.js` — 503, per-minute 429 + RetryInfo, daily quota, 400 request classification, retry-duration parsing, pool/order assertions.
- `python tests/navigation_queue_contract.py` — history/drawer/swipe/refresh/queue persistence/retry hooks and route invariants.
- `python tests/static_checks.py` — DOM/navigation/Bible/static integrity.
- `python tests/package_integrity.py` — service-worker precache coverage.
- `node --check` on every `js/*.js` file and `sw.js`.
- Final ZIP CRC/integrity test.

## Unresolved limitations

- Gemini's provider API exposes supported model metadata but not trustworthy real-time model load. Availability ordering therefore adapts from actual responses observed on the device rather than claiming foreknowledge of provider capacity.
- Live Gemini congestion cannot be deterministically reproduced without the user's API key/provider state. Offline error-classification/failover tests use the same response shapes handled by production code; the existing optional live Gemini acceptance test still requires `GEMINI_API_KEY`.
- The build environment's headless Chromium remains unreliable, so Android PWA pull-to-refresh/back/swipe gestures still require final on-device smoke testing. This is an environment limitation, not a failed application assertion.
