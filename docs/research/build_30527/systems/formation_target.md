# Formation Target / Role Attribute Priority Research

## Current objective

Identify a long-term **Target Formation** and the player profiles that should be recruited/trained for each slot using only evidence-backed Top Eleven mechanics.

## Current formation evidence

- Current build distinguishes natural, related and wrong positions.
- Controlled Lineup Balance tests prove exact position suitability matters and is deterministic for fixed inputs.
- Shipped game guidance states stronger Lineup Balance improves ball-winning chance and therefore possession.
- Current role -> white/key attribute membership is known exactly.
- A controlled natural-ST substitution improved Balance even though the replacement had lower OVR and a slightly lower equal-weight mean across all ST white attributes.

## Role-priority hypothesis

The ST comparison suggests that white/key attributes may not all contribute equally. François Roelandt's strongest advantage over Gosling Lataille was in Shooting and Finishing, while Lataille remained slightly ahead on the equal-weight nine-skill ST mean.

This supports investigation of a **primary / secondary / supporting** white-skill hierarchy per role.

It does **not** yet prove:

- Shooting/Finishing exact weights;
- a universal top-2/top-4 count;
- any numeric target such as 250/180;
- that Playstyle had no effect on the Balance comparison.

## Target Formation design implication

Future recruitment should aim for:

1. the correct natural role for the Target Formation slot;
2. a strong role-specific primary attribute profile once proven;
3. healthy secondary/supporting white skills rather than deliberately neglecting them;
4. compatible Playstyle / Special Ability / tactics once their effect evidence is sufficient.

The app should eventually distinguish **Best Formation Now** from **Target Formation**, so the user can buy/train toward a stable long-term shape.

## Immediate research question

Does build 30527 contain a recoverable per-role hierarchy or weighting among the already-known key/white attributes?

See `../V054_ROLE_PRIORITY_CHECKPOINT.md` for the controlled ST evidence and research boundary.


## v0.5.5 current ST Balance re-test — interpretation correction

Current screenshots show Gosling Lataille at OVR 157 / Stellar (+50 to all key attributes) and François Roelandt at OVR 103 / Rare (+10). Lataille is now stronger across every ST key attribute except Finishing, which is tied at 201. The user reports that swapping either player into the same striker slot leaves the displayed Lineup Balance at **9.9**.

Therefore the historical Roelandt Balance improvement must not be treated as proof that Shooting/Finishing receive extra Lineup Balance weight. A more compatible explanation with the game's wording is that Balance measures whole-XI capability matching and/or lineup compatibility.

The current test is UI-rounded, unlike the historical exact server float, so a hidden sub-decimal difference remains possible.

**Formation rule:** use Lineup Balance as formation/compatibility evidence, not as a standalone role-skill weighting oracle. Seek role/action attribute priorities independently. See `../V055_CURRENT_ST_BALANCE_RETEST.md`.

## Tier-normalised player-profile note

Current UI evidence proves that Tier adds a fixed permanent value to every player-wide key attribute and that the resulting OVR increase depends on key-attribute count. For outfield players the underlying Tier OVR contribution is `tier bonus × key-count / 15`.

This creates two useful views for future recruitment/training research:

- **match-facing profile:** current displayed/post-Tier attributes;
- **training/base-profile research view:** reconstruct pre-Tier values by subtracting the Tier bonus from each player-wide key attribute.

Do not remove Tier from actual player selection unless later match-engine evidence says Tier is excluded. See `tier_ovr.md`.

