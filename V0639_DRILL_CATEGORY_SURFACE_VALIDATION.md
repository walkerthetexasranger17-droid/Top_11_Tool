# v0.6.39 Drill Category Surface Validation

## Scope
Visual correction only: category tint belongs to the drill card/container surface, not to the drill artwork.

## Visual contract
- Attacking cards: red translucent surface.
- Defending cards: green translucent surface.
- Possession cards: yellow translucent surface.
- Physical & Mental cards: blue translucent surface.
- Master Cards: correct category-tinted interior plus gold frame.
- Individual Training generated cards use the same category surface treatment.
- Team Training rows use the same category surface treatment.
- Drill images are not filtered/tinted.

## Root cause corrected
v0.6.38 attached the correct category classes, but the Drills-page card rules also declared generic cyan custom properties at higher CSS specificity. This caused Master Cards (and some library surfaces) to inherit the cyan fallback rather than their category colour. v0.6.39 makes the category properties authoritative and strengthens the container tint while leaving the drill image untouched.

## Targeted validation
- `python tests/v0639_drill_tint_mobile_browser.py` — PASS. Four distinct Master Card category accents, tinted normal/training card surfaces, gold Master frames, and no drill-image filter.
- `python tests/v0633_training_results_mobile_browser.py` — PASS. Six generated drills remain visible after build/cloud acknowledgement.
- `node tests/v0638_master_consumption.js` — PASS. Master Card inventory behaviour unchanged.

## Frozen contracts
- Decision/football baseline: v0.5.17.
- Scanner: VERSION=12.
- Master Card completion/deduction behaviour unchanged from v0.6.38.

## Full regression results
- `python tests/static_checks.py` — PASS (219 ids, 9 pages).
- `python tests/release_identity_contract.py` — PASS.
- `python tests/cloud_hydration_contract.py` — PASS.
- `node tests/core-tests.js` — PASS, 355 assertions.
- `python tests/scanner_regression.py` — PASS, Scanner VERSION=12.
- `python tests/navigation_render_contract.py` — PASS.
- `python tests/player_update_scan_contract.py` — PASS, 31 assertions.
- `python tests/package_integrity.py` — PASS, 115 core precache files / 6,369,221 bytes.
- `python tests/package_cleanliness.py` — PASS, 999 files / 50,616,381 bytes.
- `python tests/offline_browser_viewport_audit.py --app . --out /mnt/data/v0639-viewport-audit` — PASS: 5 device profiles × 9 pages = 45 combinations, 0 horizontal-overflow cases, 0 console errors.
