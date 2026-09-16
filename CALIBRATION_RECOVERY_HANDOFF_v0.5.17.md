# v0.5.17 UNPUBLISHED DEV PASS8 CHECKPOINT

**CURRENT WORKING STATE:** UNPUBLISHED v0.5.17 DEV PASS8  
**Date:** 16 September 2026  
**Base:** verified v0.5.17-dev-pass7 checkpoint  
**Match Ready decision model:** v0.5.15 calibration preserved unchanged  
**DO NOT PUBLISH.**

## Pass8 correction — existing-player updates are fully automatic

The user tested the Pass7 bulk update UI and rejected the manual per-screenshot player dropdown. Update mode must require no manual target selection in the normal path.

The active flow is now:

`screenshot → visible-name detection → safe My Squad match → age + skills scan → automatic save → queue removal → next screenshot`

### Locked safety boundaries

- Screenshot name is read **only** to match the correct saved player. The saved name is never overwritten.
- Update save still mutates only `age` and `skills` (plus scanner provenance). OVR, roles, related roles, Playstyle and Special Abilities remain preserved from the existing record.
- Exact normalised name match is preferred. Conservative fuzzy OCR tolerance is accepted only when one candidate clears 0.90 similarity and leads the runner-up by at least 0.08.
- Duplicate exact names, near-tie fuzzy names, blank names and unrelated names are never guessed.
- Bulk screenshots auto-detect GK/outfield layout and the result must agree with the matched saved player's GK/outfield identity.
- Scanner validation, aggregate checks and uncertainty must all be clean for automatic save.
- Unsafe matching/verification receives one automatic retry. If still unsafe, no save occurs and the row remains for attention.
- Old Pass7 `needs-target` rows are migrated to automatic queued scans on restore. Old update scans from the age+skills-only v1 scope are rescanned before save.

### Runtime files

- `js/scanner-engine.js` — update board/schema/prompt now includes visible name for routing and supports automatic layout detection.
- `js/players.js` — canonical Unicode-aware name normalisation and conservative match function.
- `js/app.js` — no update target picker; auto-match, auto-verify, auto-save, row removal and continuation.
- `tests/player_update_scan_contract.py` — 27 automatic-update assertions.
- `tests/player_update_auto_match.js` — 11 deterministic matcher assertions.
- `docs/research/build_30527/V0517_AUTOMATIC_PLAYER_UPDATE.md` — detailed boundary/provenance.

### Regression status

Dedicated auto-update contracts and the broad calibrated suite are green before packaging. No Match Ready, Best-in-Slot, Training, Set Piece, Mentor or Tactics scoring coefficient changed. Scanner v12 full-player recognition remains unchanged outside the lightweight update subpath.

### Package verification

A clean draft archive extracted with **822/822 files byte-identical**. The critical automatic-update, core, Tactics, all-in-one, Best-in-Slot, SA-role, Set Piece coverage, navigation, static/package and scanner contracts passed again from the extracted copy. The final pass8 archive is regenerated after this note and must be byte-verified before handoff.

### Next

User-test automatic bulk updating on real Skills screenshots. The normal path should require only selecting the screenshot batch. If a row stops, investigate why rather than reintroducing manual assignment as the normal workflow. Continue narrow correction passes only; do not publish or start the visual redesign yet.

---

# v0.5.17 UNPUBLISHED DEV PASS7 CHECKPOINT

**CURRENT WORKING STATE:** UNPUBLISHED v0.5.17 DEV PASS7  
**Date:** 16 September 2026  
**Base:** verified v0.5.17-dev-pass6 checkpoint  
**Match Ready decision model:** v0.5.15 calibration preserved unchanged  
**DO NOT PUBLISH.**

## Pass7 fine-tuning / smoke hardening

This pass closes the first broad fine-tuning sweep after the user's original v0.5.17 feature list. It deliberately makes narrow product-integrity fixes only; it does not recalibrate Match Ready Formation/Tactics/Mentor/Set Pieces or change the Best-in-Slot formation objective.

### 1. Individual Training now has three explicit objectives

`Max Growth | Balanced Development | Condition Efficient`

- **Max Growth is unchanged.** It still maximises useful white-skill utility first.
- **Balanced Development** is a separate transparent companion objective: distinct weak-white attributes covered → total white attributes covered → distinct drills → raw useful utility → lower condition → deterministic stable order.
- **Condition Efficient is unchanged.** It still prioritises useful utility per condition.
- Beam state now tracks unique drills so Balanced can reward variety without modifying the existing objectives.
- Restoring a saved session now restores the visible selector to that session's real mode.
- Changing mode while a result is displayed clears the stale result and requires a rebuild, preventing the UI from showing one objective while displaying another objective's session.

**Stefano Luiu fixture:** Max Growth remains `Fast Counter-Attacks ×6`. Balanced Development instead produces six distinct drills and increases distinct weak-white attributes covered from 1 to 5 in the locked fixture. This is intentional objective separation, not a Max Growth nerf.

Pass6→Pass7 regression comparisons prove Max Growth is byte-identical across eight deterministic role fixtures and Condition Efficient is identical across deterministic GK + MC fixtures.

### 2. Best-in-Slot current-squad guide now distinguishes actionable gaps

The long-term Best-in-Slot goal itself remains the stat-free v2 package model and still currently targets **4-2-3-1**. Only the current-squad annotation layer changed.

Gap model: `best-in-slot-squad-gap-v2-actionable-identity`.

States are now:

- `master-ready` — natural role + target active Playstyle at Master + all target SAs;
- `playstyle-upgrade` — correct target Playstyle/SAs but Playstyle level is below Master;
- `sa-development` — target Playstyle is correct and missing target SAs fit available SA slots;
- `playstyle-development` — target Playstyle still needs to be built/unlocked and there is no conflicting established identity;
- `playstyle-identity-gap` — an existing different Playstyle identity conflicts with the target and is not mislabelled as routine development;
- `sa-capacity-gap` — a target SA is missing but both SA slots are already occupied, so the app does not tell the user to train an impossible third SA;
- `missing-natural-role` — genuine long-term recruitment gap.

The summary therefore separates **goal-ready / trainable gaps / identity gaps / recruit gaps**. Natural-role-only, one-player-per-goal-slot and no-OVR/no-skill boundaries remain unchanged.

### 3. Set Piece assigned-role visual consistency

The automatic Set Piece pitch now uses each starter's **actual assigned XI role** for its role icon, matching the Current XI Coverage cards. It no longer falls back to a player's primary stored role when the Formation fields them in another legal role. Set Piece recommendation scoring is unchanged.

### 4. Existing-player update UX cleanup

The Add Player manual-entry hint is hidden while the scanner is in existing-player **age + skills update** mode. The update data boundary itself remains unchanged: age + skills only; full Edit Player remains the complete manual editor.

### 5. Continuity / recovery hardening

A stale `docs/continuity/NEW_CHAT_RECOVERY.md` still pointed at DEV PASS2. It is now refreshed to DEV PASS7. The root v0.5.17 recovery handoff and continuity mirror are resynchronised byte-for-byte before packaging so a future chat cannot recover two different current states.

### Verification gates

- Core: **355 PASS**.
- Tactics calibration: **178 PASS**.
- Live drain: **52 PASS**.
- Formation invariants: **27 PASS** plus assignment/fallback/natural-fallback/Playstyle gates.
- Squad Blueprint: **21 PASS**.
- Team Training: **14 PASS**.
- Set Pieces: **29 PASS**.
- Mentor: **18 PASS**.
- Stitched pipeline: **26 PASS**; monotonicity **8 PASS**; order invariance **4 PASS**.
- Direct all-in-one: **5 PASS**.
- SA role eligibility: **65 PASS**; SA picker **11 PASS**.
- Best-in-Slot v2: **127 PASS**; actionable squad gap **28 PASS**; UI **29 PASS**.
- Luiu fixture: **7 PASS**.
- Balanced Training: **8 PASS**; representative-role matrix: **24 PASS across 8 roles**.
- Player update scanner: **19 PASS**.
- Set Piece coverage UI: **13 PASS**.
- Tactic UI labels: **33 PASS**.
- Navigation/queue, navigation/render, cloud hydration/local-first, scanner image/failover, strategy/data, static, runtime-hardening and package-integrity contracts: PASS.
- Active runtime JS syntax passes.
- Final pass7 archive verification: **819/819 files byte-identical after clean extraction**, with critical gates rerun from the extracted copy.

A Chromium headless smoke attempt was also made but Chromium itself hung before returning any DOM and timed out with DBus/zygote environment errors. No application assertion failed. Per the project's established rule this is **ENVIRONMENT BLOCKED — NOT APPLICATION FAILURE**.

### Locks / unresolved

- No Match Ready scoring coefficient changed.
- No Best-in-Slot formation-goal scoring changed.
- No Max Growth or Condition Efficient ranking behaviour changed.
- No scanner recognition logic changed.
- Opponent information remains permanently out of scope.
- Mixed live Medium/High tactic-drain arithmetic remains unresolved rather than guessed.

### Next

User-test DEV PASS7 in the real browser/PWA. Continue only narrow correction passes until the feature behaviour is accepted. Do not begin the visual redesign or publish v0.5.17 development work yet. Preserve the mandatory full-ZIP/extract/byte-verify workflow on every pass.

---

# v0.5.17 UNPUBLISHED DEV PASS6 CHECKPOINT

**CURRENT WORKING STATE:** UNPUBLISHED v0.5.17 DEV PASS6  
**Date:** 16 September 2026  
**Base:** verified v0.5.17-dev-pass5 checkpoint  
**Match Ready decision model:** v0.5.15 calibration preserved unchanged  
**DO NOT PUBLISH.**

## Pass6 change — Best-in-Slot current-squad gap/coverage

The Best-in-Slot v2 goal is now turned into a practical recruitment/development guide without adding player-strength scoring. The goal itself remains static/model-driven. Current squad data is used only to annotate which ideal slots are already covered.

### Locked Pass6 boundary

`current squad -> natural-role global assignment -> Playstyle/SA identity comparison -> master-ready / development / recruit gaps`

- One saved player can satisfy at most one Best-in-Slot slot.
- A slot counts as covered only when the assigned current player has that role naturally. Related roles do not count for the long-term goal.
- Among natural candidates, the global assignment prefers exact active target Playstyle, then current Playstyle level, then target-SA matches. These are assignment/tie-break priorities only, not claimed gameplay coefficients.
- OVR, skills, roleMean, roleFloor, age, condition, morale and availability are not used. Dedicated regression fixtures use throwing OVR/skills getters to prove those fields are never read.
- `master-ready` requires natural role + exact active target Playstyle at Master + all target SAs.
- Natural-role players with identity gaps are shown as development gaps.
- Missing natural-role slots are shown as recruit gaps.
- If the Best-in-Slot slot has no proven preferred SA, the current player is not penalised for lacking an invented SA target.
- Current Match Ready Team Plan is not consumed by this layer and no Match Ready scoring coefficient changed.
- Official Top Eleven Squad Balance remains server-owned and is not reproduced.

### Runtime/UI files

- `js/best-in-slot-engine.js` — `squadGap()` global one-player-per-slot coverage engine; model `best-in-slot-squad-gap-v1-role-identity-only`.
- `js/app.js` — Best-in-Slot cards now show current matched player / identity gap / recruit gap and a summary row.
- `index.html` / `css/app.css` — coverage summary surface only; no broader visual redesign.
- `docs/research/build_30527/V0517_BEST_IN_SLOT_SQUAD_GAP.md` — method/provenance.

### Regression gates

- Best-in-Slot squad-gap contract: **24 PASS**.
- Best-in-Slot UI contract: **28 PASS**.
- Existing **353 core / 178 Tactics / 52 live-drain / 27 Formation / 65 SA-role / 29 Set Piece / 18 Mentor / 26 stitched / 8 monotonicity / 5 direct all-in-one** and supporting Training/scanner/cloud/navigation/static contracts remain green.
- Active runtime JS syntax passes.
- Pre-final packaged copy extracted **815/815 files byte-identically** and passed the Best-in-Slot gap/UI, core, direct all-in-one and package-integrity gates from the extracted copy. Final package is independently reverified after this handoff entry is written.

No Match Ready calibrated coefficient changed. Mixed live Medium/High drain arithmetic remains unresolved.

### Next

User-test the Best-in-Slot goal + current-squad gap presentation. Continue functional fine-tuning only; do not begin the visual redesign yet and do not publish v0.5.17 development work. Preserve the mandatory pass-by-pass full-ZIP recovery workflow.

---

# v0.5.17 UNPUBLISHED DEV PASS5 CHECKPOINT

**CURRENT WORKING STATE:** UNPUBLISHED v0.5.17 DEV PASS5  
**Date:** 16 September 2026  
**Base:** verified v0.5.17-dev-pass4 checkpoint  
**Match Ready decision model:** v0.5.15 calibration preserved unchanged  
**DO NOT PUBLISH.**

## Pass5 correction — Best-in-Slot v2 removes hypothetical player stats

The user clarified the intended long-term model: choose the best complete formation package, then give every required natural-role slot the Playstyle and Special Ability package that best complements the formation's Tactics and Mentor. Individual player attributes/OVR are not part of this stage.

DEV PASS5 therefore replaces the active Best-in-Slot v1 normalised-player layer with `best-in-slot-goal-v2-role-identity-only`.

### Locked v2 objective

`formation structure / natural role coverage -> role-valid Playstyle -> role-valid SA -> Tactics -> Set Pieces -> full-unlock Mentor`

