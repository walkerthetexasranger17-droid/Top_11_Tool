# v0.6.32 Dropdown + Training Interaction Validation

**Status:** PASS

Scope is interaction/UI only. No football/scanner calibration changes.

## Implemented
- App-owned themed dropdown layer replaces visible Android/browser-native select UI while retaining each real `<select>` as the application logic source of truth.
- Dynamic selects are covered through MutationObserver enhancement.
- Training player placeholder/value uses the themed trigger and no longer clips vertically.
- Individual Training clears the visible recommendation on page render/player selection and does not auto-restore drills before the user presses Build/Generate Session.
- Squad sort defaults to `Role (GK → ST)` with option order: Role, OVR high→low, OVR low→high, Age young→old, Name A→Z.
- Home/Squad visual state and v0.6.31 Training background/card design are unchanged.

## Regression results
- `tests/core-tests.js`: PASS — 355 assertions.
- `tests/scanner_regression.py`: PASS — Scanner VERSION=12 compact-reference contract.
- `tests/static_checks.py`: PASS.
- `tests/release_identity_contract.py`: PASS.
- `tests/cloud_hydration_contract.py`: PASS.
- `tests/package_integrity.py`: PASS.
- `tests/package_cleanliness.py`: PASS.
- `tests/navigation_render_contract.py`: PASS.
- `tests/navigation_queue_contract.py`: PASS.
- `tests/runtime_hardening_contract.py`: PASS.
- `tests/player_update_scan_contract.py`: PASS — 31 assertions.
- `tests/v0631_training_design_contract.py`: PASS — inherited Training design retained.
- `tests/v0631_training_mobile_browser.py`: PASS.
- `tests/v0632_dropdown_training_contract.py`: PASS.
- `tests/v0632_dropdown_mobile_browser.py`: PASS — app-owned selectors, Role default, unclipped Training placeholder, no drills before Generate.
- `tests/offline_browser_viewport_audit.py`: PASS — 45 page/view combinations, 0 horizontal-overflow cases, 0 console errors.

## Packaging requirement
Both deploy and recovery ZIPs must be extracted into fresh verification directories. The recovery extraction must rerun the critical regression suite; the deploy extraction must verify every service-worker precache asset exists and the v0.6.32 runtime files are present.
