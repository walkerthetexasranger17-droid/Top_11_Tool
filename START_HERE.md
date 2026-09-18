# v0.6.35 — START HERE

**CURRENT UI BRANCH:** v0.6.35 — Scan Review Polish + Selected-XI Team OVR.  
**APPROVED VISUAL STATE:** Home, Squad and Training retained; Add Player uses its approved portrait background; all branded page titles now match Home's compact optical footprint and top-left placement.  
**FROZEN DECISION CONTRACT:** v0.5.17.  
**SCANNER CALIBRATION:** VERSION=12.

Read `DESIGN_RECOVERY_HANDOFF_v0.6.35.md` first, then `V0635_SCAN_REVIEW_TEAM_OVR_VALIDATION.md`.

## v0.6.35 scope
- Normalize every branded page-title asset to the Home title's visible footprint and top-left placement.
- Remove Related Roles from the Add Player scan-review UI.
- Restyle scanner Role / Playstyle selectors so they are integrated controls without the separate boxed arrow treatment.
- Change Home Avg OVR to Team OVR calculated only from the 11 players in the saved starting XI.
- Preserve scanner calibration and all football/training decision logic.

## Packaging
Continue the split-release workflow:
1. **Deploy ZIP** for GitHub Pages / phone testing.
2. **Recovery ZIP** for future development/disaster recovery.
