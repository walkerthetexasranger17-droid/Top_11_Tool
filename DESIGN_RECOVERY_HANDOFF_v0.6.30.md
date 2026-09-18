# Top Eleven Tool — v0.6.30 Recovery Handoff

## Current state
- v0.6.30 is the current baseline.
- Home and Squad are approved by the user. Do not redesign them unless explicitly asked.
- Home uses the stacked TOP / ELEVEN / TOOL header at the upper-left.
- The global top bar uses the separate wide TOP ELEVEN TOOL wordmark.
- Squad uses the approved SQUAD MANAGEMENT header art and compact player roster.
- The five redundant Squad summary boxes remain removed.
- The current header-art pack is `assets/v0629/headers/` and must remain transparent.

## Cleanup completed in v0.6.30
This pass exists to reverse package-size growth without altering app behaviour.

Removed from the recovery/source tree:
- superseded `assets/v0615/`;
- obsolete v0.6.28 header copy at `assets/v0628/`;
- large duplicate PNG render sources in `assets/v0616/home/` where WebP runtime equivalents exist;
- duplicate Home/Squad files in `assets/v0624/reference-backgrounds/` (the exact canonical copies remain at `assets/v0623/backgrounds/`);
- obsolete old desktop design-reference screenshots.

Preserved deliberately:
- scanner reference packs and manifests;
- scanner test fixtures in the recovery package;
- current research/data and calibration documentation;
- the six future approved portrait background sources not duplicated elsewhere;
- current logo/header art;
- v0.5.17 calibration handoff and frozen logic.

## Distribution workflow
Two packages are produced from this baseline:
1. **Deploy package** — for GitHub Pages / live phone testing. Omits tests, historical validation files, recovery-only reference artwork and research documentation that the browser does not need.
2. **Recovery package** — for future development/new chats. Contains tests, research, recovery docs and approved future-page source art.

Do not use the deploy ZIP as the sole disaster-recovery source.

## Next stage
After the user approves this cleanup, continue the remaining pages one at a time using the already-approved portrait backgrounds and approved page-header artwork.

## Size result
The previous v0.6.29 ZIP was ~70.8 MiB. v0.6.30 produces a ~28 MB deploy ZIP and a ~45 MB full recovery ZIP while preserving current runtime behaviour and scanner calibration.
