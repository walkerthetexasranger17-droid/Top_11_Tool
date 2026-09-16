# New Chat Recovery Instructions

## CURRENT instruction to the new chat — v0.5.17-dev-pass8

> Read `/START_HERE.md`, then the **top/current section** of `CALIBRATION_RECOVERY_HANDOFF_v0.5.17.md`, then `docs/continuity/CURRENT_STATE.md`, then `V0517_DEV_PASS8_VALIDATION.md`.
>
> The current working package is **UNPUBLISHED v0.5.17 DEV PASS8**, based on stable v0.5.17. Do not publish it or bump the visible runtime just to continue testing. The v0.5.15 calibrated Match Ready model remains unchanged.
>
> Existing-player bulk updates are now **fully automatic**: screenshot name is read only to match one saved squad player; age + skills are scanned and saved automatically; successful rows remove themselves and the queue continues. There is no manual target dropdown. Saved name, OVR, roles, Playstyle and SAs are never overwritten. Ambiguous/unmatched names or dirty verification stop safely rather than guessing.
>
> Full Edit Player remains the complete manual editor. Master Cards are above normal drills. Set Pieces are automatic-only with Current XI Coverage. Best-in-Slot remains the separate stat-free long-term squad goal with current-squad gap analysis. Training has Max Growth / Balanced Development / Condition Efficient.
>
> Opponent information remains permanently out of scope. Mixed Medium/High live drain arithmetic remains unresolved rather than guessed.
>
> Every dev pass must end with refreshed embedded handoff + regressions + full ZIP + fresh extraction/byte verification.

If historical documentation below says v0.5.17 is frozen and future work must be v0.5.18, treat that as the release rule superseded by the user's explicitly requested unpublished v0.5.17 development/testing line.

---

# Historical recovery instructions follow

# New Chat Recovery Instructions

This file exists so a new chat can recover the project without asking the user to reconstruct the history.

## Instruction to the new chat

> Read `/START_HERE.md` first, then the final/latest section of `CALIBRATION_RECOVERY_HANDOFF_v0.5.17.md`, `docs/continuity/CURRENT_STATE.md`, `docs/releases/v0.5.17.md`, the canonical `data/build_30527/index/decision_logic_v2.json`, and `docs/research/build_30527/UNRESOLVED.md`.
>
> Current frozen release is **v0.5.17**. It preserves the v0.5.15 calibrated decision model unchanged, includes the v0.5.16 runtime hardening, and fixes the live Focus Passing display label to **Through the Middle** while preserving internal key `center`. Do not restart calibration or silently change scoring. Any new product/scoring work starts **v0.5.18**.
>
> Permanent architecture rule: the decision runtime is own-squad-only. Never add opponent/scouting/relative-strength/live-state inputs to Formation, Tactics, Set Pieces, Mentor, Team Plan or Training.
>
> Mixed Medium/High live tactic-drain arithmetic, exact Mentor per-level server magnitudes, exact Set Piece specialist magnitude and Training age-rate server values remain unresolved. Do not guess them.
>
> Playstyle semantics are active+assigned-role eligible only. Shadow Striker is the sole player-facing SA identity; internal `LongShots` is provenance/import compatibility only.
>
> After reading, inspect the current source relevant to the user's next task and give a brief recovery status before modifying anything. Do not ask the user to recreate prior research.

If documentation disagrees with current unsuffixed runtime code, investigate immediately; `.pre_*` and archived files are historical only.
