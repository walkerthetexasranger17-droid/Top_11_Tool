# v0.6.11 Design Pass 11 Validation

## Fixed scope
Narrow responsive polish verification only. Correct proven edge-breakpoint cascade faults from v0.6.10; no new page/features and no football/scanner/calibration changes.

## Findings fixed
- Narrow portrait phones (<=460px coarse pointer): late compact rules could constrain the Squad hero copy to 58% while two 125px actions remained on one flex row. The hero now uses the available width and the two actions use the approved two-column mobile grid with no forced minimum width.
- Narrow portrait tablets (700–767px coarse pointer): the portrait compact canvas could re-expand Scanner review, Team Plan and Drills beyond the effective 0.85 canvas. Scanner review restores the approved two-column tablet arrangement, Team Plan removes the late 860px minimum, and Drills restores its approved single-column workspace/master layout.
- No new production artwork was needed; authoritative game-extracted Mentor, Playstyle and Special Ability assets remain unchanged.

## Browser viewport QA
Chromium is installed but local HTTP/file navigation still hangs in this execution environment. Live browser screenshot QA remains:

**ENVIRONMENT BLOCKED — NOT APPLICATION FAILURE**

Pass 11 therefore uses deterministic responsive-cascade/source contracts. Real-device screenshots remain the final visual confirmation.

## Automated checks
- `python tests/v060_design_contract.py` — PASS (Pass 10 baseline + narrow-phone Squad actions + narrow-tablet Scanner/Team Plan/Drills reflow).
- `python tests/static_checks.py` — PASS (235 ids, 9 pages).
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

## Inherited maintenance-test status
The same unrelated historical maintenance failures remain:
- `python tests/player_update_scan_contract.py` — FAIL: `Master card stock renders above normal drills` (historical Training DOM-order assertion; unrelated to Pass 11).
- `python tests/package_cleanliness.py` — FAIL: package file count 763 exceeds the historical maintenance ceiling. Pass 11 adds required continuity/validation records and does not delete research/history outside scope.

## Frozen-engine comparison
SHA-256 comparison against the supplied verified v0.6.10 baseline confirms byte-identical:
- Scanner engine;
- Training/team-training engines;
- Formation;
- Tactics;
- Mentor;
- Team Plan;
- Best-in-Slot data/engine;
- strategy/optimizer data and logic;
- canonical decision JSON, strategy strings and decision manifest.

## Result
PASS — v0.6.11 applies only the two proven responsive edge fixes and preserves the frozen football/scanner/calibration contract. Real-device screenshot confirmation remains the next visual step.
