# Top Eleven Tool — Current State

**App version:** v0.5.14  
**Checkpoint date:** 15 September 2026  
**Stable scanner baseline:** v0.4.18  
**Game reference:** build 30527 / Windows package 27.3.0.0  
**Current development area:** deep whole-system calibration. No v0.5.15 release is frozen yet.

## Non-negotiable rules

- Do not guess private Top Eleven formulas, hidden multipliers, server values or external-team state.
- Keep GAME FACT / GAME ASSET FACT / LIVE FACT / COMPANION LOGIC / UNRESOLVED separate.
- Version builds numerically only (`v0.5.N`); no r-suffixes.
- The pre-match decision runtime is permanently **own-squad-only**. No opponent formation, strength, tactics, scouting profile, relative-strength estimate or live-match state.
- Keep `START_HERE.md`, this file, the research index and the active checkpoint updated before packaging.

## Stable / frozen

### Scanner
The v0.4.18 scanner is frozen unless a real screenshot proves a regression. v0.5.14 does not redesign scanner recognition.

### Native/game-data foundations
- 12 current roles and build-30527 white-skill maps.
- current Playstyle/Special Ability catalogues.
- recovered formation legality space including 2,843 hard-legal role-count shapes.
- 11-dimension tactic condition-drain **formula architecture** is native-proven, but current numeric intensity values/normalizer/class thresholds are server/runtime supplied and are not statically recovered. The old 15 + 0/5/7 + 0.40/0.65 profile is legacy/default evidence, not authoritative live-2027 truth.
- Mentor identity/family unlock gates; unknown runtime magnitudes remain unresolved.

## v0.5.14 active decision pipeline

The app now treats the match plan as one candidate decision chain:

`own squad -> legal Formation/XI -> Tactics -> Set Pieces/Captain -> Mentor -> winning Team Plan -> per-player Training context`

### Formation
- 12 curated families are scored first, but if none of their **chosen best XI assignments** is entirely Natural the recovered hard-legal natural-role fallback is also opened. Related-role curated plans remain candidates; a theoretically fieldable but unused weak natural player cannot suppress a cleaner natural dynamic shape.
- calibration working score = 40 lineup quality + 10 Playstyle-role fit + 20 weak-link protection + 30 own structure.
- versatility/flexibility no longer adds match-performance points; it remains Squad Blueprint information and a late tie-break.
- lineup quality now uses an absolute quality-gap scale rather than candidate min/max scaling, preventing microscopic player changes from producing 35-point score swings.
- exact ties use weak link, lineup quality, Playstyle-role fit, flexibility, baseline/native stability and stable ID.

### Tactics
- every Formation candidate is evaluated with the requested Approach, including non-Auto modes; fixed Approach no longer locks an XI before tactics are considered.
- score architecture remains 32 XI fit + 26 own structure + 18 coherence + 14 Playstyle/SA fit + 10 condition-cost efficiency, but the drain component is currently **under live recalibration**.
- tactic option fit now uses an absolute support window rather than candidate min/max scaling; positive coherence buckets were recalibrated to reduce saturation.
- Auto Mentality uses own-XI attack-vs-defence quality only inside a near-tie protection band, and semantic tactic signals only resolve numeric near-ties.
- **Do not treat the old raw 30 floor or 40/65/100 ceilings as current live-game truth.** Those came from the legacy/default 15 + 0/5/7 profile. Current client analysis proves the additive algorithm but says values and thresholds are server/runtime supplied.
- Live 15 September testing now classifies every tactic option by observed **Low / Medium / High intensity**. The 0/1/2 labels are categorical, not linear drain points. Tackling is Stay On Feet Low, Balanced Medium, Aggressive High. From an all-Low baseline, 3 Medium-intensity choices first reach overall Medium and 9 first reach High; 2 High-intensity choices first reach Medium and 6 first reach High. Mixed Medium/High weighting remains unresolved, so no numeric live total is fabricated.

### Set Pieces + Captain
- generated for every candidate XI, not bolted on after the winner.
- penalties: Penalty Kick Specialist first, then relevant finishing/shooting skill support.
- free kicks: Free Kick Specialist first, Set Piece Taker second, then shooting/finishing/passing/creativity support.
- corners: Corner Specialist, then Set Piece Taker, then crossing/passing/creativity support.
- left/right roles are independently stored but may legitimately select the same player because preferred foot is not captured; no foot advantage is invented.
- Captain has **zero proven match-performance effect**. Historical Nordeus Support explicitly stated captain choice does not strengthen players or change stats, and the recovered current client exposes assignment/save state but no performance formula. The app auto-fills highest OVR -> assigned-role mean -> assigned-role floor -> stable key only as a deterministic convenience default; any manual starter is performance-equivalent.
- Set-piece readiness is a **late tie-break only**, never an additive score that can rescue a worse core plan. Captain is excluded from readiness and from every Team Plan score/tie-break.
- manual overrides persist until explicit refresh/off-XI.

### Mentor
- unlock gates remain Tactical L1 / Attribute L5 / Signature L10.
- unknown external/live-only conditions receive zero.
- Mentor can add 0..10 only to candidates within 10 points of the best 50/50 Formation/Tactics core score.
- Training-only SA modifiers do not leak into Mentor attribute relevance.

