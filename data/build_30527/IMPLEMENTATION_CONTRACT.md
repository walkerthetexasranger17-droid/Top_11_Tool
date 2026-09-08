# Top Eleven Training Optimiser — Implementation Contract

## NON-NEGOTIABLE: do not invent game data

Use the supplied JSON/CSV tables as the source of truth for build 30527. If a value is absent, keep it unknown/null or ask for it. Do not create substitute attributes, drill strengths, levels, effects, card limits, role maps, or unlock rules.

## 1. Player white/key skills

Use `white_skill_map_30527.json`.

For a multi-position player, the white/key set is the UNION of the key attributes for every position. This is the game's client behavior recovered from `PlayerAttributesUtils.IsKeyAttribute`.

For an outfield player, attributes IDs 1–15 are the outfield/applicable pool. IDs 16–25 are goalkeeper-specific and must not be treated as useful outfield targets. Live controlled training confirmed goalkeeper-only attributes in mixed drills did not gain for the DC/DR test player.

For a goalkeeper, use the GK white map from the supplied file. Do not make an outfield skill white for a GK unless it appears in that map.

## 2. Normal drills

Use `normal_drills.json`.

Fixed fields:
- drill ID and name
- category/type
- affected attributes
- intensity
- XP per player
- condition drop

User-specific fields:
- unlocked
- current level

Regular drill levels are exactly:
- 1 = Semi-pro = +10% Training Effect
- 2 = Pro = +20% Training Effect
- 3 = World-class = +30% Training Effect

Do NOT ask the user to enter the Training Effect percentage separately. Derive it from the selected level.

`user_normal_drill_profile_snapshot_20260908.json` is a seed snapshot from the user's official-client runtime response at 2026-09-08T15:40:11.9397034+01:00. It must remain editable because drills level up later.

## 3. Master/Campus drills

Use `master_campus_drills.json`.

These are protocol `ConsumableTrainingDrill` records, separate from normal BasicTrainingDrill and separate from Team Play drills.

Current build/runtime catalogue contains exactly four:
- ATTACKING_MASTERCLASS
- DEFENDING_MASTERCLASS
- MIDFIELD_MASTERCLASS
- PHYSICAL_MASTERCLASS

All four captured records are Very Hard, 3.75% condition, +5 XP per player and +80% additional Training Effect.

The protocol's `UsagesLeft` is card stock. The client method `GetDecrementedDrillCountIfSelected(consumableDrill, drillSlots)` subtracts how many copies of that drill are already selected from its available count. Therefore:
- each Master card used in a slot consumes 1 quantity;
- duplicate Master drills are allowed while quantity remains;
- do NOT impose a made-up maximum of 4;
- session use of one Master drill is limited by `min(quantity, remaining slots)`.

The saved quantity is user-editable. `user_master_card_stock_snapshot_20260908.json` is only the captured seed snapshot.

## 4. Team Play drills

Do NOT mix Team Play drills into the individual-player attribute optimiser.

They are a distinct protocol type (`TeamPlayTrainingDrill`) and their records do not expose the normal per-drill `Attributes[]` field. Keep them outside this optimiser until a separate Team Play feature is deliberately implemented.

## 5. Six slots

A training session has six drill slots.

Normal drills may repeat without an artificial uniqueness rule.

Master drills may repeat only up to the saved quantity.

Locked normal drills must be excluded.

## 6. Optimiser objective

The product objective is:

> Give the selected player the greatest useful training impact, prioritising the lowest current WHITE/key attributes and choosing the strongest available drills that train those needs.

Condition drain is DISPLAYED, not the primary optimisation objective.

Do not select drills merely by "fewest grey skills". A stronger drill can be better despite one grey attribute if it directs more total effect into the player's priority white attributes.

### Companion scoring rule (explicit; not claimed to be Top Eleven's private server formula)

This is the calculation the app should implement unless we deliberately revise it later:

1. `whiteAttributes = union(key attributes for all player positions)`.
2. `target = max(current value among whiteAttributes)`.
3. For every white attribute `a`: `need[a] = max(1, target - current[a] + 1)`.
   - Lower white attributes therefore have larger need.
   - The highest white attribute still has need 1 rather than disappearing.
4. For a normal drill:
   - `effectPct = level * 10`.
   - `strength = xpPerPlayer * (1 + effectPct / 100)`.
5. For a Master/Campus drill:
   - `effectPct = additionalTrainingEffectPercent` from the catalogue (currently 80).
   - `strength = xpPerPlayer * (1 + effectPct / 100)`.
6. Determine the drill attributes applicable to that player's player-type:
   - outfield: IDs 1–15;
   - GK: use the GK skill pool represented by the GK key map.
   - ignore inapplicable GK-only fields when evaluating an outfield player.
7. Give grey/applicable attributes zero need. They still remain in the denominator because gain directed there is not useful to this player's white-skill objective.
8. `usefulNeed = sum(need[a] for affected applicable attributes that are white)`.
9. `drillScore = strength * usefulNeed / count(affected applicable attributes)`.
10. Build six slots greedily, but after each selected slot apply a **balancing credit** to every white attribute hit by that drill so the next slot can shift toward other low white skills:
    - `creditPerHit = strength / count(affected applicable attributes)`.
    - Maintain `sessionCredit[a] += creditPerHit`.
    - For the next slot use `adjustedNeed[a] = max(1, need[a] - sessionCredit[a])`.
11. Re-score all legal drills for each next slot using adjustedNeed.
12. Ties: choose the drill that covers more distinct white attributes not yet covered; if still tied choose lower condition drain; if still tied preserve catalogue order.

This is an explicit companion-app ranking model. It is intentionally separated from the unexposed server RNG/formula so the developer does not invent one.

## 7. Outputs to show

For the generated session show:
- six drill slots
- each drill's level/effect (or Master +80)
- targeted white attributes
- grey/applicable attributes hit, if any
- total condition cost
- total XP
- "priority attributes" (the player's lowest white skills)
- Master card quantities consumed
- remaining Master card stock after completion

Do not label the companion score as an exact predicted percentage-point gain. Use labels such as `Useful Training Score` / `Recommended for current attributes`.

## 8. State updates

Normal level/unlock settings persist locally.

Master quantities persist locally.

If the user marks a recommended session completed, deduct only the Master cards actually included. Never auto-change normal drill levels unless the user updates them or a future scan/import feature provides new authoritative values.

## 9. Data versioning

Store a game-data version (here `build_30527`) separately from user profile data. Do not overwrite the user's drill settings when the static catalogue is updated.
