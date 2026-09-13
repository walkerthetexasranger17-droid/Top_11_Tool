# Top Eleven APK 30527 — Native IL2CPP Formula Recovery (Pass 1)

Source: `te_directapk_prod_30527.apk`, ARM64 `libil2cpp.so` + metadata v39.

## Method mapping breakthrough
`Assembly-CSharp.dll` CodeGenModule located. Method pointer count: 119,595. Metadata method tokens can therefore be mapped to native ARM64 pointers by RID.

## PlayerAttributeCapCalculator

Native addresses:
- `GetValueToAdd` — `0x416E8F8`
- `GetMinimalIncrementValue` — `0x416EA50`
- `GetDistanceToLocalCap` — `0x416EA30`
- `GetDistanceToGlobalCap` — `0x416EA3C`
- `HasReachedLocalCap` — `0x416EB80`
- `HasReachedGlobalCap` — `0x416EC40`
- `.cctor` — `0x416ECF0`

### Recovered constants
The class static initializer writes:
- local relative-quality base = `200.0f`
- global relative-quality base = `(10 - 1) * 20 = 180.0f`
- floating epsilon used by reached-cap checks = `1e-5`

The shared club-level conversion routine is:

`RelativeCap(base, clubLevel) = 5 * clubLevel + 0.25 * base`

Therefore:

`LocalAttributeCap(clubLevel) = 50 + 5 * clubLevel`

`GlobalQualityCap(clubLevel) = 45 + 5 * clubLevel`

### Distance functions

`DistanceToLocalCap = localAttributeCap - currentAttributeValue`

`DistanceToGlobalCapInSkillPoints = (globalQualityCap - calculatedQuality) * 15`

The factor `15` is an immediate floating-point constant in native code.

### GetValueToAdd
Recovered equivalent logic:

```text
localDistance  = LocalAttributeCap(clubLevel) - currentAttributeValue
globalDistance = (GlobalQualityCap(clubLevel) - calculatedQuality) * 15

valueToAdd = max(
    0,
    min(
        rewardValueInSkillPoints,
        localDistance,
        globalDistance
    )
)
```

This is the game's actual clamp logic in this APK build.

### GetMinimalIncrementValue
Recovered equivalent logic:

```text
localDistance = LocalAttributeCap(clubLevel) - currentAttributeValue
globalDistancePerEligibleAttribute =
    ((GlobalQualityCap(clubLevel) - calculatedQuality) * 15)
    / eligibleAttributesSize

minimalIncrement = max(
    0,
    min(localDistance, globalDistancePerEligibleAttribute)
)
```

### Reached-cap checks

`HasReachedLocalCap` compares:

`LocalAttributeCap(clubLevel) - attributeValue < 0.00001`

`HasReachedGlobalCap` compares:

`GlobalQualityCap(clubLevel) - calculatedQuality < 0.00001`

## Skill distribution

Mapped native methods from `DefaultAttributeCategoryStrategy`:
- `ApplySkillPoints` — `0x4D4FD54`
- `DistributePerAttributeGroup` — `0x4D4FE0C`
- `DistributePerAttribute` — `0x4D504B8`
- `ApplySkillPointsWithCap` — `0x4D50E6C`
- `DistributePerAttributeWithCap` — `0x4D50FF0`
- `ApplyOverflowSkillPoints` — `0x4D51698`

Confirmed from `DistributePerAttributeWithCap`:
- it iterates awarded points/eligible attributes;
- it calls the recovered `PlayerAttributeCapCalculator.GetValueToAdd` directly;
- the returned skill-point allowance is divided by `15` before one of the attribute-value update/conversion stages;
- it uses deterministic indexed selection of eligible attributes and keeps track of overflow when a selected attribute cannot accept the full reward.

Further decompilation is required to give a clean high-level rewrite of the whole distribution loop without mislabelling generic helper calls.

## Key/white attribute determination

`PlayerWrapper.IsKeyAttribute` — `0x4A592E0`

Recovered behaviour:
- iterate all roles/positions held by the player;
- for each role, resolve the game's static role -> key-attribute collection;
- return true when the queried attribute exists in any of those collections;
- otherwise return false.

This confirms that multi-position players use the union of key attributes from their roles rather than a manually chosen single-position white-skill list.

## Tactics condition drain

Native addresses:
- `TacticsConditionDrainService.CalculateConditionDrain` — `0x44C21C4`
- `ResolveIntensity` — `0x44C2450`
- `ResolveTotalDrainIntensity` — `0x44C2498`

`CalculateConditionDrain` evaluates 11 tactic dimensions:
1. passes
2. shooting tendency
3. focus passing
4. crossing tendency
5. possession lost
6. possession won
7. mentality
8. marking style
9. pressing style
10. defensive line/back line
11. tackling style

For each tactic choice, the repository resolves a drain-intensity enum, then `ResolveIntensity` maps that enum to one of three server/settings values:
- Low -> settings low drain value
- Medium -> settings medium drain value
- High -> settings high drain value

Recovered normalization:

```text
drainScore = base/min contribution + sum(all 11 resolved tactic drain values)
drainNormalized = drainScore / NormalizeFactor
```

The normalized value is classified using two settings thresholds:

```text
if drainNormalized > ConditionDrainHighThres:
    totalIntensity = High
else if drainNormalized > ConditionDrainMedThres:
    totalIntensity = Medium
else:
    totalIntensity = Low
```

The actual low/medium/high drain values, normalize factor and thresholds live in `TacticsConditionDrainSettings` and are server/runtime supplied in this build, so static code recovers the algorithm but not those current server figures.

## Hidden Talent

`Nordeus.Communication.HiddenPlayerAttributes.Talent` is confirmed as a real protobuf field. Getter/setter addresses were mapped (`0x4059E74`, `0x4059EFC`), but no direct ARM64 BL xrefs were found in the generated text section. This usually means accesses are through protobuf/property indirection, generic/interface paths, or are inlined. It is not yet justified to claim Talent affects training gain.

## Confidence
- Cap constants/formulas: HIGH — direct ARM64 constants and arithmetic.
- Key-attribute union behaviour: HIGH — direct role-loop/dictionary membership path.
- Tactics drain algorithm: HIGH — direct ARM64 arithmetic/branches; runtime values still server-provided.
- Full skill distribution pseudocode: PARTIAL — direct calls and key conversion observed; more generic helper mapping needed.
- Talent effect on training: UNCONFIRMED.
