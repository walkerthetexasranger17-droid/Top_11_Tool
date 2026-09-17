# v0.6.10 Design Pass 10 Validation

## Fixed scope
Cross-device consistency / responsive QA only across the complete redesigned app. No new feature/page work and no football/scanner/calibration changes.

## Findings fixed
- Coarse-pointer tablets at 1024–1180px could inherit the desktop sidebar because the original desktop breakpoint was width-only. They now retain bottom navigation while desktop/laptop pointer devices keep the sidebar.
- Late v0.6.9 portrait compact-fit rules could override existing phone layouts and force unnecessarily wide workspaces. Phone portrait now restores appropriate single-column/mobile reflows for Home, Squad, Scanner/Update Players, Training, Drills, Team Plan, Settings and Account while retaining the compact same-design shell/zoom treatment.
- No new production artwork was required. Existing v0.6 heroes and authoritative game-extracted Mentor, Playstyle and Special Ability assets remain unchanged.

## Browser viewport QA
A Chromium executable is installed, but this execution environment blocks browser navigation to both local HTTP and local file URLs. The attempted live viewport audit is therefore classified as:

**ENVIRONMENT BLOCKED — NOT APPLICATION FAILURE**

Deterministic responsive/source contracts plus the existing regression suite were used for this pass. Real-device review remains the final visual confirmation step.

## Automated checks
- `python tests/v060_design_contract.py` — PASS (v0.6.10 tablet bottom-nav + phone portrait reflow markers).
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
The same two unrelated maintenance failures recorded in v0.6.9 remain:
- `python tests/player_update_scan_contract.py` — FAIL: `Master card stock renders above normal drills` (historical Training DOM-order assertion; unrelated to responsive Pass 10).
- `python tests/package_cleanliness.py` — FAIL: package file count 759 exceeds the old maintenance ceiling. v0.6.9 already exceeded the historical ceiling; Pass 10 does not delete research/reference/history files outside scope.

## Frozen-engine comparison
SHA-256 comparison against the supplied v0.6.9 baseline confirms byte-identical:
- Scanner engine;
- Training/team-training engines;
- Formation;
- Tactics;
- Mentor;
- Team Plan;
- Best-in-Slot data/engine;
- strategy/optimizer data and logic;
- canonical decision JSON and strategy strings.

## Result
PASS — v0.6.10 completes the planned cross-device consistency/responsive QA source pass without changing frozen football/scanner logic. Live browser viewport execution is environment-blocked and real-device visual review remains the next step.