- Every ideal slot is a natural-role player by construction.
- No OVR, white-skill mean, roleMean, roleFloor or hypothetical S/A/B/C attribute profile is used.
- The Match Ready current-squad engine remains unchanged and still uses real player skills where appropriate.
- Official Top Eleven Squad Balance is acknowledged as a real server-owned formation-position score, but its private server formula is not fabricated offline.
- Best-in-Slot tactic scoring excludes the real-player `nativeLineupFitScore`; it uses formation/role structure, internal tactic coherence, active eligible Playstyle/SA compatibility and drain efficiency.
- Skill-derived tactic capacities are neutral in this long-term layer. Identity-derived capabilities may be used only where the chosen Playstyle itself provides that semantic evidence.
- SA eligibility uses the v0.5.17 19-ability role contract. If no comparative open-play rule exists, the UI says `No proven open-play SA preference` and shows role-valid options rather than inventing a winner.
- Dedicated Corner / Free Kick / Penalty specialists may occupy second SA slots.
- Mentors are compared under the explicit long-term Level-10/unlocked assumption.
- Opponent information remains permanently out of scope.

### Current generated v2 goal

- **4-2-3-1 (`4231`)**
- Roles: `GK / DL DC DC DR / DMC DMC / AML AMC AMR / ST`
- Tactics: Short Passing / Shoot on Sight / Left Flank / High Crossing / Regroup / Focus on Buildup / Zonal / Low Pressing / Track Back / Balanced Tackling / Normal mentality
- Drain class: Medium
- Mentor: Lewis Green — The Wing Commander (full-unlock comparison)
- Dedicated penalty/free-kick/corner coverage: complete

The 4-1-1-3-1 package remains extremely close. 4-2-3-1 must be described only as the current winner of the transparent companion objective, never as a hidden Nordeus universal best formation.

Full method: `docs/research/build_30527/V0517_BEST_IN_SLOT_GOAL_V2.md`.

### Regression gates

- Best-in-Slot v2 contract: 127 PASS.
- Best-in-Slot UI contract: 24 PASS.
- Existing 353 core / 178 Tactics / 52 live-drain / 5 direct all-in-one / 27 Formation / 65 SA-role / 18 Mentor / 29 Set Piece / 26 stitched and supporting scanner/cloud/navigation/training contracts remain green.

No Match Ready calibrated coefficient changed. Mixed live Medium/High drain arithmetic remains unresolved.

### Next

User-test the simplified Best-in-Slot presentation and continue feature fine-tuning. Do not publish v0.5.17 development work yet. Preserve the pass-by-pass ZIP workflow.

---

# v0.5.17 UNPUBLISHED DEV PASS4 CHECKPOINT

**CURRENT WORKING STATE:** UNPUBLISHED v0.5.17 DEV PASS4  
**Date:** 16 September 2026  
**Base:** verified v0.5.17-dev-pass3 checkpoint  
**Decision model:** v0.5.15 Match Ready calibration preserved unchanged  
**DO NOT PUBLISH.**

## Pass4 change — Best-in-Slot long-term squad goal v1

The user wanted a second Formation-page layer showing the **ideal team to build toward**, including ideal Formation, Role/attribute profile, Playstyle, Special Ability, Tactics and Mentor composition. This is now implemented separately from the current Match Ready plan.

### Locked product separation

- **Match Ready / Recommended XI** continues to answer: *what is the best complete plan from the players currently owned?*
- **Best-in-Slot XI** answers: *what ideal squad should the manager recruit/train toward under the current Top Eleven Tool model?*
- Best-in-Slot never feeds, changes, or replaces the user's current Formation/Tactics/Mentor plan.
- Opponent information remains permanently out of scope.

### Evidence-safe Best-in-Slot model

Best-in-Slot is explicit **TOP ELEVEN TOOL COMPANION LOGIC**, not a recovered hidden Nordeus best-team formula.

`tools/generate_best_in_slot_v1.js` uses only existing current contracts:

- the 12 curated Formation families and v0.5.15 structural score;
- current Role+Playstyle target-shape profiles;
- exact current Playstyle-role eligibility;
- v0.5.17 working current SA-role eligibility;
- current Tactics compatibility/drain classes;
- current Set Piece specialist readiness;
- current Mentor synergy under an explicit long-term assumption that every Mentor is unlocked at Level 10.

Every ideal slot is normalised to **100 assigned-role white-skill mean**. Only the relative Role+Playstyle attribute shape changes. This prevents a formation from winning because the tool invented stronger absolute players.

Abilities with no current proven comparative tactic/set-piece benefit are **not ranked**. The UI shows **No proven SA preference** plus the role-eligible alternatives rather than inventing an effect.

The build-time search is deliberately bounded and documented: it enumerates all 12 curated formation families/legal `A|B` slot variants, explores direct/transition and technical/buildup identity branches under a tractable balanced baseline, then full-`recommendAuto()` finalises the top five before Set Pieces and full-unlock Mentor comparison. It must not be described as a mathematical proof of every conceivable Top Eleven identity combination.

### Current generated v1 goal

- Formation: **4-1-1-3-1 (`41131`)**
- Roles: `GK / DL DC DC DR / DMC / MC / AML AMC AMR / ST`
- Current ideal tactic plan: Long passing / Shoot on Sight / Left Flank / High crossing / Regroup / Focus on Buildup / Zonal / Low pressing / Track Back / Balanced tackling / Normal mentality
- Current drain class: **Low**
- Current full-unlock Mentor comparison: **Lewis Green — The Wing Commander**
- Dedicated Set Piece coverage: penalty + free kick + corner specialists.

Current slot targets:

- GK — Box Commander — no proven SA comparative preference
- DL — Wing Back — Cross Expert
- DC — No-Nonsense DC — no proven SA comparative preference
- DC — No-Nonsense DC — no proven SA comparative preference
- DR — Wing Back — Cross Expert
- DMC — Anchor Man — Playmaker
- MC — Regista — Playmaker + Corner Specialist
- AML — Winger — Cross Expert
- AMC — Enganche — Shadow Striker + Free Kick Specialist
- AMR — Winger — Cross Expert
- ST — Target Man — Penalty Kick Specialist for Set Piece coverage; no proven open-play SA preference

Full methodology/provenance: `docs/research/build_30527/V0517_BEST_IN_SLOT_GOAL_V1.md`.

### Runtime files

- `data/build_30527/index/best_in_slot_v1.json` — generated machine-readable goal.
- `js/best-in-slot-data.js` — browser data bundle.
- `js/best-in-slot-engine.js` — source/model/legality validator + label boundary.
- `js/app.js` — independent Best-in-Slot renderer.
- `index.html` / `css/app.css` — functional goal section directly below current Formation, before Squad Blueprint.
- `sw.js` — both new runtime JS files are precached.

The runtime validator rejects stale model fingerprints, unknown formation, incorrect formation-slot role, ineligible Playstyle, ineligible SA, >2 SAs or invalid coordinates rather than showing a stale goal.

### Regression gates added

- `tests/best_in_slot_contract.js` — **152 assertions PASS**.
- `tests/best_in_slot_ui_contract.py` — **22 assertions PASS**.

Existing frozen Match Ready gates remain green, including 353 core, 178 Tactics, 65 SA-role, 11 picker, 5 direct all-in-one, 18 Mentor, 29 Set Piece, 26 stitched, Formation/Blueprint/Training/Team Training, cloud/navigation/scanner, strategy/static/package integrity and active-JS syntax.

No v0.5.15 Formation/Tactics/Mentor/Set Piece/Training scoring coefficient changed. Mixed live Medium/High drain arithmetic remains unresolved.

### Next after this checkpoint

Test the Best-in-Slot presentation/logic against the user's expectations and continue fine-tuning v0.5.17 without publishing. Do not redesign visual styling yet. Any requested change to the Best-in-Slot objective should be made transparently in the generator/model rather than hard-coding a desired formation.

---

# v0.5.17 UNPUBLISHED DEV PASS3 CHECKPOINT

**CURRENT WORKING STATE:** UNPUBLISHED v0.5.17 DEV PASS3  
**Date:** 16 September 2026  
**Base:** verified v0.5.17-dev-pass2 checkpoint  
**Decision model:** v0.5.15 calibration preserved unchanged  
**DO NOT PUBLISH.**

## Pass3 change — role-specific Special Ability eligibility

The user corrected the legacy Wiki role table and supplied the current 19-ability role matrix. This was adopted as the app's working current eligibility contract after static inspection of `TopEleven_Full(6).zip` proved that the current client has a real role-specific SA system (`GetEligibleSpecialAbilitiesForRole` and `EligibleSpecialAbilitiesAndPlaystylesForRole`). The installed package exposes the mechanism/schema but not the complete live row values as a static table.

### Runtime rules now locked

- `js/bible-data.js` owns one canonical `SPECIAL_ABILITY_ROLE_ELIGIBILITY` matrix for all 19 current abilities.
- `js/data.js` exposes `specialAbilitiesForRoles(roles)` and `isSpecialAbilityEligibleForRoles(ability, roles)`.
- Add Player / scan review and Edit Player now show the **union of abilities eligible for the player's natural roles** instead of all 19.
- Related roles do **not** grant SA eligibility.
- A saved or visually detected ability outside the current role filter stays visible and selected so role editing or a later matrix correction can never silently delete real player data.
- Scanner identity recognition remains intentionally **role-independent**: all 19 exact visual references are still available to Gemini, and the scanner prompt still forbids inferring an ability from role/position semantics.
- Future Best-in-Slot recommendations must use the strict eligibility function, never the preservation exception.
- The old Top Eleven Wiki role table is not authoritative for this project.

Exact matrix/provenance: `docs/research/build_30527/V0517_SPECIAL_ABILITY_ROLE_ELIGIBILITY.md`.

### New regression gates

- `tests/special_ability_role_eligibility.js` — **65 assertions PASS** (all 19 exact rows, unions, exclusions and strict eligibility).
- `tests/special_ability_picker_contract.py` — **11 assertions PASS** (filtered UI, role-change refresh, preserved existing ability, full 19-image scanner identity pool).

All existing Formation/Tactics/drain/Mentor/Training/Set Piece/all-in-one/update-scanner/cloud/navigation/scanner contracts remain green. No calibrated scoring coefficient changed.

### Next after this checkpoint

Resume the separate **Best-in-Slot long-term squad goal** design. It can now use the same proven/current SA eligibility boundary as Add/Edit Player. Keep Match Ready current-squad optimisation separate and unchanged.

---

# v0.5.17 UNPUBLISHED DEV PASS2 CHECKPOINT

**CURRENT WORKING STATE:** UNPUBLISHED v0.5.17 DEV PASS2  
**Date:** 16 September 2026  
**Base:** verified v0.5.17-dev-pass1 checkpoint  
**Decision model:** v0.5.15 calibration preserved unchanged  
**DO NOT PUBLISH.**

## Pass2 changes

### A. Set Pieces — automatic coverage visual, manual picker removed

The user reported the manual assignment block under the Set Piece pitch was buggy and did not want to manage assignments there. DEV PASS2 removes that UX entirely without changing Set Piece ranking logic:

- removed the manual player candidate list;
- removed Clear / manual override / Refresh Recommendations controls;
- pitch slots are now informational, not clickable assignment controls;
- added **Current XI Coverage / Who covers what** beneath the pitch;
- coverage groups each selected-XI player with the duties currently assigned to them (corners, free kicks, penalties, captain);
- old migrated/manual UI state is reset to the automatic `plan.setPieces.assignments` state so a hidden override cannot survive while the UI claims assignments are automatic;
- Captain remains a convenience default only and contributes zero Team Plan score;
- preferred foot is still not captured, so left/right corner/free-kick duties may use the same recommended player.

Regression: `tests/set_piece_coverage_ui_contract.py` — **12 assertions PASS**. Existing Set Piece calibration remains **29 assertions PASS**.

### B. Training repetition integrity audit

No Training scoring change was made. The Luiu fixture from pass1 remains valid: Creativity is his dominant Mezzala+Playmaker deficit and Fast Counter-Attacks is the correct highest-scoring first drill under `maxGrowth`.

To test whether six repeats were a Luiu-specific anomaly, DEV PASS2 added deterministic `tests/training_repetition_audit.js` across 10 varied skill shapes for every current base role and Playstyle-role profile (**400 sessions total**):

- errors: **0**;
- max repeated drill count 2: 11 sessions;
- 3: 84;
- 4: 84;
- 5: 61;
- 6: **160**.

Conclusion: high repetition is structural to the explicit **Max Growth** objective whenever one legal intense drill keeps covering the dominant white-skill need. Do **not** add a hidden diversity penalty merely to make the session look varied. Historical/current community practice also supports focused repeated drill use for individual attribute development, but this remains contextual evidence rather than a recovered server formula. If the product later needs variety, add a clearly named second objective/mode rather than weakening Max Growth invisibly.

### Pass2 calibration lock

No Formation, Tactics, drain, Mentor, Set Piece ranking, Training priority, drill-strength, or Team Plan coefficient changed. Opponent information remains permanently out of scope. Mixed live Medium/High drain arithmetic remains unresolved.

### Next — DEV PASS3

Design and implement the separate **Best-in-Slot long-term squad goal** below the current Match Ready Formation. This must not replace current-squad optimisation. It should answer: what ideal formation, role profile, Playstyle and Special Ability composition should the user recruit/train toward so the resulting XI also forms a coherent Tactics + Mentor plan? Build it from existing proven role/Playstyle/SA/Tactics/Mentor contracts; do not invent hidden Top Eleven magnitudes.

---

# CALIBRATION / RELEASE RECOVERY HANDOFF — v0.5.17

**CURRENT WORKING STATE:** UNPUBLISHED v0.5.17 DEV PASS1  
**Date:** 16 September 2026  
**Public/release base:** verified v0.5.17 Focus Passing hotfix  
**Decision model:** v0.5.15 calibration preserved unchanged  
**DO NOT PUBLISH THIS DEV PASS YET.**

## Latest development checkpoint — v0.5.17-dev-pass1

The user explicitly reopened the v0.5.17 line for feature fine-tuning/testing before further visual redesign. This overrides the older note below saying later work must start v0.5.18. Keep the public/runtime version at **v0.5.17** while these unpublished pass1/pass2/pass3 recovery builds are being tested. Do not call these builds a release.

