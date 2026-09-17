# Top Eleven Tool — v0.6.3 Design Recovery Handoff

**Status:** UNPUBLISHED DESIGN PASS 3  
**UI/runtime version:** v0.6.3  
**Decision/calibration contract:** v0.5.17 frozen  
**Scoring/model fingerprint:** companion-strategy-v2-own-squad-runtime-v0515 — unchanged

## Locked visual direction

Do not reopen broad design exploration unless the user explicitly asks. The approved production language is:
- dark navy / near-black shell;
- neon lime primary actions and cyan information accents;
- cinematic football imagery on high-value identity surfaces;
- dense professional data views on working screens;
- Barlow Condensed display typography with DM Sans body copy;
- desktop persistent left sidebar;
- tablet responsive reflow;
- mobile uses the SAME visual design with the left sidebar replaced by the bottom navigation bar;
- hero art is cropped/repositioned responsively rather than replaced by a different mobile design.

## v0.6.3 implementation scope

This pass implements the approved Player Profile direction in the real app.

1. Player Profile rebuilt around the approved cinematic identity composition.
2. Dedicated production assets added and precached:
   - `assets/v060/scenes/profile-hero-desktop.webp`
   - `assets/v060/scenes/profile-hero-mobile.webp`
3. Approved Player Profile reference is preserved at:
   - `docs/design/reference/v060/approved-player-profile-desktop.webp`
4. Profile name rendering now supports the approved white + lime split treatment while preserving arbitrary player names.
5. Existing role artwork remains the live player visual, so GK / Defender / Midfielder / Attacker profiles use the correct existing production role asset.
6. Train Player, Update by Scan and Edit Player remain the real existing actions.
7. Playstyle and Special Ability cards remain sourced from real saved player data and the verified icon packs.
8. Lowest key attributes remain derived from the player's natural-role white skills; the pass adds a real-data development insight based on the three weakest visible key attributes.
9. Role Intelligence has been restyled into the approved role-score presentation without changing the underlying role score calculation.
10. Complete Skills now uses compact grouped progress bars to match the selected mockup while preserving all actual skill values and white/grey distinctions.
11. Desktop uses a three-panel intelligence workspace; tablet reflows to two columns; mobile keeps the same identity, colours and components while stacking the panels and retaining the bottom navigation.
12. Existing profile editing, primary-role changes, scan update flow and delete behavior remain wired to the existing application logic.

## Critical non-changes

This is a design implementation pass, not a recalibration. Formation, Tactics, Set Pieces, Mentors, training selection/scoring, scanner-recognition rules, Special Ability eligibility and decision-model data must not be changed by this pass.

The v0.5.17 decision contract and v0.5.15 scoring fingerprint remain frozen.

## Next design work

Continue directly into the approved Training page visual system, then Team Plan, Drills, Settings and scanner surfaces. Keep the same responsive rule: same design on all devices; desktop sidebar becomes mobile bottom navigation; hero images crop/reposition instead of switching to a separate mobile design language.

## Mandatory pass-end workflow

Every future pass must reserve time to:
1. update the embedded handoff/current-state docs;
2. run relevant regression tests;
3. create the full current app ZIP;
4. extract and verify the ZIP;
5. provide the verified backup ZIP to the user.
