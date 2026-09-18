# Top Eleven Tool — v0.6.23 Recovery Handoff

## Fixed pass scope
Home + Squad only. This pass installs the two user-approved portrait background images and establishes the final mobile background/spacing contract before the remaining pages are converted.

## Approved source artwork
- Home: `assets/v0623/backgrounds/home-mobile.png`
  - 941×1672 portrait
  - SHA-256 `f817904e80c2a02e56aca76804c7929d295d65f5ff787eb006c04df4e75081d8`
  - approved scene: kneeling footballer facing camera in a large floodlit stadium, subject intentionally high in frame.
- Squad: `assets/v0623/backgrounds/squad-mobile.png`
  - 941×1672 portrait
  - SHA-256 `630e3a10f583928435c033305b17b31ab8ad9b5995927384fee781aaed37b4f2`
  - approved scene: 11 players + 3 coaches team photograph in the same black/neon-green visual language.

Do not regenerate, restyle or replace either asset unless the user explicitly asks.

## v0.6.23 implementation
- Mobile/tablet Home and Squad now use the approved portrait images through their existing real `<picture>` media layers.
- The image layer stays viewport-anchored beneath the sticky app header while the normal page content scrolls over it.
- The background now fills the complete usable viewport (`100dvh - header`) rather than ending around the hero/card transition and exposing a harsh black lower half.
- Home and Squad share the same portrait hero stage height (390px at the 390×844 reference viewport) and the same -28px foreground overlap. Their first stat-card row therefore begins at the same vertical Y position.
- Landscape touch uses a shared 245px hero stage; portrait tablet uses a shared 315px stage.
- Existing page copy, Home dashboard structure, Squad actions, Squad filters removal, Role Order, nationality, Playstyle/SA assets and player rows remain otherwise intact.
- Requested Squad micro-tweak included: on phone portrait the large glossy position badge is no longer a standalone middle column. A reduced badge is placed directly after the player's `role · Age` line; Playstyle, SA, OVR and chevron use the reclaimed width.

## Mobile visual rule established for later pages
Each page background is a true portrait phone scene with its principal subject/action in the upper section so it also serves as the header focal point. The scene must continue cleanly through the lower screen because the UI scrolls over an anchored full-screen image; avoid random foreground clutter at the bottom.

## Frozen boundaries
No scanner calibration, nationality recognition, OVR, Playstyle, Special Ability recognition, training engine, formation, tactics, mentors, Team Plan, Best-in-Slot, strategy/decision data or cloud model behaviour changed. Scanner remains VERSION=12. Decision contract remains frozen at v0.5.17.

## Approved backgrounds created but not installed in this pass
Training, Team Plan, Drills, Scanner/Add Player, Settings and Manager/Account Profile have approved portrait artwork in the conversation workspace. Player Profile was intentionally excluded because the user plans a separate whole-page concept redesign.

## Next step
Deploy and inspect Home + Squad on the real phone with actual squad data. Once those two establish the correct spacing/background behaviour, apply the same full-screen background contract page-by-page to the remaining approved pages without changing their app logic.