### 1. Existing-player scan update is now age + skills only

The previous **Update by Scan** path reused the full new-player scanner and could re-read identity data. DEV PASS1 gives existing-player maintenance its own scanner boundary:

- one lightweight Gemini scan reads **age + visible skills only**;
- saved player identity supplies GK/outfield layout, so update scanning does not re-detect player type;
- update schema/prompt excludes **name, OVR, roles, related roles, Playstyle, Playstyle level and Special Abilities**;
- save merges only `age` and `skills` into the existing record; all identity fields and OVR are preserved;
- skill range remains hard-bounded to **0..520**; age remains **15..60**;
- full manual **Edit Player** remains unchanged and can still edit the complete record;
- if a full Add Player scan matches an existing player, the safe action is now **Update age + skills only**, not replacement of identity fields.

**Important user decision:** OVR is deliberately preserved on update scans because the user requested that only age and skills change. Do not silently recalculate/overwrite OVR in a future chat without discussing that product decision.

### 2. Bulk existing-player update queue

The Squad screen now has **UPDATE PLAYERS**. It opens the scanner in update mode and supports multiple screenshots in the same queue. Each screenshot must be assigned to one saved squad player before it can scan; the same player cannot be assigned to two active queue rows. Profile-level **Update by Scan** pins the first queued screenshot to that profile.

Update review is intentionally locked for identity fields and exposes only the age/skill maintenance result. Save labels use **Save Update** / **Save Update & Next**. Queue persistence restores update targets and mode.

### 3. Master cards moved above normal drills

On **My Drills**, **Master Card Stock** is now above the standard/normal drill catalogue as requested. No drill values, XP logic, stock semantics or training scoring changed.

### 4. Stefano Luiu training integrity fixture

User-supplied live profile used for controlled training validation:

- MC, age 22, OVR 107;
- **Mezzala — Intermediate**; **Playmaker**;
- visible skills: Tackling 123, Marking 121, Positioning 157, Heading 46, Bravery 122, Passing 189, Dribbling 164, Crossing 51, Shooting 118, Finishing 59, Fitness 138, Strength 33, Aggression 46, Speed 137, Creativity 99.

With all normal drills available at World Class +30%, the current model deterministically finds:

- highest development need = **Creativity 99**, target ~155.84, gap ~56.84;
- Playmaker adds its verified companion training-context signal to Creativity and Passing;
- highest-scoring first drill = **Fast Counter-Attacks**, score ~667.54;
- current six-slot `maxGrowth` beam chooses Fast Counter-Attacks in all six slots.

This is **not** currently treated as a bug. It is mathematically consistent with the existing max-growth objective because Creativity is by far Luiu's largest active Mezzala/Playmaker deficit. DEV PASS1 adds `tests/luiu_training_integrity.js` to lock the first-drill/need reasoning, but does **not** lock a future policy that six identical drills must always be shown. Pass2 may assess whether controlled session diversification would be a better product objective across several real players. Do not change it based on appearance alone.

### 5. New regression coverage

`tests/player_update_scan_contract.py` — **18 assertions PASS** covering the update-only scanner contract, identity-preserving save boundary, bulk target queue and Master-card ordering.

`tests/luiu_training_integrity.js` — **7 assertions PASS** proving the Luiu hierarchy/context/highest-need/first-drill result.

All existing calibrated decision-engine gates remain green; no Formation/Tactics/Mentor/Set Piece/Training coefficient was changed.

### Explicit next work — v0.5.17 DEV PASS2 / PASS3

1. **Set Pieces UX cleanup:** remove the buggy manual player-assignment section beneath the automatic Set Piece field and replace it with a clear visual showing which current XI player covers each duty. Do not change calibrated automatic recommendation scoring without a failing fixture.
2. **Training product test:** run multiple real player profiles before deciding whether the six-slot `maxGrowth` display should have a controlled diversity/session-planning rule. Preserve the proven need model unless evidence shows a logic error.
3. **Best-in-slot long-term squad goal:** design this separately from current Match Ready Formation. The goal is an ideal long-term formation/XI blueprint including desired role, player profile/attribute shape, Playstyle, SA, Tactics compatibility and Mentor compatibility. Do **not** implement a guessed 'ultimate team' formula; first define the objective and prove how each layer composes. Opponent information remains permanently out of scope.
4. Continue mandatory recovery workflow: every pass stops early enough to update this handoff, run regressions, create a full ZIP, extract/verify it, and provide it to the user.

---

# Historical frozen v0.5.17 release handoff follows unchanged

# CALIBRATION / RELEASE RECOVERY HANDOFF — v0.5.17

**Status:** RELEASE-FROZEN TACTIC UI-LABEL HOTFIX
**Date:** 16 September 2026
**Decision model:** v0.5.15 calibration preserved unchanged

## Latest checkpoint — v0.5.17

The user live-tested v0.5.15 and supplied a current Top Eleven tactics screenshot proving that the user-selectable Focus Passing option is **Through the Middle**, not **Center**. The recovered current client still exposes the internal enum `FocusPassingCenter`; therefore the optimiser key remains `center` and only the user-facing label is mapped to `Through the Middle`.

### Locked distinction

- **GAME STATIC / internal identity:** `FocusPassingCenter` / companion key `center`.
- **LIVE UI / user selection label:** `Through the Middle`.
- Do not rename the internal key in scoring/drain rules.
- Do not display `Center` to the user as a selectable Focus Passing option.

### Regression added

A 33-option tactic UI-label contract now verifies every user-facing tactic label and explicitly proves that internal `center` renders as `Through the Middle`.

### Calibration locks preserved

- No opponent inputs.
- No scoring coefficients changed.
- Strategy model remains `companion-strategy-v2-own-squad-runtime-v0515`.
- Mixed Medium/High drain weighting remains unresolved.
- Shadow Striker remains the only player-facing identity; internal `LongShots` remains provenance/import compatibility only.

### Verification

Pre-package release gate passed: 353 core, 178 Tactics, 52 live-drain, 27 Formation invariants, 21 Blueprint, 14 Team Training, 29 Set Pieces, 18 Mentor, 26 stitched, 8 monotonicity and 5 direct all-in-one assertions, plus the new exact 33-option tactic UI-label contract and all static/cloud/navigation/scanner/package contracts.

### Next-version rule

Treat v0.5.17 as frozen after verification. Any later product or scoring change starts v0.5.18.

---

# Historical v0.5.16 handoff follows unchanged

# CALIBRATION / RELEASE RECOVERY HANDOFF — v0.5.16

**Status:** RELEASE-FROZEN HARDENING PASS  
**Date:** 16 September 2026  
**Decision model:** v0.5.15 calibration preserved unchanged  

## Latest checkpoint — v0.5.16 full-code audit

The user deployed v0.5.15 pass7 and requested a full coding audit. Existing release regressions were green, but code inspection exposed deployment/robustness defects outside the old test surface. v0.5.16 fixes only those defects; it does **not** recalibrate the all-in-one engine.

### Fixes

1. Eight inline hero URLs changed from `../assets/scenes/...` to `./assets/scenes/...` so subdirectory hosting works.
2. Service-worker offline fallback now cache-matches runtime shell requests with `ignoreSearch:true`, so precached unqueried files satisfy `?r=0516` requests offline.
3. Scanner skills now enforce the existing UI contract `0..520` both in the Gemini schema and before save.
4. Firebase account provider/MFA values are HTML-escaped before insertion through `innerHTML`.
5. Stale launcher/cloud diagnostic version labels were synchronized.
6. Obsolete malformed `tests/calibration_probe.js` was archived as a non-executable text artefact; it was never part of production/runtime tests.

### Calibration locks preserved

- No opponent inputs.
- No scoring coefficients changed.
- Strategy model remains `companion-strategy-v2-own-squad-runtime-v0515`.
- Mixed Medium/High drain weighting remains unresolved.
- Shadow Striker remains the only player-facing identity; internal `LongShots` is provenance/import compatibility only.

### Next-version rule

Treat v0.5.16 as frozen after verification. Any later product or scoring change starts v0.5.17.

---

# Historical v0.5.15 calibration/release handoff follows unchanged

# Top Eleven Tool — Calibration Recovery Handoff
**Recovery point:** September 2026  
**Current release:** v0.5.15  
**Current branch state:** release-frozen v0.5.15  
**Status:** RELEASE-FROZEN on 16 September 2026. Any subsequent product/scoring change starts v0.5.16.

---

# 0. CRITICAL INSTRUCTIONS FOR THE NEXT CHAT

Continue the existing Top Eleven Tool project from this handoff.

Do **not** restart the project.

Do **not** redesign working systems unnecessarily.

Do **not** invent Top Eleven formulas, hidden multipliers, drain values, mentor values, training gains, position penalties, or Special Ability magnitudes.

Always separate:

1. **GAME FACT — APK / native confirmed**
2. **LIVE FACT — observed in the user's official game/client**
3. **COMPANION LOGIC — our transparent optimiser logic**
4. **UNRESOLVED PRIVATE/SERVER LOGIC — do not fabricate**

The app must never require opponent information. Opponent formation, strength, tactics, live match state, scouting, weak zones, cards, etc. are permanently out of scope.

The optimiser works only from:

- user squad
- player natural roles / related roles
- player attributes
- playstyles
- Special Abilities
- Mentor levels/unlocks
- known game/client logic
- transparent companion logic

Use numeric versioning only:
`v0.5.N`

No `r1/r2` suffixes.

The v0.5.15 calibration phase is complete and **release-frozen**. Do not reopen calibrated scoring without a controlled failing fixture or new native/live evidence. Any new product/scoring work starts v0.5.16.

---

# 1. CURRENT RELEASE BASELINE

Last frozen release before calibration:

**v0.5.14**

That release already stitched the main decision chain:

```text
Squad
→ Formation / XI
→ Tactics
→ Set Pieces + Captain
→ Mentor
→ Team Plan
→ Individual / Team Training context
```

v0.5.14 also established:

- harder drills give higher recovered base XP
- captain is performance-neutral
- captain auto-fill is convenience only
- Role+Playstyle training uses a target-shape / tilt model
- Training develops specialists rather than flattening all white skills
- Set Pieces are part of the stitched Team Plan
- Mentors refine good plans but cannot rescue bad core plans
- Training inherits Team Plan context

Do **not** revert these.

---

# 2. CURRENT CALIBRATION PRINCIPLE

Calibration rule:

> Do not tune toward favourite formations, tactics, mentors or drill diversity.

Only change logic when a controlled test exposes a repeatable model defect.

Use:
- invariants
- adversarial synthetic squads
- tiny perturbations
- large perturbations
- left/right mirrors
- roster-order shuffles
- weak-bench monotonicity
- role-specific specialist fixtures
- whole stitched end-to-end fixtures

When a suspicious result appears:
1. decompose the exact score
2. identify the component causing it
3. fix the specific rule if justified
4. add permanent regression coverage

---

# 3. FORMATION / XI — CURRENT CALIBRATED STATE

## 3.1 Formation score

Calibrated Formation score:

```text
40 XI / role quality
10 Playstyle-role fit
20 weak-link protection
30 structural quality
= 100
```

Versatility/flexibility is **not** additive match-performance score.

It remains useful for:
- tie-breaking
- Squad Blueprint / recruitment coverage

Reason:
having multiple natural roles does not make a player better in the role he is currently playing.

---

## 3.2 Formation quality scaling

Old candidate min/max scaling was removed.

It caused tiny changes (e.g. +0.001 attribute) to create huge score swings.

Current approach:
- fixed/absolute quality-gap scaling
- tiny skill change → tiny score change
- genuine 5–10 point role-quality advantage → meaningful score change

Tiny perturbation test has shown approximately:
`+0.001 attribute → ~0.000011 Formation-score movement`

No cliff behaviour.

---

## 3.3 Structural score calibration

All 2,843 legal role-count shapes were analysed.

Raw structural score range:

```text
minimum = -13
neutral = 0
maximum = +30
```

Old structural mapping saturated many good formations at 30/30.

Calibrated fixed global mapping:

```text
raw -13 → 0/30
raw   0 → 15/30
raw +20 → 25/30
raw +29 → 29.5/30
raw +30 → 30/30
```

This scale is global and fixed.

It is **not** normalised relative to whichever formations happen to be available in one squad.

---

## 3.4 Playstyle component calibration

Old behaviour:
`matched active playstyles / active playstyles × 10`

This was too binary:
- one matched Playstyle could give 10/10
- one mismatched Playstyle could lose 10 points
- no Playstyles could still effectively look “perfect”

Calibrated behaviour:

```text
matched active Playstyles / 11 starters × 10
```

Therefore:
- no Playstyles = 0
- one correctly deployed Playstyle ≈ 0.91
- one ineligible Playstyle deployment = 0, not a -10 punishment
- full 10/10 requires all XI to have active Playstyles correctly deployed

---

## 3.5 Exact XI assignment / Pareto fix

A real bug was proven.

Old assignment solver maximised total role mean too early.

Counterexample:
one assignment had only about +0.10 average-role advantage but weakest role:
`110.1`

Alternative assignment:
weakest role:
`125.6`

The final Formation model clearly preferred the balanced assignment because weak-link protection is worth 20 points.

Fix:
keep a Pareto frontier of assignments using dimensions such as:
- total/average role quality
- weakest role / floor
- Playstyle fit
- natural-role information

Then choose using the same Formation score used by the Team Plan.

Validation:
- adversarial multi-role fixture passes
- 200 deterministic multi-role checks across selected formations passed
- 50 deterministic multi-role squads × all 12 curated formations produced zero disagreement between fast Pareto selection and explicit scoring of retained assignments

Keep this.

---

## 3.6 XI solver performance optimisation

Correctness fix initially made pathological multi-role squads expensive.

Measured pathological single-formation benchmark:

Before candidate caching:
- ~4.34 sec
- ~407 MB RSS

