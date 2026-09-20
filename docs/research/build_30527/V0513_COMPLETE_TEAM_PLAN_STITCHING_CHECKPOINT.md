# v0.5.13 — Complete Team Plan Stitching Checkpoint

**Date:** 2026-09-15  
**Authority:** implementation checkpoint layered on v0.5.12 own-squad evaluator + v0.5.11 deep decision contract.

## Why this checkpoint exists

v0.5.12 made Formation, Tactics and Mentor selection coherent but still left two important systems partly detached: Set Pieces/Captain and Individual Training. It also prioritised Role+Playstyle white skills without deliberately shaping signature attributes above lower-value whites. v0.5.13 closes those gaps.

## Permanent runtime boundary

Only own-squad/player data, saved Mentor state, Approach and Drain Limit are valid inputs. No opponent/scouting/relative-strength/live-match state is accepted or inferred. Unknown external conditions score zero.

## One stitched candidate pipeline

For every legal Formation/XI candidate the runtime now calculates:

1. Formation quality/structure;
2. requested or Auto Tactics under the exact drain constraint;
3. complete Set Piece package including Captain;
4. best eligible Mentor and viable-band adjustment;
5. per-player development role + Role/Playstyle target-shape context.

The winning plan is selected only after those components exist. Fixed Defending/Balanced/Attacking approaches now re-evaluate every Formation, just like Auto; they no longer choose Formation first and tactics second.

## Set Pieces and Captain

The current client proves assignment slots and specialist identities but not an official auto-ranking formula, so ranking remains transparent COMPANION LOGIC.

- Penalties: Penalty Kick Specialist -> Finishing/Shooting mean -> Creativity -> stable key.
- Free kicks: Free Kick Specialist -> Shooting/Finishing/Passing/Creativity -> stable key.
- Corners: Corner Specialist -> Set Piece Taker -> Crossing/Passing/Creativity -> stable key.
- Captain: assigned-role mean -> assigned-role floor -> OVR -> stable key.

Captain deliberately uses no age, fake leadership/personality or hidden coefficient. It completes the plan while clearly remaining a companion heuristic.

Left/right free-kick/corner slots are independently stored, but preferred foot is not captured, so the same best player may legitimately top both. Do not invent a foot preference.

Set-piece readiness is a **late deterministic tie-break only**. It cannot rescue a materially worse Formation/Tactics core plan. Manual overrides persist until explicit refresh or the player leaves the XI.

## Joint scoring

- Core = 50% Formation + 50% Tactics.
- Mentor adjustment = 0..10 only for candidates within 10 points of the best core plan.
- Set Pieces = non-additive tie-break.
- Team Plan schema = v4.
- Set Piece state = v5.

## Role+Playstyle target-shape Training

The existing 12 base-role and 28 offered Role+Playstyle profiles remain the hierarchy source, but S/A/B/C now define desired relative attribute shape:

- S 1.18
- A 1.05
- B 0.92
- C 0.85
- secondary-role-only white 0.82

These ratios are **COMPANION LOGIC**, not official Nordeus skill caps. There is no invented absolute target such as 180 or 200.

Algorithm:

1. current skill / desired ratio -> normalised skill level;
2. mean the best three normalised development-role white skills -> shape reference;
3. target(skill) = shape reference × desired ratio;
4. gap = max(0, target-current);
5. under-target skill need = (gap+1) × hierarchy/context weight;
6. zero-gap skill receives only the small maintenance floor × weight;
7. beam search chooses six legal drills by useful target-gap reduction.

This intentionally creates specialists. A flat Poacher receives strong catch-up pressure on Shooting/Finishing/Positioning/Speed while lower-value whites can remain lower. Once a signature skill reaches the desired shape its catch-up pressure collapses and Training moves to the next meaningful gap.

Tactic context remains capped at +20% and approved active SA training context at +8%, so the long-term Role+Playstyle identity remains dominant.

## Team Plan -> Training connection

Individual Training now receives the winning Team Plan tactics and the player's assigned role. If the assigned role is one of the player's natural roles, that becomes the development role. If it is related-only, Training safely falls back to a natural role, records `assigned-role-not-natural`, and tells the user rather than pretending the related role is a natural white-skill profile.

## Validation boundary

Pre-release logic hardening is at 331 core assertions after adding target-shape maintenance-floor and related-role fallback regressions. Full scanner/cloud/navigation/package suites must be rerun on the final frozen ZIP before release is declared complete.

## Next target

Controlled whole-system fixture calibration. Do not add opponent inputs or another architecture layer. Build deliberately different own squads and inspect the full Formation -> Tactics -> Set Pieces/Captain -> Mentor -> Training output; tune only transparent companion rules when a concrete recommendation is wrong.
