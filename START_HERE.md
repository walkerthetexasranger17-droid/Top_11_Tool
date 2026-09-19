# v0.6.50 — START HERE

**CURRENT UI BRANCH:** v0.6.50 — Team Plan Formation spacing + true Set Piece pitch map.  
**DECISION BASELINE:** v0.5.17 release-frozen.  
**SCANNER:** VERSION 12.

## Locked Team Plan assets
Do not crop, regenerate, resample, recompress or replace these without explicit user approval:
- `assets/v0649/team-plan/formation-pitch.png`
- `assets/v0649/team-plan/player-shirt.png`
- `assets/v0649/team-plan/player-nameplate.png`

## Current Team Plan contract
- **Formation:** recommended XI only on the locked pitch. Shirts/nameplates are deliberately smaller on mobile to prevent crowding.
- **Set Pieces:** a separate pitch map showing only the assigned takers — Corner Kick L/R, Free Kick L/R, PEN 1–5 and Captain. It must not repeat the Formation XI.
- The Set Pieces **AUTO chip/header copy and automatic-recommendation footnote are intentionally removed** because assignments are already preselected by the plan.
- Best-in-Slot XI, Squad Blueprint and Build Best Match Plan remain removed.
- Tactics/Mentor are unchanged.

Read `DESIGN_RECOVERY_HANDOFF_v0.6.50.md` and `V0650_TEAM_PLAN_SET_PIECE_MAP_VALIDATION.md` before changing Team Plan.

- The three high-resolution Team Plan assets are packaged and runtime-cached on demand rather than install-precached, keeping the PWA install cache bounded.
