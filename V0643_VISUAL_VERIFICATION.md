# v0.6.43 Visual Verification

## Purpose
Follow-up visual QA after the v0.6.42 deep surface audit. The goal was to inspect rendered interactive states and catch aesthetic defects that layout/overflow tests cannot detect.

## Finding and fix
A legacy phone-portrait rule still supplied a 91%-opaque `background-color` beneath Home dashboard panels and the Squad roster panel. The v0.6.42 glass gradient therefore looked much more solid on those two pages. v0.6.43 explicitly clears that old longhand paint at the required specificity while retaining the shared glass gradient.

## Manual visual-state coverage
Populated Home and Squad; Squad sort popup and swipe-open delete state; Player Profile; Add Player and Update Players; Individual Training and generated-result state; Team Training; Master Cards and normal drill categories; populated Team Plan Lineup, Set Pieces and Tactics; Settings top/middle/lower; Manager Profile/security top/middle/lower; scanner review surface.

## Frozen logic
No football, Team Plan decision, training optimiser, Mastercard inventory, scanner calibration or cloud-data logic changes.
