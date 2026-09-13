# Top Eleven Tool — Build 30527 Implementation Ledger

**Authoritative target:** `te_directapk_prod_30527.apk`  
**Architecture:** Android ARM64 / Unity IL2CPP / metadata v39  
**Rule:** No estimated or community-assumed game values. APK-confirmed, live-server-confirmed, and unresolved data remain separate.

## 1. Current companion build baseline

Baseline supplied by user: **v5.2.4**

### Must be replaced / corrected before next implementation pass

- Current role list still contains **DML / DMR**. Build 30527 uses the current 12-role model:
  `GK, DL, DC, DR, DMC, ML, MC, MR, AML, AMC, AMR, ST`.
- Current Add/Edit Player playstyle picker displays every playstyle regardless of player roles.
- Current Add/Edit Player special-ability picker displays every hard-coded special ability regardless of eligibility.
- Current special-ability list is stale:
  - contains `Shadow Striker`, which is not in the current build-30527 `PlayerSpecialAbility` enum;
  - omits multiple current build-30527 abilities.
- Current playstyle list offers `Ball Playing GK`; the current server PlaystyleDefinition gives it no eligible roles and the current Football Engine `PlaystyleName` enum omits it.
- Player data currently stores only a playstyle name and does not persist the build-30527 playstyle level/progress state.
- Current UI caps selected special abilities at two; build 30527's Player protocol exposes first, second, repeated, and third special-ability fields, so a hard two-slot model is incomplete.
- `formation.js` currently contains hand-authored adjacency and scoring weights. These are not game-authoritative.
- `recommendations.js` currently contains hand-authored tactic/mentor/player weighting. These are not game-authoritative.

No companion-app code should be modified until the replacement data contract below is complete enough.

---

## 2. Current roles — CONFIRMED

Current usable roles:

1. GK
2. DL
3. DC
4. DR
5. DMC
6. ML
7. MC
8. MR
9. AML
10. AMC
11. AMR
12. ST

Legacy/internal Football Engine enum values for DML/DMR still exist, but build 30527 has zero-sized pitch rectangles for them and the current communication `PlayerRole` enum does not expose them as current playable positions.

---

## 3. Exact pitch geometry — CONFIRMED APK

Internal pitch space is **0–1000 x 0–1000**.

| Role | X range | Y range |
|---|---:|---:|
| GK | 0–143 | 250–750 |
| DL | 179–393 | 0–250 |
| DC | 143–286 | 250–750 |
| DR | 179–393 | 750–1000 |
| DMC | 286–429 | 250–750 |
| ML | 393–607 | 0–250 |
| MC | 429–572 | 250–750 |
| MR | 393–607 | 750–1000 |
| AML | 607–821 | 0–250 |
| AMC | 572–715 | 250–750 |
| AMR | 607–821 | 750–1000 |
| ST | 715–858 | 250–750 |

The companion app should retain exact coordinates internally and display them graphically on a football pitch rather than showing raw coordinates to the user.

---

## 4. Player position suitability — CONFIRMED / PARTIAL

Build 30527 explicitly distinguishes:

- natural position
- related position
- wrong position

`PlayerStatus` includes `RelatedPosition` and `WrongPosition`.

Player protocol also exposes `Roles` and `RelatedRoles`.

**Implementation rule:** use the player's actual server-derived natural and related roles. Remove the current hand-authored adjacency map.

Exact server Lineup Balance is not required for the initial Pick Formation logic and is server-calculated.

---

## 5. Key / white attributes — CONFIRMED APK

The role → key-attribute map is game data, and multi-role players use the union of the key attributes of all their natural roles.

Current 12-role map:

- **GK:** Reflexes, Agility, Anticipation, Rushing Out, Communication, Throwing, Kicking, Punching, Aerial Reach, Concentration, Fitness
- **DL/DR:** Crossing, Tackling, Marking, Positioning, Bravery, Fitness, Aggression, Speed
- **DC:** Tackling, Marking, Positioning, Heading, Bravery, Fitness, Strength, Aggression
- **DMC:** Passing, Tackling, Marking, Positioning, Heading, Bravery, Fitness, Strength, Aggression, Creativity
- **ML/MR:** Passing, Dribbling, Crossing, Positioning, Fitness, Speed, Creativity
- **MC:** Passing, Dribbling, Shooting, Tackling, Marking, Positioning, Bravery, Fitness, Speed, Creativity
- **AML/AMR:** Passing, Dribbling, Crossing, Shooting, Finishing, Fitness, Speed, Creativity
- **AMC:** Passing, Dribbling, Shooting, Finishing, Heading, Fitness, Speed, Creativity
- **ST:** Passing, Dribbling, Shooting, Finishing, Positioning, Heading, Strength, Speed, Creativity

No unproven role-specific attribute weighting should be introduced yet.

---

