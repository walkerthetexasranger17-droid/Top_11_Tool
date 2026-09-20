# Provenance / confidence

## APK
- User-supplied Top Eleven APK build: 30527
- SHA-256: 88bd2944a0ea2b3089e3425a8b325264609dfc9e38ef62f75ba6fc1ed74d2ab6
- Unity IL2CPP / metadata v39.

## Runtime drill catalogue
- Official-client DevTools capture: `top_eleven_network_20260908_153800.jsonl`
- Latest decoded Execute Training response: 2026-09-08T15:40:11.9397034+01:00
- `ExecuteTrainingResponse.TrainingDrills` contained:
  - 29 BasicTrainingDrill records
  - 4 ConsumableTrainingDrill records
  - 45 TeamPlayTrainingDrill records

## Normal level effect
Native `Modules.PreparationTraining.UI.TrainingDrillExtensions.AdditionalGainPercentage`:
- Basic card path reads Level and returns `Level * 10`.
- Consumable card path returns its `AdditionalTrainingEffectPercent`.
- Other card types return zero in this method.

Current UI/runtime mapping was cross-checked against the user's drill screenshots:
- level 1: Semi-pro / +10
- level 2: Pro / +20
- level 3: World-class / +30

`TrainingDrillLevel.SetData` contains a level boundary comparison against 3, supporting 3 as the maximum regular level.

## Master/Campus drills
The four ConsumableTrainingDrill records contain Campus asset paths and the client-data text `Generated in Drill Lab`. Their live records provide exact affected attributes, +5 XP, 3.75 condition and +80 additional Training Effect.

## Master stock behavior
Native `TrainingSelectDrillsController.GetDecrementedDrillCountIfSelected(ConsumableDrill, drillSlots)` subtracts the count of already-selected copies from the drill's `UsagesLeft`. This supports quantity-based card stock and duplicate use while stock remains.

## White skill map
Recovered from the APK client role-key-attribute table. Multi-position behavior uses the union across roles.

## Important boundary
The exact server-side formula/RNG that converts a chosen session into final attribute percentage-point gains is not fully exposed by the client. The implementation contract therefore defines a transparent companion scoring model and does NOT tell the developer to fabricate an 'exact gain prediction'.
