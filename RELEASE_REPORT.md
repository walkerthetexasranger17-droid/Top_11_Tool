# Top Eleven Tool v5.2.8 — Build 30527 Release Report

## Status

A provenance audit was completed against the recovered reverse-engineering evidence chain. The packaged Bible contains the v1.1 verified correction to the build-30527 Tackling protocol IDs and remains the implementation contract for this build.

## Final provenance-audit corrections

- Corrected Tackling protocol IDs/order to direct-build evidence: Balanced=0, Stay On Feet=1, Aggressive=2; retained the already-correct drain intensities by label.
- Corrected numeric `ConditionDrainIntensity` override plumbing (0/1/2 -> 0/5/7 contributions).
- Removed undocumented aggregate playstyle-level sum from whole-XI formation tie-breaking; playstyle level remains only in the documented per-slot candidate tie.
- Changed “Auto best shape” to “Auto best of 5 templates” to avoid implying the five companion templates exhaust all possible shapes.
- Removed the contradictory legacy training instructions from `data/build_30527/IMPLEMENTATION_CONTRACT.md`; that historical path now explicitly defers to the canonical Bible.
- Added a static regression guard so the superseded `target=max`, greedy six-slot selector and grey-skill dilution wording cannot silently return.
- The remaining changes are narrow provenance corrections; unresolved private/server-owned logic remains deliberately unresolved.

## Automated verification

- Core/deterministic: PASS — 245 assertions.
- Scanner v2: PASS — 12 real screenshots / 204 numerical fields; panel detection exact within 2 px.
- Static application integrity: PASS — 124 DOM IDs, 9 pages, 114 direct DOM references, 31 static paths.
- Service-worker/package integrity: PASS — 69/69 required runtime files precached.
- JavaScript/service-worker syntax: PASS (`node --check`).
- Final ZIP integrity: recorded after packaging with `unzip -t`.

## Browser smoke

**ENVIRONMENT BLOCKED — NOT APPLICATION FAILURE.** Headless Chromium failed to start/terminate correctly in the build environment. No application assertion failure was produced. Manual device/browser smoke testing is recommended after packaging.

## Contract boundary

The app deliberately does not fabricate unresolved private Nordeus logic: exact final server-side training gains, hidden match-engine weights, exact playstyle/mentor magnitude, universal role→SA eligibility without player-specific data, Squad Balance, or hidden Talent weighting.
