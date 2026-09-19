# v0.6.47 — Full Visual Correction Validation

## Scope
One complete correction pass for every issue requested after v0.6.46:
- Login composition/glass/button corrections;
- Update Player title size/position/transparency corrections;
- root-cause fix for background snap/stretch on non-Home/Squad pages;
- approved Team Plan changing-room background integration;
- visual asset prewarming while keeping the install precache bounded.

## Confirmed root cause
Real Chromium reproduced the old route snap before the fix. Affected fixed backgrounds initially rendered with an incorrect top offset and moved after the `.page` animation. The cause was the transform in the global `pageIn` animation creating a containing block for fixed descendants. Home/Squad were already immune because they used an opacity-only animation.

v0.6.47 makes the opacity-only page transition global and standardises portrait page-media geometry.

## Visual contracts
- Login logo is a sibling of the glass shell, not inside it.
- Login shell is compact; direct Email/Password fields are visible on the initial sign-in panel.
- Sign In uses the current themed green-action treatment.
- Google is a white provider button with the existing Google G icon.
- Update Player title canvas/visible footprint matches Add Player and has truly transparent corners.
- Update mode is applied before route activation.
- Team Plan uses `team-plan-approved.png` on touch/mobile/tablet.
- No first-frame geometry movement is permitted on fixed page backgrounds.

## Regression tests
- `tests/v0647_full_visual_contract.py`
- `tests/v0647_full_visual_browser.py`
- existing release/static/cloud/scanner/player-update/core/package tests remain mandatory.

## Frozen behaviour
- Football/decision baseline: v0.5.17.
- Scanner: VERSION=12.
- Training optimiser, Mastercard rules, squad model and cloud semantics unchanged.

## Completed verification
- Release/runtime identity: **PASS** — v0.6.47 runtime/cache synchronized; v0.5.17 decision baseline preserved.
- Static integrity: **PASS** — 218 IDs / 9 pages.
- Cloud hydration/navigation: **PASS**.
- Navigation/render regression: **PASS**.
- v0.6.47 full visual static contract: **PASS**.
- v0.6.47 focused real-Chromium visual contract: **PASS** — zero first-paint background geometry movement on tested routes; Update Player first-frame state/title standard; compact external-logo Login; Team Plan approved background.
- v0.6.42 deep-surface hierarchy: **PASS**.
- v0.6.45 green-action parity: **PASS** — 23 enabled primary controls + Team Plan active tab.
- Deterministic core suite: **PASS — 355 assertions**.
- Scanner VERSION=12 regression: **PASS**.
- Player update persistence: **PASS — 20 assertions**.
- Automatic player update contract: **PASS — 31 assertions**.
- Package integrity: **PASS — 115 install-precache files / 6,419,693 bytes**.
- Package cleanliness: **PASS — 1,025 recovery files / 56,249,109 bytes**.
- Fresh lean deploy mobile smoke: **PASS** — v0.6.47 Update/Login/Team Plan visual state and background geometry.

The legacy 5-device × 9-page monolithic Chromium audit did not complete in this execution environment (Playwright pipe EPIPE/timeout). It is classified as **ENVIRONMENT BLOCKED, not an application failure**. Focused real-Chromium regression tests for the exact changed surfaces and route-geometry bug completed successfully.
