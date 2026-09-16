# v0.5.17 Special Ability role eligibility checkpoint

## Status

**Implemented in the unpublished v0.5.17 development line.**

This checkpoint supersedes the older assumption that no usable role→Special Ability eligibility system had been established.

## Current-client mechanism proven from the full Windows game package

The current IL2CPP client contains an explicit role-specific Special Ability eligibility path, including:

- `GetEligibleSpecialAbilitiesForRole`
- protobuf/server model `EligibleSpecialAbilitiesAndPlaystylesForRole`
- a data shape carrying **Role + SpecialAbilities + PlayStyles**

Static inspection of the installed package proves the mechanism exists. The full role rows were not found as a static JSON/TextAsset table in the installed package; they appear to be supplied through live/config data.

The legacy Top Eleven Wiki role table is **not authoritative for this project**.

## Working current matrix

The user supplied the current 19-ability role matrix and explicitly corrected the legacy Wiki values. It is adopted as the current app contract unless later direct current-client/server evidence disproves a row.

| Special Ability | Eligible natural roles |
| --- | --- |
| One-on-One Stopper | GK |
| Penalty Kick Stopper | GK |
| Aerial Defender | DC, DMC |
| Blocker | DC, DL, DR |
| Defensive Wall | DC, DL, DR, DMC |
| Intercepting Specialist | DC, DMC |
| Counter Attack Stopper | DMC, MC |
| Playmaker | DMC, MC, AMC |
| Dribbler | MC, ML, MR, AMC, AML, AMR |
| Corner Specialist | DL, DR, ML, MR, MC |
| Cross Expert | DL, DR, ML, MR, AML, AMR |
| Shadow Striker | AMC, AML, AMR |
| One-on-One Scorer | AMC, AML, AMR, ST |
| Versatile Attacker | AMC, AML, AMR, ST |
| Free Kick Specialist | every outfield natural role |
| Penalty Kick Specialist | every outfield natural role |
| Set Piece Taker | every outfield natural role |
| Set Piece Stopper | every current role, including GK |
| Rebound Specialist | every outfield natural role |

## Runtime rules

1. **Natural roles only.** Related roles do not grant Special Ability eligibility.
2. **Multi-role players use the union.** Example: DL/DC gets every ability valid for DL or DC.
3. **Existing/detected abilities are preserved.** Edit/scan review always keeps an already-saved or visually-detected ability visible even if it falls outside the current role filter. This prevents role editing or future matrix changes from silently deleting real player data.
4. **Scanner recognition remains role-independent.** Gemini still compares an occupied ability slot against all 19 exact visual references and is explicitly forbidden from inferring an ability from role/position semantics. Role filtering is a post-recognition UI/data boundary only.
5. **Best-in-Slot must use strict eligibility.** Future ideal-player recommendations use `specialAbilitiesForRoles(roles)` and must never treat a preserved out-of-role historical ability as a recommendation candidate.

## Code boundary

Canonical matrix:

- `js/bible-data.js` → `SPECIAL_ABILITY_ROLE_ELIGIBILITY`

Shared runtime API:

- `js/data.js` → `specialAbilitiesForRoles(roles)`
- `js/data.js` → `isSpecialAbilityEligibleForRoles(ability, roles)`

UI consumers:

- Add/Scan Player Special Ability picker
- Edit Player Special Ability picker
- future Best-in-Slot engine

## Regression locks

- `tests/special_ability_role_eligibility.js` — exact 19-row matrix, role unions and exclusions
- `tests/special_ability_picker_contract.py` — filtered UI, existing-ability preservation, role-change refresh and role-independent scanner identity recognition

The calibrated Formation/Tactics/Mentor/Training scoring model is unchanged by this feature.
