
## v0.5.18 drain-band intent checkpoint

The active tactic runtime now treats Low / Medium / High as explicit drain intent bands so a higher selection cannot silently reuse a cheaper lower-class tactic package. See `V0518_DRAIN_BAND_INTENT.md` and the root `CALIBRATION_RECOVERY_HANDOFF_v0.5.18.md`. Formation/context calibration remains otherwise unchanged and mixed-intensity live drain arithmetic is still unresolved.

# Top Eleven Build 30527 — Game Research Index

**Index version:** 11  
**Last updated:** 16 September 2026  
**Purpose:** permanent, embedded reference for future Top Eleven Tool logic work.

This index prevents repeated reverse-engineering and stops assumptions from being promoted into “game facts”.

## Evidence labels

- **GAME FACT** — proven from current binary/native/protocol structure.
- **GAME ASSET FACT** — proven from current serialized asset/localisation shipped with the game.
- **LIVE FACT** — proven from controlled/current network or match state.
- **SERVER RUNTIME** — authoritative value/state exists but is supplied dynamically.
- **COMPANION LOGIC** — our transparent decision-support rule, not Nordeus logic.
- **UNRESOLVED** — not yet proven. Do not invent it.

## Build identity

The supplied Windows package is version **27.3.0.0**. Its critical IL2CPP hashes exactly match the previous build-30527 research:

- `GameAssembly.dll` — `b17a8e9adeda6a78245f6ac43cdfaa2b768418507bc340f082576ff6c22ec9fe`
- `global-metadata.dat` — `b0a1896faab8e4b1a9fd01beda787ff12f2a3389d94cd79d585c9e95489cdcfc`

See `data/build_30527/index/source_manifest.json`.

## System pages

- [Target Formation / role priority](systems/formation_target.md)
- [Tier / OVR](systems/tier_ovr.md)
- [Tactics](systems/tactics.md)
- [Mentors](systems/mentors.md)
- [Set Pieces](systems/set_pieces.md)
- [Players, roles and key attributes](systems/players_roles.md)
- [Playstyles and Special Abilities](systems/playstyles_special_abilities.md)
- [Training](systems/training.md)
- [Best-in-Slot current-squad gap/coverage](V0517_BEST_IN_SLOT_SQUAD_GAP.md)
- [Unresolved targets](UNRESOLVED.md)

## Machine-readable indexes

- `data/build_30527/index/findings.json` — searchable finding register.
- `data/build_30527/index/role_attribute_priority_hypotheses.json` — historical ST evidence, current re-test correction and current qualitative ST companion evidence bands.
- `data/build_30527/index/st_role_priority_evidence.json` — ST key-skill/action/Playstyle evidence and draft qualitative priority bands; no numeric Nordeus weights.
- `data/build_30527/index/community_evidence_2026-09-14.json` — raw web/community corroboration kept explicitly separate from GAME FACT.
- `data/build_30527/index/community_logic_2024_2026.json` — confidence-rated companion rules distilled from forum + r/topeleven, with disputed claims explicitly blocked from hard-coding.
- `data/build_30527/index/mentor_effects.json` — Mentor IDs, live arrays, decoded semantics and protocol.
- `data/build_30527/index/mentor_signature_rule_design.json` — all seven Signature activation contexts split into pre-match vs halftime/live rules; no fabricated universal Signature score.
- `data/build_30527/index/tactics_semantics.json` — recovered/default drain architecture plus shipped tactic tooltips; current live intensity observations are stored separately under `data/calibration/`.
- `data/build_30527/index/native_methods.json` — high-value recovered native symbols/addresses.
- `data/build_30527/index/protocol_fields.json` — high-value protocol fields.
- `data/build_30527/index/source_manifest.json` — build/source hashes.
- `data/build_30527/index/ui_todo.json` — parked responsive Player Profile design constraints and references.
- `data/build_30527/index/decision_logic_v2.json` — authoritative deep companion decision contract: features, squad coverage, Formation, Tactics, Mentor and Training logic.
- `data/build_30527/index/strategy_strings_v2.json` — human-readable reason strings required by the v2 rule contract.

## Current unpublished development overlay

The working branch is **v0.5.17-dev-pass10**. Pass10 preserves the Pass7 Best-in-Slot/Training work and the Pass8–9 fully automatic existing-player updater, but now derives each updated player OVR from the complete 15-skill screenshot set after age/skills persistence. Name/roles/Playstyle/SAs remain preserved. See `V0517_AUTOMATIC_PLAYER_UPDATE.md`, `V0517_DEV_PASS10_VALIDATION.md` and the root recovery handoff.

## Current highest-value checkpoint

The current recovery/release checkpoint is **v0.5.17**. Read the root `CALIBRATION_RECOVERY_HANDOFF_v0.5.17.md`, `docs/releases/v0.5.17.md`, and `docs/continuity/CURRENT_STATE.md` first. v0.5.17 preserves the v0.5.15 calibrated own-squad stitch, the v0.5.16 runtime hardening, and the live Focus Passing UI identity correction (`center` → **Through the Middle**). v0.5.14 remains the historical final pre-calibration baseline. The active optimiser remains own-squad-only; unknown external/live context receives zero rather than a guess.