After **per-formation player→role candidate cache**:
- ~0.77–0.8 sec
- ~301 MB RSS

≈5.6× faster.

This optimisation is safe and should stay.

A **cross-formation shared cache** was tested and rejected:
- became slower (~7 sec median in pathological full run)
- memory inflated to roughly ~1 GB RSS

Do not reintroduce cross-formation shared caching.

---

## 3.7 Natural vs Related positions

Game/client evidence distinguishes:
- Natural
- Related
- Wrong

Implementation rule:

```text
Natural → legal
Related → legal
Wrong → excluded from normal optimisation
```

There is **no guessed numeric Related-position percentage penalty**.

Natural is preferred where appropriate/ties.

Do not invent:
- -5%
- -10%
- -20%
or any other related-role performance penalty.

---

## 3.8 Dynamic formation fallback

There are:
- 12 curated formations
- 2,843 legal natural-role fallback shapes

A real contract/runtime bug was found.

Old runtime only opened dynamic fallback if no curated formation was fieldable at all.

This allowed a curated formation using Related positions to suppress a better clean natural dynamic shape.

Fix:
dynamic natural fallback becomes available when no actual selected curated XI is fully Natural.

Related-role curated plans may still compete.

Do **not** exclude Related curated plans.

---

## 3.9 Fallback monotonicity bug

A second-order bug was found.

A natural dynamic plan scored about:
`81.0`

Best related-role curated alternative:
`64.96`

Adding a rubbish ~20-rated reserve DC made a curated shape technically natural, which used to close the dynamic fallback even though that bad DC stayed benched.

This violated:

> adding an unused weak player must not remove a previously legal superior plan.

Fixed.

Permanent rule:
an unused poor player cannot shrink the candidate set or suppress a better natural fallback.

---

# 4. TACTICS — CURRENT CALIBRATED STATE

## 4.1 Exhaustive search

The tactic engine still explores the full current tactic combination space.

Historical exhaustive space:
**97,200 combinations**

Do not replace exhaustive search with heuristic shortcuts.

Performance optimisations may remove repeated bookkeeping, but must not prune candidate choices or change answers.

---

## 4.2 Tactic score framework

Existing broad tactic framework:

```text
32 XI suitability
26 own-squad structural fit
18 internal tactical coherence
14 Playstyle + SA compatibility
10 condition-drain efficiency
= 100
```

During unresolved live-drain calibration, the 10-point drain component is held neutral rather than using guessed arithmetic.

---

## 4.3 Positive bucket saturation fix

Positive tactic-rule buckets were saturating too easily.

At one point ~53.5% of Medium-compatible tactic combinations hit max 18/18 coherence.

Calibration changed the positive mapping to use actual attainable positive-rule ranges.

Contradiction penalties remain strong.

This lets:
- truly coherent combos separate from
- merely non-contradictory combos

Do not restore old early saturation.

---

## 4.4 Tiny-perturbation stability

A known cliff was fixed in Shooting logic.

Previously:
`Work It Into The Box` got specialist bonus if
`boxFinishing > longShotThreat`
by any microscopic amount.

Meanwhile `Shoot On Sight` required a proper margin.

This meant +0.001 could flip the tactic.

Fixed:
specialist preference requires a full ~5-point calibration margin.

Inside ±5:
Balanced remains neutral.

Tiny +0.001 winger change now does not flip tactics.

---

## 4.5 Semantic near-tie resolver

Condition drain is not allowed to globally distort close semantic choices while live weights are unresolved.

Example:
symmetric strong-wing squad:
- Left Flank ~70.795
- Both Flanks ~70.473

Only ~0.32 difference.

Both Flanks had stronger football fit while Left saved some drain under the old model.

Near-tie semantic resolver was introduced only inside a tiny band (about 0.5).

Purpose:
- both equally strong wings → Both Flanks can win
- genuinely stronger left/right → correct one-sided flank still wins
- materially superior plan cannot be overridden by semantics

---

## 4.6 Left/right mirror invariance

Permanent invariant:

Mirror a left-heavy XI into a right-heavy XI.

Expected:
- Left Flank ↔ Right Flank
- all non-directional tactic values unchanged
- total tactic score unchanged

This passes and should remain permanent.

---

## 4.7 Credible outlet vs strong outlet split

Population testing previously showed:
- Long Passing = 12/12
- Counter Attack = 12/12

Root cause:
same boolean represented:
1. “route is possible”
2. “route is a genuine team strength”

These were split.

Current concepts:

```text
credible outlet
→ route is viable / prevents inappropriate penalties

strong outlet
→ required before positive own-squad strength bonus
```

Actual Poacher / Inside Forward / Target Man / strong transition profile can create “strong” signal.

Do not collapse these back together.

---

## 4.8 Width fallback bug fixed

A real implementation error existed.

A helper:
1. filtered players to a relevant pool
2. found no values
3. accidentally fell back to the ENTIRE XI

Result:
a narrow formation with no wide players could get fake Wide Attack / lane support from central players.

Fixed:
fallback stays within the filtered pool.
If relevant pool is empty → support = 0.

Permanent regression required.

---

## 4.9 Aerial target role leak fixed

Old 32-point lineup-fit layer allowed DC/DMC Heading/Strength to boost attacking AerialTarget.

Result:
strong centre-backs could push the app toward High Crosses.

Fixed:
open-play attacking aerial targets are advanced targets such as ST/AMC.

Delivery sources may still include wide defenders/wing-backs where appropriate.

Genuine Target Man + strong winger fixture still correctly chooses High Crosses.

---

## 4.10 Transition role leak fixed

A defensive-monster fixture showed:
only defenders had huge Speed/Passing-type values, yet Transition rose to ~108.6 and Long/Counter became attractive.

New own-squad model said:
`counterOutletStrong=false`

Fix:
Transition metric now uses the midfield/attacking transition unit:

```text
ML / MC / MR / AML / AMC / AMR / ST
```

Defenders no longer make the attacking transition unit look fast.

A deliberately defensive marker-monster fixture changed from:
`Long + Counter`
to:
`Short + Buildup`

Actual counter squads still choose counter logic.

---

## 4.11 Pressing GK leak fixed

GK Fitness is a white GK skill.

Old PressingUnit included it.

Changing only GK Fitness 100→200 moved PressingUnit:
`100 → ~103.7`

Fixed:
GK excluded from outfield PressingUnit.

---

## 4.12 Defensive positioning / ST leak fixed

Old defensive metrics allowed striker Positioning to increase defensive/tackling support.

Changing only ST Positioning to 250 previously caused:
- DefensiveUnit `100 → 106`
- Stay-On-Feet support `100 → ~110.7`

Fixed:
defensive positioning/tackling support comes from defensive/midfield unit only.

---

## 4.13 CURRENT NEXT TACTIC CALIBRATION TARGET

After fixing role-pool leakage, larger population testing still showed:

- Long Passing won ~28/30 varied balanced XIs
- Counter Attack won ~28/30

The raw Short+Buildup vs Long+Counter coherence is broadly symmetrical:
- Short + Buildup has +4 plus another +2 coherence
- Long + Counter has +4 plus another +2 coherence

But there is an additional rule:

`T-WON-COUNTER-DIRECT`

which gives another positive internal-coherence bonus when:

```text
Counter
+
Long or Mixed passing
+
merely credible counter outlet
```

This is suspicious because most normal teams have a *credible* outlet.

The next exact task is:

### Test whether `T-WON-COUNTER-DIRECT` should require `counterOutletStrong`
rather than merely `counterOutlet`.

Do NOT change it just because Long/Counter frequency is high.

Controlled validation required:

1. neutral/balanced XIs should stop receiving generic extra Counter credit
2. genuine Poacher / Inside Forward / Target Man / transition squads must keep Counter preference
3. specialist fixtures must remain correct
4. population distribution should improve naturally
5. no hand-balancing of option frequencies

This is the precise place to resume Tactics calibration.

---

# 5. LIVE CONDITION DRAIN — CURRENT EVIDENCE

DO NOT USE THE OLD 0–17 LINEAR INTERPRETATION.

The user discovered the earlier interpretation was wrong.

Current live observed per-option intensity classes:

## Shooting Tendency
- Shoot on Sight = 0
- Balanced = 1
- Work It Into The Box = 2

## Passing Style
- Long = 0
- Mixed = 1
- Short = 2

## Focus Passing
- Left Flank = 0
- Right Flank = 0
- Through the Middle = 0
- Balanced = 1
- Both Flanks = 2

## Cross Tendency
- Low = 0
- Medium = 0
- High = 0

## Possession Lost
- Regroup = 0
- Counter Press = 1

## Possession Won
- Focus on Buildup = 0
- Counter Attack = 1

## Mentality
- Normal = 0
- Defending = 1
- Attacking = 1
- Hard Defending = 2
- Hard Attacking = 2

## Marking Style
- Zonal = 0
- Man to Man = 1

## Pressing
- Low Block = 0
- Mid Press = 1
- High Press = 2

## Back Line
- Set Offside Trap = 0
- Track Opponent = 1

## Tackling — CORRECTED
- Stay on Feet = 0
- Balanced = 1
- Aggressive = 2

Important:
0 / 1 / 2 are best treated as observed **Low / Medium / High option-intensity classes**.

They are **not proven literal additive points**.

---

## 5.1 User live overall-class transition tests

Starting from all 0-intensity settings:

### Only level-1 changes
- 2 × `1` → still Low
- 3 × `1` → first Medium
- 9 × `1` → first High

### Only level-2 changes
- 1 × `2` → still Low
- 2 × `2` → first Medium
- 6 × `2` → first High

This proves:
- level 2 is more expensive than level 1
- `2` is not safely assumed to equal exactly `2 × 1`

Mixed combinations remain unresolved.

---

## 5.2 Drain architecture evidence

Client/native work proves:
- drain architecture exists
- 11 tactic dimensions are evaluated
- `TacticsConditionDrainSpec` exists
- `ClubResponse` field #154 exists
- runtime/server configuration can affect the values/intensities
- historical/default client constructor data is not safe to treat as current live truth

During calibration:
- do NOT compute a fake numeric live raw drain
- `rawScore = null`
- `relativeScore = null`
- `normalized = null`
- track counts of Medium / High intensity choices
- only compare plans as definitely cheaper when the categorical dominance is unambiguous
- keep drain-efficiency component neutral until mixed Medium/High weighting is solved

The user is independently researching mixed drain combinations.

Do not block the rest of calibration waiting for it.

---

# 6. TRAINING — CURRENT CALIBRATED STATE

## 6.1 Core philosophy

White skill does NOT mean:
“train all whites equally.”

The training engine builds a specialist.

Pipeline:

```text
Role + Playstyle
→ ideal target attribute shape
→ current player
→ target gaps
→ Team Plan tactic context
→ SA context
→ drill strength
→ six-drill search
```

Grey skills:
- zero utility
- no fabricated dilution penalty

---

## 6.2 Target-shape / tilt model

Current companion target ratios introduced in v0.5.14:

```text
S = 1.18
A = 1.05
B = 0.92
C = 0.85
secondary-role-only white = 0.82
```

These are transparent companion ratios, not claimed Nordeus formulas.

The Role+Playstyle target shape is dominant.

Tactic context and SA context are capped small modifiers.

Existing caps:
- tactic context max +20%
- active SA context max +8%

---

## 6.3 Target-anchor correction

The original calibrated target baseline moved through several iterations.

Current correct target anchor:

> median normalized non-signature development level

Reason:
one freak lower-priority skill must not move the whole target upward.

Example bad case:
Poacher:
- most whites = 150
- Heading = 200

Old anchor could push Finishing target absurdly toward 250+.

Current median non-signature anchor ignores one weird outlier but rises if supporting development genuinely rises as a group.

Do not revert to:
- max white
- top-three white mean
- single strongest non-S white

---

## 6.4 S-skill maintenance

Once a signature S-tier skill reaches its intended elevated target:
- it must drop to tiny maintenance need
- it must NOT keep chasing its own target upward

This is regression-protected.

All:
- 12 base roles
- 28 Role+Playstyle profiles

pass the target-shape invariants.

Total calibrated profile count:
**40**

---

## 6.5 Harder drills

Recovered drill base XP per player:

```text
Very Easy = 1
Easy      = 2
Medium    = 3
Hard      = 4
Very Hard = 5
```

Condition cost rises proportionally in the recovered default data.

Regular drill level:
- Semi-Pro +10%
- Pro +20%
- World Class +30%

Training uses drill gain strength when ranking drills.

Harder is better when:
- useful target coverage is equivalent

Harder is not automatically better when:
- lower-intensity drill attacks much more important target gaps

No “always choose six hardest drills” rule.

---

## 6.6 Grey-skill dilution boundary

Verified design explicitly says:

- grey/non-key skills = zero utility
- do NOT invent a dilution penalty

The current server returns authoritative training results and per-drill attribute-gain breakdown.

We have not proven:
“5 listed attributes means XP is divided by 5.”

Therefore do not invent a divide-by-attribute-count model.

---

## 6.7 Individual / Team Training consistency

A real inconsistency was fixed.

Team Training previously used flatter white-skill logic.

Now Team Training uses:
- the same Role+Playstyle target gaps
- same maintenance floor
- same capped Team Plan tactic context where available

Residual satisfied-skill utility aligned to the tiny Individual Training floor (~0.05) rather than old Team Training minimum 1.0.

---

## 6.8 Training completeness

Incomplete required white attributes must NEVER be treated as zero.

Current expected behavior:

### Individual Training
If required white attributes are missing:
- return explicit `missing-white-attributes`
- no drill recommendation

### Team Training
- incomplete players are excluded
- missing fields are reported

### Catalogue evaluator
- must also refuse unsafe ranking
- never coerce missing skill to 0 and create huge false weakness

This is now calibration-protected.

---

## 6.9 Age-rate boundary

Client proves server-provided age-rate fields:
- PlayerMaxRateAge
- PlayerHalfRateAge
- PlayerQuarterRateAge

