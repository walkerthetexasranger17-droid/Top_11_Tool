# Training — Build 30527

## Proven native/runtime boundary

The client contains a deterministic local attribute distributor, but normal `ExecuteTraining` returns final per-player `AttributeGain` from the server/runtime path. Therefore exact per-session normal-training gains remain server/runtime-owned unless captured. Do not present the local distributor as an exact normal-training predictor.

See `data/build_30527/index/native_methods.json` and source archive `NATIVE_FORMULAS_PASS5.md` / `PASS6.md`.

## White-skill rule

Only actual white skills receive Training utility; grey skills remain zero-utility. White does **not** mean all white skills should be equalised.

## v0.5.15 calibration — Role+Playstyle target-shape model

The app uses 12 base-role profiles plus all 28 offered Role+Playstyle combinations. S/A/B/C are relative development tiers and now also define a desired attribute shape:

- S = 1.18
- A = 1.05
- B = 0.92
- C = 0.85
- white only because of another natural role = 0.82

These are transparent **COMPANION LOGIC ratios**, not Nordeus caps or official target percentages.

For a player:
1. normalise each white skill by its desired ratio;
2. among the selected development-role whites, exclude S-tier signature skills from the reference anchor and take the **strongest normalised non-S white**; if a profile contains only S skills, fall back to the strongest normalised development white;
3. calculate the target and positive gap for every white skill from that fixed lower-tier anchor;
4. weight that gap by Role+Playstyle hierarchy and capped context;
5. choose six legal drills by useful gap reduction.

The non-S anchor is deliberate. A newly developed S-tier signature skill must not raise its own goalpost merely because it became the strongest skill on the player. Once it reaches the desired shape, it falls to the small maintenance floor. If supporting lower-tier whites are later improved, the signature target can rise again so the intended specialist tilt is preserved.

An under-target skill uses `(gap + 1) × hierarchy/context weight`; a zero-gap skill uses only the small maintenance floor. This preserves deliberate specialization. A Poacher is pushed toward higher Shooting/Finishing/Positioning/Speed instead of dragging Passing/Heading/Strength up to the same level.

No absolute 180/200/etc player-skill cap is invented.

## Team Plan context

Training receives the winning Team Plan tactics. Tactic context can add at most +20%; approved active Special Ability training context can add at most +8%. Role+Playstyle identity remains dominant.

The Team Plan assigned role becomes the development role only when it is natural for that player. If Formation uses a related-only role, Training falls back to a natural development role and reports the reason.

## Verified drill intensity / gain model

Recovered build-30527 data provides the normal drill base training-XP ladder directly:

- Very Easy = 1 XP/player; 0.75 condition
- Easy = 2 XP/player; 1.50 condition
- Medium = 3 XP/player; 2.25 condition
- Hard = 4 XP/player; 3.00 condition
- Very Hard = 5 XP/player; 3.75 condition

Normal drill-level effect is then applied to that base: Semi-Pro +10%, Pro +20%, World Class +30%. Master/Campus drills use their recovered catalogue training-effect percentage. The companion strength signal is therefore `base XP × (1 + training-effect %)`.

**Max Growth:** if two drills hit the same useful white skills and have the same effect percentage, the higher-intensity drill must rank higher because it carries more verified XP. Example: at World Class, Easy models 2.6 strength while Very Hard models 6.5.

**Condition Efficient:** condition rises in the same 1:2:3:4:5 proportion as base XP, so intensity alone is not treated as magically more condition-efficient. Coverage of the right target-gap whites and drill-level effect still matter.

**Boundary:** this XP ladder is proven input data; the exact final percentage-point normal `AttributeGain` remains server/runtime-owned. Do not convert XP into invented +attribute percentages.

## Calibration coverage

The target-shape invariants are regression-tested across all **12 base-role profiles** and all **28 offered Role+Playstyle profiles**. A flat player must show strictly greater catch-up pressure for each populated higher tier (S > A > B > C), an S skill placed at its calculated target must collapse to maintenance, and every six-drill Max Growth session must deliver positive S-tier credit. Drill repetition is allowed when it maximises useful target-gap reduction; cosmetic variety is not an optimisation objective.
