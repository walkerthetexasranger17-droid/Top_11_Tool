# v0.6.31 Training Design Validation

## Scope
Training mobile visual/layout pass plus Home/Squad background transition stability. No football/scanner recalibration.

## Required checks
- Runtime/version/cache identity is v0.6.31 / 0631.
- Home and Squad background geometry remains fixed before and after route activation.
- Approved Training background is present and precached.
- Training has exactly three setup cards.
- No Manage My Drills action exists on the Training page.
- No 6 Drills / Modes / Grey Score strip exists on Training.
- Team tab exposes immediate loading feedback and incremental rendering.
- Category colour classes exist for Attack, Defence, Possession and Physical & Mental.
- Master styling retains category accent and gold outer border.
- Core decision/scanner regressions remain green.

## Executed regression checks
- `python tests/static_checks.py` — PASS (219 IDs / 9 pages).
- `python tests/release_identity_contract.py` — PASS.
- `python tests/cloud_hydration_contract.py` — PASS.
- `python tests/best_in_slot_ui_contract.py` — PASS (29 assertions).
- `python tests/training_mode_ui_contract.py` — PASS (9 assertions).
- `node tests/core-tests.js` — PASS (355 assertions).
- `python tests/scanner_regression.py` — PASS (Scanner VERSION=12).
- `python tests/navigation_render_contract.py` — PASS.
- `python tests/player_update_scan_contract.py` — PASS (31 assertions).
- `python tests/runtime_hardening_contract.py` — PASS.
- `python tests/package_integrity.py` — PASS (116 core precache files; scanner references remain runtime-cached).
- `python tests/package_cleanliness.py` — PASS.
- `python tests/v0629_header_alpha_hotfix_contract.py` — PASS.
- `python tests/v0631_training_design_contract.py` — PASS.
- `python tests/v0631_training_mobile_browser.py` — PASS at 390×844 mobile viewport.

## Browser verification
The mobile browser contract verifies that Home/Squad artwork is already `position: fixed` at the first route frame and retains the same geometry after rendering settles. It also verifies the approved Training background, three-step setup, removed duplicate controls, immediate Team tab switch and completed Team card rendering.
