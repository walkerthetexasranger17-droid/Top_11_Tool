# v0.6.19 Squad Compact + Nationality Validation

## Fixed scope completed
- Compact mobile Squad row only.
- Current high-quality role artwork retained.
- Approved glossy position badges retained.
- Existing game-extracted Playstyle and Special Ability artwork rendered as images only on compact mobile rows; no labels/stars.
- Optional nationality persistence + flag rendering added.
- Scanner nationality metadata extension added without changing scanner calibration `VERSION=12`.

## Visual result
A seeded real-Chromium 390×844 render was checked. The roster row is now a single compact horizontal strip containing rank, role art, name, flag + roles/age, glossy position badge, Playstyle icon, up to two SA icons, OVR and chevron. There is no horizontal overflow and no Playstyle/SA label text on the mobile row.

## Nationality scanner evidence
- The coordinate-locked nationality ROI is `x=680, y=385, w=135, h=105` on the existing 2688×1216 scanner map.
- The ROI was manually checked against the real David Andrews scanner fixture and visibly isolates the Wales flag.
- Core and update schemas accept optional `nationalityCode`.
- Gemini prompt explicitly requires visible-flag evidence only and forbids inferring nationality from the player name.
- Missing/uncertain nationality is non-blocking.
- Existing saved nationality is preserved by automatic updates; a missing nationality can be filled from a new scan.

## Regression result
PASS:
- JS syntax: `app.js`, `players.js`, `scanner-engine.js`.
- release identity contract.
- static checks: 237 IDs / 9 pages.
- v0.6.19 compact Squad + nationality contract.
- scanner v12 compact-reference contract.
- scanner image contract.
- scanner v12 Live/failover contract: 11 assertions.
- automatic player-update contract: 31 assertions.
- player update persistence: 20 assertions.
- automatic update name matcher: 11 assertions.
- navigation/render contract.
- navigation/queue contract.
- runtime hardening contract.
- button binding contract: 90 buttons.
- cloud hydration/navigation contract.
- Special Ability role eligibility: 65 assertions.
- core suite: 355 assertions.
- package integrity: 114 core precache files / 5,808,206 bytes; scanner references runtime-cached.
- pre-package cleanliness: no scratch/pre-edit/archive baggage after old hero backup files were removed.
- real Chromium viewport audit: 45 page/device combinations, 0 horizontal-overflow cases, 0 console errors.

## Frozen logic comparison
19 frozen strategy/training/formation/tactics/Mentor/Team Plan/Best-in-Slot/decision-data files were byte-compared against v0.6.18 and are unchanged. Scanner changes are limited to the explicitly requested nationality metadata path; scanner numeric, Playstyle and Special Ability calibration version remains v12.

## Release stop condition
Met after full ZIP creation, fresh extraction, and critical re-validation of that exact extracted package.
