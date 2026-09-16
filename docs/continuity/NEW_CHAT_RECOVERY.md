# New Chat Recovery Instructions

## CURRENT instruction to the new chat — v0.5.17-dev-pass7

> Read `/START_HERE.md`, then the **top/current section** of `CALIBRATION_RECOVERY_HANDOFF_v0.5.17.md`, then `docs/continuity/CURRENT_STATE.md`, then `V0517_DEV_PASS7_VALIDATION.md`.
>
> The current working package is **UNPUBLISHED v0.5.17 DEV PASS7**, based on stable v0.5.17. Do not publish it or bump the visible runtime just to continue testing. The v0.5.15 calibrated Match Ready model remains unchanged.
>
> Existing-player scan updates are **age + skills only** and the bulk update queue is present. Full Edit Player remains the complete manual editor. Master Cards are above normal drills. Set Pieces are automatic-only with Current XI Coverage and assigned-role visuals.
>
> Special Ability pickers are natural-role filtered using the current 19-row contract. Best-in-Slot is a separate stat-free long-term 4-2-3-1 goal layer; current-squad coverage is one-player-per-slot and now distinguishes trainable gaps, identity/SA-capacity gaps and recruit gaps.
>
> Individual Training has three explicit modes: **Max Growth**, **Balanced Development**, and **Condition Efficient**. Max Growth remains the original objective (Luiu still produces six Fast Counter-Attacks); Balanced is separate and prioritises broader weak-white coverage/variety.
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
