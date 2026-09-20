# Top Eleven Tool — v0.6.10 Design Recovery Handoff

**Status:** UNPUBLISHED DESIGN PASS 10  
**UI/runtime version:** v0.6.10  
**Decision/calibration contract:** v0.5.17 frozen  
**Scoring/model fingerprint:** companion-strategy-v2-own-squad-runtime-v0515 — unchanged

## Fixed pass scope
Cross-device consistency / responsive QA across the complete v0.6 redesigned app. This pass is layout/shell only: desktop, landscape phone/tablet and compact portrait fallback. No football/scanner/calibration logic is reopened.

## Audit result
All redesigned page units remain present: Home/auth, Squad, Player Profile, Training, Team Plan, Drills, Settings/Account, Add Player/Scanner and Update Players.

Two source-level responsive conflicts were found:
1. coarse-pointer tablets whose CSS width crossed 1024px could inherit the desktop sidebar even though phone/tablet navigation is required to stay on bottom navigation;
2. the late v0.6.9 portrait compact-fit rules overrode several existing phone reflows and reintroduced wide multi-column/min-width workspaces on Squad, Scanner, Drills, Team Plan, Settings and related pages.

## v0.6.10 implementation
- Added a coarse-pointer tablet shell override for 1024–1180px so tablets keep the bottom navigation and do not inherit the desktop sidebar.
- Preserved desktop/laptop sidebar behaviour for non-coarse pointer devices.
- Preserved landscape compact shell behaviour and compact portrait zoom treatment.
- Restored phone-portrait single-column/workspace reflows where late portrait rules had forced unnecessarily wide layouts:
  - Home workspace sections;
  - Squad workspace/list;
  - Update Players overview and Scanner workspace/review;
  - Training setup;
  - Drills workspace/Master stock;
  - Team Plan panels/mentor/Best-in-Slot;
  - Settings and Account/Security.
- No new production artwork was required. Existing v0.6 hero assets, game-extracted Mentor portraits, Playstyle assets and Special Ability assets remain authoritative and unchanged.

## Browser QA limitation
A local Chromium executable exists in the execution environment, but browser navigation to local HTTP and file URLs is blocked by the environment administrator. The attempted live viewport audit is therefore classified as **ENVIRONMENT BLOCKED — NOT APPLICATION FAILURE**. Deterministic responsive/source contracts and regression tests are used for this pass; real-device visual verification remains the appropriate follow-up.

## Critical non-changes
No scanner recognition/calibration logic, Playstyle/SA reference data, cloud/auth behaviour, Training logic, Formation logic, Tactics logic, Mentor logic, Set Piece logic, canonical decision data or calibrated scoring was changed.

## Next planned unit
Real-device review of v0.6.10 across representative desktop, landscape phone/tablet and portrait phone/tablet sizes. Any resulting fixes should remain narrow v0.6.x responsive/polish passes unless the user explicitly opens a new feature/page scope.

## Mandatory pass-end workflow
Update recovery/current-state documentation, run regressions, create the complete app ZIP, extract that exact ZIP into a fresh folder, rerun critical verification against the extracted copy, and deliver the verified ZIP.