But live values and exact current server effect are unresolved.

Normal training final per-player AttributeGain is server-authoritative.

Therefore:
DO NOT invent age multipliers for Team Training.

No:
`18yo=1x, 22yo=.5x, 26yo=.25x`
unless actual current live data proves it.

Age-dependent efficiency remains an explicit unresolved limitation.

---

# 7. SET PIECES + CAPTAIN

## 7.1 Set Piece hierarchy

Current transparent hierarchy:

### Penalties
1. Penalty Specialist
2. Set Piece Taker
3. Finishing / Shooting
4. Creativity / supporting attributes

### Free Kicks
1. Free Kick Specialist
2. Set Piece Taker
3. Shooting / Finishing / Passing / Creativity

### Corners
1. Corner Specialist
2. Set Piece Taker
3. Crossing / Passing / Creativity

Five penalty takers are unique.

Left/right assignments are independent records, but may choose the same player because preferred foot is not captured.

Do not invent foot preference.

---

## 7.2 Set Piece late Team Plan influence

Set Pieces are a late near-tie Team Plan consideration.

Current calibrated boundary:

if plans are within about **0.5 points** in overall/core quality:
Set-Piece readiness may break the tie.

Tests:
- ~0.4-point weaker core + significantly better specialists can win
- ~0.6-point weaker core cannot be rescued by specialists

This prevents specialists from dragging a materially worse XI into the team.

---

## 7.3 Set Piece Taker integration fix

Set Piece Taker now applies as second specialist tier to:
- penalties
- free kicks
- corners

Previously it was too corner-centric.

Dedicated role-specific specialist remains above Set Piece Taker.

---

## 7.4 Specialist magnitude unresolved

Current ranking is lexicographic:
dedicated specialist can beat a much stronger non-specialist.

An absurd stress test showed even:
~20-quality specialist can beat ~200-quality non-specialist for that specific dead-ball ranking.

This is recognised as a calibration boundary.

Do NOT invent:
- +10 skill
- +20 skill
- +25%
etc.

Current evidence proves specialists matter but does not prove current 2027 numeric trade-off.

Because Set Pieces only influence Team Plan in near-ties, this uncertainty is contained.

Leave unresolved unless stronger evidence appears.

---

## 7.5 Captain

Captain is performance-neutral.

Evidence:
- historical direct Nordeus support said captain does not make player stronger or alter stats
- current client has assignment/state but no recovered performance consumer / captain multiplier
- no current 2027 mechanic evidence has overturned this

Auto-fill convenience:
- highest OVR starter
- assigned-role mean
- assigned-role floor
- stable key

But Captain contributes:
- 0 Formation
- 0 Tactics
- 0 Mentor
- 0 Set Piece readiness
- 0 Team Plan score
- 0 tie-break performance value

Manual captain is performance-equivalent.

---

# 8. MENTORS

Mentor system already calibrated enough.

Core rules:
- selected XI + selected tactics + user unlocked Mentor/level
- Tactical relevance
- Attribute relevance
- Signature relevance
- level unlock gates respected
- opponent-context-only effects get zero speculative credit
- SA-only changes do not leak into Mentor attribute relevance

Mentor can add up to ~10 plan points only among plans already within about 10 core points of best plan.

Mentor cannot rescue a fundamentally worse Formation/Tactics plan.

Known close alternatives:
- Green / Herrera / Vidić can be close on some plans
- do not force winner diversity
- exact per-level server magnitudes remain unresolved

No current calibration evidence justifies changing Mentor weights.

---

# 9. SQUAD BLUEPRINT / RECRUITMENT — CURRENT CALIBRATED STATE

Blueprint uses broad:
- 70% core coverage
- 20% flexibility
- 10% availability/depth

Do not conflate this with Formation match-performance weights.

---

## 9.1 Smooth quality-credit fix

Old slot quality credit:

```text
gap < 10 → 100%
gap >= 10 → 60% forever
```

This caused a 20-rated reserve to improve total Blueprint coverage from roughly:
`70.0% → 74.0%`

Too generous.

New smooth calibration preserves existing anchors:

```text
0-point gap → 100%
10-point gap → 60%
larger gaps → progressively approach 0
```

Same 20-rated reserve now changes total coverage only:
`70.00% → ~70.06%`

Keep this.

---

## 9.2 Blueprint assignment objective fix

A real bug was proven.

Old Blueprint assignment maximised raw role-quality sum before applying slot importance.

Adversarial case:
- controller slot importance = 1.3
- one assignment gave Controller ~128.5 and winger ~154.2
- alternative gave Controller ~148.3 and winger ~133.9

Alternative had slightly lower raw sum but substantially better Blueprint coverage.

New assignment objective:

```text
1. maximum required coverage
2. importance-weighted role quality
3. stronger weakest assigned role
4. raw quality sum
```

This improved adversarial core coverage roughly:
`92.5% → 95.0%`

Keep it.

---

## 9.3 Blueprint reserve reuse

One reserve may appear in:
- Flexibility
- Availability/Depth

This is intentional descriptive capability, not necessarily double-counted simultaneous bodies.

Uniqueness rules apply within simultaneous layers.

Do not change unless a new controlled case proves misleading output.

---

# 10. CROSS-SYSTEM INVARIANTS NOW PROTECTED

These are important and should stay permanent.

## 10.1 Roster order invariance

Same squad in:
- normal order
- reversed order
- shuffled order

must produce same:
- Formation / XI
- Tactics values + score
- Mentor
- Set Pieces / Captain
- per-player development identities

This currently passes.

---

## 10.2 Weak-bench monotonicity

Adding an unused weak player must not alter:
- Formation
- XI
- Tactics
- Mentor
- Set Pieces
- Captain
- starter Training identities

This currently passes.

Adding a genuinely elite player may change plan.

Example:
elite ~200-quality Poacher correctly entered XI and downstream tactics changed.

---

## 10.3 No opponent inputs

Active runtime has no opponent-derived scoring inputs.

Opponent wording may exist in:
- descriptions
- historical docs
- unresolved Mentor effects

But no opponent feature is consumed by the optimiser.

Preserve this permanently.

---

# 11. CURRENT TEST / CALIBRATION STATUS

Latest known green checkpoint during calibration:

- **338 core assertions**
- **66 Tactics calibration assertions**
- **50 live-drain assertions**
- **40 Training profile cases**
- **10 Training completeness assertions**
- **15 Squad Blueprint calibration assertions**

Also passing:
- Formation sensitivity
- Formation structure scale
- Pareto XI assignment
- Playstyle Formation calibration
- dynamic natural fallback
- fallback monotonicity
- left/right mirror invariance
- roster-order invariance
- Team Training consistency
- Set Pieces
- Mentor invariants
- stitched pipeline
- weak-bench whole-plan invariance
- strategy-data contract
- manifest/hash integrity

Exact counts may grow after this handoff. Do not reduce coverage.

---

# 12. CURRENT PERFORMANCE STATE

Formation solver:
- exact
- no candidate pruning
- per-formation candidate caching retained

Rejected:
- cross-formation shared candidate cache

Exhaustive Tactics search remains intentionally exhaustive.

If future performance work is attempted:
- only remove repeated computation
- compare outputs before/after
- reject any optimisation that changes decisions
- reject memory-heavy caching that worsens real use

---

# 13. CURRENT CONTINUITY / DOCUMENTATION STATE

Active continuity docs must reflect:

## Drain
Not:
“0–17 live drain score”

Correct:
“0/1/2 observed per-option Low/Medium/High intensity classes, mixed weighting unresolved.”

## Training
Not:
“top-three normalized whites”

Correct:
“median normalized non-signature supporting development level.”

## Formation
Dynamic fallback trigger includes actual chosen curated XI naturalness and monotonicity protection.

Historical docs may preserve old findings as historical only.

Do not rewrite history, but active/current docs must not present superseded logic as current truth.

---

# 14. PRECISE NEXT STEPS

Resume here.

## Next Task A — Tactics Long/Counter bias

Investigate:

`T-WON-COUNTER-DIRECT`

Current suspicion:
it rewards Counter + Long/Mixed when only a **credible** counter outlet exists.

Test changing requirement conceptually from:

```text
counterOutlet
```

to:

```text
counterOutletStrong
```

But DO NOT commit until controlled tests show:

- neutral/balanced XIs lose generic extra Counter credit
- real counter squads retain preference
- Poacher / Inside Forward / Target Man transition fixtures still work
- no tiny perturbation cliff
- left/right mirror stays intact
- population improves naturally
- no manual target distribution balancing

Add regression only after proof.

---

## Next Task B — Continue Tactics role-pool audit

Already fixed:
- empty wide pool fallback
- aerial target defenders
- defensive Transition leak
- GK Pressing leak
- ST defensive Positioning leak

Continue checking other 32-point lineup-fit metrics for:
- semantically wrong player pools
- generic “can do” being treated as “is strong at”
- role/key-skill leakage

Do not narrow a pool unless a controlled fixture proves an incorrect recommendation.

---

## Next Task C — Continue full stitched perturbation matrix

Test:
- irrelevant +0.001 changes
- relevant +5 / +10 / +20 changes
- weak reserve additions
- elite starter additions
- mirrored squads
- multi-role squads
- no-Playstyle vs many-Playstyle
- set-piece specialist swaps
- Mentor unlock changes
- Training target progression

Expectation:
small irrelevant change → stable plan
large relevant change → allowed/expected plan movement

---

## Next Task D — Drain research integration

User is independently researching mixed Low/Medium/High drain combinations.

When user supplies new observations:
- preserve as LIVE FACT
- solve only what data proves
- do not assume `High = 2 × Medium`
- do not restore old 0/5/7 defaults as current truth
- update classifier only when mixed threshold evidence is sufficient

Until then:
drain component remains neutral during calibration.

---

## Historical Next Task E — Final calibration freeze criteria — SATISFIED BY SECTION 25

Historical gate, now satisfied at release freeze:

1. Long/Counter universal-bias investigation resolved
2. remaining tactic role-pool leakage audit complete
3. mixed drain model either solved or explicitly left unresolved with safe runtime behaviour
4. all calibration suites green
5. scanner/cloud/navigation frozen systems still pass
6. active docs/handoff synchronized
7. exact ZIP extracted and tested again
8. no stale version/schema/cache mismatch
9. handoff embedded in package updated to final calibrated state

---

# 15. FILES / SOURCES TO LOOK FOR IN LIBRARY

Useful prior artefacts include:

- `top-eleven-tool-v0.5.14.zip`
- `top-eleven-tool-v0.5.13.zip`
- `top-eleven-tool-v0.5.12.zip`
- `TOP_ELEVEN_TOOL_BIBLE_BUILD_30527_v1.1_VERIFIED.md`
- `BUILD_30527_IMPLEMENTATION_LEDGER*.md`
- `FULL_MINE_REPORT.md`
- `NATIVE_FORMULAS_PASS3.md`
- `NATIVE_FORMULAS_PASS5.md`
- `NATIVE_FORMULAS_PASS6.md`
- `NATIVE_FORMULAS_PASS7.md`
- `NATIVE_FORMULAS_PASS8.md`
- `te_reverse_engineering_pass3.txt`
- `te_v39_training_metadata.json`
- `Reverse Engineer Tactics Drains.html`
- latest generated app calibration working copy if available

Search the user's Library before asking them to recreate these.

---

# 16. USER PREFERENCES / WORKING RULES

The user strongly prefers:
- deep reasoning
- slow careful calibration
- no guesses
- exact evidence classification
- transparent unresolved values
- no “blasting through” logic
- no redoing already completed work
- no opponent information
- no hidden or arbitrary football formulas
- preserving every important finding inside the app/handoff

If a value cannot be proven:
mark it unresolved.

If a companion heuristic is necessary:
label it transparently as companion logic.

If a regression appears:
do not change expected outputs blindly.
First determine whether the test is stale or runtime is wrong.

---

# 17. SHORT COPY/PASTE STARTER PROMPT FOR A NEW CHAT

> **HISTORICAL continuation prompt — superseded by section 25.** Continue the Top Eleven Tool project from the attached Calibration Recovery Handoff. Do not restart the project. Current frozen release is v0.5.14; we are on the pre-v0.5.15 calibration branch. Preserve all calibrated Formation, Training, Blueprint, Set Piece, Mentor, drain-boundary and invariant fixes described in the handoff. Do not invent Top Eleven formulas. Opponent data is permanently out of scope. The immediate next task is to investigate the remaining Long Passing + Counter Attack population bias, especially rule `T-WON-COUNTER-DIRECT`, and determine through controlled fixtures whether it should require `counterOutletStrong` rather than merely `counterOutlet`. Keep live drain mixed weighting unresolved until the user provides enough evidence. Do not package v0.5.15 until the final calibration gates in the handoff are satisfied.

---

# 18. POST-BACKUP CALIBRATION CONTINUATION — CURRENT WORKING STATE

This section supersedes any earlier `precise next step` in this handoff. The original v0.5.15 calibration-handoff ZIP was created before the work below.

## 18.1 Long + Counter generic-bias investigation — RESOLVED

Controlled A/B testing proved that positive Long+Counter coherence must require a **genuinely strong counter outlet**, not merely a credible/playable outlet.

Current rules now require `own.counterOutletStrong` for both:

- `T-PASS-LONG-COUNTER`
- `T-WON-COUNTER-DIRECT`

A slow aerial Target Man can therefore justify **Long Passing + Buildup** without being automatically forced into Counter Attack. Genuine Poacher / Inside Forward / fast transition squads retain **Long + Counter**.

The symmetric strong-style calibration also gates:

- Short + Buildup coherence on `own.technicalBuild == high`
- Low Block + Regroup coherence on `own.pressCapacity == low`
- High Press + Counter Press coherence on `own.pressCapacity == high`

A neutral medium-capacity XI now resolves naturally toward **Mixed + Buildup + Mid Press** rather than receiving free extreme-style pair bonuses.

