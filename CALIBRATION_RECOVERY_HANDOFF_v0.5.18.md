# Top Eleven Tool — v0.5.18 Decision Recovery Handoff

**Status:** RELEASE — Drain Band Intent Fix  
**Date:** 2026-09-19  
**Parent:** v0.5.17 release-frozen own-squad model  
**Strategy model:** `companion-strategy-v2-own-squad-runtime-v0515` (formation/context calibration unchanged)  
**Tactics model:** `30527-drain-fit-v6-drain-band-intent-v0518-affinity-dedup-sa-canonical-ps-gate`

## Why v0.5.18 exists
The v0.5.17 tactic engine treated Drain Limit as a widening ceiling. Medium allowed Low+Medium plans and High allowed Low+Medium+High plans, while the 10-point drain-efficiency component and exact-score tie-break both rewarded cheaper plans. This meant a manager could change Medium to High and receive exactly the same visible tactics.

The user explicitly requested that Low / Medium / High produce meaningful drain intent. v0.5.18 therefore changes only the drain-band eligibility policy.

## Active Drain Limit semantics
For the historical/default drain profile used by the app runtime:
- **Low** searches only plans classified **Low** (`raw <= 40`).
- **Medium** searches only plans classified **Medium** (`40 < raw <= 65`).
- **High** searches only plans classified **High** (`raw > 65`).

Within the selected class, the existing lineup fit, own-squad structure, tactic coherence, Playstyle/SA semantics and drain-efficiency score remain active. Lower raw drain is still preferred only as an efficiency/tie-break consideration **inside the selected band**.

This guarantees that changing Low → Medium → High changes the selected drain class and therefore cannot silently return the identical tactic package.

## What did NOT change
- No opponent information, opponent strength, formation, tactics, match state or scouting data is accepted or inferred.
- Formation scoring/calibration remains the v0.5.15 own-squad model.
- Set Piece ranking remains unchanged.
- Mentor ranking remains unchanged.
- Training and Mastercard logic remain unchanged.
- Current mixed Medium/High live drain numeric weighting is still unresolved and is not fabricated.
- Scanner remains independent at VERSION 12.

## Runtime behavior
`js/tactics-engine.js`
- `withinDrainLimit()` now gates to the selected historical drain class rather than accepting every cheaper class.
- Public tactic output includes `drainPolicy: "target-band"` for the historical profile.
- Tactics model fingerprint bumped to v6/v0.5.18.

`js/app.js`
- Changing Approach or Drain Limit now calls `TeamPlan.updateRecommendations()` so the already-selected XI/formation remains fixed while tactics, Mentor context and Set Pieces are refreshed.
- It no longer re-runs `buildOptimalPlan()` merely because a tactic selector changed.

## Regression contract
`tests/v0518_drain_band_intent.js` verifies:
- Auto tactics returns Low, Medium and High drain classes exactly when each is selected.
- Low→Medium and Medium→High change at least one tactic on the neutral XI fixture.
- Fixed Defending/Balanced/Attacking approaches all remain inside the requested band.
- The new tactics model fingerprint is active.

The full core suite remains 355 assertions.
