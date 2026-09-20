# v0.6.14 Design Pass 14 Validation

**Pass:** Squad Design Fidelity  
**Date:** 2026-09-17  
**Baseline:** verified v0.6.13 Pass 13 package  
**Frozen decision/calibration base:** v0.5.17

## Fixed scope
Squad only: approved-reference fidelity, compact desktop/tablet/phone presentation, populated-roster visual QA, responsive/browser QA, recovery docs and verified full backup ZIP. No football/scanner/training calibration changes.

## Visual/reference implementation
Primary contract:
- `docs/design/reference/v060/approved-squad-desktop-v2.webp`

Implemented:
- approved two-line Squad hero proportions;
- five denser real-data summary cards;
- tighter desktop filter + roster workspace;
- populated professional roster table with real role artwork and existing Special Ability icons;
- position-coloured role chips as presentation-only styling;
- portrait filter compaction without dropping any filter;
- touch-landscape hero/stat/filter compaction;
- existing Add Player / Update Players, filtering, sorting, List/Cards, open-player and swipe-delete behaviour retained.

No new substitute football/game assets were generated.

## Real Chromium viewport audit
`python tests/offline_browser_viewport_audit.py --app <v0.6.14> --screenshots`

Result:
- 45/45 page/view combinations PASS;
- 0 horizontal-overflow cases;
- 0 console errors;
- desktop nav mode = sidebar;
- coarse-pointer tablet/phone nav mode = bottom navigation.

Profiles:
- desktop 1440×900;
- tablet landscape 1180×820;
- tablet portrait 768×1024;
- phone landscape 844×390;
- phone portrait 390×844.

Additional Squad visual QA:
- browser-only 11-player seeded squad rendered successfully on desktop, portrait phone and landscape phone;
- real roster columns, role art and Special Ability icons rendered without layout breakage;
- seed data was test-only and is not shipped as user data.

## Regression results
PASS:
- `tests/static_checks.py`
- `tests/v060_design_contract.py`
- `tests/v0613_home_fidelity_contract.py`
- `tests/v0614_squad_fidelity_contract.py`
- `tests/cloud_hydration_contract.py`
- `tests/runtime_hardening_contract.py`
- `tests/navigation_queue_contract.py`
- `tests/navigation_render_contract.py`
- `tests/package_integrity.py`
- `tests/core-tests.js` — **355 assertions**
- `tests/scanner_regression.py`
- `tests/scanner_failover_tests.js` — 11 assertions
- `tests/player_update_auto_match.js` — 11 assertions
- `tests/player_update_persistence.js` — 20 assertions

## Historical maintenance probes
Unchanged non-product failures:
- `tests/player_update_scan_contract.py` — historical Training DOM-order assertion: `Master card stock renders above normal drills`;
- `tests/package_cleanliness.py` — obsolete maintenance file-count ceiling (working tree now 781 files before final package docs).

These are not Pass 14 application regressions and were already documented as stale maintenance probes.

## Frozen-engine containment
SHA-256 comparison against verified v0.6.13 confirms byte-identical Scanner, Training, Team Training, Formation, Tactics, Mentor, Team Plan, Best-in-Slot, strategy/optimizer/data, squad-coverage/recommendation and canonical decision files. 20 explicitly checked frozen files: **0 changed**.

## Result
**PASS — v0.6.14 materially improves Squad fidelity to the approved v2 management-screen reference, preserves all real Squad behaviour, passes the full 45-case Chromium matrix and leaves frozen football/scanner/calibration logic unchanged.**

## Next fixed pass
**v0.6.15 — Player Profile Design Fidelity** against `approved-player-profile-desktop.webp`.