## 18.2 Semantic near-tie resolver — RESOLVED

The main rules were correctly strength-gated, but the 0.5-point semantic near-tie resolver still awarded generic:

- Long + Counter
- Short + Buildup

semantic points.

That back-door bias is removed.

Current semantic tie rules require:

- Long + Counter semantic credit -> `counterOutletStrong == true`
- Short + Buildup semantic credit -> `technicalBuild == high`

Neutral squads receive neither strong-style semantic bonus.

## 18.3 Current Special Ability identity — Shadow Striker LOCKED

**Shadow Striker is definitely a current in-game Special Ability.** The user has a current player with it.

Current client research proves **Shadow Striker** is the player-facing Special Ability. The client also contains a historical/internal `LongShots` enum/localisation token for that entry. That token is provenance only and must never be presented as a separate Special Ability named “Long Shots”.

Runtime scoring uses the current player-facing identity **Shadow Striker**. Import/storage normalization may silently translate the internal token to Shadow Striker, but Tactics/Training/UI must not describe “Long Shots” as an ability.

Do NOT remove Shadow Striker as legacy/stale.

## 18.4 Condition Efficient Training search depth

A controlled exhaustive-vs-beam test found a small real synthetic miss in **Condition Efficient** mode at beam width 250.

Measured result:

- beam 250 / 500 could miss the exhaustive optimum in the known synthetic ratio-objective case
- beam 1000 recovered the exhaustive optimum
- on the real drill catalogue across all 40 development profiles, 1000 did not change the selected sessions in the tested matrix but gives a safer search depth

Current runtime:

- Max Growth beam = **250**
- Condition Efficient beam = **1000**

This preserves default performance while hardening the optional ratio objective.

## 18.5 Squad Blueprint — Related vs Natural role boundary LOCKED

Formation may legally use server-provided Related positions, but Squad Blueprint recruitment coverage is deliberately **natural-role only**.

A Related-only DL:

- is shown in the per-role summary as Related cover
- does NOT fill the natural left-defender core Blueprint slot
- does NOT erase the missing-core recruitment priority

This prevents emergency/yellow cover from masquerading as actually owning the desired natural squad profile.

## 18.6 Team Plan cache invalidation — RELEASE-BLOCKING BUG FIXED

The calibration uncovered a critical integration bug: pre-calibration Team Plan schema v5 could survive while the underlying Formation/Tactics/Strategy logic had changed.

Current calibration generation now uses:

- Team Plan persistence schema: **v6**
- Formation model: `30527-role-v5-calibrated-v0515`
- Tactics model: `30527-drain-fit-v5-calibrated-v0515`
- Strategy model: `companion-strategy-v2-own-squad-runtime-v0515-calibration`
- Squad Blueprint model: `squad-coverage-v3-calibrated-v0515`
- Set Pieces: exported `SET_PIECE_MODEL`

Team Plan now fingerprints the active component models. A complete cached plan is stale if any relevant component model differs.

Old Team Plan schema v5 is rejected automatically.

This prevents the calibrated engine from silently displaying an old v0.5.14 recommendation after an upgrade.

## 18.7 Current regression counts after this continuation

Latest targeted green checkpoint:

- Core: **345 assertions**
- Tactics calibration: **108 assertions**
- Live drain: **50 assertions**
- Squad Blueprint calibration: **18 assertions**
- Strategy logic/data contract: PASS
- all previously calibrated Training / Formation / Set Piece / Mentor / stitched invariants remained green in the broad sweep immediately before the cache-generation bump

A final complete frozen-system sweep is still required before release-freezing v0.5.15.

## 18.8 Next calibration direction

Do NOT return to the old `T-WON-COUNTER-DIRECT` task; it is complete.

Continue with objective cross-system calibration only:

1. run full regression after model/schema bump;
2. continue auditing Tactics for semantic/player-pool leakage only where a controlled fixture proves a wrong decision;
3. keep mixed live Medium/High drain weighting unresolved pending user evidence;
4. do not invent Set-Piece specialist magnitude;
5. update this handoff again before any new backup ZIP or final v0.5.15 freeze.

---

# 19. LATEST RECOVERY CHECKPOINT — MANDATORY BACKUP PASS

This section supersedes earlier "next task" / regression-count notes in this handoff where they conflict.

## 19.1 Mandatory backup workflow from now on

The user has explicitly required that **every future calibration/development pass ends with a refreshed full-app backup ZIP** before the working session approaches its practical ~25–26 minute limit.

Treat this as a hard project workflow requirement:

```text
calibration / implementation work
→ stop starting new work early enough
→ update embedded recovery handoff
→ run relevant regression gates
→ create full current-app backup ZIP
→ extract/verify that exact ZIP
→ provide ZIP to user
```

Do not use the whole session window for calibration and leave packaging until after a timeout. Reserve enough time at the end of every pass for the recovery ZIP.

## 19.2 Long + Counter calibration completed

The earlier `T-WON-COUNTER-DIRECT` investigation is complete.

The deeper problem was that Long+Counter coherence could be rewarded even when the XI only had a merely credible route rather than a genuine counter strength.

Current calibrated rule family:

- generic Long+Counter coherence requires a **strong counter outlet**
- the extra direct-counter coherence also requires a **strong counter outlet**
- Long Passing itself may still be correct for a slow/direct Target Man team without automatically forcing Counter Attack

Controlled outcomes preserved:

- slow aerial Target Man/direct XI → Long may remain, but Buildup can beat Counter when transition strength is weak
- genuine Poacher / Inside Forward / strong-transition XI → Long + Counter remains reachable

Do not revert strong-outlet gating.

## 19.3 Neutral-style coherence gates completed

Generic style-pair bonuses no longer activate just because two toggles sound coherent.

Current evidence gates:

- Short + Buildup strong coherence requires genuinely high technical-build evidence
- High Press + Counter Press strong coherence requires high pressing capacity
- Low Block + Regroup strong coherence requires low pressing capacity
- medium/neutral-capacity XI can therefore legitimately settle on neutral defaults such as Mixed + Buildup + Mid Press

The semantic near-tie resolver obeys the same evidence gates:

- Long + Counter semantic bonus requires strong counter outlet
- Short + Buildup semantic bonus requires high technical build

This prevents unsupported styles returning through the near-tie back door.

## 19.4 Shadow Striker identity LOCKED

Shadow Striker is definitely a current in-game Special Ability. The user owns a current player with it.

Current identity boundary:

- player-facing/live identity: `Shadow Striker`
- internal/historical client enum/localisation token: `LongShots`

The internal token may be normalized silently at import boundaries, but it is **not** a separate Special Ability name and must never appear as one in UI/recommendation text.

Do NOT remove Shadow Striker as legacy/stale.

## 19.5 Condition Efficient Training beam depth

Production search now uses:

- Max Growth beam width = **250**
- Condition Efficient beam width = **1000**

Reason:
- a controlled exhaustive synthetic case proved Condition Efficient width 250/500 can miss the exact ratio-objective optimum
- width 1000 recovered it
- real 40-profile catalogue tests showed no recommendation degradation and acceptable runtime for the optional mode

Do not make Max Growth 1000 by default; it showed no practical need and would unnecessarily slow normal Training.

## 19.6 Team Plan cache/schema safety

Team Plan persistence is now **schema v6**.

A cached plan is current only if all relevant fingerprints match, including:

- game data version
- Formation model
- Strategy model
- Squad Blueprint model
- Tactics model (when tactics exists)
- Mentor model (when mentor exists)
- Set Piece model (when set pieces exist)

Current model IDs include:

- Formation: `30527-role-v5-calibrated-v0515`
- Tactics: `30527-drain-fit-v5-calibrated-v0515`
- Strategy: `companion-strategy-v2-own-squad-runtime-v0515-calibration`
- Squad Blueprint: `squad-coverage-v3-calibrated-v0515`
- Set Pieces: exported `SET_PIECE_MODEL`

Old v0.5.14/schema-v5 plans are invalidated automatically.

## 19.7 Strict unknown-data handling

A broad integrity pass fixed JavaScript coercion traps such as `Number(null) === 0`.

For decision logic, these mean **unknown**, not zero:

- missing / undefined
- `null`
- blank string
- nonnumeric value

A genuine numeric 0 remains valid data if the game supplies it.

Protected subsystem behaviour:

### Formation
A player is not eligible for an assigned role unless every required assigned-role white/key attribute is present and finite.

### Tactics
Direct `Tactics.recommend()` calls independently require a complete starter profile needed by the tactic metrics. Tactics no longer relies on Formation sanitising first.

### Complete Team Plan
Players missing visible data needed downstream are excluded up front and surfaced through readiness warnings rather than producing vague `no-complete-plan` behaviour.

### Set Pieces
Automatic Penalty / Free Kick / Corner ranking excludes a player missing any attribute used by that ranking. A specialist badge cannot outrank complete players while its numeric evidence is unknown.

### Training
All Training entry points treat missing/null/blank/nonnumeric required whites as missing, never as huge zero-valued weaknesses.

### Squad Blueprint
Functional assignments reject incomplete role profiles. The UI distinguishes raw natural-body count from **usable natural count**, so an incomplete natural-role player does not falsely show that recruitment coverage is complete.

## 19.8 Safe live-drain partial ordering extended

Mixed Medium-vs-High exchange rate is still unresolved.

However, one plan is provably cheaper than another when it is component-wise no worse:

```text
A.medium <= B.medium
A.high   <= B.high
and at least one is strictly lower
```

That safe categorical partial order is now used consistently in close/equal decisions across:

- tactic candidate comparison
- Auto approach comparison
- final Team Plan candidate comparison

Still unresolved and NOT numerically compared:

- 1 High vs 2 Medium
- any other trade-off where one plan has fewer of one intensity but more of the other

Do not invent a Medium↔High conversion.

## 19.9 Latest verified regression checkpoint

Verified directly from the current full v0.5.15 calibration working tree before creating the refreshed backup ZIP:

- Core deterministic suite: **PASS — 347 assertions**
- Tactics calibration: **PASS — 123 assertions**
- Live-drain profile: **PASS — 52 assertions**
- Formation calibration invariants: **PASS — 27 assertions**
- Formation assignment calibration: **PASS — 4 assertions**
- Formation fallback monotonicity: **PASS — 5 assertions**
- Formation natural-fallback calibration: **PASS — 4 assertions**
- Formation Playstyle calibration: **PASS — 3 assertions**
- Squad Blueprint calibration: **PASS — 21 assertions**
- Data completeness calibration: **PASS — 10 assertions**
- Team Plan data completeness: **PASS — 5 assertions**
- Training calibration matrix: **PASS — 40 profiles (12 base + 28 Role+Playstyle)**
- Team Training calibration: **PASS — 14 assertions**
- Set Piece calibration: **PASS — 29 assertions**
- Mentor calibration: **PASS — 14 assertions**
- Stitched pipeline: **PASS — 25 assertions**
- Stitched plan monotonicity: **PASS — 8 assertions**
- Roster-order invariance: **PASS — 4 assertions**
- Strategy logic/data contract: **PASS — 12 roles, 28 role+Playstyle profiles, 11 formation rules, 56 tactic rules, 143 strings**
- Package integrity: **PASS — 464 precached runtime files; 461 required runtime files**
- Static checks: PASS
- Cloud hydration/navigation: PASS
- Navigation/render: PASS
- Navigation/queue: PASS
- Scanner v12 Live contract: **PASS — 11 assertions**
- Scanner image contract: PASS
- Scanner compact-reference regression: PASS
- v0.4.13 reference contract: PASS
- v0.4.18 all-native-resolution contract: PASS

## 19.10 Precise next task after this backup

Resume calibration from here:

1. **finish the canonical current Special Ability / Playstyle trigger audit** across Tactics and Training; Shadow Striker is the locked player-facing identity and internal `LongShots` normalization is provenance/import compatibility only;
2. continue objective cross-system calibration only where a controlled fixture demonstrates a real wrong decision or semantic/player-pool leak;
3. preserve the current neutral-style, strong-outlet, strict-data and cache-fingerprint fixes;
4. keep mixed live Medium/High drain weighting unresolved until the user supplies enough live evidence;
5. do not invent Set-Piece specialist magnitude;
6. before the next ~25–26 minute work window ends, update this handoff and create another full verified backup ZIP.



---

# 20. Latest mandatory-backup checkpoint — active affinity runtime + directional Playstyles

This section supersedes the older "next task" wording above where it conflicts.

## 20.1 Completed since the previous backup

- Activated the declared 19-Playstyle tactic-affinity table and active Special Ability affinity rows in the runtime scorer; these are no longer documentation-only data.
- Generic Playstyle affinity contributes once per identity presence, only when the Playstyle is active and eligible for the player's current assigned role.
- Generic SA affinity contributes once per identity presence only for `active:true` rows. Unresolved/inactive rows remain zero.
- Recalibrated the 14-point Playstyle/SA component to a fixed global **+80 raw positive cap** after exact legal-shape searches reached 79 and the old +19 cap saturated Playstyle-rich XIs.
- Made **Winger** and **Wing Back** focus-passing affinity side-aware from the actual assigned role: left-side -> Left/Both; right-side -> Right/Both; both sides -> Left/Right/Both, still only once per identity.
- Deliberately did **not** make Cross Expert side-specific; current evidence does not prove a universal side/role SA rule.
- Added shared named Playstyle-level normalization. `Locked=1`, `Standard=2`, `Intermediate=3`, `Advanced=4`, `Master=5`; explicit Locked is inactive, Standard+ active, missing legacy level remains active for compatibility.
- Strategy runtime generation is now `companion-strategy-v2-own-squad-runtime-v0515-calibration-3`.
- Team Plan cache remains schema **v6** with game-data + engine-model fingerprint validation.

## 20.2 Shadow Striker remains locked as current

Do not regress this: **Shadow Striker is current and is the sole player-facing identity**. `LongShots` is only an internal/historical client token for that entry. Silent import normalization is allowed; user-facing logic must never call “Long Shots” a Special Ability.

