# Top Eleven Tool — v0.6.51 Recovery Handoff

## Release state
- **UI/runtime:** v0.6.51
- **Decision baseline:** v0.5.17 release-frozen; scoring/calibration unchanged.
- **Scanner:** VERSION 12.

## Locked Team Plan visual assets — do not modify
- `assets/v0649/team-plan/formation-pitch.png`
- `assets/v0649/team-plan/player-shirt.png`
- `assets/v0649/team-plan/player-nameplate.png`

These three files were explicitly approved by the user. Display changes must be CSS/layout only; never crop, resample, regenerate or recompress them unless the user explicitly asks.

## Team Plan contract carried forward
- Formation is only the selected/recommended XI on the locked pitch.
- Best-in-Slot XI, Squad Blueprint and Build Best Match Plan remain removed.
- Set Pieces is a separate pitch containing Corner Kick L/R, Free Kick L/R, PEN 1–5 and Captain only.
- Set Piece AUTO UI and redundant automatic-recommendation copy remain removed.

## v0.6.51 — Tactics visual rebuild
The user supplied current Top Eleven tactic UI references and asked for the same information hierarchy in the app's existing dark/navy/cyan/lime glass theme.

### Calculator
- `Approach` and `Drain limit` remain the only tactic calculator inputs.
- `Auto — Best Fit` and `Medium` continue to use the app-owned select system.
- The selector chevron is now explicitly drawn in CSS so it cannot collapse into the old vertical-line/square artifact.
- Existing auto-recalculation and the explicit `Recalculate tactics` action remain connected to the same v0.5.17 tactic engine.

### Recommended tactic board
- Three phase tabs: **In Possession**, **In Transition**, **Out of Possession**.
- Tabs visually echo the live game's three-mode strip while staying in the app theme.
- Rows use dedicated scalable line icons stored under `assets/v0651/team-plan/tactics/`. These small feature assets stay out of the bounded install precache and are runtime-cached on first use.
- In Possession: Shooting tendency, Passing style, Focus passing, Cross tendency.
- In Transition: Possession lost, Possession won, Mentality.
- Out of Possession: Marking style, Pressing, Back line, Tackling style.
- Binary game choices render as two-option segments with only the recommended option highlighted.
- Cross/Pressing render as three-segment intensity rails with the current selected label.
- Other dimensions render as clear selected-value boxes.
- These rows are recommendation display, not new manual tactic inputs; calculation logic is unchanged.

### Mentor
- Mentor remains on the Tactics tab.
- Mentor recommendation, unlock state and level logic are unchanged.

## Do not change without explicit request
- v0.5.17 football decision/calibration logic.
- Scanner VERSION 12.
- Training or Mastercard logic.
- Locked Team Plan pitch/player assets.
- Existing cloud/hydration architecture.
