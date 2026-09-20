# v0.6.24 Mobile Hero + Branding Validation

## Scope
Home + Squad phone visual cleanup and approved tactics-board logo integration only.

## Reference layout
At 390×844 coarse-pointer portrait:
- sticky topbar: 66px;
- Home hero spacer: 250px;
- Squad hero spacer: 250px;
- first Home stat row top: 302px;
- first Squad stat row top: 302px;
- fixed background media: y=66..844;
- Home hero copy: none;
- Squad hero copy: `SQUAD MANAGEMENT` only, plus existing actions.

## Branding
- Master logo: `assets/v0624/branding/top-eleven-tool-logo.png`.
- Logo master SHA-256: `1c48ed011a46583d039445cca5554045a8640d56fabe69d063be2f7e0407b23a`.
- `icon-192.png`: `f80534ad3b914346078a7e6efbc1256ab393169fa765b1d1097b194b7653a529`.
- `icon-512.png`: `0273b9dc61628ad22f1c803d75cddede3c7133de46cf57257e9990cb0ba696bb`.

## Required visual contract
- no hero-wide dark haze/scrim on Home or Squad;
- no hero divider/seam line;
- approved v0.6.23 background images unchanged;
- Home has no title/slogan;
- Squad has functional title only;
- no motivational hero copy survives.

## Completed validation (2026-09-18)
- v0.6.24 mobile hero/branding static contract: PASS.
- v0.6.24 real-Chromium phone browser contract: PASS.
- Home/Squad first stat rows align at y=302px on 390×844 touch viewport.
- Background layers remain fixed at y=66 while foreground scrolls.
- Home hero copy absent; Squad title is functional only.
- Static integrity: PASS (228 IDs / 9 pages).
- Release identity: PASS.
- Cloud hydration/navigation: PASS.
- Scanner v12 compact-reference contract: PASS.
- Automatic update matcher: PASS (11 assertions).
- Frozen strategy baseline calibration: PASS.
- Package integrity: PASS (114 core precache files / 5,889,347 bytes).
- Package cleanliness: PASS (985 files / 54,831,017 bytes).