## 6. Playstyle types — CONFIRMED APK

Communication IDs:

| ID | Playstyle |
|---:|---|
| 1 | No Playstyle |
| 2 | Poacher |
| 3 | False Nine |
| 4 | Target Man |
| 5 | Enganche |
| 6 | Inside Forward |
| 7 | Winger |
| 8 | False Winger |
| 9 | Mezzala |
| 10 | Box-to-Box |
| 11 | Regista |
| 12 | Ball Winner |
| 13 | Anchor Man |
| 14 | No-Nonsense DC |
| 15 | Stopper |
| 16 | Ball Playing DC |
| 17 | Full Back |
| 18 | Wing Back |
| 19 | Ball Playing GK |
| 20 | Sweeper Keeper |
| 21 | Box Commander |

`Ball Playing GK` still exists in the communication enum, but in the current build-30527 server definitions it has **no eligible roles**, and the current Football Engine `PlaystyleName` enum does not contain it. Do not offer it as a current selectable playstyle.

---

## 7. Current playstyle role eligibility — CONFIRMED LIVE SERVER + APK ARCHITECTURE

The current client uses server-provided `PlaystyleDefinition` records rather than a baked local switch table.

Current captured definitions:

| Playstyle | Eligible roles | Point family |
|---|---|---|
| Poacher | ST | Attacker |
| False Nine | ST, AMC | Attacker |
| Target Man | ST | Attacker |
| Enganche | AMC | Attacker |
| Inside Forward | AML, AMR | Attacker |
| Winger | AML, AMR, ML, MR | Attacker |
| False Winger | ML, MR | Midfielder |
| Mezzala | MC | Midfielder |
| Box-to-Box | MC | Midfielder |
| Regista | MC, DMC | Midfielder |
| Ball Winner | DMC | Midfielder |
| Anchor Man | DMC | Midfielder |
| No-Nonsense DC | DC | Defender |
| Stopper | DC | Defender |
| Ball Playing DC | DC | Defender |
| Full Back | DL, DR | Defender |
| Wing Back | DL, DR | Defender |
| Ball Playing GK | none in current definition | Defender |
| Sweeper Keeper | GK | Defender |
| Box Commander | GK | Defender |

**Implementation rule:** the Add/Edit Player playstyle choices should be the union of playstyles eligible for the player's actual roles. Do not show the universal list.

The game also checks playstyle adequacy against the player's current on-field role during formation/match UI logic.

---

## 8. Playstyle levels — CONFIRMED SCHEMA

Exact enum:

| ID | Level |
|---:|---|
| 0 | No Playstyle Level |
| 1 | Locked |
| 2 | Standard |
| 3 | Intermediate |
| 4 | Advanced |
| 5 | Master |

The current game calls the first active level **Standard**, not Basic.

`PlayerPlaystyle` contains:

1. PlaystyleType
2. Level
3. Points
4. IsTrainingNextLevel
5. NextLevelPrice
6. IsNextLevelAvailable
7. NextLevelProgress
8. Boost

`PlaystyleLevelDefinition` contains:

1. PlaystyleLevel
2. PointsForNextLevel
3. BoostersCostToStartNextLevel
4. ShouldNextLevelProgressBeStarted

### Still unresolved / runtime-owned

- current numerical level thresholds if supplied by `PlaystyleInfoBroadcast`
- exact match-engine magnitude gained at each playstyle level
- exact meaning/application of `PlayerPlaystyle.Boost`

The app should store these fields but must not invent level multipliers.

---

## 9. Current special-ability enum — CONFIRMED APK

| ID | Special ability |
|---:|---|
| 1 | Penalty Kick Stopper |
| 2 | One-on-One Stopper |
| 3 | Aerial Defender |
| 4 | Defensive Wall |
| 5 | Playmaker |
| 6 | One-on-One Scorer |
| 7 | Long Shots |
| 8 | Dribbler |
| 9 | Penalty Kick Specialist |
| 10 | Free Kick Specialist |
| 11 | Corner Specialist |
| 12 | Set Piece Taker |
| 13 | Versatile Attacker |
| 14 | Intercepting Specialist |
| 15 | Set Piece Stopper |
| 16 | Blocker |
| 17 | Rebound Specialist |
| 18 | Cross Expert |
| 19 | Counter Attack Stopper |

Current v5.2.4's `Shadow Striker` entry must be removed from the build-30527 list.

---

## 10. Special-ability eligibility — SERVER-RUNTIME / NOT YET COMPLETE

This is intentionally **not** being inferred from names or community knowledge.

Build 30527 uses:

`GetAvailableTrainingAbilitiesRequest`
- #1 PlayerId

`GetAvailableTrainingAbilitiesResponse`
- #1 PlayerAbility[]

The current `PlayerWrapper.GetAvailableSpecialAbilities` path requests this list from the official server for the specific player.

