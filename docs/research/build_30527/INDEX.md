# Top Eleven Build 30527 — Game Research Index

**Index version:** 1  
**Last updated:** 13 September 2026  
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

- [Tactics](systems/tactics.md)
- [Mentors](systems/mentors.md)
- [Set Pieces](systems/set_pieces.md)
- [Players, roles and key attributes](systems/players_roles.md)
- [Playstyles and Special Abilities](systems/playstyles_special_abilities.md)
- [Training](systems/training.md)
- [Unresolved targets](UNRESOLVED.md)

## Machine-readable indexes

- `data/build_30527/index/findings.json` — searchable finding register.
- `data/build_30527/index/mentor_effects.json` — Mentor IDs, live arrays, decoded semantics and protocol.
- `data/build_30527/index/tactics_semantics.json` — exact drain and shipped tactic tooltips.
- `data/build_30527/index/native_methods.json` — high-value recovered native symbols/addresses.
- `data/build_30527/index/protocol_fields.json` — high-value protocol fields.
- `data/build_30527/index/source_manifest.json` — build/source hashes.

## Current highest-value new finding

Mentor effect descriptions in the exact game package resolve the units and positions of previously ambiguous live arrays. Tactical effects are expressed as `% effectiveness`; attribute effects are explicit `+N` attribute points to all players; multi-value Signature Move arrays map to named effect/penalty positions. This materially improves Mentor logic without guessing.

## Research rule

Before investigating any game behaviour:
1. search `findings.json`;
2. open the system page;
3. inspect the embedded source archive if needed;
4. only then perform new binary/live research.

When a new fact is proved, update both the relevant system page and `findings.json`.
