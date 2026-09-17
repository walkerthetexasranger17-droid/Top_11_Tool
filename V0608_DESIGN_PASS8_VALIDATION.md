# v0.6.8 Design Pass 8 Validation

## Scope
Add Player / Scanner production redesign plus global landscape-only phone/tablet shell fix.

## Production assets
- Reused authoritative existing `assets/scenes/add-player.webp`.
- Added mirrored/optimised production derivatives:
  - `assets/v060/scenes/scanner-hero-desktop.webp`
  - `assets/v060/scenes/scanner-hero-landscape.webp`
- No mentor, playstyle or Special Ability art was regenerated or replaced.

## Responsive/platform checks
- PWA manifest declares `orientation: landscape`.
- Portrait coarse-pointer phone/tablet view is gated with a rotate-device screen.
- Compact landscape shell reduces app header to 46px and bottom navigation to 48px on short touch viewports.
- Existing v0.6 page heroes are cropped/compacted in landscape rather than switching to separate portrait designs.
- Scanner layout uses two-column workspace in landscape and preserves bottom navigation.

## Automated checks
- `python tests/static_checks.py` — PASS (231 ids, 9 pages).
- `python tests/v060_design_contract.py` — PASS.
- `python tests/release_identity_contract.py` — PASS.
- `python tests/cloud_hydration_contract.py` — PASS.
- `node --check js/app.js` — PASS.
- `node --check js/scanner-engine.js` — PASS.
- `node tests/core-tests.js` — PASS (355 assertions).
- `node tests/scanner_failover_tests.js` — PASS (11 assertions).
- `node tests/player_update_auto_match.js` — PASS (11 assertions).
- `node tests/player_update_persistence.js` — PASS (20 assertions).
- SHA-256 comparison against v0.6.7 confirms scanner engine, training engines, formation, tactics, mentors, Team Plan, best-in-slot, strategy data/logic and canonical decision JSON are byte-identical.

## Result
PASS — v0.6.8 is ready for real-device visual verification. The next planned page unit is Update Players / scan queue workflow.
