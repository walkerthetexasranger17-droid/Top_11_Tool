# Top Eleven Tool — v0.6.21 Recovery Handoff

## Fixed pass scope
Squad-page fidelity hotfix only. The user deployed v0.6.20 and the Squad cinematic header artwork did not appear on-device even though local Chromium rendered it. This pass makes the Squad hero asset delivery explicit and cache-safe without altering the accepted Squad row, sort, scanner calibration or football logic.

## v0.6.21 changes
- Kept the approved Squad hero copy, actions, stats and compact roster design unchanged.
- Replaced the Squad hero's CSS custom-property background image dependency with a real responsive `<picture class="squad-hero-media">` element.
- Mobile portrait explicitly loads `assets/v060/scenes/squad-hero-mobile.webp`.
- All other layouts load `assets/v060/scenes/squad-hero-desktop.webp`.
- CSS pseudo-element now supplies only readability gradients over the real image element.
- Bumped runtime/CSS/manifest query markers and service-worker cache to v0.6.21 so installed/deployed PWAs cannot keep serving the previous hero wiring.
- Existing v0.6.20 Squad finishing behaviour remains: no filter box, Role Order sorting, full mobile/tablet app header, compact rich player rows.

## Approved Role Order
`GK → DL → DC → DR → DMC → ML → MC → MR → AML → AMC → AMR → ST`

DML and DMR are not current game positions and are excluded.

## Frozen boundaries
No scanner recognition/calibration, OVR, Playstyle, Special Ability, training, formation, tactics, mentors, Team Plan, Best-in-Slot or strategy logic changed. Scanner stays VERSION=12 and nationality remains an optional visible-flag extension.

## Stop condition
Complete only after focused v0.6.21 contract, release/static/core/scanner regressions, real Chromium device audit, handoff/START_HERE update, full ZIP creation, fresh extraction and re-verification of that exact ZIP.

## Next step
Deploy v0.6.21 on the real phone and confirm the Squad hero artwork is visible behind `YOUR PLAYERS. A STRONGER TOMORROW.`. If accepted, Squad is complete and development can move to the next page.
