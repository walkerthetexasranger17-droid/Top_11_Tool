# Tactics condition-drain live recalibration — 2026-09-15

## Why calibration stopped

Live Top Eleven 2027 testing showed the companion's current `Medium drain` classification can disagree with the game UI. This is not safe to treat as a cosmetic label issue because Drain Limit is a hard tactic-search constraint and drain contributes to tactic ranking.

## Proven native architecture

The current Windows/WSA client still contains `TacticsConditionDrainSettings`, `TacticsDrainOverrides`, `TacticsConditionDrainRepo`, and `TacticsConditionDrainService`.

`CalculateConditionDrain` evaluates 11 dimensions and sums the resolved intensity contribution for each tactic choice. The resulting score is normalized and classified against Medium/High thresholds.

However, native static analysis explicitly established that the actual current Low/Medium/High numeric values, normalize factor, and thresholds are server/runtime supplied. Static code proves the formula architecture but does not prove the current server numbers.

`ClubResponse` field #154 can deliver `TacticsConditionDrainSpec`. Historical network captures recovered from the project library were rechecked; the inspected payload did not contain field #154, so they cannot supply the current settings.

## Legacy model that must no longer be called current/exact

The companion currently uses an older/default profile:

- base 15
- Low = 0
- Medium = 5
- High = 7
- normalize by 100
- Medium if > 0.40
- High if > 0.65

That profile is useful provenance but is not proven to be the live 2027 server configuration. In particular it assigns Stay On Feet the highest tackling drain, which directly conflicts with current live UI observation.

## Current live observation

User-observed relative drain-bar steps:

| Dimension | Options low → high |
|---|---|
| Shooting | Shoot on Sight 0; Balanced 1; Work It Into The Box 2 |
| Passing | Long 0; Mixed 1; Short 2 |
| Focus | Left 0; Right 0; Through Middle 0; Balanced 1; Both Flanks 2 |
| Crossing | Low 0; Medium 0; High 0 |
| Possession Lost | Regroup 0; Counter Press 1 |
| Possession Won | Focus on Buildup 0; Counter Attack 1 |
| Mentality | Normal 0; Defending 1; Attacking 1; Hard Defending 2; Hard Attacking 2 |
| Marking | Zonal 0; Man-to-Man 1 |
| Pressing | Low Block 0; Mid Press 1; High Press 2 |
| Back Line | Set Offside Trap 0; Track Opponent 1 |
| Tackling | Stay On Feet 0; Balanced 1; Aggressive 2 |

The 0/1/2 values should now be treated as **observed per-option intensity classes** (Low / Medium / High ordering), not linear arithmetic points. Do not sum them as though High were exactly twice Medium.

## Live class-transition observations

Starting from an all-Low option baseline, the user measured:

- Medium-intensity choices only: 2 changes still Low; **3 changes first reach Medium**; **9 changes first reach High**.
- High-intensity choices only: 1 change still Low; **2 changes first reach Medium**; **6 changes first reach High**.

These observations strongly support the native categorical-intensity architecture and prove that a simple 0+1+2 linear score is unsafe. They constrain the hidden numeric Medium/High mapping, but mixed Medium/High packages still need direct live anchors before we can claim an exact classifier.

## Why the mismatch matters

Using the stale/default drain profile can:

1. overstate the cost of Stay On Feet;
2. understate the cost of Aggressive tackling;
3. mislabel a genuinely low-drain plan as Medium;
4. reject otherwise valid plans under the Low Drain Limit;
5. change Formation/Tactics joint selection because drain efficiency contributes to the tactic score;
6. distort near-tie resolution toward the wrong tactic package.

Therefore global tactic calibration is paused until the drain foundation is corrected.

## Safe implementation boundary

- Treat the user's table as `LIVE_UI_OBSERVATION` for per-option Low/Medium/High intensity ordering.
- Do not rewrite it into hidden server percentages.
- Do not preserve the old `Stay On Feet = High` claim as current truth.
- Do not invent new Low/Medium/High class boundaries.
- Pure Medium-only and High-only transition counts are now known, but mixed Medium/High packages must remain unclassified until the hidden numeric exchange rate or enough mixed-boundary observations are recovered.
- During calibration, the 10-point drain-efficiency component stays neutral and Low/Medium hard limits remain disabled for the live profile; only the High/unconstrained search is used.
- Drain may only break an exact/near tie when one candidate is component-wise no worse in both Medium-count and High-count and strictly better in at least one.

## Remaining live drain research

The remaining task is to recover enough mixed-intensity boundary observations (or the runtime settings payload) to determine the numeric relationship between Medium- and High-intensity choices and the exact current Low/Medium/High classifier. The user is handling this live research while the rest of calibration continues.
