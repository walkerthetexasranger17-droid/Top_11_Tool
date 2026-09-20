# New Chat Recovery Instructions

## CURRENT instruction — v0.6.52 / decision v0.5.18

> Read `/START_HERE.md`, `DESIGN_RECOVERY_HANDOFF_v0.6.52.md`, `CALIBRATION_RECOVERY_HANDOFF_v0.5.18.md`, `docs/continuity/CURRENT_STATE.md`, and `data/build_30527/index/decision_logic_v2.json` first.
>
> Current UI/runtime is **v0.6.52**. Current football decision contract is **v0.5.18**. The only scoring-policy change from v0.5.17 is Drain Limit intent: Low/Medium/High now select their matching historical drain class. Tactic selector changes preserve the already-selected XI.
>
> The locked v0.6.49 Team Plan pitch/shirt/nameplate assets must not be regenerated, cropped, resampled or recompressed without explicit user approval. Scanner remains VERSION 12. Opponent information remains permanently out of scope. Mixed Medium/High live drain arithmetic remains unresolved and must not be guessed.
>
> Every pass ends with updated embedded handoff, regressions, deploy/recovery ZIPs, fresh extraction and byte verification.

---


## CURRENT instruction to the new chat — v0.5.17-dev-pass11

> Read `/START_HERE.md`, then the **top/current section** of `CALIBRATION_RECOVERY_HANDOFF_v0.5.17.md`, then `docs/continuity/CURRENT_STATE.md`, then `V0517_DEV_PASS11_VALIDATION.md`.
>
> The current working package is **UNPUBLISHED v0.5.17 DEV PASS11**, based on stable v0.5.17. Do not publish it or start a visual redesign unless the user asks. The v0.5.15 calibrated Match Ready model remains unchanged.
>
> Pass11 is a cleanup/stability/performance pass: package historical baggage removed; service-worker install precache reduced; navigation/page rendering serialized; swipe/tap and toast interception hardened; heavy Training/Team Plan actions de-duplicated; Team Plan redundant calculation removed/yielded; Training beam search compacted with output-equivalence protection.
>
> Pass10 automatic update behaviour remains locked: name auto-match, age + 15 skills persisted, OVR derived from those skills, identity preserved, write/read-back verified. Best-in-Slot remains stat-free. Opponent information remains permanently out of scope. Mixed Medium/High live drain arithmetic remains unresolved rather than guessed.
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
