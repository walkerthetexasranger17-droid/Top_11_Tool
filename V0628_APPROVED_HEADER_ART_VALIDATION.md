# v0.6.28 Approved Header Art Validation

## Scope
Image-header integration only. No football/scanner/training logic changes.

## Header assets
- `topbar.webp` — `f37d1d293ec840b4c0d006a75168a24277478855ae8359a28463ad2f42d8ae77`
- `home.webp` — `ebe43c07f578fdeaf196a2be550b751458d26d19530ecb142da5e34ec98ea96f`
- `squad.webp` — `3dedc639892d87b3bffb6675669c25a91e6a0d153b227d8d3c7335a07937cd67`
- `training.webp` — `288eb31634a684205efdb45eade037fc3260435950c25938cce7fff7cbd02b38`
- `team-plan.webp` — `b879aeddba5c82c2125ea643656636294f0e69d7bfa9c173105b48379e396215`
- `drills.webp` — `89c8f28a4d5bc8398641ac3df88ef9a05c4df86332051792fc6e6b589d335bd5`
- `settings.webp` — `7818c0c06bb837ef1cdee6830fcc2002908d904b4c2c5ebd735d9d1626e547cb`
- `add-player.webp` — `5f6fe3e0a4d07c30d7d3966cf57985b5ee18d79011b742414e2e3c2864119b68`
- `manager-profile.webp` — `4de0524e1464e77627f9884f24edb5d47a55bf4aed53d465a5f3bb0c672d1d42`

## Required checks
- All eight page-header assets are 1774×887 transparent WebP images.
- Global top-bar artwork is transparent WebP.
- All converted pages reference their approved image asset.
- Topbar + Home header art are install-precached; the remaining page headers are runtime-cached on first use to keep the PWA install cache bounded.
- No Player Profile header conversion in this pass.
- v0.6.28 cache/runtime markers are synchronized.
- Core/static/scanner/browser regressions pass before release.

## Executed regression checks
- `python tests/v0628_header_art_contract.py` — PASS
- `python tests/static_checks.py` — PASS
- `python tests/release_identity_contract.py` — PASS
- `python tests/cloud_hydration_contract.py` — PASS
- `node tests/core-tests.js` — PASS (355 assertions)
- `python tests/scanner_regression.py` — PASS
- `python tests/scanner_image_contract.py` — PASS
- `python tests/runtime_hardening_contract.py` — PASS
- `python tests/navigation_render_contract.py` — PASS
- `python tests/v0628_mobile_browser.py` — PASS
- `python tests/package_integrity.py` — PASS
- `python tests/package_cleanliness.py` — PASS
- `python tests/best_in_slot_ui_contract.py` — PASS (29 assertions)
- `python tests/player_update_scan_contract.py` — PASS (31 assertions)
- `python tests/special_ability_picker_contract.py` — PASS (11 assertions)
- `python tests/training_mode_ui_contract.py` — PASS (9 assertions)
- `python tests/set_piece_coverage_ui_contract.py` — PASS (13 assertions)
- `python tests/strategy_logic_data_contract.py` — PASS
