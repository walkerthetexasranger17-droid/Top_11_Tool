# TOP ELEVEN TOOL BIBLE — BUILD 30527

**Document version:** 1.1 — provenance-audited correction  
**Companion baseline inspected:** v5.2.4  
**Game target:** Top Eleven build 30527 / Unity IL2CPP metadata v39  
**Purpose:** one implementation source of truth for the next app build.

> **Coding-AI instruction:** Treat this file as the implementation contract. Do not silently substitute community knowledge, football intuition, or guessed Nordeus formulas. Where this document says GAME FACT or LIVE FACT, preserve it. Where it says COMPANION LOGIC, implement the exact transparent rule described here. Where it says UNRESOLVED, do not manufacture a value.

> **v1.1 audit correction (2026-09-10):** A full provenance recheck against the recovered direct-binary conversation and implementation evidence found that v1.0 attached the wrong numeric protocol IDs to the three Tackling labels. Direct build-30527 evidence gives `Balanced=0`, `Stay On Feet=1`, `Aggressive=2`. The recovered drain intensities/contributions by label were already correct and are unchanged: Balanced=Low/0, Stay On Feet=High/7, Aggressive=Medium/5. Native `TacticsDrainOverrides` values are nullable `ConditionDrainIntensity` enums (`Low=0`, `Medium=1`, `High=2`) and must be resolved to contribution values 0/5/7.

## 0. The four evidence classes

Every constant, mapping, formula and recommendation rule must belong to one of these classes:

1. **GAME FACT — APK/NATIVE CONFIRMED:** shipped client code, metadata, enums, assets or exact native arithmetic. Safe to use as authoritative build-30527 game data.
2. **LIVE FACT — OFFICIAL CLIENT CONFIRMED:** data observed in the user’s own official client/server traffic or runtime objects. Safe to use as authoritative for that captured state.
3. **COMPANION LOGIC:** our own deliberately transparent calculation that turns known game data into recommendations. It must never be described as Nordeus’s hidden formula.
4. **UNRESOLVED PRIVATE SERVER LOGIC:** not present in the shipped client and not legitimately retrievable. Never fabricate it and never block the app waiting for it.

**Research freeze rule:** core research is complete enough to implement. Only resume targeted research if a specific missing fact prevents a feature from working. Do not reopen broad Squad Balance, match-engine, mentor-causality or private-backend investigations.

## 1. Product definition and final information architecture

The app is a decision tool, not a reverse-engineering dashboard. Its four jobs are: maintain an accurate squad; build the best evidence-backed team plan; optimise individual/team training; and explain every recommendation.

### 1.1 Final top-level navigation

```text
Home | Squad | Team Plan | Training | More
```

### 1.2 Required flow

```text
SQUAD
  ├─ Roster
  ├─ Add / Scan Player
  └─ Player Profile
       └─ Train This Player

TEAM PLAN
  ├─ Inputs: Approach + Drain Limit + Best XI/Match Ready XI
  ├─ Formation: template + globally optimised XI + exact X/Y pitch
  ├─ Tactics: all 11 settings + exact drain class + reasons
  ├─ Mentor: best synergy + alternatives + raw confirmed effects
  └─ Optional Specialists summary

TRAINING
  ├─ Individual
  └─ Team
       └─ My Drills / stock management

MORE
  ├─ Add / Scan Player
  ├─ My Drills
  ├─ Specialists / Playmakers if not embedded in Team Plan
  └─ Settings
```

### 1.3 Dependency/recalculation graph

```text
Squad or player-data change ──> Formation ──> Tactics ──> Mentor
Formation/template change    ───────────────> Tactics ──> Mentor
Approach/drain change        ───────────────────────────> Tactics ──> Mentor
Training settings change     ──> Training only
```
Changing Attacking→Balanced must not reshuffle the XI unless the user explicitly asks to rebuild the formation.

## 2. v5.2.4 — what exists today, what survives, what is replaced

**Existing pages:** Dashboard/Home, Squad, Player Profile, Add Player, Training, My Drills, Team Training, Formation, Tactics, Playmakers, Settings.


| Area | Action | Implementation rule |
| --- | --- | --- |
| PWA shell/theme/assets | Keep | Preserve service worker, manifest, icons, mentor/drill/scene assets and visual theme unless UI restructuring requires local changes. |
| localStorage `te:` persistence | Keep + migrate | Preserve existing player/drill data; add versioned migrations, never destructive reset. |
| Player CRUD / stable keys | Keep | Existing `player:<slug>_<timestamp>` strategy is usable. |
| Scanner v2 | Keep + current-role cleanup | Retain calibrated recognition/regression fixtures; remove DML/DMR from accepted current roles and extend fields rather than rewriting scanner unnecessarily. |
| Individual training v5.2.4 | Replace scoring/search only | Preserve authoritative drill data, stock, UI flow; replace max-target greedy selection with final Bible model. |
| Team training v5.2.4 | Replace scoring/search | Use actual selected players and their white skills, not a flattened role-group skill set. |
| Formation page/engine | Merge into Team Plan + replace engine | Delete hand adjacency and invented position/OVR weights; global assignment + real role rectangles. |
| Tactics page | Merge into Team Plan + replace engine | Delete three hard-coded presets; exhaustive 11-dimensional search under exact drain constraint. |
| Mentor section | Merge into Team Plan + replace scoring | Use live mentor effects + transparent synergy tuple; retain mentor portraits/display names. |
| Playmakers/specialists | Retain as optional feature, relabel companion heuristic | Do not present specialist/captain formulas as game formulas. |
| DML / DMR UI/data | Remove as current positions | Legacy FE enum only; current role rectangles are zero-sized and communication role enum omits them. |
| Universal playstyle picker | Replace | Filter by current captured PlaystyleDefinition role eligibility. |
| Universal stale SA picker | Replace semantics | Use current 19-item enum; do not falsely claim a universal role eligibility matrix. |
| Two-SA limit | Remove | Protocol supports first, second, repeated, third fields; normalized model uses an array. |

### 2.1 Exact legacy formation logic to delete

`js/formation.js` currently uses hand-authored adjacency and a greedy score. The old behaviour is recorded only so the creator knows what must disappear:

```text
positionFit: exact natural=1.00; hand adjacency=0.25; other=0.02
posBonus: primary exact=220; other natural=195; adjacency=18; wrong=-40
playerSlotScore = posBonus + fit * (OVR*0.55 + slotSkill*0.35)
assignment = greedy
```
These values are **not game-authoritative and must not survive** the replacement.

### 2.2 Exact legacy recommendation logic to delete/reclassify

`js/recommendations.js` currently has three tactic presets and hand mentor weights. Those are superseded by the Team Plan engines below. Existing specialist formulas (penalty/corner/free-kick/captain) are companion heuristics only; retain only if visibly labelled as such or replace with the simpler specialist rules in §18.

### 2.3 Exact v5.2.4 algorithm inventory — migration/reference only

The following is the **actual inspected source state** of v5.2.4. It is retained here so a coding AI can distinguish what must be preserved from what must be replaced. None of the hand-authored scores below becomes a game fact merely because it exists in the old app.

**Current navigation/UI:** bottom nav is `Home | Squad | Training | Tactics | More`. More contains Add Player, My Drills, Team Drills, Formation, Playmakers and Settings. Formation and Tactics are currently separate pages; the new architecture merges Formation + Tactics + Mentor into Team Plan.

**Current individual training model (`build_30527-white-coverage-v2`):**

```text
roles are truncated to max 3
white = union of white skills for saved roles
target = max(current white skill)
need[a] = max(1, target-current[a]+1)
normal strength = XP * (1 + levelEffect/100)
master strength = XP * (1 + additionalEffect/100)
score = strength * sum(adjustedNeed for EVERY white attribute the drill hits)
grey attributes = zero value and zero dilution
after selection: sessionCredit[a] += strength for every white skill hit
selection = greedy, one slot at a time
tie = more white coverage -> more new white hits -> lower condition -> catalogue order
normal duplicates unlimited; Master duplicates stock-limited
```

This is a useful baseline and correctly implements the important **multi-white coverage** principle, but the final Bible model changes `target=max` to `mean(top 3)` and replaces greedy selection with beam search.

**Current team-training model:**

```text
keySet = flattened union of POSITION_WHITE for the configured role group
strength = XP * (1 + levelEffect/100)
base = strength * keyHits / allDrillSkills
slot score = base + newHits*2.5 - repeatedSameDrill*0.5
selection = greedy for 6 slots
normal drills only; TeamPlayTrainingDrill intentionally separate
```

Current v5.2.4 role groups are `GK & Defence = GK/DL/DC/DR/DML/DMR`; `Defensive Midfield & Midfield = DML/DMR/DMC/ML/MC/MR`; `Attacking Midfield & Striking = AML/AMC/AMR/ST`; `All = all 14 old roles`. These are replaced by the current 12-role groups in §16.

**Current Formation score to delete:**

```text
positionFit exact=1.00, hand-adjacent=0.25, other=0.02
posBonus primary exact=220, other natural=195, adjacent=18, wrong=-40
slotSkill = mean white skills for the slot
score = posBonus + fit * (OVR*0.55 + slotSkill*0.35)
assignment = greedy, scarce slots first
formation ranking = exact assignments first, then total score
```

**Current five Formation layouts:** 4-4-2, 4-3-3, 4-2-3-1, 3-5-2 and 4-1-2-1-2. v5.2.4 stores hand-authored CSS percentage coordinates; the new engine keeps these five role shapes initially but discards their CSS coordinates and regenerates exact 0–1000 X/Y positions.

**Current hard-coded tactic presets to delete:**

```text
Defending:
  Shooting Balanced; Passing Mixed; Focus Balanced; Crossing Medium;
  Lost Regroup; Won Focus on Buildup; Mentality Defending; Zonal; Mid Press;
  Back Line label "Balanced"; Stay on Feet.

Balanced:
  Shooting Balanced; Passing Mixed; Focus Balanced; Crossing Medium;
  Lost Counter Press; Won Focus on Buildup; Mentality Normal; Zonal; Mid Press;
  Back Line label "Balanced"; Tackling Balanced.

Attacking:
  Shooting Work it into the Box; Passing Short;
  Focus Both Flanks if >=2 wide-role counts else Through the Middle;
  Crossing High if old cross metric >=110 else Medium; Counter Press; Counter Attack;
  Mentality Attacking; Zonal; High Press; Set Offside Trap; Aggressive.
```

These labels are partly inconsistent with the current build-30527 enum (`Balanced` is not a Back Line option; `Through the Middle` maps conceptually to Center; `Counter Attack` maps to Force Counter Attack). The exhaustive current-enum engine replaces the entire preset block.

**Current specialist scores (companion-only legacy):**

```text
Penalty = Finishing*0.62 + Shooting*0.20 + Creativity*0.08 + OVR*0.10 + 20 if PK Specialist
Corner  = Crossing*0.62 + Passing*0.20 + Creativity*0.10 + OVR*0.08 + 20 if Corner Specialist
FreeKick= Shooting*0.62 + Finishing*0.14 + Passing*0.14 + Creativity*0.06 + OVR*0.04 + 20 if FK Specialist
Captain = OVR*0.58 + broadNineSkillMean*0.30 + ageExperience*0.12
ageExperience = min(24, max(0, age-19)*1.15)
```

The new Bible does not claim these are game formulas. §18 gives the preferred simpler, explainable replacement.

**Current hard-coded data that must be migrated:** current position order contains 14 roles including DML/DMR; current SA list has only 11 entries and includes stale Shadow Striker; current Playstyle list includes Ball Playing GK as universally selectable; player cleaning truncates roles to 3 and special abilities to 2.

## 3. Canonical app data contract

Use a versioned model so game/static data and user state never overwrite each other. Suggested structures:

```js
const Player = {
  key,                 // local stable key
  serverPlayerId: null,// optional live/import id
  name, age, ovr,
  roles: [],           // current natural roles only
  relatedRoles: [],    // live/imported when known
  attributes: {},      // app-facing percentage values keyed by canonical attribute names
  condition: null, morale: null, availability: null,
  playstyle: { type:null, level:0, points:null, isTrainingNextLevel:null,
               nextLevelPrice:null, isNextLevelAvailable:null, nextLevelProgress:null, boost:null },
  specialAbilities: [],
  availableTrainingAbilities: null, // server-specific eligibility when captured; null=unknown
  sourceMeta: { build:"30527", scannerVersion:null, importedAt:null }
};

const TeamPlan = {
  version: 1, squadRevision, mode:"bestXI"|"matchReadyXI",
  approach, drainLimit, formationTemplateId,
  starters:[{playerKey,assignedRole,suitability,x,y,roleMean,roleFloor,playstyleFit}],
  bench:[],
  tactics:{values:{}, rawDrainScore, normalizedDrain, drainClass, tacticFit, reasons:{}},
  mentor:{id,displayName,reason,alternatives:[]},
  generatedAt
};
```

**Scale boundary:** raw protocol attributes from JoinMatchResponse use internal paired fields and are not automatically the same as the app’s visible percentage scale. Do not feed raw protocol integers straight into Role Score until a proven converter exists. Scanner/manual visible percentages remain the app-facing numeric source.

### 3.1 Known player/squad protocol fields worth preserving on future imports

Known current Player fields include Age #5, Quality #11, Condition #13, Attributes #15, SkillPoints #16, LastTrainingSkillPointsProgressIncrement #18, TrainingSpecialAbility #21 and spent points #22, TrainingRoleId #23 and spent points #24, Roles #40, PauseSpecialTraining #46, NewQuality #51, SecondSpecialAbility #52, SpecialAbilities #54, Playstyle #55 and ThirdSpecialAbility #58. This does not mean every protocol field belongs in the normal UI; it means import code should not destroy fields it does not yet understand.

