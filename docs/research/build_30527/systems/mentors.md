# Mentors — Build 30527

## Proven state flow

```text
MentorsState protobuf
  -> MentorsStateDtoExtensions.ToDomain(...)
  -> MentorsStateDomain
  -> MentorDomain[]
  -> MentorBoostDomain[]
       Id
       CurrentEffects[]
       NextLevelEffects[]
```

Assignment state is explicit. Mentor snapshots also reach live match state.

Protocol:
- `MatchPeriod #45` HomeMentorStateSnapshot
- `MatchPeriod #46` AwayMentorStateSnapshot
- `JoinMatchResponse #76` MentorStateSnapshot
- `#77` HomeMentorStateSnapshot
- `#78` AwayMentorStateSnapshot
- Assign in match request: MentorId #1, MatchId #2
- response: Status #1, FullStateSnapshot #2
- status: ValidationFailed=0, Ok=1, NoEffect=2, NotPresent=3

## Seven captured Mentors

The exact raw arrays and decoded semantics are stored in:

`data/build_30527/index/mentor_effects.json`

### Lewis Green / `wing_commander` — captured level 8
- Tactical: Wing Attacks `[30] -> [30]` = **+30% wing-attack effectiveness**.
- Attribute: Crossing+Heading `[20] -> [40]` = **+20 currently, +40 next** to both attributes for all players.
- Signature: Aerial Dominance `[80] -> [81]` = defender Heading is **80% / 81% less effective** in aerial duels on crosses.

### Alan Shearer / `deadball_specialist` — captured level 8
- Tactical: Solo Dribble `[30] -> [30]` = **+30% dribbling action effectiveness**.
- Attribute: Strength+Shooting `[20] -> [25]`.
- Signature: Ankle Breaker `[25,10] -> [30,10]`:
  - corners/free kicks/penalties +25% currently, +30% next;
  - after a miss, opponent attackers -10% to next attack.

### Rubén Herrera / `saboteur` — level 7
Counter Attack +30%; Creativity+Passing +20→+25; Blind Side makes opponent Marking/Positioning/Speed 30→35% less effective during counters.

### Jonas Braun / `analyst` — level 4
Long Pass +30%; Strength+Positioning +5→+10; Adaptive Blueprint +20→+21 All Attributes to players attacking the opponent's weakest defensive zone after halftime.

### Cesc Fàbregas / `architect` — level 6
Short Pass +30%; Dribbling+Shooting +10→+15; Momentum Chain `[15,8] -> [15,6]`: each successful pass makes the next 15% harder to intercept, with midfield Stamina penalty improving from +8% to +6% per attack.

### Nemanja Vidić / `iron_guard` — level 6
Defensive actions +25% with a fixed 10% extra Condition/Stamina cost; Tackling+Bravery +15→+20; Iron Check `[2,10] -> [5,8]`: condition drain on successful defensive check increases 2→5%, while extra card risk improves 10→8%.

### Claude Makélélé / `enforcer` — level 7
Defensive actions +25% against Short Passes; Bravery+Positioning +20→+25; Parking the Bus `[15,10] -> [20,10]`: while leading, defenders gain +15→+20 defensive attributes, team attacking attributes suffer -10.

## Important correction to older research

The earlier safe rule “do not automatically call every scalar a percent” was correct before localisation was recovered. The current exact game localisation now proves the unit for the indexed boost IDs:
- tactic boosts: `%`
- attribute boosts: `+N`
- signature values: units/positions as described by each localisation string.

Keep raw arrays alongside decoded semantics so we can detect future version changes.

## v0.5.3 unlock/state correction

The current protocol keeps `IsUnlocked` separate from `Progress.Level`; Locked is not a fabricated level 0. Native client logic in `MentorBoostIconResolver.UnlockLevelForKind` proves the family gates:

- Tactical: level 1
- Attribute: level 5
- Signature: level 10

The companion now defaults every Mentor to **Locked** user state and starts at level 1 only after the user marks that Mentor unlocked. Historical captured levels/XP remain research evidence only.

## Still unresolved

- Complete Level 1-10 magnitude table for each Mentor. `CurrentEffects[]` / `NextLevelEffects[]` are runtime state; the static `MentorBoostMap` does not contain the numeric progression ladder.
- Exact native/server Football Engine consumer that applies `MentorBoostDomain.CurrentEffects[]`.
- Hidden stacking/causal outcome maths.

Static live-match update/assign paths inspected so far move Mentor snapshots/state but do not apply visible client-side numerical football arithmetic. Treat server-side application as **STRONG EVIDENCE**, not a recovered formula.

## Current app state in v0.5.3

