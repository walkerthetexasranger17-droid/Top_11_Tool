# Top Eleven Tool — Decision Logic Bible v2

**Version:** v0.5.11  
**Status:** COMPANION LOGIC DATA CONTRACT  
**Purpose:** define the complete reasoning model before the final optimiser is wired to it.

## Evidence boundary

- Game/native data controls legality, white skills, tactic options, drain, Playstyle eligibility and Mentor effect identity.
- Community evidence influences ranking only where no private Nordeus best-value table exists.
- Every active bonus or penalty must have a human-readable explanation string.
- Hard gates are evaluated before soft scores.
- Best available plan today is separate from the squad blueprint/recruitment target.
- Locked Mentor boost families contribute exactly zero.
- Training only gives utility to actual white skills; grey skills never receive utility.

The numbers in this document are **transparent companion ranking weights**, not hidden Nordeus match-engine coefficients. Game/native evidence still owns legality, white skills, formation rectangles, tactic options, condition drain, Playstyle role eligibility and Mentor effect identities.

## Decision order

1. Generate and assign each candidate formation.
2. Reject illegal/unfieldable candidates.
3. Generate best tactics under drain ceiling for each formation.
4. Calculate core football-plan score from formation+tactics.
5. Discard tactically/structurally dominated plans outside the viable band.
6. Score each unlocked Mentor against each surviving plan with level gates.
7. Choose the highest complete plan; preserve top alternatives with different strategic identities.

Formation and Tactics form the core football plan at 50%/50%. Only plans within **10 points** of the best core plan survive to the Mentor pass. Mentor can then adjust the final choice by at most **10 companion points**.

## 1. Squad coverage / recruitment blueprint

Assign unique players to simultaneous core functional slots; a player may not fill two required slots at once. Versatility is reported separately.

| Functional slot | Natural role(s) | Preferred profiles | Useful Playstyles | Why it matters |
|---|---|---|---|---|
| Goalkeeper | GK | GK | — | A dedicated goalkeeper is non-substitutable. |
| Left defensive cover | DL | DL/DC, DL | Full Back, Wing Back | Keeps direct coverage against right-sided opposition threats and enables a back four. |
| Central defender | DC | DC | Stopper, No-Nonsense DC, Ball Playing DC | Core central-defence slot. |
| Second central defender | DC | DC, DC/DMC | Stopper, No-Nonsense DC, Ball Playing DC | Gives the minimum two-DC base used by resilient shapes. |
| Right defensive cover | DR | DC/DR, DR | Full Back, Wing Back | Keeps direct coverage against left-sided opposition threats and enables a back four. |
| Defensive midfield screen | DMC | DC/DMC, DMC/MC, DMC | Anchor Man, Ball Winner, Regista | Protects the central lane and gives direct structural cover against AMC-heavy shapes. |
| Central midfield connector | MC | DMC/MC, MC/AMC, MC | Regista, Box-to-Box, Mezzala | Links defence, buildup and attack and helps avoid midfield numerical deficits. |
| Left attacking progression | AML / ML | ML/AML, AML | Winger, Inside Forward, False Winger | Provides a natural left-side attacking route and lets the plan exploit narrow opponents. |
| Central creator / between-lines threat | AMC / MC | MC/AMC, AMC/ST, AMC | Enganche, False Nine, Mezzala | Creates central penetration, especially when an opponent lacks a DMC. |
| Right attacking progression | AMR / MR | MR/AMR, AMR | Winger, Inside Forward, False Winger | Provides a natural right-side attacking route and lets the plan exploit narrow opponents. |
| Primary forward | ST | AMC/ST, ST | Poacher, Target Man, False Nine | Provides a natural final-third outlet and scoring reference. |

The blueprint has three layers: **core XI coverage (70%)**, **formation flexibility (20%)**, and **availability/rotation depth (10%)**. Availability depth adds a reserve GK, defensive utility reserve, central-midfield reserve and attacking utility reserve. These players are matched only from players left after the core assignment, so a starter cannot also masquerade as bench depth.

