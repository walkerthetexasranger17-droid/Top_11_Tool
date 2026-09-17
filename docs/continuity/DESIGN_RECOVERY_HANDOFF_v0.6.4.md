# Top Eleven Tool — v0.6.4 Design Recovery Handoff

**Status:** UNPUBLISHED DESIGN PASS 4  
**UI/runtime version:** v0.6.4  
**Decision/calibration contract:** v0.5.17 frozen  
**Scoring/model fingerprint:** companion-strategy-v2-own-squad-runtime-v0515 — unchanged

## Locked redesign workflow

Every page is now handled as one complete implementation unit. Do not drift back into random mockups after a page direction is approved.

1. Use the approved page mockup as the design target.
2. Audit existing production assets first and reuse them wherever suitable.
3. Create only the missing responsive production assets required by that page.
4. Package those assets under the v0.6 asset structure.
5. Build the real HTML/CSS/JS against existing application data and logic.
6. Verify desktop/tablet/mobile. Mobile is the same visual design; the desktop sidebar becomes bottom navigation and artwork is cropped/repositioned rather than redesigned.
7. Run relevant deterministic/static regression checks.
8. Update this embedded handoff and create/extract/verify the full ZIP before the pass ends.

## Approved visual language

- dark navy / near-black football-intelligence shell;
- neon lime primary actions and cyan information accents;
- cinematic football imagery on identity surfaces;
- dense professional data views for working screens;
- Barlow Condensed display typography with DM Sans body copy;
- desktop persistent left navigation;
- mobile persistent bottom navigation;
- one design system across desktop, tablet and phone.

## Existing authoritative assets

Reuse the existing verified app assets rather than generating substitutes:

- Playstyle production packs and compact references;
- the 19 current coloured Special Ability assets;
- role art under `assets/roles/`;
- drill art under `assets/drills/`;
- scene art under `assets/scenes/`;
- game-extracted Mentor portraits under `assets/mentors/`.

The legacy file `assets/mentors/jonas-brown.png` is the real game-extracted portrait but the displayed mentor name is **Jonas Braun**.

## Completed v0.6 pages

- v0.6.1: responsive shell, auth/login direction and Home foundation.
- v0.6.2: production Squad workspace.
- v0.6.3: production Player Profile.
- v0.6.4: production Training workspace.

## v0.6.4 Training implementation

1. Approved Training mockup preserved at `docs/design/reference/v060/approved-training-desktop.webp`.
2. Existing `assets/scenes/training.webp` reused as the source artwork instead of generating redundant art.
3. Responsive production hero derivatives created:
   - `assets/v060/scenes/training-hero-desktop.webp`
   - `assets/v060/scenes/training-hero-mobile.webp`
4. Training page rebuilt into the approved four-step setup flow:
   - Select Player
   - Optimisation Mode
   - Manage My Drills
   - Build 6-Drill Session
5. The real existing optimisation modes, drill inventory, Master stock and six-slot engine remain wired unchanged.
6. Generated sessions are presented as a six-card responsive workspace while retaining all real drill names, levels, difficulty, targets, condition cost and Master stock data.
7. Session intelligence remains explicitly a ranking model; exact final server attribute gains are not fabricated.
8. Team Training remains in the same page and uses the existing team-training engine.
9. Mobile keeps the same Training visual identity and uses the global bottom navigation.

## Critical non-changes

This pass does not recalibrate or alter Formation, Tactics, Set Pieces, Mentors, training selection/scoring, scanner recognition, Special Ability eligibility or canonical decision data. The v0.5.17 decision contract and v0.5.15 scoring fingerprint remain frozen.

## Next page

Continue directly into **Team Plan** as the next complete page unit. Before coding it, audit and reuse the existing tactics/pitch assets and the real game-extracted Mentor portraits. The approved Team Plan reference is already packaged at `docs/design/reference/v060/approved-team-plan-desktop.webp`.

## Mandatory pass-end workflow

Reserve time for the embedded handoff, regression checks, full ZIP creation and fresh extraction/verification before ending every design pass.