`SaveSquadRequest` represents each selected player as `PlayerId + Position{X,Y,SubstitutionOrder} + Mentality`. Communication PlayerMentality is **Attacking=0, Defending=1, Neutral=2**. A separate UI PlayerMentalityStatus uses **Defensive=0, Normal=1, Attacking=2**. Never mix those two enums.

## 4. Roles and exact pitch geometry — GAME FACT

### 4.1 Current usable roles

`GK, DL, DC, DR, DMC, ML, MC, MR, AML, AMC, AMR, ST`

DML/DMR are legacy/internal enum values only for this build. Their current pitch rectangles are zero-sized and the current communication PlayerRole enum does not expose them as current playable roles.

### 4.2 Role enum IDs

| Role | Football Engine ID | Communication ID |
| --- | --- | --- |
| GK | 0 | 1 |
| DL | 1 | 2 |
| DC | 2 | 3 |
| DR | 3 | 4 |
| DMC | 5 | 5 |
| ML | 7 | 6 |
| MC | 8 | 7 |
| MR | 9 | 8 |
| AML | 10 | 9 |
| AMC | 11 | 10 |
| AMR | 12 | 11 |
| ST | 13 | 12 |
| DML | 4 | not current |
| DMR | 6 | not current |

Do not mix the Football Engine enum with the communication enum; they have different numbering.

### 4.3 Exact legal role rectangles

| Role | X range | Y range | Derived neutral centre |
| --- | --- | --- | --- |
| GK | 0..143 | 250..750 | 72,500 |
| DL | 179..393 | 0..250 | 286,125 |
| DC | 143..286 | 250..750 | 214,500 |
| DR | 179..393 | 750..1000 | 286,875 |
| DMC | 286..429 | 250..750 | 358,500 |
| ML | 393..607 | 0..250 | 500,125 |
| MC | 429..572 | 250..750 | 500,500 |
| MR | 393..607 | 750..1000 | 500,875 |
| AML | 607..821 | 0..250 | 714,125 |
| AMC | 572..715 | 250..750 | 644,500 |
| AMR | 607..821 | 750..1000 | 714,875 |
| ST | 715..858 | 250..750 | 786,500 |

Internal pitch is **0–1000 x 0–1000**, X from goalkeeper end to attacking end, Y from left to right. Rectangle membership is `x >= minX && x < maxX && y >= minY && y < maxY`. Normalized coordinates multiply by 1000. The neutral centres are COMPANION-derived, not hidden Nordeus preferred points.

### 4.4 Exact coordinate generator — COMPANION LOGIC

```text
For n players assigned to the same exact role:
  x = minX + width/2
  y(i,n) = minY + (i+1) * height/(n+1), i=0..n-1
Round only at final storage/render boundary. Clamp to [min, max-epsilon] if needed.

Portrait rendering:
  left = y / 1000
  top  = 1 - x / 1000
```
Formation templates store roles/accepted roles only. They do not store arbitrary CSS percentages.

## 5. Attributes and white/key-skill rules — GAME FACT

| ID | Attribute |
| --- | --- |
| 1 | Fitness |
| 2 | Strength |
| 3 | Aggression |
| 4 | Speed |
| 5 | Creativity |
| 6 | Passing |
| 7 | Dribbling |
| 8 | Crossing |
| 9 | Shooting |
| 10 | Finishing |
| 11 | Tackling |
| 12 | Marking |
| 13 | Positioning |
| 14 | Heading |
| 15 | Bravery |
| 16 | Reflexes |
| 17 | Agility |
| 18 | Anticipation |
| 19 | Rushing Out |
| 20 | Communication |
| 21 | Throwing |
| 22 | Kicking |
| 23 | Punching |
| 24 | Aerial Reach |
| 25 | Concentration |

### 5.1 Exact role → key/white map

| Role | Key / white attributes |
| --- | --- |
| GK | Reflexes, Agility, Anticipation, Rushing Out, Communication, Throwing, Kicking, Punching, Aerial Reach, Concentration, Fitness |
| DL | Crossing, Tackling, Marking, Positioning, Bravery, Fitness, Aggression, Speed |
| DC | Tackling, Marking, Positioning, Heading, Bravery, Fitness, Strength, Aggression |
| DR | Crossing, Tackling, Marking, Positioning, Bravery, Fitness, Aggression, Speed |
| DMC | Passing, Tackling, Marking, Positioning, Heading, Bravery, Fitness, Strength, Aggression, Creativity |
| ML | Passing, Dribbling, Crossing, Positioning, Fitness, Speed, Creativity |
| MC | Passing, Dribbling, Shooting, Tackling, Marking, Positioning, Bravery, Fitness, Speed, Creativity |
| MR | Passing, Dribbling, Crossing, Positioning, Fitness, Speed, Creativity |
| AML | Passing, Dribbling, Crossing, Shooting, Finishing, Fitness, Speed, Creativity |
| AMC | Passing, Dribbling, Shooting, Finishing, Heading, Fitness, Speed, Creativity |
| AMR | Passing, Dribbling, Crossing, Shooting, Finishing, Fitness, Speed, Creativity |
| ST | Passing, Dribbling, Shooting, Finishing, Positioning, Heading, Strength, Speed, Creativity |

**Multi-natural-role UI white-skill rule:** a player attribute is white/key if **any** natural role marks it key; use the union across the player’s natural roles. **Formation role scoring is different:** when evaluating a player for a target slot, use only the exact key attributes of the **target assigned role**, not the player-wide union. No per-attribute role weighting has been proven, so the companion uses equal weights.

## 6. Position suitability — GAME/LIVE FACT

The build distinguishes **Natural**, **Related**, and **Wrong** positions. Player protocol exposes both `Roles` and `RelatedRoles`; PlayerStatus includes RelatedPosition and WrongPosition.

```text
if targetRole in player.roles        => legal, NATURAL
else if targetRole in relatedRoles   => legal, RELATED
else                                 => WRONG; exclude from normal optimiser
```

There is **no invented 75%, 50%, 25% or adjacency penalty**. Related position is a categorical eligibility/tie-break fact unless future evidence gives a real numerical penalty. Wrong-position emergency assignment may exist behind an explicit user toggle, but it must be labelled emergency and never silently selected.

## 7. Playstyles — GAME FACT + LIVE ELIGIBILITY

| ID | Playstyle | Current eligible roles | Category/status |
| --- | --- | --- | --- |
| 1 | No Playstyle | — | — |
| 2 | Poacher | ST | Attacker |
| 3 | False Nine | ST, AMC | Attacker |
| 4 | Target Man | ST | Attacker |
| 5 | Enganche | AMC | Attacker |
| 6 | Inside Forward | AML, AMR | Attacker |
| 7 | Winger | AML, AMR, ML, MR | Attacker |
| 8 | False Winger | ML, MR | Midfielder |
| 9 | Mezzala | MC | Midfielder |
| 10 | Box-to-Box | MC | Midfielder |
| 11 | Regista | MC, DMC | Midfielder |
| 12 | Ball Winner | DMC | Midfielder |
| 13 | Anchor Man | DMC | Midfielder |
| 14 | No-Nonsense DC | DC | Defender |
| 15 | Stopper | DC | Defender |
| 16 | Ball Playing DC | DC | Defender |
| 17 | Full Back | DL, DR | Defender |
| 18 | Wing Back | DL, DR | Defender |
| 19 | Ball Playing GK | NONE in current server definitions | Do not offer |
| 20 | Sweeper Keeper | GK | Defender |
| 21 | Box Commander | GK | Defender |

`Ball Playing GK` remains in a communication enum, but current captured server definitions give it no eligible roles and the current Football Engine PlaystyleName enum omits it. **Do not offer it as a selectable current playstyle.**

### 7.1 Levels/schema

| Level ID | Meaning |
| --- | --- |
| 0 | No Playstyle Level |
| 1 | Locked |
| 2 | Standard |
| 3 | Intermediate |
| 4 | Advanced |
| 5 | Master |

Persist the full playstyle object: `PlaystyleType, Level, Points, IsTrainingNextLevel, NextLevelPrice, IsNextLevelAvailable, NextLevelProgress, Boost`. `PlaystyleLevelDefinition` also contains PlaystyleLevel, PointsForNextLevel, BoostersCostToStartNextLevel and ShouldNextLevelProgressBeStarted. Exact match-engine level multipliers and the numerical meaning/application of Boost are UNRESOLVED; store/display them but do not invent a Role Score multiplier.

### 7.2 Add/Edit Player playstyle filtering

Default selectable playstyles = union of **current eligible playstyles for all natural roles**. Existing assigned/imported playstyles must never be deleted simply because a later role edit makes them look unusual; warn and preserve. Related roles do not expand the chooser by default.

## 8. Special abilities — GAME FACT, server-specific eligibility

| ID | Special ability |
| --- | --- |
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

