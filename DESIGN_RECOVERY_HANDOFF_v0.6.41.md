# Top Eleven Tool — v0.6.41 Recovery Handoff

## Current baseline
- v0.6.41 is the current development baseline.
- Scope: global surface-consistency polish + primary-action visual redesign.
- v0.6.40 manager-avatar alignment/high-resolution URL behaviour is preserved.
- v0.6.39 drill category tints and gold Mastercard treatment are preserved.
- Decision/football baseline remains frozen at v0.5.17.
- Scanner calibration remains VERSION=12.
- Continue split packaging: lean deploy ZIP + full recovery ZIP.
- Superseded root-level v0.6.7–v0.6.16 design handoffs were pruned in this pass to keep the recovery package under the established file-count ceiling; the current handoff and frozen calibration recovery remain authoritative.

## Global glass contract
The user wants approved page backgrounds visible through the UI, with the same visual density throughout the app rather than a mixture of solid and translucent boxes.

v0.6.41 therefore standardises the major panels, nested rows/cards, form controls and secondary UI boxes onto a shared translucent navy glass family. This includes Home, Squad, Training, Drills, Scanner/Add Player, Team Plan, Settings, Manager Profile and Player Profile legacy surfaces.

### Exceptions
- Top/bottom navigation chrome remains intentionally stronger for readability.
- Warning/danger/selected states keep their semantic tint.
- Training/Drills category cards keep Attack red, Defence green, Possession yellow, Physical & Mental blue.
- Mastercards keep gold framing plus their category tint.
- No heavy blur is added to scrolling lists; alpha is the main transparency mechanism.

## Primary action contract
Bright lime primary buttons no longer render as solid neon slabs. Primary actions use:
- translucent lime/green glass interior;
- cyan/blue outer border;
- subtle lime inset highlight;
- readable light text;
- transparent disabled state.

This applies to `.btn.primary`, including the Squad Add Player action, Training Build Session, Manager/Profile save/setup actions, Settings primary actions and other existing primary buttons. CTA-like scan/training green controls use the same language.

## Avatar contract retained from v0.6.40
- Top-right account avatar and Manager Profile avatar stay centred with `object-fit: contain` and `object-position: 50% 50%`.
- Google-hosted profile URLs request larger image sizes where supported, with fallback to the original URL.

## Frozen / deferred
- No football/formation/tactics/mentor/calibration changes.
- No Training optimiser or Mastercard inventory logic changes.
- No Scanner VERSION=12 changes.
- Remaining image-dependent redesign areas: Team Plan, Update Player, Login/Splash, Player Profile.


## Validation status
- 355 core assertions PASS.
- Scanner v12 regression PASS.
- Navigation/render, cloud hydration and automatic player-update contracts PASS.
- Mastercard consumption/recalculation PASS.
- Recovery package cleanliness/integrity PASS.
- Real Chromium viewport audit PASS on both recovery and lean deploy packages: 45 page/device combinations each, 0 horizontal overflow, 0 console errors.
