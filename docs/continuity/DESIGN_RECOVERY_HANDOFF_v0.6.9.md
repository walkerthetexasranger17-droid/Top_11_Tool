# Top Eleven Tool — v0.6.9 Design Recovery Handoff

**Status:** UNPUBLISHED DESIGN PASS 9  
**UI/runtime version:** v0.6.9  
**Decision/calibration contract:** v0.5.17 frozen  
**Scoring/model fingerprint:** companion-strategy-v2-own-squad-runtime-v0515 — unchanged

## Fixed pass scope
Global shell correction requested from real-device testing, then Update Players / scan queue only. No unrelated page redesigns were started.

## Global orientation behaviour
- Landscape remains the preferred phone/tablet presentation because it preserves the approved desktop-style information density.
- Portrait is **supported**, not blocked.
- The v0.6.8 rotate-to-landscape gate was removed.
- `manifest.json` now allows `orientation: any` for the web/PWA build.
- Coarse-pointer portrait uses the same approved v0.6 design in compact-fit mode: ~50px header, ~50px bottom navigation, smaller controls, tighter spacing and a scaled content canvas.
- Desktop still uses the left sidebar.
- Mobile/tablet navigation remains the bottom navigation.
- Heroes keep the same artwork and identity; they are cropped/repositioned rather than redesigned.

## v0.6.9 Update Players / scan queue implementation
- Existing production Scanner artwork is deliberately reused; no duplicate/fake artwork was generated because the Update Players workflow is the same scanner workspace in a different safe mode.
- Update mode now has a dedicated `Update Players` overview strip showing:
  - real squad count,
  - screenshots remaining,
  - automatic updates completed,
  - rows requiring review/retry.
- The Scanner page gains an `update-mode` visual state while preserving the same approved page design.
- Update-mode hero copy now clearly describes the identity-safe update workflow.
- Existing automatic name matching, age/skills-only writes, derived OVR recalculation, retry/review safeguards, queue persistence and auto-save behaviour are unchanged.
- Existing saved name, roles, Playstyle and Special Abilities remain protected during updates.

## Asset audit
- Reused `assets/v060/scenes/scanner-hero-desktop.webp` and `scanner-hero-landscape.webp` because they already satisfy this page unit.
- Existing game-extracted mentor images remain authoritative and untouched.
- Existing approved playstyle and Special Ability assets remain authoritative and untouched.

## Critical non-changes
No scanner recognition/calibration logic, playstyle/SA reference data, cloud/auth behaviour, training logic, formation logic, tactics logic, mentor logic, set-piece logic, canonical decision data or calibrated scoring was changed.

## Next planned complete unit
Cross-device consistency / responsive QA across all redesigned pages, using desktop + landscape phone/tablet + compact portrait fallback.
