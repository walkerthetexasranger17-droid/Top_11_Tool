# START HERE — Top Eleven Tool

**Current app version: v0.5.2**  
**Current game-reference build: Top Eleven build 30527 / Windows package 27.3.0.0**

This file is the single entry point for a new ChatGPT chat, coding session, or recovery after conversation loss.

## Required startup sequence

Before modifying code:

1. Read `docs/continuity/CURRENT_STATE.md`.
2. Read `docs/research/build_30527/INDEX.md`.
3. Read `docs/research/build_30527/UNRESOLVED.md`.
4. For the subsystem you are about to change, read its file under `docs/research/build_30527/systems/`.
5. If exact machine-readable values are needed, use `data/build_30527/index/`.
6. Inspect the current source files named by `CURRENT_STATE.md` and verify the documentation still matches the code.
7. **Do not restart old reverse-engineering work unless the index says the evidence is missing or superseded.**
8. **Do not invent Top Eleven formulas or values.** Keep GAME FACT, LIVE FACT, GAME ASSET FACT, COMPANION LOGIC and UNRESOLVED separate.

## First response to the user in a recovered/new chat

After reading the files above, give the user a brief message containing:

- the current app version;
- what is already stable/frozen;
- what was most recently completed;
- the current research/development target;
- the next 2–4 actions you recommend;
- any genuinely required external file that is not already embedded.

Do **not** ask the user to re-explain the project before doing this recovery pass.

## Current one-line checkpoint

v0.5.2 has the stable v0.4.18 scanner, unchanged Formation, provenance-aware Set Pieces, the evidence-corrected Tactics engine, and the new embedded build-30527 Game Research Index. **Next production target: Mentor logic/effect-family modelling and Mentor↔Tactics synergy, using the indexed game/live evidence first.**

## Useful machine indexes

- `data/build_30527/index/findings.json`
- `data/build_30527/index/mentor_effects.json`
- `data/build_30527/index/tactics_semantics.json`
- `data/build_30527/index/native_methods.json`
- `data/build_30527/index/protocol_fields.json`
- `data/build_30527/index/source_manifest.json`

The detailed source archive is under `docs/research/build_30527/source_archive/`.
