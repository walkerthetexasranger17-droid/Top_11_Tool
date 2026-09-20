# v0.6.29 Header Alpha Hotfix Validation

## Scope
Focused repair of header asset wiring and Home header selection.

## Verified outcomes
- Header HTML references only `assets/v0629/headers/*.webp`; no converted header points at `.png`.
- All nine packaged header images have alpha transparency and transparent corner pixels.
- Home uses the approved stacked TOP / ELEVEN / TOOL artwork in the upper-left.
- The global top bar remains the separate approved wide TOP ELEVEN TOOL wordmark.
- Fresh v0.6.29 asset paths prevent reuse of stale v0.6.28 header images.
- Topbar/Home are install-precached; the other versioned headers runtime-cache on first use to keep the install cache within the existing size contract.
- Frozen football/decision logic remains v0.5.17; scanner remains VERSION=12.

## Executed checks
- `python tests/v0629_header_alpha_hotfix_contract.py` — PASS
- `python tests/static_checks.py` — PASS
- `python tests/release_identity_contract.py` — PASS
- `python tests/cloud_hydration_contract.py` — PASS
- `node tests/core-tests.js` — PASS, 355 assertions
- `python tests/scanner_regression.py` — PASS, Scanner VERSION=12 contract
- `python tests/v0629_mobile_browser.py` — PASS
- `python tests/navigation_render_contract.py` — PASS
- `python tests/player_update_scan_contract.py` — PASS, 31 assertions
- `python tests/package_cleanliness.py` — PASS
- `python tests/package_integrity.py` — PASS, 116 install-precache files / 6,189,281 bytes
- Real 390×844 mobile-layout screenshot rendered with the stacked Home logo and no black header rectangle.
