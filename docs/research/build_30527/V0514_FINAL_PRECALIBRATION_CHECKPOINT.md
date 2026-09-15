# v0.5.14 — Final Pre-Calibration Logic Checkpoint

**Date:** 2026-09-15  
**Status:** AUTHORITATIVE FINAL PRE-CALIBRATION CHECKPOINT

This checkpoint preserves the complete own-squad Team Plan stitch from v0.5.13 and closes the final two evidence gaps requested before calibration: drill-intensity gain handling and Captain selection/effect.

## Permanent architecture

The active pre-match decision chain remains:

`own squad -> legal Formation/XI -> requested/Auto Tactics -> automatic set pieces -> gameplay-neutral Captain default -> Mentor -> winning Team Plan -> per-player Training context`

No opponent formation, opponent strength, opponent tactics, scouting profile, relative-strength estimate or live-match state is accepted by the decision runtime.

## 1. Training — harder drills and gain strength

Recovered build-30527 data proves the normal drill base XP ladder:

| Intensity | Base XP / player | Condition |
|---|---:|---:|
| Very Easy | 1 | 0.75 |
| Easy | 2 | 1.50 |
| Medium | 3 | 2.25 |
| Hard | 4 | 3.00 |
| Very Hard | 5 | 3.75 |

Normal drill-level effects are then applied: Semi-Pro +10%, Pro +20%, World Class +30%. Master/Campus drills use their recovered catalogue training-effect percentage.

The Training engine therefore models gain strength as:

`trainingStrength = baseXP × (1 + trainingEffectPercent / 100)`

This is not an invented hard-drill bonus. It is the recovered game input itself. If two drills hit the same useful target-gap white skills and have the same training-effect percentage, the harder drill must rank higher in **Max Growth** because it carries more XP. Example at World Class: Easy = 2.6 modeled strength, Very Hard = 6.5.

Condition rises in the same 1:2:3:4:5 proportion, so intensity alone gets no artificial **Condition Efficient** bonus. The correct white-skill target gaps and drill level still determine useful value. Intensity is also not a blanket “pick the hardest drill” override in Max Growth: a lower-intensity drill can correctly outrank a harder one when it covers much larger Role+Playstyle target gaps.

**Boundary:** exact final normal-training percentage-point `AttributeGain` remains server/runtime-owned. v0.5.14 does not claim XP-to-attribute conversion values.

The Role+Playstyle target-shape system from v0.5.13 is unchanged: signature white skills are deliberately driven above lower-value whites, and already-satisfied signature skills fall to maintenance pressure rather than being flattened upward forever.

## 2. Captain — evidence-backed neutral treatment

Two evidence layers are now reconciled:

1. Historical Nordeus Support explicitly stated that choosing a Captain does not make that player stronger/better and does not change player/team stats; their advice was to choose the strongest or favourite player.
2. The recovered current build-30527 client proves Captain assignment/save state but still exposes no recovered Captain performance calculation or automatic best-Captain scoring formula.

No current Top Eleven 2027 release material located in the final research pass announces a new Captain gameplay mechanic.

Therefore v0.5.14 treats Captain as **gameplay-neutral**:

- Captain contributes **0 points** to Formation scoring.
- Captain contributes **0 points** to Tactics scoring.
- Captain contributes **0 points** to Mentor scoring.
- Captain is excluded from Set-Piece readiness/tie-breaks.
- Captain contributes **0 points** to final Team Plan ranking.
- No Bravery, age, OVR, personality or invented Leadership coefficient is claimed to improve performance.

For UI convenience only, the automatic default is:

`highest OVR -> assigned-role mean -> assigned-role floor -> stable player key`

A manual Captain choice among the starting XI is treated as performance-equivalent.

Team Plan persistence is bumped to schema **v5** so older cached plans are not reused with the previous Captain-readiness model. Set Piece provenance state remains v5.

## 3. Set-piece boundary

Penalty/free-kick/corner companion rankings remain evidence-transparent and may act only as a late non-additive Team Plan tie-break. Captain is not included in that readiness tuple.

Preferred foot is still not captured, so no dominant-foot left/right set-piece advantage is invented.

## 4. What is now frozen before calibration

Do not add more architecture before controlled fixture calibration unless a regression proves a genuine bug. The pre-calibration system now includes:

- Formation/XI selection;
- requested/Auto Tactics joint evaluation;
- exact recovered condition-drain table/search;
- automatic penalty/free-kick/corner package;
- gameplay-neutral Captain default;
- plan-dependent Mentor selection;
- Role+Playstyle target-shape development;
- verified drill-intensity gain strength;
- Team-Plan tactic context in Training;
- own-squad-only decision boundary.

## 5. Next step

Run controlled own-squad fixture calibration. Deliberately vary squad composition, natural roles, Playstyles, Special Abilities, Mentor levels, drill levels and player attribute shapes. Inspect the complete selected plan and each player Training recommendation. Tune only transparent companion rules when a concrete recommendation is demonstrably poor.

Do not reintroduce opponent inputs. Do not invent exact server-owned training outcomes. Do not assign Captain a performance effect without new direct evidence.

## 6. Validation baseline

Final v0.5.14 release baseline: **336 core assertions PASS** plus strategy-data, static/package, navigation, cloud, frozen scanner/reference, JS syntax, archive CRC and decision-manifest hash validation.
