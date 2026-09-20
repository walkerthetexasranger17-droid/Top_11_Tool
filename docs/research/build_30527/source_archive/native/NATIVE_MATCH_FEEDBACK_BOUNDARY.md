# Native Match Feedback Boundary — Build 30527

## Result

The client does **not** contain the authoritative evaluator that decides which Assistant Feedback line should appear.

### Protocol evidence

`Nordeus.Communication.MatchPeriod` contains:
- `HomeMatchFeedback`
- `AwayMatchFeedback`

`Nordeus.Communication.MatchFeedback` contains exactly the gameplay-facing selection fields:
- `Minute`
- `StringId`
- `AssistantId`

The localization resource then resolves `StringId` values such as `assistant_feedback_183` into human-readable advice.

This architecture means the live period already arrives with the selected feedback message. We can use the shipped text as **GAME ASSET FACT semantic evidence**, but exact server conditions/thresholds that selected that message are **SERVER RUNTIME / UNRESOLVED**.

## Consequence for companion logic

Do not reverse-engineer a fake numeric rule from wording such as "fast players could break past the opponent's defence". The safe use is:

1. preserve the game-authored relationship (Speed/fast players can support Counter Attack);
2. use it as an explainable companion tie-break or semantic signal;
3. never claim the hidden trigger threshold or match-engine multiplier.

## Relevant metadata

- `Nordeus.Communication.MatchFeedback` — type index 19119.
- Fields: `_parser`, `_unknownFields`, `_hasBits0`, `MinuteFieldNumber`, `minute_`, `StringIdFieldNumber`, `stringId_`, `AssistantIdFieldNumber`, `assistantId_`.
- `Nordeus.Communication.MatchPeriod` exposes `HomeMatchFeedback` and `AwayMatchFeedback` accessors/fields.
