# Top Eleven Tool — v0.6.54 Recovery Handoff

## Release state
- **UI/runtime:** v0.6.54
- **Decision baseline:** v0.5.19 Chance-Creation Resilience.
- **Scanner:** VERSION 12.

## Why this pass exists
A real match report supplied by the user exposed a failure mode in the own-XI tactic recommender: a materially stronger XI could be routed too narrowly through the centre, creating possession without enough attacking routes. The observed match ended 1–5 despite 61% possession; the user's side generated 9 shots / 7 on target while the opponent generated 15 / 11, and the match report showed 0 chances from crosses for the user's side.

The match is calibration evidence, **not proof of a hidden Nordeus formula**. No opponent data has been added to the app and the engine still never accepts or infers opponent formation, strength or tactics.

## v0.5.19 decision correction
`tactics-engine.js` now contains an explicit `chanceCreationResilience()` companion guardrail. It uses only the selected XI and existing lane-support calculations.

When the XI has credible progression on both flanks:
- central-only focus receives a material coherence penalty;
- central + low crossing receives an additional narrowing penalty;
- balanced focus receives a coherence reward because it preserves all credible routes;
- both-flanks focus receives a smaller reward;
- coherent wide focus + medium/high crossing receives a small secondary-route reward.

This is deliberately bounded inside the existing Internal Coherence component. Formation legality, player attributes, Playstyle/SA affinity, drain-band intent and all other v0.5.18 scoring remain active. It does **not** guarantee a win and it does not claim that wide play is universally superior. If the XI genuinely lacks credible width, the guardrail does not fire.

## Non-negotiable project constraint retained
Opponent information remains permanently out of scope. Match reports may be used after the fact as calibration evidence, but the production recommender must work from the user's own squad/XI, player data, Mentor state, Approach and Drain Limit only.

## Validation
- Existing `tactics_probe.js` passes.
- Existing `tactic_option_reachability.js` passes.
- Existing `all_in_one_system_calibration.js` passes.
- New v0.5.19 regression test verifies that a two-sided XI penalises central-only/low-cross chance routing and rewards route-preserving alternatives.
- Full package ZIP is extracted and checked before release.
