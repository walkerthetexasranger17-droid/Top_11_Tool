# v0.6.38 Drills + Master Card Validation

## Scope
Drills-page visual restructuring plus consumable Master Card completion behaviour. No calibrated football/training scoring changes.

## Visual contract
- Approved Drills portrait background is active.
- Three summary cards only: Master Cards, Normal Drills Unlocked, Max-Level Drills.
- Master Drill Cards appear before normal drills.
- Normal library is split into Attacking, Defending, Possession, Physical & Mental.
- Category cards use red / green / yellow / blue translucent category treatments.
- Master Cards use category treatment plus gold frame.
- Training six-drill cards share the same category treatment.

## Behaviour contract
- Master Card stock is only deducted on confirmed session completion.
- A session can consume at most the number of cards available when it was built.
- Stock never becomes negative.
- Once stock reaches zero, the next training build excludes that Master Card and recalculates from remaining eligible drills.

## Targeted validation
- `python tests/v0638_drills_master_contract.py`
- `python tests/v0638_drills_mobile_browser.py`
- `node tests/v0638_master_consumption.js`

## Frozen contracts
- Decision/football baseline: v0.5.17.
- Scanner: VERSION=12.

## Final regression results
- `python tests/static_checks.py` — PASS (219 ids, 9 pages).
- `python tests/release_identity_contract.py` — PASS.
- `python tests/cloud_hydration_contract.py` — PASS.
- `node tests/core-tests.js` — PASS, 355 assertions.
- `python tests/scanner_regression.py` — PASS, Scanner VERSION=12.
- `python tests/navigation_render_contract.py` — PASS.
- `python tests/player_update_scan_contract.py` — PASS, 31 assertions.
- `python tests/package_integrity.py` — PASS, 115 core precache files / 6,365,705 bytes.
- `python tests/package_cleanliness.py` — PASS, 999 files / 53,256,212 bytes.
- `python tests/v0638_drills_master_contract.py` — PASS.
- `python tests/v0638_drills_mobile_browser.py` — PASS.
- `node tests/v0638_master_consumption.js` — PASS: one card selected, deducted once, exhausted card excluded from recalculation.
- `python tests/offline_browser_viewport_audit.py --app . --out /mnt/data/v0638-viewport-audit` — PASS: 5 device profiles × 9 pages = 45 combinations, 0 horizontal-overflow cases, 0 console errors.
