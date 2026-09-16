# v0.5.17 DEV PASS7 — Best-in-Slot Current-Squad Gap/Coverage

**Evidence class:** COMPANION LOGIC  
**State:** UNPUBLISHED development checkpoint  
**Best-in-Slot goal model:** `best-in-slot-goal-v2-role-identity-only`  
**Gap model:** `best-in-slot-squad-gap-v2-actionable-identity`

## Purpose

The static Best-in-Slot XI says what ideal role/Playstyle/Special Ability package the manager should build toward. DEV PASS6 adds the missing practical question:

> Which of my existing players already cover those goal slots, which are identity-development gaps, and which natural-role positions still need recruiting?

This comparison is deliberately separate from Match Ready selection and deliberately ignores individual player strength.

## Inputs used

Only:

- current player's **natural roles**;
- current active Playstyle identity and level;
- current Special Ability identities;
- the frozen Best-in-Slot target slot role / Playstyle / target SAs.

The gap model **does not read OVR, skills, roleMean, roleFloor, age, condition, morale or availability**.

Related roles do not count as long-term natural-role coverage. This is intentional because the Best-in-Slot XI is a recruitment/development target, not an emergency Match Ready lineup.

## Global assignment

A current player may satisfy at most one Best-in-Slot slot. The engine performs one global bipartite assignment across all 11 target slots so a versatile player cannot be double-counted as several simultaneous positions.

Assignment preference is lexicographic companion logic:

1. natural role is mandatory;
2. among natural candidates, exact **active** target Playstyle is preferred;
3. then higher current Playstyle level;
4. then more target SAs already present;
5. deterministic roster/order tie behaviour only after the above.

These weights are assignment/tie-break mechanics only. They are **not Top Eleven match-performance coefficients** and are never displayed as a gameplay score.

## Slot states

- `master-ready` — natural role + exact active target Playstyle at Master + all target SAs present.
- `playstyle-upgrade` — target Playstyle identity and target SAs are already correct, but Playstyle has not reached Master.
- `sa-development` — exact active target Playstyle is present and the missing target SA(s) fit within the player's remaining two-SA capacity.
- `playstyle-development` — the target Playstyle still needs to be built/unlocked and there is no conflicting different current Playstyle identity.
- `playstyle-identity-gap` — a different current Playstyle identity occupies the natural-role player. The tool does not pretend this is an ordinary level upgrade.
- `sa-capacity-gap` — target SA(s) are missing but the player's two SA slots are already full. The tool does not tell the user to train an impossible third SA.
- `missing-natural-role` — no unused current player naturally covers that goal slot.

The summary groups the middle three feasible states as **trainable gaps**, the two identity/capacity conflicts as **identity gaps**, and keeps missing natural roles as **recruit gaps**.

A Best-in-Slot slot with no proven preferred SA has no fabricated SA requirement.

## Product boundary

- Best-in-Slot goal generation remains independent of the user's current Match Ready Team Plan.
- Current squad data only annotates the static goal with coverage/gap information.
- Match Ready Formation/Tactics/Mentor/Set Piece/Training scores are not changed.
- Official Top Eleven Squad Balance remains server-owned and is not reproduced or relabelled as this coverage analysis.
- Opponent information is not used.
