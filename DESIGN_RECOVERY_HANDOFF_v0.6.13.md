# Top Eleven Tool — v0.6.13 Design Recovery Handoff

**Date:** 2026-09-17  
**UI/runtime version:** v0.6.13  
**Pass:** Design Pass 13 — Home Fidelity  
**Frozen decision/calibration base:** v0.5.17

## Why Pass 13 exists
A real Android screenshot of v0.6.12 showed that the app was responsive and technically stable but still visually far from the approved Home references. Passes 10–12 proved viewport fit, navigation mode and browser stability; they did **not** prove design fidelity. From Pass 13 onward, stored approved references are treated as visual contracts page-by-page.

## Fixed scope
Home page and the shell elements required to reproduce the approved Home composition only:
- audit/reuse existing production football artwork;
- create only missing Home production crops from existing artwork;
- cinematic Home hero and approved headline/actions;
- desktop header search + Cloud/manager chrome;
- four Home stat cards;
- Recent Players;
- Training Builder;
- Team Plan Snapshot;
- Performance Insights;
- Quick Actions;
- five-item touch navigation (`Home / Squad / Training / Team Plan / More`) with More drawer;
- desktop sidebar continues to expose Drills + Settings directly;
- desktop/tablet/phone portrait + landscape responsive implementation;
- no frozen football/scanner/calibration logic changes.

## Production assets
Added under `assets/v060/scenes/`:
- `home-hero-desktop.webp`
- `home-hero-mobile.webp`

Both are derived from the existing `assets/scenes/squad.webp` football scene (mirror/crop/composite framing only). No generated substitute replaces authoritative game-extracted assets.

## Implementation notes
- Approved references: `docs/design/reference/v060/approved-home-desktop.webp` and `approved-home-mobile.webp`.
- Home keeps real squad/training/team-plan data hooks already present in v0.6.12.
- Recent Players is capped to four rows to match the approved composition.
- The touch footer now matches the approved five-item Home/Squad/Training/Team Plan/More structure; Drills/Settings live in More on touch and remain direct sidebar destinations on desktop.
- A functional desktop search shortcut opens Squad and focuses the existing squad search field.
- Watch Tour is not a dead control: it scrolls to the Home intelligence/stat area.
- The v0.6.12 offline Chromium harness remains the source of truth for responsive overflow/nav-mode checks.

## Stop condition
Pass 13 is complete only when:
1. Home Chromium captures visibly follow the stored approved Home composition rather than just sharing colours;
2. all 45 viewport/page combinations pass the real-Chromium horizontal-fit/nav-mode audit with zero console errors;
3. Home fidelity/static/runtime contracts pass;
4. core/scanner/update regressions pass;
5. frozen engine/data hashes are unchanged from v0.6.12;
6. embedded handoff/validation files are current;
7. a full v0.6.13 ZIP is created, extracted fresh and the critical suite is re-run against that exact ZIP.

## Next fixed pass
**v0.6.14 — Squad Design Fidelity**, using the stored approved Squad references, unless a real-device v0.6.13 Home review finds a blocking Home issue first.

## Pass 13 validation result
PASS — 45/45 real-Chromium page/view combinations, zero horizontal overflow, zero console errors, core 355 assertions PASS, scanner/update contracts PASS, and frozen engine/data hashes byte-identical to v0.6.12. See `V0613_DESIGN_PASS13_VALIDATION.md`.
