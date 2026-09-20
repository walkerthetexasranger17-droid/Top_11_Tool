# Top Eleven Tool — v0.6.52 Recovery Handoff

## Release state
- **UI/runtime:** v0.6.52
- **Decision baseline:** v0.5.18 Drain Band Intent Fix.
- **Scanner:** VERSION 12.

## Locked Team Plan visual assets — do not modify
- `assets/v0649/team-plan/formation-pitch.png`
- `assets/v0649/team-plan/player-shirt.png`
- `assets/v0649/team-plan/player-nameplate.png`

These three files are user-approved. Display changes must remain CSS/layout only unless explicitly asked.

## Team Plan visual contract carried forward
- Formation = selected/recommended XI only on the locked pitch.
- Set Pieces = separate pitch for Corner Kick L/R, Free Kick L/R, PEN 1–5 and Captain.
- Best-in-Slot XI, Squad Blueprint, Build Best Match Plan and Set Piece AUTO UI remain removed.
- Tactics uses the game-inspired three-phase board in the app glass theme.
- Approach and Drain Limit use the corrected dropdown chevron.

## v0.6.52 — Drain Limit behavior correction
The user observed that switching Drain Limit from Medium to High could leave every tactic unchanged.

Root cause: v0.5.17 treated the setting as a widening ceiling and simultaneously rewarded lower condition drain, so the cheaper Medium package often remained best even after High became available.

v0.6.52 ships decision baseline v0.5.18:
- Low searches Low-drain plans.
- Medium searches Medium-drain plans.
- High searches High-drain plans.
- Existing own-XI tactic scoring remains active inside the selected drain band.
- Changing Approach or Drain Limit now recalculates recommendations against the already-selected XI instead of rebuilding the optimal formation.

## Unchanged boundaries
- Opponent information remains permanently out of scope.
- Formation/context calibration remains the existing v0.5.15-derived own-squad model.
- Set Piece, Mentor, Training and Mastercard scoring are unchanged.
- Mixed Medium/High live-server drain arithmetic remains unresolved and is not guessed.
- Scanner remains VERSION 12.

Read `CALIBRATION_RECOVERY_HANDOFF_v0.5.18.md` and `V0652_DRAIN_LIMIT_VALIDATION.md` before changing tactic drain behavior.
