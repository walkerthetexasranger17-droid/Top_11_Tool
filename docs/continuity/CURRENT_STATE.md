# Top Eleven Tool — Current State

**App version:** v0.5.2  
**Date:** 13 September 2026  
**Stable scanner baseline:** v0.4.18  
**Game reference:** build 30527 / Windows package 27.3.0.0  
**Current development area:** Team Plan — Mentor logic next

## Non-negotiable rules

- Do not guess Top Eleven formulas, hidden multipliers, tactics effects, Mentor effects, symbols, or server values.
- Prefer exact game binaries, IL2CPP/native metadata, serialized assets/localisation and controlled live captures.
- If not proven, mark it **UNRESOLVED**.
- Community/meta evidence may inform companion strategy but must never be presented as a game-code fact.
- Make narrow changes and preserve working code.
- Version builds numerically only: `v0.5.1`, `v0.5.2`, `v0.5.3`… **No r1/r2 suffixes.**
- Update this file and the Game Research Index before packaging any meaningful build.

## Stable / frozen areas

### Scanner
The v0.4.18 scanner pipeline achieved a clean real-device test and remains frozen unless a new real screenshot proves a regression. Native-resolution 2688×1216 handling, compact PlaystyleSmallAtlas references, pixel-level level guard and coloured Special Ability references must not be casually refactored.

### Formation
Formation is considered good. Do not redesign or rework it unless a specific bug is demonstrated.

## Completed in the v0.5.x line

### v0.5.1 — Set Pieces provenance
- Set Piece storage distinguishes automatic recommendations, manual overrides and migrated legacy values.
- Automatic non-Captain recommendations refresh against the current XI.
- Manual assignments persist.
- `Refresh Recommendations` deliberately replaces old/generated non-Captain picks.
- Captain remains manual because no authoritative Captain-selection formula has been recovered.

### v0.5.2 — Tactics evidence correction
- Exact build-30527 condition-drain arithmetic remains unchanged.
- Approach locks Mentality but no longer injects invented style weights into every other tactic.
- Symmetric lane data no longer fabricates Left Flank via enum order.
- Marking is no longer inferred from our own defenders; current game guidance describes it in relation to opponent attack style.
- Game semantic/playstyle/Special Ability relationships are tie-break evidence only, not fake hidden multipliers.
- Core deterministic suite reached 276 assertions before the research-index packaging pass.

### v0.5.2 — Embedded Game Research Index
The project now carries a structured game knowledge base at:

`docs/research/build_30527/`

and machine-readable indexes at:

`data/build_30527/index/`

This is now the preferred source for future logic work. Do not re-mine already indexed facts without a reason.

## New Mentor finding at this checkpoint

The current build's own localisation resolves the units/meaning of the seven captured Mentor boost families. This is stronger than the earlier raw-array-only interpretation.

Examples:

- `tacticWingAttacksEffectiveness [30]` = **30% increased wing-attack effectiveness**.
- `attributeCrossingHeading [20]` = **+20 Crossing and +20 Heading to all players during the match**.
- `signatureAnkleBreaker [25,10]` = set pieces **25% more effective**; after a miss, opponent attackers receive **-10% to their next attack**.
- `signatureIronCheck [2,10]` = successful defensive check drains **2% of the opponent attacker's maximum Condition**, with **10% higher card risk**.

See `data/build_30527/index/mentor_effects.json` for the full current/next arrays and decoded descriptions.

## Authoritative Mentor display correction

Exact game localisation identifies the Analyst as **Jonas Braun** (`mentorName_jonasBraun`). v0.5.2 corrects the companion display name from Jonas Brown without changing the internal `analyst` ID/effects.

## Known Mentor modelling defect in current app

The app currently lets a user alter a Mentor level while retaining effect arrays captured at another level. It can therefore score an effect that is not actually active at the selected level. This must be corrected before we tune Mentor recommendation ranking.

Do **not** invent missing intermediate per-level magnitudes. Use only:
- captured current/next arrays;
- proven unlock/availability state;
- game localisation semantics;
- future legitimate captures where needed.

## Current source files likely involved next

- `js/mentor-engine.js`
- `js/tactics-engine.js`
- `js/team-plan-engine.js`
- `js/app.js`
- Mentor data in `js/bible-data.js` / related data modules
- `data/build_30527/index/mentor_effects.json`

## Next execution order

1. Audit current `mentor-engine.js` against the new indexed Mentor semantics.
2. Separate **boost family availability** from **raw magnitude**; never reuse a captured magnitude at an unproven level.
3. Rebuild Mentor recommendation around direct tactic synergy + actually active attribute/signature effects.
4. Use Tactics and Mentor jointly where the game data proves a direct relationship (Short Pass, Long Pass, Wings, Counter Attack, etc.).
5. Add deterministic Mentor regression fixtures.
6. Run the full scanner/core/static/package suite.
7. Update `CURRENT_STATE.md`, `INDEX.md`, findings JSON and release notes before packaging v0.5.3.

## External reference file

The full Windows game package used for this research was `TopEleven_Full(4).zip`. Its critical hashes are stored in `data/build_30527/index/source_manifest.json`. The package itself is not embedded because of size. If future raw binary mining is required and the file is not attached, search the user's Library before asking for another upload.
