# Top Eleven APK 30527 — Native IL2CPP Formula Recovery (Pass 2)

Source: ARM64 `libil2cpp.so` from `te_directapk_prod_30527.apk`, correlated to metadata v39.

## 1. Skill-point group distribution — recovered

`DefaultAttributeCategoryStrategy.DistributePerAttributeGroup` (`0x4D4FE0C`) explicitly divides the incoming integer skill-point reward across **three attribute categories**.

Native code performs integer division by 3 using the compiler's `0x55555556` signed-divide transform:

```text
base = floor(skillPoints / 3)
remainder = skillPoints - (base * 3)
```

The returned group-distribution object starts each of its three category counts at `base` and distributes `remainder` (0, 1, or 2) across categories using `DeterministicRandom`.

Therefore the categories differ by at most one point before per-attribute distribution.

Example shape (category chosen for remainder is seed-dependent):

```text
7 points -> 3 / 2 / 2
8 points -> 3 / 3 / 2
9 points -> 3 / 3 / 3
```

The ordering of the categories is separately resolved by player type and category enums; the important confirmed behavior is the equal three-way split + deterministic remainder assignment.

## 2. DeterministicRandom — exact PRNG recovered

Metadata type: `DeterministicRandom`

Mapped methods:
- `.ctor` — `0x4D52604`
- `NextDouble` — `0x4D52BCC`
- `NextInt` — `0x4D5262C`
- `Next` — `0x4D52BF4`

`Next` uses the exact 48-bit LCG constants:

```text
multiplier = 0x5DEECE66D
addend     = 11
mask       = 0xFFFFFFFFFFFF   // (1 << 48) - 1

seed = (seed * multiplier + addend) & mask
return seed >> (48 - bits)
```

`NextInt(min,max)` advances the same seed and chooses an inclusive integer in the supplied range using modulo reduction.

`NextDouble(size)` resolves an integer in `0..size-1` and divides by `size`, producing a deterministic discrete fraction.

This proves skill-point placement is pseudo-random but reproducible for the same seed/state.

## 3. Per-attribute distribution — recovered structure

`DefaultAttributeCategoryStrategy.DistributePerAttribute` (`0x4D504B8`) receives the three group counts from `DistributePerAttributeGroup`.

For each category:
1. obtain the eligible attribute collection;
2. compute an integer offset from the player's current attributes via `AttributeIntegerSum(category, player, ...)`;
3. advance the deterministic RNG;
4. combine RNG result + current-attribute integer sum;
5. reduce modulo eligible attribute count;
6. increment the selected attribute's distribution count by exactly 1;
7. repeat until that category's allocated point count is exhausted.

The native index calculation has the form:

```text
index = (rngValue + attributeIntegerSum) % eligibleAttributeCount
```

The same structure is repeated for all three category buckets.

### Consequence
Training gain is deliberately spread point-by-point across eligible attributes. A drill/session reward is not simply assigned to the lowest, highest, or first white attribute.

## 4. AttributeIntegerSum — current values affect future point placement

`DefaultAttributeCategoryStrategy.AttributeIntegerSum` (`0x4D52758`) enumerates the attributes belonging to a requested category and reads their current values from `PlayerWrapper.Attributes`.

Each returned floating attribute value is converted to an integer and accumulated into a sum. That sum is then used by `DistributePerAttribute` as part of the modulo selection offset described above.

Therefore two otherwise identical players with different current skill distributions can receive the same awarded points in a different attribute order, even with the same eligible skill set.

This is important for an optimiser: exact visible point placement is state-dependent, not just drill-dependent.

## 5. Goalkeepers are routed through a distinct category

`ApplySkillPointsWithCap` (`0x4D50E6C`) calls `PlayerWrapper.get_IsGoalkeeper` (`0x4A557D4`).

Confirmed enum:

```text
PlayerAttributeCategory.Attack      = 0
PlayerAttributeCategory.Defence     = 1
PlayerAttributeCategory.Physical    = 2
PlayerAttributeCategory.GoalKeeper  = 3
```

