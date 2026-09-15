# Top Eleven Tool v0.5.14 — Test Matrix

This is the current final pre-calibration release-test record.

## Automated release checks

Run from the project root:

```bash
node tests/core-tests.js
node tests/scanner_failover_tests.js
node tests/cloud_local_first_runtime.js
python tests/strategy_logic_data_contract.py
python tests/scanner_regression.py
python tests/scanner_image_contract.py
python tests/navigation_queue_contract.py
python tests/navigation_render_contract.py
python tests/static_checks.py
python tests/package_integrity.py
python tests/cloud_hydration_contract.py
python tests/v0412_patch_contract.py
python tests/v0413_reference_contract.py
python tests/v0414_scanner_level_contract.py
python tests/v0414_badge_locator_fixtures.py
python tests/v0415_compact_reference_contract.py
python tests/v0416_pixel_level_guard_contract.py
python tests/v0417_native_source_playstyle_contract.py
python tests/v0418_all_native_resolution_contract.py
```

Also run `node --check` against every `js/*.js` file and `sw.js`.

## v0.5.14 source-tree result

- Core deterministic suite: **PASS — 337 assertions**.
- Strategy data contract: **PASS — 12 roles / 28 Role+Playstyle profiles / 11 Formation rules / 60 Tactic rules / 143 strings**.
- Scanner Live/failover and scanner regression/reference contracts: **PASS**.
- Cloud local-first and hydration contracts: **PASS**.
- Navigation/render/queue contracts: **PASS**.
- Static checks and service-worker/package integrity: **PASS**.
- JavaScript syntax: **PASS** for every runtime JS file and `sw.js`.

## v0.5.14 specific protected behaviours

- Verified drill intensity ladder is exactly Very Easy/Easy/Medium/Hard/Very Hard = **1/2/3/4/5 XP per player** and **0.75/1.5/2.25/3.0/3.75 condition**.
- With identical useful target-gap coverage and drill-level effect, harder drills strictly outrank easier drills in **Max Growth**.
- Harder intensity is not a blanket override: better Role+Playstyle target-gap coverage can outrank a harder low-need drill.
- Captain is auto-filled for UX completeness but contributes **zero** to Formation/Tactics/Mentor/Set-Piece-readiness/final Team Plan scoring.
- The pre-match decision runtime contains no opponent/scouting/relative-strength/live-state inputs.
- Scanner v0.4.18 native-resolution/reference contracts remain frozen.

## External-runtime limitation

Real Firebase sign-in/provider redirects, Firestore cross-device sync and real Gemini scanner calls require their external services and a browser/network. Offline package tests certify the packaged runtime contracts, not those external round trips.

Before release, create the ZIP, extract that exact ZIP into a fresh directory and re-run this matrix from the extracted bytes.
