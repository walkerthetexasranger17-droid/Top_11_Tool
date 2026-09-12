# Top Eleven Tool v0.4.11 — Firebase setup

v0.4.11 retains the cloud-account foundation while the repository is prepared for GitHub testing. The application remains a static PWA; Firebase Authentication and Cloud Firestore provide identity and synced account data.

## 1. Create the Firebase project

1. Open Firebase Console and create a new project (for example `Top Eleven Tool`).
2. Google Analytics is optional for this app.
3. The production Firebase Web app/config for **Top Eleven Tool** is already embedded in this build. End users do not paste Firebase configuration.
4. Only replace the embedded config in `js/cloud.js` if intentionally moving the app to a different Firebase project.

The Firebase web config identifies the project; it is not the private server credential. Security comes from Authentication + Firestore Security Rules.

## 2. Authentication providers

Firebase Console → Authentication → Sign-in method:

- Enable **Email/Password**.
- Enable **Google**.

If the app is hosted on GitHub Pages or another custom host, add that host under Authentication → Settings → Authorized domains.

## 3. Firestore

1. Firebase Console → Firestore Database → Create database.
2. Use Production mode.
3. Replace the Firestore rules with the contents of `firestore.rules` from this package and publish them.

Data layout used by the app:

- `/users/{uid}` — account profile metadata
- `/users/{uid}/kv/{keyId}` — synced application records

Rules only allow a signed-in user to access their own `/users/{uid}` tree.

## 4. Two-step authentication (TOTP)

Authenticator-app MFA requires **Firebase Authentication with Identity Platform** and TOTP enabled for the project.

After it is enabled, users can enrol an authenticator from **Profile & Security** in the app. Email verification is required before TOTP enrolment.

## 5. Device behaviour

- Firestore is the source of truth for synced app data.
- The browser keeps a local Firestore/offline cache.
- The Gemini scanner API key remains local to each device and is not synced to Firestore.
- Scanner queue images remain local to the device that created them.

## 6. Current v0.4.11 scope

Cloud-synced namespaces include squad/player data, drill setup, training sessions, mentor levels and team-plan/set-piece data.

Old local player records are not automatically imported into a newly-created cloud account. This is intentional for the cloud-account reset. Players can be rescanned into the cloud-backed squad.

## Free-only second factor

This build supports authenticator-app TOTP as its in-app second factor. Users can enrol an authenticator from **Profile & Security** after verifying their email address.


## Free-only authentication policy

The app intentionally uses Google sign-in, Email/Password and authenticator-app TOTP only. Phone/SMS authentication and phone MFA are not part of this project, and no paid-authentication option should be added to the user interface.
