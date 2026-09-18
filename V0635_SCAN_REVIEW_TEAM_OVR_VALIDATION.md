# v0.6.35 Scan Review + Team OVR Validation

## Scope
Focused scanner-review presentation, Home metric correction, and global branded-title normalization.

### Global branded page titles
- Home is preserved as the visual reference.
- Squad, Add Player, Training, Drills, Team Plan, Manager Profile and Settings are recomposed to the same 835px visible alpha width on the standard 1774x887 transparent canvas.
- All page-title wrappers share the same compact top-left mobile placement.
- Global top-bar wordmark is unchanged.

### Scanner review
- Related Roles removed from Add Player review.
- Role / Playstyle / Playstyle Tier selectors retain the app-owned dropdown system but no longer show a separate boxed chevron.
- Primary role uses lime emphasis; Playstyle Tier uses cyan emphasis.
- Scanner engine/calibration remains VERSION=12.

### Home Team OVR
- Dashboard label changed from Avg OVR to Team OVR.
- Calculation uses exactly the 11 saved Team Plan starters and their current stored OVR values.
- Bench/reserve players are excluded.
- Incomplete/missing saved XI returns `—`.

## Required regressions
- v0.6.35 dedicated scanner-review + selected-XI Team OVR browser contract.
- static checks.
- release/runtime identity.
- cloud hydration/navigation.
- scanner regression suite.
- player update contract.
- full core regression suite.
- full responsive Chromium viewport audit.
- package cleanliness/integrity.

## Validation results
- PASS dedicated v0.6.35 scanner-review + selected-XI Team OVR + normalized-header contract.
- PASS static checks: 219 ids / 9 pages.
- PASS release/runtime identity for v0.6.35.
- PASS cloud hydration/navigation contract.
- PASS core regression: 355 assertions.
- PASS Scanner v12 compact-reference regression.
- PASS automatic player update contract: 31 assertions.
- PASS navigation/render regression.
- PASS package integrity: 117 core precache files / 6,395,112 bytes; scanner references runtime-cached.
- PASS package cleanliness after removing browser-preview scratch artifacts.
- PASS Chromium viewport audit: 45 page/view combinations, 0 horizontal-overflow cases, 0 console errors.
- PASS inherited v0.6.34 Add Player mobile layout contract after the v0.6.35 changes.
