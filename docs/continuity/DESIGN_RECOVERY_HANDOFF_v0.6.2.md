# Top Eleven Tool — v0.6.2 Design Recovery Handoff

**Status:** UNPUBLISHED DESIGN PASS 2  
**UI/runtime version:** v0.6.2  
**Decision/calibration contract:** v0.5.17 frozen  
**Scoring/model fingerprint:** companion-strategy-v2-own-squad-runtime-v0515 — unchanged

## Approved visual direction

The user has locked the dark navy / neon-lime / cyan football-intelligence design language. Do not reopen broad visual-direction exploration unless explicitly asked.

Core traits:
- cinematic football imagery on high-value hero surfaces;
- dense, professional data views for working screens;
- desktop persistent left navigation;
- tablet responsive reflow;
- mobile bottom navigation and touch-first cards;
- Barlow Condensed display typography + DM Sans body typography;
- lime primary actions, cyan secondary information, dark glass/data cards.

## v0.6.2 implementation scope

This pass implements the approved Squad-management direction in the real app.

1. Squad hero rebuilt around the approved `YOUR PLAYERS. A STRONGER TOMORROW.` visual structure.
2. Production Squad hero assets created from the existing packaged football scene:
   - `assets/v060/scenes/squad-hero-desktop.webp`
   - `assets/v060/scenes/squad-hero-mobile.webp`
3. Approved Squad mockup preserved as `docs/design/reference/v060/approved-squad-desktop-v2.webp`.
4. Added real-data Squad summary cards:
   - total players;
   - average OVR;
   - highest OVR/player;
   - simple position coverage summary;
   - players needing complete Skills data.
5. Added functional Squad filters:
   - search across name/roles/playstyle/Special Abilities;
   - position group;
   - Playstyle;
   - Special Ability;
   - OVR min/max;
   - only players needing attention.
6. Added functional sorting and List/Card view switching.
7. Desktop roster is now a dense professional table-like layout with player, position, age, OVR, Playstyle, Special Abilities, and status.
8. Mobile keeps swipe-to-delete and collapses the same rows into touch-friendly cards.
9. Existing player open/delete/update behavior remains wired to the pre-existing app logic.

## Critical non-changes

Do not interpret v0.6.2 as a football-logic recalibration. Formation, Tactics, Training, Set Pieces, Mentor, scanner-recognition and decision-model files are not intentionally changed by this design pass.

The frozen v0.5.17 decision contract and v0.5.15 model fingerprint must remain intact.

## Next design pass

Recommended next target: Player Profile or Add/Update Scanner, depending on user preference. Use the approved v0.6 visual system and create production assets during the pass rather than postponing artwork.

## Mandatory pass-end workflow

Every future design/development pass must reserve time to:
1. update this recovery handoff/current-state docs;
2. run relevant regressions;
3. create a full application ZIP;
4. extract/verify the ZIP;
5. provide the verified backup ZIP to the user.
