# Top Eleven Training Tool v5 Beta 1 — Build 30527

This is the first test package using the authoritative build-30527 optimiser handoff while retaining the existing v5 Scanner, player model, tactics and visual rebuild.

## Test priority
1. Add/scan an outfield player and a GK; confirm name, age, OVR, roles and all attributes before saving.
2. Edit an existing player, then return to Training and confirm any old recommendation is gone and a fresh session is required.
3. In My Drills, change one normal drill level/unlock and one Master stock number; return to Training and confirm the saved recommendation is invalidated.
4. Build a six-slot session with Master stock available. Check the Master card display shows owned, used and projected remaining quantities.
5. Mark the whole session completed and confirm Master stock is deducted exactly once.
6. Open Formation with fewer than 11 players and with 11+ players to check the empty state and pitch layout.

## Authoritative training data
The immutable source tables and implementation contract are packaged under `data/build_30527/`. The app's optimiser is built around those files and does not claim to reproduce the unrecovered server-side gain formula.

See `BUILD_NOTES.txt` for the exact Beta 1 integrity changes and `docs/TEST_MATRIX.md` for regression coverage and known limitations.
