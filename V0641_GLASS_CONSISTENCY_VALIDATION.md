# v0.6.41 Glass Consistency Validation

## Scope
Visual-only pass to make content-surface transparency consistent across the app and convert lime primary buttons to cyan-framed glass actions. v0.6.39 drill category colours, v0.6.40 shared-avatar behaviour, Scanner v12 and frozen v0.5.17 decision logic remain unchanged.

## Implemented
- Major panels across Home, Squad, Training, Drills, Scanner/Add Player, Team Plan, Settings, Manager Profile and legacy Player Profile now share one translucent navy glass family.
- Nested rows/cards/fields were swept too so they no longer fall back to opaque navy islands.
- Primary green actions now use a translucent lime/green glass interior with cyan/blue frame and subtle lime inset highlight.
- Squad Add Player, Training Build Session and existing `.btn.primary` actions inherit the same rule.
- Scan/training CTA-like green controls use the same visual language.
- Training/Drills category hues remain Attack red, Defence green, Possession yellow, Physical & Mental blue; Mastercards retain gold framing plus category tint.
- Top-right and Manager Profile avatars retain centred/non-stretched v0.6.40 behaviour and Google higher-resolution source upgrade.

## Verification
Worktree and freshly extracted package checks passed:
- v0.6.41 static visual contract: PASS.
- v0.6.41 real-Chromium glass/button/avatar contract: PASS.
- static integrity: PASS — 219 IDs / 9 pages.
- release identity: PASS — UI/runtime/cache at v0.6.41; v0.5.17 decision contract preserved.
- cloud hydration/navigation: PASS.
- core deterministic suite: PASS — 355 assertions.
- Scanner v12 regression: PASS.
- navigation/render regression: PASS.
- automatic player-update contract: PASS — 31 assertions.
- Mastercard consumption/recalculation: PASS.
- package cleanliness: PASS — recovery under 1,000-file maintenance ceiling.
- service-worker/package integrity: PASS — 115 install-precache assets / 6,381,774 bytes.
- real Chromium responsive audit on recovery package: PASS — 5 device profiles × 9 pages = 45 combinations; 0 horizontal-overflow cases; 0 console errors.
- real Chromium responsive audit on lean deploy package: PASS — 45 combinations; 0 horizontal-overflow cases; 0 console errors.

No football, scanner-calibration, training-optimiser or Mastercard inventory calculation was changed in this pass.
