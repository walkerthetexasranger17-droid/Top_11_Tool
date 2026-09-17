# v0.6.13 Design Pass 13 Validation

**Pass:** Home Design Fidelity  
**Date:** 2026-09-17  
**Baseline:** verified v0.6.12 Pass 12 package  
**Frozen decision/calibration base:** v0.5.17

## Fixed scope
Home only: approved-reference fidelity, missing Home production hero crops, desktop/mobile Home composition, touch navigation correction, responsive/browser QA, recovery docs and verified full backup ZIP. No football/scanner/training calibration changes.

## Visual/reference implementation
Approved contracts:
- `docs/design/reference/v060/approved-home-desktop.webp`
- `docs/design/reference/v060/approved-home-mobile.webp`

Implemented:
- dedicated cinematic Home hero crops derived from existing `assets/scenes/squad.webp`;
- desktop search/header treatment and Cloud/manager chrome;
- hero headline + Get Started + Watch Tour;
- four stat cards;
- Recent Players capped to four rows;
- Training Builder;
- Team Plan Snapshot;
- Performance Insights;
- Quick Actions (Add Player / Update Players / Run Scan);
- touch nav = Home / Squad / Training / Team Plan / More;
- desktop sidebar retains Drills + Settings;
- functional More drawer and desktop Home search shortcut.

## Real Chromium viewport audit
`python tests/offline_browser_viewport_audit.py --app <v0.6.13> --screenshots`

Result:
- 45/45 page/view combinations PASS;
- 0 horizontal-overflow cases;
- 0 console errors;
- desktop nav mode = sidebar;
- coarse-pointer tablet/phone nav mode = bottom navigation.

Profiles:
- desktop 1440×900;
- tablet landscape 1180×820;
- tablet portrait 768×1024;
- phone landscape 844×390;
- phone portrait 390×844.

Additional Chromium interactions:
- PASS touch More drawer open → Settings navigation;
- PASS desktop Home search shortcut → Squad + search focus route.

## Regression results
PASS:
- `tests/release_identity_contract.py`
- `tests/cloud_hydration_contract.py`
- `tests/static_checks.py`
- `tests/v060_design_contract.py`
- `tests/v0613_home_fidelity_contract.py`
- `tests/runtime_hardening_contract.py`
- `tests/navigation_queue_contract.py`
- `tests/navigation_render_contract.py`
- `tests/package_integrity.py`
- `tests/core-tests.js` — **355 assertions**
- `tests/scanner_regression.py`
- `tests/scanner_failover_tests.js` — 11 assertions
- `tests/player_update_auto_match.js` — 11 assertions
- `tests/player_update_persistence.js` — 20 assertions

## Historical maintenance probes
Unchanged non-product failures:
- `tests/player_update_scan_contract.py` — historical Training DOM-order assertion: `Master card stock renders above normal drills`;
- `tests/package_cleanliness.py` — old maintenance file-count ceiling (working tree now 778 files).

These are not Pass 13 application regressions and were already documented as stale maintenance probes in prior passes.

## Frozen-engine containment
SHA-256 comparison against the verified v0.6.12 ZIP confirms byte-identical:
- Scanner engine;
- Training + Team Training engines;
- Formation;
- Tactics;
- Mentor;
- Team Plan;
- Best-in-Slot data/engine;
- strategy/optimizer data and logic;
- canonical decision JSON;
- strategy strings;
- decision manifest.

## Result
**PASS — v0.6.13 materially restores Home fidelity to the approved v0.6 visual contract, preserves real data/behaviour, passes the full 45-case Chromium responsive matrix, and leaves frozen football/scanner/calibration engines byte-identical to v0.6.12.**

## Next fixed pass
**v0.6.14 — Squad Design Fidelity** against the stored approved Squad references, unless real-device Home review reveals a blocking v0.6.13 defect first.
