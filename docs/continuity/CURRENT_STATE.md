# Top Eleven Tool — Current State

**App version:** v0.5.8  
**Checkpoint date:** 14 September 2026  
**Stable scanner baseline:** v0.4.18  
**Game reference:** build 30527 / Windows package 27.3.0.0  
**Current development area:** ST role/Playstyle evidence model + unfinished three-effect Mentor decision logic (Formation + Tactics v1 baseline remains closed)

## Non-negotiable rules

- Do not guess Top Eleven formulas, hidden multipliers, tactics effects, Mentor effects or server values.
- GAME FACT / LIVE FACT / GAME ASSET FACT / STRONG EVIDENCE / COMPANION LOGIC / UNRESOLVED must remain separate.
- Version builds numerically only (`v0.5.3`, `v0.5.7`, `v0.5.8`); no r-suffixes.
- Keep `START_HERE.md`, this file and the Game Research Index updated before packaging.
- Do not restart a broad multi-system mine. Research one missing fact at a time.

## Stable / frozen

### Scanner
The v0.4.18 scanner remains frozen unless a new real screenshot proves a regression.

### Formation UI/selection
The current Formation UI is considered good and has not been redesigned in v0.5.5. Research has, however, established that Lineup Balance is a meaningful game factor; do not confuse that with permission to invent its private formula.

## Completed Team Plan work

### Set Pieces
- provenance-aware automatic/manual/legacy assignments;
- explicit refresh of generated choices;
- Captain remains manual because no official automatic formula is known.

### Tactics
- exact build-30527 drain preserved;
- Approach locks Mentality without invented cross-dimension aggression weights;
- neutral/symmetric lane handling fixed;
- opponent-dependent Marking no longer inferred from our own XI;
- no recovered numeric client-side tactic-effectiveness formula beyond drain.

### Mentor state correction — v0.5.3
- Runtime Mentor definitions no longer contain screenshot/capture-derived level, XP or effect-array defaults.
- Fresh user state is **Locked** for every Mentor. Locked is separate from level; once unlocked, level starts at 1.
- User manually marks owned/unlocked Mentors and sets Level 1-10.
- Proven family gates: Tactical=1, Attribute=5, Signature=10.
- A selected level never borrows a captured effect magnitude from a different historical level.
- If no Mentor is marked unlocked, the app gives no fabricated Mentor recommendation.

## Formation + Tactics v1 baseline — v0.5.7

Read `docs/research/build_30527/V057_FORMATION_TACTICS_CHECKPOINT.md`. Current key points:

1. **Current native formation validator recovered:** hard legality and irregular/advisory rules are indexed and reproducible.
2. **Formation space exhaustively enumerated:** 2,843 hard-legal, 1,893 warning-free, 249 warning-free symmetric, and 12 symmetric one-slot-advisory-resilient role-count shapes.
3. **Default long-term Target Formation — COMPANION LOGIC:** `GK / DL DC DC DR / DMC MC / AML AMC AMR / ST`. It is legal, warning-free, symmetric, one-slot advisory-resilient and covers 18/19 active Playstyles. It is **not** claimed as an official Nordeus best formation.
4. **Tactics remain dynamic:** the formation is a platform, not a fixed preset. Exact condition drain is authoritative; tactic tooltips and Assistant Feedback are semantic evidence only.
5. **Assistant Feedback boundary:** `MatchPeriod` already carries selected `MatchFeedback {Minute, StringId, AssistantId}` from the server. Exact trigger thresholds/selection logic are server-owned and unresolved.
6. **Lineup Balance remains server-private:** meaningful for structure/compatibility, but not a safe oracle for per-role white-skill weights.

## Active next research

Build an evidence-backed **role/Playstyle attribute-priority table**, starting with ST.

- GAME FACT / GAME ASSET FACT determine white-skill membership, action/drill relationships and Playstyle semantics.
- COMMUNITY evidence may support hypotheses but cannot become game truth.
- Any actual numerical priority such as `3 / 2 / 1` is **COMPANION LOGIC** and must remain transparent.
- Do not invent private match-engine percentages or equalise every white skill by default.
- After ST, work systematically through AML/AMR, AMC, MC, ML/MR, DMC, DL/DR, DC and GK.

## Parked implementation tasks

