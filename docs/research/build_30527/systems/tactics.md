# Tactics — Build 30527

## Proven architecture

Current client contains `TacticsConditionDrainRepo`, `TacticsConditionDrainService`, `TacticsConditionDrainSettings`, `TacticsConditionDrainSpec`, `ConditionDrainIntensity` and `TacticsDrainOverrides`.

Native addresses:
- `CalculateConditionDrain` — `0x44C21C4`
- `ResolveIntensity` — `0x44C2450`
- `ResolveTotalDrainIntensity` — `0x44C2498`

Exact **constructor/default** values (not automatically authoritative for a live 2027 session):
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

### Live-2027 calibration boundary

The current client can receive `TacticsConditionDrainSpec`/override state at runtime. Therefore the constructor/default map above proves the fallback algorithm and defaults, **not that the live service is still using those option intensities today**.

On 2026-09-15 the user performed a controlled UI drain-bar sweep. The observed relative ordering/cost steps are preserved in `docs/research/calibration/V0515_TACTICS_DRAIN_LIVE_RECALIBRATION.md` and `data/calibration/live_tactics_drain_observation_2026-09-15.json`. The most important direct contradiction is Tackling: live UI shows Stay On Feet cheapest, Balanced next, Aggressive highest, whereas the constructor/default map has Balanced Low, Aggressive Medium, Stay On Feet High.

Until the live Low→Medium and Medium→High transition anchors are measured, calibration may use the observed relative costs to rank condition expense under an unconstrained High budget, but must **not guess the current class thresholds**. Production fallback/default calculations remain separately identifiable as legacy/default evidence.

### Focus Passing display identity — live UI 2026-09-16

A current live Top Eleven screenshot supplied by the user proves the visible Focus Passing choices are **Left Flank, Right Flank, Both Flanks, Through the Middle, Balanced**. The current client/static enum still exposes `FocusPassingCenter`; therefore active companion logic keeps internal key `center` but maps its user-facing label to **Through the Middle**.

This is a display-identity correction only. It does not change lane scoring or condition-drain identity. See `docs/research/calibration/V0517_FOCUS_PASSING_LIVE_UI_LABEL.md`.

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

No authoritative numerical “best tactics for this XI” score has been recovered. The app's XI-fit recommendation is **COMPANION LOGIC** constrained by the best currently verified drain evidence and supported semantics.

v0.5.2 deliberately removed the old hand-authored Approach aggression/style index from the ten non-Mentality dimensions. Approach now locks Mentality; other settings are driven by XI support and evidence-backed ties.

See `data/build_30527/index/tactics_semantics.json`.
