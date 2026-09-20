# v0.5.17 DEV PASS10 validation

**State:** UNPUBLISHED — do not publish.  
**Base:** verified v0.5.17-dev-pass9.  
**Scope:** make OVR follow automatic existing-player skill updates.  
**Match Ready decision model:** frozen v0.5.15 calibration unchanged.

## Correction

Update-mode OVR is now deterministic derived data rather than preserved identity. The scanner still reads name + age + the complete 15-skill board only. After verification, the app computes:

`OVR = Math.round(sum(15 visible skills) / 15)`

The derived OVR is saved with age + skills, then immediately reloaded and verified before a queue row is allowed to disappear. Natural/related roles, Playstyle and Special Abilities remain preserved.

## Dedicated verification

- Player update persistence test covers outfield derived OVR, GK derived OVR helper, identity preservation, revision increment and atomic rejection.
- Automatic update contract confirms update mode does not ask Gemini for OVR and uses the derived-OVR write-verified scope.
- Broader calibrated decision logic must remain unchanged.

## Packaging requirement

Create a full `top-eleven-tool-v0.5.17-dev-pass10-2026-09-16.zip`, extract it cleanly, confirm all **825/825 files** are byte-identical, and rerun the critical update/calibration/package gates from the extracted copy before delivery.

## Pre-package regression results

- Player update persistence: **20 PASS**.
- Automatic update name matcher: **11 PASS**.
- Automatic update contract: **31 PASS**.
- Core: **355 PASS**.
- Tactics calibration: **178 PASS**.
- Live drain: **52 PASS**.
- Direct all-in-one: **5 PASS**.
- Formation invariants: **27 PASS**.
- SA role eligibility: **65 PASS**; picker **11 PASS**.
- Mentor: **18 PASS**.
- Set Pieces: **29 PASS**; coverage UI **13 PASS**.
- Stitched pipeline: **26 PASS**; monotonicity **8 PASS**; order invariance **4 PASS**.
- Team Training: **14 PASS**; Luiu **7 PASS**; Balanced mode **8 PASS**; representative-role Balanced matrix **24 PASS**.
- Best-in-Slot v2: **127 PASS**; squad-gap **28 PASS**; UI **29 PASS**.
- Tactic labels: **33 PASS**.
- Navigation/render/queue, cloud local-first/hydration, runtime hardening, strategy/data, static, package-integrity and release-identity contracts: PASS.

No Match Ready/Formation/Tactics/Mentor/Set Piece/Training/Best-in-Slot scoring coefficient changed.
