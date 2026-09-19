# Top Eleven Tool — v0.6.49 Recovery Handoff

## Current branch
- UI/runtime: **v0.6.49**.
- Football decision baseline: **v0.5.17 RELEASE-FROZEN**.
- Scanner: **VERSION 12**.

## Team Plan pass completed
### Formation
The Formation tab is intentionally reduced to the recommended XI only. Removed from the live UI:
- Best-in-Slot XI
- Squad Blueprint
- Build Best Match Plan

The current XI continues to be selected automatically by the existing Team Plan engine. No formation/tactics/mentor scoring calibration was changed.

Locked user-approved assets:
- `assets/v0649/team-plan/formation-pitch.png`
- `assets/v0649/team-plan/player-shirt.png`
- `assets/v0649/team-plan/player-nameplate.png`

The pitch source is rendered as an image inside the Formation tab, not as the whole Team Plan page background. Player shirts are overlaid on the pitch and names are rendered dynamically over the separate nameplate asset. Formation coordinates are mapped into the actual grass playing-area bounds of the approved pitch so the XI stays inside the touchlines.

### Set Piece Takers
The second Team Plan tab uses the same shirt and nameplate assets for a consistent visual system. Automatic XI-derived recommendations are presented for:
- Corner Kick L
- Corner Kick R
- Free Kick L
- Free Kick R
- PEN 1
- PEN 2
- PEN 3
- PEN 4
- PEN 5
- Captain

Penalty slots are explicitly ordered 1 through 5. Existing set-piece selection logic remains automatic; no opponent data and no manual override system were added.

### Tactics
The third Team Plan tab remains intact. Existing Tactics and Mentor logic/UI are outside this pass except for any shared runtime version bump.

## Do not regress
- Do not re-add Best-in-Slot, Squad Blueprint or Build Best Match Plan unless the user explicitly asks.
- Do not crop, regenerate, resample or replace the three locked v0.6.49 Team Plan assets without explicit approval.
- Do not change v0.5.17 football decision calibration or Scanner VERSION 12 during visual work.
