# v5.2.4 — Build 30527 Test Matrix

## Automated checks
- `node tests/core-tests.js` — authoritative data, player/session integrity, optimiser invariants, white-skill coverage scoring, Master stock, Team Training separation, formation/tactics/playmakers and Scanner v2 reconciliation safeguards.
- `python tests/scanner_regression.py` — 12 permanent Top Eleven screenshots / 204 numerical fields, including Richard Kilroy OVR 136, GK/outfield layouts and panel location.
- `python tests/static_checks.py` — duplicate IDs, navigation, DOM references, assets, scanner save-gate hooks and product-name consistency.
- `python tests/package_integrity.py` — service-worker runtime cache and manifest integrity.
- `node --check` — every JavaScript source and service worker.

## v5.2.4 optimiser acceptance
- Multi-position white skills remain the authoritative union for all saved positions.
- Grey attributes have zero influence on Individual Training score: they do not add value, dilute useful white return or create a penalty.
- A drill's useful need is the sum of adjusted need across every white/key attribute that drill can train.
- Drill score is `strength × summed useful white need`; strength remains authoritative XP × saved Training Effect.
- Strong/high-intensity multi-white drills therefore outrank comparable one-white drills when several targeted white attributes need work.
- After each slot, balancing credit is applied to every white attribute hit and all legal drills are rescored.
- Normal duplicates remain allowed. Master/Campus duplicates remain limited by owned stock.
- Condition cost remains displayed but is not the primary objective.
- No exact server-side +X% gain is claimed.
- Permanent Stanek GK test verifies Goalkeeper Training (5 white targets) outranks Fast Counter-Attacks (1 GK white target) under the captured drill profile.

## Scanner acceptance retained
- Existing Scanner v2 deep numeric pass remains unchanged.
- No synthetic value may be created just to make OVR match.
- Any unresolved Defence/Attack/Physical/Goalkeeping/OVR check blocks Save/Update.
- Editing OVR or parsed skill values re-runs checks immediately.

## Manual phone checks
- Build a session for Jiri Stanek and confirm drill cards visibly show multi-white target counts.
- Re-test an outfield player to confirm multi-white coverage also behaves sensibly there.
- Confirm Scanner, My Drills, Formation, Tactics and Playmakers remain unchanged.

## Known boundaries
- Final Top Eleven training gain remains server-computed and is not predicted.
- Player-name/text OCR still uses Tesseract.js from jsDelivr; numeric recognition remains local.
- The build-30527 JSON catalogue remains authoritative and unchanged.