## 20.3 Current verified counts

- Core: **347 PASS**
- Tactics calibration: **160 PASS**
- Live drain: **52 PASS**
- Formation calibration: **27 PASS**
- Formation assignment: **4 PASS**
- Natural fallback: **4 PASS**
- Fallback monotonicity: **5 PASS**
- Formation Playstyle: **3 PASS**
- Data completeness: **10 PASS**
- Squad Blueprint: **21 PASS**
- Team Plan completeness: **5 PASS**
- Training: **40 profiles PASS**
- Team Training: **14 PASS**
- Set Pieces: **29 PASS**
- Mentor: **14 PASS**
- Stitched pipeline: **25 PASS**
- Stitched monotonicity: **8 PASS**
- Roster-order invariance: **4 PASS**
- Strategy/data contract: **PASS**
- Frozen scanner/cloud/navigation/static/package checks: **PASS**

## 20.4 Exact next calibration target

Continue the objective cross-system audit from the active semantic runtime. Do **not** balance tactic frequencies cosmetically. Look only for controlled semantic/player-pool/data-integrity defects. Mixed Medium↔High live drain weighting remains unresolved pending the user's live testing and must stay nonnumeric.

## 20.5 Mandatory workflow

Before every future ~25–26 minute work window ends: stop new calibration early, update this handoff, run relevant regressions, create the full current-app ZIP, extract/verify that exact ZIP, and give the refreshed backup to the user.


---

# 21. Latest mandatory-backup checkpoint — role-gated affinity audit + exact de-dup range

This section supersedes section 20 where it conflicts.

## 21.1 Immediate Playstyle assigned-role bug — COMPLETE

Tactics now uses the same semantic activation boundary required by Formation:

> A Playstyle contributes only when active **and** the player current assigned role is one of that Playstyle eligible roles.

Related-position legality is unchanged. The player may still be fielded there; only the Playstyle tactic contribution becomes zero. A permanent regression covers a Wing Back legally Related at DC and proves Wing Back tactic identity is inactive in that assignment.

## 21.2 Affinity-runtime audit — RESOLVED

The 19-Playstyle affinity table and active SA affinity rows are genuine runtime companion data, not documentation-only data. Leaving them dead meant most offered Playstyles had no path into the declared 14-point Playstyle/SA compatibility component.

However, the first activation pass stacked generic affinity points on top of four relationships already represented by pure identity-only explicit tactic rules. This was a real double-counting defect.

De-duplicated relationships:

- Winger -> Medium Cross (`T-CROSS-WINGER`)
- Sweeper Keeper -> Offside (`T-OFFSIDE-SWEEPER`)
- Ball Winner / Stopper -> Aggressive Tackling (`T-TACKLE-AGG-DISRUPT`)
- Shadow Striker -> Shoot on Sight (`T-SHOOT-SIGHT-SA`)

Policy: keep the established explicit rule and suppress only the duplicate generic affinity. Contextual explicit rules with extra own-squad conditions remain additive (Target Man aerial outlet, Winger aerial outlet, Cross Expert + real wide progression).

Shadow Striker remains current and is the only player-facing identity. Internal `LongShots` normalization may occur at import boundaries but must never be described as a separate ability.

## 21.3 Exact Playstyle/SA semantic range — PROVEN

A mixed-integer optimisation over the exact build-30527 hard-legal role constraints, current Playstyle role eligibility, tactic option domains, active SA semantics and current explicit rules proved the post-de-dup maximum raw semantic score is **74**.

A separate legal runtime XI reproduces **74** exactly and is now regression-locked.

Current component mapping:

```text
raw 0  -> 0/14
raw 37 -> 7/14
raw 74 -> 14/14
```

The old +80 cap was pre-de-dup and is superseded. Negative cap remains 2.

Current generations:

- Strategy: `companion-strategy-v2-own-squad-runtime-v0515-calibration-4`
- Tactics: `30527-drain-fit-v5-calibrated-v0515-affinity-dedup`
- Team Plan cache schema: v6; model fingerprinting remains active.

## 21.4 Drain boundary unchanged

Mixed live Medium/High weighting remains unresolved. Do not invent a numeric exchange rate.

## 21.5 Next calibration direction

Continue only controlled semantic/player-pool/cross-system calibration where a fixture proves a real wrong decision. Do not rebalance tactic frequencies cosmetically. Keep opponent information permanently out of scope. Before every future work window ends, update this handoff and provide another extracted/verified full backup ZIP.

## 21.6 Verified regression gate for this packaged checkpoint

The frozen state above was re-tested before packaging. Verified results:

- Core deterministic suite: **PASS — 347 assertions**
- Tactics calibration: **PASS — 174 assertions**
- Live-drain profile: **PASS — 52 assertions**
- Formation calibration invariants: **PASS — 27 assertions**
- Formation assignment: **PASS — 4 assertions**
- Formation natural fallback: **PASS — 4 assertions**
- Formation fallback monotonicity: **PASS — 5 assertions**
- Formation Playstyle: **PASS — 3 assertions**
- Data completeness: **PASS — 10 assertions**
- Squad Blueprint: **PASS — 21 assertions**
- Team Plan completeness: **PASS — 5 assertions**
- Training calibration matrix: **PASS — 40 profiles**
- Team Training: **PASS — 14 assertions**
- Set Pieces: **PASS — 29 assertions**
- Mentors: **PASS — 14 assertions**
- Stitched pipeline: **PASS — 25 assertions**
- Stitched plan monotonicity: **PASS — 8 assertions**
- Roster-order invariance: **PASS — 4 assertions**
- Strategy/data contract: **PASS — 12 roles, 28 role+Playstyle profiles, 11 formation rules, 56 tactic rules, 143 strings**
- Package integrity: **PASS — 464 precached runtime files; 461 required runtime files**
- Static, cloud hydration/local-first, navigation/render and navigation/queue contracts: **PASS**
- Scanner v12 Live contract: **PASS — 11 assertions**
- Scanner image, compact-reference, patch/badge/level, pixel guard, native-source and all-native-resolution contracts: **PASS**

No opponent-dependent logic was introduced. Mixed live Medium/High drain weighting remains unresolved and unchanged.

---

# 22. Latest mandatory-backup checkpoint — internal SA token normalization boundary

This section supersedes section 21 only where model generations or validation counts differ. All role-gated affinity, de-duplication and 74→14 semantic calibration from section 21 remain active.

## 22.1 Cross-system defect found and fixed

The current-game player-facing identity is **Shadow Striker**. Current-client extraction also contains the internal enum/localisation token `LongShots` for that same entry.

The earlier pass correctly protected import compatibility but described the token too loosely as though “Long Shots” were itself a Special Ability. That wording is superseded.

Current rule:

- **Shadow Striker** is the only player-facing Special Ability identity.
- `LongShots` / historical `Long Shots` spellings may be silently normalized only when encountered as imported/internal legacy data.
- The internal token must never be shown in the ability picker, scanner result, profile, Tactics explanation, Training explanation or Team Plan as a separate ability.

The canonical import boundary remains in player cleaning/storage and Strategy identity extraction only to protect old/native data. Scanner reference identity remains **Shadow Striker**.

## 22.2 Stitched runtime regression

The stitched Team Plan regression now uses the real player-facing **Shadow Striker** identity. Internal-token normalization is tested separately at the data/storage boundary so the optimizer never treats `LongShots` as a user-owned ability name.

## 22.3 Boundaries deliberately NOT invented

No universal role→Special Ability eligibility matrix was added. The recovered current-client evidence treats Special Ability availability as player-specific and does not prove a universal role restriction table. Do not infer one.

The seven current abilities without open-play tactic-affinity rows remain dead-ball-specific or unresolved. Do not create open-play effects for them without evidence.

Opponent information remains permanently out of scope. Mixed live Medium↔High tactic-drain weighting remains unresolved and nonnumeric.

## 22.4 Current model generations

The behaviour boundary changed, so Team Plan model fingerprinting is intentionally advanced to invalidate stale cached recommendations:

- Strategy: `companion-strategy-v2-own-squad-runtime-v0515-calibration-5`
- Tactics: `30527-drain-fit-v5-calibrated-v0515-affinity-dedup-sa-canonical`
- Team Plan cache schema: v6

The exact post-de-dup Playstyle/SA semantic calibration remains **74 raw → 14 points**.

## 22.5 Verified regression gate for this packaged checkpoint

- Core deterministic suite: **PASS — 353 assertions**
- Tactics calibration: **PASS — 176 assertions**
- Live-drain profile: **PASS — 52 assertions**
- Formation calibration invariants: **PASS — 27 assertions**
- Formation assignment: **PASS — 4 assertions**
- Formation natural fallback: **PASS — 4 assertions**
- Formation fallback monotonicity: **PASS — 5 assertions**
- Formation Playstyle: **PASS — 3 assertions**
- Data completeness: **PASS — 10 assertions**
- Squad Blueprint: **PASS — 21 assertions**
- Team Plan completeness: **PASS — 5 assertions**
- Training calibration matrix: **PASS — 40 profiles**
- Team Training: **PASS — 14 assertions**
- Set Pieces: **PASS — 29 assertions**
- Mentors: **PASS — 14 assertions**
- Stitched pipeline: **PASS — 26 assertions**
- Stitched plan monotonicity: **PASS — 8 assertions**
- Roster-order invariance: **PASS — 4 assertions**
- Strategy/data contract: **PASS — 12 roles, 28 role+Playstyle profiles, 11 formation rules, 56 tactic rules, 143 strings**
- Package integrity: **PASS — 464 precached runtime files; 461 required runtime files**
- Static/cloud/navigation contracts: **PASS**
- Scanner v12 compact-reference contract and image/native-resolution/reference contracts: **PASS**

The broad regression command reached its execution-time ceiling only after stitched-plan monotonicity had passed; the remaining tests were then run in smaller batches and passed. This was an execution batching limit, not an application assertion failure.

## 22.6 Next calibration direction

Continue only with objective cross-system or player-pool defects that can be demonstrated by a controlled fixture. Do not frequency-balance tactic outputs, invent Special Ability role restrictions, add effects for unresolved abilities, or guess the live Medium↔High drain exchange rate.

Before every future work window ends: update this handoff, run the relevant regression gate, create the complete current-app ZIP, extract/verify that exact ZIP, and give it to the user.


---

# 23. Latest mandatory-backup checkpoint — LongShots display-identity correction

This section supersedes any earlier wording that calls **Long Shots** a player-facing Special Ability.

## 23.1 Correction

Public Top Eleven evidence and the recovered current Windows client are consistent on the important distinction:

- **Shadow Striker** is the actual player-facing Special Ability.
- `LongShots` exists in recovered client data as an internal enum/localisation token for the entry that displays as Shadow Striker.
- There is **no separate player-facing “Long Shots” Special Ability** in the current app model.

The application has been corrected so the current SA catalogue itself stores **Shadow Striker** directly at the corresponding slot. `LongShots` is retained only inside the internal import/provenance normalization layer.

## 23.2 Runtime/UI changes

- `js/bible-data.js` now lists `Shadow Striker` directly; it no longer lists `Long Shots` as a current ability.
- `js/data.js` distinguishes `SPECIAL_ABILITY_INTERNAL_ALIASES` from the player-facing catalogue.
- Scanner normalization delegates to the shared current identity boundary and carries no scanner-local “Long Shots ability” rule.
- The Tactics explanation no longer says “Long Shots ability”; it refers only to Shadow Striker.
- Tactics and stitched Team Plan regression fixtures now use `Shadow Striker` as the actual player ability identity.
- Historical/internal `LongShots` normalization remains covered at the storage/data boundary only.

No Tactics weights, Training weights, Formation logic, Mentor logic, Set Pieces, Playstyle affinity, 74→14 semantic calibration, opponent boundary, or mixed live drain assumptions were changed by this correction.

## 23.3 Next calibration boundary

Continue the controlled cross-system/player-pool audit. Mixed Medium↔High live tactic-drain weighting remains unresolved and must not be guessed.


## 23.4 Verified regression gate for this checkpoint

- Core deterministic suite: **PASS — 353 assertions**
- Tactics calibration: **PASS — 172 assertions**
- Live-drain profile: **PASS — 52 assertions**
- Formation calibration invariants: **PASS — 27 assertions**
- Formation assignment: **PASS — 4 assertions**
- Formation natural fallback: **PASS — 4 assertions**
- Formation fallback monotonicity: **PASS — 5 assertions**
- Formation Playstyle: **PASS — 3 assertions**
- Data completeness: **PASS — 10 assertions**
- Squad Blueprint: **PASS — 21 assertions**
- Team Plan completeness: **PASS — 5 assertions**
- Training calibration matrix: **PASS — 40 profiles**
- Team Training: **PASS — 14 assertions**
- Set Pieces: **PASS — 29 assertions**
- Mentors: **PASS — 14 assertions**
- Stitched pipeline: **PASS — 26 assertions**
- Stitched plan monotonicity: **PASS — 8 assertions**
- Roster-order invariance: **PASS — 4 assertions**
- Strategy/data contract: **PASS — 12 roles, 28 role+Playstyle profiles, 11 formation rules, 56 tactic rules, 143 strings**
- Package integrity: **PASS — 464 precached runtime files; 461 required runtime files**
- Static/cloud/navigation contracts: **PASS**
- Scanner v12 compact-reference, image, reference, level, badge, pixel-guard, native-source and all-native-resolution contracts: **PASS**

The Tactics assertion count is lower than pass4 because the two internal-token variants were deliberately removed from the **Tactics player-ability fixture**. Internal-token compatibility is now tested only at the data/storage boundary, while Tactics tests use the actual player-facing ability **Shadow Striker**. No scoring assertions were removed.

Recovery note: files matching `.pre_*` are historical source snapshots only. They are **not active runtime code** and may contain superseded terminology from earlier calibration passes; always audit the unsuffixed current files first.

