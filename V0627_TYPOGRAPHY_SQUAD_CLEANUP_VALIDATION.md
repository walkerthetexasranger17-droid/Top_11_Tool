# v0.6.27 Typography + Squad Cleanup Validation

## Fixed scope
Mobile-first visual refinement only:
- upper-left Home hero branding;
- clipped-wordmark guard;
- centred header `TOOL` + version lines;
- unified condensed app typography;
- reusable branded functional page-title system;
- removal of the five redundant Squad summary cards;
- tighter Squad management-to-roster flow;
- runtime/cache bump to v0.6.27.

No football, training, formation, tactics, mentor, Team Plan, scanner calibration or cloud data-model logic was intentionally changed.

## Visual result
- Header keeps the official tactics-board app icon and CSS-rendered `TOP ELEVEN TOOL` wordmark.
- Header `TOOL` is centred beneath `TOP ELEVEN`; `v0.6.27` is centred beneath `TOOL`.
- Extra right-side breathing room prevents the italic final `N` in `ELEVEN` from clipping.
- Home branding is upper-left rather than centred over the player.
- Squad, Player Scanner, Training Builder, Drill Library, Team Plan, Manager Profile and App Settings use the branded white/lime functional title system.
- Normal UI letters/numbers use the same condensed Barlow Condensed family; nationality flag rendering keeps an emoji fallback.
- The five Squad summary cards are physically removed from the DOM.
- Add Player / Update Players now flow directly into the roster with the page pulled upward.
- The v0.6.26 background tint/tone remains unchanged.

## Release/runtime checks — PASS
- JS/service-worker syntax: PASS across active `js/*.js` + `sw.js`.
- `python tests/static_checks.py` — PASS.
- `python tests/package_integrity.py` — PASS.
- `python tests/release_identity_contract.py` — PASS.
- `python tests/cloud_hydration_contract.py` — PASS.
- `python tests/navigation_render_contract.py` — PASS.
- `python tests/navigation_queue_contract.py` — PASS.
- `python tests/button_binding_contract.py` — PASS.
- `python tests/v0627_typography_squad_cleanup_contract.py` — PASS.
- `python tests/v0627_mobile_browser.py` — PASS.
- `python tests/v0624_mobile_hero_branding_contract.py` — PASS.
- `python tests/v0624_mobile_hero_browser.py` — PASS.
- `python tests/v0623_home_squad_background_contract.py` — PASS.
- `python tests/v0620_squad_finish_contract.py` — PASS.
- `python tests/v0619_squad_compact_nationality_contract.py` — PASS.
- `python tests/best_in_slot_ui_contract.py` — 29 assertions PASS after updating its stale runtime query-marker expectation to `0627`.

## Frozen-system regression — PASS
- `node tests/core-tests.js` — 355 assertions PASS.
- `node tests/tactic_calibration_invariants.js` — 178 assertions PASS.
- `node tests/live_drain_profile.js` — 52 assertions PASS.
- `node tests/team_training_calibration.js` — 14 assertions PASS.
- `node tests/set_piece_calibration.js` — 29 assertions PASS.
- `node tests/mentor_calibration_invariants.js` — 18 assertions PASS.
- `node tests/stitched_plan_monotonicity.js` — 8 assertions PASS.
- `node tests/order_invariance_calibration.js` — 4 assertions PASS.
- `node tests/all_in_one_system_calibration.js` — 5 assertions PASS.
- `node tests/player_update_persistence.js` — 20 assertions PASS.
- `node tests/player_update_auto_match.js` — 11 assertions PASS.
- `node tests/scanner_failover_tests.js` — 11 assertions PASS.
- `node tests/cloud_local_first_runtime.js` — PASS.
- `python tests/scanner_regression.py` — PASS.
- `python tests/scanner_image_contract.py` — PASS.
- `python tests/v0418_all_native_resolution_contract.py` — PASS.
- `node tests/formation_calibration_invariants.js` — 27 assertions PASS.
- `node tests/formation_playstyle_calibration.js` — 3 assertions PASS.
- `node tests/formation_natural_fallback_calibration.js` — 4 assertions PASS.
- `node tests/formation_fallback_monotonicity.js` — 5 assertions PASS.
- `node tests/data_completeness_calibration.js` — 10 assertions PASS.
- `node tests/team_plan_data_completeness.js` — 5 assertions PASS.
- `node tests/best_in_slot_contract.js` — 127 assertions PASS.
- `node tests/training_calibration_matrix.js` — 40 profiles PASS.
- `node tests/stitched_pipeline_calibration.js` — 26 assertions PASS.
- `node tests/squad_blueprint_calibration.js` — 21 assertions PASS.
- `node tests/formation_assignment_calibration.js` — 4 assertions PASS.
- `python tests/player_update_scan_contract.py` — 31 assertions PASS.
- `python tests/training_mode_ui_contract.py` — 9 assertions PASS.
- `python tests/set_piece_coverage_ui_contract.py` — 13 assertions PASS.
- `python tests/strategy_logic_data_contract.py` — PASS.

## Core code preservation check
Compared with the verified v0.6.26 release: all 19 frozen engine/data files for training, formation, tactics, mentors, scanner, Team Plan, Best-in-Slot and strategy logic remain byte-identical. `js/app.js` changed only for runtime/UI work and retirement of dead Squad-summary rendering code.

## Release identity
- UI/runtime: `v0.6.27`.
- Cache-buster: `0627`.
- Service-worker cache: `te-v0-6-27-type-title-squad-cleanup`.
- Frozen decision contract: `v0.5.17`.
- Scanner: `VERSION=12`.
