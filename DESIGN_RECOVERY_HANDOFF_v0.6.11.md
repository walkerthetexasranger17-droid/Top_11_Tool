# Top Eleven Tool — v0.6.11 Design Recovery Handoff

**Status:** UNPUBLISHED DESIGN PASS 11  
**UI/runtime version:** v0.6.11  
**Decision/calibration contract:** v0.5.17 frozen  
**Scoring/model fingerprint:** companion-strategy-v2-own-squad-runtime-v0515 — unchanged

## Fixed pass scope
Real-device/responsive polish verification following v0.6.10. This pass is limited to concrete responsive cascade faults affecting narrow portrait phones/tablets. No alternative design direction, new feature/page work, production game-asset replacement, or football/scanner/calibration change is permitted.

## Source/device audit result
The environment still blocks Chromium local-page navigation, so live browser screenshots remain **ENVIRONMENT BLOCKED — NOT APPLICATION FAILURE**. A cascade-width audit found two provable edge-breakpoint faults:
1. on narrow portrait phones, the late compact portrait rule narrowed the Squad hero copy to 58% while re-expanding its two actions to a flex row with 125px minimum widths, allowing the action row to exceed its own copy area;
2. on 700–767px portrait coarse-pointer tablets, the compact 0.85 canvas could still inherit re-expanded Scanner review, Team Plan minimum-width and Drills two-column workspace rules wider than the effective canvas.

## v0.6.11 implementation
- Narrow portrait phones (<=460px coarse pointer): Squad hero copy again uses the available hero width; Add Player / Update Players remain a balanced two-column mobile action grid with zero forced minimum width.
- Narrow portrait tablets (700–767px coarse pointer): Scanner review restores its approved two-column tablet reflow with attributes spanning both columns; Team Plan drops the late forced 860px minimum; Drills restores its approved single-column workspace/master stock layout.
- Desktop sidebar, phone/tablet bottom navigation, compact landscape shell, portrait support, all v0.6 page identities and authoritative game-extracted assets are unchanged.

## Critical non-changes
No scanner recognition/calibration logic, Playstyle/SA reference data, Training logic, Formation logic, Tactics logic, Mentor logic, Set Piece logic, cloud/auth behaviour, canonical decision data or calibrated scoring is changed by Pass 11.

## Next planned unit
Use real-device screenshots/feedback from representative desktop, phone and tablet hardware as final visual confirmation. If faults are reported, keep fixes narrow in a v0.6.x polish pass. If the visual review is clean, treat the v0.6 redesign as ready for stabilization/release-candidate planning rather than opening another redesign pass automatically.

## Mandatory pass-end workflow
Run regressions and frozen-engine containment checks, update recovery/current-state/validation documentation, create the complete app ZIP, extract that exact ZIP into a fresh folder, rerun critical verification against the extracted copy, and deliver the verified ZIP.

## Pass 11 validation result
PASS — deterministic responsive contract, runtime/navigation/cloud/scanner/package regressions and 355 core assertions pass. Frozen engines/data are byte-identical to v0.6.10. The two inherited maintenance probes remain unchanged and documented in `V0611_DESIGN_PASS11_VALIDATION.md`.