The capped-distribution path substitutes the GoalKeeper category in places where an outfield player uses an outfield category. Physical remains explicitly category `2`.

This confirms goalkeeper training must not share the exact same attribute-category model as outfield players.

## 6. Applying distribution to actual player attributes

`IncreasePlayerAttribute` — `0x4D520A0`

The routine:
1. obtains a runtime club/config value;
2. multiplies the distributed floating addition by that runtime multiplier;
3. rounds upward (`ceil`) via `RoundUpThirdDecimalAttributeValue`;
4. dispatches on `PlayerAttribute` IDs 1..25;
5. adds the resulting integer increment to the corresponding stored player attribute;
6. invokes player attribute recalculation/update.

`RoundUpThirdDecimalAttributeValue` (`0x4D52590`) compiles to an ARM64 positive-infinity rounding instruction (`frintp`) followed by float-to-int conversion. In other words the value supplied to this helper is **ceiled**, not ordinary nearest rounding.

The runtime multiplier itself is not hardcoded here. `ClubModel` contains both server-populated:
- `AttributeMultiplier`
- `SkillPointsForOneAttribute`

Further mapping is required before assigning the observed object offset to one of those two fields, so this pass deliberately does not guess which one it is.

## 7. Attribute IDs confirmed by the native switch

The native switch covers IDs 1 through 25, matching the protocol enum:

1 Fitness
2 Strength
3 Aggression
4 Speed
5 Creativity
6 Passing
7 Dribbling
8 Crossing
9 Shooting
10 Finishing
11 Tackling
12 Marking
13 Positioning
14 Heading
15 Bravery
16 Reflexes
17 Agility
18 Anticipation
19 Rushing Out
20 Communication
21 Throwing
22 Kicking
23 Punching
24 Aerial Reach
25 Concentration

Role-training and special-ability IDs occupy separate ranges (100+ and 150+) and are handled by their dedicated assigners rather than this 1..25 physical-attribute switch.

## 8. Existing cap formula remains confirmed

From Pass 1:

```text
LocalAttributeCap(clubLevel) = 50 + 5 * clubLevel
GlobalQualityCap(clubLevel)  = 45 + 5 * clubLevel

globalHeadroomInSkillPoints =
    (GlobalQualityCap - calculatedQuality) * 15

allowed = max(0,
              min(awardedSkillPoints,
                  LocalAttributeCap - currentAttributeValue,
                  globalHeadroomInSkillPoints))
```

The capped per-attribute distributor invokes this calculation directly before applying a point to an attribute.

## 9. What this changes for the training optimiser

A closer client-side model is now:

```text
server/raw skill-point reward
        ↓
split approximately evenly into 3 attribute-category buckets
        ↓
deterministic remainder allocation
        ↓
for each category, point-by-point deterministic attribute selection
(selection depends on PRNG state + current player attribute integer sums)
        ↓
local/global cap clamp
        ↓
overflow collection and redistribution
        ↓
runtime attribute conversion/multiplier
        ↓
ceil to stored attribute increment
        ↓
player recalculation
```

This is significantly different from a selector that merely counts white/grey skills.

## 10. Confidence

- Three-way point split: HIGH (direct integer arithmetic and branch structure)
- Deterministic RNG formula/constants: HIGH (direct native immediates)
- Per-attribute modulo selection: HIGH (direct native arithmetic)
- Current attribute values influencing selection: HIGH (AttributeIntegerSum call + sum in index)
- Goalkeeper category substitution: HIGH (`get_IsGoalkeeper` address resolved to PlayerWrapper metadata)
- Upward rounding during stored-attribute update: HIGH (`frintp` native instruction)
- Identity/value of runtime multiplier in IncreasePlayerAttribute: PARTIAL — server field exists, exact object field not assigned yet
- Full overflow algorithm: IN PROGRESS
- Hidden Talent effect: STILL UNCONFIRMED
