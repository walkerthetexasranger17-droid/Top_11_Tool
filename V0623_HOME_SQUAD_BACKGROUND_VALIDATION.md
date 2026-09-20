# v0.6.23 Home + Squad Background Validation

## Scope
Home + Squad UI only: install the approved portrait backgrounds, make them fill the usable phone viewport while remaining anchored, align the Home/Squad first stat-row Y position, and reduce the mobile Squad position badge into the role/age line.

## Asset identity
- Home approved portrait: 941×1672, SHA-256 `f817904e80c2a02e56aca76804c7929d295d65f5ff787eb006c04df4e75081d8`.
- Squad approved portrait: 941×1672, SHA-256 `630e3a10f583928435c033305b17b31ab8ad9b5995927384fee781aaed37b4f2`.

## Browser reference
At the 390×844 touch viewport:
- sticky topbar: 66px;
- Home hero stage: 390px;
- Squad hero stage: 390px;
- Home first stat row top: 428px;
- Squad first stat row top: 428px;
- Home fixed image layer: y=66..844;
- Squad fixed image layer: y=66..844.

The background media must remain at a constant viewport Y while the foreground scrolls.

## Frozen boundaries
No decision/calibration/scanner/training/team-plan engine files are intentionally changed other than the normal runtime version string in `js/app.js` / `js/cloud.js`.

## Completed validation (2026-09-18)
- v0.6.23 approved background static contract: PASS.
- v0.6.23 real-Chromium anchored-background/spacing contract: PASS.
- Historical v0.6.21/v0.6.22 hero contracts: PASS.
- v0.6.19 compact Squad + nationality contract: PASS.
- v0.6.20 Squad finishing contract: PASS.
- Static integrity: PASS (228 IDs / 9 pages).
- Cloud hydration/navigation: PASS.
- Release identity: PASS.
- Scanner v12 regression contract: PASS.
- Automatic player update contract: PASS (31 assertions).
- Package integrity: PASS (114 install-precache files / 5,815,417 bytes). The two approved full-resolution v0.6.23 backgrounds are packaged and runtime-cached on demand rather than install-precached.
- Deterministic/core suite: PASS (355 assertions).
- Full offline Chromium viewport audit: PASS (5 device profiles x 9 pages = 45 combinations), 0 horizontal-overflow cases, 0 console errors.
