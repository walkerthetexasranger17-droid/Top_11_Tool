# Top Eleven APK 30527 — Native IL2CPP Formula Recovery (Pass 3)

Source: ARM64 `libil2cpp.so` from `te_directapk_prod_30527.apk`, correlated to metadata v39 and the recovered `Assembly-CSharp.dll` generated method-pointer table.

## 1. Runtime attribute conversion field identified with certainty

`DefaultAttributeCategoryStrategy.IncreasePlayerAttribute` (`0x4D520A0`) obtains the club model and directly reads **offset `0xC0`** before multiplying the distributed floating-point addition.

`ClubModel.get_AttributeMultiplier` (`0x4F9A950`) is exactly:

```text
ldr w0, [x0, #0xC0]
ret
```

Therefore the previously unresolved runtime value is confirmed as:

```text
storedIncrement = ceil(distributedAddition * ClubModel.AttributeMultiplier)
```

The `ceil` path remains confirmed through `RoundUpThirdDecimalAttributeValue` / ARM64 `frintp`.

`ClubModel.SkillPointsForOneAttribute` is a different field at offset `0x108` (`get_SkillPointsForOneAttribute` = `0x4F9AEE8`).

## 2. TE3 skill-point category diversion — exact priority recovered

`TE3SkillPointCategoryStrategy.Distribute` (`0x4D5337C`) constructs `CategoryDistribution`, whose fields are:

```text
Attributes
SpecialAbility
TrainingRole
```

The native routine processes incoming points in this exact order:

```text
specialAbilitySpend = CalculateToSpendOnSpecialAbility(player, totalPoints)
remaining = max(0, totalPoints - specialAbilitySpend)

roleSpend = CalculateToSpendOnRoleTraining(player, remaining)
remaining = max(0, remaining - roleSpend)

attributeSpend = CalculateToSpendOnAttributes(player, remaining, enforceAttributeSumCap)
```

It then stores:

```text
CategoryDistribution.SpecialAbility = specialAbilitySpend
CategoryDistribution.TrainingRole   = roleSpend
CategoryDistribution.Attributes     = attributeSpend
```

Therefore, when both training destinations are valid, **Special Ability has priority over Role training, and both have priority over normal attributes**.

## 3. Role-training allocation formula

`CalculateToSpendOnRoleTraining` (`0x4D53D04`) uses the server-populated `PlayerInfo.TrainingRoleCost` (field offset `0x5C`) and the player's current role-training progress.

When role training is valid and active:

```text
remainingRoleCost = max(0, TrainingRoleCost - currentRoleTrainingProgress)
roleSpend = min(pointsAvailable, remainingRoleCost)
```

When role training is not valid/active/available, `roleSpend = 0`.

`RoleTrainingSkillPointAssigner.ApplySkillPoints` (`0x4D52C28`) then:
- adds the allocated points to current role-training progress;
- if the total remains below the cost, saves the new progress;
- if it reaches the cost exactly, adds the trained role to the player's role collection, clears the active role-training target to `-1`, and resets role-training progress to `0`.

The strategy prevents intentional overspend before this assigner is called.

### Role validation details
`RoleTrainingSkillPointAssigner.Validate` (`0x4D52D64`) confirms, at minimum:
- a player/communication player exists;
- role training is active;
- the training-role target is not `-1`;
- the player's current role collection size is `<= 2` (allowing completion into another role);
- role/special-ability training is not paused.

## 4. Special-ability allocation formula

`CalculateToSpendOnSpecialAbility` (`0x4D53B40`) looks up the cost of the currently trained special ability in the server-populated `PlayerInfo.TrainingSpecialAbilityCostByType` map (PlayerInfo field offset `0x60`).

When special-ability training is valid and active:

```text
abilityCost = TrainingSpecialAbilityCostByType[currentSpecialAbility]
remainingAbilityCost = max(0, abilityCost - currentSpecialAbilityProgress)
specialAbilitySpend = min(pointsAvailable, remainingAbilityCost)
```

When special-ability training is not valid/active/available, `specialAbilitySpend = 0`.

`SpecialAbilityTrainingAssigner.ApplySkillPoints` (`0x4D53540`) mirrors role training:
- increment current special-ability progress;
- if below cost, store the new progress;
- on exact completion, add the special ability to the player's ability collection, set the active training target to `-1`, and reset progress to `0`.

The cost is **ability-specific**, not one universal static value.

## 5. Normal-attribute spend respects the total-attribute-sum cap

`CalculateToSpendOnAttributes` (`0x4D53E30`) has two paths.

When its cap-enforcement flag is false:

```text
attributeSpend = pointsAvailable
```

When cap enforcement is true, it reads server-populated `PlayerInfo.MaxPlayerAttributeSum` (field offset `0x3C`) and calls:

`LegacyQualityCalculator.GetSumOfAbsoluteQualityOfAllAttributes` (`0x4DD068C`).

Equivalent logic:

```text
remainingAttributeSumHeadroom =
    MaxPlayerAttributeSum - SumOfAbsoluteQualityOfAllAttributes(player)

attributeSpend = min(remainingAttributeSumHeadroom, pointsAvailable)
```

Thus the client has **both** the per-attribute/local/global cap system recovered in Pass 1 and a separate whole-player maximum attribute-sum gate in the TE3 distribution strategy.

## 6. Overflow redistribution — high-level algorithm recovered

`DefaultAttributeCategoryStrategy.ApplyOverflowSkillPoints` (`0x4D51698`) receives a floating overflow amount.

Hard constants read from the native binary:

```text
termination epsilon = 0.0001
secondary diagnostic threshold = 0.001
loop safety counter threshold = 999 (effectively ~1000 passes maximum)
```

The core redistribution behavior is:

1. Build/enumerate the eligible attribute set.
2. Exclude attributes already at the **local cap** (`HasReachedLocalCap`).
3. Count the remaining eligible attributes.
4. Compute an equal-share candidate:

```text
equalShare = overflow / eligibleCount
```

5. For the candidate attributes, calculate `GetMinimalIncrementValue(...)` and reduce the pass increment to the **smallest cap-safe increment** encountered:

```text
passIncrement = min(equalShare, minimumSafeIncrementAcrossEligibleAttributes)
```

6. Iterate eligible attributes again. For each attribute not at the **global cap**, call `IncreasePlayerAttribute(player, attribute, passIncrement)` and subtract the applied share from overflow.
7. Re-evaluate the eligible/cap state and repeat while meaningful overflow remains.
8. Stop when overflow is `< 0.0001`, no valid redistribution remains, the global cap blocks progress, or the safety-loop limit is reached.

This means overflow is deliberately redistributed **approximately evenly**, while the smallest available cap headroom prevents one pass from overfilling any eligible attribute.

## 7. Important combined model

The recovered client-side path is now substantially clearer:

```text
incoming raw skill points
        ↓
TE3 category diversion
        ├─ Special Ability first (up to remaining ability cost)
        ├─ Role training second (up to remaining role cost)
        └─ Attributes receive remainder (subject to total attribute-sum cap)
        ↓
attribute-category distribution
        ↓
deterministic per-attribute placement
        ↓
per-attribute local/global cap clamp
        ↓
overflow redistributed evenly to cap-eligible attributes
        ↓
distributedAddition × ClubModel.AttributeMultiplier
        ↓
ceil()
        ↓
stored player attribute update
```

## 8. Age-rate investigation

The server-populated thresholds remain confirmed:
- `PlayerMaxRateAge` — PlayerInfo offset `0x48`
- `PlayerHalfRateAge` — PlayerInfo offset `0x44`
- `PlayerQuarterRateAge` — PlayerInfo offset `0x4C`

However, none of the local `TE3SkillPointCategoryStrategy`, role/ability assigners, cap calculator, or `DefaultAttributeCategoryStrategy` paths recovered so far apply these age thresholds.

This is strong evidence that **age-rate scaling happens before the client-side skill-point distribution stage** (likely in server/raw reward calculation or another upstream layer). The APK supplies the thresholds to the client but the core local distributor consumes already-awarded points.

No static numeric values for these server-supplied age thresholds are embedded in this APK build.

## 9. Hidden Talent investigation

`Nordeus.Communication.HiddenPlayerAttributes.Talent` remains a genuine protobuf field (field number 1). A separate Youth Academy reward message exposes `BaseTalent` (field number 4).

After tracing the native training paths recovered above, **no direct use of HiddenPlayerAttributes.Talent occurs in the local skill-point distribution, cap, role-training, special-ability-training, or attribute-conversion routines**.

Therefore it is still not justified to use `Talent` as a local training multiplier in the optimiser. Plausible possibilities remain server-side player generation/growth logic, Youth Academy logic, market/scouting logic, or a server-only input to raw training reward.

## 10. Newly mapped native methods

- `TrainingBoostsService.OldTrainingGetDrillBoost` — `0x4D4F07C`
- `TrainingBoostsService.PreparationTrainingGetDrillBoost` — `0x4D4F220`
- `TrainingBoostsService.GetPlayerTrainingBoosts` — `0x4D4F8DC`
- `RoleTrainingSkillPointAssigner.ApplySkillPoints` — `0x4D52C28`
- `RoleTrainingSkillPointAssigner.Validate` — `0x4D52D64`
- `SpecialAbilityTrainingAssigner.Validate` — `0x4D53480`
- `SpecialAbilityTrainingAssigner.ApplySkillPoints` — `0x4D53540`
- `TE3SkillPointCategoryStrategy.Distribute` — `0x4D5337C`
- `TE3SkillPointCategoryStrategy.CalculateToSpendOnSpecialAbility` — `0x4D53B40`
- `TE3SkillPointCategoryStrategy.CalculateToSpendOnRoleTraining` — `0x4D53D04`
- `TE3SkillPointCategoryStrategy.CalculateToSpendOnAttributes` — `0x4D53E30`
- `ClubModel.get_AttributeMultiplier` — `0x4F9A950`
- `ClubModel.get_SkillPointsForOneAttribute` — `0x4F9AEE8`
- `LegacyQualityCalculator.GetSumOfAbsoluteQualityOfAllAttributes` — `0x4DD068C`

## 11. Confidence

- AttributeMultiplier identity: **HIGH** (exact object field offset matched to getter)
- TE3 diversion priority: **HIGH** (direct native call/store order + CategoryDistribution fields)
- Role remaining-cost formula: **HIGH** (direct integer min/max and cost/progress reads)
- Special-ability remaining-cost formula: **HIGH** (direct cost-map lookup + integer min/max)
- Whole-player attribute-sum gate: **HIGH** (direct MaxPlayerAttributeSum read and quality-sum call)
- Overflow equal-share/cap-safe redistribution: **HIGH** for structure; generic collection helper identities do not affect the recovered arithmetic
- Age scaling location: **MEDIUM-HIGH** that it is upstream of this local distributor; exact server formula/current age values remain unavailable statically
- Talent as training multiplier: **NOT SUPPORTED by recovered local code**
