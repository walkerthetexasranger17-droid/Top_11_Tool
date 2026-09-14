# START HERE — Top Eleven Tool

**Current app version: v0.5.6**  
**Game reference: Top Eleven build 30527 / Windows package 27.3.0.0**

This is the single recovery entry point for a new chat/session.

## Read in this order before changing code

1. `docs/continuity/CURRENT_STATE.md`
2. `docs/research/build_30527/V054_ROLE_PRIORITY_CHECKPOINT.md`
3. `docs/research/build_30527/V053_RESEARCH_CHECKPOINT.md`
4. `docs/research/build_30527/INDEX.md`
5. `docs/research/build_30527/UNRESOLVED.md`
6. the relevant `docs/research/build_30527/systems/*.md` page
7. machine-readable values under `data/build_30527/index/` when needed
8. inspect the current source and verify the docs still match it

Do **not** restart old reverse-engineering work unless the index says the evidence is missing/superseded. Do **not** invent Top Eleven formulas or values.

## Required first response in a recovered/new chat

After reading those files, tell the user briefly:

- current app version;
- what is stable/frozen;
- what was most recently completed;
- current research/development target;
- next 2-4 actions;
- any genuinely required external file that is not already embedded.

Do not ask the user to re-explain the project first.

## One-line checkpoint

v0.5.6 preserves all prior runtime logic, Tier/OVR and current Balance corrections, and parks the responsive collectible-style Player Profile as a documented future TODO. **Active target: seek authoritative role/action attribute priority from build-30527 native/game data; do not use Lineup Balance as a weighting oracle and do not invent skill weights or training targets.**

## Important runtime rule

Historical Mentor capture levels/effect arrays are research evidence only. They must never seed the user's current Mentor ownership/level state or be reused as the magnitude for another selected level.

## v0.5.6 parked UI reference

Player Profile redesign is parked, not active. Read `docs/design/PLAYER_PROFILE_TODO.md` only when returning to UI work. Current active task remains build-30527 role/action attribute-priority research. Do not let generated mockups trigger an app-shell redesign or introduce data not visible in the single scan screenshot.
