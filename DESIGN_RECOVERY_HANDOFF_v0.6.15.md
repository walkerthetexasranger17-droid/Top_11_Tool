# Top Eleven Tool — v0.6.15 Design Recovery Handoff

**Date:** 2026-09-17  
**UI/runtime version:** v0.6.15  
**Pass:** Corrective Design Pass 15 — Home Fidelity / Visual-System Baseline  
**Frozen decision/calibration base:** v0.5.17

## Why this corrective pass exists
The earlier Home fidelity pass was incorrectly marked complete. Real-device review showed that the live page did not actually reproduce the approved Home reference: the cinematic hero was effectively absent, the header/hero relationship was wrong, and mobile dashboard composition had drifted into a generic stack. The user explicitly stopped later-page work and required Home to be completed properly first, then used as the reference system for future pages.

## Literal visual contract
- `docs/design/reference/v060/approved-home-desktop.webp`
- `docs/design/reference/v060/approved-home-mobile.webp`

These are literal composition targets, not loose inspiration. Production data stays real; invented reference values are not copied into runtime state.

## Fixed scope completed
Home only:
- restored full desktop utility header: brand, search, Cloud Synced and account area;
- rebuilt the hero as the dominant upper-page composition;
- created dedicated production hero derivatives with a centre-right #11 footballer and stadium scene:
  - `assets/v060/scenes/home-hero-desktop-v0615.webp`
  - `assets/v060/scenes/home-hero-mobile-v0615.webp`;
- restored the three-line `YOUR SQUAD. / YOUR PLAN. / YOUR NEXT WIN.` composition and CTA hierarchy;
- restored stat cards overlapping the lower hero edge;
- desktop dashboard follows the approved Recent Players / Training Builder / Team Plan / Performance Insights / Quick Actions grid;
- phone portrait keeps the same approved dense two-column information architecture instead of becoming a different stacked app;
- phone hero uses stacked Get Started / Watch Tour CTAs like the approved mobile reference;
- touch navigation remains Home / Squad / Training / Team Plan / More;
- real app data hooks remain live for squad counts, OVR, recent players, drills, saved Team Plan and profile coverage.

## Final Home production asset pack
The corrective Home build now uses the reviewed standalone asset pack under `assets/v0615/home/` rather than temporary composite/sheet artwork. The pack contains:
- 5 large production scene assets (desktop/mobile hero, Training Builder, Performance Insights, Team Plan pitch);
- standalone transparent UI assets #06–#35 for card texture, hero underline, stat icons, section/action/nav/header icons, arrows, focus indicators and manager fallback;
- real saved player/role imagery, live position badges, live formation dots and the existing approved app logo remain authoritative and are not regenerated.

The Home HTML/JS/CSS references the final asset pack directly. Service-worker precache includes the five large Home scenes and primary #08–#29 UI assets; lower-priority decorative assets are runtime-cached on first use.

## Deploy-test checkpoint
The user explicitly requested a deployable v0.6.15 build at this point to view Home with their actual saved/cloud team data. This is a Home-fidelity test checkpoint, not permission to start later page fidelity work before Home is accepted.

## Critical non-changes
No scanner recognition/calibration, Training scoring/selection, Formation, Tactics, Mentor, Set Piece, Team Plan decision logic, Best-in-Slot scoring, strategy data, Playstyle/SA reference data or authoritative game assets were recalibrated or replaced.

## Visual-system rule going forward
This corrected Home is now the primary implementation reference for later fidelity passes. Future pages must inherit its:
- desktop topbar/sidebar proportions;
- near-black/navy base;
- neon lime primary action and cyan information colour;
- cinematic imagery discipline;
- condensed uppercase heading hierarchy;
- thin cyan panel borders;
- dense card proportions;
- compact responsive behaviour without simplifying the product into a different mobile design.

## Browser QA
The offline real-Chromium harness is mandatory. v0.6.15 passed all 45 page/view combinations with zero horizontal overflow and zero console errors. A browser-only 11-player seed was also used to inspect populated Home composition; it is not production state.

## Next fixed pass
**v0.6.16 — Squad Fidelity Re-audit.** Re-open Squad against its approved reference and the corrected v0.6.15 Home visual-system baseline. Do not assume the earlier Squad pass was sufficiently faithful merely because responsive tests passed.

## User-review workflow
Do not ask the user to test intermediate fidelity passes. Continue page-by-page with mandatory verified backup ZIPs; the user wants one consolidated test/feedback round only after the complete fidelity sequence.
