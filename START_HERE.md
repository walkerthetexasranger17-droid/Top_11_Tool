# START HERE — Top Eleven Tool

**Current app version: v0.5.8**  
**Game reference: Top Eleven build 30527 / Windows package 27.3.0.0**

This is the single recovery entry point for a new chat/session.

## Read in this order before changing code

1. `docs/continuity/CURRENT_STATE.md`
2. `docs/research/build_30527/V058_MENTOR_ST_COMMUNITY_CHECKPOINT.md`
3. `docs/research/build_30527/V057_FORMATION_TACTICS_CHECKPOINT.md`
4. `docs/research/build_30527/V056_CHECKPOINT.md`
5. `docs/research/build_30527/V054_ROLE_PRIORITY_CHECKPOINT.md`
6. `docs/research/build_30527/INDEX.md`
7. `docs/research/build_30527/UNRESOLVED.md`
8. the relevant `docs/research/build_30527/systems/*.md` page
9. machine-readable values under `data/build_30527/index/` when needed
10. inspect the current source and verify the docs still match it

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

v0.5.8 preserves the closed Formation + Tactics **v1 research baseline**, records that production Mentor logic still lacks Signature-aware ranking, and now embeds a complete evidence-rule design for all seven Signatures in `mentor_signature_rule_design.json`. ST Special-Ability weighting is intentionally unresolved; Target Man has a strong cross/aerial-service tactic context while False Nine/Poacher remain qualitative. The long-term Target Formation remains `GK / DL DC DC DR / DMC MC / AML AMC AMR / ST`. **Active target: test/productionise the Signature-aware Mentor pre-match + halftime layer, then use the ST evidence workflow as the template for AML/AMR.**

## Important runtime rule

Historical Mentor capture levels/effect arrays are research evidence only. They must never seed the user's current Mentor ownership/level state or be reused as the magnitude for another selected level.

## Parked UI / interaction work

Player Profile redesign is parked, not active. Read `docs/design/PLAYER_PROFILE_TODO.md` only when returning to UI work. Do not let generated mockups trigger an app-shell redesign or introduce data not visible in the single scan screenshot.

Also parked: intermittent multi-click behaviour on Mentor lock/unlock and player delete; and replacement of placeholder Mentor portraits with the official `s1_01..07` renders only after a deterministic `MentorAssetMap` identity mapping is proven.