### Joint selection
- core plan = 50% Formation + 50% Tactics.
- Mentor refines only viable candidates.
- Set Pieces then break exact/near decision ties through readiness without changing the core score.
- Team Plan persistence schema is **v6**; Set Piece state remains v5. A cached Team Plan is current only when `gameDataVersion`, Formation, Strategy, Squad Blueprint/Coverage, Tactics, Mentor and Set-Piece model fingerprints all match. This invalidates pre-calibration v0.5.14/v5 plans automatically.

## v0.5.14 Training target-shape + verified intensity model

The previous S/A/B/C hierarchy is retained but now defines a **desired relative player shape**, not merely a priority list. Current companion ratios are:

- S = 1.18
- A = 1.05
- B = 0.92
- C = 0.85
- secondary-role-only white skill = 0.82

These are transparent companion ratios, **not Nordeus caps or official target percentages**.

For each player, Training:
1. resolves the natural development role and active Role+Playstyle profile;
2. normalises current white skills by the desired ratios;
3. builds a robust reference from the median normalised non-signature white-skill development level, so one freak lower-priority attribute cannot move every target and a trained signature skill cannot move its own goalpost;
4. calculates the target shape and gap for every white skill;
5. applies the role/Playstyle hierarchy plus capped Team Plan tactic context (+20%) and approved active SA context (+8%);
6. chooses six drills that attack the largest useful target gaps.

A white skill already at its desired shape falls to a small maintenance floor; it is not kept level with signature skills. Example: a flat Poacher is deliberately pushed toward much higher Shooting/Finishing/Positioning/Speed than Passing/Heading/Strength. No absolute 180/200/etc cap is invented.

### Verified drill gain ladder

Recovered build-30527 drill data proves the normal intensity ladder is **Very Easy=1, Easy=2, Medium=3, Hard=4, Very Hard=5 base XP per player** before drill-level effect. Normal drill strength is therefore modeled as `XP × (1 + drill-level effect)`. Semi-Pro/Pro/World Class add +10/+20/+30%; Master/Campus uses its recovered catalogue effect. When two drills hit the same useful white skills at the same level/effect, the harder drill must rank higher in **Max Growth**. Condition cost rises proportionally (0.75/1.5/2.25/3.0/3.75), so intensity alone receives no fake efficiency bonus in **Condition Efficient** mode. Exact final percentage-point AttributeGain remains server/runtime-owned and is not predicted.

Training inherits the winning Team Plan's tactics and assigned role **only when that role is natural**. If Formation temporarily uses a related-only role, Training falls back to a real natural role and exposes the reason rather than pretending the related role is trainable as natural.

## Squad Blueprint

Coverage is 70% core XI + 20% flexibility + 10% availability/rotation depth. A player cannot fill two simultaneous required slots.

## Validation checkpoint

Released v0.5.14 passed **337 core assertions** plus strategy-data, static, package-integrity, navigation, cloud and frozen scanner/reference contracts. The current calibration working tree contains additional unversioned calibration changes and must not be released until the new tactics-drain model is resolved and the full suite is rerun.

### Active drain-calibration blocker

Live user testing on 15 September 2026 showed the app can report `Medium drain` when the live game does not. Recovered current-client code confirms the reason this cannot be fixed by casually changing one threshold: `TacticsConditionDrainSettings` is runtime/server supplied. Historical captures rechecked so far do not expose `ClubResponse #154 TacticsConditionDrainSpec`. The user's observed relative profile is preserved at `data/calibration/live_tactics_drain_observation_2026-09-15.json`, with research notes at `docs/research/calibration/V0515_TACTICS_DRAIN_LIVE_RECALIBRATION.md`. Numeric drain weighting remains unresolved, but non-drain calibration continues safely with the drain-score component neutral and only proven categorical dominance used as a tie-break.

## Next development target

Continue objective v0.5.15 cross-system calibration using the active role-eligible Playstyle/SA affinity runtime. Pure identity-only overlaps with established explicit tactic rules are de-duplicated, Winger/Wing Back focus affinity is side-aware, and the exact hard-legal semantic maximum is 74 raw -> 14 points. Named Playstyle levels remain normalized at the shared Strategy boundary. Mixed live Medium↔High drain arithmetic remains pending user evidence and must not be guessed.


## v0.5.15 active semantic calibration checkpoint

The declared 19-Playstyle tactic-affinity table and active SA affinity rows are consumed by runtime Tactics. Generic Playstyle identity contributes once only when active and eligible for the current assigned role; unresolved SA rows remain zero. Pure identity-only overlaps already represented by explicit tactic rules are suppressed to prevent double counting, while contextual overlays remain additive. Winger/Wing Back directional focus follows the actual assigned flank. Exact hard-legal optimisation plus a runtime witness proves the semantic maximum is 74 raw -> 14 points. See `docs/research/build_30527/V0515_AFFINITY_DEDUP_CALIBRATION_CHECKPOINT.md`.

## Parked work

- official Mentor renders wait for deterministic asset-index -> Mentor-ID mapping;
- intermittent multi-click Mentor lock/unlock and player delete event/hit-area pass;
- responsive collectible Player Profile redesign remains parked and must obey the single-screenshot-only data rule.

## External reference

Latest supplied full game package: `TopEleven_Full(5).zip`. It is not embedded due to size. Critical hashes live in `data/build_30527/index/source_manifest.json`; search the Library before requesting another upload.
