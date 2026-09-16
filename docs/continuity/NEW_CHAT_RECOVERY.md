# New Chat Recovery Instructions

This file exists so a new chat can recover the project without asking the user to reconstruct the history.

## Instruction to the new chat

> Read `/START_HERE.md` first, then the final/latest section of `CALIBRATION_RECOVERY_HANDOFF_v0.5.15.md`, `docs/continuity/CURRENT_STATE.md`, `docs/releases/v0.5.15.md`, the canonical `data/build_30527/index/decision_logic_v2.json`, and `docs/research/build_30527/UNRESOLVED.md`.
>
> Current frozen release is **v0.5.15**. Do not restart calibration and do not silently change released v0.5.15 scoring. Any new product/scoring work starts **v0.5.16**.
>
> Permanent architecture rule: the decision runtime is own-squad-only. Never add opponent/scouting/relative-strength/live-state inputs to Formation, Tactics, Set Pieces, Mentor, Team Plan or Training.
>
> Mixed Medium/High live tactic-drain arithmetic, exact Mentor per-level server magnitudes, exact Set Piece specialist magnitude and Training age-rate server values remain unresolved. Do not guess them.
>
> Playstyle semantics are active+assigned-role eligible only. Shadow Striker is the sole player-facing SA identity; internal `LongShots` is provenance/import compatibility only.
>
> After reading, inspect the current source relevant to the user's next task and give a brief recovery status before modifying anything. Do not ask the user to recreate prior research.

If documentation disagrees with current unsuffixed runtime code, investigate immediately; `.pre_*` and archived files are historical only.
