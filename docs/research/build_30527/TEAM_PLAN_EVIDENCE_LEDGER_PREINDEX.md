# Top Eleven Tool v0.5.0 — Team Plan Evidence Ledger

**Checkpoint:** 13 September 2026  
**Phase:** v0.5.0 research before logic changes  
**Rule:** game/native facts, live facts, companion logic, community evidence and unresolved behaviour must remain separate.

## 1. Authoritative game package verification

Uploaded reference package: `TopEleven_Full(4).zip`.

Windows package identity from `AppxManifest.xml`:

- Package: `33507NordeusLimited.TopEleven`
- Package version: `27.3.0.0`
- Display name in manifest: `Top Eleven 2026 - Be a Football Manager`
- Architecture: x64 Windows package

The two critical IL2CPP files are byte-for-byte identical to the binaries used in the previous build-30527 reverse-engineering work:

```text
GameAssembly.dll
SHA-256 B17A8E9ADEDA6A78245F6AC43CDFAA2B768418507BC340F082576FF6C22EC9FE

global-metadata.dat
SHA-256 B0A1896FAAB8E4B1A9FD01BEDA787FF12F2A3389D94CD79D585C9E95489CDCFC
```

**Classification: GAME FACT / BUILD IDENTITY CONFIRMED.**

This allows prior native findings for this exact build to be reused without treating them as cross-version assumptions.

---

## 2. Baseline application verification

The v0.5.0 research baseline contains the v0.4.18 known-good scanner state and embedded `PROJECT_HANDOFF.md`.

Regression status before Team Plan modification:

- `tests/package_integrity.py` — PASS
- `tests/static_checks.py` — PASS
- `tests/core-tests.js` — PASS, 263 assertions

Scanner remains frozen.
Formation remains frozen unless a specific regression is later demonstrated.

---

# 3. Set Pieces

## 3.1 GAME FACT — duties represented by the current client

The current client/metadata contains explicit Set Piece Taker state for:

- Captain
- Left Corner Kicker
- Right Corner Kicker
- Left Free Kicker
- Right Free Kicker
- Penalty Kicker
- ordered penalty kick takers

Recovered client identifiers include:

```text
setPieceTakers
savedSetPieceTakers
SetupSavedFormationAndSetPieceTakers
DisplaySetPieceTakers
GetPlayerSetPieceTakerPositions
InitializePenaltyTakers
CanGoalkeeperBeSetAsSetPieceTaker
OnPlayerDroppedOnPenaltyTaker
OnPlayerDroppedOnSetPieceTaker
OnSetPieceTakersChanged
PopulatePenaltyTakers
PopulateSetPieceTaker
PopulateSetPieceTakers
RefreshSetPieceTakers
ResetSetPieceTaker
SetPieceTakersCommunicationLayer
SaveSetPieceTakers
SaveSetPieceTakersRequest
SaveSetPieceTakersResponse
CaptainFieldNumber
SaveSetPieceTakersInvalidSquadVersion
```

The live build-30527 match state captured previously also contained explicit player IDs for captain, both corners, both free kicks, penalty kicker and the penalty order.

**Conclusion:** these are explicit user/team duties stored by the game. The inspected path proves assignment, display, validation and saving.

## 3.2 UNRESOLVED — official automatic ranking

No authoritative `best captain`, `best corner`, `best free kick`, `best penalty` scoring formula has been recovered from the current client/native path.

The recovered client path is strongly centred on user assignment/edit/save behaviour. Absence of an obvious ranking method is not proof that no server-side/default selection behaviour exists, so this remains **UNRESOLVED**, not “the game definitely has no formula.”

## 3.3 GAME FACT — current relevant Special Abilities

Current build metadata confirms these current enum entries exist:

```text
PenaltyKickSpecialist
FreeKickSpecialist
CornerSpecialist
SetPieceTaker
```

Therefore the companion's use of `Set Piece Taker` as a secondary set-piece signal is not based on a removed legacy ability.

## 3.4 CURRENT COMPANION LOGIC

`js/recommendations.js` currently ranks:

### Penalty
1. Penalty Kick Specialist
2. mean(Finishing, Shooting)
3. Creativity
4. stable player key

### Free kick
1. Free Kick Specialist
2. mean(Shooting, Finishing, Passing, Creativity)
3. stable player key

### Corner
1. Corner Specialist
2. Set Piece Taker as a lower-priority specialist tag
3. mean(Crossing, Passing, Creativity)
4. stable player key

### Captain

Current code deliberately returns:

