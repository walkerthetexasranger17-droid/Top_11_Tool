# Top Eleven Tool — v0.6.20 Recovery Handoff

## Fixed pass scope
Squad-page finishing pass only. This pass completes the user-requested mobile Squad refinements without changing frozen football/scanner calibration logic.

## User-approved mobile Squad row contract
The compact v0.6.19 row remains unchanged:
1. rank number;
2. current high-quality role/player artwork;
3. player name with optional nationality flag and `role(s) · Age` line;
4. glossy position badge;
5. authoritative Playstyle image only;
6. authoritative Special Ability image(s) only, up to two in the compact row;
7. OVR;
8. chevron.

No stars and no Playstyle/Special Ability text labels are shown in the mobile row.

## v0.6.20 Squad finishing changes
- Removed the entire Squad filter panel from the UI. The roster now uses the full available width.
- Any persisted legacy filter state is cleared when Squad renders so old hidden filters cannot make players disappear.
- Added a `Role Order (GK → ST)` sort option.
- Approved role order is exactly:
  `GK → DL → DC → DR → DMC → ML → MC → MR → AML → AMC → AMR → ST`.
- DML and DMR are NOT valid current game positions and are not part of this role-order contract.
- Within the same primary role, Role Order sorts by OVR descending, then player name.
- Mobile/tablet global app header is explicitly kept visible/sticky on Squad so the page retains the same Top Eleven Tool header shell as Home.
- The existing Squad cinematic/page header remains in place; no alternative design direction was introduced.

## Position colour contract
- Green: GK, DL, DC, DR.
- Yellow: DMC, ML, MC, MR, AML, AMC, AMR.
- Red: ST.
- Badge lettering remains black.
- DML/DMR are excluded because they are not current game positions.

## Scanner / nationality status
Nationality support from v0.6.19 remains unchanged. Scanner calibration stays `VERSION=12`; nationality remains an optional visible-flag metadata extension only. OVR, skills, Playstyle and Special Ability calibration logic is unchanged.

## Frozen logic boundary
No formation, tactics, Mentor, Team Plan, Best-in-Slot, training optimiser, strategy/calibration or scanner recognition logic changed in this pass. v0.5.17 decision logic remains release-frozen.

## Stop condition
Pass is complete only after focused Squad contract checks, core/static regression checks, real Chromium device audit, handoff/START_HERE update, full ZIP creation, fresh extraction and verification of that exact ZIP.

## Next step
Deploy v0.6.20 with the user's real cloud squad and review Squad on-device. If accepted, Squad is complete and the next page can begin. If not, make only a Squad fidelity hotfix.
