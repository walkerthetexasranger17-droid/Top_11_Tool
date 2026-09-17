# Top Eleven Tool — v0.6.22 Recovery Handoff

## Fixed pass scope
Home + Squad mobile/tablet hero behaviour only. The user approved the current artwork and page designs and requested that the cinematic hero image stay visually anchored while the foreground page content scrolls over it. No new artwork is created in this pass.

## v0.6.22 changes
- Home and Squad keep their existing real responsive `<picture>` hero assets.
- On coarse-pointer phone/tablet layouts, the hero media is now a fixed visual layer beneath the sticky app header while the hero copy/cards remain normal scrolling foreground content.
- This intentionally does **not** use `background-attachment: fixed`; that mechanism is unreliable in Android/iOS PWA/WebView environments.
- Home keeps its accepted stat-card overlap and now preserves the player/stadium image position while the dashboard scrolls over it.
- Squad now mirrors the Home hand-off: the Squad body overlaps the lower hero by 28px on phone portrait so the top stats visually sit over the cinematic player artwork.
- Landscape/tablet variants use smaller anchored hero heights matching their existing responsive hero dimensions.
- Existing v0.6.21 Squad image-delivery hotfix remains: direct responsive picture element, no CSS-variable image dependency.
- Runtime/cache markers bumped to v0.6.22 so installed PWAs receive the new scroll behaviour.

## Current Squad contract retained
- No filter box.
- Role Order: `GK → DL → DC → DR → DMC → ML → MC → MR → AML → AMC → AMR → ST`.
- DML and DMR are not current game roles and stay excluded from Role Order.
- Compact rows retain new role artwork, nationality flag, glossy position badge, authoritative Playstyle/Special Ability images, OVR and chevron.

## Frozen boundaries
No scanner recognition/calibration, nationality ROI, OVR, Playstyle, Special Ability, training, formation, tactics, mentors, Team Plan, Best-in-Slot or strategy logic changed. Scanner remains VERSION=12; nationality remains an isolated optional visible-flag extension.

## Verification requirement
Verify both Home and Squad at phone portrait, phone landscape and tablet layouts, including a real scroll-position check showing hero media stays at the same viewport Y position while foreground content moves. Then run deterministic/static/scanner/update regressions, update recovery docs, create the full ZIP, extract it fresh, and re-run critical checks against that exact extracted package.

## Next step
Deploy v0.6.22 on the real phone. Check Home and Squad at the top and while scrolling. The expected effect is that the stadium/player artwork appears anchored behind the moving cards/roster rather than travelling away as part of a banner.