```text
captain: null
"No authoritative captain formula is known; captain is user-selected."
```

Therefore the visible empty Captain slot is **not a render or persistence failure**. It is the explicit output of the recommendation engine.

## 3.5 APP BUG / STATE-MODEL PROBLEM — stale generated assignments

`ensureSetPieces()` currently loads `teamplan:setpieces:v3`, clears an assignment only if that player is no longer in the XI, and fills only empty slots.

That means a previously generated recommendation remains indefinitely while that player stays in the XI, even if:

- the XI changes around them;
- the player's attributes change;
- Special Abilities change;
- the ranking logic changes;
- another starter becomes a better recommendation.

This can make a newly rebuilt Team Plan display old recommendations.

However, the same saved object is also used for deliberate manual user choices, so simply recomputing/overwriting every slot would destroy user intent.

### Required v0.5.0 state correction

Future Set Piece storage must distinguish at least:

```text
recommended/automatic assignment
manual user override
```

Recommended slots may be recalculated when Team Plan inputs change. Manual slots must be preserved until the user resets them.

For old v3 data, source provenance is unknowable. Migration must therefore avoid silently claiming old values were automatic or manual. A visible “refresh/reset recommendations” path is safer than destructive migration.

## 3.6 Captain decision at this checkpoint

No automatic Captain rule will be added yet.

A former companion build used an OVR/skills/age heuristic, but the verified Bible explicitly retired it as non-authoritative. Current community discussion remains contradictory and does not establish a formula or even a confirmed gameplay magnitude for captaincy.

**Status: UNRESOLVED / MANUAL until stronger evidence exists.**

---

# 4. Tactics

## 4.1 GAME FACT — exact condition-drain architecture

The exact matching build contains:

```text
TacticsConditionDrainRepo
TacticsConditionDrainService
TacticsConditionDrainSettings
TacticsConditionDrainSpec
ConditionDrainIntensity
TacticsDrainOverrides
```

`CalculateConditionDrain` evaluates all eleven current tactic dimensions:

1. Passing
2. Shooting tendency
3. Focus passing
4. Cross tendency
5. Possession lost
6. Possession won
7. Mentality
8. Marking style
9. Pressing style
10. Back line
11. Tackling style

Recovered exact defaults:

```text
MinConditionDrain = 15
NormalizeFactor = 100
Low contribution = 0
Medium contribution = 5
High contribution = 7
Medium threshold = 0.40
High threshold = 0.65
```

Equivalent classification:

```text
raw = 15 + sum(11 resolved contributions)
normalized = raw / 100
High   if normalized > 0.65
Medium if normalized > 0.40
Low    otherwise
```

Threshold comparisons are strict `>`.

`TacticsDrainOverrides` replaces the option's Low/Medium/High classification before resolving to 0/5/7. It does not directly replace the numeric contribution.

## 4.2 GAME-ASSET GUIDANCE — what each tactic changes

The exact matching Windows build ships current `tactics_v2_tooltip_*` localisation describing the intended behaviour of all eleven dimensions. This is authoritative **semantic guidance**, but it is not a numerical Football Engine weighting table.

Recovered current-build meanings include:

- **Passing:** Short increases combination-play frequency; Long increases long-ball-play frequency.
- **Shooting:** controls distance shooting versus working the ball closer before shooting.
- **Focus Passing:** motivates play to be organised through the selected area/lane.
- **Cross Tendency:** controls how often crosses into the box are attempted.
- **Possession Lost:** Counter Press tries to regain possession at defensive risk; Regroup prepares the team for the next attack.
- **Possession Won:** Force Counter Attack is explicitly riskier; Focus On Buildup is safer but more predictable.
- **Mentality:** more offensive mentality creates more attacking opportunities but increases exposure to counters.
- **Marking:** Man-to-Man gives a defensive boost against faster attacks; Zonal performs better against longer-distance attacks.
- **Pressing:** styles counter different actions and tire players by different amounts.
- **Back Line:** Offside Trap tries to catch attackers offside; Track Opponent shadows their progression.
- **Tackling:** harder tackling stops more opponent plays but increases fouls/bookings.

The current build also contains assistant-feedback localisation that repeatedly links concepts such as long balls + counter-attacks, short passing + possession/control, higher pressing + fatigue, and attacking play + offside trap. These strings are useful evidence for **semantic compatibility/tie-breaking**, not proof of hidden numeric bonuses.

## 4.3 STATIC TRACE — no recovered private 'best tactic' formula

