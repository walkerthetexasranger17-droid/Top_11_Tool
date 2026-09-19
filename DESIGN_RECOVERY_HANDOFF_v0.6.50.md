# Top Eleven Tool — v0.6.50 Recovery Handoff

## Release state
- **UI/runtime:** v0.6.50
- **Decision baseline:** v0.5.17 release-frozen; scoring/calibration unchanged.
- **Scanner:** VERSION 12.

## User-approved Team Plan direction
The user wants Team Plan simplified. Formation is only the selected/recommended XI. Best-in-Slot XI, Squad Blueprint and Build Best Match Plan were removed in v0.6.49 and must stay removed unless explicitly requested back.

### Locked visual assets — do not modify
- `assets/v0649/team-plan/formation-pitch.png`
- `assets/v0649/team-plan/player-shirt.png`
- `assets/v0649/team-plan/player-nameplate.png`

These assets were explicitly approved. Never crop/resample/regenerate/recompress them to change display sizing; use CSS only.

## v0.6.50 changes
### Formation
- Shirt/nameplate markers were reduced on portrait/mobile because the 4-2-3-1 presentation looked cramped.
- Formation remains a dynamic XI overlay on the locked stadium pitch.

### Set Pieces
- Fixed a CSS bug: `#teamPlanFormationPanel{display:block!important}` prevented the Formation panel from hiding when Set Pieces was selected.
- Set Pieces now has a dedicated pitch surface and shows only assigned takers, inspired by the native Top Eleven set-piece view.
- Required assignments: Corner Kick L, Corner Kick R, Free Kick L, Free Kick R, PEN 1, PEN 2, PEN 3, PEN 4, PEN 5, Captain.
- Assignment labels appear with the player shirt + dynamic surname nameplate.
- Removed redundant `AUTO` chip and automatic-recommendation explanatory copy. Assignments are already preselected by the plan.
- Clicking a displayed player marker still opens that player profile.

## Do not change in this pass
- v0.5.17 football decision logic/calibration.
- Scanner VERSION 12.
- Training logic or Mastercard rules.
- Tactics/Mentor calculations.
- The three locked Team Plan assets.

## Next work
Continue visual/user testing of Formation and Set Pieces. Tactics/Mentor redesign comes later only when requested.

- The three high-resolution Team Plan assets are packaged and runtime-cached on demand rather than install-precached, keeping the PWA install cache bounded.
