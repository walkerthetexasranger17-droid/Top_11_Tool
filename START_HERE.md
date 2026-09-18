# v0.6.32 — START HERE

**CURRENT UI BRANCH:** v0.6.32 — Dropdown + Training Interaction Polish.  
**APPROVED VISUAL STATE:** Home and Squad are approved and frozen.  
**FROZEN DECISION CONTRACT:** v0.5.17.  
**SCANNER CALIBRATION:** VERSION=12.

Read `DESIGN_RECOVERY_HANDOFF_v0.6.32.md` first, then `V0632_DROPDOWN_TRAINING_VALIDATION.md`.

## v0.6.32 scope
- Replaced the visible Android/browser-native select UI with an app-owned themed dropdown layer while keeping the real `<select>` controls as the logic/source-of-truth layer.
- This dropdown treatment is app-wide, including Training, Squad sort, Scanner/Profile roles/playstyles, Drills levels/categories and Team Plan selectors.
- Fixed the Training player selector text presentation so the placeholder/value is no longer vertically clipped.
- Individual Training no longer auto-restores/renders a previous drill recommendation merely because a player was already selected. A drill session only becomes visible after the user presses Generate/Build Session in the current visit.
- Existing saved session persistence is retained internally; only automatic pre-display was removed.
- Squad sort now defaults to `Role (GK → ST)` and the menu order is Role, OVR high→low, OVR low→high, Age young→old, Name A→Z.
- Home/Squad visuals, Training calculations, scanner calibration and football logic were not redesigned or recalibrated.

## Packaging
Continue the split-release workflow:
1. **Deploy ZIP** for GitHub Pages / phone testing.
2. **Recovery ZIP** for future development and disaster recovery.
