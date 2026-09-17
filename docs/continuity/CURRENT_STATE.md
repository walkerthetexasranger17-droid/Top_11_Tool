# CURRENT DESIGN OVERLAY — v0.6.22 Home + Squad Anchored Hero Scroll

- Mobile/tablet remains the product priority; desktop only needs to stay functional.
- Home and Squad use the existing approved cinematic artwork.
- v0.6.22 anchors the Home and Squad hero media beneath the sticky app header on coarse-pointer phone/tablet layouts while foreground page content scrolls over it.
- Home retains its overlapping top-stat treatment.
- Squad now mirrors that depth treatment with the page body overlapping the lower hero.
- The implementation deliberately avoids `background-attachment: fixed` for mobile-PWA reliability.
- Squad filter panel is removed.
- Role Order is `GK → DL → DC → DR → DMC → ML → MC → MR → AML → AMC → AMR → ST`; DML/DMR remain excluded.
- Nationality flag support remains wired through player storage/scanner as optional visible-flag metadata.
- Frozen v0.5.17 decision logic and scanner VERSION=12 remain unchanged.
