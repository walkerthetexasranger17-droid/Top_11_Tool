# v0.6.9 Design Pass 9 Validation

## Fixed scope
Global shell correction requested from real-device testing, then Update Players / scan queue only.

## Orientation / responsive result
- Removed the v0.6.8 rotate-to-landscape blocker.
- PWA manifest now allows `orientation: any`.
- Landscape remains the preferred/full-density phone/tablet presentation.
- Coarse-pointer portrait now uses the same approved visual system in compact-fit mode: ~50px header, ~50px bottom navigation, reduced controls/spacing and a scaled content canvas.
- Desktop continues to use the left sidebar; phone/tablet continue to use bottom navigation.

## Update Players result
- Reused the existing production Scanner hero assets; no duplicate/fake artwork was needed.
- Added a dedicated Update Players overview showing real squad size, queue remaining, automatic saves completed and items needing review/retry.
- Update mode now has distinct production copy/state while preserving the same Scanner page and real workflow.
- Existing name matching, age/skills-only writes, derived OVR, queue persistence, retry/review safeguards and identity preservation are unchanged.

## Automated checks
- `python tests/static_checks.py` — PASS (235 ids, 9 pages).
- `python tests/v060_design_contract.py` — PASS.
- `python tests/release_identity_contract.py` — PASS.
- `python tests/cloud_hydration_contract.py` — PASS.
- `python tests/navigation_render_contract.py` — PASS.
- `python tests/navigation_queue_contract.py` — PASS.
- `python tests/runtime_hardening_contract.py` — PASS.
- `python tests/button_binding_contract.py` — PASS (90 bound buttons).
- `python tests/scanner_image_contract.py` — PASS.
- `python tests/scanner_regression.py` — PASS.
- `python tests/package_integrity.py` — PASS (73 core precache files).
- `node --check js/app.js` — PASS.
- `node --check js/scanner-engine.js` — PASS.
- `node tests/core-tests.js` — PASS (355 assertions).
- `node tests/scanner_failover_tests.js` — PASS (11 assertions).
- `node tests/player_update_auto_match.js` — PASS (11 assertions).
- `node tests/player_update_persistence.js` — PASS (20 assertions).

## Inherited baseline checks
Two maintenance tests already fail in the untouched v0.6.8 baseline and were not introduced by this pass:
- `python tests/player_update_scan_contract.py` — baseline failure: `Master card stock renders above normal drills` (unrelated Training DOM-order assertion).
- `python tests/package_cleanliness.py` — baseline v0.6.8 already exceeds the historical file-count maintenance ceiling (751 files before this pass).
These are recorded rather than altered because Pass 9 is not allowed to change unrelated Training/package-history behaviour.

## Frozen-engine comparison
SHA-256 comparison with v0.6.8 confirms byte-identical scanner engine, Training engines, Formation, Tactics, Mentor, Team Plan, Best-in-Slot, strategy data/logic and canonical decision JSON/string data.

## Result
PASS — v0.6.9 completes the planned shell correction and Update Players / queue visual unit without changing calibrated football/scanner logic.
