# Top Eleven Tool — Current State

**App version:** v0.5.6  
**Checkpoint date:** 14 September 2026  
**Stable scanner baseline:** v0.4.18  
**Game reference:** build 30527 / Windows package 27.3.0.0  
**Current development area:** Target Formation + role-specific attribute-priority research

## Non-negotiable rules

- Do not guess Top Eleven formulas, hidden multipliers, tactics effects, Mentor effects or server values.
- GAME FACT / LIVE FACT / GAME ASSET FACT / STRONG EVIDENCE / COMPANION LOGIC / UNRESOLVED must remain separate.
- Version builds numerically only (`v0.5.3`, `v0.5.6`); no r-suffixes.
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

## Research findings checkpointed

Read `docs/research/build_30527/V054_ROLE_PRIORITY_CHECKPOINT.md`. Current key points:

1. **Mentors:** family unlocks 1/5/10 are proven; complete Level 1-10 numeric ladders remain runtime/server-owned/unresolved.
2. **Formation:** Lineup Balance is gameplay-relevant and position suitability changes it deterministically.
3. **New ST live fact:** replacing quality-51 natural ST Gosling Lataille with quality-44 natural ST François Roelandt raised Balance from ~9.8298 to 10.0.
4. **Equal-white average is insufficient:** Lataille still had the slightly higher equal-weight mean across all nine ST white skills, so the server result is not explained by simply averaging every white skill equally.
5. **Research hypothesis:** white/key attributes may have unequal importance inside a role. Roelandt's large Shooting/Finishing advantage makes those the leading ST-primary hypothesis, but no weight is proven and Playstyle remains a confounder.
6. **Training consequence:** if a per-role hierarchy is proven, train priority tiers rather than equalising every white skill. Example targets such as 250/180 are illustrative only, not constants.

## Next focused work

1. Search build 30527 native/game data specifically for **per-role attribute importance/weights/subsets** beyond simple white-skill membership.
2. Trace Football Engine action consumers and role/player evaluation code for evidence that some role attributes are primary.
3. Keep Target Formation research active: recruitment should ultimately specify both natural position and evidence-backed attribute profile.
4. If static data cannot reveal the hierarchy, design controlled Lineup Balance tests that isolate same-role players with contrasting attribute profiles.
5. Do not add unequal production weights until independently supported.

## External reference

The full game package is `TopEleven_Full(4).zip`. It is not embedded due to size. Critical hashes are stored in `data/build_30527/index/source_manifest.json`; search the Library before asking the user to upload it again.


## v0.5.5 evidence correction

Current striker screenshots and a same-slot UI re-test invalidate the use of the old Roelandt/Lataille Balance delta as evidence for ST primary-skill weighting. Both now display 9.9 Balance despite Lataille being much stronger across the ST key-skill profile. The old exact server result remains historical state evidence only. Research must seek per-role/action attribute priorities independently of Lineup Balance.

## v0.5.6 parked UI work

The collectible-style Player Profile concepts are **future UI work only**. Read `docs/design/PLAYER_PROFILE_TODO.md` before touching the Player Profile. The current global app shell/navigation must be preserved and the finished layout must support both mobile and desktop/web. Future profile data is restricted to the single scanned screenshot plus deterministic derivations from verified game data.

### Active next task

Resume native/game-data research for **role/action attribute importance**. Do not use Lineup Balance as the weighting oracle. Seek actual action consumers/formulas/subsets for shooting, finishing, passing, dribbling, crossing/aerial play, defending and goalkeeper actions; only then feed proven priorities into training/recruitment.