### Flexibility/depth targets

- **Third centre-back option** — Unlocks three-centre-back systems without dismantling the rest of the squad. Preferred coverage: DC/DMC, DL/DC, DC/DR.
- **Second central midfielder** — Allows central overloads, double-pivot systems and safer rotation. Preferred coverage: DMC/MC, MC/AMC.
- **Alternative forward profile** — Gives a different route to goal when the starting forward profile does not suit the opponent. Preferred coverage: AMC/ST, ST.
- **Left mid/wing depth** — Keeps both advanced-width and midfield-width systems available. Preferred coverage: ML/AML.
- **Right mid/wing depth** — Keeps both advanced-width and midfield-width systems available. Preferred coverage: MR/AMR.

A functional slot is flagged **covered but weak** when its best assigned player is roughly 10 points or more below the current first-XI median in that assigned role. This is a companion threshold and remains configurable.

## 1A. Authoritative feature model

The v2 rules use named features such as `aerialOutlet`, `counterOutlet`, `pressCapacity` and `lineSpeed`. These are no longer informal shorthand. `decision_logic_v2.json` now contains the authoritative definitions used by future runtime wiring.

Key principles:

- `assigned_role_white_mean` is the mean of the current build-30527 white skills for the role actually assigned in that candidate XI.
- `xi_quality_median` is the median assigned-role white mean of the 11 starters and provides a squad-relative reference instead of a fixed OVR threshold.
- A **strong action cluster** must be at least the 67th percentile of eligible own players and cannot sit more than 10 points below the XI quality median. This stops a lone weak player becoming an automatic “outlet” simply because no alternative exists.
- `aerialOutlet` is an ST/AMC with Target Man or a strong Heading+Strength+Positioning cluster.
- `counterOutlet` is an advanced player with a strong Speed+Dribbling+Passing+Finishing+Positioning transition cluster, with limited Playstyle support for Poacher/Inside Forward.
- `directOutlet` requires a real aerial, strong ST hold-up or transition outlet.
- `technicalBuild`, `pressCapacity`, `lineSpeed` and `markerCapacity` are squad-relative low/medium/high clusters, not hidden match-engine ratings.
- `boxFinishing` and `longShotThreat` are current-player clusters; Shadow Striker stays a separate semantic modifier and never secretly inflates a skill number.
- Opponent attack profile/passing style, halftime weak zone, set-piece emphasis, card risk and match state are **explicit inputs**. Unknown stays unknown. The optimiser must not guess them.

Strength bands are now unambiguous: `<= -15 severe underdog`, `(-15,-5] underdog`, `(-5,5) even`, `[5,15) favourite`, `>=15 strong favourite`.

## 2. Formation candidate families

| Formation | Slots | Source / reason for inclusion |
|---|---|---|
| 4-1-1-3-1 | GK DL DC DC DR DMC MC AML AMC AMR ST | native-frontier-7 |
| 4-1-3-1-1 | GK DL DC DC DR DMC ML MC MR AMC ST | native-frontier-9 |
| 4-2-3-1 | GK DL DC DC DR DMC|MC DMC|MC AML AMC AMR ST | build-30527-template |
| 4-1-2-3 | GK DL DC DC DR DMC MC MC AML ST AMR | companion-family-from-frontier |
| 4-3-3 | GK DL DC DC DR MC MC MC AML ST AMR | build-30527-template |
| 4-1-4-1 | GK DL DC DC DR DMC ML MC MC MR ST | community-2026 |
| 4-4-2 | GK DL DC DC DR ML MC MC MR ST ST | build-30527-template |
| 4-1-2-1-2 | GK DL DC DC DR DMC MC MC AMC ST ST | build-30527-template |
| 3-1-4-1-1 | GK DC DC DC DMC ML MC MC MR AMC ST | community-2026 |
| 3-1-4-2 | GK DC DC DC DMC ML MC MC MR ST ST | companion-family |
| 3-5-2 | GK DC DC DC ML MC MC MC MR ST ST | build-30527-template |
| 3-1-2-1-3 | GK DC DC DC DMC MC MC AMC AML ST AMR | community-2026 |

