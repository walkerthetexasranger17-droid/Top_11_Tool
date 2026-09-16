# Top Eleven Tool v0.5.15 — Release Test Matrix

This is the release-frozen v0.5.15 verification record.

## Core decision/calibration gate

Run from the project root:

```bash
node tests/core-tests.js
node tests/tactic_calibration_invariants.js
node tests/live_drain_profile.js
node tests/formation_calibration_invariants.js
node tests/formation_assignment_calibration.js
node tests/formation_natural_fallback_calibration.js
node tests/formation_fallback_monotonicity.js
node tests/formation_playstyle_calibration.js
node tests/squad_blueprint_calibration.js
node tests/data_completeness_calibration.js
node tests/team_plan_data_completeness.js
node tests/training_calibration_matrix.js
node tests/team_training_calibration.js
node tests/set_piece_calibration.js
node tests/mentor_calibration_invariants.js
node tests/stitched_pipeline_calibration.js
node tests/stitched_plan_monotonicity.js
node tests/order_invariance_calibration.js
node tests/all_in_one_system_calibration.js
```

## Product/package/frozen-system gate

```bash
node tests/scanner_failover_tests.js
node tests/cloud_local_first_runtime.js
python tests/strategy_logic_data_contract.py
python tests/release_identity_contract.py
python tests/static_checks.py
python tests/package_integrity.py
python tests/cloud_hydration_contract.py
python tests/navigation_render_contract.py
python tests/navigation_queue_contract.py
python tests/scanner_regression.py
python tests/scanner_image_contract.py
python tests/v0412_patch_contract.py
python tests/v0413_reference_contract.py
python tests/v0414_scanner_level_contract.py
python tests/v0414_badge_locator_fixtures.py
python tests/v0415_compact_reference_contract.py
python tests/v0416_pixel_level_guard_contract.py
python tests/v0417_native_source_playstyle_contract.py
python tests/v0418_all_native_resolution_contract.py
```

Also run `node --check` against active `js/*.js` files and `sw.js`.

## v0.5.15 frozen source-tree result

- Core: **353 assertions PASS**.
- Tactics: **178 assertions PASS**.
- Live drain: **52 assertions PASS**.
- Formation/assignment/fallback/Playstyle suites: **PASS**.
- Squad Blueprint/data/Team Plan completeness: **PASS**.
- Training: **40 profiles PASS**; Team Training **14 assertions PASS**.
- Set Pieces: **29 assertions PASS**.
- Mentors: **18 assertions PASS**.
- Stitched pipeline: **26 assertions PASS**; monotonicity **8 assertions PASS**; order invariance **4 assertions PASS**.
- Direct all-in-one planner: **5 assertions PASS**.
- Strategy/data contract: **12 roles / 28 Role+Playstyle profiles / 11 Formation rules / 56 Tactic rules / 143 strings PASS**.
- Release identity/synchronisation contract: **PASS**.
- Static/cloud/navigation/package contracts: **PASS**.
- Scanner frozen contracts: **PASS**.
- JavaScript syntax: **PASS**.

## Release-specific protected behaviours

- Public UI, runtime marker, service-worker cache and local runtime cache-busters all identify **v0.5.15**.
- Canonical `decision_logic_v2.json`, browser `strategy-data.js`, Strategy runtime model fingerprint and decision manifest are synchronized.
- The all-in-one planner cannot be changed by a Locked Playstyle, unused weak reserve, unavailable elite player or incomplete elite player.
- A Playstyle influences Tactics/Mentor semantics only when active and eligible for the player's current assigned role.
- Shadow Striker is the player-facing SA; `LongShots` is not exposed as a separate owned ability.
- Mixed Medium/High live drain weighting is deliberately nonnumeric until proven.
- Opponent/scouting/relative-strength/live-state inputs remain absent from the decision runtime.

## External-runtime limitation

Real Firebase provider redirects/cross-device sync and real Gemini network calls require their external services and a browser/network. Offline package tests certify the packaged runtime contracts, not those external round trips.

Before handing off a build, create the full ZIP, extract that exact ZIP into a fresh directory, verify the extracted tree, and rerun the recovery-critical gate from the extracted bytes.
