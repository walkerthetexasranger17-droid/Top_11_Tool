# v0.5.17 DEV PASS5 validation

**State:** UNPUBLISHED — do not publish.  
**Scope:** simplify Best-in-Slot to role/identity package logic; remove hypothetical player stats.  
**Match Ready decision model:** frozen v0.5.15 calibration unchanged.

## Change

Best-in-Slot v1 normalised hypothetical white-skill profiles are removed from the active goal model and UI.

Best-in-Slot v2 now compares:

`formation structure / natural role coverage -> role-valid Playstyles -> role-valid SAs -> Tactics -> Set Pieces -> full-unlock Mentor`

No player skill value, OVR, roleMean, roleFloor, hypothetical S/A/B/C attribute shape or invented player-strength number is used to select the long-term goal.

Official Top Eleven Squad Balance remains explicitly server-owned and is not reproduced offline.

## Current generated goal

- Formation: **4-2-3-1** (`4231`)
- Roles: `GK / DL DC DC DR / DMC DMC / AML AMC AMR / ST`
- Tactics: Short / Shoot on Sight / Left / High Cross / Regroup / Buildup / Zonal / Low Press / Track Back / Balanced Tackling / Normal
- Drain: Medium
- Mentor: **Lewis Green — The Wing Commander** under the explicit Level-10 comparison assumption
- Dedicated Corner / Free Kick / Penalty specialist coverage: complete

## Regression result

- Best-in-Slot v2 engine/data contract: **127 assertions PASS**
- Best-in-Slot UI contract: **24 assertions PASS**
- Core: **353 PASS**
- Tactics calibration: **178 PASS**
- Live drain: **52 PASS**
- Direct all-in-one: **5 PASS**
- Formation invariants: **27 PASS**
- Formation assignment / Playstyle / fallback: PASS
- SA eligibility: **65 PASS**
- SA picker: **11 PASS**
- Mentor: **18 PASS**
- Set Pieces: **29 PASS**
- Stitched pipeline: **26 PASS**
- Stitched monotonicity: **8 PASS**
- Order invariance: **4 PASS**
- Team Training: **14 PASS**
- Luiu fixture: **7 PASS**
- Player update scanner: **18 PASS**
- Set Piece coverage UI: **12 PASS**
- Tactic UI labels: **33 PASS**
- Strategy/data, static, package integrity, runtime hardening, cloud/navigation and scanner contracts: PASS

No Match Ready Formation/Tactics/Mentor/Set Piece/Training coefficient changed.