Formation assignment is also explicit: use **11 unique players** and only roles currently listed for that player. Multi-role players may fill one slot, never two. If no curated family can be fielded naturally, generate legal shapes from the squad natural-role pool and score those with the same model. Curated formations are candidates, not a whitelist. Wrong-position emergency use is outside the normal optimiser and must be surfaced as a warning if the manager ever enables it.

Formation scoring is intentionally not just average player quality. The v2 component budget is:

- **Lineup Quality — 32 points**
- **Playstyle/Assigned-Role Fit — 8 points**
- **Weak Link — 10 points**
- **Core Structure — 20 points**
- **Opponent Matchup — 25 points**
- **Formation Flexibility — 5 points**

### High-impact formation rules

- `F-BASE-DC2` — high — own.centralDef >= 2 → 5
- `F-BASE-NODC2` — high — own.centralDef < 2 → -12
- `F-BASE-DMC` — high — own.hasDMC → 3
- `F-BASE-CMID` — high — own.centralMid → {'0': -10, '1': -6, '2': 1, '3': 4, '4': 5}
- `F-BASE-WIDTH` — medium-high — own.hasLeftProgression && own.hasRightProgression → 2
- `F-OPP-AMC` — high — opp.hasAMC && own.hasDMC → 8
- `F-OPP-AMC-GAP` — high — opp.hasAMC && !own.hasDMC → -10
- `F-OPP-LW` — high — opp.leftThreat && own.hasRightDef → 6
- `F-OPP-LW-GAP` — high — opp.leftThreat && !own.hasRightDef → -8
- `F-OPP-RW` — high — opp.rightThreat && own.hasLeftDef → 6
- `F-OPP-RW-GAP` — high — opp.rightThreat && !own.hasLeftDef → -8
- `F-MID-PARITY` — high — midfieldDelta → [{'min': 1, 'points': 5, 'message': 'formation.midfield_edge'}, {'min': 0, 'points': 3, 'message': 'formation.midfield_parity'}, {'min': -1, 'points': -2, 'message': 'formation.midfield_small_deficit'}, {'max': -2, 'points': -8, 'message': 'formation.midfield_large_deficit'}]
- `F-EXPLOIT-NODMC` — high — !opp.hasDMC && own.hasAMC → 6
- `F-EXPLOIT-NARROW` — high — opp.narrow && own.hasLeftProgression && own.hasRightProgression → 6
- `F-EXPLOIT-NODL` — medium-high — !opp.hasLeftDef && own.hasRightProgression → 4
- `F-EXPLOIT-NODR` — medium-high — !opp.hasRightDef && own.hasLeftProgression → 4
- `F-OPP-2ST` — medium-high — opp.strikers >= 2 → conditional
- `F-UNDERDOG-REST` — medium-high — strength.band in [underdog,severe_underdog] && own.restDefense >= 5 → 4
- `F-UNDERDOG-THIN` — medium-high — strength.band in [underdog,severe_underdog] && own.restDefense <= 3 → -5
- `F-NOST` — medium — own.strikers == 0 && own.advancedScorers < 2 → -5

Relative strength changes the *importance* of defence/midfield/exploitation rather than selecting a formation by itself. Underdogs emphasise coverage/rest-defence; favourites can spend more structural budget attacking exposed lanes.

## 3. Tactics

Enumerate legal 11-dimension tactic combinations under the chosen drain ceiling; score lineup fit + structural context + coherence + Playstyle/SA semantic fit + drain efficiency.

