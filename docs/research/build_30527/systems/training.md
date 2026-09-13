# Training — Build 30527

This page records training findings because the research index should cover established game logic beyond the immediate Team Plan task.

## Proven native local distributor

Recovered:
- three-way attribute-category split with deterministic remainder;
- Java-style 48-bit LCG constants in `DeterministicRandom`;
- per-attribute index depends on RNG state + current attribute integer sums;
- goalkeeper category path is distinct;
- local/global cap logic exists;
- stored increment path uses positive-infinity rounding / ceil.

High-value symbols are in `data/build_30527/index/native_methods.json`.

## Important architecture correction

The existence of the local distributor does **not** mean normal `ExecuteTraining` final gains are purely calculated locally.

Current normal training response returns per-player:
- ConditionBefore/After
- final `AttributeGain(Attribute[], Gain[])`
- boosts
- playstyle progress
- critical information

The client consumes this server-returned final gain in the normal report/update path.

Therefore exact normal-training outcome remains server/runtime-owned unless captured. Do not turn the local skill-point distributor into a false “exact normal training predictor”.

See source archive `NATIVE_FORMULAS_PASS5.md` and `PASS6.md`.
