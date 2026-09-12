# Top Eleven Tool v0.4.11

Top Eleven Tool is a mobile-first PWA companion for managing a Top Eleven squad, scanning player cards, planning training, selecting a formation, assigning set pieces and presenting tactics in a simpler form.

`v0.4.11` is the GitHub-testing cleanup build. It keeps the working `v0.4.10` application behaviour intact while making the repository easier to understand and maintain. Runtime logic was not reorganised simply for appearance: the proven scanner and the training/tactics/formation engines remain in their existing modules.

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
- Cloud sync between signed-in devices with browser/offline caching.
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
