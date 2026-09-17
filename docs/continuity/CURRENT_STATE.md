# CURRENT DESIGN OVERLAY — v0.6.19 Compact Mobile Squad + Nationality

## Active direction
- Mobile/tablet is the product priority; desktop is functional only.
- Dark navy / neon lime / cyan visual system remains locked.
- Current active page: Squad.
- User-approved Squad target is a thin, information-dense horizontal row rather than a tall card.

## v0.6.19 row contract
- Rank.
- High-quality role/player artwork from `assets/roles/`.
- Name plus optional nationality flag and roles/age.
- Glossy position badge from `assets/positions/`.
- Existing game-extracted Playstyle image only.
- Existing game-extracted Special Ability image(s) only, maximum two in compact phone row.
- OVR and chevron.
- No stars and no Playstyle / Special Ability label words on phone rows.

## Nationality support
- `nationalityCode` is optional persisted player metadata.
- Scanner v12 gains nationality metadata extension v1 only; scanner calibration version remains 12.
- Read only the visible nationality flag; never infer nationality from player name.
- ENG/SCO/WAL/NIR represent UK home nations; ordinary countries use ISO alpha-2.
- Uncertain or absent flags produce blank nationality and do not block a save/update.
- Existing nationality is preserved during update scans; a missing saved nationality may be filled from a confident new scan.

## Frozen boundary
- v0.5.17 decision contract remains frozen.
- Numeric scanner calibration, Playstyle recognition, Special Ability recognition, training, formation, tactics, Mentors and Team Plan logic are not part of this pass.

## Next
Deploy v0.6.19 with the real squad and review the mobile Squad screen only. Make spacing/icon-size hotfixes if required; do not move to the next page until Squad is accepted.
