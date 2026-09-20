# v0.6.12 Design Pass 12 Validation

## Fixed scope
Recover real browser viewport QA without weakening managed Chromium policy, then correct only the portrait overflow proven by that real browser audit. No alternative visual direction, new product feature, production game-asset replacement or football/scanner/calibration logic change.

## Browser environment root cause
Chromium itself is healthy. The execution image contains `/etc/chromium/policies/managed/000_policy_merge.json` with managed `URLBlocklist: ["*"]`. Normal localhost, file and data navigation is therefore rejected with `net::ERR_BLOCKED_BY_ADMINISTRATOR`. The earlier one-shot `--dump-dom` / `--screenshot` workflow appeared to hang around the blocked navigation.

Pass 12 does **not** delete, edit or bypass that managed policy. `tests/offline_browser_viewport_audit.py` stays on `about:blank`, injects the shipped app via Playwright `page.set_content()`, embeds local CSS/images/scripts as data URIs, and supplies only in-memory storage/cloud transport shims needed for deterministic responsive rendering.

## Reproduced v0.6.11 failure
Running the new harness against the untouched v0.6.11 baseline reproduces 18 horizontal-overflow failures:
- 768x1024 portrait tablet: all 9 audited pages measure 904px document width;
- 390x844 portrait phone: all 9 audited pages measure 488px document width.

Cause: the compact portrait rules widened `main` to 125% / 117.65% and relied on CSS `zoom:.8` / `.85`. Chromium still counts the widened layout in document overflow.

## v0.6.12 fix
- Portrait coarse-pointer `main` is a true 100%-viewport layout (`width:100%`, `zoom:1`, no transform).
- Compact portrait shell, reduced controls/type/spacing, approved page art and bottom navigation remain.
- At 700–900px portrait touch widths, only workspaces whose retained desktop minimums exceed the physical viewport reflow: Squad, Scanner and Drills. Team Plan's forced portrait minimum remains removed.
- Desktop fine-pointer shell remains the sidebar; touch tablets/phones remain bottom-nav.

## Real Chromium viewport matrix
`python tests/offline_browser_viewport_audit.py --screenshots` — **PASS**

Profiles:
- desktop 1440x900 / fine pointer;
- tablet landscape 1180x820 / coarse pointer;
- tablet portrait 768x1024 / coarse pointer;
- phone landscape 844x390 / coarse pointer;
- phone portrait 390x844 / coarse pointer.

Pages: Home, Squad, Player Profile, Add Player/Scanner, Training, Drills, Team Plan, Settings, Account.

Result: **45/45 page/view combinations pass; 0 horizontal document overflow; 0 console errors; expected navigation mode on every profile.**

## Automated regressions
- `python tests/v060_design_contract.py` — PASS.
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
Unchanged historical maintenance probes:
- `python tests/player_update_scan_contract.py` — FAIL: `Master card stock renders above normal drills` (historical Training DOM-order assertion; unrelated to Pass 12).
- `python tests/package_cleanliness.py` — FAIL: package file count exceeds the old maintenance ceiling (769 in working tree after required Pass 12 continuity/test additions).

## Frozen-engine comparison
SHA-256 comparison against the verified v0.6.11 baseline confirms byte-identical:
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
**PASS — v0.6.12 restores real Chromium viewport QA safely, fixes the measured portrait overflow and preserves the frozen v0.5.17 decision/calibration contract.**
