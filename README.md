# Top Eleven Tool v5.2.8 — Build 30527

Static GitHub Pages/PWA companion app. The implementation contract for this release is `docs/TOP_ELEVEN_TOOL_BIBLE_BUILD_30527_v1.md`. Release compliance is recorded in `docs/BIBLE_COMPLIANCE.md` and the regression matrix in `docs/TEST_MATRIX.md`.

## What changed from v5.2.4

- Current roles are the 12 Build-30527 roles; DML/DMR are preserved only as legacy record metadata.
- Player schema migration is idempotent and preserves existing `te:` records, attributes, images/scanner metadata, drill state, Master stock, full playstyle state, current natural/related roles and all special abilities.
- Playstyle selection is filtered by current natural-role eligibility; Ball Playing GK is not offered.
- Current 19-item special-ability catalogue; no Shadow Striker, no two-ability cap and no invented universal role eligibility matrix.
- Squad adds search and role, age, OVR, playstyle and availability filters.
- Team Plan combines globally optimised Formation, exact 0–1000 pitch geometry, exhaustive Build-30527 tactics/drain search and captured mentor synergy.
- Formation uses target-role white-skill means, Natural/Related eligibility and global XI assignment rather than legacy OVR/adjacency weights.
- Individual Training uses top-three white target + six-slot beam search width 250, with grey utility zero and Master stock respected.
- Team Training uses the actual players in each group and the same per-player white-need/credit model with beam width 250.
- Scanner v2 numeric recognition/reconciliation remains intact; only Bible-required role/data plumbing changed.
- Service worker precaches all 69 required runtime files for this build.

## Test status

Core/deterministic **PASS — 245 assertions**; Scanner v2 **PASS — 12 screenshots / 204 numerical fields**; static/integrity **PASS**; service-worker/package integrity **PASS — 69/69 runtime files**; JavaScript syntax **PASS**.

Browser UI smoke is classified **ENVIRONMENT BLOCKED — NOT APPLICATION FAILURE** because headless Chromium failed to start/terminate correctly in the build environment and produced no application assertion failure. Manual device/browser smoke testing is recommended.

## Important boundary

The tool does not reproduce unresolved private Nordeus formulas. Exact final normal-training gain, hidden match-engine weights, playstyle magnitude, mentor magnitude/signature-array semantics, universal special-ability eligibility, Squad Balance and hidden Talent weighting remain unresolved and are not invented.

## v5.2.8 provenance audit

See `docs/PROVENANCE_AUDIT.md`. This pass did not merely retest the Bible: it compared the runtime against the recovered reverse-engineering trail and corrected the Tackling protocol IDs/order, numeric drain-override interpretation and a formation tie-break deviation.

- Scanner mismatches remain visible but no longer dead-lock Save; manually checked values can be explicitly confirmed and stored with manual-verification provenance.
