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

## Still unresolved

The exact native Football Engine function/field consuming `CurrentEffects[]` has not yet been recovered. Therefore do not claim an undocumented effect path or invent hidden stacking maths.

## Current app defect to fix next

Changing a Mentor level in the companion currently changes the displayed/scored level while retaining effect arrays captured at another level. Rebuild this so availability and magnitude are distinct; never synthesize missing level magnitudes.

## Current companion-engine audit (v0.5.2)

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
