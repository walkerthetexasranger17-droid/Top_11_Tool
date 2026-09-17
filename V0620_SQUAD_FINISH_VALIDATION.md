# v0.6.20 Squad Finishing Validation

PASS

## Fixed scope completed
- Removed the Squad filter panel completely.
- Added `Role Order (GK → ST)` to the Squad sort options.
- Approved role order is exactly `GK → DL → DC → DR → DMC → ML → MC → MR → AML → AMC → AMR → ST`.
- DML and DMR are excluded because they are not current game positions.
- Kept the accepted v0.6.19 compact mobile Squad row unchanged.
- Explicitly guarded the shared Top Eleven Tool header as visible/sticky on mobile/tablet Squad.
- Removed the old interactive filter behaviour from the Needs Attention stat so there is no hidden/invisible filter state.

## Sorting behaviour
Role Order ranks players by their primary saved role. Players sharing a role are ordered by OVR descending, then name.

## Regression verification
PASS:
- `node --check js/app.js`.
- `python tests/v0620_squad_finish_contract.py`.
- inherited `python tests/v0619_squad_compact_nationality_contract.py`.
- `python tests/release_identity_contract.py`.
- `python tests/static_checks.py`: 229 IDs / 9 pages.
- `python tests/cloud_hydration_contract.py`.
- `python tests/navigation_render_contract.py`.
- `python tests/navigation_queue_contract.py`.
- `python tests/runtime_hardening_contract.py`.
- `python tests/button_binding_contract.py`: 88 buttons wired.
- `python tests/package_integrity.py`: 114 core precache files / 5,805,054 bytes; scanner references runtime-cached.
- `python tests/package_cleanliness.py`: 960 files / 48,989,906 bytes; no scratch/pre-edit/archive baggage.
- `node tests/core-tests.js`: 355 assertions.
- `node tests/scanner_failover_tests.js`: 11 assertions.
- `python tests/scanner_regression.py`.
- `node tests/player_update_auto_match.js`: 11 assertions.
- `node tests/player_update_persistence.js`: 20 assertions.
- Real Chromium viewport audit: 45 page/device combinations; 0 horizontal-overflow cases; 0 console errors.

## Frozen logic comparison
Compared the v0.6.20 `js/` directory to v0.6.19. Only `app.js` (Squad UI/sort/runtime marker) and `cloud.js` (runtime diagnostic marker) changed. All other JS engine/data files, including scanner v12, training, formation, tactics, mentors, Team Plan, Best-in-Slot and strategy data, are byte-identical.

## Stop condition
MET. Full ZIP was created, extracted into a clean directory, and that exact extracted package passed release identity, focused Squad contract, static checks, 355 core assertions, and the 45/45 real-Chromium device/page audit with zero overflow and zero console errors.