The current metadata exposes the real condition-drain UI path (`SquadTacticsConditionDrainController`, `TacticsConditionDrainView`, `TacticsConditionDrainService`, settings/repo/spec). The tactics tutorial text says the game can show expected team behaviour and condition drain, but this static pass did **not** recover a separate client-side numerical `best tactic for this XI` or `expected effectiveness score` service. The behaviour guidance located in this pass is explanatory localisation plus the existing live/match structures.

This is negative evidence only: it does not prove that no private server/Football Engine logic exists. Exact private match-engine effectiveness weights remain **UNRESOLVED**.

## 4.4 OLD COMPANION MODEL — problems found

The pre-r2 engine correctly used exact recovered drain, but the recommendation layer had several weak assumptions:

1. It blended every non-Mentality option with a hand-authored `styleIndex` derived from Approach. No current game/native evidence proved that selecting Attacking should numerically push Passing, Focus, Marking, Pressing, Tackling, etc. by those invented values.
2. Marking was ranked from our own XI's Fitness/LineControl even though the current game explicitly describes Marking as a response to the **opponent's attack type**.
3. Equal lane support could return Left simply because enum/stable order beat the equally suitable Right/Both/Balanced choices.
4. Option interactions were mostly independent even where current game guidance clearly describes coherent concepts.
5. Playstyles and current Special Abilities were not used at all in tactic choice despite current game descriptions giving clear semantic roles for several of them.

## 4.5 v0.5.0-r2 COMPANION LOGIC — evidence-conservative tactic fit

`js/tactics-engine.js` model is now `30527-drain-fit-v2`.

### Preserved unchanged

- exact eleven-option protocol catalogue;
- exact condition-drain arithmetic, thresholds and override handling;
- full 97,200 search space / 19,440 combinations per fixed Mentality;
- user Drain Limit as a hard constraint;
- Approach -> exact Mentality mapping.

### Changed

- **Approach no longer injects invented weights into the other ten dimensions.** It sets Mentality, which is the direct mapping we can support.
- Primary option fit comes from the selected XI's relevant role-key attributes.
- Marking support is neutral from own-team attributes because the game describes it as opponent-dependent. Engine API can accept explicit `opponentAttack=fast|longDistance`; the UI deliberately remains the user's existing two-input calculator, so normal use stays `unknown` and does not invent opponent knowledge.
- Equal-support choices use deterministic neutral/broad fallbacks rather than arbitrary enum-first extremes. Most importantly, equal left/centre/right lane strength selects **Balanced**, and equal strongest wings select **Both Flanks**.
- Current-build game semantics, playstyle meanings and a small set of current Special Ability names can contribute **tie-break signals only**. They never modify the recovered drain and are never represented as private Nordeus weights. Examples include Target Man with long/aerial delivery, Winger/Wing Back with flank/cross play, Ball Winner with counter-pressing, Cross Expert with crossing and Shadow Striker with Shoot On Sight.
- Explicit game-guidance interactions (for example long-pass/counter and short-pass/buildup coherence) are lexicographic tie-breaks only, not invented performance multipliers.

Selection order is now:

1. highest XI squad-fit mean;
2. on an exact fit tie, highest transparent semantic-coherence/tie score;
3. lower exact drain;
4. more dimensions at maximum XI fit;
5. stable enumeration order.

This keeps the algorithm deterministic while making the provenance boundary clearer: **exact drain is game fact; selection utility remains Top Eleven Tool logic.**

## 4.6 Current community cross-check

Current 2027 community discussion generally reinforces the same high-level direction rather than a universal meta: tactics are commonly described as squad/formation-dependent, with examples such as stronger wide players favouring flank play and narrow/central structures favouring short central play. Other current players explicitly report still experimenting with the expanded 2027 controls and match statistics.

Community observations are hypothesis/support evidence only and are not promoted to game facts.

---

# 5. Mentors

## 5.1 OFFICIAL CURRENT PRODUCT FACT

Current official Top Eleven documentation states:

- each Mentor has a Tactical Boost, Attribute Boost and Signature Move;
- Tactical Boost makes certain attack types more likely and makes players more likely to execute those attacks successfully;
- levels 1–5 provide Tactical Boost progression;
- levels 5–10 unlock/progress Attribute Boost;
- Signature Move unlocks at level 10;
- Mentors can be switched at halftime.

This materially constrains the recommendation model: mentor level is not merely a generic tie-break value. It determines which boost families are active/available.

## 5.2 LIVE FACT — captured mentor records

