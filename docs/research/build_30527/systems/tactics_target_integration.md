# Target Formation -> Tactics Integration — Build 30527

## Principle

Formation does not directly choose a fixed tactic. The target formation is selected for **structural and tactical versatility**; the actual tactic remains an XI/context recommendation constrained by the exact condition-drain formula.

## Why the DMC+MC target is tactic-flexible

`GK DL DC DC DR / DMC MC / AML AMC AMR / ST` gives:

- two occupied left-flank levels (DL + AML);
- two occupied right-flank levels (DR + AMR);
- a continuous central spine (DC/DMC/MC/AMC/ST);
- four advanced attacking roles (AML/AMC/AMR/ST);
- a dedicated DMC plus MC rather than two identical pivots.

This means current shipped tactic semantics can legitimately consider all Focus Passing directions without the formation itself leaving a side empty.

## Evidence-backed tactic relationships retained

GAME ASSET FACT:

- Short passing -> more combination plays.
- Long passing -> more long-ball plays.
- Shooting tendency -> distance shots vs working closer before shooting.
- Focus Passing -> organise play through selected area.
- Cross Tendency -> frequency of crosses.
- Counter Press -> attempt immediate recovery at defensive risk.
- Regroup -> reorganise for the next attack.
- Force Counter Attack -> risky surprise attacks.
- Buildup -> safer, more predictable possession progression.
- Offensive Mentality -> more attacking opportunities but more counter exposure.
- Man-to-Man -> defensive boost against faster attacks.
- Zonal -> better against longer-distance attacks.
- Pressing levels counter different actions and consume different condition.
- Offside Trap -> try to catch attackers offside.
- Track Opponent -> shadow progression toward goal.
- Harder Tackling -> stops more plays at increased foul/booking risk.

Exact condition-drain remains the native 11-dimension formula documented in `tactics.md`.

## Companion recommendation rule

Do **not** hard-code one tactic because the target formation is 4-1-1-3-1. Instead:

1. user chooses Approach and Drain Limit;
2. selected XI/player profiles determine which tactic semantics they support;
3. exact drain rejects plans above the user limit;
4. tactic semantics and later role/Playstyle priorities break genuine fit choices;
5. Mentor is selected only after formation+tactics are known.

The target formation therefore acts as a flexible platform rather than a preset tactical script.

## Formation-side structural signals available to the tactic engine

These may be used transparently as COMPANION LOGIC:

- left/right/centre role occupancy;
- target-role white/key attribute membership;
- player values for those verified key attributes;
- Playstyle eligibility and level;
- Special Ability semantics where proven;
- exact drain cost/class.

Do not introduce hidden aggression/style coefficients or claim recovered private effectiveness percentages.

## Shipped Assistant Feedback cross-check

A second current-game semantic source has now been indexed: 227 `assistant_feedback_*` localization entries. The selected feedback itself is server-delivered in `MatchPeriod`, so its hidden trigger thresholds are not client-recoverable, but the relationships stated by the game are useful evidence.

Key relationships relevant to the companion recommender:

- Short passing is repeatedly linked to possession and midfield control.
- Long balls are repeatedly paired with counter-attacks in defensive/chasing situations.
- Fast players are explicitly cited as a reason counter-attacks can work.
- Focus Passing should change according to which area is succeeding; the game praises and rejects both centre/flank focus in different contexts.
- Midfield numerical disadvantage is explicitly linked to losing possession.
- Too few advanced passing targets is explicitly identified as a problem.
- A deeper player is explicitly suggested as protection against counter-attacks.
- High pressing is linked to winning the ball earlier, with an explicit fatigue cost and situations where it is unnecessary.
- Attacking style + Offside Trap is explicitly suggested, while several messages warn that a poorly executed high line can be beaten.
- Zonal marking is suggested when coverage is overwhelmed/unmarked players appear; current tooltips separately distinguish Man-to-Man vs fast attacks and Zonal vs long-distance attacks.
- Tackling intensity must remain card/foul-context dependent.

See `tactics_semantic_archetypes.md`, `../source_archive/TACTICS_ASSISTANT_FEEDBACK_EXTRACT.txt`, and `data/build_30527/index/tactics_assistant_feedback.json`.

## Native/server boundary for Assistant Feedback

`Nordeus.Communication.MatchPeriod` carries `HomeMatchFeedback` / `AwayMatchFeedback`. `Nordeus.Communication.MatchFeedback` carries `Minute`, `StringId`, and `AssistantId`. Therefore the client receives the server-selected feedback message; the exact trigger evaluator/thresholds are not recovered locally.

This reinforces the implementation boundary: use Assistant Feedback wording as **GAME FACT semantics**, never as a source of invented numerical weights.
