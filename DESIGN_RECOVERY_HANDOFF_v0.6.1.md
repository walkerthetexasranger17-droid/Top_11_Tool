# Top Eleven Tool — v0.6.1 Design Recovery Handoff

**State:** UNPUBLISHED DESIGN BUILD / USER REVIEW  
**Date:** 16 September 2026  
**Base:** verified v0.5.17-dev-pass11 stability baseline  
**UI/runtime version:** v0.6.1  
**Football decision contract:** v0.5.17 preserved  
**Calibrated Match Ready model:** v0.5.15 preserved unchanged

## The approved design direction

The user selected the dark football-intelligence design with:

- near-black/navy shell;
- neon lime as the main action/selection colour;
- cyan/blue as the secondary information/navigation colour;
- cinematic stadium/player imagery in controlled hero areas;
- bold condensed headings;
- clean, modular data cards below the hero;
- desktop left navigation + top utility bar;
- tablet reflow into two-column workspaces;
- mobile/APK top header + bottom navigation + stacked cards;
- cinematic treatment on Home/Login/Profile, with denser functional treatment on Squad/Training/Team Plan/Drills/Settings.

This direction is locked unless the user explicitly changes it. Do not return to the white SaaS, editorial cream, black/gold, chalkboard, or soft-glass experiments.

## Approved visual references

Preserved as compressed design-only references under `docs/design/reference/v060/`:

- `approved-home-desktop.webp`
- `approved-home-mobile.webp`
- `approved-login-landing-desktop.webp`
- `approved-squad-desktop.webp`
- `approved-player-profile-desktop.webp`
- `approved-team-plan-desktop.webp`

These are visual/layout targets only. Generated faces, names, invented stats, slogans and UI values are not game facts and must not be copied into runtime data.

## v0.6.1 implementation scope

This is the first real implementation pass, not another mockup pass.

Implemented:

1. New `css/v060.css` design layer after the legacy stylesheet.
2. Responsive shell:
   - desktop >=1024px: existing six-destination nav becomes a fixed left sidebar;
   - tablet 700–1023px: two-column dashboard treatment with bottom navigation;
   - phone <700px: full-width hero, stacked cards and bottom navigation.
3. Home rebuilt around the approved design:
   - cinematic squad hero;
   - real squad summary cards;
   - recent players from saved squad data;
   - real saved drill/Master-card counts;
   - saved Team Plan snapshot when available;
   - profile-completeness insight;
   - working quick actions.
4. Login/auth gate restyled into the same cinematic product language without changing Firebase/auth behaviour.
5. Runtime/cache/launcher identity advanced to v0.6.1.
6. v0.5.17 decision-data bundle and v0.5.15 calibrated scoring fingerprint deliberately unchanged.

## Important implementation boundary

Do **not** rewrite all football engines while redesigning pages. Formation, Tactics, Set Pieces, Mentor, Training, scanner recognition and Best-in-Slot logic are frozen unless a separate evidence-backed logic task explicitly reopens them.

The v0.6.x branch is a UI/product-design branch. Existing data and controls must be re-housed, not silently removed or replaced with fake mockup content.

## Planned visual passes

- **v0.6.1** — shell + login + Home foundation (this build).
- **v0.6.2** — Squad + Add/Update Player scanner surfaces.
- **v0.6.3** — Player Profile responsive redesign.
- **v0.6.4** — Training + My Drills.
- **v0.6.5** — Team Plan: Formation / Set Pieces / Tactics / Mentor presentation.
- **v0.6.6** — Settings + Account/Security.
- **v0.6.7+** — responsive polish, accessibility, animation/performance, visual consistency and user-requested refinements.

Patch numbering is illustrative; if one page needs multiple user-review passes, keep incrementing v0.6.N rather than using r-suffixes.

## Responsive rules

- Never stretch a phone layout across desktop.
- Never require hover for core actions.
- Keep touch targets comfortable on phone/tablet.
- Desktop should use the available width; avoid the old ~920px narrow centre column.
- Mobile must keep the current no-opponent, own-squad workflow fully usable.
- Dense pages may use fewer hero graphics than Home/Profile so readability and performance stay strong.
- Runtime images must be optimised; design reference images are documentation only.

## Current next step

User-test v0.6.1 at desktop and phone widths. If the shell/Home/auth direction matches the selected mockups, continue directly into v0.6.2 Squad/scanner rather than reopening the visual-direction search.

## Mandatory recovery workflow

Every v0.6.x pass must:

1. update this design handoff (or its successor);
2. update `docs/continuity/CURRENT_STATE.md`;
3. run relevant regression/static/package tests;
4. create a complete app ZIP;
5. extract that exact ZIP into a fresh folder;
6. rerun critical verification against the extracted copy;
7. deliver the verified ZIP to the user.
