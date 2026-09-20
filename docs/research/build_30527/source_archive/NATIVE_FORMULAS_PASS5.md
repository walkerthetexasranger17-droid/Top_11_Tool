# Top Eleven APK Native Mine — Pass 5
## ExecuteTrainingResponse → player gain trace

Build analysed: `te_directapk_prod_30527.apk`
Architecture: Android ARM64, Unity IL2CPP metadata v39.

## High-confidence conclusion

For the current regular **Execute Training** flow, the server response already contains the per-player attribute result. The relevant protobuf chain is:

```text
ExecuteTrainingResponse
  #8  AttributesPerDrills
  #9  TrainedPlayers[]

TrainedPlayer
  #1 PlayerId
  #2 ConditionBefore
  #3 ConditionAfter
  #4 AttributeGain
  #5 SharpnessReport
  #6 PlayerBoosts[]
  #7 PlaystyleProgress
  #8 CriticalInfo

AttributeGain
  #1 Attribute[]
  #2 Gain[]
```

`AttributeGain` is a pair of parallel repeated arrays, not merely a single raw XP/skill-point number. This is strong evidence that the server is returning the actual per-attribute training outcome for each player.

## ExecuteTraining request

The current request is:

```text
ExecuteTrainingRequest
  IsQuickTraining
  SelectedPlayerIds[]
  OrderedSelectedDrillIds[]
  RestTiredPlayersOption
  SpecialCoachVideoAdWatched
  TrainingSelectionType
```

The native `TrainingService.ExecuteTraining` constructs this command from the selected players/drills and dispatches it through the session/command-handler layer.

## Response handling observed natively

`TrainingData.UpdateFromExecuteTrainingResponse` native address:

```text
0x5115C00
```

This method updates/copies session state returned by the server (drills, bonus state, coach progress, over-train/team-play data, etc.). It does not run the previously recovered local attribute-cap/distribution routine over the normal ExecuteTraining response.

`TrainingReportData::.ctor` native address:

```text
0x5116FB4
```

This constructor consumes the ExecuteTraining response and stores the returned training-report objects. Again, the normal report path is consuming server-returned `TrainedPlayers` / `AttributeGain` data rather than recomputing the regular session result from a single raw skill-point value.

## Important correction to earlier architecture

Earlier passes established a genuine client-side skill-point engine:

```text
DefaultAttributeCategoryStrategy.ApplySkillPoints
ApplySkillPointsWithCap
ApplyOverflowSkillPoints
RoleTrainingSkillPointAssigner
SpecialAbilityTrainingAssigner
PlayerAttributeCapCalculator
```

That code is real, but Pass 5 does **not** support the claim that the normal regular-training ExecuteTraining response is merely a raw reward which is then distributed locally.

The stronger current model is:

```text
NORMAL TRAINING SESSION

selected player IDs + ordered drill IDs
            ↓
          SERVER
            ↓
per-player ConditionBefore/After
per-player AttributeGain(Attribute[], Gain[])
playstyle / boost / critical information
            ↓
client report + player state update
```

The local skill-point distribution engine is therefore likely used for one or more other point-award paths (e.g. explicit skill-point rewards, personal trainer/academy/reward assignment, legacy or alternate flows), or for a server-coordinated path not entered by the standard ExecuteTraining report. Its existence and recovered formulas remain valid; its role in **normal training** must not be overstated.

## Why `AttributesPerDrills` still matters

The ExecuteTraining response separately includes `AttributesPerDrills` (#8). This gives the server a way to associate session effects with the selected drills for drill animation/reporting and/or drill-specific result breakdown, while `TrainedPlayers[].AttributeGain` gives the final player-level attribute result.

The exact element type/semantic structure of `AttributesPerDrills` remains a next target, but the presence of the final `TrainedPlayer.AttributeGain` means we do not need to infer final skill gains from that field alone.

## Practical consequence for the optimiser

To replicate Top Eleven's current normal training outcome exactly, the missing high-value data is upstream/server-side:

- raw/hidden player development efficiency inputs
- age-rate application
- drill/base training-effect values
- boost stacking
- any talent/growth coefficient used by the server
- random/deterministic server-side selection if applicable

The client APK supplies the schema needed to decode the authoritative result:

```text
player_id
condition_before
condition_after
attribute_ids[]
gains[]
player_boosts[]
playstyle_progress
critical_info
```

A legitimate captured ExecuteTraining response would therefore provide **ground-truth final training data directly**, rather than requiring reconstruction from screenshots.

## Native addresses mapped in this pass

```text
TrainingService.ExecuteTraining                         0x510DA5C
ExecuteTrainingCommand::.ctor                         0x4AE6EB0
ExecuteTrainingCommandHandler.Process                 0x4AE6FC8
TrainingData.UpdateFromExecuteTrainingResponse        0x5115C00
TrainingReportData::.ctor                             0x5116FB4
```

## Confidence levels

**Confirmed:** protobuf field numbers and message structure; request contains player/drill selection; response contains per-player final `AttributeGain` arrays; normal response/report path consumes those returned objects.

**Strong inference:** normal regular-training final attribute allocation is primarily/authoritatively calculated server-side.

**Not yet proven:** exact purpose(s) of the local skill-point distributor in every game flow; exact schema/role of `AttributesPerDrills`; whether hidden `Talent` participates in server training calculations.
