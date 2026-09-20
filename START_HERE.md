# v0.6.52 — START HERE

**CURRENT UI BRANCH:** v0.6.52 — Team Plan Drain Limit behavior fix.  
**DECISION BASELINE:** v0.5.18 Drain Band Intent Fix.  
**SCANNER:** VERSION 12.

## Locked Team Plan assets
Do not crop, regenerate, resample, recompress or replace these without explicit user approval:
- `assets/v0649/team-plan/formation-pitch.png`
- `assets/v0649/team-plan/player-shirt.png`
- `assets/v0649/team-plan/player-nameplate.png`

## Current Team Plan contract
- **Formation:** recommended XI only on the locked pitch; compact shirt/nameplate markers.
- **Set Pieces:** separate pitch showing Corner Kick L/R, Free Kick L/R, PEN 1–5 and Captain. It must not repeat the Formation XI.
- **Tactics:** game-inspired phased settings board: In Possession, In Transition and Out of Possession.
- **Approach / Drain:** selector changes recalculate tactics for the already-selected XI; they must not rebuild the formation.
- **Drain semantics:** Low, Medium and High target their matching historical drain class. Medium/High may no longer silently reuse a cheaper lower-class package.
- Best-in-Slot XI, Squad Blueprint, Build Best Match Plan and Set Piece AUTO UI remain removed.
- Mentor stays attached to Tactics; recommendation logic is otherwise unchanged.

Read `DESIGN_RECOVERY_HANDOFF_v0.6.52.md`, `CALIBRATION_RECOVERY_HANDOFF_v0.5.18.md`, `V0652_DRAIN_LIMIT_VALIDATION.md`, and the canonical `data/build_30527/index/decision_logic_v2.json` before changing Team Plan logic.
