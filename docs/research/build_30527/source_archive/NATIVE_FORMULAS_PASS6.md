# Top Eleven APK Native Mine — Pass 6
## AttributesPerDrills and corrected Service.Protos CodeGen mapping

Build analysed: `te_directapk_prod_30527.apk`
Architecture: Android ARM64, Unity IL2CPP metadata v39.

## Critical mapping correction

The protobuf communication classes (`Nordeus.Communication.*`) are generated in **Service.Protos.dll**, not `Assembly-CSharp.dll`.

Recovered CodeGenModule records:

```text
Assembly-CSharp.dll   method count 119,595   method table 0x8A89588
Service.Protos.dll   method count  96,865   method table 0x90F3DB8
```

Therefore native addresses for protobuf getters/constructors must be resolved against `Service.Protos.dll`'s method table. Earlier schema findings and protobuf field numbers remain valid; any earlier native address assigned to a `Nordeus.Communication.*` method using the Assembly-CSharp table should be treated as superseded.

## Correct ExecuteTrainingResponse native getters

Using the Service.Protos CodeGenModule:

```text
ExecuteTrainingResponse.get_AttributesPerDrills token 0x06015BE7 -> 0x7306A4C
ExecuteTrainingResponse.get_TrainedPlayers     token 0x06015BE8 -> 0x7306A54
ExecuteTrainingResponse..cctor                token 0x06015C06 -> 0x73084E0
```

The ARM64 getter bodies prove the instance layout:

```text
get_AttributesPerDrills: LDR X0, [X0,#0x40]
get_TrainedPlayers:      LDR X0, [X0,#0x48]
```

So `AttributesPerDrills` and `TrainedPlayers` are separate response objects and are adjacent in the generated message layout.

## TrainingReportData consumes AttributesPerDrills immediately

`TrainingReportData::.ctor` at `0x5116FB4` reads the ExecuteTrainingResponse object directly.

Relevant sequence:

```text
LDR X8, [response,#0x40]     ; AttributesPerDrills
...
BL  0x5B35168                ; generic/list conversion helper
...
STR returned-object into report-data instance

LDR X8, [response,#0x48]     ; TrainedPlayers (separate path in surrounding report flow)
```

This proves `AttributesPerDrills` is active runtime report data. It is not an unused/dead protobuf compatibility field.

## It is not a primitive repeated list

Metadata field type indices for the current response are:

```text
_repeated_attributesPerDrills_codec  type index 11926
attributesPerDrills_                 type index 46437

_repeated_trainedPlayers_codec       type index 12242
trainedPlayers_                      type index 47058
```

A full scan of 187,721 metadata fields shows the `attributesPerDrills_` closed generic type index (46437) occurs only in:

```text
ExecuteTrainingResponseObsolete.attributesPerDrills_
ExecuteTrainingResponse.attributesPerDrills_
```

Likewise its FieldCodec closed generic type is unique to those two fields.

By contrast repeated primitive/list types are reused widely. This is strong evidence that `AttributesPerDrills` is a repeated **custom element/message type**, not simply `RepeatedField<int>`, `RepeatedField<float>`, `RepeatedField<string>`, etc.

The exact custom element type has not yet been named from the v39 generic-inst table, so its internal fields should not be guessed.

## Relationship to historical TrainingReport

Current persistent `TrainingReport` contains:

```text
ExecutionTime
Bonuses[]
TrainingDrills[]
NumberOfPlayersTrained
AvgConditionDrop
CoachingPointsGain
Players[]
BonusFeedback
SpecialCoachActive
SpecialSponsorBonusBoosted
AdditionalTrainingBonuses[]
OverTrainInfo
TeamPlayDrillTrainingEffectKeys[]
```

It does **not** contain `AttributesPerDrills`.

This means `AttributesPerDrills` is supplied for the immediate execute-training response/report path but is not part of the long-lived stored report schema.

Strong interpretation: it is likely transient drill-level breakdown/display/session-effect data, while `TrainedPlayers[].AttributeGain` is the canonical player-level outcome that is retained in reports.

This interpretation is stronger than before, but the exact semantics of each `AttributesPerDrills` element still require recovery of its generic argument/custom message schema.

## Canonical final-gain schema remains confirmed

The current server response contains:

```text
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

Therefore final player gain is still explicitly available independently of `AttributesPerDrills`.

## Next native/protocol target

Recover the v39 IL2CPP **generic-inst/type table** entry for metadata type index `46437` and identify the element type of `RepeatedField<T> attributesPerDrills_`.

Once `T` is known, map its protobuf fields and determine whether elements encode:

- drill ID -> affected attributes,
- drill ID -> per-attribute gains,
- per-drill attribute count/mask,
- or another report-only effect object.

Do not implement a guessed schema in the optimiser until this type is resolved.
