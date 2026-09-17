# Top Eleven Tool — v0.6.8 Design Recovery Handoff

**Status:** UNPUBLISHED DESIGN PASS 8  
**UI/runtime version:** v0.6.8  
**Decision/calibration contract:** v0.5.17 frozen  
**Scoring/model fingerprint:** companion-strategy-v2-own-squad-runtime-v0515 — unchanged

## Fixed pass scope
Add Player / Scanner only, plus the global landscape shell blocker discovered on real-device testing. No unrelated page redesigns were started.

## Global landscape requirement now implemented
- `manifest.json` declares `orientation: landscape` for installed PWA behaviour.
- Coarse-pointer phone/tablet portrait view shows a rotate-to-landscape gate instead of rendering a squashed portrait layout.
- Landscape phone/small-tablet shell is compact: ~46px app header and ~48px bottom navigation, reclaiming the vertical viewport that v0.6.7 lost to the shell.
- Desktop still uses the approved left sidebar. Mobile/small landscape devices keep the approved bottom navigation.
- Existing redesigned heroes are cropped/compacted in landscape rather than replaced with separate mobile visual identities.

## v0.6.8 Scanner implementation
- Audited and reused `assets/scenes/add-player.webp`; no fake scanner artwork was generated.
- Created production derivatives in `assets/v060/scenes/`:
  - `scanner-hero-desktop.webp`
  - `scanner-hero-landscape.webp`
- Rebuilt the Add Player / Scanner page into the v0.6 production visual system while preserving all existing scanner IDs and event wiring.
- Scanner workspace now separates screenshot/queue work from the real workflow/configuration guidance.
- Review mode is organised into verification, identity/roles, and attributes without changing the scanner engine, save rules, queue semantics, or visual-reference logic.
- Manual Add Player remains the existing real manual path.

## Critical non-changes
No scanner recognition logic, playstyle/SA reference data, cloud/auth behaviour, training logic, formation logic, tactic logic, mentor logic, set-piece logic, canonical decision data, or calibrated scoring was changed.

## Existing authoritative assets
- Existing game-extracted mentor portraits remain authoritative and untouched.
- Existing approved playstyle and Special Ability reference assets remain authoritative and untouched.

## Next planned complete page unit
Update Players / scan queue workflow visual pass, after real-device verification of the v0.6.8 landscape shell and Scanner page.
