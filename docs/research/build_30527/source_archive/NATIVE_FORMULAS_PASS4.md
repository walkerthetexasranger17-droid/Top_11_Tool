# Top Eleven Native Mine — Pass 4

## Scope
Raw-gain modifiers, drill/player training boosts, Extreme Training, Special Coach, reduced training drain, and boost transport.

## Confirmed native mappings

### TrainingBoostsService
- OldTrainingGetDrillBoost: `0x4D4F07C`
- PreparationTrainingGetDrillBoost: `0x4D4F220`
- CheckIfDrillTypesAreSame: `0x4D4F3C4`
- GetAllDrillBoosts: `0x4D4F4D8`
- OldTrainingDrillBoostActive: `0x4D4F70C`
- PreparationTrainingDrillBoostActive: `0x4D4F730`
- PlayerBoostsActive: `0x4D4F754`
- GetPlayerTrainingBoosts: `0x4D4F8DC`

### ClubBoosts
- GetExtremeTrainingBoost: `0x4A97AD8`
- GetSpecialCoachTrainingBonusBoost: `0x4A97D68`
- GetReduceTrainingDrainBoost: `0x4A98854`

### Boost value accessors
- ExtremeTrainingBoost.get_Percent: `0x4A99DB0`
- MultiplyTrainingBonusBoost.get_TrainingBoostMultiplier: `0x4A9B618`
- ReduceTrainingDrainBoost.get_Percentage: `0x4AA1120`
- SpecialCoachTrainingBonusBoost.get_SessionMultiplierBonus: `0x4AA1A78`
- TrainingDrillsBoost.get_TrainingEffectPercent: `0x4AA2000`
- TrainingPlayersBoost.get_TrainingEffectPercent: `0x4AA20F0`

## Confirmed drill boost category mapping
`TrainingBoostsService.CheckIfDrillTypesAreSame()` maps boost categories to drill categories as follows:

| BoostType | numeric | expected drill category numeric |
|---|---:|---:|
| All | 0 | 0 |
| Attack | 1 | 1 |
| Defence | 2 | 2 |
| PhysicalAndMental | 3 | 4 |
| Possession | 4 | 3 |

The final comparison is against `TrainingDrillsBoost.get_DrillType()`.

This proves drill-category boosts are selective, not globally applied.

## Confirmed server transport for boost magnitudes
`Nordeus.Communication.BoostDto` carries separate typed boost payloads. Relevant field numbers:

- field 7: MultiplyTrainingBonusesBoost
- field 8: IncreaseTrainingBonusesBoost
- field 9: TrainingDrillsBoosts
- field 10: TrainingPlayersBoosts
- field 15: ExtremeTrainingBoost
- field 18: SpecialCoachTrainingBonusBoost
- field 26: ReduceTrainingConditionDrainBoost

Specific payloads:

### ExtremeTrainingBoostDto
- field 1: `Percent`

### TrainingDrillsBoostDto
- field 1: `DrillType`
- field 2: `TrainingEffectPercent`

### TrainingPlayersBoostDto
- field 1: `TrainingEffectPercent`
- field 3: `AssistantReportKey`
- field 4: `LocalizationParams`

### SpecialCoachTrainingBonusBoostDto
- field 1: `SessionMultiplierBonus`

### ReduceTrainingConditionDrainBoostDto
- field 1: `Source`
- field 2: `Percentage`

### MultiplyTrainingBonusBoostDto
- field 1: `Multiplier`

### TrainingBonusesBoostDto
- field 1: `TrainingBonusInPercents`

### IncreaseTrainingBonusesBoostDto
- field 1: `IncreaseBonus`

## Architectural conclusion
The APK contains local logic for:
- locating boost objects,
- filtering them by drill/player criteria,
- deciding whether a boost applies,
- exposing their typed value to UI/domain logic.

The magnitude itself is runtime/server-provided for the important current boost types listed above. Therefore static mining cannot legitimately manufacture values such as "Extreme Training = X%" for a given live account/event unless that live `BoostDto` has been received.

## Player-specific boost model
The current APK contains separate training-player boost protocol/domain types for conditions including:
- minimum age,
- minimum stars,
- maximum stars,
- star ranges,
- specific role,
- player currently training a role,
- player currently training a special ability,
- explicitly selected player,
- lifetime selected-player boosts.

Each applicable boost has an `Amount`/`TrainingEffectPercent` payload rather than deriving a universal percentage locally.

## Important implication for optimiser
A correct optimiser should represent modifiers as composable runtime inputs, for example:

```
base/raw reward
  -> applicable drill-category boosts
  -> applicable player-specific boosts
  -> Extreme Training percent
  -> other training bonus multiplier/boost state
  -> Special Coach session multiplier bonus
  -> then downstream skill-point distribution/caps (Passes 1-3)
```

The exact combination operation for all simultaneous boost classes has not yet been proven end-to-end; do not blindly sum every percentage.

## Still unresolved / next targets
1. Locate the exact calculation that combines simultaneous boost values into final training reward.
2. Trace `ExtremeTrainingBonusLimit` use and determine whether it is a hard client-side cap or server-returned/report-only limit.
3. Trace condition-drain reduction application to determine formula (`base * (1-pct)`, clamp behavior, stacking rules).
4. Recover preparation-training bonus/critical multiplier calculation and overtraining logic.
5. Trace raw execute-training result transformation from protobuf response into `TrainedPlayer`/attribute point package.

