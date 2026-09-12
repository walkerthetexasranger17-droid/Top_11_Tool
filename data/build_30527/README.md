# Top Eleven Optimiser Handoff Pack — build 30527

This pack is intended to stop the app implementation from guessing game data.

Files:
- `normal_drills.json/csv` — 29 current normal drills and exact runtime properties.
- `master_campus_drills.json/csv` — four current Drill Lab Masterclass consumables.
- `drill_level_system.json` — exact regular level -> Training Effect mapping.
- `intensity_system.json` — intensity, XP and condition mapping.
- `white_skill_map_30527.json` — authoritative role -> white/key attributes.
- `user_normal_drill_profile_snapshot_20260908.*` — user's captured levels/unlocks, useful as initial saved settings.
- `user_master_card_stock_snapshot_20260908.*` — captured Master stock snapshot.
- `IMPLEMENTATION_CONTRACT.md` — compatibility pointer to the canonical Bible; it must not override `docs/reference/TOP_ELEVEN_TOOL_BIBLE_BUILD_30527_v1.md`.
- `PROVENANCE.md` — where each rule/value came from and what is not claimed.

Do not treat captured user levels/stock as permanent game constants. The fixed drill catalogue and role map are game data; level/unlock/stock are user state.
