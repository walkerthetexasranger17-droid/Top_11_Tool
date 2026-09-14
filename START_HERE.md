# START HERE — Top Eleven Tool

**Current app version: v0.5.10**  
**Game reference: Top Eleven build 30527 / Windows package 27.3.0.0**

This is the single recovery entry point for a new chat/session.

## Read in this order before changing code

1. `docs/continuity/CURRENT_STATE.md`
2. `docs/research/build_30527/V0510_DECISION_ENGINE_CHECKPOINT.md`
3. `docs/research/build_30527/V059_COMMUNITY_LOGIC_CHECKPOINT.md`
4. `docs/research/build_30527/V059_FULL_WINDOWS_GAME_CHECKPOINT.md`
5. `docs/research/build_30527/V058_MENTOR_ST_COMMUNITY_CHECKPOINT.md`
6. `docs/research/build_30527/V057_FORMATION_TACTICS_CHECKPOINT.md`
7. `docs/research/build_30527/V056_CHECKPOINT.md`
8. `docs/research/build_30527/V054_ROLE_PRIORITY_CHECKPOINT.md`
9. `docs/research/build_30527/INDEX.md`
10. `docs/research/build_30527/UNRESOLVED.md`
11. the relevant `docs/research/build_30527/systems/*.md` page
12. machine-readable values under `data/build_30527/index/` when needed
13. inspect the current source and verify the docs still match it

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

v0.5.10 is the **decision-engine foundation**: the app now has transparent joint Formation + Auto Tactics + level-gated Mentor scoring, a separate squad-coverage/recruitment blueprint, and role → Playstyle → tactic-context → deficiency Individual Training priorities. Scanner v0.4.18 remains frozen. The game/native and 2024–26 forum/Reddit research remain the evidence base; `decision_logic_v1.json` is the canonical companion-weight contract. Next work should refine the UI/opponent inputs and validate recommendations against real squads, not restart broad reverse-engineering.

## Important runtime rule

Historical Mentor capture levels/effect arrays are research evidence only. They must never seed the user's current Mentor ownership/level state or be reused as the magnitude for another selected level.

## Parked UI / interaction work

Player Profile redesign is parked, not active. Read `docs/design/PLAYER_PROFILE_TODO.md` only when returning to UI work. Do not let generated mockups trigger an app-shell redesign or introduce data not visible in the single scan screenshot.

Also parked: intermittent multi-click behaviour on Mentor lock/unlock and player delete; and replacement of placeholder Mentor portraits with the official `s1_01..07` renders only after a deterministic `MentorAssetMap` identity mapping is proven.


## v0.5.10 — active implementation state

The research phase has now been converted into a deterministic decision-engine foundation. Read `docs/research/build_30527/V0510_DECISION_ENGINE_CHECKPOINT.md` and `data/build_30527/index/decision_logic_v1.json` before changing Team Plan or Individual Training logic. The central rule is: **best available plan today and ideal squad coverage for future recruitment are separate outputs**. Mentor boost families are level-gated (1/5/10), and Individual Training uses the complete role + Playstyle hierarchy while preserving grey-skill zero utility.
