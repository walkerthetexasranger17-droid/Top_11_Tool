# Top Eleven Tool — v0.6.42 Recovery Handoff

## Current baseline
- v0.6.42 is the current development baseline.
- Scope: deep visual surface-system audit across every signed-in page and every major/nested UI box.
- v0.6.40 manager-avatar centring/high-resolution Google photo behaviour is preserved.
- v0.6.39 Training/Drills category tints and gold Mastercard treatment are preserved.
- Decision/football baseline remains frozen at v0.5.17.
- Scanner calibration remains VERSION=12.
- Continue split packaging: lean deploy ZIP + full recovery ZIP.

## v0.6.42 surface system
The previous v0.6.41 pass made many surfaces translucent, but page-specific legacy rules still produced inconsistent opacity and some special components were visually damaged. v0.6.42 replaces that ad-hoc result with one explicit signed-in-app surface taxonomy:

1. **Major panel glass** — Home/Squad/Training/Scanner/Drills/Team Plan/Settings/Manager Profile/legacy Player Profile structural cards.
2. **Nested glass** — rows, mini-cards, status boxes, profile subcards, Best-in-Slot cards, drill support cards and similar secondary surfaces.
3. **Control glass** — inputs, dropdown triggers, search fields, selector menus and view switches use a slightly stronger translucent navy for readability.
4. **Primary lime action** — all primary actions are fully lime from edge to edge, with a cyan/blue border and glass depth. No half-lime/half-dark gradient is allowed.
5. **Category glass** — Training/Drills preserve Attack red, Defence green, Possession yellow and Physical & Mental blue across the full card surface.
6. **Master glass** — the underlying category hue remains visible, with gold framing identifying a consumable Mastercard.
7. **Semantic states** — warning, danger, selected and preferred states retain restrained semantic tints.

## Squad swipe-delete protection
A translucent Squad player row exposed the red Delete rail underneath even while the row was closed. v0.6.42 explicitly hides the delete rail until the row is actively swiping or fully open. JS adds/removes a `swiping` state during horizontal drag so the rail still appears naturally during the gesture.

## Primary button contract
- Whole button body remains lime/green; no dark half is permitted.
- Cyan/blue outer border remains visible.
- Text is dark for contrast on the lime surface.
- Hover remains fully lime.
- Disabled state is muted but readable.
- Existing primary-button behaviour is unchanged.

## Deliberate exclusions
- Top and bottom app chrome are framing surfaces and stay denser.
- Page hero/background imagery is not part of the glass-token sweep.
- Login/Splash remains a separate pending redesign and is not visually finalised by this pass.
- Team Plan, Update Player, Login/Splash and Player Profile still require their remaining dedicated imagery/redesign work.

## Frozen logic
- No football, formation, tactics, mentor, optimiser or recommendation calibration changes.
- No Training calculation changes.
- No Mastercard inventory calculation changes.
- No Scanner VERSION=12 changes.

## Validation / packaging status
- Core deterministic suite: 355 assertions PASS.
- Scanner v12 regression PASS.
- Navigation/cloud/player-update/Mastercard regressions PASS.
- v0.6.42 static + real-Chromium surface-system contracts PASS.
- Recovery package cleanliness: 996 files / 50,625,692 bytes.
- Service-worker install precache: 115 assets / 6,394,122 bytes.
- Recovery and lean deploy real-Chromium audits: 45 page/device combinations each, 0 horizontal overflow, 0 console errors.
- Current release artifacts: lean deploy ZIP + full recovery ZIP.
