# Top Eleven Tool — v0.6.36 Recovery Handoff

## Current baseline
- v0.6.36 is the current development baseline.
- Home, Squad and Training remain approved in their current visual structure.
- Add Player remains on the approved scanner portrait background.
- Settings now uses the previously approved Settings portrait background.
- Home remains the optical reference for compact page-title size/placement across branded pages.
- The calibrated decision/football baseline remains v0.5.17.
- Scanner calibration remains VERSION=12.
- Continue split packaging: lean deploy ZIP + full recovery ZIP.

## v0.6.36 scope — Settings background only
The user confirmed the Settings page layout/content is already satisfactory and requested only the background treatment.

### Implemented
- Runtime asset: `assets/v0636/backgrounds/settings.webp`.
- Source: existing approved `assets/v0624/reference-backgrounds/settings-approved.png`.
- The approved composition is preserved; runtime WebP encoding reduces transfer/package weight.
- Settings receives a fixed full-page background layer below its existing hero/body, using the same mobile-first page-surface approach established on Training and Add Player.
- The previous Settings hero scene is suppressed on mobile/touch so it does not fight the approved full-page artwork.
- Existing Settings cards, account links, cloud controls, scanner API-key controls, technical-details disclosure and About card are unchanged.
- A restrained overlay keeps the approved image visible while maintaining control readability.

## Preserved from v0.6.35
- Global page titles remain normalized to the Home title footprint/position.
- Add Player scan-review Role/Playstyle control styling remains unchanged.
- Related Roles remains removed from Add Player scan review.
- Home Team OVR remains calculated from the saved starting XI only.

## Frozen boundaries
- No Settings information architecture or control changes.
- No scanner recognition/calibration changes.
- No player OVR formula changes.
- No formation/tactics/mentor/training decision changes.
- No Home/Squad/Training/Add Player redesign.
- Update Player dedicated background/title remains deferred until its new artwork is created.

## Next step
After the user verifies Settings on-device, continue to another page that already has approved assets, or create the dedicated Update Player artwork when image generation is available.
