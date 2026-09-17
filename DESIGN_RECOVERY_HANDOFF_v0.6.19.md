# Top Eleven Tool — v0.6.19 Recovery Handoff

## Fixed pass scope
Mobile Squad compact-row fidelity + optional nationality/flag support in the existing scanner. This pass is deliberately limited to Squad presentation and the nationality metadata extension required by that presentation.

## User-approved mobile Squad contract
The mobile Squad row must be a thin horizontal strip, not a tall player card. Left to right:
1. rank number;
2. current high-quality role/player artwork;
3. player name with a small nationality flag and `role(s) · Age` line;
4. glossy position badge;
5. authoritative Playstyle image only;
6. authoritative Special Ability image(s) only (up to two in the compact row);
7. OVR;
8. chevron.

Explicit exclusions on the mobile row:
- no star rating;
- no words such as Creator, Finisher, Playmaker, Poacher, etc. beside the Playstyle / Special Ability artwork;
- do not replace game-extracted Playstyle or Special Ability images with generated substitutes;
- do not return to the old/basic role portraits.

## v0.6.19 implementation
- Mobile portrait Squad rows reduced to a 66px compact target with one horizontal information line.
- Mobile landscape rows use an even tighter 48px treatment.
- Existing high-quality role art under `assets/roles/` remains the player artwork source.
- Existing approved glossy position badges under `assets/positions/` remain the role badge source.
- Existing authoritative game-extracted Playstyle artwork under `assets/scanner/playstyles/` is rendered icon-only on mobile.
- Existing authoritative game-extracted Special Ability artwork under `assets/scanner/special-abilities/` is rendered icon-only on mobile; the compact row shows at most two icons.
- Nationality is stored as optional `player.nationalityCode` metadata.
- Squad renders the nationality as a small flag when known. ISO alpha-2 country codes are used for ordinary countries; `ENG`, `SCO`, `WAL`, `NIR` are reserved for UK home-nation identities because those are what Top Eleven can visibly show.
- Existing players with no nationality remain valid and simply show no flag until updated/rescanned.

## Scanner nationality extension
This is an explicitly requested scanner extension, not a recalibration of the frozen scanner.
- `js/scanner-engine.js` keeps scanner `VERSION=12`.
- New metadata extension marker: `NATIONALITY_EXTENSION_VERSION=1`.
- A coordinate-locked `nationalityFlag` crop is added to the existing core/update evidence board.
- Gemini is instructed to read nationality from the visible flag only.
- It must never infer nationality from the player's name, role, stats, OVR or football semantics.
- If the flag is missing/uncertain, scanner returns an empty nationality code; this does not block saving or automatic age/skills updates.
- Update scans preserve an existing saved nationality and only fill nationality automatically when the saved player does not already have one.
- OVR, skills, Playstyle and Special Ability calibration behavior is intentionally unchanged.
- Scanner review has an editable optional Nationality field so the user can correct the result before saving.

## Position colour contract
- Green: GK, DL, DC, DR.
- Yellow: DML, DMC, DMR, ML, MC, MR, AML, AMC, AMR.
- Red: ST.
- Badge lettering remains black.

## Frozen logic boundary
No formation, tactics, Mentor, Team Plan, Best-in-Slot, training optimiser or strategy/calibration logic is to be changed in this pass. The v0.5.17 decision contract remains release-frozen. Scanner v12 numeric/playstyle/SA calibration remains frozen; nationality is isolated metadata only.

## Next fixed unit after v0.6.19
Deploy v0.6.19 with the real cloud squad and review only the mobile Squad screen on-device. If spacing or icon scale needs correction, make a Squad-only fidelity hotfix. Do not move to another page until the user accepts Squad.
