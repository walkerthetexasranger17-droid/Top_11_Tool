# v0.6.48 — START HERE

**CURRENT UI BRANCH:** v0.6.48 — full visual correction pass.  
**FROZEN DECISION BASELINE:** v0.5.17.  
**SCANNER:** VERSION=12.

Read `DESIGN_RECOVERY_HANDOFF_v0.6.48.md` first, then `V0648_UPDATE_TITLE_RESTORE_VALIDATION.md`.

## What changed
- Login now matches the approved direction: the tactics-board logo sits outside the compact glass shell, direct Email/Password sign-in is on the first screen, the primary Sign In action uses the established v0.6.45 green treatment, and Google uses the clean white button treatment.
- Update Player uses the approved physio background and the **original approved 1747×900 UPDATE PLAYER title asset**, untouched. Its visible size/position is CSS-only.
- Update mode is applied before the scanner route becomes visible, removing the one-frame Add Player artwork flash.
- The approved Team Plan changing-room background is now the active mobile/tablet page background.
- The first-paint background snap/stretch was traced to the old `.page` translate animation creating a containing block for `position:fixed` page backgrounds. All pages now use the existing opacity-only transition, and portrait page backgrounds share one fixed geometry contract.
- Page artwork prewarming now includes Scanner, Drills, Team Plan, Settings, Manager Profile, Login branding and legacy hero/profile background assets.
- Page artwork prewarming now covers the current visual surfaces; high-resolution page art remains runtime-cached so install precache stays bounded.

## Do not change
Do not alter scanner recognition/calibration, football/decision logic, training optimiser logic, Mastercard behaviour, Firebase/cloud data behaviour or the squad data model unless explicitly requested.

## Visual source of truth
- v0.6.42 translucent navy glass hierarchy.
- v0.6.45 Individual Training active-tab treatment for enabled green primary actions.
- v0.6.39 Training/Drills category tints and Mastercard gold treatment.
- Existing approved page-title position/size standard. Update Player matches the visible footprint through CSS only; the source asset must not be altered.

## Approved current imagery
- `assets/approved/backgrounds/update-player.png`
- `assets/approved/headers/update-player.png` — original approved 1747×900 PNG; immutable unless the user explicitly requests replacement.
- `assets/approved/backgrounds/login.png`
- `assets/approved/branding/login-logo.png`
- `assets/v0624/reference-backgrounds/team-plan-approved.png`

## Still pending
Player Profile remains the main dedicated-image/redesign area. Splash/loading can use the approved Login visual language in a separate focused pass if requested.
