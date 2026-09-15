# Top Eleven Tool — Current State

**App version:** v0.5.14  
**Checkpoint date:** 15 September 2026  
**Stable scanner baseline:** v0.4.18  
**Game reference:** build 30527 / Windows package 27.3.0.0  
**Current development area:** complete own-squad Team Plan stitching and pre-calibration validation.

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
- exact 11-dimension tactic option/drain table and 97,200-combination checksum.
- Mentor identity/family unlock gates; unknown runtime magnitudes remain unresolved.

## v0.5.14 active decision pipeline

The app now treats the match plan as one candidate decision chain:

`own squad -> legal Formation/XI -> Tactics -> Set Pieces/Captain -> Mentor -> winning Team Plan -> per-player Training context`

### Formation
- 12 curated families are ranked first; if none can be fielded, the recovered hard-legal dynamic fallback is used.
- score = 35 lineup quality + 10 Playstyle-role fit + 15 weak-link protection + 30 own structure + 10 flexibility.
- exact ties use weak link, lineup quality, Playstyle-role fit, flexibility, baseline/native stability and stable ID.

### Tactics
- every Formation candidate is evaluated with the requested Approach, including non-Auto modes; fixed Approach no longer locks an XI before tactics are considered.
- score = 32 XI fit + 26 own structure + 18 coherence + 14 Playstyle/SA fit + 10 drain efficiency.
- exact build-30527 drain is unchanged; raw 30 is the true 10-point efficiency floor and 40/65/100 are Low/Medium/High ceilings.

### Set Pieces + Captain
- generated for every candidate XI, not bolted on after the winner.
- penalties: Penalty Kick Specialist first, then relevant finishing/shooting skill support.
- free kicks: Free Kick Specialist first, then shooting/finishing/passing/creativity support.
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
- Team Plan persistence schema is v5; Set Piece state is v5. The v0.5.14 bump invalidates cached v0.5.13 plans so Captain-neutral/set-piece readiness is rebuilt under the current contract.

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
3. builds a reference from the top three normalised development-role whites;
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

Current v0.5.14 source-tree hardening suite: **337 core assertions PASS**, including direct regressions for the 1→5 intensity-gain ladder and Captain neutrality, plus strategy-data, static, package-integrity, navigation, cloud and frozen scanner/reference contracts. Re-run the same gates from the freshly extracted release ZIP before calling the build final.

## Next development target

Do **not** add more architecture before validation. Next is controlled own-squad fixture calibration of the complete chain: deliberately vary squad composition, roles, Playstyles, SAs and Mentor state, inspect the entire selected plan and Training outputs, and tune only transparent companion rules when a specific recommendation is demonstrably poor.

## Parked work

- official Mentor renders wait for deterministic asset-index -> Mentor-ID mapping;
- intermittent multi-click Mentor lock/unlock and player delete event/hit-area pass;
- responsive collectible Player Profile redesign remains parked and must obey the single-screenshot-only data rule.

## External reference

Latest supplied full game package: `TopEleven_Full(5).zip`. It is not embedded due to size. Critical hashes live in `data/build_30527/index/source_manifest.json`; search the Library before requesting another upload.
