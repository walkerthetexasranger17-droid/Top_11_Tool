# v0.6.33 — START HERE

**CURRENT UI BRANCH:** v0.6.33 — Training Results Persistence Hotfix.  
**APPROVED VISUAL STATE:** Home and Squad are approved and frozen; Training visual design remains v0.6.31/v0.6.32 approved.  
**FROZEN DECISION CONTRACT:** v0.5.17.  
**SCANNER CALIBRATION:** VERSION=12.

Read `DESIGN_RECOVERY_HANDOFF_v0.6.33.md` first, then `V0633_TRAINING_RESULTS_HOTFIX_VALIDATION.md`.

## v0.6.33 scope
- Fix only the bug where Individual Training drills appeared after Build Session and then vanished moments later.
- Root cause is redundant cloud acknowledgement repainting the Training page after persistence.
- Identical Firestore values are now treated as no-op acknowledgements.
- No-op cloud sync events no longer repaint the active page.
- Keep the v0.6.32 rule that no drills are shown before Build Session in the current visit.
- No Home/Squad visual changes and no football/scanner/training-calculation changes.

## Packaging
Continue the split-release workflow:
1. **Deploy ZIP** for GitHub Pages / phone testing.
2. **Recovery ZIP** for future development/disaster recovery.