- Official game Mentor renders `img_mentor_card_big_s1_01..07.png` are embedded as source assets; production replacement waits for deterministic asset-index -> Mentor-ID mapping.
- Fix intermittent multiple-click behaviour on Mentor lock/unlock and player delete in a dedicated event-handler/hit-area pass.
- Responsive collectible Player Profile redesign remains parked; single-screenshot-only data rule remains mandatory.

## External reference

The full game package is `TopEleven_Full(4).zip`. It is not embedded due to size. Critical hashes are stored in `data/build_30527/index/source_manifest.json`; search the Library before asking the user to upload it again.


## v0.5.5 evidence correction

Current striker screenshots and a same-slot UI re-test invalidate the use of the old Roelandt/Lataille Balance delta as evidence for ST primary-skill weighting. Both now display 9.9 Balance despite Lataille being much stronger across the ST key-skill profile. The old exact server result remains historical state evidence only. Research must seek per-role/action attribute priorities independently of Lineup Balance.

## v0.5.6 parked UI work

The collectible-style Player Profile concepts are **future UI work only**. Read `docs/design/PLAYER_PROFILE_TODO.md` before touching the Player Profile. The current global app shell/navigation must be preserved and the finished layout must support both mobile and desktop/web. Future profile data is restricted to the single scanned screenshot plus deterministic derivations from verified game data.

### Superseded v0.5.6 next-task note

The v0.5.6 native weighting search was completed without recovering a private numeric per-role weighting table. v0.5.7 then opened the evidence-backed COMPANION role/Playstyle priority model; v0.5.8 has now preserved the first ST qualitative evidence bands and exposed the unfinished Signature-aware Mentor dependency.


## v0.5.8 Mentor + ST evidence checkpoint

Read `docs/research/build_30527/V058_MENTOR_ST_COMMUNITY_CHECKPOINT.md`.

### Mentor correction
- Seven-Mentor effect extraction remains valid, including exact Tactical/Attribute/Signature wording and captured arrays.
- **Mentor recommendation is not fully finished.** `mentor-synergy-v3` uses direct Tactical match + Attribute key-skill coverage + Signature-unlocked Boolean. It does not yet reason over each Signature Move's actual activation condition/trade-off.
- Current official Top Eleven documentation confirms Level 10 + **3 Prestige levels**, Signature Seals and halftime Mentor swapping. Exact build-30527 Prestige state/protocol representation is unresolved and must not be invented.
- Safe next architecture: pre-match semantic fit + halftime/live Mentor switch advisor. Do not create one fake numeric Signature score.

### ST evidence model
- ST GAME FACT key attributes remain: Passing, Dribbling, Shooting, Finishing, Positioning, Heading, Strength, Speed, Creativity.
- No private Nordeus numeric per-attribute weighting was recovered.
- `data/build_30527/index/st_role_priority_evidence.json` now preserves qualitative COMPANION bands:
  - base scoring core: Shooting + Finishing;
  - structural support: Positioning;
  - Poacher: elevate Shooting/Finishing, support Speed/Creativity/Positioning;
  - Target Man: elevate Heading/Strength/Positioning/Finishing, support Shooting;
  - False Nine: elevate Dribbling, support Creativity/Speed/Shooting/Finishing; Passing/Positioning remain candidates rather than promoted facts.
- `data/build_30527/index/community_evidence_2026-09-14.json` keeps web/player evidence explicitly separate from GAME FACT.

### Formation remains closed
The v0.5.7 Target Formation remains `GK / DL DC DC DR / DMC MC / AML AMC AMR / ST`. Community evidence currently corroborates the value of midfield control/back-four+DMC structure but does not establish an official best formation or justify reopening the native Formation v1 baseline.

### Active next
1. Signature-aware Mentor research rules are now mapped in `data/build_30527/index/mentor_signature_rule_design.json`; next Mentor step is a tested runtime implementation, not more speculative scoring.
2. ST Special Ability weighting remains intentionally unresolved: current client data gives the 19-name enum and server/player-specific availability, while official Help confirms role-dependent choices but not effect multipliers. Seek current effect hooks/live captures rather than stale community rankings.
3. ST tactic context is now partially resolved at companion level: Target Man has strong cross/aerial-service context and a direct Lewis Green interaction; False Nine and Poacher remain qualitative and must not be bound to fixed tactic presets.
4. Then repeat the evidence workflow for AML/AMR.
