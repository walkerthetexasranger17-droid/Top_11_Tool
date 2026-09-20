# v0.6.34 Add Player + Global Header Validation

## Scope
Presentation-only pass.

### Global header art
- One smaller branded-header footprint across Home, Squad, Training, Drills, Team Plan, Settings, Manager Profile and Add Player.
- Phone portrait target: 205px wide, 8px from left, 4px from top.
- Global top-bar branding unchanged.

### Add Player
- Approved Add Player portrait background packaged at `assets/v0634/backgrounds/add-player.webp`.
- Add Player hero is transparent over the background on touch/mobile.
- Manual entry moved directly below the Skills Screenshot scanner into `#scannerManualCard`.
- Manual card is hidden in Update Player mode.
- Scanner engine/calibration remains VERSION=12.

## Required regressions
- static checks
- release/runtime identity
- cloud hydration/navigation
- scanner regression suite
- mobile browser layout for Add Player + header geometry
- full core regression suite

## Validation results
- PASS static checks: 220 ids / 9 pages.
- PASS release/runtime identity for v0.6.34.
- PASS cloud hydration/navigation contract.
- PASS core regression: 355 assertions.
- PASS Scanner v12 compact-reference regression.
- PASS automatic player update contract: 31 assertions.
- PASS navigation/render regression.
- PASS package integrity: 117 precache files.
- PASS package cleanliness after removing generated browser-audit scratch artifacts.
- PASS Chromium viewport audit: 45 page/view combinations, 0 horizontal-overflow cases, 0 console errors.
- PASS dedicated v0.6.34 mobile browser contract: consistent compact page headers, approved Add Player portrait background, manual entry below scanner.