- **Native Lineup Fit — 32 points**
- **Opponent And Structure — 26 points**
- **Internal Coherence — 18 points**
- **Playstyle And Sa Fit — 14 points**
- **Drain Efficiency — 10 points**

The exact recovered condition-drain calculation remains authoritative. Drain is first a hard ceiling chosen by the manager, then a secondary efficiency preference inside that ceiling.

### Context rule library

The current v2 contract contains **64 tactic rules** across all 11 dimensions. Neutral/default options are first-class candidates: lack of a specialist bonus does not make an option bad. Mixed passing, Balanced focus/shooting, Medium crossing, Mid Press and Track Opponent receive small fallback support when the squad/opponent evidence for either extreme is weak.

Component normalisation is explicit: XI fit maps to 0–32; opponent/structure is centred at neutral and maps to 0–26; coherence is centred and maps to 0–18; Playstyle/SA semantics are centred and map to 0–14; drain contributes 0–10 only **after** the hard drain ceiling has been satisfied. Ties prefer fewer contradictions, then lower drain, then the more neutral/stable option.


- `T-MENT-EVEN` — **mentality = normal** — +3 when `strength.band == even` (high).
- `T-MENT-UNDER` — **mentality = defending** — +5 when `strength.band == underdog` (medium-high).
- `T-MENT-SEVERE` — **mentality = hardDefending** — +4 when `strength.band == severe_underdog` (medium).
- `T-MENT-FAV` — **mentality = attacking** — +4 when `strength.band == favourite` (medium-high).
- `T-MENT-HARDATTACK` — **mentality = hardAttacking** — -4 when `phase == prematch && strength.band != strong_favourite` (medium-high).
- `T-PASS-SHORT-SUPPORT` — **passing = short** — +4 when `own.centralSupport >= 3` (medium-high).
- `T-PASS-SHORT-BUILD` — **passing = short** — +4 when `values.won == buildup` (high).
- `T-PASS-LONG-COUNTER` — **passing = long** — +4 when `values.won == counter` (high).
- `T-PASS-LONG-CONGEST` — **passing = long** — +3 when `opp.centralHeavy && own.directOutlet` (medium-high).
- `T-PASS-LONG-NOOUTLET` — **passing = long** — -4 when `!own.directOutlet` (medium).
- `T-FOCUS-CENTER` — **focus = center** — +6 when `opp.exists && !opp.hasDMC && own.hasAMC` (high).
- `T-FOCUS-BOTH` — **focus = both** — +6 when `opp.narrow && own.hasLeftProgression && own.hasRightProgression` (high).
- `T-FOCUS-LEFT` — **focus = left** — +4 when `opp.exists && !opp.hasRightDef && own.hasLeftProgression` (medium-high).
- `T-FOCUS-RIGHT` — **focus = right** — +4 when `opp.exists && !opp.hasLeftDef && own.hasRightProgression` (medium-high).
- `T-FOCUS-LANE-GAP-L` — **focus = left** — -6 when `!own.hasLeftProgression` (high).
- `T-FOCUS-LANE-GAP-R` — **focus = right** — -6 when `!own.hasRightProgression` (high).
- `T-FOCUS-LANE-GAP-B` — **focus = both** — -5 when `!(own.hasLeftProgression && own.hasRightProgression)` (high).
- `T-CROSS-HIGH-TM` — **cross = high** — +6 when `playstyles.TargetMan > 0 && own.aerialOutlet` (high).
- `T-CROSS-WINGER` — **cross = medium** — +3 when `playstyles.Winger > 0` (medium-high).
- `T-CROSS-HIGH-WINGER` — **cross = high** — +2 when `playstyles.Winger > 0 && own.aerialOutlet` (medium-high).
- `T-CROSS-HIGH-NOTARGET` — **cross = high** — -5 when `!own.aerialOutlet` (medium-high).
- `T-WON-COUNTER-WEAKER` — **won = counter** — +6 when `strength.band in [underdog,severe_underdog]` (medium-high).
- `T-WON-COUNTER-OUTLET` — **won = counter** — +4 when `own.counterOutlet` (medium-high).
- `T-WON-BUILD-FAV` — **won = buildup** — +3 when `strength.band in [favourite,strong_favourite]` (medium).
- `T-LOST-REGROUP-LOW` — **lost = regroup** — +5 when `values.pressing == low` (high).
- `T-LOST-CP-HIGH` — **lost = counterPress** — +5 when `values.pressing == high` (high).
- `T-LOST-CP-FIT` — **lost = counterPress** — +2 when `own.pressCapacity >= high` (medium).
- `T-PRESS-LOW-UNDER` — **pressing = low** — +4 when `strength.band in [underdog,severe_underdog]` (medium-high).
- `T-PRESS-HIGH-FAV` — **pressing = high** — +3 when `strength.band in [favourite,strong_favourite] && own.pressCapacity >= medium` (medium).
- `T-OFFSIDE-HIGH` — **backLine = offside** — +4 when `values.pressing == high` (medium-high).
- `T-OFFSIDE-SWEEPER` — **backLine = offside** — +2 when `playstyles.SweeperKeeper > 0` (medium).
- `T-OFFSIDE-LOW` — **backLine = offside** — -10 when `values.pressing == low` (high).
- `T-TRACK-LOW` — **backLine = track** — +4 when `values.pressing == low || values.lost == regroup` (medium-high).
- `T-MARK-ZONAL-DEFAULT` — **marking = zonal** — +2 when `opponentAttack == unknown` (medium-high).
- `T-MARK-MAN-FAST` — **marking = man** — +4 when `opponentAttack == fast` (game-authored).
- `T-MARK-ZONAL-LONG` — **marking = zonal** — +4 when `opponentAttack == longDistance` (game-authored).
- `T-TACKLE-BAL` — **tackling = balanced** — +2 when `true` (medium-high).
- `T-TACKLE-AGG-DISRUPT` — **tackling = aggressive** — +2 when `playstyles.BallWinner > 0 || playstyles.Stopper > 0` (medium).
- `T-TACKLE-STAY-LEAD` — **tackling = stay** — +3 when `matchState == leading` (medium).
- `T-SHOOT-SIGHT-SA` — **shooting = sight** — +4 when `abilities.ShadowStriker > 0` (medium-high).
- `T-SHOOT-BOX-FINISH` — **shooting = box** — +3 when `own.boxFinishing > own.longShotThreat` (medium).
- `T-SHOOT-SIGHT-THREAT` — **shooting = sight** — +3 when `own.longShotThreat > own.boxFinishing + margin` (medium).

