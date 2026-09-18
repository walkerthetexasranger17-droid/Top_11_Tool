# v0.6.30 — START HERE

**CURRENT UI BRANCH:** v0.6.30 — Package Size Cleanup.  
**APPROVED VISUAL STATE:** Home and Squad are approved.  
**FROZEN DECISION CONTRACT:** v0.5.17.  
**SCANNER CALIBRATION:** VERSION=12.

Read `DESIGN_RECOVERY_HANDOFF_v0.6.30.md` first, then `V0630_SIZE_CLEANUP_VALIDATION.md`.

## v0.6.30 scope
This pass changes packaging/housekeeping only. It does not redesign Home or Squad and does not change football/scanner/training logic.

- Removed superseded `assets/v0615/`.
- Removed duplicate full-size PNG render sources from `assets/v0616/home/` where current WebP assets are already used.
- Removed superseded `assets/v0628/headers/`; current headers remain in `assets/v0629/headers/`.
- De-duplicated the approved Home/Squad background references by pointing recovery docs to the exact canonical `assets/v0623/backgrounds/` files.
- Removed obsolete desktop design-reference screenshots while preserving design/recovery documentation.
- Runtime service worker/cache/version bumped to v0.6.30 / `0630`.
- Two release packages are produced: a lean deployment package and a fuller recovery/development package.

## Important
Use the **deploy ZIP** for GitHub Pages / phone deployment. Use the **recovery ZIP** when starting a new development chat.