Therefore there is no justification yet for hard-coding a universal role → ability matrix.

There is an `EligibleSpecialAbilitiesAndPlaystylesForRole` message elsewhere in the build, but the currently traced consumer is tied to a specific Young Star/Album feature; it must not be promoted to the universal player rule without further proof.

### Required later capture

Use the official Special Ability training UI and capture the returned `GetAvailableTrainingAbilitiesResponse` for suitable players/roles. This should be done after the imminent match rather than delaying the match capture.

---

## 11. Player special-ability storage — CONFIRMED PROTOCOL

Current Player protobuf exposes:

- #14 SpecialAbility
- #52 SecondSpecialAbility
- #54 SpecialAbilities
- #58 ThirdSpecialAbility

Therefore v5.2.4's hard two-ability UI/storage assumption is incomplete.

Exact universal maximum/assignment rules should still be verified before enforcing a new cap.

---

## 12. Match-engine relevance — CONFIRMED ARCHITECTURE

Playstyles and special abilities are not merely cosmetic UI fields.

Football Engine / streaming structures include:

- `SpecialAbilityEvents`
- `PlaystyleTriggerDescriptors`
- `StreamingSpecialAbilityDescriptor`
- `StreamingPlaystyleTriggerDescriptor`
- `PlaystyleTriggerType`
- `PlaystyleOutcomeType`
- `PlayerData.PlaystyleData`
- `PlaystyleData.PlaystyleTriggers`

The engine has explicit trigger categories for shooting, heading, rebounds, through balls, crosses, passing, aerial/ground duels, feints, tackles, interceptions, blocks, goalkeeper actions, etc.

**Confirmed:** both systems participate in live-match engine/event state.

**Unresolved:** exact numerical strength/effect weighting and level scaling. Do not yet assign arbitrary player-selection bonuses to them.

---

## 13. Tactics — READY DATA

Already confirmed for build 30527:

- all 11 tactic enums and IDs
- APK default option → Low/Medium/High drain mapping
- `MinConditionDrain = 15`
- `NormalizeFactor = 100`
- Low contribution = 0
- Medium contribution = 5
- High contribution = 7
- medium threshold = 0.40
- high threshold = 0.65
- exact client calculation and override structure

This data is ready for later implementation.

---

## 14. Mentors — PARTIAL READY DATA

Confirmed:

- current mentor architecture
- assignment state
- mentor levels/progress schema
- Tactic / Stat / Signature boost families
- current live mentor IDs
- current boost IDs
- CurrentEffects / NextLevelEffects values from the user's legitimate capture
- mentor state is included in live-match snapshots

Still unresolved:

- exact semantics of multi-value signature arrays
- exact Football Engine consumer/magnitude for each mentor effect
- causal weighting for Pick Mentor

Do not use the existing hand-authored mentor scoring in v5.2.4 as authoritative.

---

## 15. Pick Formation — implementation principle

Target flow:

1. read full squad
2. use current 12 roles only
3. use each player's natural + server-provided related roles
4. use exact role → white/key attributes
5. include verified playstyle eligibility, actual playstyle and level
6. include actual special abilities once their effect/eligibility logic is sufficiently proven
7. assign the strongest XI/role arrangement using only evidence-backed factors
8. plot players visually on a game-matched pitch using internal 0–1000 coordinates
9. optionally display captured/server Lineup OVR/Balance as validation, not as an invented offline formula

No arbitrary `.55 OVR + .35 skills + 220 position bonus` model should survive the replacement.

---

## 16. Implementation status

### READY TO IMPLEMENT LATER
- 12 current roles
- exact pitch geometry
- natural/related/wrong-position data model
- exact white/key attributes
- current playstyle enum
- current playstyle role eligibility
- playstyle levels/schema
- current special-ability enum
- exact tactics/drain data
- mentor state/schema and captured current boost records

### NEEDS MORE STATIC TRACE / LIVE DATA
- special-ability eligibility by player/role
- exact special-ability Football Engine effects
- playstyle level numerical effect scaling
- playstyle trigger/effect strength
- mentor effect consumers/magnitudes
- joint formation/tactic/mentor causal weighting

### REMOVE / REPLACE FROM v5.2.4
- DML/DMR as current positions
- universal playstyle picker
- universal stale special-ability picker
- Shadow Striker
- current selectable Ball Playing GK
- hard two-special-ability assumption
- hand-authored formation adjacency/scoring
- hand-authored mentor/tactic recommendation weights

---

## 17. Working rule going forward

Every new reverse-engineering finding should be entered into one of:

- **APK-CONFIRMED**
- **LIVE-SERVER-CONFIRMED**
- **STRONG EVIDENCE**
- **UNRESOLVED**

Only the first two categories should be used as authoritative application logic unless explicitly labelled otherwise.
