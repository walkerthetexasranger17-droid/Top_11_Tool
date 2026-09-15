# v0.5.15 Calibration Handoff — Latest Validation Record

This is a **working calibration snapshot**, not a release-frozen v0.5.15.

Primary recovery file:
`CALIBRATION_RECOVERY_HANDOFF_v0.5.15.md`

Latest verified checkpoint before backup packaging:

- Core deterministic suite: PASS — 347 assertions
- Tactics calibration: PASS — 174 assertions
- Live-drain calibration: PASS — 52 assertions
- Formation calibration: PASS — 27 assertions
- Formation assignment calibration: PASS — 4 assertions
- Formation natural fallback: PASS — 4 assertions
- Formation fallback monotonicity: PASS — 5 assertions
- Formation Playstyle calibration: PASS — 3 assertions
- Squad Blueprint calibration: PASS — 21 assertions
- Data completeness calibration: PASS — 10 assertions
- Team Plan completeness: PASS — 5 assertions
- Training matrix: PASS — 40 profiles (12 base + 28 Role+Playstyle)
- Team Training: PASS — 14 assertions
- Set Pieces: PASS — 29 assertions
- Mentors: PASS — 14 assertions
- Stitched pipeline: PASS — 25 assertions
- Stitched monotonicity: PASS — 8 assertions
- Roster-order invariance: PASS — 4 assertions
- Strategy/data contract: PASS — 12 roles, 28 role+Playstyle profiles, 11 formation rules, 56 tactic rules, 143 strings
- Package integrity: PASS — 464 precached runtime files; 461 required runtime files
- Static/cloud/navigation contracts: PASS
- Scanner v12 Live contract: PASS — 11 assertions
- Scanner image + compact-reference + native-resolution contracts: PASS

Latest semantic calibration:

- A Playstyle contributes to Tactics only when active and the player's current assigned role is eligible for that Playstyle.
- Legal Related/Natural assignment is not penalised or invalidated; only the ineligible Playstyle identity contribution becomes zero.
- Declared current Playstyle/active-SA affinity tables are confirmed runtime companion data rather than documentation-only data.
- Exact identity-only duplicate paths are suppressed for Winger→Medium Cross, Sweeper Keeper→Offside, Ball Winner/Stopper→Aggressive Tackling, and Shadow Striker→Shoot on Sight.
- Contextual overlays remain additive where they add extra squad evidence rather than restating identity alone.
- Exact hard-legal post-dedup Playstyle/SA semantic maximum is **74 raw**, mapped to **14 points**. A legal runtime XI reaches 74 and is regression-locked.
- Strategy generation: `companion-strategy-v2-own-squad-runtime-v0515-calibration-4`.
- Tactics generation: `30527-drain-fit-v5-calibrated-v0515-affinity-dedup`.
- Team Plan schema remains v6 with model fingerprinting.
- Shadow Striker remains a current Special Ability; raw/internal `Long Shots` / `LongShots` canonicalises to Shadow Striker.

Important unresolved boundary:
Mixed Medium/High live tactic-drain exchange rate is still unresolved. The runtime uses only categorical option intensity plus the established safe ordering; it does not invent a numeric Medium↔High conversion.

Mandatory workflow from this checkpoint onward:
every development/calibration pass must reserve end-of-session time to refresh the embedded handoff, run relevant regressions, create the entire current-app backup ZIP, extract/verify it, and give that ZIP to the user before the ~25–26 minute working window is exhausted.
