# Top Eleven Tool — Current State

**App version:** v0.5.10  
**Checkpoint date:** 14 September 2026  
**Stable scanner baseline:** v0.4.18  
**Game reference:** build 30527 / Windows package 27.3.0.0  
**Current development area:** v0.5.10 decision-engine validation and UI integration: joint Formation + Tactics + level-gated Mentor planning, squad-coverage guidance, and complete Individual Training hierarchies

## Non-negotiable rules

- Do not guess Top Eleven formulas, hidden multipliers, tactics effects, Mentor effects or server values.
- GAME FACT / LIVE FACT / GAME ASSET FACT / STRONG EVIDENCE / COMPANION LOGIC / UNRESOLVED must remain separate.
- Version builds numerically only (`v0.5.3`, `v0.5.7`, `v0.5.10`); no r-suffixes.
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

## Active development target

The broad static research phase is sufficiently mature for the current product goal. Build the **joint Formation + Tactics + Mentor companion decision engine** from the proven game constraints plus `community_logic_2024_2026.json`.

- GAME FACT / GAME ASSET FACT define legality, role semantics, tactic semantics, condition drain and Mentor effects.
- COMMUNITY evidence ranks plausible choices only where private effectiveness maths is unavailable.
- Any numerical plan score is **COMPANION LOGIC** and must be transparent/testable.
- Continue targeted research only when implementation exposes a specific low-confidence or contradictory rule.

## Parked implementation tasks

- Official game Mentor renders `img_mentor_card_big_s1_01..07.png` are embedded as source assets; production replacement waits for deterministic asset-index -> Mentor-ID mapping.
- Fix intermittent multiple-click behaviour on Mentor lock/unlock and player delete in a dedicated event-handler/hit-area pass.
- Responsive collectible Player Profile redesign remains parked; single-screenshot-only data rule remains mandatory.

## External reference

The latest supplied full game package is `TopEleven_Full(5).zip`. It is not embedded due to size. Critical hashes are stored in `data/build_30527/index/source_manifest.json`; search the Library before asking the user to upload it again.


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
- Current official Top Eleven documentation confirms Level 10 + **3 Prestige levels**, Signature Seals and halftime Mentor swapping. v0.5.9 additionally proves PrestigeProgress/PriceForNextPrestige and Signature-Seal gating in the supplied current Windows client.
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

### Superseded by v0.5.10
The joint plan scorer, level-gated Mentor Signature context and role/Playstyle training hierarchy are now implemented as transparent COMPANION LOGIC.



## v0.5.9 community logic checkpoint

Read `docs/research/build_30527/V059_COMMUNITY_LOGIC_CHECKPOINT.md` and `data/build_30527/index/community_logic_2024_2026.json`.

The 2024–26 forum + r/topeleven pass is now mature enough to support implementation. High-confidence companion principles are:

- central midfield parity/control matters more than formation-name popularity;
- DMC screening is strongly valued against AMC/central overloads, with double-DMC a situational stronger-opponent option;
- attack the opponent's weak lane rather than choosing focus from our own XI alone;
- keep both 3CB and back-four families because current evidence conflicts on a universal winner;
- short vs mixed/long passing follows formation spacing and route-to-goal intent;
- possession percentage is not the objective function;
- Mentor value is plan-dependent (Cesc possession/short, Herrera counter, Lewis wide/cross/aerial, Braun halftime adaptation);
- ST Playstyle is a system-fit modifier, not a global ranking.

Do not hard-code current community disputes around universal 3-1-5-1 superiority, universal back-four superiority, one pressing/offside recipe, or one globally best Mentor.

## v0.5.9 full Windows-client checkpoint

Read `docs/research/build_30527/V059_FULL_WINDOWS_GAME_CHECKPOINT.md` first. The supplied current Windows/WSA client uses Unity 6000.3.13f1 / IL2CPP metadata v39 / BundleVersionCode 10599. It corrects the old research interpretation of `LongShots`: current localisation displays it as **Shadow Striker**. It also proves three SA slots, explicit role/player SA eligibility structures, exact SA activation and Playstyle trigger/outcome event records, Mentor Prestige + Signature Seals in shipped files, and Playstyle-specific game-authored post-match semantics. That v0.5.9 checkpoint was research-only; v0.5.10 now implements the transparent companion decision layer described below.


## v0.5.10 decision-engine foundation

- Broad static game-file mining is parked; community/game evidence has been converted into production COMPANION LOGIC.
- New central logic contract: `data/build_30527/index/decision_logic_v1.json`.
- `Strategy` holds the full role/Playstyle training hierarchy plus formation/tactic structural rules.
- `SquadCoverage` reports current natural-role coverage separately from the best XI and suggests multi-role recruitment profiles.
- Formation strategic ranking now combines current XI quality with structural matchup instead of role-mean alone.
- Tactics `Auto — Best Fit` can compare all five mentalities while retaining exact recovered drain arithmetic.
- Mentor Tactical/Attribute/Signature families unlock at Levels 1/5/10; locked families contribute exactly zero. Signature context is now scored explicitly.
- Individual Training is role -> Playstyle -> tactic context -> deficiency -> drill efficiency; grey skills still have zero utility.
- `TeamPlan.buildOptimalPlan()` scores complete Formation + Tactics + Mentor packages and carries squad-coverage guidance.
- Joint weights are transparent companion values: 45% Formation / 40% Tactics / 15% Mentor. Do not present them as Nordeus coefficients.
