# Top Eleven Tool — v0.6.14 Design Recovery Handoff

**Date:** 2026-09-17  
**UI/runtime version:** v0.6.14  
**Pass:** Design Pass 14 — Squad Fidelity  
**Frozen decision/calibration base:** v0.5.17

## Why Pass 14 exists
After Pass 13 restored Home fidelity, the user asked that the remaining redesign be completed page-by-page before they test the whole app. Pass 14 applies the same approved-reference fidelity standard to Squad. The approved Squad v2 reference is treated as the visual contract, not merely inspiration.

## Fixed scope
Squad page only:
- preserve the approved `YOUR PLAYERS. A STRONGER TOMORROW.` cinematic structure;
- keep the existing production Squad hero assets and real-data hooks;
- tighten hero scale so the headline follows the approved two-line composition;
- tighten five summary cards to the approved dense management-card proportions;
- preserve real Total / Average OVR / Highest OVR / Position Balance / Needs Attention calculations;
- preserve search, position, Playstyle, Special Ability, OVR and attention filters;
- preserve sort, List/Cards switching, player open, update mode and swipe-to-delete behaviour;
- tighten the desktop filter + roster workspace to match the approved professional table density;
- add position-coloured role chips to the roster presentation only;
- compact portrait filters so roster data appears sooner without removing controls;
- compact touch landscape so hero/stats/filters consume less vertical space;
- no frozen football/scanner/training/calibration logic changes.

## Approved reference
Primary visual contract:
- `docs/design/reference/v060/approved-squad-desktop-v2.webp`

The earlier `approved-squad-desktop.webp` remains historical reference material, but v2 is the primary Squad composition.

## Production assets
No new generated Squad artwork was required. Existing production assets are authoritative and reused:
- `assets/v060/scenes/squad-hero-desktop.webp`
- `assets/v060/scenes/squad-hero-mobile.webp`
- existing role artwork under `assets/roles/`
- existing real Special Ability icons.

## Browser QA
The v0.6.12 offline real-Chromium harness remains mandatory. Pass 14 additionally used a browser-only seeded squad to inspect the populated roster rather than approving only the empty state. The seed is not part of production state.

## User-review workflow
Do **not** stop for user testing after every fidelity pass. The user wants to test and give consolidated feedback only after the remaining page-fidelity sequence is complete. Continue page-by-page internally with mandatory regression/handoff/ZIP verification every pass.

## Stop condition
Pass 14 is complete only when:
1. the desktop Squad capture visibly follows the approved v2 hero/stats/filter/roster composition;
2. populated roster rows render cleanly using real app assets and data hooks;
3. portrait and touch-landscape Squad layouts stay compact and usable without horizontal document overflow;
4. all 45 real-Chromium page/view combinations pass with zero console errors;
5. Squad/Home fidelity contracts and core/scanner/update regressions pass;
6. frozen engine/data hashes are unchanged from v0.6.13;
7. embedded handoff/validation files are current;
8. a full v0.6.14 ZIP is created, extracted fresh and the critical suite is rerun against that exact ZIP.

## Next fixed pass
**v0.6.15 — Player Profile Design Fidelity**, using `docs/design/reference/v060/approved-player-profile-desktop.webp`, unless a blocking regression is discovered during v0.6.14 package verification.

## Pass 14 validation result
PASS — see `V0614_DESIGN_PASS14_VALIDATION.md`.
