# v0.5.15 Special Ability canonicalisation checkpoint

## Proven defect

The strategy contract already treated **Shadow Striker** as the current display identity and documented `LongShots` as its native/raw identifier. Runtime canonicalisation nevertheless only handled the spaced alias `Long Shots` on every path. A compact `LongShots` value could therefore miss Shadow Striker Tactics/Training semantics until another migration rewrote it.

## Fix

A shared Special Ability canonicalisation boundary now resolves `Shadow Striker`, `Long Shots`, `LongShots` and punctuation/spacing-equivalent compact forms to **Shadow Striker**. Player cleaning/storage, Strategy identity extraction and Scanner normalisation use that boundary.

A stitched Team Plan regression additionally proves raw `LongShots` reaches development/training as the Shadow Striker signal.

## Scope limits

This does **not** create a universal role→Special Ability eligibility matrix. Current-client evidence does not prove such a table and indicates player-specific availability. The seven current abilities without open-play tactic-affinity rows remain dead-ball-specific or unresolved; no open-play effects are invented.

The prior assigned-role Playstyle gate, affinity de-duplication and exact semantic calibration remain unchanged at **74 raw → 14 points**. Mixed Medium↔High live drain weighting remains unresolved and nonnumeric.
