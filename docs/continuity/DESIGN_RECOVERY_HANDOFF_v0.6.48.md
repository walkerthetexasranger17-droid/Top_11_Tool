# Top Eleven Tool — v0.6.48 Recovery Handoff

## Critical v0.6.48 correction
- The user-approved `UPDATE PLAYER` title asset is **immutable**: `assets/approved/headers/update-player.png`.
- It must remain the exact original 1747×900 PNG, SHA-256 `d824d0380d46f257faffb99901d826e82b919268ab8f1617fc9d75f17d58902c`.
- v0.6.47 incorrectly resized/recompressed that asset. v0.6.48 restores the original byte-for-byte.
- **Never crop, resize, resample, recompress or regenerate this title asset unless the user explicitly asks to replace it.**
- Match the established Add Player visible header footprint through CSS only (`#page-add-player.update-mode .branded-page-title.page-header-art-wrap`).
- All v0.6.47 login, glass, background first-paint, Team Plan changing-room background and other visual fixes remain in place.
- Football/decision logic remains frozen at v0.5.17; scanner remains VERSION=12.


## Current baseline
- **UI/runtime:** v0.6.48.
- **Football/decision baseline:** frozen at v0.5.17.
- **Scanner:** VERSION=12; recognition/calibration unchanged.
- **Surface standard:** v0.6.42 glass hierarchy.
- **Green action standard:** v0.6.45 Individual Training active-tab treatment.
- **Training/Drills category system:** v0.6.39 remains authoritative.

## Why v0.6.48 exists
The v0.6.46 visual integration had three visible problems on the user's real Android build:
1. Login placed the logo inside an oversized glass panel instead of using the compact external-logo composition that had been approved in the earlier mock.
2. Update Player's title artwork looked much larger than every other page and retained a faint dark/alpha matte.
3. Home and Squad no longer snapped on first paint, but other pages still briefly rendered their backgrounds at the wrong position/fit before snapping into place.

The user asked for one full pass, not piecemeal fixes. v0.6.48 addresses all three and also restores the already-approved Team Plan changing-room background.

## Root cause of the background snap — confirmed
The global base rule was:
- `.page{display:none;animation:pageIn .22s ease}`
- `pageIn` included `transform:translateY(5px)`.

A transformed ancestor becomes the containing block for `position:fixed` descendants. On first activation, fixed portrait page backgrounds on Drills, Settings, Manager Profile and Add/Update Player were therefore measured relative to the newly transformed page instead of the viewport. Browser instrumentation reproduced this exactly: affected backgrounds first appeared around `top:137px`, then settled to the correct `top:66px` after the animation. Home/Squad had already been fixed earlier because they used `v631PageFade`, an opacity-only animation.

### v0.6.48 fix
- `.page.active` now globally uses the opacity-only `v631PageFade` transition.
- All portrait page-media wrappers share the stable fixed geometry contract below the top bar.
- Artwork prewarming was expanded to all current background/header assets.
- Update Player's `.update-mode` class is applied before route activation, eliminating the one-frame Add Player visual state.

Real-Chromium regression now measures immediate and settled background rectangles for Home, Squad, Training, Drills, Settings, Manager Profile, Add/Update and Team Plan; geometry must not move.

## Login — final requested composition
Approved assets remain:
- `assets/approved/backgrounds/login.png`
- `assets/approved/branding/login-logo.png`

The Login screen now uses:
- logo **outside** the glass shell;
- compact centred v0.6.42 glass shell rather than a panel filling most of the background;
- direct Email + Password inputs on the first sign-in screen;
- themed `Sign In` primary action using the current v0.6.45 green action treatment;
- clean white Google button with the existing Google `G` asset;
- Forgot password + Create account links in the compact layout;
- existing Firebase sign-in/reset/signup/MFA functions and element IDs, so auth behaviour is preserved.

Do not add marketing slogans, fake interface decoration or artwork into the Login background.

## Update Player — final requested composition
Approved background remains byte-identical:
- `assets/approved/backgrounds/update-player.png`

Header asset was explicitly corrected at the user's request:
- `assets/approved/headers/update-player.png`
- visual content retained;
- low-alpha dark matte removed;
- transparent corners verified;
- original source file remains 1747×900 and is displayed at the established visible header size using CSS only.

Update Player therefore inherits the exact standard page-header wrapper size/position instead of requiring a one-off oversized CSS rule.

Scanner behaviour is unchanged. Update mode remains the same name-match / age+skills update workflow.

## Team Plan
The user had already approved the players-in-the-changing-room background and explicitly said it was not a missing image. v0.6.48 now uses:
- `assets/v0624/reference-backgrounds/team-plan-approved.png`

On touch/mobile/tablet it becomes the fixed page background beneath the existing translucent Team Plan cards/tabs. The old tactical-pitch hero image no longer paints over it on that layout.

## Glass standard applied
The current visual hierarchy remains:
- major panels: `linear-gradient(145deg,var(--v642-panel-top),var(--v642-panel-bottom))` + cyan keyline;
- nested rows/tiles: `var(--v642-nested)`;
- controls: `var(--v642-control)`;
- enabled green actions: v0.6.45 active-tab treatment;
- Training/Drills category colours and Mastercard gold frame unchanged.

No page in this pass should introduce an opaque navy tile when the equivalent existing surface is translucent glass.

## Frozen contracts
No changes to:
- v0.5.17 football / Team Plan decision logic;
- Scanner VERSION=12 extraction/calibration;
- training optimiser calculations;
- drill availability or Mastercard inventory/consumption;
- squad/player data model;
- cloud hydration/outbox semantics.

## Current approved assets
1. `assets/approved/backgrounds/update-player.png`
2. `assets/approved/headers/update-player.png` — original approved 1747×900 runtime asset; immutable, CSS-sized only
3. `assets/approved/backgrounds/login.png`
4. `assets/approved/branding/login-logo.png`
5. `assets/v0624/reference-backgrounds/team-plan-approved.png`

Do not regenerate these unless the user explicitly requests replacement.

## Remaining visual work
- Player Profile dedicated imagery / final redesign remains pending.
- Splash/loading can reuse the Login visual language if requested later.

## Recovery rule
Continue from v0.6.48. Preserve the five current visual assets above, the no-snap page-transition contract, v0.6.42 glass hierarchy, v0.6.45 green actions, frozen v0.5.17 decision baseline and Scanner VERSION=12.
