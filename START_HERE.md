# v0.5.17 UNPUBLISHED DEV PASS7 RECOVERY SNAPSHOT

**CURRENT WORKING BRANCH:** v0.5.17-dev-pass7 — **DO NOT PUBLISH YET**.  
**Stable release base:** v0.5.17.  
**Match Ready decision model:** v0.5.15 calibration unchanged.

Read `CALIBRATION_RECOVERY_HANDOFF_v0.5.17.md` first. Its top section is the authoritative current development checkpoint.

Pass1–6 recovery history remains. DEV PASS7 is a fine-tuning/smoke-hardening pass: explicit Balanced Development training mode without changing Max Growth, correct saved-mode restore, actionable Best-in-Slot trainable-vs-identity gap states, assigned-role Set Piece visuals, update-mode hint cleanup and refreshed continuity files.

Primary changed files: `js/training-engine.js`, `js/best-in-slot-engine.js`, `js/app.js`, `index.html`, `css/app.css`, and the pass7 regression/continuity documents.

Public/runtime version strings intentionally remain **0.5.17** because this is still unpublished development work.

---

# v0.5.17 RELEASE-FROZEN RECOVERY SNAPSHOT

**IMPORTANT:** This folder is the complete release-frozen **Top Eleven Tool v0.5.17** source and recovery package.

**Read first:** `CALIBRATION_RECOVERY_HANDOFF_v0.5.17.md`

That handoff is the authoritative historical calibration record and ends with the final v0.5.15 release-freeze checkpoint. Preserve the whole folder when passing the project to another chat.

---

# START HERE — Top Eleven Tool

**Current release: v0.5.17**  
**Game reference: Top Eleven build 30527 / Windows package 27.3.0.0**  
**Decision runtime: own-squad-only**

## Read in this order before changing code

1. `CALIBRATION_RECOVERY_HANDOFF_v0.5.17.md` — read the latest/final section first after the header.
2. `docs/continuity/CURRENT_STATE.md`
3. `docs/releases/v0.5.17.md`
4. `data/build_30527/index/decision_logic_v2.json`
5. `data/build_30527/index/decision_logic_v2_manifest.json`
6. `data/build_30527/index/strategy_strings_v2.json`
7. `docs/research/build_30527/INDEX.md`
8. `docs/research/build_30527/UNRESOLVED.md`
9. relevant subsystem research only if the next task requires it.

Older v0.5.x checkpoints and `.pre_*` files are history/recovery evidence, not active runtime code. Do not restore an older rule because it appears in a historical file.

## Current frozen state

v0.5.17 preserves the complete v0.5.15-calibrated own-squad planning chain unchanged:

`eligible squad → Formation/XI → Tactics → Set Pieces/Captain → Mentor → final Team Plan → Training context`

Key locks:

- no opponent/scouting/relative-strength/live-match inputs;
- Playstyles influence match planning only when active **and** eligible for the player's current assigned role;
- the current Playstyle/active-SA semantic component is de-duplicated and calibrated at **74 raw → 14 points**;
- unused weak reserves, unavailable players and incomplete players are regression-proven not to leak into the Match Ready plan;
- Shadow Striker is the sole player-facing SA identity; internal `LongShots` is provenance/import compatibility only;
- internal Focus Passing key `center` is player-facing **Through the Middle**; never expose `Center` as a selectable game option;
- Captain is gameplay-neutral and contributes zero Team Plan score;
- Training remains specialist-shape based and uses the verified 1/2/3/4/5 base-XP intensity ladder.

## Explicit unresolved boundaries

These are **not release defects** because runtime handles them conservatively rather than inventing values:

- mixed Medium/High live tactic-drain exchange rate;
- exact Mentor per-level server magnitudes;
- exact current Set Piece specialist magnitude;
- Training age-rate server values.

Do not fill these gaps without new native/live evidence.

## Version discipline

v0.5.17 is frozen. The v0.5.15 calibrated decision model is unchanged; v0.5.17 adds only the proven live UI mapping `center` → **Through the Middle** on top of the v0.5.16 hardening. Any subsequent product or scoring change starts **v0.5.18**.

## Mandatory backup workflow

Every future development/calibration pass must stop early enough to update the embedded handoff/current-state files, run the relevant regression gate, create a full-app ZIP, extract that exact ZIP, verify it, and give the verified ZIP to the user.
