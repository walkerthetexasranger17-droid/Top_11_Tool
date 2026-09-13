# Top Eleven Tool v0.4.13

Top Eleven Tool is a mobile-first PWA companion for managing a Top Eleven squad, scanning player cards, planning training, selecting a formation, assigning set pieces and presenting tactics in a simpler form.

`v0.4.13` replaces the scanner visual-reference layer with the approved exact playstyle state pack and the new coloured-only Special Ability reference pack. The old playstyle/level composite indexes and gold Special Ability reference path have been removed. Core training/tactics engines remain unchanged.

## Main navigation

- **Home**
- **Squad** — Add Player / scanner is contextual here.
- **Training**
- **Team Plan** — Formation, Set Pieces and Tactics.
- **Drills**
- **Settings**

**Profile & Security** is contextual and opens from the account button in the header or Settings.

## Account and cloud foundation

Firebase provides:

- Google sign-in.
- Email/password account creation and sign-in.
- Password reset email.
- Per-user Firestore data under `/users/{uid}`.
- Local-first device storage with Firestore background sync between signed-in devices.
- Profile display-name editing.
- Verified email-change and password-change flows with fresh authentication.
- Authenticator-app TOTP as the supported second factor for protected account changes.

There is **no Facebook sign-in, SMS authentication, phone MFA or paid-authentication prompt** in this build.

See [`docs/setup/FIREBASE.md`](docs/setup/FIREBASE.md) for project setup and GitHub hosting notes.

## Scanner

The proven scanner is intentionally preserved. It uses Gemini 3.1 Flash Live with HIGH thinking and separate passes for core data, playstyle identity, playstyle level and Special Abilities. Native phone screenshots are normalised internally and goalkeeper layouts use their own attribute schema.

See [`docs/setup/SCANNER.md`](docs/setup/SCANNER.md).

## Repository layout

```text
/
├─ index.html              PWA application shell
├─ manifest.json           PWA manifest
├─ sw.js                   service worker / runtime precache
├─ firestore.rules         per-user Firestore security rules
├─ START_APP.bat           Windows local launcher
├─ START_APP.ps1           bundled local static server
├─ icon-192.png
├─ icon-512.png
├─ assets/                 app imagery, icons and scanner references
├─ css/                    application styles
├─ data/                   verified Build-30527 data package
├─ js/                     runtime modules and engines
├─ tests/                  deterministic/regression/package tests
└─ docs/
   ├─ setup/               Firebase and scanner setup
   ├─ reference/           canonical technical/game-data reference
   ├─ verification/        current test/compliance records
   ├─ development/         development notes
   ├─ releases/            release history
   └─ archive/             historical v5.x verification material
```

The root is deliberately limited to files needed to run, host or understand the project at a glance.

## Windows local launch

Double-click `START_APP.bat`.

It starts the bundled PowerShell static server and opens the app at `localhost:8000` with a build query so stale PWA HTML is bypassed while testing. Keep the command window open while using the app; press **Ctrl+C** in that window to stop it.

## Validation

From the project root:

```bash
node tests/core-tests.js
node tests/scanner_failover_tests.js
python tests/scanner_regression.py
python tests/scanner_image_contract.py
python tests/navigation_queue_contract.py
python tests/static_checks.py
python tests/package_integrity.py
```

The Firebase end-to-end sign-in/sync path still needs a real browser and the actual Firebase project, so that remains part of the manual GitHub test pass.

## v0.4.11

- Cleaned the repository structure before GitHub testing.
- Consolidated setup documentation under `docs/setup/`.
- Moved release/development/verification/reference material into named documentation folders.
- Removed duplicate obsolete root setup notes carrying the old v5.x version label.
- Added `.gitignore` for local/editor/transient files and secrets.
- Bumped the PWA/local-launch cache marker to v0.4.11.
- **No scanner, training, tactics, formation or game-data engine behaviour was changed by this cleanup.**

### GitHub testing hotfix r4 (still v0.4.11)

- Added a boot visibility barrier so refreshes no longer flash Home before the authenticated route is restored.
- Successful sign-in now intentionally lands on Home instead of reopening Profile & Security.
- Reworked cloud reconciliation so a missing Firestore document is never treated as an implicit deletion. Local same-account records missing from the server are recovered upward instead of erased.
- Cloud deletes now use explicit tombstones, preventing stale/incomplete snapshots from making players disappear.
- Legacy Firestore values stored as objects are normalised back to JSON strings before player parsing.
- Auxiliary startup failures no longer block Squad/Profile from rendering.
- Internal runtime/cache marker is `0.4.11-r4`; the public version remains **v0.4.11**.


## v0.4.12

- Saved scanner entries are removed from the queue immediately after a successful save.
- Formation inputs were simplified: Approach and Drain Limit moved to a Tactic Calculator at the top of Tactics.
- Normal drill levels are account-specific, user-selectable and cloud-synced; new accounts no longer inherit captured screenshot levels.
- Set Pieces now uses dedicated Corner R/L, Free Kick R/L, Penalty 1-5 and Captain slots; only assigned set-piece players appear on the pitch.
- Scanner identity/level recognition, icon assets and mentor recommendation logic were deliberately left unchanged for separate work.
