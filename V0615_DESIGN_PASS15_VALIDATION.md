# v0.6.15 — Corrective Home Fidelity Validation

**Pass:** Corrective Home Fidelity / Visual-System Baseline  
**Date:** 2026-09-17  
**Baseline:** verified v0.6.14 Pass 14 package  
**Frozen decision/calibration base:** v0.5.17

## Why this pass was reopened
The earlier Home fidelity implementation was rejected after direct comparison with the approved Home desktop/mobile references. The live page lacked the defining header/hero composition and mobile dashboard hierarchy. Later-page fidelity work was stopped and Home was rebuilt first so it can become the implementation reference for all future pages.

## Literal visual contracts
- `docs/design/reference/v060/approved-home-desktop.webp`
- `docs/design/reference/v060/approved-home-mobile.webp`

## Implemented visual corrections
- full desktop utility header: brand, search, Cloud Synced and account area;
- dominant cinematic stadium/player hero rather than a dark empty header region;
- centre-right #11 footballer composition with dedicated desktop/mobile production assets;
- approved three-line Home headline and CTA hierarchy;
- four live summary cards overlapping the hero/body edge;
- approved desktop dashboard editorial grid;
- approved dense phone composition: Recent Players left, Training + Team Plan right, Performance Insights + Quick Actions below;
- stacked mobile hero CTAs matching the approved mobile hierarchy;
- touch bottom navigation remains Home / Squad / Training / Team Plan / More;
- all dashboard values remain real app data, not mock reference values.

## Production assets added
- `assets/v060/scenes/home-hero-desktop-v0615.webp`
- `assets/v060/scenes/home-hero-mobile-v0615.webp`

## Populated-state visual QA
A browser-only 11-player test squad was used to inspect the populated Home on desktop, portrait phone and landscape phone. The seed was not written into production state.

## Real Chromium viewport audit
`python tests/offline_browser_viewport_audit.py --app .`

Result:
- **45/45 page/view combinations PASS**;
- **0 horizontal-overflow cases**;
- **0 console errors**;
- desktop nav mode = sidebar;
- coarse-pointer tablet/phone nav mode = bottom navigation.

## Regression results
PASS:
- `tests/release_identity_contract.py`
- `tests/static_checks.py`
- `tests/v060_design_contract.py`
- `tests/v0613_home_fidelity_contract.py`
- `tests/v0614_squad_fidelity_contract.py`
- `tests/v0615_home_fidelity_contract.py`
- `tests/cloud_hydration_contract.py`
- `tests/runtime_hardening_contract.py`
- `tests/navigation_queue_contract.py`
- `tests/navigation_render_contract.py`
- `tests/package_integrity.py`
- `tests/core-tests.js` — **355 assertions**
- `tests/scanner_regression.py`
- `tests/scanner_failover_tests.js` — **11 assertions**
- `tests/player_update_auto_match.js` — **11 assertions**
- `tests/player_update_persistence.js` — **20 assertions**

## Final standalone Home asset integration
- reviewed standalone Home asset pack #06–#35 copied into `assets/v0615/home/`;
- five large Home scene assets integrated individually;
- production Home references the standalone assets rather than any contact-sheet/mockup output;
- service-worker deploy precache: **100 files / under 5 MB**, including the five Home scenes and primary Home UI assets; remaining decorative Home assets use normal runtime caching.

## Deploy-test verification
After final asset integration:
- release identity PASS;
- package integrity PASS;
- v0.6.15 Home fidelity contract PASS;
- core suite **355 assertions PASS**;
- Scanner regression/failover PASS;
- Update Players matcher/persistence PASS;
- real-Chromium viewport matrix **45/45 PASS**, zero horizontal overflow, zero console errors.

## Historical maintenance probes
Unchanged non-product failures:
- `tests/player_update_scan_contract.py` — historical Training DOM-order assertion: `Master card stock renders above normal drills`;
- `tests/package_cleanliness.py` — obsolete maintenance file-count ceiling; current working tree reports 793 files.

Neither failure was introduced by the Home fidelity implementation.

## Frozen-engine containment
SHA-256 comparison against the verified v0.6.14 baseline checked 20 frozen engine/data files covering Scanner, Training, Team Training, Formation, Tactics, Mentors, Team Plan, Best-in-Slot, strategy/optimizer/data, recommendations/squad coverage and canonical decision data.

**20 checked / 0 changed.**

## Result
**PASS — v0.6.15 corrects Home to the approved reference-led visual system, preserves real data and frozen football/scanner/training logic, and establishes Home as the visual baseline for subsequent fidelity passes.**

## Next fixed pass
**v0.6.16 — Squad Fidelity Re-audit** against the approved Squad reference and this corrected Home visual-system baseline.
