# v0.6.36 Settings Background Validation

## Scope
A deliberately narrow visual pass: add the already-approved Settings portrait background without redesigning the Settings content or changing any calibrated logic.

## Implemented
- Added optimized runtime asset `assets/v0636/backgrounds/settings.webp` from `assets/v0624/reference-backgrounds/settings-approved.png`.
- Preserved the approved source geometry at 853×1844.
- Added a fixed Settings page-media layer for touch/mobile layouts.
- Suppressed the legacy Settings hero scene on touch/mobile so the approved portrait artwork is the page surface.
- Kept the existing Settings cards, controls, copy and title art unchanged.
- Bumped UI/runtime/cache identity to v0.6.36.
- Kept Scanner VERSION=12 and the frozen v0.5.17 decision contract unchanged.

## Regression results before packaging
- `python tests/v0636_settings_background_contract.py` — PASS
- `python tests/v0636_settings_mobile_browser.py` — PASS
- `python tests/static_checks.py` — PASS (219 ids / 9 pages)
- `python tests/release_identity_contract.py` — PASS
- `python tests/cloud_hydration_contract.py` — PASS
- `node tests/core-tests.js` — PASS (355 assertions)
- `python tests/scanner_regression.py` — PASS (Scanner v12)
- `python tests/navigation_render_contract.py` — PASS
- `python tests/player_update_scan_contract.py` — PASS (31 assertions)
- `python tests/package_integrity.py` — PASS (116 install-precache files / 6,494,043 bytes)
- `python tests/package_cleanliness.py` — PASS
- `python tests/offline_browser_viewport_audit.py` — PASS (5 device profiles × 9 pages = 45 combinations; 0 horizontal-overflow cases; 0 console errors)

## Packaging contract
- Produce a lean deploy ZIP for GitHub Pages / phone testing.
- Produce a full recovery ZIP containing tests, source references and current handoff.
- Fresh-extract both exact final ZIPs and verify before delivery.
