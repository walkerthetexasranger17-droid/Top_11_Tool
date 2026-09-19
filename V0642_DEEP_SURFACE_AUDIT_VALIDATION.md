# v0.6.42 Deep Surface Audit Validation

## Scope
Aesthetic-system correction only. This pass audits every signed-in route and normalises major panels, nested surfaces, controls and primary actions without changing calibrated football/scanner/training logic.

## Implemented
- Replaced the partial v0.6.41 transparency sweep with one explicit surface hierarchy across Home, Squad, Add/Update Player scanner surfaces, Training, Drills, Team Plan, Manager Profile, Settings and legacy Player Profile components.
- Major panels now use the same translucent navy-glass density.
- Nested rows/cards/status boxes use a lighter shared glass density.
- Inputs, search boxes, dropdown triggers/menus and view switches use one slightly stronger control-glass density for readability.
- Primary actions are now FULL lime from edge to edge with a cyan/blue frame. The previous half-lime/half-dark gradient is prohibited.
- Hover remains fully lime; disabled primary actions remain readable and subdued.
- Training/Drills preserve Attack red, Defence green, Possession yellow and Physical & Mental blue category-tinted surfaces.
- Mastercards preserve their category hue underneath the gold Mastercard frame.
- Drills summary cards, toolbar/search controls, Team Plan tabs/actions, scanner manual-entry card, account/security sub-panels and other previously missed page-specific surfaces were brought into the same system.
- The Squad swipe-delete rail is hidden while a row is closed. A transient `swiping` state reveals the rail only during a horizontal drag; the normal `open` state reveals it after a completed swipe. This prevents the red destructive rail showing through translucent roster rows.
- v0.6.40 manager-avatar centring and higher-resolution Google profile URL handling remain intact.
- Old root recovery handoffs v0.6.17–v0.6.24 were pruned because the current handoff is authoritative and the recovery package must remain below its maintenance file-count ceiling.

## Frozen contracts
- Decision/football logic: v0.5.17 — unchanged.
- Scanner: VERSION=12 — unchanged.
- Training optimiser/calculations — unchanged.
- Mastercard inventory/consumption calculations — unchanged.

## Verification
Fresh recovery-package verification:
- release/runtime identity: PASS — v0.6.42 UI/runtime/cache synchronized.
- static integrity: PASS — 219 IDs / 9 pages.
- cloud hydration/navigation: PASS.
- deterministic core suite: PASS — 355 assertions.
- Scanner v12 regression: PASS.
- navigation/render regression: PASS.
- automatic player-update contract: PASS — 31 assertions.
- Mastercard consumption/recalculation: PASS.
- v0.6.42 deep-surface static contract: PASS.
- v0.6.42 real-Chromium surface/button/swipe contract: PASS.
- package cleanliness: PASS — 996 files / 50,625,692 bytes.
- service-worker/package integrity: PASS — 115 install-precache assets / 6,394,122 bytes.
- fresh recovery ZIP real-Chromium responsive audit: PASS — 5 device profiles × 9 pages = 45 combinations; 0 horizontal-overflow cases; 0 console errors.
- fresh lean deploy ZIP real-Chromium responsive audit: PASS — 45 combinations; 0 horizontal-overflow cases; 0 console errors.

The Login/Splash visual redesign remains deliberately outside this pass because it is one of the remaining image-dependent redesign areas.
