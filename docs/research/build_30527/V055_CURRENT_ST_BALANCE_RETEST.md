# v0.5.5 Research Checkpoint — Current ST Balance Re-test

**Date:** 14 September 2026  
**Purpose:** correct the interpretation of the earlier Roelandt/Lataille Lineup Balance experiment using the user's most recent in-game player state.

## New current observation

The user supplied current screenshots for both natural STs and reported that swapping either striker into the same on-field slot now leaves the displayed Lineup Balance at **9.9**.

### Current visible player profiles

| Player | OVR | Tier | Tier text | Passing | Dribbling | Shooting | Finishing | Positioning | Heading | Strength | Speed | Creativity | Equal-weight ST key mean |
|---|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Gosling Lataille | 157 | Stellar | +50 permanent increase on all key attributes | 183 | 183 | 190 | 201 | 201 | 195 | 184 | 187 | 173 | 188.56 |
| François Roelandt | 103 | Rare | +10 permanent increase on all key attributes | 163 | 159 | 183 | 201 | 93 | 109 | 111 | 158 | 93 | 141.11 |

Lataille is now stronger in every listed ST key attribute except Finishing, where both are 201. Lataille is also stronger in the two previously-hypothesised ST primary skills considered together (Shooting + Finishing).

Evidence images are stored under:

`docs/research/build_30527/evidence/current_striker_balance_2026-09-14/`

## Correction to v0.5.4 interpretation

The historical controlled server test remains a valid LIVE FACT for that earlier player/team state: lower-OVR Roelandt increased the exact server Balance from ~9.8298 to 10.0 compared with Lataille.

However, that result **must no longer be used as evidence that Shooting/Finishing are weighted more heavily by Lineup Balance**.

The current re-test weakens that interpretation because the modern Lataille profile is much stronger across the entire ST white-skill set, including Shooting/Finishing, while the displayed Lineup Balance is unchanged at 9.9 when the two STs are swapped.

## Important measurement boundary

The old experiment used an exact server Balance value with many decimal places. The current observation is the in-game **displayed 9.9 value**, which is rounded/coarser. Therefore:

- CURRENT LIVE/UI FACT: both striker choices display 9.9 Balance in the user's current lineup.
- NOT PROVEN: that the underlying server floating-point Balance is byte-for-byte identical for both choices.

A future capture of `GetSquadBalance` could resolve whether a small hidden difference remains below the UI's display precision.

## Better current explanation for the historical result

The game's own Lineup Balance wording refers to how well matched the lineup's/player capabilities are. Therefore the historical Roelandt improvement may have reflected **whole-XI capability matching / squad profile compatibility**, rather than a direct ST-role attribute weighting.

This is now the preferred interpretation boundary:

- Lineup Balance is useful evidence about formation placement and whole-lineup compatibility.
- Lineup Balance should **not** be used by itself to infer which ST attributes are primary.
- Per-role primary/secondary attribute research must be pursued independently through native/game data, action consumers, or better-isolated controlled tests.

## Role-priority hypothesis status

The broader hypothesis remains **UNRESOLVED**, not rejected:

> Some white/key skills may still matter more than others for actual match actions and role effectiveness.

But the Roelandt/Lataille Balance experiment is no longer sufficient supporting evidence for that hierarchy.

## Next research target

Search build 30527 for role/action attribute consumers that can reveal actual skill priority independently of Lineup Balance, for example:

- shot / finishing resolution inputs;
- passing / creativity inputs;
- crossing / heading interactions;
- tackling / marking / positioning / bravery consumers;
- goalkeeper action attribute consumers;
- Football Engine role/action scoring or event-trigger attribute sets;
- any weighted attribute vector, coefficient table, selector or ranking method.

If static data does not expose weights, controlled tests should isolate one or two attributes at a time where practical. Do not infer a universal weighting from Lineup Balance alone.
