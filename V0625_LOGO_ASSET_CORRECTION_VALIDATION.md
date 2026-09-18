# v0.6.25 Logo Asset Correction Validation

## Scope
Focused branding asset correction only.

- Replaced `assets/v0624/branding/top-eleven-tool-logo.png` with the corrected transparent master.
- Regenerated root `icon-192.png` and `icon-512.png` from the corrected master.
- Updated runtime/cache markers from v0.6.24 / `0624` to v0.6.25 / `0625`.
- Updated current recovery pointers and continuity notes to v0.6.25.
- No football logic, scanner calibration, training, formation, tactics, mentor or Team Plan logic changes.

## Branding asset hashes
- `assets/v0624/branding/top-eleven-tool-logo.png`: `8b09477d11447c9577e99e251c1139e9afc68660d0f6a0b7c913473d9fd1e536`
- `icon-192.png`: `48fd43ec1aba1cf1666d57e07585be5dccae0183d21091ccf5557c2a0358c863`
- `icon-512.png`: `3ae9eb8f2d8d3a6ecc21dbe279c40468a43ecf1000662899898fa5594a07d043`

## Validation intent
Run the current release/runtime identity and static contracts plus the v0.6.24 mobile hero/branding contract (updated with the new approved logo hashes).

## Executed checks
- `python tests/static_checks.py` — PASS
- `python tests/release_identity_contract.py` — PASS
- `python tests/cloud_hydration_contract.py` — PASS
- `python tests/v0624_mobile_hero_branding_contract.py` — PASS
- `python tests/v0619_squad_compact_nationality_contract.py` — PASS
- `python tests/v0624_mobile_hero_browser.py` — PASS
