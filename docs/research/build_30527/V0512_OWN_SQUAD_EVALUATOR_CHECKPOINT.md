# v0.5.12 — Own-Squad Evaluator Checkpoint

**Date:** 2026-09-15  
**Authority:** implementation checkpoint layered on `V0511_DECISION_LOGIC_BIBLE.md`

## Why this checkpoint exists

v0.5.11 deliberately stopped at a complete v2 decision-data contract. v0.5.12 wires that architecture into the production Formation, Tactics, Mentor and Team Plan engines and records a permanent architecture correction made before the wiring pass was completed:

> No other-team information will ever be an input to this app.

This is stronger than hiding a scouting UI. External-team fields are removed from the active rule contract, runtime APIs and saved Team Plan schema.

## Recovery authority

Read in this order:

1. this file;
2. `V0511_DECISION_LOGIC_BIBLE.md` for the research/deep-rule foundation;
3. `data/build_30527/index/decision_logic_v2.json` for the current active contract;
4. `data/build_30527/index/strategy_strings_v2.json` for active explanations;
5. `js/strategy-logic.js`, `formation.js`, `tactics-engine.js`, `mentor-engine.js`, `team-plan-engine.js` for runtime wiring.

Where v0.5.11 describes an external-team/relative-strength path, v0.5.12 supersedes that path. Historical research evidence is retained; it is not a runtime input.

## Active input boundary

Allowed decision inputs:

- own saved squad;
- current skills;
- natural/related roles already present in player data;
- active Playstyle and level/state;
- Special Abilities;
- candidate XI assignment;
- saved Mentor unlocked/level state;
- Approach;
- Drain Limit.

Not accepted:

- another formation or XI;
- another team's strength;
- relative strength;
- another team's tactics/passing/attack profile;
- scouting observations;
- live score/card/halftime state in the pre-match optimiser.

Unknown contextual Mentor effects are zero, not estimated.

## Generic evaluator

`strategy-logic.js` now provides a deterministic parser/evaluator for the v2 JSON conditions. It supports the operators used by the rule catalogue (`&&`, `||`, `!`, comparisons, `in`, arithmetic and `abs`) without `eval` or `new Function`.

Own-XI features are computed once per candidate XI and reused through exhaustive tactic search. Features include structural counts, XI quality median, strong-cluster outlets, technical build, pressing capacity, defensive-line speed, marker capacity, box finishing, long-shot threat, dribble reliance and own-plan defensive-action demand.

## Formation runtime

`formation.js` consumes the 12 JSON candidates directly. The old eight-shape duplicated list is removed as the source of truth. If none of those 12 can be fielded, automatic selection now generates and scores the recovered hard-legal natural-role fallback space instead of failing; all **2,843** hard-legal role-count shapes are reproducible and the fallback never silently uses wrong-position players.

Score = 35 lineup + 10 Playstyle-role + 15 weak link + 30 own structure + 10 flexibility. Exact score ties follow the full v2 order: weak link, lineup quality, Playstyle-role fit, natural-role flexibility, baseline/native-frontier stability, then stable candidate ID.

The structure component is neutral-centred and uses only own-team rules. No matchup or relative-strength modifier survives.

## Tactics runtime

Exact build-30527 drain remains untouched. Fixed mentality search remains 19,440 combinations; Auto still evaluates the full 97,200 grid across five mentalities.

The decision layer is now 32 / 26 / 18 / 14 / 10 for XI fit / own structure / coherence / Playstyle-SA / drain efficiency. Rule conditions are consumed from the JSON contract. Drain efficiency now uses the exact recovered theoretical minimum raw score **30** as the 10-point end of the scale; Low/Medium/High ceilings 40/65/100 map to zero. The contract tie order remains higher total score, fewer contradictions, lower drain, more neutral defaults, then stable option order.

## Mentor runtime

The level-gated engine now uses the v2 40/25/30 model and 0..10 plan adjustment. Attribute relevance is based on real white-skill use in the assigned XI and hierarchy/tactic context, not a crude count alone. Training-only Special Ability modifiers are explicitly excluded from Mentor attribute relevance.

Context that cannot be known under the app's input boundary receives zero. Do not create substitutes for those effects in a later chat.

## Squad Blueprint runtime

The full v2 coverage model is live: core XI 70%, flexibility 20%, availability/rotation depth 10%. Strong/weak/missing slots score 1.0/0.6/0 inside each importance-weighted layer. Core-assigned players cannot masquerade as support depth.

## Training context hardening

Training retains the role/Playstyle hierarchy as the primary signal. Stacked tactic context is capped at **+20%** and active Special Ability context at **+8%**, exactly as specified by the v2 contract.

## Joint plan runtime

Core plan = 50% Formation + 50% Tactics. Mentor adjustment is allowed only inside a 10-point band of the best core plan. Team Plan schema version is 3 so earlier context-bearing plans rebuild cleanly.

## Release hardening fixes

The final manual contract audit found and fixed seven issues before release freeze:

1. missing dynamic legal Formation fallback;
2. incomplete Squad Blueprint weighting/depth layer;
3. uncapped stacked Training tactic context;
4. wrong tactic drain-efficiency floor (10 instead of the recovered raw minimum 30);
5. incomplete Formation exact tie-break chain;
6. stale `loadMentorLevels()` startup call instead of `loadMentorState()`;
7. Training-only Special Ability modifiers leaking into Mentor attribute relevance.

## Validation snapshot

- core suite: 322 assertions PASS;
- strategy logic data contract PASS;
- static checks PASS;
- package integrity PASS;
- navigation/render PASS;
- exact drain checksum preserved: 963 / 77,823 / 18,414.

## Next development target

Do not reopen the removed external-team architecture. The next work is controlled own-squad fixture testing and logic calibration: inspect which Formation/Tactic/Mentor plans the engine chooses for deliberately different own squads, identify undesirable recommendations, and change only transparent companion rules with a documented reason/evidence trail.
