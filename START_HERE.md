# v0.5.15 CALIBRATION HANDOFF SNAPSHOT

**IMPORTANT:** This folder is the current pre-release calibration working state built on the frozen v0.5.14 runtime baseline. It is packaged as **v0.5.15 calibration handoff** so another chat can resume the exact work. It is **not yet a release-frozen v0.5.15**.

**Read first:** `CALIBRATION_RECOVERY_HANDOFF_v0.5.15.md`

That handoff is the authoritative recovery map for all calibration changes, live drain findings, unresolved boundaries, regression status, and the precise next task. Preserve the whole folder when passing the project to another chat.

---

# START HERE — Top Eleven Tool

**Current working app: v0.5.15 CALIBRATION HANDOFF (release baseline v0.5.14)**  
**Game reference: Top Eleven build 30527 / Windows package 27.3.0.0**

This is the single recovery entry point for a new chat/session.

## Read in this order before changing code

1. `CALIBRATION_RECOVERY_HANDOFF_v0.5.15.md`
2. `docs/continuity/CURRENT_STATE.md`
3. `docs/research/build_30527/V0515_AFFINITY_RUNTIME_CALIBRATION_CHECKPOINT.md`
4. `docs/research/build_30527/V0514_FINAL_PRECALIBRATION_CHECKPOINT.md`
3. `docs/research/build_30527/V0513_COMPLETE_TEAM_PLAN_STITCHING_CHECKPOINT.md`
4. `docs/research/build_30527/V0512_OWN_SQUAD_EVALUATOR_CHECKPOINT.md`
5. `docs/research/build_30527/V0511_DECISION_LOGIC_BIBLE.md`
6. `data/build_30527/index/decision_logic_v2.json`
7. `data/build_30527/index/strategy_strings_v2.json`
8. `docs/research/build_30527/INDEX.md`
9. `docs/research/build_30527/UNRESOLVED.md`
10. the relevant `docs/research/build_30527/systems/*.md` page
11. inspect the current source and verify the docs still match it

Older v0.5.x checkpoints remain evidence/history. Do **not** restart old reverse-engineering work unless the current index says evidence is missing or superseded. Do **not** invent Top Eleven formulas or values.

## Required first response in a recovered/new chat

After reading those files, tell the user briefly:

- current app version;
- what is stable/frozen;
- what was most recently completed;
- current development target;
- next 2-4 actions;
- any genuinely required external file that is not already embedded.

Do not ask the user to reconstruct the project history.

## One-line checkpoint

v0.5.14 remains the **frozen release baseline**; the current v0.5.15 handoff is an active calibration working tree. The latest completed pass confirmed the declared Playstyle/SA tactic affinities are genuine runtime logic, enforced assigned-role eligibility, removed pure identity-only double counting against existing explicit tactic rules, and proved the exact post-de-dup semantic range is 74 raw -> 14 points. Winger/Wing Back focus affinity remains side-aware and named Playstyle levels remain normalized at the shared runtime boundary. It preserves the complete own-squad Team Plan stitching from v0.5.13, locks the recovered 1/2/3/4/5 regular-drill base-XP intensity ladder into Training selection, and treats Captain as gameplay-neutral with zero Team Plan score. Highest OVR is only the automatic convenience default; any starter may be selected manually. Role+Playstyle target-shape logic still deliberately tilts signature white skills above lower-value whites. Scanner v0.4.18 remains frozen.

## Permanent architecture rules

- Never add opponent/scouting/relative-strength/live-match input to the pre-match optimiser. Unknown external context contributes zero.
- Exact build-30527 tactic drain remains authoritative; plan-effectiveness weights are transparent companion logic.
- Set Pieces may break close ties but may not rescue a materially worse Formation/Tactics plan.
- Captain is gameplay-neutral in the optimiser. Auto-fill highest OVR for convenience only; never invent age, Bravery, leadership/personality or hidden captain coefficients, and never give Captain Team Plan score.
- Training optimises **player shape**, not flat white-skill equality. S/A/B/C define desired relative levels, not absolute Nordeus caps.
- If a Team Plan fields a player only in a related (non-natural) role, Training safely falls back to a natural development role and records/explains that fallback.

## Important runtime rule

Historical Mentor capture levels/effect arrays are research evidence only. They must never seed the user's current Mentor ownership/level state or be reused as the magnitude for another selected level.

## Parked UI / interaction work

Player Profile redesign remains parked. Also parked: intermittent multi-click behaviour on Mentor lock/unlock and player delete; and official Mentor portrait replacement until deterministic asset identity mapping is proven.