The captured-account default defect has been removed. Runtime Mentor definitions no longer carry captured level/XP/current/next arrays. User state is `Locked/Unlocked + Level 1-10`; family availability follows the proven 1/5/10 gates. Exact selected-level magnitudes remain explicitly unresolved rather than borrowed from historical captures.

## Previous companion-engine audit (v0.5.2)

`js/mentor-engine.js` currently:

- uses `effectiveMentor()` to overwrite only `level`;
- leaves `tactic.current/next`, `attribute.current/next` and `signature.current/next` untouched;
- counts Attribute coverage for every Mentor regardless of effect-family availability;
- does not include Signature Move value/situation in the ranking;
- ranks by `(direct tactic match, attribute key-skill hits, mentor level, stable order)`;
- contains some **COMPANION** bridges that are not the same thing as the game's exact boost wording:
  - Wing Commander adds a cross-tendency point even though its Tactical boost is specifically “attacks over the Wings”; crossing is more directly relevant to its Aerial Dominance signature.
  - Iron Guard is tied to defensive Approach even though the game wording is “Defensive actions” generally, with extra Condition/Stamina cost.
  - Deadball Specialist is tied to Work It Into The Box + XI dribbling, while its exact Tactical boost is simply Dribbling action effectiveness and its Signature is explicitly the set-piece effect.

This audit is the starting point for v0.5.3. Do not tune weights before fixing effect availability/state modelling.

## Display-name correction

Exact build localisation uses `mentorName_jonasBraun` / **Jonas Braun**. The companion previously displayed “Jonas Brown”. v0.5.2 corrects the display name while retaining the `analyst` internal ID and existing portrait filename.


See `../V053_RESEARCH_CHECKPOINT.md` for the checkpoint that ended the broad research pass and set the next focused targets.


## v0.5.8 decision-logic audit — three effects are not fully integrated

The extracted seven-Mentor effect catalogue is mature enough to describe all three families, but the current companion recommender is **not** complete. `js/mentor-engine.js` (`mentor-synergy-v3`) currently ranks by direct Tactical-family match, active Attribute-family key-skill coverage, Signature-unlocked Boolean, then stable order. Signature *meaning and activation condition* are not yet used.

Therefore v0.5.7/v0.5.8 must **not** be described as having finished Mentor recommendation logic. The next safe architecture is rule-based pre-match fit plus a halftime/live switch advisor, using the exact game-authored Signature conditions without forcing them into invented cross-Mentor percentages.

### Current official progression not yet recovered from embedded static archive

Current official Top Eleven Help Center documentation (checked 14 September 2026) states that each Mentor progresses through Level 10 and then **3 Prestige levels**. Level 10 unlocks Signature Move; Prestige uses XP + Signature Seals to further upgrade the Signature. Official 2027 documentation also states that a Mentor can be swapped at halftime.

- https://nordeus.helpshift.com/hc/en/3-top-eleven-be-a-soccer-manager/faq/1805-leveling-up-mentors/?l=en
- https://nordeus.helpshift.com/hc/en/3-top-eleven-be-a-soccer-manager/faq/1803-top-eleven-2027-is-here/

This is **GAME FACT from current official documentation**, but the exact build-30527 Prestige/Signature-Seal protocol/static representation remains **UNRESOLVED**. No `Prestige`/`Signature Seal` structure exists in the embedded research archive searched during this pass, and the external full game package was unavailable in the Library. Do not fabricate Level 11–13 state fields.

### Community corroboration boundary

Current player reports line up with several exact extracted effects — e.g. Fàbregas with short/possession plans, Herrera with counters, and Lewis Green with crossing/Target-Man service. These reports are stored under `data/build_30527/index/community_evidence_2026-09-14.json` as **COMMUNITY CORROBORATION only**. They do not prove hidden magnitudes or causality.

See `../V058_MENTOR_ST_COMMUNITY_CHECKPOINT.md`.

## v0.5.8 Signature-aware companion rule design

The research architecture for all seven Signature Moves is now preserved in `data/build_30527/index/mentor_signature_rule_design.json`. This is **COMPANION RULE DESIGN**, not a recovered Nordeus ranking formula.

The key rule is to avoid one fabricated cross-Mentor Signature score. Instead, use explicit activation context:
- plan/action context where it is directly inferable (Herrera counters, Green crosses);
- plan context plus explicit cost/risk (Fàbregas, Vidić);
- opportunity-only context where event frequency is unknown (Shearer);
- halftime/live state only where the game wording requires it (Braun weakest defensive zone, Makélélé while leading).

Production `mentor-engine.js` remains `mentor-synergy-v3` in v0.5.8 and has **not** been changed to consume these rules yet. The next Mentor coding task is to add tests for these named conditions/trade-offs before changing recommendation behaviour.
