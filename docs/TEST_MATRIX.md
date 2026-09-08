# v5 Beta 1 — Build 30527 Test Matrix

## Automated checks
- `node tests/core-tests.js` — source data, role union, My Drills persistence, session invalidation, Master stock limits/deduction, six-slot optimiser invariants, team training separation, formation coordinate integrity, tactics/playmaker retention.
- `python tests/scanner_regression.py` — 11 supplied Top Eleven screenshots, 187 numerical values, GK/outfield layouts and panel location.
- `python tests/static_checks.py` — duplicate IDs, navigation targets, direct DOM references, runtime assets and stale-session integrity hooks.
- `node --check` — every JavaScript source plus service worker.

## Manual phone checks for this Beta
- Add Player button/scan target has no overlap.
- Scanner review/save/update-existing flow.
- My Squad ordering and player profile edit/delete.
- Training save/restore and stale invalidation after player edits or My Drills changes.
- Master stock projection before completion and remaining stock after completion.
- Formation empty state below 11 players and readable pitch layout at 11+ players.
- Bottom navigation, More sheet, Tactics and Playmakers.

## Known boundaries
- Final Top Eleven attribute gain is server-computed; Useful Training Score is a ranking score, not an exact gain prediction.
- Player-name/text OCR uses Tesseract.js loaded from jsDelivr; numeric extraction uses the local Top Eleven-specific recogniser.
- Team Training deliberately excludes unrecovered TeamPlayTraining session/critical/per-drill multipliers.
