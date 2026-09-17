# Top Eleven Tool — v0.6.18 Recovery Handoff

## Fixed pass scope
Mobile Squad detail implementation only. Home is no longer the active page. The goal is to make the Squad roster useful on a phone without forcing the user to open each player profile.

## Product/design priority
- Phone/tablet is the product. Desktop only needs to remain functional.
- Keep the approved dark navy / neon lime / cyan cinematic football identity.
- Do not invent a new design direction and do not use external AI design agents.
- No star ratings on Squad; the app does not track them.

## v0.6.18 changes completed
- Mobile Squad player rows are richer/taller and retain: player role artwork, player name, natural role(s), age, OVR, glossy position badge, Playstyle artwork + name + level, up to two Special Ability images + names, and the row chevron.
- Existing authoritative game-extracted Playstyle assets are used through `assets/scanner/playstyles/...`; none were regenerated.
- Existing authoritative Special Ability assets are used through `assets/scanner/special-abilities/...`; none were regenerated.
- Added the approved individual glossy position badge pack under `assets/positions/` for all 14 positions:
  - green: GK, DL, DC, DR
  - yellow: DML, DMC, DMR, ML, MC, MR, AML, AMC, AMR
  - red: ST
  - all badge lettering is black.
- Replaced the old generic six role-art files with the already-approved higher-quality role art:
  - ST = red striker artwork
  - AM/M/DM = yellow midfield artwork
  - D = green defender artwork
  - GK = green goalkeeper artwork
- Swipe-left delete remains intact.
- Existing search/filter/sort controls remain intact.
- Runtime/cache identity bumped to v0.6.18 and all 14 position badges are precached.

## Frozen logic
No football/scanner/training/formation/tactics/Mentor/Team Plan/Best-in-Slot/strategy/calibration logic was intentionally changed. The v0.5.17 decision contract remains release-frozen.

## Important implementation notes
- `js/app.js` now uses `positionBadgeAsset()` only as UI presentation and calls the pre-existing `playstyleIcon()` / `abilityIcon()` helpers for Squad rows.
- The richer phone row is CSS-only responsive presentation; it does not add or calculate new player data.
- Mobile portrait is the primary Squad fidelity target. Mobile landscape/tablet remain supported, desktop remains functional.

## Next fixed unit
Deploy v0.6.18 with the user's real cloud squad and review the Squad page on-device. Only adjust mobile Squad spacing, icon sizing, truncation, filters/controls and row composition from real-device screenshots. Do not move to another page until Squad is accepted.