### Playstyle → tactic affinities

- **Poacher:** shooting=box/balanced (+2); focus=center/balanced (+1)
- **False Nine:** passing=short (+3); won=buildup (+2); focus=center/balanced (+2); cross=low/medium (+1); passing=long (-1)
- **Target Man:** passing=long/mixed (+3); cross=high (+4); focus=left/right/both (+2); cross=low (-2)
- **Enganche:** passing=short (+3); won=buildup (+2); focus=center (+2)
- **Inside Forward:** shooting=box/balanced (+2); focus=center/balanced (+1); passing=short/mixed (+1)
- **Winger:** focus=left/right/both (+3); cross=medium/high (+3)
- **False Winger:** passing=short (+2); won=buildup (+2); focus=center/balanced (+1)
- **Mezzala:** passing=short/mixed (+2); won=buildup (+1); lost=counterPress (+1)
- **Box-to-Box:** pressing=mid/high (+2); lost=counterPress (+2)
- **Regista:** passing=short (+3); won=buildup (+2); focus=center/balanced (+1)
- **Ball Winner:** lost=counterPress (+3); pressing=mid/high (+2); tackling=balanced/aggressive (+1)
- **Anchor Man:** pressing=low/mid (+2); lost=regroup (+2); backLine=track (+1)
- **No-Nonsense DC:** pressing=low/mid (+1); lost=regroup (+1); backLine=track (+1)
- **Stopper:** tackling=balanced/aggressive (+2); marking=man/zonal (+1)
- **Ball Playing DC:** passing=short (+2); won=buildup (+2)
- **Full Back:** backLine=track (+1); marking=zonal (+1)
- **Wing Back:** focus=left/right/both (+2); cross=medium/high (+2); pressing=mid/high (+1)
- **Sweeper Keeper:** pressing=high (+2); backLine=offside (+2)
- **Box Commander:** pressing=low/mid (+2); backLine=track (+2); marking=zonal (+1)

