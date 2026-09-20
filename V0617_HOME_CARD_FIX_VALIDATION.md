# v0.6.17 Home Highest OVR Card Validation

PASS

## Scope
Narrow mobile Home fix only: correct the Highest OVR player/role portrait alignment and scale seen on the user's real deployed phone screenshot.

## Result
- Phone portrait Highest OVR portrait is now a small square thumbnail anchored to the upper-right of the stat card.
- Text has reserved right-side space so the thumbnail cannot collide with Highest OVR value/name copy.
- Tablet portrait uses the same treatment at a larger scale.
- Dead Home Watch Tour / More-drawer JavaScript hooks were removed to match the already-approved v0.6.16 direct-navigation shell.
- Runtime/cache identity bumped to v0.6.17.

## Verification
- `python tests/release_identity_contract.py` — PASS.
- `python tests/static_checks.py` — PASS: 236 ids, 9 pages.
- `python tests/package_integrity.py` — PASS: 100 core precache files / 4,412,207 bytes.
- `node tests/core-tests.js` — PASS: 355 assertions.
- `node tests/scanner_failover_tests.js` — PASS: 11 assertions.
- `node tests/player_update_auto_match.js` — PASS: 11 assertions.
- `node tests/player_update_persistence.js` — PASS: 20 assertions.
- Real Chromium offline viewport audit — PASS: 45/45 page/device combinations; 0 horizontal-overflow cases; 0 console errors.
- Seeded 390x844 Chromium preview measured Highest OVR image at 29x29 inside a 89.75x90 card, natural source 720x720, object-fit cover, object-position 50% 24%.
- 19 explicitly frozen football/scanner/training/decision files SHA-256 identical to v0.6.16 baseline.

## Next
Deploy v0.6.17 with the real cloud squad and continue Home-only mobile polish from real-device screenshots until the user accepts Home.
