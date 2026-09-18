# Top Eleven Tool — v0.6.34 Recovery Handoff

## Current baseline
- v0.6.34 is the current development baseline.
- Home, Squad and Training remain user-approved in structure; this pass only standardises branded page-header sizing/placement globally and redesigns Add Player presentation.
- The calibrated decision/football baseline remains v0.5.17.
- Scanner calibration remains VERSION=12.
- Scanner recognition/OCR logic is unchanged.
- Continue split packaging: lean deploy ZIP + full recovery ZIP.

## v0.6.34 scope
### Global branded page-title rule
The user reported that page-title artwork had inconsistent visual size and could dominate the portrait backgrounds. The branded page headers now share one smaller visual footprint and sit closer to the upper-left corner.

- Desktop/tablet branded page-header width: 250px, left 12px, top 7px.
- Phone portrait branded page-header width: 205px, left 8px, top 4px.
- Compact touch landscape branded page-header width: 190px, left 8px, top 3px.
- This applies to Home, Squad, Training, Drills, Team Plan, Settings, Manager Profile and Add Player.
- The global top-bar TOP ELEVEN TOOL wordmark is unchanged.

### Add Player redesign
- Added the approved Scanner/Add Player portrait background to the Add Player screen as `assets/v0634/backgrounds/add-player.webp`.
- On mobile/touch, the approved portrait artwork becomes the fixed page surface behind the scanner UI, using the same restrained tint approach as Training/Home/Squad.
- The scanner hero itself becomes transparent over that artwork in Add Player mode.
- `Add Player Manually` has moved out of the bottom/right Workflow guide panel.
- Manual entry is now a dedicated secondary card directly below the Skills Screenshot scanner area.
- Scanner remains the primary path; manual entry is visually subordinate but immediately discoverable.
- Update Player mode hides the manual-entry card. A dedicated Update Player background is intentionally deferred until its separate approved artwork is created.

## Frozen boundaries
- No scanner model/prompt/schema/reference/calibration changes.
- No OCR or save-flow changes.
- No football/formation/tactics/mentor/training calculation changes.
- Home/Squad content and accepted layouts are otherwise unchanged.

## Next step
User should test v0.6.34 on phone, focusing on branded-header scale/position and the Add Player layout/background/manual-entry placement. Update Player remains a separate redesign once its dedicated background art exists.