Special Abilities remain deliberately low-impact. Only Playmaker, Shadow Striker and Cross Expert currently have active semantic tactic modifiers; unresolved abilities stay in the data with `active=false` so the optimiser cannot quietly invent effects.

## 4. Mentors

All Mentors are manual user state. Every family is level-gated independently: **Tactical L1, Attribute L5, Signature L10**. Locked family = exactly zero recommendation contribution.

| Mentor | Tactical relevance | Attribute pair | Signature context | Important trade-off |
|---|---|---|---|---|
| Rubén Herrera | `values.won == counter` | Creativity, Passing | `values.won == counter` | — |
| Lewis Green | `values.focus in [left,right,both]` | Crossing, Heading | `values.focus in [left,right,both] && values.cross in [medium,high] && own.aerialOutlet` | — |
| Jonas Braun | `values.passing == long` | Strength, Positioning | `phase == halftime && weakZoneKnown` | — |
| Cesc Fàbregas | `values.passing == short` | Dribbling, Shooting | `values.passing == short && values.won == buildup` | mentor.cesc.stamina_tradeoff |
| Alan Shearer | `dribbleReliance` | Strength, Shooting | `setPieceEmphasis` | — |
| Nemanja Vidić | `defensiveActionDemand` | Tackling, Bravery | `defensiveActionDemand` | mentor.vidic.condition_tradeoff; mentor.vidic.card_tradeoff |
| Claude Makélélé | `opponentPassing == Short` | Bravery, Positioning | `matchState == leading` | mentor.makelele.attack_tradeoff |

Mentor state itself is manual: missing/Level 0 = unavailable. The optimiser never assumes an owned or levelled Mentor. Tactical, Attribute and Signature are evaluated independently at L1/L5/L10.

The Attribute-family score is no longer a raw player count. For the two boosted attributes, sum the role-hierarchy tier weight only where the attribute is white for that starter in the assigned role, apply active tactic-context modifiers, then map the raw relevance to the 0–25 family budget. Grey occurrences contribute zero relevance. Signature context that is live-only/unknown receives zero prematch points rather than a guessed partial score.

Mentor scoring is absolute rather than normalised over only unlocked families: Tactical max 40, Attribute max 25, Signature max 30, with trade-off penalties. Therefore a Level-1 Mentor cannot look artificially equal to a Level-10 Mentor simply because its only unlocked family happens to fit perfectly.

Prestige is tracked as stronger Signature state, but no extra companion points are invented merely for Prestige level unless real `CurrentEffects[]` values are available.

## 5. Training hierarchy

Pipeline: **development role → role-specific Playstyle profile → actual white-skill union → tactic context → current deficiency → drill strength → session diversity**.

### Base role profiles

