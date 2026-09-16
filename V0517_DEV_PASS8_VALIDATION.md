# v0.5.17 DEV PASS8 validation

**State:** UNPUBLISHED — do not publish.  
**Base:** verified v0.5.17-dev-pass7.  
**Scope:** fully automatic existing-player screenshot updates.  
**Match Ready decision model:** frozen v0.5.15 calibration unchanged.

## Changes

1. Removed the bulk-update per-screenshot squad-player dropdown and `needs-target` workflow from active runtime.
2. Lightweight update scanner now reads visible **name + age + skills**. Name is routing data only and never overwrites saved identity. OVR/roles/Playstyle/SAs remain excluded from update scanner schema/prompt.
3. Added Unicode/accent/case/punctuation-aware exact matching plus conservative unique fuzzy OCR matching. Duplicate/near-tie/unrelated names never guess.
4. Bulk updates can auto-detect GK/outfield layout before a saved target is known; matched role/layout is cross-checked before save.
5. Clean updates auto-save age + skills, remove the row and continue with no review/save taps.
6. Unsafe name or verification gets one automatic retry, then stops safely for attention.
7. Refresh restoration migrates old pass7 target-selection rows back into automatic scanning; old ready update scans are rescanned under the v2 scope.
8. Existing profile-specific Update by Scan remains supported, but the screenshot name verifies that the selected profile is actually the player shown.

## Dedicated verification

- Automatic update static/runtime contract: **27 PASS**.
- Automatic name matcher: **11 PASS**, covering exact, case/space, accents, Unicode, one-character OCR error, unrelated rejection, duplicate exact rejection, fuzzy near-tie rejection and blank-name rejection.

## Broader regression status before packaging

- Core: **355 PASS**.
- Tactics calibration: **178 PASS**.
- Live drain: **52 PASS**.
- Formation invariants: **27 PASS**.
- Direct all-in-one: **5 PASS**.
- SA role eligibility: **65 PASS**; picker **11 PASS**.
- Mentor: **18 PASS**.
- Set Pieces: **29 PASS**; coverage UI **13 PASS**.
- Stitched pipeline: **26 PASS**; monotonicity **8 PASS**; order invariance **4 PASS**.
- Team Training: **14 PASS**; Luiu **7 PASS**; Balanced Training **8 PASS**; representative-role matrix **24 PASS**.
- Best-in-Slot v2: **127 PASS**; squad-gap **28 PASS**; UI **29 PASS**.
- Tactic labels: **33 PASS**.
- Navigation/render, navigation/queue, static, runtime hardening, strategy-data, package integrity, scanner failover/image/compact-reference contracts: PASS.

## Locks

No Formation, Tactics, Mentor, Set Piece, Training or Best-in-Slot scoring coefficient changed. Scanner v12 full-player Playstyle/SA recognition is unchanged; only the existing-player lightweight update subpath now includes visible-name routing. Opponent information remains out of scope.


## Package verification

Draft checkpoint archive extracted with **822/822 files byte-identical**. Critical tests were rerun from the clean extracted copy: automatic name matcher, automatic update contract, 355 core, 178 Tactics, 5 direct all-in-one, 127 Best-in-Slot, 28 Best-in-Slot squad-gap, 29 Best-in-Slot UI, 65 SA-role, 13 Set Piece coverage UI, navigation/queue, static, package-integrity and scanner v12 Live contracts all PASS. Final archive must be regenerated after this validation note and byte-verified again.
