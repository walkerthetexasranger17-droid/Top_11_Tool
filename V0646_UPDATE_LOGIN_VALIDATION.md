# v0.6.46 — Update Player + Login Validation

## Scope
Visual-only integration of the four user-approved assets:
- `assets/approved/backgrounds/update-player.png`
- `assets/approved/headers/update-player.png`
- `assets/approved/backgrounds/login.png`
- `assets/approved/branding/login-logo.png`

No football/decision, scanner recognition/calibration, training optimiser, Mastercard, cloud-sync or authentication-flow logic was intentionally changed.

## Visual verification
### Update Player
- Existing Update Players action still activates the scanner page in `.update-mode`.
- Add Player background/title are hidden only in update mode.
- Approved Update Player background/title are displayed.
- Dedicated portrait background covers the mobile page surface below the app header.
- Physio/player focal scene is retained in the upper page area.
- Update queue and scanner workspace remain readable on the established translucent glass surfaces.

### Login
- Approved stadium image is the auth background.
- Approved transparent tactics-board `TOP ELEVEN TOOL` logo is shown inside the auth shell.
- Legacy pseudo/decorative login copy is suppressed.
- Auth shell uses the existing glass hierarchy and blur.
- Google and Email/Password actions remain present; enabled green action retains v0.6.45 parity.

Viewport captures were manually reviewed during the pass and confirmed the intended mobile composition.

## Automated validation results
Passed:
- `tests/v0646_update_login_visual_contract.py`
- `tests/v0646_update_login_mobile_browser.py`
- `tests/release_identity_contract.py`
- `tests/package_integrity.py`
- `tests/package_cleanliness.py`
- `tests/static_checks.py`
- `tests/v0645_green_button_parity.py` — 23 enabled green actions + Team Plan active tab preserve exact computed parity
- `tests/v0642_deep_surface_contract.py`
- `tests/v0634_add_player_mobile_browser.py` — Add Player still uses its approved background/layout
- `tests/scanner_regression.py` — Scanner VERSION=12 compact-reference contract preserved
- `tests/cloud_hydration_contract.py`
- `tests/navigation_queue_contract.py`
- `tests/navigation_render_contract.py`
- `tests/runtime_hardening_contract.py`
- `tests/player_update_scan_contract.py`
- `tests/scanner_image_contract.py`
- `tests/special_ability_picker_contract.py`
- `tests/strategy_logic_data_contract.py`
- `tests/player_update_auto_match.js` — 11 assertions
- `tests/player_update_persistence.js` — 20 assertions
- `tests/core-tests.js` — 355 assertions
- `tests/cloud_local_first_runtime.js`
- `tests/luiu_training_integrity.js`
- `tests/special_ability_role_eligibility.js` — 65 assertions

## Release identity
- UI/runtime: v0.6.46
- Service-worker cache: `te-v0-6-46-update-login-visuals`
- Runtime cache-buster: `?r=0646`
- Decision contract: v0.5.17 frozen
- Scanner: VERSION=12

## Stop condition met
Update Player and Login are visually integrated using only the approved assets and the established glass system, with Add Player, auth behaviour, scanner update behaviour and frozen decision logic regression-checked.
