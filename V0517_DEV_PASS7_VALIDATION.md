# v0.5.17 DEV PASS7 validation

**State:** UNPUBLISHED — do not publish.  
**Base:** verified v0.5.17-dev-pass6.  
**Scope:** feature fine-tuning / smoke hardening only.  
**Match Ready decision model:** frozen v0.5.15 calibration unchanged.

## Changes

1. **Balanced Development training mode** added as an explicit third objective. Max Growth is unchanged. Balanced Development ranks sessions by: distinct weak-white coverage → total white coverage → distinct drills → raw useful utility → lower condition. Condition Efficient remains unchanged.
2. **Training mode restore/UI correctness:** restored saved sessions now set the selector to the actual saved mode; changing the selector clears a stale rendered session and requires a rebuild.
3. **Luiu integrity:** Max Growth remains six Fast Counter-Attacks. Balanced Development produces six distinct drills and expands Luiu from 1 to 5 distinct weak-white attributes covered in the current fixture.
4. **Cross-player Balanced audit:** eight representative roles (GK, DL, DC, DMC, MC, AML, AMC, ST) all build six slots; Balanced never covers fewer weak white skills than Max Growth in the deterministic matrix and uses six distinct drills in all eight fixtures.
5. **Best-in-Slot actionable gap states:** wrong Playstyle identity and full two-SA capacity conflicts are no longer called ordinary development. The guide now separates goal-ready, trainable gaps, identity gaps and natural-role recruit gaps.
6. **Set Piece role visual:** Set Piece pitch icons now use the player's actual assigned XI role, matching the Current XI Coverage cards.
7. **Update-scanner UX:** the add-player-only manual-entry hint is hidden in age+skills update mode.
8. **Continuity hardening:** stale NEW_CHAT recovery text that still pointed at dev pass2 is refreshed to pass7; root and continuity handoffs are resynchronised byte-for-byte.

## Non-changes / locks

- No Match Ready Formation/Tactics/Mentor/Set Piece ranking coefficient changed.
- No Best-in-Slot formation-goal scoring changed; the v2 target remains the existing stat-free package model.
- No Max Growth or Condition Efficient ranking behaviour changed.
- No scanner recognition logic changed.
- Opponent inputs remain permanently out of scope.
- Mixed Medium/High live tactic-drain arithmetic remains unresolved.

## Verification

- Core: **355 PASS**.
- Tactics calibration: **178 PASS**.
- Live drain: **52 PASS**.
- Formation invariants: **27 PASS** plus assignment/fallback/natural-fallback/Playstyle gates.
- Squad Blueprint: **21 PASS**.
- Team Training: **14 PASS**.
- Set Pieces: **29 PASS**.
- Mentor: **18 PASS**.
- Stitched pipeline: **26 PASS**.
- Stitched monotonicity: **8 PASS**.
- Order invariance: **4 PASS**.
- Direct all-in-one: **5 PASS**.
- SA role eligibility: **65 PASS**; picker **11 PASS**.
- Best-in-Slot v2: **127 PASS**.
- Best-in-Slot squad-gap: **28 PASS**.
- Best-in-Slot UI: **29 PASS**.
- Luiu fixture: **7 PASS**.
- Balanced Training: **8 PASS**.
- Balanced representative-role matrix: **24 PASS across 8 roles**.
- Player update scanner: **19 PASS**.
- Set Piece coverage UI: **13 PASS**.
- Tactic UI labels: **33 PASS**.
- Navigation/queue, navigation/render, cloud hydration/local-first, scanner image/failover, static, runtime hardening, strategy-data and package-integrity contracts: PASS.
- Pass6 vs Pass7 **Max Growth output comparison across 8 deterministic role fixtures: byte-identical JSON result**.
- Pass6 vs Pass7 **Condition Efficient output comparison across GK + MC deterministic fixtures: identical**.
- Final pass7 archive verification: **819/819 files byte-identical after clean extraction**, with critical calibration/Training/Best-in-Slot/update/Set Piece/static/package gates rerun from the extracted copy.

### Browser smoke classification

A local Chromium headless `--dump-dom` attempt was made. Chromium itself hung before returning any DOM and timed out after 12 seconds with DBus/zygote environment errors. No application assertion failed. Per the project rule this is classified **ENVIRONMENT BLOCKED — NOT APPLICATION FAILURE**.

## Next

User-test dev pass7 in the real browser/PWA. Keep making narrow correction passes only; do not begin the visual redesign or publish until the user is happy with feature behaviour.
