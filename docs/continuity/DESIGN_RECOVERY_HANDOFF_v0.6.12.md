# Top Eleven Tool — v0.6.12 Design Recovery Handoff

**Status:** UNPUBLISHED DESIGN PASS 12  
**UI/runtime version:** v0.6.12  
**Decision/calibration contract:** v0.5.17 frozen  
**Scoring/model fingerprint:** companion-strategy-v2-own-squad-runtime-v0515 — unchanged

## Fixed pass scope
Browser-QA recovery and true portrait viewport fit only. Preserve the approved dark navy / neon green / cyan v0.6 design, authoritative game-extracted assets and all frozen football/scanner/calibration logic. Do not weaken or remove the execution environment's managed Chromium policy.

## Root-cause investigation
Chromium is not broken. The execution image contains `/etc/chromium/policies/managed/000_policy_merge.json` with managed `URLBlocklist: ["*"]`. That policy rejects ordinary local HTTP, file and data navigation with `net::ERR_BLOCKED_BY_ADMINISTRATOR`. Chromium DevTools/Playwright control itself works correctly.

The safe workaround is an offline QA harness: launch the installed Chromium, stay on `about:blank`, inject the shipped app HTML/CSS/JS with local resources embedded as data URIs, provide in-memory `localStorage`/`sessionStorage` plus a cloud transport stub, and exercise the real app runtime without making a browser navigation request. The harness is `tests/offline_browser_viewport_audit.py`.

## Production bug found by real Chromium
The v0.6.9 portrait compact-fit technique widened the layout and then relied on CSS zoom:
- phone portrait: `main { width:125%; zoom:.8 }`;
- tablet portrait: `main { width:117.65%; zoom:.85 }`.

Chromium continues to include the widened layout in document overflow. The v0.6.11 baseline therefore reproducibly measures:
- 390x844 phone portrait -> ~488px document width;
- 768x1024 tablet portrait -> ~904px document width;
- all 9 audited pages overflow at both portrait profiles = 18 failures.

## v0.6.12 implementation
- Keep compact portrait header, footer, buttons, type scale, spacing and the existing approved mobile/tablet visual identity.
- Replace widened/zoomed portrait `main` with a true `width:100%`, `zoom:1`, no-transform viewport fit.
- At portrait tablet widths 700–900px only, reflow Squad, Scanner and Drills workspaces whose retained desktop minimum widths exceed the real viewport; Team Plan's portrait forced minimum remains removed.
- Add the reusable real-Chromium offline viewport harness with explicit fine-pointer desktop and coarse-pointer touch profiles.
- Classify navigation by actual rendered geometry rather than by the shared `.bottom-nav` class, because that same element becomes the desktop sidebar.

## Browser audit matrix
Representative profiles:
- desktop 1440x900, fine pointer -> sidebar;
- tablet landscape 1180x820, coarse pointer -> bottom navigation;
- tablet portrait 768x1024, coarse pointer -> bottom navigation;
- phone landscape 844x390, coarse pointer -> bottom navigation;
- phone portrait 390x844, coarse pointer -> bottom navigation.

Pages: Home, Squad, Player Profile, Add Player/Scanner, Training, Drills, Team Plan, Settings and Account.

Stop condition: the v0.6.11 baseline must reproduce the portrait overflow; v0.6.12 must pass all 45 page/view combinations with no horizontal document overflow, no console errors and the expected sidebar/bottom-nav mode, then regressions/frozen-engine containment/ZIP verification must pass.

## Critical non-changes
No scanner recognition/calibration logic, Playstyle/SA reference data, Training logic, Formation logic, Tactics logic, Mentor logic, Set Piece logic, cloud/auth production behaviour, canonical decision data, calibrated scoring or game-extracted production assets are changed by Pass 12.

## Next planned unit
Treat the v0.6 redesign as entering stabilization. Future responsive fixes should use `tests/offline_browser_viewport_audit.py` first, then real-device screenshots when available. Do not return to source-only responsive validation when real Chromium can be exercised safely through the offline harness.

## Mandatory pass-end workflow
Run the offline Chromium matrix, deterministic regressions and frozen-engine containment checks, update recovery/current-state/validation documentation, create the complete app ZIP, extract that exact ZIP into a fresh folder, rerun critical verification against the extracted copy, and deliver the verified ZIP.

## Pass 12 validation result
PASS — v0.6.11 reproduces 18 real-Chromium portrait overflow failures; v0.6.12 passes 45/45 real-Chromium page/view combinations with zero horizontal document overflow and zero console errors. Deterministic regressions pass and frozen engines/data are byte-identical to v0.6.11. See `V0612_DESIGN_PASS12_VALIDATION.md`.
