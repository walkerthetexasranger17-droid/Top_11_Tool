# v0.6.7 Design Pass 7 Validation

**State:** UNPUBLISHED / USER REVIEW  
**Scope:** production Settings + Account/Security redesign.  
**Football/scanner decision logic:** unchanged from v0.5.17 / v0.5.15 model fingerprint.

## Checks
- Static DOM/product IA: **PASS** — 230 IDs, 9 pages, six-screen main IA preserved.
- v0.6.7 design contract: **PASS**.
- Cloud hydration/navigation contract: **PASS**.
- Release/runtime/cache identity: **PASS**.
- Package integrity before ZIP: **PASS** — 71 core precache files / 3,532,944 bytes.
- Package cleanliness after duplicate-root-handoff cleanup: **PASS** — 745 files / 25,856,055 bytes.

## Settings / Account checks
- Approved Settings reference embedded: **PASS**.
- Existing Settings scene reused for responsive hero assets: **PASS**.
- Real Gemini key save/test/clear controls retained: **PASS**.
- Scanner status retained; technical detail moved into optional disclosure: **PASS**.
- Real local-first/cloud status retained: **PASS**.
- Clear cloud squad control retained: **PASS**.
- Account profile, linked Google provider, fresh-auth requirements, email/password changes and TOTP enrolment retained: **PASS**.
- No fake subscription/theme/notification settings added: **PASS**.
- Same-design responsive rule + mobile bottom navigation: **PASS**.

## Deterministic regressions
Core **355 PASS**; Tactics **178 PASS**; Formation **27 PASS**; Set Pieces **29 PASS**; Mentor **18 PASS**; stitched pipeline **26 PASS**; SA role eligibility **65 PASS**; Team Training **14 PASS**; Individual Training **7 PASS**; scanner image contract **PASS**; player-update matcher **11 PASS**; Training mode UI **9 PASS**.

Direct byte comparison against v0.5.17-dev-pass11: **0 of 22 checked football/scanner/data contract files changed**.
