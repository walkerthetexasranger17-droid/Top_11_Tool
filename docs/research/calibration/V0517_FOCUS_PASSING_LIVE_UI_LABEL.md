# v0.5.17 Focus Passing live UI label checkpoint

**Date:** 16 September 2026  
**Evidence:** LIVE FACT — current Top Eleven tactics UI screenshot supplied by the user.

## Observed Focus Passing choices

The current live UI presents exactly:

- Left Flank
- Right Flank
- Both Flanks
- Through the Middle
- Balanced

The shipped/current-client static identity remains `FocusPassingCenter`, and the companion optimiser has historically used the key `center`. This is an internal/client identity, not the player-facing wording.

## Runtime rule

Preserve:

`FocusPassingCenter` / companion key `center`

Display:

**Through the Middle**

Do not expose **Center** as a selectable Focus Passing option. Do not rename the internal key unless future native evidence proves the enum itself changed, because tactic/drain rules already key against the recovered client identity.

No scoring, affinity, drain or recommendation logic changed in this checkpoint.
