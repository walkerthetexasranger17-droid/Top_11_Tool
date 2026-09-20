# v0.6.22 Home + Squad Anchored Hero Scroll Validation

PASS

## Fixed scope completed
- Home and Squad keep the existing approved responsive hero artwork; no new visual assets were generated.
- On coarse-pointer phone/tablet layouts, each real hero `<picture>` is now a viewport-anchored visual layer beneath the sticky app header.
- Hero copy and all page cards/roster remain normal scrolling foreground content.
- Home preserves its existing overlapping stat-card hand-off.
- Squad now overlaps its page body over the lower hero by 28px on phone portrait, matching the Home depth treatment.
- Implementation explicitly avoids `background-attachment: fixed` for mobile PWA/WebView reliability.
- Phone landscape and tablet layouts use anchored hero heights matching their existing responsive dimensions.
- Runtime asset/query/service-worker markers bumped to v0.6.22.

## Real scroll verification
PASS `tests/v0622_fixed_hero_browser_scroll.py` at 390x844 touch viewport:
- Home hero media viewport Y remained unchanged while foreground scrolled 260px.
- Squad hero media viewport Y remained unchanged while foreground scrolled 260px.
- Foreground cards visibly move across the anchored stadium/player artwork.

## Regression verification
PASS:
- `node --check js/app.js`.
- `python tests/v0622_fixed_hero_scroll_contract.py`.
- inherited v0.6.21 Squad hero direct-picture contract.
- inherited v0.6.20 Squad finishing contract.
- inherited v0.6.19 compact Squad + nationality contract.
- release identity contract.
- static checks: 228 IDs / 9 pages.
- cloud hydration/navigation contract.
- navigation/render and queue contracts.
- runtime hardening contract.
- button binding contract: 88 buttons wired.
- package integrity: 114 core precache files.
- package cleanliness PASS.
- core deterministic suite: 355 assertions.
- scanner v12 failover/live contract: 11 assertions.
- scanner v12 compact-reference regression contract PASS.
- automatic update matcher: 11 assertions.
- player update persistence: 20 assertions.
- Real Chromium viewport audit: 45 page/device combinations; 0 horizontal-overflow cases; 0 console errors.

## Frozen logic comparison
Compared `js/` against v0.6.21:
- 19 football/scanner/training/decision JS files are byte-identical.
- only `app.js` and `cloud.js` differ for the v0.6.22 runtime diagnostic/version marker.
- Scanner remains VERSION=12; nationality extension, training, formation, tactics, mentors, Team Plan, Best-in-Slot, strategy data and decision engines are unchanged.

## Visual QA
- Top-of-page 390x844 Home render preserves the accepted Home composition and overlapping stat cards.
- Top-of-page 390x844 Squad render preserves the approved Squad hero and compact roster panel.
- Scroll-position renders show cards/roster moving over the anchored player/stadium artwork on both pages.

## Stop condition
Complete after full ZIP creation, clean extraction and re-verification of that exact ZIP.
