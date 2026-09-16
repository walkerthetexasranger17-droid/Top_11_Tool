# v0.5.17 DEV PASS4 validation

**State:** UNPUBLISHED — do not publish.  
**Scope:** Best-in-Slot long-term squad goal v1.  
**Decision model:** frozen v0.5.15 Match Ready calibration unchanged.

## Added

- deterministic build-time Best-in-Slot generator;
- generated Best-in-Slot model/data bundle;
- runtime fingerprint/legality validator;
- Formation-page long-term goal visual directly below current Formation;
- ideal slot Role + Master Playstyle + eligible/proven SA targets + attribute-shape priorities;
- ideal Tactics + full-unlock Mentor + Set Piece specialist coverage summary;
- service-worker precache for both new runtime JS files.

## Critical distinction

Best-in-Slot is transparent **Top Eleven Tool companion logic**, not a hidden Nordeus formula. Every ideal slot is equal-quality normalised. Opponent information is never used. Unresolved SA comparative effects remain unranked.

## Current generated goal

`4-1-1-3-1` — GK / DL DC DC DR / DMC / MC / AML AMC AMR / ST. Full details: `docs/research/build_30527/V0517_BEST_IN_SLOT_GOAL_V1.md`.

## Regression result

- Best-in-Slot engine/data contract: **152 assertions PASS**
- Best-in-Slot UI/PWA contract: **22 assertions PASS**
- core: **353 PASS**
- Tactics: **178 PASS**
- SA role eligibility: **65 PASS**
- SA picker: **11 PASS**
- direct all-in-one: **5 PASS**
- Mentor: **18 PASS**
- Set Pieces: **29 PASS**
- stitched pipeline: **26 PASS**
- Formation invariants/assignment/Playstyle/fallback: PASS
- Squad Blueprint: **21 PASS**
- Team Training: **14 PASS**
- Luiu fixture: **7 PASS**
- stitched monotonicity: **8 PASS**
- order invariance: **4 PASS**
- update scanner / Set Piece coverage / cloud / navigation / scanner/native-resolution / runtime hardening / strategy-data / static / package integrity: PASS
- active JS syntax: **22 files PASS**

Mixed Medium/High live drain arithmetic remains unresolved and unchanged.
