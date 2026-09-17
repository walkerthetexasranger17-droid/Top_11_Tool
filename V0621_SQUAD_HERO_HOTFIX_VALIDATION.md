# v0.6.21 Squad Hero Reliability Hotfix Validation

PASS

## Fixed scope completed
- Kept the accepted v0.6.20 Squad layout, stats, Role Order and compact roster rows unchanged.
- Replaced the Squad hero CSS custom-property image dependency with a direct responsive `<picture>` element.
- Mobile portrait loads the packaged `squad-hero-mobile.webp`; other layouts load `squad-hero-desktop.webp`.
- Squad readability gradients now overlay the real image element instead of carrying the image themselves.
- Bumped runtime asset query markers and service-worker cache to v0.6.21 so deployed/installed PWAs refresh the hero wiring.
- Updated the offline Chromium QA harness to embed `<source srcset>` assets so responsive picture elements are genuinely tested rather than falsely appearing blank.

## Regression verification
PASS:
- `node --check js/app.js`.
- `python tests/v0621_squad_hero_hotfix_contract.py`.
- inherited v0.6.20 Squad finishing contract.
- inherited v0.6.19 compact Squad + nationality contract.
- release identity contract.
- static checks: 228 IDs / 9 pages.
- cloud hydration/navigation contract.
- navigation/render and queue contracts.
- runtime hardening contract.
- button binding contract: 88 buttons wired.
- package integrity: 114 core precache files / 5,806,763 bytes.
- package cleanliness: 964 files / 49,000,072 bytes.
- core deterministic suite: 355 assertions.
- scanner v12 failover/live contract: 11 assertions.
- scanner v12 compact-reference regression contract PASS.
- automatic update matcher: 11 assertions.
- player update persistence: 20 assertions.
- Real Chromium viewport audit: 45 page/device combinations; 0 horizontal-overflow cases; 0 console errors.
- Visual check of the audited 390x844 Squad viewport confirms the cinematic Squad artwork is visible behind the hero copy.

## Frozen logic comparison
Compared `js/` against v0.6.20. Only `app.js` and `cloud.js` differ, and their functional change is the v0.6.21 runtime diagnostic marker. Scanner VERSION=12, training, formation, tactics, mentors, Team Plan, Best-in-Slot, strategy data and decision engines remain byte-identical.

## Stop condition
Pending only final ZIP creation, clean extraction and re-verification of that exact ZIP.
