# v0.6.45 — START HERE

**CURRENT UI BRANCH:** v0.6.45 — Green-button parity.  
**FROZEN DECISION BASELINE:** v0.5.17.  
**SCANNER:** VERSION=12.

Read `DESIGN_RECOVERY_HANDOFF_v0.6.45.md` first, then `V0645_GREEN_BUTTON_PARITY_VALIDATION.md`.

## What changed
The approved **Individual Training** active tab is now the literal visual source of truth for every enabled green primary action. The same background gradient, lime border, bottom lime keyline/glow and light text are reused globally rather than approximated with a separate lime-button design.

This applies to Add Player, Build Session, Mark Session Completed, Save Profile, account/security actions, scanner actions, Settings Save Key, Team Plan build actions, player edit/train actions, auth primary actions and the other `.btn.primary` controls. Active Team Plan segmented tabs are also prevented from drifting away from the same green treatment.

Disabled primary actions remain deliberately subdued so disabled controls cannot be mistaken for active ones.

## Do not change
Do not alter the approved Home/Squad glass hierarchy, Training/Drills category colours, gold Mastercard treatment, scanner VERSION=12, v0.5.17 football/decision logic, Mastercard consumption, Firebase/cloud behaviour or squad data model unless explicitly requested.

Remaining image-dependent redesign areas: **Team Plan, Update Player, Login/Splash and Player Profile.**
