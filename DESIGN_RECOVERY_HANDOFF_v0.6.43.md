# Top Eleven Tool — v0.6.43 Recovery Handoff

## Current baseline
- v0.6.43 is the current UI/runtime baseline.
- This is the visual-verification follow-up to the v0.6.42 deep surface-system audit.
- Decision/football logic remains frozen at v0.5.17.
- Scanner remains VERSION=12.
- v0.6.39 Training/Drills category tint + gold Mastercard contracts remain preserved.
- v0.6.40 manager-avatar centring/high-resolution Google photo handling remains preserved.

## Why v0.6.43 exists
After v0.6.42 passed structural and responsive automation, a separate manual visual-state audit was run across populated Home/Squad/Player, Add Player, Update Players, Individual Training, Team Training, Drills, populated Team Plan tabs, Settings and Manager Profile, including open Squad sort and swipe-delete states.

That audit found one real hidden-paint defect: an older phone-portrait rule set `background-color: rgba(3,18,29,.91) !important` on Home dashboard panels and the Squad roster panel. The v0.6.42 translucent gradients were present, but this 91%-opaque colour remained underneath them because the old selector had higher specificity. This made Home and Squad look noticeably more solid than the rest of the app.

## v0.6.43 correction
- Phone portrait Home dashboard panels now explicitly clear the legacy longhand background colour.
- Phone portrait Squad roster panel now explicitly clears the same legacy longhand background colour.
- The v0.6.42 glass gradients are now the sole surface paint on those containers.
- Squad swipe-delete rail still remains hidden until active swipe/open state.
- Lime primary actions remain full lime edge-to-edge with cyan/blue framing.
- No Training/Drills category surfaces, Mastercard surfaces, semantic warning/danger states or fixed app chrome were flattened.

## Visual verification coverage
The review inspected real rendered mobile states, not only selectors: populated Home, populated Squad, sort popup, swipe-open delete rail, Player Profile, Add Player, Update Players, Individual Training, generated-results state, Team Training, Master/normal Drills sections, Team Plan Lineup/Set Pieces/Tactics, Settings and Manager Profile/security sections. Scanner review surface styling was also explicitly probed.

## Remaining redesign work
Still image-dependent / deliberately not final: Team Plan imagery, Update Player dedicated background/header, Login/Splash, and Player Profile dedicated imagery/redesign.

## Release rule
Do not regress the Home/Squad phone portrait panels back to an opaque longhand background. `tests/v0643_visual_verification.py` specifically protects this case.
