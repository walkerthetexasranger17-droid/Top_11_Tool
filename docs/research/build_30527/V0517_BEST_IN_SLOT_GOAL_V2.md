# v0.5.17 Best-in-Slot Goal v2 — role / identity package model

**Status:** UNPUBLISHED development companion logic.  
**Game reference:** build 30527.  
**Opponent information:** permanently out of scope.

## Purpose

Best-in-Slot is separate from Match Ready. Match Ready asks what the manager can field now from the owned squad. Best-in-Slot asks what complete ideal XI the manager should build toward.

The v2 objective intentionally uses **no player attributes, OVR or invented player strength**.

## Model

For every curated formation candidate and legal flexible-role variant:

1. every slot is treated as an ideal **natural-role** player;
2. score the formation's own structural/coverage rules;
3. search current selectable tactics under the Medium sustainability target;
4. choose the best role-eligible Playstyle for each slot for that tactic package;
5. choose a role-eligible tactic-compatible Special Ability where the current contract has evidence to compare it;
6. add dedicated Corner / Free Kick / Penalty specialists where a second SA slot is available;
7. compare the seven Mentors as hypothetically unlocked at Level 10;
8. compare the complete package by Formation structure + Tactic compatibility + Mentor adjustment, with Set Piece coverage and lower drain used as late tie-break evidence.

## Official Squad Balance boundary

Top Eleven's official Squad Balance is real and formation-position sensitive, but its exact calculation is server-owned. The client sends the selected players and exact formation positions to the server and receives `SquadBalanceValue` / `SquadBalanceState` back.

Best-in-Slot therefore **does not fabricate an offline Squad Balance number**. It uses the app's transparent formation structure / role-coverage model only.

## Tactic scoring without player attributes

The Best-in-Slot tactic layer deliberately excludes the current Match Ready `nativeLineupFitScore`, because that component depends on real player skill values.

The long-term package uses only:

- own formation/role structure;
- internal tactic coherence;
- active, assigned-role-eligible Playstyle and SA compatibility;
- the existing drain-efficiency component.

Skill-derived capacity features are held neutral. Identity-derived features such as Target Man aerial outlet, Poacher/Inside Forward transition outlet and advanced dribble-style reliance may still be used because they come from the chosen Playstyle package rather than invented attribute values.

## Special Ability honesty

Only abilities valid for the slot's natural role may be chosen. A primary open-play SA is selected only when the current tactic-affinity contract has evidence to compare it.

If no current comparative open-play rule exists, the slot remains `No proven open-play SA preference` and the UI shows all role-valid alternatives. The app does not invent a winner among unresolved defensive/GK abilities.

Dedicated Set Piece specialists are separate coverage targets and may occupy a second SA slot.

## Current v2 result

Current generated winner:

- **Formation:** 4-2-3-1 (`4231`)
- **Roles:** GK / DL DC DC DR / DMC DMC / AML AMC AMR / ST
- **Tactics:** Short Passing; Shoot on Sight; Left Flank; High Crossing; Regroup; Focus on Buildup; Zonal; Low Pressing; Track Back; Balanced Tackling; Normal mentality
- **Drain class:** Medium
- **Full-unlock Mentor:** Lewis Green — The Wing Commander
- **Dedicated Set Pieces:** Corner Specialist + Free Kick Specialist + Penalty Kick Specialist all covered

Current ideal identity targets:

| Role | Playstyle | SA target |
|---|---|---|
| GK | Box Commander | No proven open-play preference |
| DL | Wing Back | Cross Expert + Corner Specialist |
| DC | No-Nonsense DC | No proven open-play preference |
| DC | Ball Playing DC | No proven open-play preference |
| DR | Full Back | Cross Expert |
| DMC | Anchor Man | Playmaker |
| DMC | Regista | Playmaker |
| AML | Winger | Shadow Striker |
| AMC | False Nine | Playmaker + Free Kick Specialist |
| AMR | Inside Forward | Cross Expert |
| ST | Target Man | Penalty Kick Specialist; no proven open-play preference |

The 4-1-1-3-1 package is currently extremely close behind. The model must not describe 4-2-3-1 as a hidden Nordeus universal best formation; it is the winner of this transparent current companion objective.

## Files

- `tools/generate_best_in_slot_v1.js` — deterministic v2 package generator (legacy filename retained to avoid unnecessary package churn)
- `data/build_30527/index/best_in_slot_v1.json` — generated data (legacy filename retained)
- `js/best-in-slot-data.js` — browser bundle
- `js/best-in-slot-engine.js` — legality/fingerprint validation
- `tests/best_in_slot_contract.js`
- `tests/best_in_slot_ui_contract.py`

The old `V0517_BEST_IN_SLOT_GOAL_V1.md` remains historical evidence only.