- **GK** — S: Reflexes, Agility, Anticipation, Concentration; A: Rushing Out, Communication, Aerial Reach; B: Throwing, Kicking, Punching, Fitness; C: —.
- **DL** — S: Tackling, Marking, Positioning, Speed; A: Crossing, Fitness, Bravery; B: Aggression; C: —.
- **DC** — S: Tackling, Marking, Positioning, Heading; A: Strength, Bravery, Fitness; B: Aggression; C: —.
- **DR** — S: Tackling, Marking, Positioning, Speed; A: Crossing, Fitness, Bravery; B: Aggression; C: —.
- **DMC** — S: Positioning, Marking, Tackling, Passing; A: Bravery, Strength, Creativity, Fitness; B: Heading, Aggression; C: —.
- **ML** — S: Passing, Crossing, Dribbling, Speed; A: Positioning, Creativity, Fitness; B: —; C: —.
- **MC** — S: Passing, Positioning, Creativity, Fitness; A: Dribbling, Speed, Tackling, Marking; B: Shooting, Bravery; C: —.
- **MR** — S: Passing, Crossing, Dribbling, Speed; A: Positioning, Creativity, Fitness; B: —; C: —.
- **AML** — S: Dribbling, Speed, Passing, Crossing; A: Shooting, Finishing, Creativity; B: Fitness; C: —.
- **AMC** — S: Passing, Creativity, Dribbling; A: Shooting, Finishing, Speed; B: Heading, Fitness; C: —.
- **AMR** — S: Dribbling, Speed, Passing, Crossing; A: Shooting, Finishing, Creativity; B: Fitness; C: —.
- **ST** — S: Shooting, Finishing, Positioning; A: Speed, Dribbling, Strength, Heading; B: Passing, Creativity; C: —.

### Role-specific Playstyle profiles

- **Poacher · ST** — S: Shooting, Finishing, Positioning, Speed; A: Dribbling, Creativity; B: Passing, Heading, Strength; C: —.
- **False Nine · ST** — S: Passing, Dribbling, Creativity; A: Positioning, Shooting, Finishing, Speed; B: Heading, Strength; C: —.
- **False Nine · AMC** — S: Passing, Creativity, Dribbling; A: Shooting, Finishing, Speed; B: Heading, Fitness; C: —.
- **Target Man · ST** — S: Heading, Strength, Positioning, Finishing; A: Shooting, Passing, Creativity; B: Dribbling, Speed; C: —.
- **Enganche · AMC** — S: Passing, Creativity, Dribbling; A: Shooting, Finishing; B: Speed, Heading, Fitness; C: —.
- **Inside Forward · AML** — S: Dribbling, Speed, Shooting, Finishing; A: Passing, Creativity; B: Crossing, Fitness; C: —.
- **Inside Forward · AMR** — S: Dribbling, Speed, Shooting, Finishing; A: Passing, Creativity; B: Crossing, Fitness; C: —.
- **Winger · AML** — S: Crossing, Speed, Dribbling, Passing; A: Creativity, Shooting, Finishing; B: Fitness; C: —.
- **Winger · AMR** — S: Crossing, Speed, Dribbling, Passing; A: Creativity, Shooting, Finishing; B: Fitness; C: —.
- **Winger · ML** — S: Crossing, Speed, Dribbling, Passing; A: Positioning, Creativity, Fitness; B: —; C: —.
- **Winger · MR** — S: Crossing, Speed, Dribbling, Passing; A: Positioning, Creativity, Fitness; B: —; C: —.
- **False Winger · ML** — S: Passing, Creativity, Dribbling, Positioning; A: Speed, Fitness, Crossing; B: —; C: —.
- **False Winger · MR** — S: Passing, Creativity, Dribbling, Positioning; A: Speed, Fitness, Crossing; B: —; C: —.
- **Mezzala · MC** — S: Passing, Dribbling, Creativity, Speed; A: Positioning, Shooting, Fitness; B: Tackling, Marking, Bravery; C: —.
- **Box-to-Box · MC** — S: Fitness, Positioning, Passing, Speed; A: Tackling, Marking, Dribbling, Shooting, Bravery; B: Creativity; C: —.
- **Regista · MC** — S: Passing, Creativity, Positioning; A: Dribbling, Fitness, Marking, Speed; B: Tackling, Shooting, Bravery; C: —.
- **Regista · DMC** — S: Passing, Creativity, Positioning; A: Marking, Fitness, Strength; B: Tackling, Bravery, Heading, Aggression; C: —.
- **Ball Winner · DMC** — S: Tackling, Marking, Positioning, Bravery, Aggression; A: Fitness, Strength, Passing; B: Heading, Creativity; C: —.
- **Anchor Man · DMC** — S: Positioning, Marking, Tackling, Strength; A: Heading, Bravery, Fitness; B: Passing, Aggression, Creativity; C: —.
- **No-Nonsense DC · DC** — S: Tackling, Marking, Heading, Strength, Bravery; A: Positioning, Fitness; B: Aggression; C: —.
- **Stopper · DC** — S: Tackling, Marking, Bravery, Aggression, Strength; A: Positioning, Heading, Fitness; B: —; C: —.
- **Ball Playing DC · DC** — S: Positioning, Marking, Tackling; A: Strength, Heading, Fitness; B: Bravery, Aggression; C: —. Latent if made white by another natural role: Passing, Creativity.
- **Full Back · DL** — S: Marking, Tackling, Positioning, Speed; A: Fitness, Bravery; B: Crossing, Aggression; C: —.
- **Full Back · DR** — S: Marking, Tackling, Positioning, Speed; A: Fitness, Bravery; B: Crossing, Aggression; C: —.
- **Wing Back · DL** — S: Crossing, Speed, Fitness, Positioning; A: Tackling, Marking, Bravery; B: Aggression; C: —.
- **Wing Back · DR** — S: Crossing, Speed, Fitness, Positioning; A: Tackling, Marking, Bravery; B: Aggression; C: —.
- **Sweeper Keeper · GK** — S: Rushing Out, Anticipation, Kicking, Agility; A: Reflexes, Concentration, Communication, Fitness; B: Aerial Reach, Throwing, Punching; C: —.
- **Box Commander · GK** — S: Aerial Reach, Communication, Punching, Concentration; A: Reflexes, Anticipation, Agility, Rushing Out; B: Throwing, Kicking, Fitness; C: —.

