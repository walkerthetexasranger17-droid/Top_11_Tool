# v0.5.15 Calibration Checkpoint — Playstyle/SA Affinity De-duplication

**Date:** 2026-09-15  
**Status:** working calibration checkpoint; **not release-frozen**.

## Question audited

The strategy contract contains all 19 offered Playstyle tactic affinities and 12 Special Ability affinity rows, while the older runtime scored only explicit `tactics.rules`.

The audit proved two separate facts:

1. **The affinity tables are intended active companion logic.** Without them, most current Playstyles have no route into the declared 14-point Playstyle/SA compatibility component despite having explicit tactic-affinity data in the authoritative contract.
2. **The first activation pass double-counted a small set of relationships already represented by pure identity-only explicit rules.** Those exact overlaps must not stack twice.

## Assigned-role eligibility

A Playstyle contributes to Tactics only when:

- the Playstyle is active; and
- the player's **current assigned role** is one of that Playstyle's eligible roles.

A player may still be legally fielded in a Related role. The assignment is not penalised or made illegal; only the Playstyle contribution is inactive for that assignment.

Permanent regression includes the exact edge case: a **Wing Back** legally fielded as Related at **DC** has zero Wing Back Tactics contribution.

## Exact identity-only overlaps removed

The generic affinity is suppressed only when a positive explicit tactic rule for the same identity + dimension + option is itself purely identity-presence logic.

| Identity | Choice | Existing explicit rule | Runtime policy |
|---|---|---|---|
| Winger | Cross = Medium | `T-CROSS-WINGER` | keep explicit rule; suppress duplicate generic affinity |
| Sweeper Keeper | Back Line = Offside | `T-OFFSIDE-SWEEPER` | keep explicit rule; suppress duplicate generic affinity |
| Ball Winner / Stopper | Tackling = Aggressive | `T-TACKLE-AGG-DISRUPT` | keep explicit OR rule; suppress duplicate generic affinities |
| Shadow Striker | Shooting = Shoot on Sight | `T-SHOOT-SIGHT-SA` | keep explicit rule; suppress duplicate generic affinity |

Contextual overlays remain additive because they contain additional football evidence rather than merely repeating identity presence. Examples retained:

- Target Man + High Crosses + credible aerial outlet;
- Winger + High Crosses + credible aerial outlet;
- Cross Expert + High Crosses + an actual wide progression lane.

## Shadow Striker identity

**Shadow Striker remains current and locked.** Raw/internal `Long Shots` / `LongShots` canonicalises to the displayed **Shadow Striker** ability and activates the same explicit Shoot-on-Sight rule.

## Exact semantic range after de-duplication

A mixed-integer optimisation was run across:

- the exact build-30527 hard-legal role-count constraints used by Formation fallback;
- current Playstyle role eligibility;
- one active Playstyle identity per player, with identity-presence scoring not multiplied by duplicates;
- all semantic tactic option domains;
- all currently active SA affinities;
- the explicit Playstyle/SA rules, including their contextual requirements.

The solver returned an **optimal maximum raw Playstyle/SA semantic score of 74**.

A separate runtime witness reproduces raw **74** exactly with a legal XI and selected tactic values. The permanent Tactics regression now locks that witness.

Therefore the 14-point semantic component is calibrated as:

```text
raw 0  -> 0/14
raw 37 -> 7/14
raw 74 -> 14/14
```

The previous +80 cap was a pre-de-dup calibration and is superseded.

## Runtime generations

- Strategy: `companion-strategy-v2-own-squad-runtime-v0515-calibration-4`
- Tactics: `30527-drain-fit-v5-calibrated-v0515-affinity-dedup`
- Team Plan schema remains v6 and fingerprints both models, so stale cached plans are rejected.

## Drain boundary unchanged

Mixed live Medium/High condition-drain weighting remains unresolved. No numeric exchange rate was introduced or inferred in this pass.
