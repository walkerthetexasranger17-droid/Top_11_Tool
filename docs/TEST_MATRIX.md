# Top Eleven Tool v5.2.13 — Build 30527 Test Matrix

Implementation contract: `TOP_ELEVEN_TOOL_BIBLE_BUILD_30527_v1.md`.

## Automated release checks

- `node tests/core-tests.js` — deterministic Build-30527 data, migration, formation, pitch, tactics/drain, mentor, Individual Training, Team Training, specialist and scanner safeguards.
- `python tests/scanner_regression.py` — Scanner v3 offline contract: runtime-discovered stable Flash pool (3.5/3.6/3.7/3.8), no invented 3.4, reference assets, no paid fallback, and David Andrews multi-special-ability fixture.
- `node tests/scanner_failover_tests.js` — temporary overload/rate-limit/daily-quota/request classification, RetryInfo delay parsing and model-pool order.
- `python tests/navigation_queue_contract.py` — swipe-delete, browser/PWA history, refresh state, drawer and persistent scanner queue/retry contract.
- `python tests/static_checks.py` — duplicate IDs, navigation, Team Plan/Training information architecture, DOM references, required UI controls, stale-model removal, scanner save gates, product naming and static asset references.
- `python tests/package_integrity.py` — service-worker runtime precache coverage, manifest name/icons and existence/non-empty checks for every runtime asset.
- `node --check` — every `js/*.js` source file and `sw.js`.
- ZIP CRC test (`unzip -t`) — final packaged archive.

## Bible §23 deterministic acceptance

- Current selectable roles are exactly: GK, DL, DC, DR, DMC, ML, MC, MR, AML, AMC, AMR, ST. DML/DMR are legacy metadata only.
- All 12 confirmed role rectangles match the Bible and generated 0–1000 X/Y values are inside the assigned half-open rectangle.
- Multiple players assigned to the same role are evenly spaced and deterministic.
- All 25 attribute IDs and the 12 current role-key maps match Build 30527.
- Natural and Related roles come from player data; no hand-authored adjacency model is used.
- Formation Role Score is the target-role key-skill mean and OVR is not part of the score.
- The XI is solved globally and one player cannot occupy two slots.
- Current playstyle enum/eligibility is role-aware; Ball Playing GK remains recorded but is not offered.
- Current special abilities are IDs 1..19; Shadow Striker is absent and storage is not capped at two abilities.
- Tactic enum IDs/drain table match the Bible, including Stay On Feet = High contribution and every Cross Tendency option = Low contribution.
- Full drain grid is 97,200 combinations; each fixed mentality search is exactly 19,440 combinations.
- Drain-class checksum is Low 963 / Medium 77,823 / High 18,414; per-mentality counts match the Bible.
- Approach/Drain changes recalculate Tactics → Mentor without rebuilding a valid cached formation.
- Mentor raw effect arrays survive round-trip unchanged; recommendation uses the documented direct-match → useful assigned-role attribute coverage → mentor level → stable order tuple and returns two alternatives.
- Normal drill catalogue count is 29; Master/Campus count is 4; intensity XP/condition and drill-level effect data match Build 30527.
- Individual Training uses natural-role white-skill union, mean(top 3) target, grey utility zero, multi-white accumulated utility, Master stock limits and six-slot beam width 250.
- Team Training uses the actual players included in the selected group, each player's own natural-role white union/need, diminishing credits and six-slot beam width 250.
- Scanner v3 aggregate/OVR checks flag unresolved differences; Gemini-returned values are never rewritten to fabricate agreement.
- v5.2.4 user data migration is idempotent and preserves players, attributes, images/scanner metadata, drill levels/unlocks, Master stock, natural/related role data that remains current, full playstyle state and all abilities.

## Release result

- Deterministic/core suite: **PASS — 254 assertions**.
- Scanner v3 offline contract: **PASS**; optional live Gemini acceptance is covered by `tests/gemini_scanner_live.py` and requires `GEMINI_API_KEY`.
- Static/integrity checks: **PASS — 145 IDs, 9 pages, 135 direct DOM refs, 29 static paths**.
- Service-worker/package integrity: **PASS — 70/70 required runtime files precached**.
- JavaScript syntax (`node --check`): **PASS**.
- Browser UI smoke: **ENVIRONMENT BLOCKED — NOT APPLICATION FAILURE.** Headless Chromium failed to start/terminate correctly in the build environment. No application assertion failure was produced. Manual device/browser smoke testing is recommended after packaging.

## Manual phone smoke checklist

1. Launch/install PWA and confirm name is **Top Eleven Tool** and bottom navigation is Home / Squad / Team Plan / Training / More. Open More and verify the left drawer, outside-tap close, left-swipe close and Android Back close.
2. Navigate Home → Squad → Player and verify Android Back returns Player → Squad → Home without duplicate Back presses.
3. On Squad, vertical-scroll without exposing Delete; deliberately swipe left to reveal Delete; cancel once, then confirm deletion on a disposable player.
4. Refresh from Squad, Player, Training and Scanner and verify the same page/context restores plus the refresh toast.
5. Queue several scanner screenshots; navigate away/back and refresh while queued/waiting; verify queue restore and no duplicate in-flight request.
6. Open Squad: search and filter by role, age, OVR, playstyle and availability; open an existing profile.
7. Edit a multi-role player and confirm roles/related roles, playstyle state and more than two abilities are not silently lost.
8. Scan one known screenshot with an unresolved OVR/aggregate mismatch; confirm Save remains available, shows an explicit manual-verification confirmation, and records manual verification if accepted.
9. Build Team Plan: confirm formation pitch, assigned roles, Natural/Related badges, Role Score, weakest three role-key skills, playstyle fit/level, abilities and bench are shown.
10. Change only Approach/Drain and confirm the XI/pitch remains unchanged while tactics and mentor update.
11. Build Individual Training and confirm six legal slots, multi-white targets and Master stock limits.
12. Open Team Training and confirm the selected group is evaluated from the actual saved players.
13. Reload/offline after first successful online load and confirm the PWA shell/runtime remains available from the service-worker cache.

## Explicit unresolved/non-goals

The release does not invent private Nordeus formulas for exact final training gains, hidden match-engine weighting, playstyle magnitude, mentor magnitude/multi-array semantics, universal role→special-ability eligibility, Squad Balance, or hidden Talent weighting. These are Bible-defined unresolved boundaries, not release failures.
