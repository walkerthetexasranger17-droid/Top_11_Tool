# Top Eleven Tool — v0.6.31 Recovery Handoff

## Current baseline
- v0.6.31 is the current development baseline.
- Home and Squad are explicitly user-approved. Do not redesign them unless the user asks.
- The calibrated decision/football baseline remains v0.5.17.
- Scanner calibration remains VERSION=12.
- The package-size split introduced in v0.6.30 remains mandatory: lean deploy package plus full recovery package.

## Approved Home + Squad state
- Global top bar uses the wide TOP ELEVEN TOOL wordmark from `assets/v0629/headers/topbar.webp`.
- Home uses the stacked TOP / ELEVEN / TOOL artwork at upper-left from `assets/v0629/headers/home.webp`.
- Squad uses `assets/v0629/headers/squad.webp`.
- Home and Squad keep their approved portrait backgrounds and current content layouts.
- v0.6.31 changes only the route-artwork implementation for these pages: their fixed mobile background geometry is now established even while the page is inactive, preventing the absolute-to-fixed snap seen during Home/Squad switching.

## Training pass completed in v0.6.31
Training is the first page after Home/Squad to receive the current mobile visual treatment.

### Background and header
- Approved source: `assets/v0624/reference-backgrounds/training-approved.png`.
- Runtime derivative: `assets/v0631/backgrounds/training.webp` (941×1672 WebP).
- Header remains the approved transparent `assets/v0629/headers/training.webp`.
- On phone/tablet the approved portrait art is a fixed page surface behind the scrolling Training UI with the same subtle global tint language used by Home/Squad.

### Training navigation
- Individual Training and Team Training remain the only two Training tabs.
- Tabs are now a compact two-part segmented control using the existing navy/cyan/lime app language.
- Team Training panel visibility changes immediately on tap.
- Team Training calculations are yielded group-by-group so the browser can paint loading feedback instead of appearing frozen.

### Removed from Training
- `Manage My Drills` setup card.
- `Manage Drills` result action.
- `Manage My Drills` Team Training action.
- `6 DRILLS / 3 MODES / 0 GREY SCORE` summary strip.

Drill configuration itself is not removed from the product; it remains on the separate Drills page.

### Individual Training
The setup is now three steps:
1. Select Player.
2. Optimisation Mode.
3. Build 6-Drill Session.

Existing training calculations, saved-session behaviour, Master stock deduction and white-skill logic are unchanged.

### Team Training visual contract
- The four existing squad-group calculations are unchanged.
- Group cards have richer headers, loading state, drill thumbnails, compact summary metrics and one drill row per recommended slot.
- Drill category colour contract:
  - Attack / Attacking = red.
  - Defence / Defending = green.
  - Possession = yellow.
  - Physical & Mental = blue.
- A Master drill keeps its category colour but receives a gold outer border.
- Current Team Training engine still recommends normal drills only; the Master styling is shared with Individual Training and ready for any future legitimate Master presentation.

## Performance / transition fix
The old mobile Home/Squad artwork rules changed media from normal absolute positioning to fixed positioning only after `.active` was applied. That could expose a first-frame geometry mismatch before settling. v0.6.31 establishes final fixed geometry without depending on `.active`, adds a short opacity-only page fade, precaches the critical Home/Squad/Training artwork, and prewarms those images at startup.

## What must not be changed accidentally
- Home design.
- Squad design.
- Player scanner calibration/version.
- v0.5.17 decision/calibration logic.
- Current Team Training scoring or drill-selection algorithm.
- Existing role/playstyle/Special Ability contracts.

## Next stage
User should test v0.6.31 on the real phone. After approval, the next asset-ready page is **Drills**. Do not begin Player Profile redesign in this sequence.
