# v0.6.31 — START HERE

**CURRENT UI BRANCH:** v0.6.31 — Training Mobile Redesign + Smooth Page Artwork.  
**APPROVED VISUAL STATE:** Home and Squad are approved and frozen.  
**FROZEN DECISION CONTRACT:** v0.5.17.  
**SCANNER CALIBRATION:** VERSION=12.

Read `DESIGN_RECOVERY_HANDOFF_v0.6.31.md` first, then `V0631_TRAINING_DESIGN_VALIDATION.md`.

## v0.6.31 scope
- Fixed the Home ↔ Squad first-frame background-position snap by pre-positioning fixed mobile artwork before route activation and prewarming critical artwork.
- Added the approved Training portrait background as the mobile Training page surface.
- Reworked Individual / Team Training into a compact segmented control.
- Removed every `Manage My Drills` action from Training; drill management remains on the dedicated Drills page.
- Removed the Training `6 Drills / Modes / Grey Score` summary boxes.
- Reduced Individual Training setup from four cards to three: Player, Optimisation Mode, Build Session.
- Made Team Training switch immediately and render its four group calculations incrementally rather than blocking the first paint.
- Redesigned Team Training drill cards using the existing app assets.
- Drill category colours are now: Attacking red, Defending green, Possession yellow, Physical & Mental blue. Master cards retain the category colour and use a gold outer border.
- No formation, tactics, mentor, training scoring, scanner or other football logic was recalibrated.

## Packaging
Continue the v0.6.30 split-release workflow:
1. **Deploy ZIP** for GitHub Pages / phone testing.
2. **Recovery ZIP** for future development and disaster recovery.