---

# 24. Latest mandatory-backup checkpoint — all-in-one Playstyle semantic gate

This section supersedes section 23 only where model generations, validation counts, or the cross-system audit status differ. The Shadow Striker display-identity correction, 74→14 Playstyle/SA semantic calibration, Formation calibration, Training calibration, Set Pieces, Mentor containment rules, opponent-data prohibition and unresolved live-drain boundary remain active.

## 24.1 Real stitched-decision defect found and fixed

The primary Playstyle affinity scorer already required both:

1. the Playstyle is active; and
2. the player's **current assigned role** is eligible for that Playstyle.

Two secondary own-XI semantic features did not use that same boundary:

- `semanticRunner` could read Poacher / Inside Forward by name even when the Playstyle was Locked or role-ineligible;
- `dribbleReliance` could read False Nine / Enganche / Inside Forward by name even when the Playstyle was Locked or role-ineligible.

That meant a Playstyle which correctly earned zero Formation/affinity credit could still influence Tactics and, through `dribbleReliance`, Mentor relevance.

This was proven to alter a real recommendation. In a controlled neutral XI, a **Locked Poacher** incorrectly created a strong counter-runner signal and pushed the pre-fix Tactics result to **Long Passing + Force Counter Attack**. With the Playstyle removed, the same XI selected **Mixed Passing + Focus on Buildup**.

The fix centralises all secondary Playstyle semantics through `activeEligiblePlaystyleName(starter)`. A Playstyle can now contribute to these features only when it is active **and** the currently assigned role is one of that Playstyle's eligible roles. Legal Natural/Related assignment is unchanged; an ineligible Playstyle simply contributes zero semantic identity for that assignment.

The same boundary is now regression-protected through Mentor. Locked or wrong-role Enganche / False Nine / Inside Forward can no longer manufacture Shearer dribble-reliance relevance.

## 24.2 All-in-one runtime regression added

A permanent `tests/all_in_one_system_calibration.js` now calls the real `TeamPlan.buildOptimalPlan()` pipeline rather than manually composing modules.

It verifies across the complete chain:

`eligible squad -> Formation/XI -> Tactics -> Mentor -> Set Pieces -> final Team Plan`

that:

- a Locked Poacher cannot alter the final Team Plan decision;
- a genuinely unused weak reserve, even carrying an active Winger Playstyle and Shadow Striker SA, cannot alter the final plan;
- an unavailable elite player cannot leak into Match Ready XI or downstream decisions;
- an incomplete elite player cannot leak into the all-in-one plan.

This is in addition to the existing stitched-pipeline and monotonicity suites.

## 24.3 Cross-system player-pool / Playstyle shortcut audit status

The active scoring runtime was traced again after the fix.

- Tactics, Mentor, Set Pieces and player-development context consume the **chosen XI**, not unused reserves.
- Full-squad data remains intentionally used by Formation candidate selection and Squad Blueprint/coverage only.
- Current scoring paths no longer read a Playstyle identity outside the active+assigned-role eligibility boundary.
- Remaining raw Playstyle reads are development/profile selection paths; inactive Playstyles already fall back to role-only profiles and do not create tactic or Mentor scoring credit.
- Existing role-pool regressions continue to protect WideAttack, AerialTarget, Transition, PressingUnit, DefensiveUnit and defensive Positioning against unrelated-player leakage.

No further defensible player-pool scoring defect was found in this pass. The **remaining tactic role-pool / Playstyle leakage audit is therefore closed for the current model**, subject to reopening only if a future controlled fixture demonstrates a wrong decision.

## 24.4 Model generations

The semantic boundary changed, so model fingerprinting was advanced to invalidate stale cached Team Plans:

- Strategy: `companion-strategy-v2-own-squad-runtime-v0515-calibration-6`
- Tactics: `30527-drain-fit-v5-calibrated-v0515-affinity-dedup-sa-canonical-ps-gate`
- Team Plan cache schema: v6

Exact Playstyle/SA semantic calibration remains **74 raw → 14 points**.

## 24.5 Unresolved boundaries deliberately unchanged

- Mixed live Medium↔High tactic-drain weighting remains unresolved. Runtime still uses categorical intensity counts, proven pure-class anchors, a safe partial ordering, and a neutral drain score where a numeric exchange rate would otherwise be required.
- Exact Mentor per-level server magnitudes remain unresolved but contained by the existing unlock-family/relevance model.
- Exact current Set Piece specialist magnitude remains unresolved and contained by the near-tie-only Team Plan influence.
- Training age-rate server values remain unresolved; no age multiplier is invented.
- No opponent information is accepted or inferred.

## 24.6 Verified regression gate for this checkpoint

- Core deterministic suite: **PASS — 353 assertions**
- Tactics calibration: **PASS — 178 assertions**
- Live-drain profile: **PASS — 52 assertions**
- Formation calibration invariants: **PASS — 27 assertions**
- Formation assignment: **PASS — 4 assertions**
- Formation natural fallback: **PASS — 4 assertions**
- Formation fallback monotonicity: **PASS — 5 assertions**
- Formation Playstyle: **PASS — 3 assertions**
- Squad Blueprint: **PASS — 21 assertions**
- Data completeness: **PASS — 10 assertions**
- Team Plan completeness: **PASS — 5 assertions**
- Training calibration matrix: **PASS — 40 profiles**
- Team Training: **PASS — 14 assertions**
- Set Pieces: **PASS — 29 assertions**
- Mentors: **PASS — 18 assertions**
- Stitched pipeline: **PASS — 26 assertions**
- Stitched plan monotonicity: **PASS — 8 assertions**
- Roster-order invariance: **PASS — 4 assertions**
- Direct all-in-one `buildOptimalPlan()` calibration: **PASS — 5 assertions**
- Strategy/data contract: **PASS — 12 roles, 28 role+Playstyle profiles, 11 formation rules, 56 tactic rules, 143 strings**
- Package integrity before packaging: **PASS — 464 precached runtime files; 461 required runtime files**
- Static/cloud/navigation contracts: **PASS**
- Scanner v12, image, patch, reference, level/badge, compact-reference, pixel-guard, native-source and all-native-resolution contracts: **PASS**

A first scanner batch referenced historical test filenames that no longer exist; the actual current scanner contract filenames were then run and all passed. This was a command-name mismatch, not an application/test assertion failure.

## 24.7 Next calibration direction

Do not reopen already-proven systems merely to vary recommendation frequency. The all-in-one architecture, XI player-pool isolation and Playstyle activation boundary are now regression-locked.

Remaining evidence-limited items should stay explicitly unresolved unless new game/native/live evidence appears. The next work should be a **release-candidate/final-freeze audit** of versioning, cache/schema fingerprints, UI-displayed version, recovery docs and package state, unless the user supplies new live drain or other game evidence first.

Before every future work window ends, refresh this handoff and provide a newly extracted/verified complete backup ZIP.

---

# 25. FINAL v0.5.15 RELEASE-FREEZE CHECKPOINT — 16 September 2026

**This section supersedes every earlier “next task”, “do not freeze”, pre-release branch, or v0.5.14-current instruction in this handoff.** Earlier sections remain historical evidence for how the calibration was reached.

## 25.1 Release decision

The v0.5.15 whole-system calibration gates are satisfied and the build is now **RELEASE-FROZEN**.

All criteria from the historical freeze checklist are closed:

1. Long/Counter universal-bias investigation — **resolved**.
2. Tactic role-pool / Playstyle leakage audit — **closed for the current model**.
3. Mixed live drain — **explicitly unresolved with safe nonnumeric runtime behaviour**; no guessed Medium↔High exchange rate.
4. Calibration suites — **green**.
5. Scanner/cloud/navigation frozen systems — **green**.
6. Active docs/handoff — **synchronized to v0.5.15 release state**.
7. Final ZIP — must still be created/extracted/verified at the end of each work pass; this checkpoint records the source-tree freeze before the final package step.
8. Version/schema/cache state — **synchronized**.
9. Embedded handoff — **updated to this release checkpoint**.

The remaining server-owned unknowns are evidence boundaries, not blockers requiring invented values.

## 25.2 Release-identity audit defect found and fixed

The final-freeze audit found one release-state mismatch:

- canonical `data/build_30527/index/decision_logic_v2.json` still carried Strategy model metadata `...calibration-4`;
- active browser `js/strategy-data.js` carried `...calibration-6`.

A deep object comparison proved that the **only difference was the model-generation label**; no Formation, Tactics, Training, Mentor, Set Piece or Playstyle/SA rule/value differed.

The release now uses one synchronized Strategy fingerprint everywhere:

`companion-strategy-v2-own-squad-runtime-v0515`

The canonical JSON is now the source for the browser strategy bundle, and a new `tests/release_identity_contract.py` permanently checks deep equality plus release metadata/hashes.

## 25.3 Frozen public/runtime/cache identity

- Visible app version: **v0.5.15**
- `index.html` runtime marker: `0.5.15`
- `js/app.js` runtime marker: `0.5.15`
- Local runtime asset cache-buster: `r=0515`
- Service-worker cache: `te-v0-5-15`
- Local launcher build query: `0.5.15`
- Canonical decision contract: `v0.5.15`, release-frozen
- Strategy strings: `v0.5.15`
- Strategy model: `companion-strategy-v2-own-squad-runtime-v0515`
- Tactics model: `30527-drain-fit-v5-calibrated-v0515-affinity-dedup-sa-canonical-ps-gate`
- Team Plan persistence schema: **v6**

Changing the Strategy fingerprint at freeze intentionally invalidates cached calibration-generation Team Plans so the released app rebuilds them under the frozen model identity.

## 25.4 All-in-one system frozen state

The release chain remains:

`eligible squad -> Formation/XI -> Tactics -> Set Pieces/Captain -> Mentor -> final Team Plan -> Training context`

Frozen guarantees include:

- Playstyle match-plan contribution requires **active Playstyle + eligible current assigned role**;
- secondary counter-runner/dribble-reliance signals use the same eligibility boundary;
- current Playstyle/active-SA affinity data is live in Tactics without the four proven identity-only double counts;
- exact hard-legal Playstyle/SA semantic maximum remains **74 raw -> 14 points**;
- unused weak reserves, unavailable players and incomplete players cannot leak into the Match Ready plan;
- Shadow Striker is the sole player-facing SA identity; internal `LongShots` remains provenance/import compatibility only;
- Captain remains gameplay-neutral;
- opponent/scouting/relative-strength/live-match inputs remain permanently absent.

## 25.5 Unresolved boundaries deliberately retained

Do **not** guess these in v0.5.15 or later:

- mixed Medium↔High live tactic-drain exchange rate;
- exact Mentor per-level server magnitudes;
- exact current Set Piece specialist magnitude;
- Training age-rate server values.

The released runtime contains these uncertainties safely: unknown numeric live-drain arithmetic is not fabricated, external/live-only Mentor conditions score zero pre-match, Set Pieces remain near-tie-only, and Training does not invent an age multiplier.

## 25.6 Frozen source-tree validation

Release-freeze source tree passed:

- Core deterministic: **353 assertions**
- Tactics calibration: **178 assertions**
- Live drain: **52 assertions**
- Formation calibration: **27 assertions**
- Formation assignment: **4 assertions**
- Formation natural fallback: **4 assertions**
- Formation fallback monotonicity: **5 assertions**
- Formation Playstyle: **3 assertions**
- Squad Blueprint: **21 assertions**
- Data completeness: **10 assertions**
- Team Plan completeness: **5 assertions**
- Training: **40 profiles**
- Team Training: **14 assertions**
- Set Pieces: **29 assertions**
- Mentors: **18 assertions**
- Stitched pipeline: **26 assertions**
- Stitched monotonicity: **8 assertions**
- Roster-order invariance: **4 assertions**
- Direct all-in-one `buildOptimalPlan()`: **5 assertions**
- Strategy/data contract: **12 roles, 28 role+Playstyle profiles, 11 formation rules, 56 tactic rules, 143 strings**
- Release identity/synchronisation contract: **PASS**
- Package integrity: **464 precached runtime files; 461 required runtime files**
- Static/cloud/navigation contracts: **PASS**
- Scanner frozen contract matrix: **PASS**
- Active JavaScript syntax: **PASS**

## 25.7 Version discipline after this freeze

**Do not modify released v0.5.15 scoring in place.**

If a new controlled regression, new native/live evidence, UI feature or product fix requires a change, start **v0.5.16**. Preserve this handoff and the v0.5.15 release notes as the rollback/recovery baseline.

The mandatory end-of-pass disaster-recovery rule remains active: stop new work early enough to refresh the current handoff, run relevant regression gates, create the complete app ZIP, extract/verify that exact ZIP, and provide it to the user.



## Final v0.5.16 audit verification checkpoint

The post-deployment full-code audit is complete. The runtime hardening changes above are frozen and the calibrated v0.5.15 decision model is unchanged.

Verified source-tree gates include:

- Core deterministic suite: **353 assertions PASS**
- Tactics calibration: **178 assertions PASS**
- Live drain: **52 assertions PASS**
- Formation calibration: **27 assertions PASS** plus assignment/fallback/Playstyle contracts
- Squad Blueprint: **21 assertions PASS**
- Training matrix: **40 profiles PASS**
- Team Training: **14 assertions PASS**
- Set Pieces: **29 assertions PASS**
- Mentors: **18 assertions PASS**
- Stitched pipeline: **26 assertions PASS**
- Stitched monotonicity: **8 assertions PASS**
- Direct all-in-one planner: **5 assertions PASS**
- Strategy/data, release identity, runtime hardening, package integrity, cloud/navigation and scanner contracts: **PASS**
- Active JavaScript and executable JavaScript tests: **syntax PASS**

A command-batch timeout during the long regression matrix was an execution-window timeout only; the remaining tests were rerun separately and passed.

The package must still be extracted and re-tested from the exact final ZIP before handoff.