The existing project contains the seven captured current mentors and their server effect arrays. Examples:

- Lewis Green / `wing_commander` — `tacticWingAttacksEffectiveness [30]`, `attributeCrossingHeading [20]`, `signatureAerialDominance [80]` at the captured state.
- Alan Shearer / `deadball_specialist` — `tacticSoloDribbleEffectiveness [30]`, `attributeStrengthShooting [20]`, `signatureAnkleBreaker [25,10]` at the captured state.

These values are snapshots for the captured Mentor levels and must not be treated as universal values for every level.

## 5.3 LIVE FACT — Alan → Green in-match switch

A previous live capture proved this chain:

```text
Alan Shearer / deadball_specialist
-> halftime AssignMentorInMatch
-> server accepted Lewis Green / wing_commander
-> updated full mentor state
-> following MatchPeriod contained Green in the live mentor snapshot
```

In that uncontrolled match, ShotsFromCrosses rose from 0 at halftime to 15 by full time and crossing attempts rose sharply after the switch. This is a useful signal consistent with Green's captured wing/crossing effects, but it is **not causal proof** because other match conditions were not controlled.

## 5.4 CURRENT COMPANION LOGIC

`js/mentor-engine.js` currently sorts mentors lexicographically by:

1. direct tactic match (0–3 companion points)
2. number of boosted attributes that are key/white for assigned roles
3. selected Mentor level
4. stable order

Raw effect magnitudes and Signature Move arrays are displayed but not numerically scored.

## 5.5 CONFIRMED APP LOGIC DEFECT — level override does not alter boost state

The UI permits a Mentor level override. `effectiveMentor()` changes only `mentor.level`.

It does **not** update:

- Tactical Boost value/state
- Attribute Boost value/state
- Signature Move availability/value

Therefore a user can select a different level while the engine continues carrying raw effect arrays captured at the original snapshot level.

Additionally, `attributeCoverage()` is currently scored regardless of whether the selected Mentor level has unlocked the Attribute Boost, and Signature raw effects can be displayed even below the level-10 unlock.

This conflicts with current official Mentor progression rules.

**Classification: COMPANION APP BUG / MODEL DEFECT.**

### Safe correction before full level curves are known

The app may safely gate boost families using proven unlock rules:

- Tactical Boost: active in the Mentor progression from the beginning;
- Attribute Boost: do not score/display as active before its level-5 unlock;
- Signature Move: do not score/display as active before level 10.

But the app must **not invent per-level numerical boost values**. If a user-selected level differs from the captured snapshot and no exact per-level table has been recovered, the magnitude should be marked unresolved rather than reusing a snapshot as though it were exact.

## 5.6 Why Green/Shearer may be under-selected by the current app

Evidence-backed causes already identified:

1. Direct tactic match is only a coarse 0–3 companion score.
2. Actual captured Tactical Boost magnitude is not part of ranking.
3. Actual captured Attribute Boost magnitude is not part of ranking.
4. Signature Move is completely excluded from ranking.
5. Mentor level currently acts only as the third lexicographic tie-breaker instead of determining unlocked boost families.
6. The model does not yet reason about in-match/halftime use despite the official feature explicitly supporting Mentor switching.

Recent community discussion is consistent with contextual use rather than a single universally best Mentor. A recent Lewis Green example specifically pairs him with high crossing and a Target Man; this is useful hypothesis evidence, not a formula.

---

# 6. v0.5.0 implementation order after this checkpoint

1. **Set Pieces state provenance**
   - distinguish generated recommendation from manual override;
   - add non-destructive refresh/reset-recommendations behaviour;
   - keep Captain manual/unresolved unless stronger evidence is recovered;
   - add tests that manual overrides survive recalculation and auto slots do not go stale.

2. **Tactics deeper static trace**
   - retain exact condition-drain implementation;
   - trace current tactic consumers toward match/Football Engine;
   - identify which performance relationships are game-proven vs companion assumptions;
   - only then revise `rawSupports()` / option scoring.

3. **Mentor model correction**
   - separate Mentor level from captured boost snapshot;
   - implement proven effect-family unlock gating;
   - recover per-level effect values if possible from runtime/static/server state;
   - investigate Tactical Boost / Attribute Boost / Signature Move consumers;
   - redesign recommendation around the actual active effect families and match context.

4. **Tests + embedded handoff**
   - deterministic fixtures for every changed recommendation/state rule;
   - scanner and Formation regression suite remains green;
   - update `PROJECT_HANDOFF.md` at every meaningful build/checkpoint.

