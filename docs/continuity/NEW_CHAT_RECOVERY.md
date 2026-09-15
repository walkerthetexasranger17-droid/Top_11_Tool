# New Chat Recovery Instructions

This file exists so a new chat can recover the project without asking the user to reconstruct the history.

## Instruction to the new chat

> Read `/START_HERE.md` first. Then read:
> - `docs/continuity/CURRENT_STATE.md`
> - `docs/research/build_30527/V0514_FINAL_PRECALIBRATION_CHECKPOINT.md`
> - `docs/research/build_30527/V0513_COMPLETE_TEAM_PLAN_STITCHING_CHECKPOINT.md`
> - `docs/research/build_30527/V0512_OWN_SQUAD_EVALUATOR_CHECKPOINT.md`
> - `docs/research/build_30527/V0511_DECISION_LOGIC_BIBLE.md`
> - `data/build_30527/index/decision_logic_v2.json`
> - `data/build_30527/index/strategy_strings_v2.json`
> - `docs/research/build_30527/INDEX.md`
> - `docs/research/build_30527/UNRESOLVED.md`
>
> Permanent architecture rule: the decision runtime is own-squad-only. Never add opponent/scouting/relative-strength/live-state inputs back into Formation, Tactics, Set Pieces, Mentor, Team Plan or Training.
>
> v0.5.14 is the final pre-calibration logic checkpoint. It preserves the stitched Formation -> Tactics -> Set Pieces/Captain -> Mentor -> Training pipeline, locks the recovered 1/2/3/4/5 drill-intensity base-XP ladder into Training, and treats Captain as gameplay-neutral with zero Team Plan ranking value. Role+Playstyle Training remains a relative target-shape model designed to create specialists rather than equalise every white skill.
>
> After reading, inspect the source relevant to the stated next task and send the user a brief recovery status before modifying anything. Do not ask the user to repeat old research.

If documentation disagrees with current code, **current code + newer dated evidence wins**, and continuity/index documents must be corrected immediately.
