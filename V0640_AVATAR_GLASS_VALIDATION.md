# v0.6.40 Avatar + Glass Surface Validation

## Scope
Global visual polish only: centre/improve manager account imagery and reduce the opacity of dark application surfaces so approved backgrounds remain more visible.

## Avatar contract
- Top-right account avatar and Manager Profile use the same centred image treatment.
- Google-hosted profile URLs with a resizable `sNN` token are upgraded to a larger requested source.
- Top-right app chrome requests up to 256px; Manager Profile requests up to 384px.
- A failed high-resolution request retries the original profile-photo URL.
- Non-Google profile-image URLs are not rewritten.
- No generated/upscaled image asset is bundled.

## Surface contract
- Major cards/panels use translucent navy gradients rather than near-opaque 0.96–0.99 surfaces.
- Secondary rows/tiles and fields are slightly translucent too.
- No blanket heavy backdrop blur was added to scrolling lists.
- v0.6.39 drill category surfaces remain category-coloured and Master Cards keep their gold frame.

## Direct photo URL probe
- `https://lh3.googleusercontent.com/a/abc=s96-c` -> `...=s256-c`
- `https://lh3.googleusercontent.com/a-/abc=s96-c-k-no` -> `...=s384-c-k-no`
- non-Google URLs are preserved unchanged.

## Regression results
- `python tests/static_checks.py` — PASS (219 ids, 9 pages).
- `python tests/release_identity_contract.py` — PASS.
- `python tests/cloud_hydration_contract.py` — PASS.
- `node tests/core-tests.js` — PASS, 355 assertions.
- `python tests/scanner_regression.py` — PASS, Scanner VERSION=12.
- `python tests/navigation_render_contract.py` — PASS.
- `python tests/player_update_scan_contract.py` — PASS, 31 assertions.
- `node tests/v0638_master_consumption.js` — PASS.
- `python tests/v0639_drill_tint_mobile_browser.py` — PASS; category tint/gold treatment preserved.
- `python tests/v0637_manager_profile_mobile_browser.py` — PASS.
- `python tests/v0640_avatar_glass_contract.py` — PASS.
- `python tests/v0640_avatar_glass_mobile_browser.py` — PASS.
- `python tests/package_integrity.py` — PASS, 115 core precache files / 6,374,676 bytes.
- `python tests/package_cleanliness.py` — PASS, 1000 files / 50,625,035 bytes.
- `python tests/offline_browser_viewport_audit.py --app . --out /mnt/data/v0640-viewport-audit` — PASS: 5 device profiles × 9 pages = 45 combinations, 0 horizontal-overflow cases, 0 console errors.

## Recovery cleanup
To keep the recovery package at its existing maintenance ceiling, four obsolete duplicate root handoff files (`v0.6.7`–`v0.6.10`) were removed. Their exact copies remain under `docs/continuity/`. Browser-test screenshots are written to `/mnt/data` rather than embedded in the recovery tree.

## Frozen contracts
- Decision/football baseline: v0.5.17.
- Scanner: VERSION=12.
- Master Card inventory/consumption behaviour unchanged.
- Account security/Firebase persistence unchanged.
