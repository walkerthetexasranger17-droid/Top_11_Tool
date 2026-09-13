# Tactics — Build 30527

## Proven architecture

Current client contains `TacticsConditionDrainRepo`, `TacticsConditionDrainService`, `TacticsConditionDrainSettings`, `TacticsConditionDrainSpec`, `ConditionDrainIntensity` and `TacticsDrainOverrides`.

Native addresses:
- `CalculateConditionDrain` — `0x44C21C4`
- `ResolveIntensity` — `0x44C2450`
- `ResolveTotalDrainIntensity` — `0x44C2498`

Exact defaults:
- base/min drain `15`
- normalize factor `100`
- Low `0`
- Medium `5`
- High `7`
- Medium threshold `0.40`
- High threshold `0.65`

Formula:

```text
raw = 15 + Σ contribution(each of the 11 selected options)
normalized = raw / 100

if normalized > 0.65 => High
else if normalized > 0.40 => Medium
else => Low
```

Threshold comparisons are strict `>`.

## Current 11 dimensions

Passing, Shooting Tendency, Focus Passing, Cross Tendency, Possession Lost, Possession Won, Mentality, Marking, Pressing, Back Line, Tackling.

## Shipped semantic guidance

The exact build says:
- Short passing increases combination plays; Long passing increases long-ball play.
- Shooting controls distance shooting vs working closer to goal.
- Focus Passing organizes play through the selected pitch area.
- Cross Tendency controls crossing frequency.
- Counter Press tries to win the ball back at defensive risk; Regroup prepares for the next attack.
- Force Counter Attack is riskier; buildup is safer but more predictable.
- More offensive Mentality yields more attack opportunities but greater counter exposure.
- Man-to-Man helps against faster attacks; Zonal performs better against longer-distance attacks.
- Pressing styles counter different actions and tire players differently.
- Offside Trap catches attackers offside; Track Opponent shadows progression.
- Harder Tackling stops more plays but creates more fouls/bookings.

The verbatim extract is in `../source_archive/TACTICS_V2_TOOLTIP_EXTRACT.txt`.

## Recommendation boundary

No authoritative numerical “best tactics for this XI” score has been recovered. The app's XI-fit recommendation is **COMPANION LOGIC** constrained by exact drain and supported semantics.

v0.5.2 deliberately removed the old hand-authored Approach aggression/style index from the ten non-Mentality dimensions. Approach now locks Mentality; other settings are driven by XI support and evidence-backed ties.

See `data/build_30527/index/tactics_semantics.json`.
