# v0.6.26 Branding + Tone + Squad Actions Validation

## Fixed scope
Mobile-first visual refinement only:
- branded header wordmark;
- branded Home hero presence;
- subtle photographic tone treatment;
- single Home `Today at a glance` bar;
- removal of four duplicated Home stat cards;
- Squad Add Player / Update Players relocation;
- runtime/cache bump to v0.6.26.

No football, training, formation, tactics, mentor, Team Plan, scanner-calibration or cloud-data-model logic was intentionally changed.

## Visual result
- Header uses a crisp CSS-rendered TOP ELEVEN TOOL wordmark, keeping the corrected official app icon at left.
- Home hero uses the approved portrait background plus a centered TOP ELEVEN TOOL / HOME overlay.
- `Today at a glance` contains Players, Avg OVR and Training Opportunities.
- The former four-card Home summary row is no longer rendered.
- Recent Players / Training Builder / Team Plan Snapshot follow the summary bar directly.
- Photo tone is controlled by `--v626-photo-tint` and `--v626-photo-filter` so imagery remains visible without dominating the UI.
- Squad hero no longer contains management buttons. Add Player / Update Players now sit directly above the roster.
- Phone portrait Squad title remains the accepted two-line `SQUAD / MANAGEMENT` treatment.

## Release/runtime checks — PASS
- `python tests/v0626_branding_tone_actions_contract.py`
- `python tests/v0624_mobile_hero_branding_contract.py`
- `python tests/v0624_mobile_hero_browser.py`
- `python tests/v0623_home_squad_background_contract.py`
- `python tests/v0620_squad_finish_contract.py`
- `python tests/v0619_squad_compact_nationality_contract.py`
- `python tests/static_checks.py`
- `python tests/package_integrity.py`
- `python tests/release_identity_contract.py`
- `python tests/cloud_hydration_contract.py`
- `python tests/navigation_render_contract.py`
- `python tests/navigation_queue_contract.py`
- `python tests/button_binding_contract.py`
- `node --check` across active `js/*.js` plus `sw.js`.

## Frozen-system regression — PASS
- `node tests/core-tests.js` — 355 assertions.
- `node tests/tactic_calibration_invariants.js` — 178 assertions.
- `node tests/live_drain_profile.js` — 52 assertions.
- Formation/assignment/fallback/Playstyle calibration suites — PASS.
- Squad Blueprint / data completeness / Team Plan completeness — PASS.
- Training calibration matrix — 40 profiles PASS.
- Team Training — 14 assertions PASS.
- Set Pieces — 29 assertions PASS.
- Mentors — 18 assertions PASS.
- Stitched pipeline — 26 assertions PASS.
- Stitched monotonicity — 8 assertions PASS.
- Order invariance — 4 assertions PASS.
- All-in-one planner — 5 assertions PASS.
- `node tests/player_update_persistence.js` — 20 assertions PASS.
- `node tests/player_update_auto_match.js` — 11 assertions PASS.
- `node tests/scanner_failover_tests.js` — 11 assertions PASS.
- `node tests/cloud_local_first_runtime.js` — PASS.
- `python tests/scanner_regression.py` — PASS.
- `python tests/scanner_image_contract.py` — PASS.
- `python tests/v0418_all_native_resolution_contract.py` — PASS.

## Inherited stale/obsolete contracts
The following are not v0.6.26 regressions and already fail against the v0.6.25 baseline:
- `tests/v0417_native_source_playstyle_contract.py` expects a Settings explanatory sentence that is absent from v0.6.25 as well; scanner native-resolution behaviour itself passes `v0418_all_native_resolution_contract.py`.
- early Home fidelity contracts such as `v0613_home_fidelity_contract.py` / `v0615_home_fidelity_contract.py` describe superseded navigation, hero crops and Watch Tour content and already fail against v0.6.25.
- `runtime_interaction_stress_contract.py` still hardcodes the old `te-v0-5-17-p11` service-worker cache marker and already fails against v0.6.25.

## Release identity
- UI/runtime: `v0.6.26`.
- Cache-buster: `0626`.
- Service-worker cache: `te-v0-6-26-branding-tone-actions`.
- Frozen decision contract: `v0.5.17`.
- Scanner: `VERSION=12`.
