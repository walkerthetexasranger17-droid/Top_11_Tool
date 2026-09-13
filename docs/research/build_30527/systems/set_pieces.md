# Set Pieces — Build 30527

## Game facts

Current client state explicitly stores:
- Captain
- Left Corner Kicker
- Right Corner Kicker
- Left Free Kicker
- Right Free Kicker
- Penalty Kicker
- ordered penalty takers

Current Special Ability enum includes:
- Penalty Kick Specialist
- Free Kick Specialist
- Corner Specialist
- Set Piece Taker

The inspected current path proves assignment/display/save behaviour, not an official automatic ranking formula.

## Companion logic

v0.5.1 introduced provenance-aware assignments:
- `auto`
- `manual`
- migrated `legacy`

Automatic non-Captain slots recalculate; manual choices survive. Captain remains manual.

## Unresolved

No authoritative Captain-selection formula has been recovered. Do not use age/OVR/leadership-like guesses unless explicitly labelled as optional companion logic.