**Captain supersession warning:** the old source-archive v1.1 Bible contains a clearly labelled companion-only legacy `OVR + broad skill mean + age` Captain score. v0.5.14 supersedes it. Do not restore that formula: Captain is performance-neutral in the active model and has zero Team Plan ranking value.

## Research rule

Before investigating any game behaviour:
1. search `findings.json`;
2. open the system page;
3. inspect the embedded source archive if needed;
4. only then perform new binary/live research.

When a new fact is proved, update both the relevant system page and `findings.json`.


## v0.5.7 Formation + Tactics baseline

Formation and Tactics static/client research are now mature enough for a v1 companion baseline. Read `V057_FORMATION_TACTICS_CHECKPOINT.md`, `systems/formation_target.md`, `systems/tactics_target_integration.md`, and `systems/tactics_semantic_archetypes.md`.

Key machine-readable additions:
- `data/build_30527/index/formation_resilient_frontier.json`
- `data/build_30527/index/tactics_assistant_feedback.json`

Key preserved source additions:
- `source_archive/TACTICS_ASSISTANT_FEEDBACK_EXTRACT.txt`
- `source_archive/native/NATIVE_MATCH_FEEDBACK_BOUNDARY.md`

Current companion Target Formation: `GK / DL DC DC DR / DMC MC / AML AMC AMR / ST`. This is a transparent app target, not a Nordeus best-formation claim. Tactics remain XI/context-driven under the verified drain architecture/current live-intensity boundary.

**Historical next target (completed by later checkpoints):** role/Playstyle attribute priorities are now represented by the v0.5.14 target-shape/intensity model. The private Nordeus numeric weighting formula remains unresolved.


## v0.5.8 Mentor + ST / community checkpoint

Read `V058_MENTOR_ST_COMMUNITY_CHECKPOINT.md` before changing Mentor recommendations or ST priorities.

Key corrections/additions:
- Mentor extraction is strong, but recommendation logic is **not finished**: v0.5.7 only uses Signature availability as a Boolean tie-break rather than its actual activation semantics.
- Current official Top Eleven documentation adds **3 Prestige levels** beyond Mentor Level 10 and confirms halftime Mentor swapping. **Superseded by v0.5.9:** the supplied current Windows client also exposes Prestige/Signature-Seal structures; only exact runtime effect magnitudes remain dynamic.
- Community evidence is now indexed as a separate corroboration layer, never promoted to GAME FACT.
- First ST qualitative evidence bands are preserved in `st_role_priority_evidence.json`; private numeric attribute weights remain unresolved.
- Current Formation v1 target remains closed/stable unless new evidence exposes a genuine contradiction.

**Active next target:** productionise/test the already-mapped Signature-aware Mentor rules without invented cross-Mentor percentages. ST SA weighting remains intentionally unresolved; Target Man tactic context is strong enough for cross/aerial-service companion logic, while False Nine/Poacher remain qualitative. Then continue to AML/AMR.


## v0.5.9 full Windows-client checkpoint

Read `V059_COMMUNITY_LOGIC_CHECKPOINT.md` together with `V059_FULL_WINDOWS_GAME_CHECKPOINT.md`. Structured extraction is in `data/current_windows_client_2026-09-14/`. The full-client checkpoint supersedes the v0.5.8 Shadow-Striker-absent research conclusion, upgrades Mentor Prestige/Signature Seals to current-client static fact, records explicit SA/Playstyle match-stream trigger architecture, and adds current Playstyle game-authored semantic feedback. The community checkpoint adds a confidence-rated 2024–26 forum/Reddit decision layer for Formation + Tactics + Mentor without promoting anecdotes to GAME FACT.

## v0.5.15 Special Ability canonicalisation checkpoint

Read `V0515_SPECIAL_ABILITY_CANONICALIZATION_CHECKPOINT.md` before changing current Special Ability identity handling. It documents **Shadow Striker** as the sole player-facing identity. Native/raw `LongShots` is handled only as an internal/localisation token at import boundaries and is never exposed as a separate ability. It deliberately does not invent a universal role→Special Ability restriction matrix or effects for unresolved/dead-ball-only abilities.


## v0.5.17 live Focus Passing label checkpoint

Read `../calibration/V0517_FOCUS_PASSING_LIVE_UI_LABEL.md` before changing Focus Passing option identity. Current client/internal `FocusPassingCenter` remains the runtime key, while the live user-facing option is **Through the Middle**.

## v0.5.17 Best-in-Slot long-term goal v1

Read `V0517_BEST_IN_SLOT_GOAL_V1.md` before changing the long-term ideal-XI layer. It is a separate, equal-quality-normalised transparent companion model that composes current Formation, Role+Playstyle target shapes, SA role eligibility, Tactics, Set Pieces and a full-unlock Mentor comparison. It never consumes opponent information and never replaces Match Ready current-squad selection.

