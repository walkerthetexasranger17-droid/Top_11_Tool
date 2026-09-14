# Top Eleven Build 30527 — Game Research Index

**Index version:** 7  
**Last updated:** 14 September 2026  
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
- [Unresolved targets](UNRESOLVED.md)

## Machine-readable indexes

- `data/build_30527/index/findings.json` — searchable finding register.
- `data/build_30527/index/role_attribute_priority_hypotheses.json` — historical ST evidence, current re-test correction and current qualitative ST companion evidence bands.
- `data/build_30527/index/st_role_priority_evidence.json` — ST key-skill/action/Playstyle evidence and draft qualitative priority bands; no numeric Nordeus weights.
- `data/build_30527/index/community_evidence_2026-09-14.json` — web/community corroboration kept explicitly separate from GAME FACT.
- `data/build_30527/index/mentor_effects.json` — Mentor IDs, live arrays, decoded semantics and protocol.
- `data/build_30527/index/mentor_signature_rule_design.json` — all seven Signature activation contexts split into pre-match vs halftime/live rules; no fabricated universal Signature score.
- `data/build_30527/index/tactics_semantics.json` — exact drain and shipped tactic tooltips.
- `data/build_30527/index/native_methods.json` — high-value recovered native symbols/addresses.
- `data/build_30527/index/protocol_fields.json` — high-value protocol fields.
- `data/build_30527/index/source_manifest.json` — build/source hashes.
- `data/build_30527/index/ui_todo.json` — parked responsive Player Profile design constraints and references.

## Current highest-value checkpoint

The current recovery checkpoint is **v0.5.8**. Read `V058_MENTOR_ST_COMMUNITY_CHECKPOINT.md` first, then the closed v0.5.7 Formation + Tactics baseline. v0.5.8 records that production three-effect Mentor decision logic is not yet implemented, but the evidence architecture for all seven Signatures is now mapped in `mentor_signature_rule_design.json`; it also adds the official current 3-Prestige-level Mentor rule as a static-protocol unresolved boundary, and preserves the first qualitative ST role/Playstyle evidence bands plus a separate community-corroboration index. Do not use Lineup Balance as a weighting oracle and do not promote community outcomes to GAME FACT.

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

Current companion Target Formation: `GK / DL DC DC DR / DMC MC / AML AMC AMR / ST`. This is a transparent app target, not a Nordeus best-formation claim. Tactics remain XI/context-driven under the exact native drain constraint.

**Active next target:** evidence-backed role/Playstyle attribute priorities, starting with ST. Do not use Lineup Balance as the weighting oracle and do not promote companion weights to GAME FACT.


## v0.5.8 Mentor + ST / community checkpoint

Read `V058_MENTOR_ST_COMMUNITY_CHECKPOINT.md` before changing Mentor recommendations or ST priorities.

Key corrections/additions:
- Mentor extraction is strong, but recommendation logic is **not finished**: v0.5.7 only uses Signature availability as a Boolean tie-break rather than its actual activation semantics.
- Current official Top Eleven documentation adds **3 Prestige levels** beyond Mentor Level 10 and confirms halftime Mentor swapping. Exact build-30527 Prestige/Signature-Seal protocol representation remains unresolved.
- Community evidence is now indexed as a separate corroboration layer, never promoted to GAME FACT.
- First ST qualitative evidence bands are preserved in `st_role_priority_evidence.json`; private numeric attribute weights remain unresolved.
- Current Formation v1 target remains closed/stable unless new evidence exposes a genuine contradiction.

**Active next target:** productionise/test the already-mapped Signature-aware Mentor rules without invented cross-Mentor percentages. ST SA weighting remains intentionally unresolved; Target Man tactic context is strong enough for cross/aerial-service companion logic, while False Nine/Poacher remain qualitative. Then continue to AML/AMR.
