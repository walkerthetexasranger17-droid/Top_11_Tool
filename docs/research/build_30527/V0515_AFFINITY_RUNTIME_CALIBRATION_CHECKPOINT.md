# v0.5.15 Calibration Checkpoint — Active Playstyle/SA Affinity Runtime

**Date:** 2026-09-15  
**Status:** working calibration checkpoint; **not release-frozen**.

## Why this checkpoint exists

The v0.5.15 calibration audit found that `decision_logic_v2.json` already contained the declared 19-Playstyle tactic-affinity table and 12 Special Ability affinity rows, but the runtime tactic scorer was only evaluating explicit `tactics.rules`. Most of the declared affinity table was therefore documentation/data-only rather than active decision logic.

This checkpoint records the corrected runtime and the calibration protections added around it.

## Runtime changes

### 1. Playstyle/SA affinities are now active

`js/strategy-logic.js` now applies the declared affinity table during tactic scoring.

Rules:

- a Playstyle contributes only when it is active and eligible for the player's **current assigned role**;
- a generic Playstyle affinity contributes once by **identity presence**, not once per player;
- a Special Ability affinity contributes once by identity presence only when its data row is `active:true`;
- unresolved/inactive Special Ability rows remain exactly zero;
- explicit contextual tactic rules may add additional evidence where the decision contract deliberately defines it.

### 2. Directional Winger / Wing Back focus affinity

A generic Winger or Wing Back no longer supports both left and right focus merely because the identity exists somewhere in the XI.

For **Winger** and **Wing Back** only:

- left-side assigned roles (`DL`, `ML`, `AML`) support `Left` + `Both`;
- right-side assigned roles (`DR`, `MR`, `AMR`) support `Right` + `Both`;
- if the same Playstyle identity exists on both sides, `Left`, `Right` and `Both` are available once each;
- the generic identity still does **not** multiply its points by player count.

Central/non-directional identities such as Target Man remain able to support service from either flank where the contract says so.

**Cross Expert is deliberately not made side-specific.** Current evidence proves the ability exists, but not a universal side-specific tactic-focus rule or role→SA eligibility matrix. Do not infer one from its name.

### 3. Playstyle-level normalization hardened

The shared Strategy boundary now resolves both enum IDs and named levels:

- Locked = 1
- Standard = 2
- Intermediate = 3
- Advanced = 4
- Master = 5

Explicit `Locked` is inactive. Standard+ is active. A legacy Playstyle object with no stored level remains active for backward compatibility. Formation tie-break logic consumes the same normalized level helper.

## Semantic-component recalibration

Activating the previously-dead affinity table made the old +19 raw semantic cap unusable: Playstyle-rich XIs routinely saturated the full 14/14 Playstyle/SA component.

Exact/legal-shape calibration found raw semantic scores reaching 79, so the current fixed global component scale is:

```text
negative cap = 2
positive cap = 80
neutral      = 0
max score    = 14
```

This is fixed global calibration, **not candidate-relative normalization**.

Regression locks now prove:

- 0 raw semantic evidence -> 0/14;
- 40 raw -> 7/14;
- 80 raw -> 14/14;
- a neutral no-Playstyle/no-SA XI receives 0;
- generic identity affinities are live (e.g. Regista, Playmaker);
- inactive/unresolved SA affinities stay zero;
- role-ineligible Playstyles contribute zero;
- duplicate identical Playstyles do not multiply generic identity points;
- left/right Winger and Wing Back affinities follow the actual assigned side.

## Current data/runtime model

`js/strategy-logic.js` model generation:

`companion-strategy-v2-own-squad-runtime-v0515-calibration-3`

Team Plan cache schema remains **v6** and fingerprints current game/Formation/Strategy/Coverage/Tactics/Mentor/Set-Piece models, so pre-calibration cached plans cannot silently survive this runtime change.

## Current validation checkpoint

Directly verified on the working tree after this pass:

- Core deterministic: **PASS — 347 assertions**
- Tactics calibration: **PASS — 160 assertions**
- Live drain: **PASS — 52 assertions**
- Formation calibration: **PASS — 27 assertions**
- Formation assignment: **PASS — 4 assertions**
- Natural fallback: **PASS — 4 assertions**
- Fallback monotonicity: **PASS — 5 assertions**
- Formation Playstyle: **PASS — 3 assertions**
- Data completeness: **PASS — 10 assertions**
- Squad Blueprint: **PASS — 21 assertions**
- Team Plan completeness: **PASS — 5 assertions**
- Training matrix: **PASS — all 40 profiles**
- Team Training: **PASS — 14 assertions**
- Set Pieces: **PASS — 29 assertions**
- Mentor: **PASS — 14 assertions**
- Stitched pipeline: **PASS — 25 assertions**
- Stitched monotonicity: **PASS — 8 assertions**
- Roster-order invariance: **PASS — 4 assertions**
- Strategy/data contract: **PASS — 12 roles, 28 role+Playstyle profiles, 11 formation rules, 56 tactic rules, 143 strings**
- Scanner/cloud/navigation/static/package-integrity/frozen scanner-reference contracts: **PASS**

## Drain boundary unchanged

The live drain model remains categorical. Mixed Medium↔High exchange rate is unresolved and is **not** fabricated. The runtime may only use component-wise categorical dominance as a safe tie-break where one plan has no more Medium choices and no more High choices than another.

## Next calibration target

Continue objective cross-system calibration from the now-active semantic runtime. Do not tune option frequencies for aesthetics. Only change rules when a controlled fixture proves a real semantic/player-pool/decision defect. Mixed live drain arithmetic remains pending user evidence.
