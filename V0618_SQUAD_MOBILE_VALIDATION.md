# v0.6.18 Squad Mobile Detail Validation

PASS

## Fixed scope
Mobile-first Squad roster detail pass only. No stars, no invented player fields, no regenerated Playstyle/Special Ability references.

## Implemented
- Rich phone rows show role artwork, name, roles, age, OVR, glossy position badge, real Playstyle image/name/level, up to two real Special Ability images/names, and chevron.
- 14 transparent individual position badges added under `assets/positions/`. Colour contract: GK/DL/DC/DR green; DML/DMC/DMR/ML/MC/MR/AML/AMC/AMR yellow; ST red; black lettering throughout.
- Six generic role-art files replaced using the already-approved role artwork: red striker, yellow AM/M/DM, green defender, green goalkeeper.
- Swipe-left delete, filters, sort, list/card controls and player-open behaviour preserved.
- Runtime/cache bumped to v0.6.18.

## Verification
- `python tests/release_identity_contract.py` — PASS.
- `python tests/v0618_squad_mobile_detail_contract.py` — PASS.
- inherited `python tests/v0614_squad_fidelity_contract.py` — PASS.
- `python tests/static_checks.py` — PASS: 236 ids, 9 pages.
- `python tests/package_integrity.py` — PASS: 114 core precache files / 5,798,019 bytes.
- `python tests/package_cleanliness.py` — PASS: 958 files / 49,235,600 bytes.
- `node tests/core-tests.js` — PASS: 355 assertions.
- `node tests/scanner_failover_tests.js` — PASS: 11 assertions.
- `python tests/scanner_regression.py` — PASS.
- `node tests/player_update_auto_match.js` — PASS: 11 assertions.
- `node tests/player_update_persistence.js` — PASS: 20 assertions.
- Real Chromium offline viewport audit — PASS: 45/45 page/device combinations; 0 horizontal-overflow cases; 0 console errors.
- 19 frozen JS engine/data files are SHA-256 identical to v0.6.17. Only `js/app.js` (Squad UI/runtime marker) and `js/cloud.js` (runtime diagnostic marker) differ in the JS directory.

## Real-device next step
Deploy v0.6.18 with the user's real cloud squad and review Squad on-device. Continue only Squad-mobile polish until accepted.
