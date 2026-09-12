# Top Eleven Tool v0.4.11 — Test Matrix

This is the current release-test record for the GitHub-testing cleanup build.

## Automated release checks

Run from the project root:

```bash
node tests/core-tests.js
node tests/scanner_failover_tests.js
python tests/scanner_regression.py
python tests/scanner_image_contract.py
python tests/navigation_queue_contract.py
python tests/static_checks.py
python tests/package_integrity.py
```

Also run `node --check` against every `js/*.js` file and `sw.js`.

## v0.4.11 result

- Deterministic/core suite: **PASS — 264 assertions**.
- Scanner Live/failover contract: **PASS — 12 assertions**.
- Scanner regression contract: **PASS** — HIGH-thinking Live pipeline, four visual indexes, no benchmark answers.
- Scanner image contract: **PASS** — goalkeeper role colour and Special Ability learning-widget detection.
- Navigation/queue contract: **PASS** — six-screen IA, contextual scanner/profile and 17 queue/navigation hooks.
- Static checks: **PASS — 181 DOM IDs / 9 pages**.
- Service-worker/package integrity: **PASS — 117 precached runtime files / 114 required runtime files**.
- JavaScript syntax: **PASS** for every runtime JS file and `sw.js`.

## Protected-engine check

The following v0.4.11 files are byte-identical to v0.4.10:

- `js/scanner-engine.js`
- `js/training-engine.js`
- `js/tactics-engine.js`
- `js/team-plan-engine.js`
- `js/formation.js`
- `js/data.js`

The scanner-engine SHA-256 remains:

`9a1e8a8da125ea83451ddcdb802d04d908932b16c365690707451e04ee1c3326`

## Manual GitHub/browser smoke checklist

1. Open the hosted build and confirm the visible version is **v0.4.11**.
2. Sign out and confirm the first auth screen shows only **Continue with Google** and **Continue with Email & Password**.
3. Confirm there is no Facebook, phone/SMS MFA, Blaze or paid-authentication UI.
4. Complete Google sign-in and confirm the account loads successfully.
5. Open **Profile & Security** from the top-right account button; on desktop confirm the pointer/hover/tooltip affordance is visible.
6. Confirm cloud-sync status appears and the signed-in user's squad is loaded from their Firestore account.
7. Test email/password sign-in and password reset with a disposable test account.
8. If TOTP is enabled in the Firebase project, enrol an authenticator app and verify protected account-change behaviour.
9. Add or update one player by scan and confirm the proven scanner flow still reaches Review without altered field behaviour.
10. Reload while on Squad, Training, Team Plan and Profile & Security and confirm navigation/state behaviour remains correct.
11. Test the installed PWA after one successful online load and confirm the shell/runtime still opens from cache.

## External-runtime limitation

Real Firebase sign-in, provider redirects/popups, Firestore account creation and cross-device sync require the actual Firebase project and a browser. Offline package tests cannot certify that external round trip, so the GitHub-hosted smoke test is still required before treating the account/cloud work as fully accepted.