The training contract now includes **21 tactic-context modifiers** (short/long distribution, buildup/counter, flank/central routes, high/low crossing, counter-press/regroup, high press/low block, offside/marking/tackling and shooting style). These are deliberately capped: tactic context may add at most +20% to the hierarchy weight and active SA context at most +8%. Role + Playstyle therefore remain the player identity; today’s tactic can tune development without completely redefining the player.

A Playstyle profile **replaces the generic role tier order for that development role**. It is not `max(role, Playstyle)` anymore. This is what allows Target Man, False Nine and Poacher STs to develop differently.

The Playstyle profile activates at Standard/Intermediate/Advanced/Master. Locked/no-level Playstyles use the base role hierarchy. The Playstyle level itself does not further multiply training priority because no reliable evidence supports such a coefficient.

### Deficiency and drill selection

Weighted need: `max(1, reference - current + 1) * hierarchy_weight * context_multiplier`. The reference is the mean of current top three trainable white skills. Grey utility is **0**.

Drill strength stays game-derived: `XP per player × (1 + Training Effect %)`. The session adds a small first-coverage bonus for new S/A attributes and a repeat penalty so one high-scoring drill does not spam all six slots when useful alternatives exist. Master/Campus drills remain hard-limited by owned stock.

## 6. Strings / explainability

The runtime string catalogue currently contains **158 explanation templates**. Every active score rule is required by test to reference a valid string. This is intentional: the app must be able to say *why* it chose a formation/tactic/Mentor/training priority rather than show an unexplained score.

## Implementation boundary for v0.5.11

This file is the **authoritative v2 logic contract**. It is intentionally more complete than the old v0.5.10 runtime scorer. The next wiring pass should make Formation/Tactics/Mentor/Training consume this contract directly rather than duplicating hand-written numbers in each engine. Until that wiring is complete, no UI should claim the v2 score is active.
