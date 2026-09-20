# Target Formation — Build 30527

## Evidence boundary

Top Eleven does not expose an official universal “best formation” score. The app therefore separates:

- **GAME FACT:** legality, advisory structure, roles, white/key skills, Playstyle eligibility, tactic semantics;
- **CALCULATION:** exhaustive formation-space checks derived from those rules;
- **COMPANION TARGET LOGIC:** which stable long-term shape we recommend recruiting toward.

See `../source_archive/native/NATIVE_FORMATION_VALIDATOR_PASS.md` and `data/build_30527/index/target_formation_comparison.json`.

## Current native structural rules

Current build 30527 hard legality requires exactly one GK, at least three DL/DC/DR defenders, at least two midfielders, central-midfield coverage (`DMC/MC/AMC`), attacking-area coverage (`AML/AMC/AMR/ST`), central-defending coverage (`DC/DMC`), balanced flanks and the current role crowding caps.

The current irregular/performance layer separately wants:

- `ST or AMC` attacking presence;
- left flank `DL/ML/AML`;
- right flank `DR/MR/AMR`;
- a true `DC`;
- `DMC or MC` defensive-midfield presence;
- `MC or AMC` offensive-midfield presence.

## Formation-space calculation

For ten outfield slots there are:

- **2,843** hard-legal role-count configurations;
- **1,893** also free of every current irregular warning;
- **249** warning-free and exactly left/right symmetric;
- **12** that additionally satisfy the Top Eleven Tool one-slot advisory-robustness check (each advisory group starts with >=2 occupants).

The last filter is transparent COMPANION LOGIC, not a Nordeus rule.

## Leading long-term target — COMPANION LOGIC

### `4-1-1-3-1 DMC+MC`

```text
GK
DL  DC  DC  DR
      DMC
       MC
AML   AMC   AMR
       ST
```

Equivalent family description: **4-2-3-1 with one DMC pivot and one MC pivot**.

Why it currently leads:

1. **Native structure:** fully hard-legal and warning-free.
2. **Structural redundancy:** every current irregular-warning group has two or more occupants, so the companion one-slot robustness test passes.
3. **Flank + centre coverage:** left has DL+AML, right has DR+AMR, while DMC+MC+AMC+ST provides a full central spine.
4. **Playstyle breadth:** the role set can host **18 of the 19 active build-30527 Playstyles**. The only active Playstyle not represented is False Winger (ML/MR only).
5. **Complementary pivot roles:** DMC and MC share Passing, Tackling, Marking, Positioning, Bravery, Fitness and Creativity as key attributes. DMC uniquely adds Heading/Strength/Aggression; MC uniquely adds Dribbling/Shooting/Speed. Together the pivot pair spans **13 of 15 outfield attribute types** as key attributes without requiring the two players to be clones.
6. **Tactic versatility:** current game semantics can be supported through centre or both flanks, with dedicated crossing roles, multiple finishing/shooting roles, a DMC defensive layer and an MC build/transition layer.

This is **not** a claim that Nordeus gives this formation a hidden bonus or that it wins every matchup.

## Closest alternatives

### 4-2-3-1 MC+MC

Also fully legal, warning-free, symmetric and one-slot advisory-resilient. Relative to DMC+MC, replacing the DMC with a second MC:

- adds one extra slot where Dribbling, Shooting and Speed are key;
- removes one slot where Heading, Strength and Aggression are key;
- preserves the seven shared DMC/MC key attributes.

It supports 16/19 active Playstyles because Ball Winner and Anchor Man require DMC and False Winger requires ML/MR. Treat this as the **more attack/mobile pivot variant**, not as universally stronger.

### 4-4-2

Also passes the robust structural filter. It supplies both flanks through ML/MR and has two STs, but its role set supports 15/19 active Playstyles and has fewer slots with Finishing/Shooting as key attributes than the DMC+MC target. It remains a valid direct/wide alternative rather than the default recruitment target.

### Current community 3-back candidates

Recent 2026 community discussion commonly mentions 3-1-4-1-1 and 3-1-2-1-3. Both can satisfy current hard legality and irregular warnings, but each has only one occupant on each flank in its usual shape and therefore fails the companion one-slot flank-robustness test. They also omit natural DL/DR slots and their Full Back/Wing Back Playstyle families. Community evidence is supporting only.

## Tactic-structure comparison

The app must **not** convert role/key-skill membership counts into match-engine percentages. They are structural coverage indicators only.

For the leading DMC+MC target, number of lineup slots for which selected tactic-relevant attributes are white/key:

- Passing 6, Creativity 6, Dribbling 5;
- Crossing 4;
- Shooting 5, Finishing 4;
- Heading 5, Strength 4;
- Speed 7;
- Tackling 6, Marking 6, Bravery 6, Aggression 5, Positioning 7;
- Fitness 10 outfield/GK role memberships in the current comparison model.

Using GAME FACT training-drill attribute groups only as named action clusters:

- Fast Counter-Attacks `{Creativity, Crossing, Passing, Finishing}` -> 20 role/attribute memberships;
- Wing Play `{Shooting, Crossing, Heading, Finishing}` -> 18;
- Passes Before Shot `{Creativity, Positioning, Passing, Finishing}` -> 23;
- Press the Play `{Aggression, Bravery, Marking, Tackling, Positioning}` -> 30;
- Shooting Technique `{Shooting, Strength, Finishing}` -> 13;
- First Touch Play `{Fitness, Dribbling, Passing}` -> 21;
- Rapid Side Switch `{Creativity, Speed, Crossing, Positioning, Passing}` -> 30.

These are **COMPANION structural comparisons** based on verified drill mappings; they are not recovered match weights.

## Recruitment target v1

If the user wants to build deliberately toward one stable target shape, current research supports recruiting/training natural specialists for:

`GK, DL, DC, DC, DR, DMC, MC, AML, AMC, AMR, ST`.

Role priority tables, Playstyle/Special Ability fit, Tier-normalised development views and actual player quality remain separate layers. The parked role-skill weighting research should later refine what an ideal signing looks like *inside* each slot.

## Remaining formation questions

- The private 0-10 Lineup Balance formula remains server-owned/unresolved.
- Opponent-specific formation counters are not recovered as a numerical game formula.
- No production system should claim the target formation is universally optimal; it is the current **Top Eleven Tool default long-term target** based on breadth, structural rules and adaptability.

## Exhaustive robust-frontier cross-check

The one-slot-advisory-resilient filter yields exactly **12** symmetric warning-free role-count shapes. We did not choose the leading target from only a familiar shortlist; all 12 were cross-checked for current Playstyle role coverage.

Two shapes reach the maximum **18/19 active Playstyles**:

1. **Advanced-wide target (current default)**
   - `GK / DL DC DC DR / DMC MC / AML AMC AMR / ST`
   - missing only `False Winger` (ML/MR only).
2. **Midfield-wide alternative**
   - `GK / DL DC DC DR / DMC ML MC MR / AMC ST`
   - missing only `Inside Forward` (AML/AMR only).

The advanced-wide target remains the default because, while both satisfy the same hard/advisory robustness layers, AML/AMR add current role-key membership in **Shooting + Finishing** relative to ML/MR, whereas ML/MR add **Positioning**. Therefore the advanced-wide target preserves more dedicated scoring roles while still retaining a DMC, MC and AMC central spine. This is a transparent COMPANION preference, not a hidden Nordeus formation bonus.

The complete 12-shape frontier is stored in `data/build_30527/index/formation_resilient_frontier.json`.
