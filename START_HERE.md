# v0.6.46 — START HERE

**CURRENT UI BRANCH:** v0.6.46 — Update Player + Login visual integration.  
**FROZEN DECISION BASELINE:** v0.5.17.  
**SCANNER:** VERSION=12.

Read `DESIGN_RECOVERY_HANDOFF_v0.6.46.md` first, then `V0646_UPDATE_LOGIN_VALIDATION.md`.

## What changed
Four approved assets are now integrated without changing application logic:
- dedicated Update Player portrait background;
- dedicated `UPDATE PLAYER` header art;
- dedicated Login stadium background;
- transparent clipboard/tactics-board Login logo.

Update Player continues to use the existing scanner/update pipeline and simply swaps the page artwork when update mode is active. Login keeps the existing Google and Email/Password authentication behaviour but now uses the same translucent glass language as the signed-in app.

## Do not change
Do not alter scanner recognition/calibration, football/decision logic, training optimiser logic, Mastercard behaviour, Firebase/cloud behaviour or the squad data model unless explicitly requested.

Do not regenerate the four approved v0.6.46 assets. Do not add slogans, advertisement-style copy, decorative lines, fake UI or embedded page text to the approved background images.

## Visual source of truth
- v0.6.42 glass/surface hierarchy.
- v0.6.45 Individual Training active-tab treatment for enabled green primary actions.
- v0.6.39 Training/Drills category tints and Mastercard gold treatment.

## Still pending
Player Profile remains the main dedicated-image/redesign area. The Team Plan changing-room background already exists and is approved; do not regenerate it. Splash/loading can be finalised separately using the approved Login visual language.