Remove **Shadow Striker** from build-30527 data. The current Player protocol exposes `SpecialAbility` (#14), `SecondSpecialAbility` (#52), repeated `SpecialAbilities` (#54), and `ThirdSpecialAbility` (#58), so v5.2.4’s hard two-slot limit is wrong. Store abilities as an array and preserve raw fields on import if useful.

### 8.1 The important eligibility boundary

There is **not yet a proven universal role→special-ability eligibility matrix**. The official client requests `GetAvailableTrainingAbilitiesRequest(PlayerId)` and receives `GetAvailableTrainingAbilitiesResponse.PlayerAbility[]` for the specific player. Therefore the app must **not** restrict ability choice by a guessed role matrix.

Implementation:
- if `availableTrainingAbilities` was imported/captured for that player, use that exact list for “train a new ability”;
- if it is unknown, show the current 19-item catalogue only as a manual/current-ability editor, not as proof every ability is trainable;
- existing actual abilities are always preserved;
- use obvious specialist matches (Penalty/FK/Corner) as companion tie-break information, not a hidden match-engine multiplier.

### 8.2 Match-engine relevance

Football Engine structures explicitly include special-ability events and playstyle trigger descriptors, with trigger families for shooting, heading, rebounds, through balls, crosses, passing, aerial/ground duels, feints, tackles, interceptions, blocks and goalkeeper actions. This confirms the systems matter in matches, but their exact numerical magnitude is private/unresolved. **Do not add arbitrary SA bonuses to core formation score.**

### 8.3 LIVE observed SA↔role examples — **not universal eligibility**

The controlled current squad gives useful real examples of abilities existing on particular natural roles. These are evidence that name-based intuition can be misleading; they are **not** a rule that the ability is limited to those roles.

| Special ability | Players/natural roles actually observed |
| --- | --- |
| Aerial Defender | Paul Brace (DC/DR); Remus Iacob (DL); Alaa Ben Aïssa (DL/DC) |
| Defensive Wall | Stefano Luiu (MC) |
| Free Kick Specialist | Richard Kilroy (AMR); Julien Ahandour (AML/AMR/AMC); Ariel Bravo (AMR) |
| Long Shots | David Andrews (MC) |
| One-on-One Scorer | Fidel Sánchez (AMC/AMR) |
| One-on-One Stopper | Victor Aslan (DL/DC); James Hughes (DR/DC) |
| Penalty Kick Specialist | David Andrews (MC); Sergey Kazachenko (AML) |
| Penalty Kick Stopper | Elinaldo Morais da Silva (GK) |
| Playmaker | Gosling Lataille (ST); François Roelandt (ST) |

Use this table for parser/regression validation only. In particular, the capture includes Defensive Wall on an MC and Playmaker on STs, which is exactly why the app must not invent a neat football-intuition eligibility matrix.

## 9. Formation optimiser — FINAL COMPANION LOGIC

### 9.1 Player-to-role values

```text
roleMean(p,r)  = arithmetic mean of player p values for every exact key attribute of target role r
roleFloor(p,r) = arithmetic mean of the three LOWEST target-role key attributes
naturalFlag    = 1 if r in natural roles, else 0 (related candidate only)
playstyleFit   = 1 if current playstyle is currently eligible for r, else 0
playstyleLevel = enum level 0..5
```

Candidate order for the same slot is lexicographic: **higher roleMean → natural over related → higher roleFloor → playstyle fit → higher playstyle level → stable player key**. Special abilities and OVR do not add a secret bonus. OVR may be displayed as context.

### 9.2 Whole-XI global assignment

Never greedily fill slots. For every formation template, build a player×slot candidate matrix and solve maximum one-player-per-slot assignment globally (Hungarian algorithm with packed lexicographic weights, or exact dynamic programming/backtracking for the small squad). Rank completed formations by:

```text
1. maximum SUM(roleMean)
2. maximum number of natural assignments
3. maximum SUM(roleFloor)
4. maximum number of playstyle fits
5. stable formation-template order
```

Do not collapse these into undocumented weighted magic numbers. If a library requires one scalar, pack each term with mathematically non-overlapping integer ranges after scaling roleMean, and document it. Exact tuple comparison is preferred.

### 9.3 Initial formation-template library

v1 can migrate the five shapes already present in v5.2.4, but as role-only templates. They are COMPANION template data, not claimed to be the complete set of all possible Top Eleven shapes.

| Template | Role slots |
| --- | --- |
| 4-4-2 | GK, DL, DC, DC, DR, ML, MC, MC, MR, ST, ST |
| 4-3-3 | GK, DL, DC, DC, DR, MC, MC, MC, AML, ST, AMR |
| 4-2-3-1 | GK, DL, DC, DC, DR, DMC\|MC, DMC\|MC, AML, AMC, AMR, ST |
| 3-5-2 | GK, DC, DC, DC, ML, MC, MC, MC, MR, ST, ST |
| 4-1-2-1-2 | GK, DL, DC, DC, DR, DMC, MC, MC, AMC, ST, ST |

For a composite slot such as `DMC|MC`, evaluate candidates separately for each accepted target role and retain the best legal assignment. After the winning XI and exact assigned roles are known, generate coordinates from §4.4. Adding more templates later requires only data, not a new scoring engine.

### 9.4 Best XI vs Match Ready XI

`Best XI` ignores temporary condition/morale in permanent ability ranking. `Match Ready XI` excludes unavailable/injured/suspended players; applies a user-selected minimum condition as a filter/warning; morale is warning-only unless the user enables a filter. Never permanently lower Role Score because someone is tired today.

### 9.5 Formation output

Show formation name, full graphical pitch, player name, assigned role, Natural/Related badge, **Top Eleven Tool Role Score** (`roleMean`), weakest 3 target-role key skills, playstyle/level + fit badge, special abilities, and bench. Never call Role Score an official Top Eleven score.

## 10. Tactics and condition drain — GAME FACT

| Dimension | Option | Enum ID | Default drain intensity | Contribution |
| --- | --- | --- | --- | --- |
| Passing | Short | 0 | High | 7 |
| Passing | Long | 1 | Low | 0 |
| Passing | Mixed | 2 | Medium | 5 |
| Shooting Tendency | Shoot On Sight | 0 | Low | 0 |
| Shooting Tendency | Work It Into The Box | 1 | High | 7 |
| Shooting Tendency | Balanced | 2 | Medium | 5 |
| Focus Passing | Left Flank | 0 | Low | 0 |
| Focus Passing | Right Flank | 1 | Low | 0 |
| Focus Passing | Both Flanks | 2 | High | 7 |
| Focus Passing | Center | 3 | Low | 0 |
| Focus Passing | Balanced | 4 | Medium | 5 |
| Cross Tendency | Low | 0 | Low | 0 |
| Cross Tendency | Medium | 1 | Low | 0 |
| Cross Tendency | High | 2 | Low | 0 |
| Possession Lost | Counter Press | 0 | High | 7 |
| Possession Lost | Regroup | 1 | Medium | 5 |
| Possession Won | Focus On Buildup | 0 | Medium | 5 |
| Possession Won | Force Counter Attack | 1 | High | 7 |
| Mentality | Hard Defending | 0 | High | 7 |
| Mentality | Defending | 1 | Medium | 5 |
| Mentality | Normal | 2 | Low | 0 |
| Mentality | Attacking | 3 | Medium | 5 |
| Mentality | Hard Attacking | 4 | High | 7 |
| Marking | Man-to-Man | 0 | High | 7 |
| Marking | Zonal | 1 | Medium | 5 |
| Pressing | Low Block | 0 | Low | 0 |
| Pressing | Mid Press | 1 | Medium | 5 |
| Pressing | High Press | 2 | High | 7 |
| Back Line | Track Opponent | 0 | Medium | 5 |
| Back Line | Set Offside Trap | 1 | Low | 0 |
| Tackling | Stay On Feet | 1 | High | 7 |
| Tackling | Aggressive | 2 | Medium | 5 |
| Tackling | Balanced | 0 | Low | 0 |

**Do not “correct” counter-intuitive values.** In this recovered table, all Cross Tendency choices are Low contribution, while **Stay On Feet is High contribution**. Preserve exactly.

### 10.0.1 Exact V2 protocol enum strings

```text
Passing: TACTICS_PASSES_SHORT | TACTICS_PASSES_LONG | TACTICS_PASSES_MIXED
Shooting: TACTICS_SHOOTING_TENDENCY_SHOOT_ON_SIGHT | TACTICS_SHOOTING_TENDENCY_WORK_IT_INTO_THE_BOX | TACTICS_SHOOTING_TENDENCY_BALANCED
Focus: TACTICS_FOCUS_PASSING_LEFT_FLANK | TACTICS_FOCUS_PASSING_RIGHT_FLANK | TACTICS_FOCUS_PASSING_BOTH_FLANKS | TACTICS_FOCUS_PASSING_CENTER | TACTICS_FOCUS_PASSING_BALANCED
Cross: TACTICS_CROSS_TENDENCY_LOW | TACTICS_CROSS_TENDENCY_MEDIUM | TACTICS_CROSS_TENDENCY_HIGH
Lost: TACTICS_POSSESSION_LOST_COUNTER_PRESS | TACTICS_POSSESSION_LOST_REGROUP
Won: TACTICS_POSSESSION_WON_FOCUS_ON_BUILDUP | TACTICS_POSSESSION_WON_FORCE_COUNTER_ATTACK
Mentality: TACTICS_MENTALITY_HARD_DEFENDING | TACTICS_MENTALITY_DEFENDING | TACTICS_MENTALITY_NORMAL | TACTICS_MENTALITY_ATTACKING | TACTICS_MENTALITY_HARD_ATTACKING
Marking: TACTICS_MARKING_STYLE_MAN_TO_MAN | TACTICS_MARKING_STYLE_ZONAL
Pressing: TACTICS_PRESSING_STYLE_LOW_BLOCK | TACTICS_PRESSING_STYLE_MID_PRESS | TACTICS_PRESSING_STYLE_HIGH_PRESS
Back Line: TACTICS_BACK_LINE_TRACK_OPPONENT | TACTICS_BACK_LINE_SET_OFFSIDE_TRAP
Tackling: TACTICS_TACKLING_STYLE_STAY_ON_FEET | TACTICS_TACKLING_STYLE_AGGRESSIVE | TACTICS_TACKLING_STYLE_BALANCED
```

Persist canonical internal keys separately from display labels so UI wording can change without corrupting saves.

### 10.1 Exact drain arithmetic

```text
MinConditionDrain = 15
NormalizeFactor   = 100
Low contribution    = 0
Medium contribution = 5
High contribution   = 7
Medium threshold = 0.40
High threshold   = 0.65

rawScore = 15 + Σ contribution(option_i), for all 11 tactic dimensions
normalized = rawScore / 100

if normalized > 0.65: High
else if normalized > 0.40: Medium
else: Low
```
Threshold comparisons are strict `>`. A DrainOverrides structure exists: a non-null option override replaces the option’s default intensity before 0/5/7 resolution. Architect the data model to accept overrides, but do not invent any.

### 10.2 Search-space checksums

Full tactic grid = **97,200** combinations. With mentality fixed by Approach = **19,440** candidates per approach. Under the default recovered table the full-grid drain-class counts are Low **963**, Medium **77,823**, High **18,414**.

| Mentality | Low | Medium | High | Total |
| --- | --- | --- | --- | --- |
| Hard Defending | 36 | 14388 | 5016 | 19440 |
| Defending | 111 | 15606 | 3723 | 19440 |
| Normal | 669 | 17835 | 936 | 19440 |
| Attacking | 111 | 15606 | 3723 | 19440 |
| Hard Attacking | 36 | 14388 | 5016 | 19440 |

These counts are useful regression checks for `tactics-engine.js`; if they change without an explicit override/config change, the implementation is wrong.

## 11. Tactics recommendation engine — FINAL COMPANION LOGIC

### 11.1 User inputs

```text
Approach: Hard Defending | Defending | Balanced | Attacking | Hard Attacking
Drain limit: Low | Medium | High
```
Map `Balanced` approach to game mentality `Normal`. Mentality is locked to the chosen approach. Drain is a hard constraint, never a performance bonus.

### 11.2 Relevance-aware lineup metrics

For each metric, include a player/attribute observation only when that attribute is a key attribute of the player’s **assigned role**, unless the metric explicitly names a role/lane filter. This prevents irrelevant grey skills from dominating tactical evaluation. Empty metrics fall back to the broader XI mean of the same attribute(s), then to 0 only if no data exists.

```text
TechnicalBuild = mean(Passing, Creativity, Dribbling)
ShootingPower  = mean(Shooting)
Finishing      = mean(Shooting, Finishing)
WideAttack     = mean(Crossing, Dribbling, Speed) over DL/DR/ML/MR/AML/AMR with relevant key attrs
AerialTarget   = mean(Heading, Strength, Positioning) over DC/DMC/AMC/ST where relevant
Transition     = mean(Speed, Passing, Dribbling, Finishing)
PressingUnit   = mean(Fitness, Aggression, Tackling, Bravery)
DefensiveUnit  = mean(Tackling, Marking, Positioning, Bravery)
LineControl    = defender mean(Positioning, Speed, Bravery) over DL/DC/DR/DMC
FitnessMean, TacklingMean, PositioningMean are similarly relevance-filtered.
```
Lane score = mean relevant attacking/build attributes for starters whose generated Y coordinate belongs to left (<250), central (250..750) or right (>750) lane, using exact role/lane assignment.

### 11.3 Raw squad support per option

```text
Passing:
  Short = TechnicalBuild
  Long  = mean(Transition, AerialTarget)
  Mixed = mean(Short, Long)

Shooting:
  Shoot On Sight       = ShootingPower
  Work It Into The Box = mean(TechnicalBuild, Finishing)
  Balanced             = mean(ShootOnSight, WorkIntoBox)

Focus Passing:
  Left Flank  = LeftLane
  Right Flank = RightLane
  Both Flanks = mean(LeftLane, RightLane)
  Center      = CenterLane
  Balanced    = mean(LeftLane, CenterLane, RightLane)

Cross Tendency:
  Low    = TechnicalBuild
  High   = mean(WideAttack, AerialTarget)
  Medium = mean(Low, High)

Possession Lost:
  Counter Press = PressingUnit
  Regroup       = DefensiveUnit

Possession Won:
  Focus On Buildup    = TechnicalBuild
  Force Counter Attack = Transition

Marking:
  Man-to-Man = mean(DefensiveUnit, FitnessMean)
  Zonal      = mean(DefensiveUnit, LineControl)

Pressing:
  Low Block  = DefensiveUnit
  Mid Press  = mean(DefensiveUnit, PressingUnit)
  High Press = PressingUnit

Back Line:
  Track Opponent   = DefensiveUnit
  Set Offside Trap = LineControl

Tackling:
  Stay On Feet = mean(TacklingMean, PositioningMean)
  Aggressive   = mean(TacklingMean, BraveryMean, AggressionMean)
  Balanced     = mean(StayOnFeet, Aggressive)
```

### 11.4 Approach alignment — explicit companion configuration

Approach is not a hidden game formula. To make Hard Defending→Hard Attacking affect style beyond Mentality without pretending otherwise, use a documented style index.

```text
approachIndex: Hard Defending=0.00, Defending=0.25, Balanced=0.50, Attacking=0.75, Hard Attacking=1.00

styleIndex by option:
  Passing Short/Mixed/Long = 0.50/0.50/0.50       // direction, not aggression
  Shooting Sight/Box/Balanced = 0.80/0.70/0.50
  Focus all choices = 0.50                         // lane preference, not aggression
  Crossing Low/Medium/High = 0.35/0.50/0.75
  Possession Lost Regroup/CounterPress = 0.25/0.75
  Possession Won Build/Counter = 0.45/0.75
  Marking Zonal/Man-to-Man = 0.40/0.65
  Press Low/Mid/High = 0.20/0.50/0.85
  Back Line Track/Offside = 0.30/0.75
  Tackle Stay/Balanced/Aggressive = 0.30/0.50/0.80
```
These values are **COMPANION LOGIC and versioned config**, not game facts. They may be tuned later without changing recovered game data.

### 11.5 Option fit normalization and exhaustive selection

For each tactic dimension independently:

```text
rawSupport[o] = formula in §11.3
Within that dimension:
  if max(rawSupport)==min(rawSupport): squadFit[o]=1 for all
  else squadFit[o]=(rawSupport[o]-min)/(max-min)

approachFit[o] = 1 - abs(styleIndex[o] - approachIndex)
optionFit[o] = mean(squadFit[o], approachFit[o])
```

Then enumerate all 19,440 combos with the fixed mentality. For each combo: calculate exact drain; reject if class exceeds the user limit (`Low` allows Low only; `Medium` allows Low+Medium; `High` allows all); `tacticFit = mean(optionFit across the other 10 dimensions)`. Choose highest tacticFit; ties: lower raw drain score → more dimensions using their maximum squadFit → stable enum order. Return a reason under every setting including the relevant lineup metric and drain trade-off.

This model is deterministic, explainable, testable and intentionally **ours**. It is not presented as the private Top Eleven match-engine tactic formula.

## 12. Mentors — LIVE FACT

| Display name | Internal ID | Name confidence | Lvl | XP | Captured boosts: current → next |
| --- | --- | --- | --- | --- | --- |
| Rubén Herrera | saboteur | LIVE-CONFIRMED | 7 | 40/400 | tacticCounterAttackEffectiveness [30] → [30]; attributeCreativityPassing [20] → [25]; signatureBlindSide [30] → [35] |
| Lewis Green | wing_commander | LIVE-CONFIRMED | 8 | 230/800 | tacticWingAttacksEffectiveness [30] → [30]; attributeCrossingHeading [20] → [40]; signatureAerialDominance [80] → [81] |
| Jonas Brown | analyst | LIVE-CONFIRMED | 4 | 40/50 | tacticLongPassEffectiveness [30] → [30]; attributeStrengthPositioning [5] → [10]; signatureAdaptiveBlueprint [20] → [21] |
| Cesc Fàbregas | architect | APP-ASSET/DISPLAY MAPPING | 6 | 120/200 | tacticShortPassEffectiveness [30] → [30]; attributeDribblingShooting [10] → [15]; signatureMomentumChain [15, 8] → [15, 6] |
| Alan Shearer | deadball_specialist | LIVE-CONFIRMED | 8 | 710/800 | tacticSoloDribbleEffectiveness [30] → [30]; attributeStrengthShooting [20] → [25]; signatureAnkleBreaker [25, 10] → [30, 10] |
| Nemanja Vidić | iron_guard | APP-ASSET/DISPLAY MAPPING | 6 | 100/200 | tacticDefensiveActionsEffectivenessWithStaminaPenalty [25] → [25]; attributeTacklingBravery [15] → [20]; signatureIronCheck [2, 10] → [5, 8] |
| Claude Makélélé | enforcer | APP-ASSET/DISPLAY MAPPING | 7 | 0/400 | tacticDefensiveActionsEffectivenessAgainstShortPasses [25] → [25]; attributeBraveryPositioning [20] → [25]; signatureParkingTheBus [15, 10] → [20, 10] |

Captured common state: all seven were unlocked, series 1; `tickets=0`, `gatingItemAmount=0`, ticket limit `100`. Expiration in this capture was `1793498400000` for all seven. These are LIVE snapshot values and must not be hard-coded as permanent account state.

Do not reinterpret multi-value signature arrays. For example Momentum Chain `[15,8]→[15,6]` and Iron Check `[2,10]→[5,8]` are raw confirmed effect arrays whose element semantics are unresolved. Also do not automatically call every scalar “percent”; preserve it as a captured game effect value unless the UI/localization proves a percentage unit.

### 12.1 Existing v5.2.4 mentor presentation assets to retain

| Display | Existing title | Asset | Internal ID used by new logic |
| --- | --- | --- | --- |
| Alan Shearer | The Finisher | `alan-shearer.png` | `deadball_specialist` |
| Claude Makélélé | The Enforcer | `claude-makelele.png` | `enforcer` |
| Nemanja Vidić | The Iron Guard | `nemanja-vidic.png` | `iron_guard` |
| Cesc Fàbregas | The Architect | `cesc-fabregas.png` | `architect` |
| Lewis Green | The Wing Commander | `lewis-green.png` | `wing_commander` |
| Jonas Brown | The Analyst | `jonas-brown.png` | `analyst` |
| Rubén Herrera | The Saboteur | `ruben-herrera.png` | `saboteur` |

The internal IDs/effects, not the old `attack/defence/control/width/adaptive/structure` style tags, drive the new recommendation. Alan/Lewis/Rubén/Jonas name↔ID mappings were live-confirmed; Cesc/Nemanja/Claude mappings are retained from the existing app assets/display mapping unless separately protocol-confirmed later.

## 13. Mentor recommendation — FINAL COMPANION LOGIC

Mentor choice is a **lexicographic synergy ranking**, not a fake hidden percentage. For each mentor compute `(directTacticMatch, attributeCoverage, mentorLevel, stableOrder)`. Compare in that order.

### 13.1 Direct tactic match score (0..3 companion points)

```text
Architect / tacticShortPassEffectiveness:
  Short=3, Mixed=1, Long=0
Analyst / tacticLongPassEffectiveness:
  Long=3, Mixed=1, Short=0
Wing Commander / tacticWingAttacksEffectiveness:
  +2 if Focus Passing is Left Flank, Right Flank or Both Flanks
  +1 if Cross Tendency is Medium or High
Saboteur / tacticCounterAttackEffectiveness:
  Force Counter Attack=3; otherwise 0
Iron Guard / defensive-actions-with-stamina-penalty:
  Hard Defending or Defending approach=2; otherwise 0
Enforcer / defensive-actions-against-short-passes:
  if opponent passing is known: Short=3, Mixed=1, Long=0; if opponent style unknown=0
Deadball Specialist / tacticSoloDribbleEffectiveness:
  +2 if Work It Into The Box; +1 if XI Dribbling support is at/above the median of the main attacking capability metrics
Clamp each mentor to maximum 3.
```

### 13.2 Attribute coverage

Parse confirmed stat boost IDs into pairs: Creativity+Passing; Crossing+Heading; Strength+Positioning; Dribbling+Shooting; Strength+Shooting; Tackling+Bravery; Bravery+Positioning. For each starter, count 1 for each boosted attribute that is a key attribute of that starter’s **assigned role**. `attributeCoverage = total useful hits`. For display, also show `coveragePercent = usefulHits / (11 * numberOfBoostedAttributes) * 100`. Do not multiply by the raw mentor effect value in v1 because its exact match-engine magnitude/scale is unresolved.

Signature effect names and raw arrays are shown as supporting information but are not numerically scored in v1. Return top choice plus at least two alternatives with “why not” explanations.

## 14. Training data — GAME/LIVE FACT

### 14.1 Intensity system

| ID | Protocol name | UI name | XP/player | Condition drop |
| --- | --- | --- | --- | --- |
| 1 | VeryLightTraining | Very Easy | 1 | 0.75 |
| 2 | LightTraining | Easy | 2 | 1.5 |
| 3 | ModerateTraining | Medium | 3 | 2.25 |
| 4 | IntenseTraining | Hard | 4 | 3.0 |
| 5 | VeryIntenseTraining | Very Hard | 5 | 3.75 |

All 29 captured normal drills and the four Masterclass consumables obey this XP/condition mapping in the captured runtime catalogue.

### 14.2 Regular drill levels

| Level | Name | Training Effect |
| --- | --- | --- |
| 1 | Semi-pro | +10% |
| 2 | Pro | +20% |
| 3 | World-class | +30% |

Native rule: Basic drill AdditionalGainPercentage = `Level * 10`; regular max level is 3. Do not ask the user to separately enter effect %.

### 14.3 All 29 normal drills — captured fixed catalogue + user snapshot

| Drill ID | Name | Type | Intensity | XP | Cond. | Affected attributes | Captured user level | Effect | Unlocked snapshot |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PASS_GO_SHOOT | Pass, Go and Shoot! | Attack | Easy | 2 | 1.5 | Shooting, Anticipation, Speed, Passing | World-class | +30% | Yes |
| FAST_COUNTER_ATTACKS | Fast Counter-Attacks | Attack | Very Hard | 5 | 3.75 | Creativity, Communication, Crossing, Passing, Finishing | World-class | +30% | Yes |
| SKILL_DRILL | Ball Control | Possession | Very Easy | 1 | 0.75 | Concentration, Heading, Creativity, Dribbling | Pro | +20% | Yes |
| SHOOTING_TECHNIQUE | Shooting Technique | Attack | Medium | 3 | 2.25 | Shooting, Reflexes, Strength, Agility, Finishing | Pro | +20% | Yes |
| SET_PIECE_DELIVERY | Set-Piece Delivery | Attack | Medium | 3 | 2.25 | Shooting, Marking, Crossing, Rushing Out, Heading | Semi-pro | +10% | Yes |
| SLALOM_DRIBBLE | Slalom Dribble | Attack | Hard | 4 | 3.0 | Speed, Fitness, Dribbling, Passing | World-class | +30% | Yes |
| WING_PLAY | Wing Play | Attack | Hard | 4 | 3.0 | Shooting, Punching, Crossing, Heading, Finishing | World-class | +30% | Yes |
| FINISHING_1_1 | 1-on-1 Finishing | Attack | Easy | 2 | 1.5 | Rushing Out, Tackling, Dribbling, Anticipation, Finishing | Pro | +20% | Yes |
| PRESS_THE_PLAY | Press the Play | Defence | Hard | 4 | 3.0 | Aggression, Bravery, Marking, Tackling, Positioning | World-class | +30% | Yes |
| PIGGY_IN_THE_MIDDLE | Piggy in the Middle | Possession | Easy | 2 | 1.5 | Aggression, Tackling, Positioning, Passing, Fitness | Semi-pro | +10% | Yes |
| GOALKEEPER_TRAINING | Goalkeeper Training | Defence | Hard | 4 | 3.0 | Kicking, Reflexes, Aerial Reach, Agility, Throwing | World-class | +30% | Yes |
| USE_YOUR_HEAD | Use Your Head | Defence | Easy | 2 | 1.5 | Heading, Creativity, Positioning, Passing | Pro | +20% | Yes |
| STOP_THE_ATTACKER | Stop the Attacker | Defence | Medium | 3 | 2.25 | Bravery, Marking, Tackling, Dribbling, Strength | World-class | +30% | Yes |
| DEFENDING_CROSSES | Defending Crosses | Defence | Medium | 3 | 2.25 | Bravery, Marking, Crossing, Aerial Reach, Heading | Pro | +20% | Yes |
| VIDEO_ANALYSIS | Video Analysis | Defence | Very Easy | 1 | 0.75 | Bravery, Communication, Creativity, Positioning | Pro | +20% | Yes |
| HOLD_THE_LINE | Hold the Line | Defence | Medium | 3 | 2.25 | Concentration, Marking, Communication, Positioning | World-class | +30% | Yes |
| WARM_UP | Warm-Up | Physical & Mental | Very Easy | 1 | 0.75 | Reflexes, Fitness, Heading, Aggression | Pro | +20% | Yes |
| STRETCH | Stretch | Physical & Mental | Easy | 2 | 1.5 | Agility, Fitness, Strength, Speed | Pro | +20% | Yes |
| SPRINT | Sprint | Physical & Mental | Very Hard | 5 | 3.75 | Fitness, Rushing Out, Dribbling, Speed | World-class | +30% | Yes |
| CARIOCA_WITH_LADDERS | Carioca with Ladders | Physical & Mental | Easy | 2 | 1.5 | Agility, Concentration, Aggression, Speed | Semi-pro | +10% | Yes |
| LONG_RUN | Long Run | Physical & Mental | Medium | 3 | 2.25 | Speed, Concentration, Fitness | World-class | +30% | Yes |
| GYM | Gym | Physical & Mental | Very Hard | 5 | 3.75 | Kicking, Fitness, Strength, Throwing | Pro | +20% | Yes |
| SHUTTLE_RUNS | Shuttle Runs | Physical & Mental | Hard | 4 | 3.0 | Bravery, Agility, Strength, Speed | Pro | +20% | Yes |
| HURDLE_JUMPS | Hurdle Jumps | Physical & Mental | Hard | 4 | 3.0 | Bravery, Kicking, Aggression, Speed | Semi-pro | +10% | Yes |
| FIRST_TOUCH_PLAY | First Touch Play | Possession | Easy | 2 | 1.5 | Throwing, Fitness, Dribbling, Passing | World-class | +30% | Yes |
| RAPID_SIDE_SWITCH | Rapid Side Switch | Possession | Medium | 3 | 2.25 | Creativity, Speed, Communication, Crossing, Positioning, Passing | Semi-pro | +10% | Yes |
| STAY_IN_LANE | Stay In Lane | Possession | Medium | 3 | 2.25 | Aerial Reach, Fitness, Positioning, Speed | Locked/No level | +0% | No |
| PASSES_BEFORE_SHOT | Passes Before Shot | Possession | Hard | 4 | 3.0 | Creativity, Positioning, Passing, Anticipation, Finishing | World-class | +30% | Yes |
| CONTACT_PLAY | Contact Play | Possession | Medium | 3 | 2.25 | Aggression, Bravery, Marking, Dribbling, Strength | Pro | +20% | Yes |

The last three columns are **user snapshot state from 2026-09-08**, not permanent game constants. They remain editable and persist locally. Fixed ID/type/intensity/XP/condition/attributes come from the official-client runtime catalogue.

#### 14.3.1 Fixed protocol identifiers for all normal drills

| Drill ID | Asset ID | Type ID | Intensity ID | Attribute IDs | Order | Visibility |
| --- | ---: | ---: | ---: | --- | ---: | --- |
| PASS_GO_SHOOT | 1 | 1 | 2 | 9, 18, 4, 6 | 1 | Owned |
| FAST_COUNTER_ATTACKS | 2 | 1 | 5 | 5, 20, 8, 6, 10 | 6 | Owned |
| SKILL_DRILL | 3 | 3 | 1 | 25, 14, 5, 7 | 1 | Owned |
| SHOOTING_TECHNIQUE | 4 | 1 | 3 | 9, 16, 2, 17, 10 | 3 | Owned |
| SET_PIECE_DELIVERY | 5 | 1 | 3 | 9, 12, 8, 19, 14 | 2 | Owned |
| SLALOM_DRIBBLE | 6 | 1 | 4 | 4, 1, 7, 6 | 4 | Owned |
| WING_PLAY | 7 | 1 | 4 | 9, 23, 8, 14, 10 | 5 | Owned |
| FINISHING_1_1 | 8 | 1 | 2 | 19, 11, 7, 18, 10 | 0 | Owned |
| PRESS_THE_PLAY | 9 | 2 | 4 | 3, 15, 12, 11, 13 | 5 | Owned |
| PIGGY_IN_THE_MIDDLE | 10 | 3 | 2 | 3, 11, 13, 6, 1 | 2 | Owned |
| GOALKEEPER_TRAINING | 11 | 2 | 4 | 22, 16, 24, 17, 21 | 6 | Owned |
| USE_YOUR_HEAD | 12 | 2 | 2 | 14, 5, 13, 6 | 1 | Owned |
| STOP_THE_ATTACKER | 13 | 2 | 3 | 15, 12, 11, 7, 2 | 3 | Owned |
| DEFENDING_CROSSES | 14 | 2 | 3 | 15, 12, 8, 24, 14 | 4 | Owned |
| VIDEO_ANALYSIS | 15 | 2 | 1 | 15, 20, 5, 13 | 0 | Owned |
| HOLD_THE_LINE | 16 | 2 | 3 | 25, 12, 20, 13 | 2 | Owned |
| WARM_UP | 17 | 4 | 1 | 16, 1, 14, 3 | 0 | Owned |
| STRETCH | 18 | 4 | 2 | 17, 1, 2, 4 | 1 | Owned |
| SPRINT | 19 | 4 | 5 | 1, 19, 7, 4 | 7 | Owned |
| CARIOCA_WITH_LADDERS | 20 | 4 | 2 | 17, 25, 3, 4 | 2 | Owned |
| LONG_RUN | 21 | 4 | 3 | 4, 25, 1 | 3 | Owned |
| GYM | 22 | 4 | 5 | 22, 1, 2, 21 | 6 | Owned |
| SHUTTLE_RUNS | 23 | 4 | 4 | 15, 17, 2, 4 | 4 | Owned |
| HURDLE_JUMPS | 24 | 4 | 4 | 15, 22, 3, 4 | 5 | Owned |
| FIRST_TOUCH_PLAY | 25 | 3 | 2 | 21, 1, 7, 6 | 3 | Owned |
| RAPID_SIDE_SWITCH | 26 | 3 | 3 | 5, 4, 20, 8, 13, 6 | 4 | Owned |
| STAY_IN_LANE | 27 | 3 | 3 | 24, 1, 13, 4 | 5 | Locked |
| PASSES_BEFORE_SHOT | 28 | 3 | 4 | 5, 13, 6, 18, 10 | 7 | Owned |
| CONTACT_PLAY | 29 | 3 | 3 | 3, 15, 12, 7, 2 | 6 | Owned |

These fields are fixed catalogue/protocol data; do not overwrite them with user profile state.

### 14.4 Master/Campus consumable drills

| ID | Name | Type | Intensity | XP | Cond. | Additional effect | Affected attributes | Captured stock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ATTACKING_MASTERCLASS | ATTACKING MASTERCLASS | Attack | Very Hard | 5 | 3.75 | +80% | Passing, Dribbling, Crossing, Shooting, Finishing | 0 |
| MIDFIELD_MASTERCLASS | MIDFIELD MASTERCLASS | Possession | Very Hard | 5 | 3.75 | +80% | Passing, Dribbling, Positioning | 0 |
| PHYSICAL_MASTERCLASS | PHYSICAL MASTERCLASS | Physical & Mental | Very Hard | 5 | 3.75 | +80% | Fitness, Strength, Aggression, Speed, Creativity | 0 |
| DEFENDING_MASTERCLASS | DEFENDING MASTERCLASS | Defence | Very Hard | 5 | 3.75 | +80% | Tackling, Marking, Positioning, Heading, Bravery | 0 |

Master stock is a user quantity (`UsagesLeft`), not a fixed max. Each selected Master slot consumes one card; duplicates are allowed while quantity remains. The captured stock of 0 is only the snapshot, not a rule.

#### 14.4.1 Master fixed metadata/descriptions

| ID | Type ID | Intensity ID | Attribute IDs | Source ID | Description |
| --- | ---: | ---: | --- | ---: | --- |
| ATTACKING_MASTERCLASS | 1 | 5 | 6, 7, 8, 9, 10 | 3 | Elevate your squad’s offensive play with this intensive drill focused on sharp passing, dribbling, finishing, crossing and shooting. Perfect your attack and give your players the confidence to break through any defence. |
| MIDFIELD_MASTERCLASS | 3 | 5 | 6, 7, 13 | 3 | Enhance your midfield’s control with this specialized drill, focusing on passing accuracy, maintaining possession and good positions under pressure. Dominate the game by making your midfield the engine of your team. |
| PHYSICAL_MASTERCLASS | 4 | 5 | 1, 2, 3, 4, 5 | 3 | Boost your squad’s fitness, strength, aggression, speed and creativity with this intensive drill, ensuring your players can outlast and outmuscle the competition. Build a team that stays strong until the final whistle. |
| DEFENDING_MASTERCLASS | 2 | 5 | 11, 12, 13, 14, 15 | 3 | Sharpen your squad’s defensive skills with this drill, improving tackling, marking, positioning, heading, bravery. Build a defence your opponents will struggle to break down. |

### 14.5 Protocol boundaries

`BasicTrainingDrill` fields: DrillId, Type, State, Level, IntensityLevel, ConditionDrop, Attributes, OrderingPriority, ExperiencePointsPerPlayer, TeamPlayPoints, Visibility, DrillIdForAssets. Consumable drills add usages/max usages/source/client data and AdditionalTrainingEffectPercent. `ExecuteTrainingResponse` returns authoritative final per-player AttributeGain plus `AttributesPerDrills` drill-slot breakdown. Current evidence says **normal training final gains are server-authoritative**; do not claim the companion predicts exact percentage-point gain.

## 15. Individual Training — FINAL COMPANION LOGIC

This intentionally supersedes v5.2.4’s current `target=max(white skill)` + greedy six-slot implementation. Preserve its proven rule that grey skills have zero value, but use a more robust target and global-ish search.

### 15.1 White set and need

```text
whiteAttributes = UNION(game key attributes for all player NATURAL roles)
whiteValues = current app-facing values for those attributes
target = mean(top 3 whiteValues)
need[a] = max(1, target - current[a] + 1)
```
Using top-three mean avoids one freakishly high white skill dragging every other need upward while still prioritising weaknesses. Grey/non-key attributes contribute exactly zero utility; they are not rewarded and they are not given a fabricated “dilution” penalty.

### 15.2 Drill strength

```text
Normal: strength = XP_per_player * (1 + levelEffectPercent/100)
Master: strength = XP_per_player * (1 + additionalTrainingEffectPercent/100)
```
Only unlocked normal drills and in-stock Master drills are legal. Normal duplicates are unlimited; Master duplicates consume stock.

### 15.3 Per-slot value and balancing credits

```text
useful[d] = affectedAttributes(d) ∩ whiteAttributes
baseNeed[a] = need[a]
effectiveNeed[a] = max(1, baseNeed[a] - credit[a])
rawValue(d) = strength(d) * Σ effectiveNeed[a] for a in useful[d]

after selecting d:
  for every a in useful[d]: credit[a] += strength(d)
```
This deliberately rewards a strong drill that hits **multiple weak white skills in one drill**. That is the product requirement. It prevents six single-skill choices when one intense multi-white drill provides broader useful coverage.

### 15.4 Six-slot beam search

Use beam search width **250** over six slots. State = selected drill IDs, per-attribute credits, remaining Master stock, accumulated utility, distinct white skills covered, total condition, total XP. At each slot expand every state with every legal drill, apply stock and credits, and retain the best 250 states by:

```text
Max Growth mode:
  1. higher accumulated useful utility
  2. more distinct weak white skills covered
  3. lower total condition
  4. stable catalogue order

Condition Efficient mode:
  1. higher usefulUtility / max(totalCondition, epsilon)
  2. higher total usefulUtility
  3. more distinct white skills covered
  4. stable catalogue order
```

Output six drills, exact white targets per drill, any grey attributes as information, level/effect, total condition, total XP, Master consumption, weak white priorities and an explicit “Recommendation score — not exact predicted gain” notice.

## 16. Team Training — FINAL COMPANION LOGIC

Training remains a separate top-level feature from Team Plan. One Training page should use tabs `Individual | Team`. Final UI grouping is COMPANION configuration on the current 12 roles:

```text
GK & Defence              = GK, DL, DC, DR
Defence & Midfield        = DL, DC, DR, DMC, ML, MC, MR
Attacking Mid & Strikers  = AML, AMC, AMR, ST
All Positions              = GK, DL, DC, DR, DMC, ML, MC, MR, AML, AMC, AMR, ST
```

These groups can overlap intentionally; they are user workflow groups, not hidden game role categories.

Do **not** use v5.2.4’s current flattened position-group white map as the scoring population. Instead:

```text
1. collect the actual players included in the chosen group
2. calculate each player’s natural-role white-skill union
3. calculate each player’s weak-skill need using the same top-3 target rule
4. for each drill, sum useful white-skill opportunities across all selected players
5. multiply by real drill strength
6. apply diminishing credits per player/attribute after each selected slot
7. run the same 6-slot beam search
```

Grey hits are zero utility. Do not impose the old arbitrary “two-grey cap” unless exposed as an optional user filter. The optimiser cares about total useful white coverage, not whether a drill’s category name sounds like the group.

### 16.1 Team Play is a separate system

Do not confuse this Team Training optimiser with protocol `TeamPlayTrainingDrill`. Captured TeamPlay records have separate SessionMultiplier/CriticalMultiplier/PerDrillMultiplier and other fields. Build localization states Teamplay Form categories Attack, Defence, Possession, Condition; normal caps start at 10 and can advance to 20 in steps of 2; each cap advance adds 5% gains up to 25%; normal daily reduction is 2, with values above 14 able to decrease more. Rejuvenation Clinic localization states 30% condition restoration. Keep these as reference facts; do not manufacture a TeamPlay optimiser until deliberately designed.

## 17. Squad, Player Profiles and Scanner

### 17.1 Squad page

Squad is the canonical player database, separate from Team Plan. Default sort by current position family can remain (`GK, DL, DC, DR, DMC, ML, MC, MR, AML, AMC, AMR, ST`), but multi-role players should not be duplicated. Add filters by role, age, OVR, playstyle and availability.

### 17.2 Player Profile

A profile must show: name, age, OVR, natural roles, related roles (if known), all visible attributes, automatically highlighted white skills, target-role Role Scores, weakest target-role skills, playstyle + level/progress, all special abilities, availability/condition if stored, and `Train This Player`. Preserve face/photo/crop UI already present.

### 17.3 Add/Edit Player

Keep screenshot scan + manual correction. Max-three-role UI may remain only if it matches actual game limits in practical use; do not use it to truncate imported protocol roles if more arrive. Remove DML/DMR. Playstyle list is filtered by natural-role eligibility. SpecialAbilities is an array, not max two. Add optional Related Roles field for live/manual import.

### 17.4 Scanner v2 — retain

Current scanner normalizes the stats panel to 1050×625, uses local digit templates for numeric values, seven-threshold numeric reading, and Tesseract.js only for name/role/header text. It performs aggregate checks with tolerance 1.25 and OVR check tolerance 1.5; unresolved aggregate/OVR blocks Save. GK detection uses structural/header clues. It does **not synthesize missing values**. Keep the permanent regression fixtures (12+ screenshot fixtures, including Richard Kilroy 136) and existing static/core tests. Only update role parsing/data plumbing needed by this Bible.

## 18. Specialists / Playmakers — optional companion feature

The current app’s formulas are explicitly companion heuristics, not Nordeus formulas. Prefer a simpler explainable lexicographic model:

```text
Penalty taker:
  1. has Penalty Kick Specialist
  2. higher mean(Finishing, Shooting)
  3. higher Creativity
  4. stable player key

Free kick:
  1. has Free Kick Specialist
  2. higher mean(Shooting, Finishing, Passing, Creativity)
  3. stable player key

Corner:
  1. has Corner Specialist (then Set Piece Taker as secondary tag)
  2. higher mean(Crossing, Passing, Creativity)
  3. stable player key

Captain:
  no authoritative game formula is known. Keep any captain recommendation visibly labelled COMPANION HEURISTIC or leave captain user-selected.
```

Do not allow specialist logic to alter the main Formation Role Score. It can be shown in the final Team Plan as an optional section.

## 19. Controlled current-squad validation fixture — LIVE FACT, NOT GENERIC APP DATA

Source: `top_eleven_windows_runtime_20260909_215349` controlled match JoinMatchResponse. This fixture exists for regression tests and ID/name correlation. **Do not hard-code it as the product’s squad.**

| Player | ID | Age | Natural roles | Related roles | Playstyle | Repeated/current SA view | Position | Hidden talent raw |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Paul Brace | 194381156954 | 21 | DC, DR | MR, DMC, DL | STOPPER / STANDARD / pts 1800 | Aerial Defender | 190,380 | 0.855242 |
| Jiri Stanek | 194382186063 | 23 | GK | — | BOX_COMMANDER / INTERMEDIATE / pts 5400 | Unknown / none | 71,500 | 0.908179 |
| Victor Aslan | 194384635957 | 22 | DL, DC | DR, DMC, ML | BALL_PLAYING_DC / INTERMEDIATE / pts 5400 | One-on-One Stopper | 190,640 | 0.868767 |
| James Hughes | 194389168191 | 20 | DR, DC | MR, DMC, DL | WING_BACK / INTERMEDIATE / pts 5400 | One-on-One Stopper | 260,880 | 0.990011 |
| Remus Iacob | 194391862721 | 20 | DL | DC, ML | WING_BACK / INTERMEDIATE / pts 5400 | Aerial Defender | 260,80 | 0.934879 |
| Stefano Luiu | 194392085787 | 22 | MC | AMC, DMC | MEZZALA / INTERMEDIATE / pts 3543 | Defensive Wall | 460,700 | 1.058791 |
| David Andrews | 194393149035 | 20 | MC | AMC, DMC | BOX_TO_BOX / INTERMEDIATE / pts 5276 | Penalty Kick Specialist, Long Shots | 470,320 | 0.930578 |
| Fidel Sánchez | 194398971367 | 20 | AMC, AMR | AML, MR, ST, MC | FALSE_NINE / INTERMEDIATE / pts 5400 | One-on-One Scorer | 650,580 | 0.829302 |
| Sergey Kazachenko | 194398973253 | 19 | AML | AMR, ML | WINGER / INTERMEDIATE / pts 2574 | Penalty Kick Specialist | 710,100 | 1.136928 |
| Richard Kilroy | 194406020186 | 18 | AMR | AML, MR | INSIDE_FORWARD / INTERMEDIATE / pts 1803 | Free Kick Specialist | 710,900 | 1.004187 |
| Gosling Lataille | 194406020214 | 18 | ST | AMR, AML, AMC | POACHER / INTERMEDIATE / pts 1803 | Playmaker | 820,380 | 1.085624 |
| Elinaldo Morais da Silva | 194395211507 | 26 | GK | — | NO_PLAYSTYLE / LOCKED / pts 0 | Penalty Kick Stopper | Sub 1 | 1.193511 |
| Alaa Ben Aïssa | 194377281797 | 25 | DL, DC | DR, DMC, ML | NO_PLAYSTYLE / LOCKED / pts 0 | Aerial Defender | Sub 2 | 1.146648 |
| Matt Prescott | 194382309130 | 25 | MC | AMC, DMC | BOX_TO_BOX / INTERMEDIATE / pts 4017 | raw scalar 16 (Blocker) | Sub 3 | 1.006266 |
| Julien Ahandour | 194377257527 | 25 | AML, AMR, AMC | MR, ST, MC, ML | INSIDE_FORWARD / INTERMEDIATE / pts 5400 | Free Kick Specialist | Sub 4 | 1.136325 |
| Ariel Bravo | 194377743040 | 24 | AMR | AML, MR | WINGER / LOCKED / pts 285 | Free Kick Specialist | Sub 5 | 1.113899 |
| François Roelandt | 194385474641 | 23 | ST | AMR, AML, AMC | FALSE_NINE / INTERMEDIATE / pts 4726 | Playmaker | Sub 6 | 0.998113 |

**Hidden Talent boundary:** Talent is a real protocol field, but recovered local training/distribution paths do not establish it as a training or match-performance multiplier. It is excluded from all recommendation calculations.

### 19.1 Raw player fixture JSON (protocol-scale attributes preserved)

The following compact JSON is intentionally included so the app creator has a test fixture for parser/model migration. Raw `attributesRaw` values are protocol values and are **not app-facing percentage values**.

```json
[
  {
    "id": "194381156954",
    "name": "Paul Brace",
    "age": 21,
    "quality": 45,
    "condition": 99,
    "moral": 109,
    "roles": [
      "DC",
      "DR"
    ],
    "relatedRoles": [
      "MR",
      "DMC",
      "DL"
    ],
    "specialAbilities": [
      "Aerial Defender"
    ],
    "specialAbilityRaw": 3,
    "secondSpecialAbilityRaw": 16,
    "thirdSpecialAbilityRaw": 16,
    "playstyleType": "STOPPER",
    "playstyleLevel": "STANDARD",
    "playstylePoints": 1800,
    "position": {
      "x": 190,
      "y": 380
    },
    "substitutionOrder": null,
    "talent": 0.8552418279931722,
    "attributesRaw": {
      "attributeCreativity": 2599,
      "attributeAggression": 4722,
      "attributeStrength": 4905,
      "attributeShootingRushingOut": 2976,
      "attributeMarkingKicking": 7101,
      "attributeSpeed": 3663,
      "attributeFitness": 5459,
      "attributePassingReflexes": 3283,
      "attributeTacklingThrowing": 5133,
      "attributeDribblingAgility": 3228,
      "attributeHeadingAerialReach": 5133,
      "attributeFinishingCommunication": 3237,
      "attributePositioningPunching": 5907,
      "attributeCrossingAnticipation": 4335,
      "attributeBraveryConcentration": 6695
    },
    "tier": {
      "tier": "PLAYER_TIER_1",
      "attributeGainPerKeyAttribute": 2.5
    },
    "sharpness": {
      "currentValue": 4,
      "progressToNextValue": 1,
      "maxSharpnessValue": 5
    }
  },
  {
    "id": "194382186063",
    "name": "Jiri Stanek",
    "age": 23,
    "quality": 43,
    "condition": 99,
    "moral": 104,
    "roles": [
      "GK"
    ],
    "relatedRoles": [],
    "specialAbilities": [
      "Unknown / none"
    ],
    "specialAbilityRaw": 0,
    "secondSpecialAbilityRaw": 16,
    "thirdSpecialAbilityRaw": 16,
    "playstyleType": "BOX_COMMANDER",
    "playstyleLevel": "INTERMEDIATE",
    "playstylePoints": 5400,
    "position": {
      "x": 71,
      "y": 500
    },
    "substitutionOrder": null,
    "talent": 0.9081793821916009,
    "attributesRaw": {
      "attributeCreativity": 3434,
      "attributeAggression": 3089,
      "attributeStrength": 2879,
      "attributeShootingRushingOut": 4510,
      "attributeMarkingKicking": 4701,
      "attributeSpeed": 3386,
      "attributeFitness": 5502,
      "attributePassingReflexes": 4491,
      "attributeTacklingThrowing": 4629,
      "attributeDribblingAgility": 5286,
      "attributeHeadingAerialReach": 5040,
      "attributeFinishingCommunication": 4800,
      "attributePositioningPunching": 4705,
      "attributeCrossingAnticipation": 4676,
      "attributeBraveryConcentration": 4592
    },
    "tier": {
      "tier": "PLAYER_TIER_2",
      "attributeGainPerKeyAttribute": 7.5
    },
    "sharpness": {
      "currentValue": 4,
      "progressToNextValue": 1,
      "maxSharpnessValue": 5
    }
  },
  {
    "id": "194384635957",
    "name": "Victor Aslan",
    "age": 22,
    "quality": 44,
    "condition": 99,
    "moral": 104,
    "roles": [
      "DL",
      "DC"
    ],
    "relatedRoles": [
      "DR",
      "DMC",
      "ML"
    ],
    "specialAbilities": [
      "One-on-One Stopper"
    ],
    "specialAbilityRaw": 2,
    "secondSpecialAbilityRaw": 16,
    "thirdSpecialAbilityRaw": 16,
    "playstyleType": "BALL_PLAYING_DC",
    "playstyleLevel": "INTERMEDIATE",
    "playstylePoints": 5400,
    "position": {
      "x": 190,
      "y": 640
    },
    "substitutionOrder": null,
    "talent": 0.8687666442704207,
    "attributesRaw": {
      "attributeCreativity": 2607,
      "attributeAggression": 4875,
      "attributeStrength": 5104,
      "attributeShootingRushingOut": 2860,
      "attributeMarkingKicking": 7025,
      "attributeSpeed": 3367,
      "attributeFitness": 4950,
      "attributePassingReflexes": 2518,
      "attributeTacklingThrowing": 5543,
      "attributeDribblingAgility": 3080,
      "attributeHeadingAerialReach": 4981,
      "attributeFinishingCommunication": 2821,
      "attributePositioningPunching": 6217,
      "attributeCrossingAnticipation": 5042,
      "attributeBraveryConcentration": 6372
    },
    "tier": {
      "tier": "PLAYER_TIER_1",
      "attributeGainPerKeyAttribute": 2.5
    },
    "sharpness": {
      "currentValue": 4,
      "progressToNextValue": 1,
      "maxSharpnessValue": 5
    }
  },
  {
    "id": "194389168191",
    "name": "James Hughes",
    "age": 20,
    "quality": 44,
    "condition": 99,
    "moral": 109,
    "roles": [
      "DR",
      "DC"
    ],
    "relatedRoles": [
      "MR",
      "DMC",
      "DL"
    ],
    "specialAbilities": [
      "One-on-One Stopper"
    ],
    "specialAbilityRaw": 2,
    "secondSpecialAbilityRaw": 16,
    "thirdSpecialAbilityRaw": 16,
    "playstyleType": "WING_BACK",
    "playstyleLevel": "INTERMEDIATE",
    "playstylePoints": 5400,
    "position": {
      "x": 260,
      "y": 880
    },
    "substitutionOrder": null,
    "talent": 0.9900105818748927,
    "attributesRaw": {
      "attributeCreativity": 3095,
      "attributeAggression": 4432,
      "attributeStrength": 3214,
      "attributeShootingRushingOut": 3975,
      "attributeMarkingKicking": 5339,
      "attributeSpeed": 4417,
      "attributeFitness": 5105,
      "attributePassingReflexes": 4036,
      "attributeTacklingThrowing": 5089,
      "attributeDribblingAgility": 4330,
      "attributeHeadingAerialReach": 3820,
      "attributeFinishingCommunication": 3689,
      "attributePositioningPunching": 5260,
      "attributeCrossingAnticipation": 5076,
      "attributeBraveryConcentration": 5595
    },
    "tier": {
      "tier": "PLAYER_TIER_2",
      "attributeGainPerKeyAttribute": 7.5
    },
    "sharpness": {
      "currentValue": 4,
      "progressToNextValue": 1,
      "maxSharpnessValue": 5
    }
  },
  {
    "id": "194391862721",
    "name": "Remus Iacob",
    "age": 20,
    "quality": 45,
    "condition": 99,
    "moral": 104,
    "roles": [
      "DL"
    ],
    "relatedRoles": [
      "DC",
      "ML"
    ],
    "specialAbilities": [
      "Aerial Defender"
    ],
    "specialAbilityRaw": 3,
    "secondSpecialAbilityRaw": 16,
    "thirdSpecialAbilityRaw": 16,
    "playstyleType": "WING_BACK",
    "playstyleLevel": "INTERMEDIATE",
    "playstylePoints": 5400,
    "position": {
      "x": 260,
      "y": 80
    },
    "substitutionOrder": null,
    "talent": 0.9348794207991773,
    "attributesRaw": {
      "attributeCreativity": 3239,
      "attributeAggression": 4870,
      "attributeStrength": 3925,
      "attributeShootingRushingOut": 3392,
      "attributeMarkingKicking": 5887,
      "attributeSpeed": 5267,
      "attributeFitness": 5465,
      "attributePassingReflexes": 3738,
      "attributeTacklingThrowing": 5039,
      "attributeDribblingAgility": 4419,
      "attributeHeadingAerialReach": 3824,
      "attributeFinishingCommunication": 3640,
      "attributePositioningPunching": 5378,
      "attributeCrossingAnticipation": 4969,
      "attributeBraveryConcentration": 5731
    },
    "tier": {
      "tier": "PLAYER_TIER_1",
      "attributeGainPerKeyAttribute": 2.5
    },
    "sharpness": {
      "currentValue": 4,
      "progressToNextValue": 1,
      "maxSharpnessValue": 5
    }
  },
  {
    "id": "194392085787",
    "name": "Stefano Luiu",
    "age": 22,
    "quality": 44,
    "condition": 99,
    "moral": 98,
    "roles": [
      "MC"
    ],
    "relatedRoles": [
      "AMC",
      "DMC"
    ],
    "specialAbilities": [
      "Defensive Wall"
    ],
    "specialAbilityRaw": 4,
    "secondSpecialAbilityRaw": 16,
    "thirdSpecialAbilityRaw": 16,
    "playstyleType": "MEZZALA",
    "playstyleLevel": "INTERMEDIATE",
    "playstylePoints": 3543,
    "position": {
      "x": 460,
      "y": 700
    },
    "substitutionOrder": null,
    "talent": 1.058790894702713,
    "attributesRaw": {
      "attributeCreativity": 4246,
      "attributeAggression": 3160,
      "attributeStrength": 2838,
      "attributeShootingRushingOut": 4657,
      "attributeMarkingKicking": 4718,
      "attributeSpeed": 5176,
      "attributeFitness": 5211,
      "attributePassingReflexes": 6432,
      "attributeTacklingThrowing": 4777,
      "attributeDribblingAgility": 5795,
      "attributeHeadingAerialReach": 3140,
      "attributeFinishingCommunication": 3457,
      "attributePositioningPunching": 5622,
      "attributeCrossingAnticipation": 3255,
      "attributeBraveryConcentration": 4755
    },
    "tier": {
      "tier": "PLAYER_TIER_1",
      "attributeGainPerKeyAttribute": 2.5
    },
    "sharpness": {
      "currentValue": 4,
      "progressToNextValue": 1,
      "maxSharpnessValue": 5
    }
  },
  {
    "id": "194393149035",
    "name": "David Andrews",
    "age": 20,
    "quality": 44,
    "condition": 99,
    "moral": 100,
    "roles": [
      "MC"
    ],
    "relatedRoles": [
      "AMC",
      "DMC"
    ],
    "specialAbilities": [
      "Penalty Kick Specialist",
      "Long Shots"
    ],
    "specialAbilityRaw": 9,
    "secondSpecialAbilityRaw": 7,
    "thirdSpecialAbilityRaw": 16,
    "playstyleType": "BOX_TO_BOX",
    "playstyleLevel": "INTERMEDIATE",
    "playstylePoints": 5276,
    "position": {
      "x": 470,
      "y": 320
    },
    "substitutionOrder": null,
    "talent": 0.9305777223998783,
    "attributesRaw": {
      "attributeCreativity": 3990,
      "attributeAggression": 3719,
      "attributeStrength": 2592,
      "attributeShootingRushingOut": 4557,
      "attributeMarkingKicking": 5090,
      "attributeSpeed": 5776,
      "attributeFitness": 5144,
      "attributePassingReflexes": 6756,
      "attributeTacklingThrowing": 4289,
      "attributeDribblingAgility": 5766,
      "attributeHeadingAerialReach": 3168,
      "attributeFinishingCommunication": 2919,
      "attributePositioningPunching": 5295,
      "attributeCrossingAnticipation": 2768,
      "attributeBraveryConcentration": 4329
    },
    "tier": {
      "tier": "PLAYER_TIER_2",
      "attributeGainPerKeyAttribute": 7.5
    },
    "sharpness": {
      "currentValue": 4,
      "progressToNextValue": 1,
      "maxSharpnessValue": 5
    }
  },
  {
    "id": "194398971367",
    "name": "Fidel Sánchez",
    "age": 20,
    "quality": 45,
    "condition": 99,
    "moral": 121,
    "roles": [
      "AMC",
      "AMR"
    ],
    "relatedRoles": [
      "AML",
      "MR",
      "ST",
      "MC"
    ],
    "specialAbilities": [
      "One-on-One Scorer"
    ],
    "specialAbilityRaw": 6,
    "secondSpecialAbilityRaw": 16,
    "thirdSpecialAbilityRaw": 16,
    "playstyleType": "FALSE_NINE",
    "playstyleLevel": "INTERMEDIATE",
    "playstylePoints": 5400,
    "position": {
      "x": 650,
      "y": 580
    },
    "substitutionOrder": null,
    "talent": 0.8293020326078666,
    "attributesRaw": {
      "attributeCreativity": 5270,
      "attributeAggression": 3422,
      "attributeStrength": 3159,
      "attributeShootingRushingOut": 5290,
      "attributeMarkingKicking": 3046,
      "attributeSpeed": 5154,
      "attributeFitness": 5682,
      "attributePassingReflexes": 6138,
      "attributeTacklingThrowing": 3143,
      "attributeDribblingAgility": 5291,
      "attributeHeadingAerialReach": 5218,
      "attributeFinishingCommunication": 5511,
      "attributePositioningPunching": 3809,
      "attributeCrossingAnticipation": 4411,
      "attributeBraveryConcentration": 3084
    },
    "tier": {
      "tier": "PLAYER_TIER_1",
      "attributeGainPerKeyAttribute": 2.5
    },
    "sharpness": {
      "currentValue": 4,
      "progressToNextValue": 1,
      "maxSharpnessValue": 5
    }
  },
  {
    "id": "194398973253",
    "name": "Sergey Kazachenko",
    "age": 19,
    "quality": 45,
    "condition": 99,
    "moral": 133,
    "roles": [
      "AML"
    ],
    "relatedRoles": [
      "AMR",
      "ML"
    ],
    "specialAbilities": [
      "Penalty Kick Specialist"
    ],
    "specialAbilityRaw": 9,
    "secondSpecialAbilityRaw": 16,
    "thirdSpecialAbilityRaw": 16,
    "playstyleType": "WINGER",
    "playstyleLevel": "INTERMEDIATE",
    "playstylePoints": 2574,
    "position": {
      "x": 710,
      "y": 100
    },
    "substitutionOrder": null,
    "talent": 1.1369283819702523,
    "attributesRaw": {
      "attributeCreativity": 4826,
      "attributeAggression": 3217,
      "attributeStrength": 3616,
      "attributeShootingRushingOut": 5408,
      "attributeMarkingKicking": 4116,
      "attributeSpeed": 4712,
      "attributeFitness": 5205,
      "attributePassingReflexes": 4970,
      "attributeTacklingThrowing": 4237,
      "attributeDribblingAgility": 5278,
      "attributeHeadingAerialReach": 4034,
      "attributeFinishingCommunication": 5715,
      "attributePositioningPunching": 3902,
      "attributeCrossingAnticipation": 5284,
      "attributeBraveryConcentration": 3539
    },
    "tier": {
      "tier": "PLAYER_TIER_1",
      "attributeGainPerKeyAttribute": 2.5
    },
    "sharpness": {
      "currentValue": 4,
      "progressToNextValue": 1,
      "maxSharpnessValue": 5
    }
  },
  {
    "id": "194406020186",
    "name": "Richard Kilroy",
    "age": 18,
    "quality": 50,
    "condition": 99,
    "moral": 133,
    "roles": [
      "AMR"
    ],
    "relatedRoles": [
      "AML",
      "MR"
    ],
    "specialAbilities": [
      "Free Kick Specialist"
    ],
    "specialAbilityRaw": 10,
    "secondSpecialAbilityRaw": 16,
    "thirdSpecialAbilityRaw": 16,
    "playstyleType": "INSIDE_FORWARD",
    "playstyleLevel": "INTERMEDIATE",
    "playstylePoints": 1803,
    "position": {
      "x": 710,
      "y": 900
    },
    "substitutionOrder": null,
    "talent": 1.004187288803998,
    "attributesRaw": {
      "attributeCreativity": 5539,
      "attributeAggression": 4838,
      "attributeStrength": 4536,
      "attributeShootingRushingOut": 5285,
      "attributeMarkingKicking": 4922,
      "attributeSpeed": 5416,
      "attributeFitness": 5206,
      "attributePassingReflexes": 5568,
      "attributeTacklingThrowing": 4314,
      "attributeDribblingAgility": 5207,
      "attributeHeadingAerialReach": 4615,
      "attributeFinishingCommunication": 5433,
      "attributePositioningPunching": 4591,
      "attributeCrossingAnticipation": 5182,
      "attributeBraveryConcentration": 5024
    },
    "tier": {
      "tier": "PLAYER_TIER_2",
      "attributeGainPerKeyAttribute": 7.5
    },
    "sharpness": {
      "currentValue": 4,
      "progressToNextValue": 1,
      "maxSharpnessValue": 5
    }
  },
  {
    "id": "194406020214",
    "name": "Gosling Lataille",
    "age": 18,
    "quality": 51,
    "condition": 99,
    "moral": 121,
    "roles": [
      "ST"
    ],
    "relatedRoles": [
      "AMR",
      "AML",
      "AMC"
    ],
    "specialAbilities": [
      "Playmaker"
    ],
    "specialAbilityRaw": 5,
    "secondSpecialAbilityRaw": 16,
    "thirdSpecialAbilityRaw": 16,
    "playstyleType": "POACHER",
    "playstyleLevel": "INTERMEDIATE",
    "playstylePoints": 1803,
    "position": {
      "x": 820,
      "y": 380
    },
    "substitutionOrder": null,
    "talent": 1.0856239125554454,
    "attributesRaw": {
      "attributeCreativity": 5095,
      "attributeAggression": 4690,
      "attributeStrength": 5352,
      "attributeShootingRushingOut": 5308,
      "attributeMarkingKicking": 4582,
      "attributeSpeed": 5443,
      "attributeFitness": 4983,
      "attributePassingReflexes": 5262,
      "attributeTacklingThrowing": 4515,
      "attributeDribblingAgility": 5274,
      "attributeHeadingAerialReach": 5571,
      "attributeFinishingCommunication": 5734,
      "attributePositioningPunching": 5417,
      "attributeCrossingAnticipation": 4581,
      "attributeBraveryConcentration": 4907
    },
    "tier": {
      "tier": "PLAYER_TIER_3",
      "attributeGainPerKeyAttribute": 12.5
    },
    "sharpness": {
      "currentValue": 4,
      "progressToNextValue": 1,
      "maxSharpnessValue": 5
    }
  },
  {
    "id": "194395211507",
    "name": "Elinaldo Morais da Silva",
    "age": 26,
    "quality": 37,
    "condition": 99,
    "moral": 81,
    "roles": [
      "GK"
    ],
    "relatedRoles": [],
    "specialAbilities": [
      "Penalty Kick Stopper"
    ],
    "specialAbilityRaw": 1,
    "secondSpecialAbilityRaw": 16,
    "thirdSpecialAbilityRaw": 16,
    "playstyleType": "NO_PLAYSTYLE",
    "playstyleLevel": "LOCKED",
    "playstylePoints": 0,
    "position": {
      "substitutionOrder": 1
    },
    "substitutionOrder": 1,
    "talent": 1.193510567518868,
    "attributesRaw": {
      "attributeCreativity": 3459,
      "attributeAggression": 2976,
      "attributeStrength": 3467,
      "attributeShootingRushingOut": 3889,
      "attributeMarkingKicking": 3807,
      "attributeSpeed": 2964,
      "attributeFitness": 4078,
      "attributePassingReflexes": 3953,
      "attributeTacklingThrowing": 4450,
      "attributeDribblingAgility": 3960,
      "attributeHeadingAerialReach": 3597,
      "attributeFinishingCommunication": 4131,
      "attributePositioningPunching": 3712,
      "attributeCrossingAnticipation": 3823,
      "attributeBraveryConcentration": 3686
    },
    "tier": {
      "tier": "NO_PLAYER_TIER",
      "attributeGainPerKeyAttribute": 0
    },
    "sharpness": {
      "currentValue": 4,
      "progressToNextValue": 1,
      "maxSharpnessValue": 5
    }
  },
  {
    "id": "194377281797",
    "name": "Alaa Ben Aïssa",
    "age": 25,
    "quality": 33,
    "condition": 99,
    "moral": 83,
    "roles": [
      "DL",
      "DC"
    ],
    "relatedRoles": [
      "DR",
      "DMC",
      "ML"
    ],
    "specialAbilities": [
      "Aerial Defender"
    ],
    "specialAbilityRaw": 3,
    "secondSpecialAbilityRaw": 16,
    "thirdSpecialAbilityRaw": 16,
    "playstyleType": "NO_PLAYSTYLE",
    "playstyleLevel": "LOCKED",
    "playstylePoints": 0,
    "position": {
      "substitutionOrder": 2
    },
    "substitutionOrder": 2,
    "talent": 1.1466477352736657,
    "attributesRaw": {
      "attributeCreativity": 2161,
      "attributeAggression": 3156,
      "attributeStrength": 3660,
      "attributeShootingRushingOut": 1986,
      "attributeMarkingKicking": 4874,
      "attributeSpeed": 3829,
      "attributeFitness": 4616,
      "attributePassingReflexes": 2784,
      "attributeTacklingThrowing": 3583,
      "attributeDribblingAgility": 2758,
      "attributeHeadingAerialReach": 2903,
      "attributeFinishingCommunication": 2251,
      "attributePositioningPunching": 4442,
      "attributeCrossingAnticipation": 3606,
      "attributeBraveryConcentration": 4191
    },
    "tier": {
      "tier": "PLAYER_TIER_1",
      "attributeGainPerKeyAttribute": 2.5
    },
    "sharpness": {
      "currentValue": 4,
      "progressToNextValue": 1,
      "maxSharpnessValue": 5
    }
  },
  {
    "id": "194382309130",
    "name": "Matt Prescott",
    "age": 25,
    "quality": 34,
    "condition": 99,
    "moral": 81,
    "roles": [
      "MC"
    ],
    "relatedRoles": [
      "AMC",
      "DMC"
    ],
    "specialAbilities": [],
    "specialAbilityRaw": 16,
    "secondSpecialAbilityRaw": 16,
    "thirdSpecialAbilityRaw": 16,
    "playstyleType": "BOX_TO_BOX",
    "playstyleLevel": "INTERMEDIATE",
    "playstylePoints": 4017,
    "position": {
      "substitutionOrder": 3
    },
    "substitutionOrder": 3,
    "talent": 1.0062658993916949,
    "attributesRaw": {
      "attributeCreativity": 2730,
      "attributeAggression": 2046,
      "attributeStrength": 2513,
      "attributeShootingRushingOut": 3193,
      "attributeMarkingKicking": 3134,
      "attributeSpeed": 5065,
      "attributeFitness": 5771,
      "attributePassingReflexes": 5211,
      "attributeTacklingThrowing": 3525,
      "attributeDribblingAgility": 4664,
      "attributeHeadingAerialReach": 2188,
      "attributeFinishingCommunication": 2484,
      "attributePositioningPunching": 3306,
      "attributeCrossingAnticipation": 2498,
      "attributeBraveryConcentration": 3046
    },
    "tier": {
      "tier": "PLAYER_TIER_1",
      "attributeGainPerKeyAttribute": 2.5
    },
    "sharpness": {
      "currentValue": 4,
      "progressToNextValue": 1,
      "maxSharpnessValue": 5
    }
  },
  {
    "id": "194377257527",
    "name": "Julien Ahandour",
    "age": 25,
    "quality": 37,
    "condition": 99,
    "moral": 85,
    "roles": [
      "AML",
      "AMR",
      "AMC"
    ],
    "relatedRoles": [
      "MR",
      "ST",
      "MC",
      "ML"
    ],
    "specialAbilities": [
      "Free Kick Specialist"
    ],
    "specialAbilityRaw": 10,
    "secondSpecialAbilityRaw": 16,
    "thirdSpecialAbilityRaw": 16,
    "playstyleType": "INSIDE_FORWARD",
    "playstyleLevel": "INTERMEDIATE",
    "playstylePoints": 5400,
    "position": {
      "substitutionOrder": 4
    },
    "substitutionOrder": 4,
    "talent": 1.1363247244415475,
    "attributesRaw": {
      "attributeCreativity": 3461,
      "attributeAggression": 1350,
      "attributeStrength": 2201,
      "attributeShootingRushingOut": 4601,
      "attributeMarkingKicking": 2581,
      "attributeSpeed": 4425,
      "attributeFitness": 5231,
      "attributePassingReflexes": 5600,
      "attributeTacklingThrowing": 2439,
      "attributeDribblingAgility": 5087,
      "attributeHeadingAerialReach": 4307,
      "attributeFinishingCommunication": 5579,
      "attributePositioningPunching": 2503,
      "attributeCrossingAnticipation": 4786,
      "attributeBraveryConcentration": 2211
    },
    "tier": {
      "tier": "PLAYER_TIER_1",
      "attributeGainPerKeyAttribute": 2.5
    },
    "sharpness": {
      "currentValue": 4,
      "progressToNextValue": 1,
      "maxSharpnessValue": 5
    }
  },
  {
    "id": "194377743040",
    "name": "Ariel Bravo",
    "age": 24,
    "quality": 42,
    "condition": 99,
    "moral": 85,
    "roles": [
      "AMR"
    ],
    "relatedRoles": [
      "AML",
      "MR"
    ],
    "specialAbilities": [
      "Free Kick Specialist"
    ],
    "specialAbilityRaw": 10,
    "secondSpecialAbilityRaw": 16,
    "thirdSpecialAbilityRaw": 16,
    "playstyleType": "WINGER",
    "playstyleLevel": "LOCKED",
    "playstylePoints": 285,
    "position": {
      "substitutionOrder": 5
    },
    "substitutionOrder": 5,
    "talent": 1.1138991684948079,
    "attributesRaw": {
      "attributeCreativity": 4314,
      "attributeAggression": 1876,
      "attributeStrength": 2606,
      "attributeShootingRushingOut": 5790,
      "attributeMarkingKicking": 2554,
      "attributeSpeed": 5754,
      "attributeFitness": 5520,
      "attributePassingReflexes": 6160,
      "attributeTacklingThrowing": 2807,
      "attributeDribblingAgility": 6107,
      "attributeHeadingAerialReach": 2970,
      "attributeFinishingCommunication": 5487,
      "attributePositioningPunching": 2706,
      "attributeCrossingAnticipation": 5905,
      "attributeBraveryConcentration": 2918
    },
    "tier": {
      "tier": "PLAYER_TIER_1",
      "attributeGainPerKeyAttribute": 2.5
    },
    "sharpness": {
      "currentValue": 4,
      "progressToNextValue": 1,
      "maxSharpnessValue": 5
    }
  },
  {
    "id": "194385474641",
    "name": "François Roelandt",
    "age": 23,
    "quality": 44,
    "condition": 99,
    "moral": 85,
    "roles": [
      "ST"
    ],
    "relatedRoles": [
      "AMR",
      "AML",
      "AMC"
    ],
    "specialAbilities": [
      "Playmaker"
    ],
    "specialAbilityRaw": 5,
    "secondSpecialAbilityRaw": 16,
    "thirdSpecialAbilityRaw": 16,
    "playstyleType": "FALSE_NINE",
    "playstyleLevel": "INTERMEDIATE",
    "playstylePoints": 4726,
    "position": {
      "substitutionOrder": 6
    },
    "substitutionOrder": 6,
    "talent": 0.9981132180981805,
    "attributesRaw": {
      "attributeCreativity": 4094,
      "attributeAggression": 2436,
      "attributeStrength": 4537,
      "attributeShootingRushingOut": 6346,
      "attributeMarkingKicking": 2977,
      "attributeSpeed": 5710,
      "attributeFitness": 4464,
      "attributePassingReflexes": 5837,
      "attributeTacklingThrowing": 2765,
      "attributeDribblingAgility": 5744,
      "attributeHeadingAerialReach": 4499,
      "attributeFinishingCommunication": 6782,
      "attributePositioningPunching": 4082,
      "attributeCrossingAnticipation": 3465,
      "attributeBraveryConcentration": 2901
    },
    "tier": {
      "tier": "PLAYER_TIER_1",
      "attributeGainPerKeyAttribute": 2.5
    },
    "sharpness": {
      "currentValue": 4,
      "progressToNextValue": 1,
      "maxSharpnessValue": 5
    }
  }
]
```

## 20. Squad Balance — LIVE FACT, optional information only

State enum: Critical=1, Poor=2, Good=3, Superb=4, Synergized=5, Harmonius=6. Controlled fixed-XI swaps produced reversible server scores, proving Balance is deterministic for those fixed inputs, but the internal server formula remains private/unresolved. Example controlled sequence:

| State | Balance |
| --- | --- |
| baseline Harmonius | 9.83570991248378 |
| after swap 1 Superb | 8.761934971806108 |
| after swap 2 Good | 7.689068426888704 |
| after swap 3 Poor | 6.6168994981265605 |
| restore 1 Good | 7.690674438804233 |
| restore 2 Superb | 8.763540983721638 |
| full restore Harmonius | 9.83570991248378 |

Captured individual reversible deltas in that controlled sequence were about 1.07 each (Kazachenko↔Lataille 1.073774940677673; Andrews↔Sánchez 1.072866544917404; Luiu↔Kilroy 1.072168928762143). Do **not** turn these into a universal formula. Balance is optional validation/display if imported from the server; it does not select the XI.

## 21. Storage and migration contract

Keep localStorage prefix `te:` and preserve all current users. Introduce schema versions; migration must be idempotent. Recommended migration rules:

```text
1. copy existing v5.2.4 player record; never mutate source in-place before validation
2. map `positions`/roles to `roles`; remove DML/DMR only from CURRENT selectable roles, warn if an old record contains them
3. add relatedRoles=[] when absent
4. convert playstyle string -> playstyle object {type, level:unknown/0, ...}; do not invent level
5. convert specialAbilities to array WITHOUT slice(0,2)
6. preserve all attributes/OVR/name/age/photo/scanner metadata
7. preserve normal drill level/unlock state and Master stock
8. invalidate old saved formation/tactic recommendation caches because their scoring models are obsolete
9. tag gameDataVersion="build_30527" and model versions separately
```

Suggested model version constants: `FORMATION_MODEL=30527-role-v1`, `TACTICS_MODEL=30527-drain-fit-v1`, `MENTOR_MODEL=30527-synergy-v1`, `TRAINING_MODEL=30527-white-beam-v1`. Static game-data version and algorithm model version are different concepts.

## 22. Module/code implementation plan

| File/module | Required action |
| --- | --- |
| `js/data.js` | Remove current DML/DMR selectable positions; current 19 SAs; current playstyle definitions/eligibility; keep presentation labels but source canonical build data. |
| `js/players.js` | Remove `specialAbilities.slice(0,2)`; add relatedRoles and full playstyle object migration; current-role validation. |
| `js/formation.js` | Replace adjacency/OVR/posBonus/greedy engine with §9 global assignment; retain only UI hooks that remain useful. |
| NEW `js/pitch-engine.js` or inside formation module | Implement exact role rectangles, repeated-role spacing, 0–1000 storage and portrait rendering transform. |
| `js/recommendations.js` | Delete tactic presets and hand mentor weights; either split into tactics-engine/mentor-engine/specialists or keep as façade calling new engines. |
| NEW `js/tactics-engine.js` | Canonical 11 enums, exact drain calculator, checksums, lineup metrics, option-fit model, exhaustive 19,440 search. |
| NEW `js/mentor-engine.js` | Captured mentor config + lexicographic synergy/coverage model; preserve raw effects. |
| NEW `js/team-plan-engine.js` | Orchestrate formation→tactics→mentor and dependency invalidation; serialize TeamPlan. |
| `js/training-engine.js` | Change target=max to mean(top3), greedy to beam width 250, keep grey=0 and multi-white coverage reward, stock rules. |
| `js/team-training-engine.js` | Use actual player needs and per-player credits; beam search; keep TeamPlay separate. |
| `js/scanner-engine.js` | Keep recognition logic; remove DML/DMR recognition/current outputs and pipe into expanded player model. |
| `js/storage.js` | Add idempotent schema migration and separate gameData/modelVersion/cache keys. |
| `index.html` / `js/app.js` | Merge Formation+Tactics+Mentor UI into Team Plan; Training gets Individual/Team tabs; bottom nav Home/Squad/Team Plan/Training/More. |
| `tests/core-tests.js` | Replace legacy score assertions; add all deterministic tests from §23. |
| `data/build_30527/*` | Retain drill/intensity/white maps; add canonical roles/pitch/playstyles/SAs/tactics/mentor snapshot JSON generated from this Bible. |

Preserve v5.2.4 visual assets, screenshots, drill images and mentor portraits. This is a logic/data restructuring, not an instruction to throw away the UI theme.

## 23. Non-negotiable automated tests

The next build is not complete until all of these pass:

- [ ] Current role list is exactly 12; DML/DMR are absent from selectable roles.
- [ ] All 12 role rectangles match §4 exactly; every generated X/Y is inside the assigned role rectangle.
- [ ] Two/three same-role players are evenly spaced and deterministic.
- [ ] All 25 attribute IDs and all 12 current role-key maps match §5.
- [ ] Natural and related roles come from player data; no adjacency map exists.
- [ ] Role Score is target-role key-skill mean; OVR never affects it.
- [ ] Global assignment cannot assign one player twice and beats/equals a greedy baseline on crafted versatile-player fixture.
- [ ] Current playstyle enum/eligibility table matches §7; Ball Playing GK not offered.
- [ ] Current SA enum is IDs 1..19; Shadow Striker absent; SA array not capped at two.
- [ ] Tactics enum IDs and drain intensity table match §10 exactly, including Stay On Feet=High and all Cross options=Low.
- [ ] Drain grid enumerates exactly 97,200 combos; fixed mentality exactly 19,440.
- [ ] Drain class counts exactly Low=963, Medium=77,823, High=18,414 using default table.
- [ ] Per-mentality class counts match §10.2.
- [ ] Changing approach/drain does not change cached formation unless rebuild is requested.
- [ ] Mentor raw effect arrays round-trip without interpretation/loss.
- [ ] Training normal drill catalogue count=29; Master count=4; intensity XP/condition map exact.
- [ ] Grey attributes contribute zero training utility.
- [ ] A drill hitting several weak white skills can outrank a single-white drill when its calculated utility is greater.
- [ ] Master duplicates cannot exceed stock; normal duplicates remain legal.
- [ ] Beam search returns exactly six legal slots and is deterministic.
- [ ] Existing scanner regression fixtures and save-blocking aggregate/OVR checks still pass.
- [ ] v5.2.4 user data migrates without losing players, attributes, drill levels, stock, images or abilities.

## 24. Implementation sequence — do this in order

1. **Freeze/backup v5.2.4** and add migration tests first.  
2. Build canonical build-30527 data modules from §§4–8, 10, 12, 14.  
3. Upgrade player schema + migration; remove DML/DMR/two-SA/stale-playstyle assumptions.  
4. Replace formation engine and build exact pitch engine; test global XI assignment before UI changes.  
5. Build exact tactics drain calculator and regression checksums, then the tactic-fit search.  
6. Build mentor engine from live effects and connect to selected tactics/XI.  
7. Add TeamPlan orchestrator and persistence.  
8. Restructure UI/navigation into Squad / Team Plan / Training.  
9. Upgrade Individual Training to top3-needs + beam search.  
10. Upgrade Team Training to actual-player needs + beam search.  
11. Reconnect Scanner/Profile/Add/Edit to new schema.  
12. Rework Specialists only after core Team Plan passes.  
13. Run all scanner/core/static/integrity tests plus §23 regression suite.  
14. Only then increment the app build using simple numeric versioning.

## 25. Explicit non-goals / unresolved facts

The coding AI must **not** waste time or invent values for:

- exact private Nordeus match-engine weighting of attributes, playstyles or special abilities;
- exact playstyle level performance multiplier;
- exact mentor Football Engine magnitude or multi-array signature semantics;
- a universal role→SA eligibility matrix not returned for the specific player;
- exact Squad Balance server formula;
- hidden Talent training/performance multiplier;
- exact server normal-training RNG/raw development coefficient/age scaling unless captured;
- exact final training percentage-point prediction;
- private backend code or endpoints.

None of these blocks the app. The companion’s own calculations are deliberately transparent substitutes for decision support, not claims of reproducing Nordeus’s private engine.

## 26. Provenance/source inventory

Primary implementation sources consolidated into this Bible:

- `te_directapk_prod_30527.apk` — SHA-256 `88bd2944a0ea2b3089e3425a8b325264609dfc9e38ef62f75ba6fc1ed74d2ab6`; Unity IL2CPP metadata v39.
- `libil2cpp.so` — SHA-256 `93f260104d6b65356dba433ebf16efe0fb0314eca2ea31850674bca909cc74ce`.
- `BUILD_30527_IMPLEMENTATION_LEDGER.md`.
- `FULL_MINE_REPORT.md`.
- `NATIVE_FORMULAS_PASS1.md` through `NATIVE_FORMULAS_PASS8.md`.
- `te_v39_training_metadata.json`.
- Official-client training capture `top_eleven_network_20260908_153800.jsonl` represented in the v5.2.4 build-30527 JSON package.
- Windows runtime controlled traces: `top_eleven_windows_runtime_20260909_204500`, `...214056`, `...215349` and earlier stability trace.
- Browser/network captures and recovered shared research conversation `Reverse Engineer Tactics Drains.html`.
- Existing application source `top-eleven-tool-v5.2.4(2).zip`.
- `TopEleven_Tool_Logic_Spec_v2.md`, superseded/absorbed by this Bible wherever this Bible is more specific.

Windows build cross-reference observed during research: Microsoft Store app 27.3.0.0 / native Unity IL2CPP. `GameAssembly.dll` SHA-256 `B17A8E9ADEDA6A78245F6AC43CDFAA2B768418507BC340F082576FF6C22EC9FE`; Windows `global-metadata.dat` SHA-256 `B0A1896FAAB8E4B1A9FD01BEDA787FF12F2A3389D94CD79D585C9E95489CDCFC`. Use these only as research provenance, not runtime dependencies for the companion.

## 27. Final creator checklist

Before declaring the next app “done”, the creator should be able to answer **yes** to every statement below:

- The app knows only the 12 current roles and uses exact 0–1000 role rectangles.
- A player’s Role Score uses the exact target-role white skills, not generic OVR or guessed weights.
- The XI is solved globally, so versatile players are allocated where the total team benefits most.
- The pitch is generated from real role geometry and stores exact X/Y.
- Tactics uses all 11 settings, exact IDs, exact drain table and exact threshold arithmetic.
- Approach + drain generates tactics from the chosen XI rather than selecting one of three hard-coded presets.
- Mentor recommendation uses the seven captured current mentors and their actual boost records, without inventing hidden multipliers.
- Playstyle eligibility is role-aware and current; Ball Playing GK is not offered.
- All 19 current SAs are represented; Shadow Striker and the two-SA cap are gone; server-specific ability eligibility is not guessed.
- Individual training rewards intense drills that cover several weak white skills and ignores grey-skill utility.
- Team Training uses the actual players in the group.
- Scanner functionality/regressions survive.
- Existing v5.2.4 user data survives migration.
- Every displayed score is labelled as game fact, live fact or Top Eleven Tool calculation where ambiguity could mislead.

**If all are yes, we have the app we spent the research week trying to reach.**
