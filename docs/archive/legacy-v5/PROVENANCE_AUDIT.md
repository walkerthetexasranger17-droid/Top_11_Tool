# Top Eleven Tool v5.2.7 — Build 30527 Provenance Audit

This release was audited against the recovered reverse-engineering evidence chain rather than only against the consolidated Bible.

## Corrections made

1. **Tackling protocol IDs** — direct ARM64/build-30527 evidence gives `Balanced=0`, `Stay On Feet=1`, `Aggressive=2`. The previous Bible/app table had these IDs attached to the wrong labels. The runtime table now also follows numeric enum order so deterministic enum-order ties are correct. Drain intensities by label remain unchanged: Balanced Low/0, Stay On Feet High/7, Aggressive Medium/5.
2. **Tactics drain overrides** — native override fields are nullable `ConditionDrainIntensity` enum values (`Low=0`, `Medium=1`, `High=2`). The engine now resolves numeric 0/1/2 correctly while retaining compatibility with direct 0/5/7 contribution inputs.
3. **Formation tie-break** — removed undocumented aggregate `playstyleLevel` sum from whole-XI ranking. Completed assignments use the documented aggregate tuple; only a deterministic per-slot candidate tie may consult playstyle level after roleMean/natural/roleFloor/playstyleFit.
4. **Formation wording** — UI now says “Auto best of 5 templates” so it does not imply every possible Top Eleven shape is searched.

## Evidence boundaries retained

- Exact normal-training final percentage-point gains are server-authoritative and are **not predicted**.
- Hidden Talent, Squad Balance formula, playstyle/SA hidden match-engine magnitudes, mentor signature-array semantics and a universal role→SA training-eligibility matrix remain unresolved.
- Formation role score, tactic fit, mentor ranking and training drill utility are explicitly Top Eleven Tool companion calculations, not Nordeus formulas.

## Under-specified but non-blocking

The final Team Training specification says to use the same six-slot player/white-skill beam principles but does not explicitly state whether consumable Masterclass cards should be candidates in Team Training. The current implementation uses normal drills only. This is treated as a companion-product decision, not a recovered game fact, and no game behaviour is fabricated to fill the gap.
