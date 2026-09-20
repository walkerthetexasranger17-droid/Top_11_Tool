# v0.5.6 Research / Continuity Checkpoint

**Date:** 14 September 2026  
**Runtime behaviour:** intentionally unchanged from v0.5.5  
**Active research target:** evidence-backed role/action attribute importance

## Why this checkpoint exists

The project briefly explored a future collectible-style Player Profile design. That work is useful but is not the current development priority. v0.5.6 parks the UI concepts safely inside the app package and returns the active task to reverse-engineering which player attributes actually matter most for match actions / roles.

## Preserved research immediately before this checkpoint

- Current Roelandt/Lataille re-test: displayed Lineup Balance remains 9.9 with either ST, so Balance must not be used as proof of ST attribute weighting.
- Tier/OVR formula is preserved in `systems/tier_ovr.md`.
- Outfield Tier OVR contribution is supported by game UI + arithmetic as `Tier bonus × unique player-wide key-count / 15` before displayed rounding.
- Player-wide key attributes for multi-natural-role players use the union of the natural-role key sets.
- Pre-Tier/base profiles may be reconstructed for research/training analysis by subtracting the Tier bonus from key attributes, but match-facing player values remain post-Tier unless evidence says otherwise.
- White/key membership is proven; unequal importance inside the white set is **not** yet proven.

## Parked Player Profile work

See `docs/design/PLAYER_PROFILE_TODO.md` and `data/build_30527/index/ui_todo.json`.

Hard rules:

- single screenshot only;
- do not invent fields Gemini cannot see;
- portrait generation/cropping is optional cosmetics and cannot destabilise scanner data extraction;
- support both mobile and desktop/web;
- preserve existing global app navigation/theme;
- generated profile mockups are visual references only and contain placeholder assets;
- use genuine game Tier/Playstyle/SA assets when implementation resumes.
- original user-supplied Tier asset archive is embedded at `source_archive/tier_assets/TopEleven_Tier_Assets_Source.rar`; preserve it for future extraction/use.

## Resume research here

1. Search build-30527 native metadata/code/assets for attribute consumers tied to concrete football actions.
2. Start with high-value action families: shooting/finishing, passing, dribbling, crossing/aerial, defending, goalkeeper actions.
3. Look for explicit formulas, coefficients, attribute subsets, action checks, comparators, setup structs, or server/result DTO semantics.
4. Separate client/highlight presentation logic from authoritative match-engine evidence.
5. Do not invent role weights if the game does not expose them.
6. Feed any proven hierarchy back into Target Formation/recruitment and Training only after evidence is checkpointed.
