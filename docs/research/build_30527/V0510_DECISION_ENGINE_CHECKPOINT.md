# v0.5.10 — Joint decision-engine foundation

v0.5.10 converts the closed game/native research plus the 2024–26 community evidence layer into transparent production **COMPANION LOGIC**. It does not claim hidden Nordeus effectiveness weights.

## Implemented

- `js/strategy-logic.js`
  - all current roles receive a white-skill priority hierarchy;
  - all currently offered Playstyles receive a modifier hierarchy;
  - tactic context can make small, explicit training-priority adjustments;
  - opponent/own-shape structural analysis is centralised;
  - formation and tactics context rules are auditable.
- `js/squad-coverage-engine.js`
  - separates **best current XI** from **future squad coverage**;
  - reports natural-role deficits and useful multi-role recruitment profiles.
- `js/formation.js`
  - retains proven role legality/global assignment;
  - adds strategic formation ranking using XI quality + structural matchup.
- `js/tactics-engine.js`
  - retains exact recovered drain arithmetic;
  - adds transparent structural/community context scoring;
  - adds `recommendAuto()` to compare all five mentality approaches.
- `js/mentor-engine.js`
  - Tactical / Attribute / Signature families are strictly gated at Levels 1 / 5 / 10;
  - locked families contribute exactly zero;
  - Signature relevance is now contextual rather than a boolean tie-break;
  - next unlock is surfaced.
- `js/training-engine.js`
  - individual training now uses role → Playstyle → tactic context → deficiency → drill efficiency;
  - grey skills remain zero utility;
  - exact gain remains unresolved and is not predicted.
- `js/team-plan-engine.js`
  - adds `buildOptimalPlan()` to evaluate Formation + Auto Tactics + currently useful Mentor as one package;
  - attaches squad coverage/recruitment guidance.

## Transparent scoring contract

The canonical machine-readable contract is `data/build_30527/index/decision_logic_v1.json`.

Joint plan score:

`45% Formation + 40% Tactics + 15% Mentor`

These percentages are **Top Eleven Tool weights**, chosen to make the system deterministic and explainable. They are not recovered match-engine coefficients.

## Important boundaries

- A theoretically perfect formation is not forced when the current squad cannot fill it naturally.
- A Mentor receives no value from a locked boost family.
- Community evidence can break/rank otherwise unresolved choices but never becomes `GAME FACT`.
- Training only values attributes that are white for the player's real natural-role union.
- The optimiser still needs opponent structure/context to make a true matchup recommendation; without it, it returns the strongest resilient plan from the user's current squad.
