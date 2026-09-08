# v5 Beta 2 — Build 30527 Test Matrix

## Automated checks
- `node tests/core-tests.js` — authoritative data, player/session integrity, optimiser invariants, Master stock, Team Training separation, formation/tactics/playmakers, plus Scanner v2 OVR reconciliation safeguards.
- `python tests/scanner_regression.py` — existing 11 supplied Top Eleven screenshots / 187 numerical fields, GK/outfield layouts and panel location.
- `python tests/static_checks.py` — duplicate IDs, navigation, DOM references, assets, scanner save-gate hooks and product-name consistency.
- `python tests/package_integrity.py` — service-worker runtime cache and manifest integrity.
- `node --check` — JavaScript sources and service worker.

## Scanner Beta 2 acceptance
- Existing clean scanner fixture set remains unchanged.
- If OVR conflicts with reconciled skill values, alternate recognised OVR candidates are considered before declaring the scan unresolved.
- No synthetic value may be created just to make OVR match.
- Any unresolved Defence/Attack/Physical/Goalkeeping/OVR check blocks Save/Update.
- Editing OVR or parsed skill values re-runs checks immediately.
- Save becomes available only when numerical verification passes.

## Manual phone checks
- Normal outfield, multi-role and GK scans.
- Known mismatch screenshot when supplied.
- Add/update-existing player flow after scanner verification.
- Installed PWA/app label reads `Top Eleven Tool`.
- Training, My Drills, Formation, Tactics and Playmakers remain visually/functionally unchanged from Beta 1.

## Known boundaries
- Final Top Eleven training gain remains server-computed and is not predicted.
- Player-name/text OCR still uses Tesseract.js from jsDelivr; numeric recognition remains local.
- The exact newly reported failing screenshot is not part of the regression folder until the user supplies it.
