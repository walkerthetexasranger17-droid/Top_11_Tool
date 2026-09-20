# v0.6.30 Size Cleanup Validation

## Scope
Packaging/housekeeping only. Home/Squad design and all calibrated football/scanner logic remain unchanged.

## Why the package grew
The v0.6.x source/release ZIP had accumulated multiple generations of large artwork and recovery-only assets. The largest avoidable items were duplicate v0.6.15/v0.6.16 Home renders, superseded v0.6.28 header art, duplicate Home/Squad approved-background copies, and historical design-reference screenshots. Scanner references are genuinely used and were deliberately preserved.

## Intentional removals
- superseded `assets/v0615/` tree
- superseded `assets/v0628/` header tree
- five duplicate full-size PNG render sources from `assets/v0616/home/` after confirming runtime uses WebP equivalents
- duplicate v0.6.24 Home/Squad approved-reference files (exact canonical copies remain at `assets/v0623/backgrounds/`)
- obsolete old desktop design-reference screenshots
- stale runtime fallback reference to v0.6.15 manager avatar, repointed to existing v0.6.16 asset

## Preserved
- current `assets/v0629/headers/` transparent header pack
- current v0.6.23 Home/Squad approved backgrounds
- remaining approved future-page portrait source backgrounds
- scanner VERSION=12 reference/calibration assets and manifests
- recovery tests/fixtures in the recovery package
- v0.5.17 decision contract, game research and continuity documentation

## Package split
- **v0.6.29 previous single ZIP:** 74,222,297 bytes (~70.8 MiB)
- **v0.6.30 full recovery ZIP:** ~46.3 MB compressed before final packaging
- **v0.6.30 lean deploy ZIP:** ~28.4 MB compressed before final packaging

The lean deploy ZIP omits tests, historical handoffs/validations, research/source data and recovery-only approved-source artwork that the browser does not need. The full recovery ZIP remains the package to use for future development/new-chat recovery.

## Regression results
- `python tests/static_checks.py` — PASS
- `python tests/release_identity_contract.py` — PASS
- `python tests/cloud_hydration_contract.py` — PASS
- `python tests/package_cleanliness.py` — PASS, recovery tree below 55 MB raw ceiling
- `node tests/core-tests.js` — PASS, 355 assertions
- `python tests/scanner_regression.py` — PASS, Scanner VERSION=12
- `python tests/navigation_render_contract.py` — PASS
- `python tests/player_update_scan_contract.py` — PASS, 31 assertions
- `python tests/package_integrity.py` — PASS, 116 core precache files / 6,189,282 bytes
- `python tests/v0629_mobile_browser.py` — PASS against unchanged approved Home/Squad/header layout
- `python tests/v0630_size_cleanup_contract.py` — PASS
- lean deploy staging `package_integrity.py` — PASS
- lean deploy staging mobile Chromium contract — PASS

## Result
Cleanup is behaviour-neutral. Home and Squad remain the approved baseline. Use the deploy ZIP for GitHub Pages and the recovery ZIP for future development handoff.
