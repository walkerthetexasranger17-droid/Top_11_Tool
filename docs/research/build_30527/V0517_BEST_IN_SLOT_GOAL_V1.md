# v0.5.17 Best-in-Slot Goal v1 — transparent companion model

**Status:** UNPUBLISHED development / companion logic.  
**Game reference:** build 30527.  
**Opponent information:** permanently out of scope.

## Purpose

The existing Match Ready Formation answers **what is the best complete plan from the players currently owned?** Best-in-Slot is a separate long-term planning layer answering **what ideal XI should the manager recruit/train toward under the current Top Eleven Tool model?** It never replaces, feeds, or modifies Match Ready selection.

## Evidence-safe boundary

Best-in-Slot is **not** a recovered hidden Nordeus best-team formula. It composes already-existing Top Eleven Tool contracts:

- the 12 curated current Formation families and the frozen v0.5.15 own-squad structural score;
- current Role+Playstyle target-shape profiles (S/A/B/C ratios 1.18/1.05/0.92/0.85);
- current Playstyle role eligibility;
- v0.5.17 working current Special Ability role-eligibility contract;
- current Tactics compatibility and drain classes;
- current automatic Set Piece specialist readiness;
- current Mentor synergy model, compared under the explicit long-term assumption that every Mentor is unlocked at Level 10.

Unknown private magnitudes remain unknown. Abilities with no proven comparative tactic/set-piece effect are **not** ranked below each other. The UI says `No proven SA preference` and exposes eligible choices instead.

## Quality normalisation

Every generated ideal slot is normalised to **100 assigned-role white-skill mean**. The generator uses only the relative Role+Playstyle target shape. This prevents one Formation from winning because the tool invented a stronger absolute player.

## Deterministic bounded search

`tools/generate_best_in_slot_v1.js` performs a build-time bounded deterministic companion search:

1. enumerate the 12 curated Formation families and legal alternatives for `A|B` role slots;
2. build equal-quality ideal players from Role+Playstyle target shapes;
3. explore two meaningful semantic seeds already supported strongly by the current model: direct/transition and technical/buildup;
4. score the broad pool under the current balanced/Medium baseline for tractable build-time search;
5. take the top five candidates and run the full `Tactics.recommendAuto()` finalisation;
6. add eligible dedicated penalty/free-kick/corner specialists only where a second SA slot is available;
7. build automatic Set Pieces;
8. compare Mentors only at the final stage with all Mentors hypothetically unlocked at Level 10;
9. serialise the winner plus finalists into `data/build_30527/index/best_in_slot_v1.json` and `js/best-in-slot-data.js`.

This is deliberately described as **bounded** rather than a proof of the mathematically global optimum over every conceivable identity/tactic combination.

## Current v1 result

The current generated long-term goal is:

- **Formation:** 4-1-1-3-1 (`41131`)
- **Roles:** GK / DL DC DC DR / DMC / MC / AML AMC AMR / ST
- **Formation strategic score:** 99.5 under equal-quality ideal players
- **Auto tactics:** Long passing; Shoot on Sight; Left Flank focus; High crossing; Regroup; Focus on Buildup; Zonal marking; Low pressing; Track Back; Balanced tackling; Normal mentality
- **Drain class:** Low
- **Full-unlock Mentor comparison:** Lewis Green — The Wing Commander
- **Set Piece readiness:** dedicated penalty + free-kick + corner specialist coverage

Slot targets:

| Role | Playstyle target | Current model SA target |
|---|---|---|
| GK | Box Commander | No proven comparative SA preference |
| DL | Wing Back | Cross Expert |
| DC | No-Nonsense DC | No proven comparative SA preference |
| DC | No-Nonsense DC | No proven comparative SA preference |
| DR | Wing Back | Cross Expert |
| DMC | Anchor Man | Playmaker |
| MC | Regista | Playmaker + Corner Specialist |
| AML | Winger | Cross Expert |
| AMC | Enganche | Shadow Striker + Free Kick Specialist |
| AMR | Winger | Cross Expert |
| ST | Target Man | Penalty Kick Specialist; no proven open-play SA preference |

The ST penalty specialist is a Set Piece coverage target, not a claim that Penalty Kick Specialist is the best open-play ST ability.

## Runtime/UI separation

- `js/best-in-slot-data.js` is generated build-time model data.
- `js/best-in-slot-engine.js` validates every fingerprint, Formation slot, Playstyle role, SA role and coordinate before exposing it.
- `renderBestInSlotGoal()` consumes only the static/model goal. It does **not** read the user's current players or current Team Plan.
- The Best-in-Slot section appears directly below the current Formation area and above Squad Blueprint.
- Match Ready Formation/Tactics/Mentor logic is unchanged.

## Regression gates

- `tests/best_in_slot_contract.js` — model/data legality and semantic integrity.
- `tests/best_in_slot_ui_contract.py` — UI placement, script/PWA wiring, unresolved-SA honesty and independence from current squad.

Do not change the v1 target by intuition. Re-run the generator only after changing an upstream proven/current contract or intentionally revising the transparent companion objective.
